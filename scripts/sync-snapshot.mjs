#!/usr/bin/env node
/**
 * sync-snapshot — puxa o snapshot mais recente do Supabase e grava em
 * src/data/site-content.json antes do build.
 *
 * Garante que generateStaticParams() do blog/[slug] e tag/[tag] enxergue
 * posts publicados no admin sem exigir commit manual do JSON.
 *
 * Falhas (sem env, sem rede, sem snapshot) são silenciosas: mantém o JSON
 * commitado como fallback. Build nunca quebra por causa disso.
 */
import fs from 'node:fs';
import path from 'node:path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const TARGET = path.resolve('src/data/site-content.json');

function log(msg) {
  console.log(`[sync-snapshot] ${msg}`);
}

if (!SUPABASE_URL || !ANON_KEY) {
  log('env Supabase ausente — pulando (mantém JSON commitado).');
  process.exit(0);
}

const url = `${SUPABASE_URL}/rest/v1/site_content?select=version,published_at,note,data&order=version.desc&limit=1`;

try {
  const res = await fetch(url, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });
  if (!res.ok) {
    log(`HTTP ${res.status} — mantém JSON commitado.`);
    process.exit(0);
  }
  const arr = await res.json();
  const remote = Array.isArray(arr) ? arr[0] : null;
  if (!remote || !remote.data) {
    log('snapshot remoto vazio — mantém JSON commitado.');
    process.exit(0);
  }

  let localVersion = 0;
  try {
    const local = JSON.parse(fs.readFileSync(TARGET, 'utf8'));
    localVersion = Number(local.version) || 0;
  } catch {
    /* sem arquivo local — segue */
  }

  if (Number(remote.version) <= localVersion) {
    log(`local v${localVersion} >= remoto v${remote.version} — nada a fazer.`);
    process.exit(0);
  }

  const out = {
    version: remote.version,
    publishedAt: remote.published_at,
    note: remote.note || 'Snapshot publicado do painel admin.',
    data: remote.data,
  };
  fs.writeFileSync(TARGET, JSON.stringify(out, null, 2));
  log(`atualizado: v${localVersion} -> v${remote.version}`);
} catch (err) {
  log(`erro: ${err?.message || err} — mantém JSON commitado.`);
  process.exit(0);
}
