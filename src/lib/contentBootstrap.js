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

  // 1. Supabase (se configurado) — publicação instantânea
  if (isSiteSupabaseConfigured) {
    try {
      const remote = await fetchLatestSnapshot();
      if (remote && applySnapshot(remote)) return;
    } catch {
      /* cai pro fallback */
    }
  }

  // 2. Fallback — snapshot commitado no repo
  applySnapshot(snapshotLocal);
}
