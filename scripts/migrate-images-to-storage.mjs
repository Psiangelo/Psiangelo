#!/usr/bin/env node
/**
 * migrate-images-to-storage — one-shot.
 *
 * Percorre os posts do blog no snapshot mais recente de `site_content`,
 * encontra data URIs (base64) em `featured_image` e `featured_cover`,
 * faz upload pro bucket 'blog-images' no Supabase Storage e substitui
 * pelas URLs públicas. No fim, publica um novo snapshot (incrementa
 * version) — o ContentBootstrap dos visitantes pega na próxima visita.
 *
 * Pré-requisito:
 *   1. Criar bucket 'blog-images' PÚBLICO no Supabase Studio (Storage → New bucket)
 *   2. Env vars definidas em .env.local:
 *        NEXT_PUBLIC_SUPABASE_URL
 *        NEXT_PUBLIC_SUPABASE_SERVICE_KEY
 *
 * Uso:
 *   node --env-file=.env.local scripts/migrate-images-to-storage.mjs
 *
 * É idempotente: rodar de novo só migra imagens que ainda são data URIs.
 */

import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;
const BUCKET = 'blog-images';

if (!URL || !SERVICE) {
  console.error('Env faltando: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_SERVICE_KEY');
  console.error('Rode com: node --env-file=.env.local scripts/migrate-images-to-storage.mjs');
  process.exit(1);
}

const c = createClient(URL, SERVICE, { auth: { persistSession: false } });

function parseDataUri(s) {
  const m = /^data:([^;]+);base64,(.*)$/.exec(s || '');
  if (!m) return null;
  const [, mime, b64] = m;
  const ext =
    {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/webp': 'webp',
      'image/gif': 'gif',
    }[mime] || 'bin';
  return { mime, ext, buf: Buffer.from(b64, 'base64') };
}

async function uploadAndReplace(slug, kind, value) {
  const parsed = parseDataUri(value);
  if (!parsed) return { value, changed: false }; // já é URL ou path local
  const path = `${slug}/${kind}.${parsed.ext}`;
  const { error } = await c.storage.from(BUCKET).upload(path, parsed.buf, {
    contentType: parsed.mime,
    upsert: true,
  });
  if (error) {
    console.warn(`  ✗ ${kind}: ${error.message}`);
    return { value, changed: false };
  }
  const { data } = c.storage.from(BUCKET).getPublicUrl(path);
  const kb = Math.round(parsed.buf.length / 1024);
  console.log(`  ✓ ${kind} -> ${data.publicUrl} (${kb} KB)`);
  return { value: data.publicUrl, changed: true };
}

async function main() {
  console.log('> Lendo snapshot mais recente de site_content...');
  const { data: snap, error } = await c
    .from('site_content')
    .select('version, data')
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !snap) throw new Error('Snapshot não encontrado: ' + error?.message);

  const posts = snap.data?.angelo_admin_blog;
  if (!Array.isArray(posts)) {
    console.log('Nenhum post encontrado no snapshot — nada a fazer.');
    return;
  }

  let migrated = 0;
  for (const post of posts) {
    const slug = post.slug || post.id;
    if (!slug) continue;
    console.log(`\n[${slug}]`);

    if (post.featured_image) {
      const r = await uploadAndReplace(slug, 'featured', post.featured_image);
      if (r.changed) { post.featured_image = r.value; migrated++; }
    }
    if (post.featured_cover) {
      const r = await uploadAndReplace(slug, 'cover', post.featured_cover);
      if (r.changed) { post.featured_cover = r.value; migrated++; }
    }
  }

  if (migrated === 0) {
    console.log('\nNada para migrar. Snapshot já está limpo.');
    return;
  }

  console.log(`\n> ${migrated} imagens migradas. Publicando novo snapshot...`);
  const newVersion = Date.now();
  const { error: insErr } = await c.from('site_content').insert({
    version: newVersion,
    data: snap.data,
    note: 'migrate-images-to-storage',
  });
  if (insErr) throw insErr;
  console.log(`✓ Novo snapshot publicado: version ${newVersion}`);
  console.log('\nPróximos passos:');
  console.log('  1. Sincronize src/data/site-content.json (node inline script ou admin)');
  console.log('  2. Re-rode o build — OG images agora vão fetchar as URLs remotas');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
