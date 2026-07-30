'use client';

import { createClient } from '@supabase/supabase-js';
import { getAuthedClient } from '@/lib/supabase-auth';

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
export async function subscribeToNewsletter(email, source = 'home', consent = null) {
  const trimmed = String(email || '').trim().toLowerCase();
  if (!isValidEmail(trimmed)) {
    return { ok: false, error: 'E-mail inválido.' };
  }
  if (!client) {
    // Supabase não configurado neste ambiente — falha discreta, sem console.error.
    return { ok: false, error: 'not-configured' };
  }

  try {
    // O texto do consentimento vai junto com o registro. A LGPD pede
    // consentimento informado e específico, e exige poder DEMONSTRAR depois a
    // que a pessoa consentiu — guardar só um booleano não prova nada, e se o
    // texto mudar, quem assinou antes fica sem registro do que aceitou.
    const row = { email: trimmed, source };
    if (consent) {
      row.consent_text = consent.text || null;
      row.consent_version = consent.version ?? null;
      row.consent_at = new Date().toISOString();
    }

    const { error } = await client.from(TABLE).insert(row);

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

/* ===================================================================
   ADMIN — leitura e remoção da lista (exige sessão autenticada)

   A anon key insere mas NÃO lê: a policy de SELECT em
   newsletter_subscribers é só para `authenticated` (setup/newsletter.sql).
   Se fosse legível pela anon key, qualquer visitante baixaria a lista
   inteira de e-mails, porque essa chave vai no bundle público.
=================================================================== */

/** Lista os inscritos, do mais recente para o mais antigo. */
export async function fetchSubscribers() {
  const authed = getAuthedClient();
  if (!authed) return { ok: false, error: 'not-configured' };

  const { data: sessionData } = await authed.auth.getSession();
  if (!sessionData?.session) return { ok: false, error: 'unauthenticated' };

  const { data, error } = await authed
    .from(TABLE)
    .select('id, email, source, created_at, consent_at, consent_text, consent_version')
    .order('created_at', { ascending: false });

  if (error) return { ok: false, error: error.message };
  return { ok: true, rows: data || [] };
}

/**
 * Remove um inscrito. Existe porque a LGPD garante ao titular o direito de
 * eliminação dos dados — o pedido de saída tem que ser executável de fato,
 * e apagar é diferente de marcar como inativo.
 */
export async function deleteSubscriber(id) {
  const authed = getAuthedClient();
  if (!authed) return { ok: false, error: 'not-configured' };

  const { data: sessionData } = await authed.auth.getSession();
  if (!sessionData?.session) return { ok: false, error: 'unauthenticated' };

  const { error } = await authed.from(TABLE).delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
