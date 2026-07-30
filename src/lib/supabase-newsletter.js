import { createClient } from '@supabase/supabase-js';

/**
 * supabase-newsletter — captura de e-mail via Supabase (tabela `newsletter_subscribers`).
 *
 * Mesmo padrão de cliente que supabase-site.js: usa a anon key (pública, já
 * embutida no bundle estático), sem service key. A tabela e as políticas RLS
 * vivem em setup/newsletter.sql (rodar uma vez no painel do Supabase).
 *
 * Se as env vars não estiverem configuradas, ou a tabela ainda não existir,
 * subscribeToNewsletter falha em silêncio (retorna { ok: false }) — nunca
 * lança, e nunca solta erro cru no console do visitante.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isNewsletterConfigured = !!(supabaseUrl && supabaseAnonKey);

const client = isNewsletterConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  : null;

const TABLE = 'newsletter_subscribers';

// Código do Postgres para violação de unicidade (e-mail já cadastrado).
const UNIQUE_VIOLATION = '23505';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

/**
 * subscribeToNewsletter — insere um e-mail novo na lista.
 *
 * Retorna sempre { ok, alreadySubscribed, error }. Duplicado é tratado como
 * sucesso silencioso (alreadySubscribed: true) — quem já está inscrito não
 * deve ver mensagem de erro, e o app nunca expõe o erro cru do banco.
 */
export async function subscribeToNewsletter(email, source = 'home') {
  const trimmed = String(email || '').trim().toLowerCase();
  if (!isValidEmail(trimmed)) {
    return { ok: false, error: 'E-mail inválido.' };
  }
  if (!client) {
    // Supabase não configurado neste ambiente — falha discreta, sem console.error.
    return { ok: false, error: 'not-configured' };
  }

  try {
    const { error } = await client
      .from(TABLE)
      .insert({ email: trimmed, source });

    if (error) {
      if (error.code === UNIQUE_VIOLATION) {
        return { ok: true, alreadySubscribed: true };
      }
      // Tabela ainda não criada, RLS bloqueando, etc — falha discreta.
      return { ok: false, error: 'unavailable' };
    }
    return { ok: true, alreadySubscribed: false };
  } catch {
    return { ok: false, error: 'unavailable' };
  }
}
