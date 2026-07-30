'use client';

import { createClient } from '@supabase/supabase-js';
import { getAuthedClient } from '@/lib/supabase-auth';

/**
 * supabase-site — snapshots de conteúdo do admin publicados no Supabase.
 *
 * Visitantes: pegam o snapshot mais novo (via anon key) e populam localStorage.
 * Admin: publica novos snapshots com a PRÓPRIA SESSÃO (login do admin).
 *
 * ⚠️ Histórico importante: até 2026-07-30 a publicação usava uma service key
 * exposta como NEXT_PUBLIC_SUPABASE_SERVICE_KEY. No Next, NEXT_PUBLIC_* vai
 * para o bundle público — a chave estava servida no JS do site, e ela ignora
 * o RLS, então qualquer visitante tinha acesso total ao banco. Foi removida.
 * Escrita privilegiada agora é sempre com sessão autenticada + RLS.
 *
 * Schema e políticas: setup/site-content-schema.sql
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSiteSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * Publicar deixou de depender de env var e passou a depender de login.
 * Mantido o nome do export para não quebrar quem já importa.
 */
export const isSiteSupabaseWriteConfigured = isSiteSupabaseConfigured;

const publicClient = isSiteSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  : null;

const TABLE = 'site_content';

/**
 * Quanto o site espera pelo Supabase antes de desistir e usar o snapshot que
 * já veio embutido no bundle.
 *
 * Sem esse teto, uma conexão lenta segurava o `await` indefinidamente e o
 * fallback nunca rodava: o visitante ficava com a home sem posts, sem
 * materiais e sem trilhas, mesmo com todo o conteúdo já baixado junto com o
 * JavaScript. Perder a publicação mais recente por alguns minutos é bem menos
 * grave do que servir uma página vazia.
 */
const FETCH_TIMEOUT_MS = 2500;

/**
 * Busca o snapshot mais recente (maior version).
 * Retorna null se Supabase não configurado, se não há snapshot ainda, ou se a
 * resposta demorou demais. Jamais lança — erros viram null pra o bootstrap
 * cair no fallback.
 */
export async function fetchLatestSnapshot() {
  if (!publicClient) return null;

  const query = publicClient
    .from(TABLE)
    .select('version, published_at, note, data')
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ timedOut: true }), FETCH_TIMEOUT_MS);
  });

  try {
    const result = await Promise.race([query, timeout]);
    if (result?.timedOut) {
      console.warn('[supabase-site] snapshot remoto demorou demais; usando o embutido');
      return null;
    }
    const { data, error } = result;
    if (error) {
      console.warn('[supabase-site] fetchLatestSnapshot:', error.message);
      return null;
    }
    return data || null;
  } catch (err) {
    console.warn('[supabase-site] fetchLatestSnapshot threw:', err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Insere um snapshot novo. Requer ADMIN LOGADO (sessão do Supabase Auth).
 * O RLS de `site_content` só aceita insert de `authenticated`.
 * Retorna { ok, version, error }.
 */
export async function publishSnapshot({ data, note }) {
  const client = getAuthedClient();
  if (!client) {
    return { ok: false, error: 'Supabase não configurado neste ambiente.' };
  }

  // Sem sessão, o insert seria recusado pelo RLS com uma mensagem de banco
  // incompreensível. Checar antes permite dizer o que fazer.
  const { data: sessionData } = await client.auth.getSession();
  if (!sessionData?.session) {
    return { ok: false, error: 'Sessão expirada. Faça login de novo para publicar.' };
  }

  const version = Date.now();
  try {
    const { error } = await client
      .from(TABLE)
      .insert({
        version,
        data,
        note: note || null,
      });
    if (error) {
      // 42501 = insufficient_privilege (RLS recusou)
      if (error.code === '42501') {
        return {
          ok: false,
          error: 'O banco recusou a publicação: sua conta não tem permissão de escrita. Rode setup/site-content-schema.sql no Supabase.',
        };
      }
      return { ok: false, error: error.message };
    }
    return { ok: true, version };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  }
}
