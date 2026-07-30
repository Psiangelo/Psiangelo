'use client';

/**
 * contentBootstrap — popula o localStorage do visitante com o snapshot
 * publicado pelo admin.
 *
 * Ordem de fontes:
 *   1. Supabase (site_content) — se configurado, publicação instantânea
 *   2. src/data/site-content.json — fallback pra quando Supabase não
 *      está configurado ou está offline
 *
 * Só aplica se a versão remota for mais nova que a última já aplicada
 * (evita sobrescrever o localStorage do visitante a cada F5).
 */

import snapshotLocal from '@/data/site-content.json';
import { fetchLatestSnapshot, isSiteSupabaseConfigured } from '@/lib/supabase-site';
import { markSynced } from '@/lib/unpublishedChanges';

const VERSION_KEY = 'angelo_admin_content_version';

function readLastApplied() {
  try {
    return Number(localStorage.getItem(VERSION_KEY)) || 0;
  } catch {
    return 0;
  }
}

function applySnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return false;
  const version = Number(snapshot.version) || 0;
  if (version <= 0) return false;

  const lastApplied = readLastApplied();
  if (version <= lastApplied) return false;

  const data = snapshot.data || {};
  for (const key of Object.keys(data)) {
    try {
      localStorage.setItem(key, JSON.stringify(data[key]));
    } catch {
      /* quota cheia — pula essa chave, continua as outras */
    }
  }

  // Acabou de sobrescrever o localStorage com um snapshot que já está no ar
  // (publicado ou deployado): não há mudança pendente nenhuma. Sem esse
  // carimbo, o banner do admin acusa "mudanças não publicadas" em qualquer
  // navegador que ainda não tenha publicado por ali.
  try {
    markSynced(snapshot.published_at || version);
  } catch {
    /* noop */
  }

  try {
    localStorage.setItem(VERSION_KEY, String(version));
  } catch {
    /* noop */
  }

  try {
    window.dispatchEvent(new CustomEvent('sitedata:bootstrap', { detail: { version } }));
  } catch {
    /* noop */
  }
  return true;
}

export async function applyPublishedSnapshot() {
  if (typeof window === 'undefined') return;

  // 1. O snapshot do BUNDLE primeiro.
  //
  // ⚠️ A ordem importa e já causou bug (2026-07-30): antes o remoto vinha
  // primeiro e era aceito por ser mais novo que o `lastApplied` do
  // navegador — que num visitante novo é 0. Resultado: uma publicação
  // ANTIGA do Supabase sobrescrevia o conteúdo do build recém-deployado, e
  // todo texto novo era revertido no navegador do visitante, sem erro
  // nenhum aparecendo.
  //
  // Aplicando o local antes, ele carimba a versão do build. Aí o remoto só
  // entra se for posterior ao build, que é exatamente quando ele deve
  // ganhar: uma publicação feita pelo admin DEPOIS do último deploy.
  applySnapshot(snapshotLocal);

  // 2. Supabase (se configurado) — publicação instantânea, posterior ao build
  if (isSiteSupabaseConfigured) {
    try {
      const remote = await fetchLatestSnapshot();
      if (remote) applySnapshot(remote);
    } catch {
      /* fica com o do bundle, que já foi aplicado */
    }
  }
}
