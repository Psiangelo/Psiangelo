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

const client = isAuthConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'angelo_admin_auth_supabase',
      },
    })
  : null;

export async function signIn(email, password) {
  if (!client) return { ok: false, error: 'Supabase Auth não configurado' };
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, session: data.session, user: data.user };
}

export async function signOut() {
  if (!client) return { ok: false };
  await client.auth.signOut();
  return { ok: true };
}

export async function getSession() {
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session || null;
}

export function onAuthChange(cb) {
  if (!client) return () => {};
  const { data } = client.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
}
