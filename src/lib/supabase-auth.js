'use client';

import { createClient } from '@supabase/supabase-js';

/**
 * supabase-auth — autenticação do admin via Supabase Auth.
 *
 * Ativa quando NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão
 * configurados. Sessão persistida em localStorage (padrão da lib).
 *
 * No Supabase, criar o usuário manualmente no dashboard (Authentication → Users),
 * ou permitir signup se preferir.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isAuthConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * Client PREGUIÇOSO: só nasce quando alguém de fato precisa dele.
 *
 * ⚠️ Não voltar a criar no topo do módulo. Ele liga `autoRefreshToken`, e
 * desde que `supabase-site.js` passou a importar este módulo (para publicar
 * com a sessão em vez da service key), o simples import começou a instanciar
 * o client em TODA página do site público — o `contentBootstrap` roda em
 * todas. Resultado: visitante sem login recebia
 * `AuthApiError: Invalid Refresh Token: Already Used`, e em algumas páginas
 * isso estourava como "Application error: a client-side exception has
 * occurred" (bug de 30/07/2026, 36 de 49 rotas afetadas).
 *
 * Criando sob demanda, o visitante nunca instancia nada: só o admin, que é
 * quem chama signIn/getSession/getAuthedClient.
 */
let _client;

function getClient() {
  if (!isAuthConfigured) return null;
  if (typeof window === 'undefined') return null;
  if (_client === undefined) {
    _client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'angelo_admin_auth_supabase',
      },
    });
  }
  return _client;
}

export async function signIn(email, password) {
  const client = getClient();
  if (!client) return { ok: false, error: 'Supabase Auth não configurado' };
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, session: data.session, user: data.user };
}

export async function signOut() {
  const client = getClient();
  if (!client) return { ok: false };
  await client.auth.signOut();
  return { ok: true };
}

export async function getSession() {
  const client = getClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session || null;
}

export function onAuthChange(cb) {
  const client = getClient();
  if (!client) return () => {};
  const { data } = client.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
}

/**
 * getAuthedClient — o MESMO client que carrega a sessão do admin logado.
 *
 * É por aqui que toda escrita privilegiada passa (publicar snapshot, ler a
 * lista de inscritos). O client manda o JWT do usuário logado em cada
 * requisição, então o RLS do Postgres decide o que ele pode fazer.
 *
 * Antes disso o site usava uma service key exposta como NEXT_PUBLIC_*, o que
 * a publicava no bundle e dava a qualquer visitante acesso total ao banco,
 * ignorando o RLS. Não reintroduzir: escrita privilegiada é com sessão.
 */
export function getAuthedClient() {
  return getClient();
}
