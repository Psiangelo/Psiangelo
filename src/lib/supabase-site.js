import { createClient } from '@supabase/supabase-js';

/**
 * supabase-site — snapshots de conteúdo do admin publicados no Supabase.
 *
 * Visitantes: pegam o snapshot mais novo (via anon key) e populam localStorage.
 * Admin: publica novos snapshots (via service key) em 1 clique.
 *
 * Schema: setup/site-content-schema.sql
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || '';

export const isSiteSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
export const isSiteSupabaseWriteConfigured = !!(supabaseUrl && supabaseServiceKey);

const publicClient = isSiteSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  : null;

const adminClient = isSiteSupabaseWriteConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
  : null;

const TABLE = 'site_content';

/**
 * Busca o snapshot mais recente (maior version).
 * Retorna null se Supabase não configurado ou se não há snapshot ainda.
 * Jamais lança — erros viram null pra o bootstrap cair no fallback.
 */
export async function fetchLatestSnapshot() {
  if (!publicClient) return null;
  try {
    const { data, error } = await publicClient
      .from(TABLE)
      .select('version, published_at, note, data')
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.warn('[supabase-site] fetchLatestSnapshot:', error.message);
      return null;
    }
    return data || null;
  } catch (err) {
    console.warn('[supabase-site] fetchLatestSnapshot threw:', err);
    return null;
  }
}

/**
 * Insere um snapshot novo. Requer service key.
 * Retorna { ok, version, error }.
 */
export async function publishSnapshot({ data, note }) {
  if (!adminClient) {
    return { ok: false, error: 'Supabase service key não configurada (NEXT_PUBLIC_SUPABASE_SERVICE_KEY)' };
  }
  const version = Date.now();
  try {
    const { error } = await adminClient
      .from(TABLE)
      .insert({
        version,
        data,
        note: note || null,
      });
    if (error) return { ok: false, error: error.message };
    return { ok: true, version };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  }
}
