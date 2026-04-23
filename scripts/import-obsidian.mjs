#!/usr/bin/env node
// Import do vault Obsidian → src/data/atlas.json
// Uso: `npm run atlas:sync` (força) ou `npm run build` (via prebuild, gracioso se vault ausente).

import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const VAULT_PATH = 'G:/Meu Drive/Estudos gerais';
const OUT_JSON = path.join(ROOT, 'src/data/atlas.json');
const MEDIA_DIR = path.join(ROOT, 'public/atlas-media');
const BASE_PATH = '/Psiangelo';

const args = new Set(process.argv.slice(2));
const IF_AVAILABLE = args.has('--if-available');

// ─────────────────────────────────────────────────────────────
// 1. Configuração editorial (skiplist, seções)
// ─────────────────────────────────────────────────────────────

// Pastas que nem entram (nem MDs nem imagens)
const SKIP_ALL = ['.trash', '.obsidian', '9 templates'];

// Pastas cujos MDs não publicamos, mas cujas imagens podem ser referenciadas por outras notas
const SKIP_MD_ONLY = [
  '2. Associação Allos/Avaliallos',
  '2. Associação Allos/IDEIAS E DESENVOLVIMENTO - ALLOS',
  '2. Associação Allos/Prática deliberada',
  '7. Faculdade',
  '8. Marketing',
];

const SECTION_MAP = {
  '1. Psicologia Complexa': {
    slug: 'psicologia-complexa',
    label: 'Psicologia Complexa',
    kicker: 'Jung, tipologia, inconsciente, clínica analítica',
    order: 1,
  },
  '2. Associação Allos': {
    slug: 'allos',
    label: 'Associação Allos',
    kicker: 'Escuta, epistemologia, hermenêutica clínica',
    order: 2,
  },
  '3. Psicologia geral': {
    slug: 'psicologia-geral',
    label: 'Psicologia Geral',
    kicker: 'História, abordagens, psicopatologia, personalidade',
    order: 3,
  },
  '4.  Mitologia e humanidades': {
    slug: 'mitologia-humanidades',
    label: 'Mitologia e humanidades',
    kicker: 'Campbell, antropologia, artes',
    order: 4,
  },
  '5. Humanistas e seu guarda-chuva': {
    slug: 'humanistas',
    label: 'Humanistas',
    kicker: 'Sartre e psicologia clínica',
    order: 5,
  },
  '6. TCC e comportamentais': {
    slug: 'tcc-comportamentais',
    label: 'TCC e comportamentais',
    kicker: 'Fundamentos, técnicas, terapia cognitiva',
    order: 6,
  },
  '9 tags': {
    slug: 'conceitos',
    label: 'Conceitos transversais',
    kicker: 'Noções que atravessam todas as seções',
    order: 7,
  },
};

// Pastas internas que sinalizam Tier B (notas de curso/palestra)
const COURSE_PATH_HINTS = ['/4. cursos/', '/5. vídeos e palestras/', '/cursos -', '4. cursos', '5. vídeos'];

// ─────────────────────────────────────────────────────────────
// 2. Utilitários
// ─────────────────────────────────────────────────────────────

function slugify(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanLabel(s) {
  // remove prefixo numérico: "1. ", "10.2 ", "16.1 - ", "0º ", "9 " — sem tocar em "0.1" (sem separador).
  return String(s || '')
    .replace(/^\d+(\.\d+)?[º°ª]?\.?[\s-]+/, '')
    .replace(/^Volume\s+/i, 'Vol. ')
    .trim();
}

function countWords(text) {
  return (text.match(/\S+/g) || []).length;
}

// ─────────────────────────────────────────────────────────────
// 3. Walk do vault
// ─────────────────────────────────────────────────────────────

function walkVault(dir, baseDir, out = { md: [], img: [] }) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.relative(baseDir, full).replace(/\\/g, '/');
    if (SKIP_ALL.some((s) => rel === s || rel.startsWith(s + '/'))) continue;
    if (e.name.startsWith('.')) continue;

    if (e.isDirectory()) {
      walkVault(full, baseDir, out);
    } else if (e.isFile()) {
      const name = e.name;
      const isSkipMd = SKIP_MD_ONLY.some((s) => rel.startsWith(s + '/') || rel === s);
      if (name.toLowerCase().endsWith('.md')) {
        if (isSkipMd) continue;
        if (/^Sem título( \d+)?\.md$/i.test(name)) continue;
        out.md.push({ full, rel, name });
      } else if (/\.(png|jpe?g|gif|webp|svg)$/i.test(name)) {
        out.img.push({ full, rel, name });
      }
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// 4. Detecção de Tier
// ─────────────────────────────────────────────────────────────

function detectTier(text, relPath) {
  const wc = countWords(text);
  // Hubs de conceitos em 9 tags/ podem ser vazios, sempre passam como A
  if (relPath.startsWith('9 tags/')) return 'A';
  if (wc < 30) return 'D';

  const abrevPatterns = [
    /\bn\s+(é|e|era|são|foi|vai|tem|ta)/gi,
    /\bpq\b/gi,
    /\bmto\b/gi,
    /\bmta\b/gi,
    /\bq\s+[a-z]/g,
    /\bvc\b/gi,
    /\btbm\b/gi,
    /\bñ\b/gi,
    /\bkd\b/gi,
    /\bpra q\b/gi,
  ];
  let abrevCount = 0;
  for (const p of abrevPatterns) {
    const m = text.match(p);
    if (m) abrevCount += m.length;
  }
  const abrevRatio = abrevCount / wc;

  const lines = text.split('\n').filter((l) => l.trim().length > 20 && !l.startsWith('#') && !l.startsWith('-'));
  const lowerStart = lines.filter((l) => /^[a-záéíóúâêôãõç]/.test(l.trim())).length;
  const lowerRatio = lines.length > 0 ? lowerStart / lines.length : 0;

  if (abrevRatio > 0.015 && lowerRatio > 0.4) return 'C';
  if (abrevRatio > 0.035) return 'C';
  if (lowerRatio > 0.7 && wc < 400) return 'C';

  const lc = relPath.toLowerCase();
  if (COURSE_PATH_HINTS.some((h) => lc.includes(h))) return 'B';

  return 'A';
}

// ─────────────────────────────────────────────────────────────
// 5. Normalização do texto
// ─────────────────────────────────────────────────────────────

function normalizeText(md) {
  // Remove %% ... %% (multilinha, non-greedy)
  md = md.replace(/%%[\s\S]*?%%/g, '');
  // Remove headings "[Anotações particulares:]" até o próximo heading de mesmo nível ou fim
  md = md.replace(/^#+\s*\[Anotações particulares[^\]]*\]\s*$([\s\S]*?)(?=^#+\s|\n?$)/gim, '');
  // Remove <span style="color:..."> mantém texto interno
  md = md.replace(/<span\s+style="color:[^"]*">([\s\S]*?)<\/span>/gi, '$1');
  // Remove outros inline styles triviais
  md = md.replace(/<span\s+style="[^"]*">([\s\S]*?)<\/span>/gi, '$1');
  // Linhas só com whitespace viram vazias
  md = md.replace(/^[ \t]+$/gm, '');
  // Colapsa 3+ linhas em branco em 2
  md = md.replace(/\n{3,}/g, '\n\n');
  return md.trim();
}

// ─────────────────────────────────────────────────────────────
// 6. Extração de título, tags, wikilinks
// ─────────────────────────────────────────────────────────────

// Título = filename sem extensão (padrão Obsidian). Se o corpo começa com H1 idêntico ao título, remove pra não duplicar.
function extractTitle(md, filename) {
  const title = filename.replace(/\.md$/, '').trim();
  const titleNorm = slugify(title);
  let body = md;
  const m = body.match(/^#\s+(.+)$/m);
  if (m) {
    const h1Norm = slugify(m[1].replace(/\*\*/g, '').trim());
    if (h1Norm === titleNorm) {
      body = body.replace(m[0], '').trimStart();
    }
  }
  return { title, body };
}

function extractTags(md) {
  const tags = new Set();
  // #tag no corpo — exclui #heading e URLs
  const tagMatches = md.match(/(?:^|\s)#([a-zA-ZÀ-ÿ][\wÀ-ÿ-]*)(?=\s|$|[.,;:!?)])/g);
  if (tagMatches) {
    for (const t of tagMatches) {
      const clean = t.trim().slice(1);
      if (clean && !/^\d+$/.test(clean)) tags.add(clean);
      if (tags.size > 20) break;
    }
  }
  return [...tags];
}

function extractWikilinks(md) {
  const links = [];
  // [[target]] ou [[target|alias]] ou [[target#header|alias]]
  const re = /\[\[([^\]|]+?)(?:#([^\]|]+?))?(?:\|([^\]]+?))?\]\]/g;
  let m;
  while ((m = re.exec(md)) !== null) {
    const target = m[1].trim();
    const header = m[2]?.trim();
    const alias = m[3]?.trim();
    links.push({
      target,
      header,
      alias,
      raw: m[0],
    });
  }
  return links;
}

const IMG_EXT_RE = /\.(png|jpe?g|gif|webp|svg)$/i;

function extractImages(md) {
  const imgs = [];
  const re = /!\[\[([^\]]+?)\]\]/g;
  let m;
  while ((m = re.exec(md)) !== null) {
    const target = m[1].trim();
    if (IMG_EXT_RE.test(target)) {
      imgs.push({ name: target, raw: m[0] });
    }
  }
  return imgs;
}

// ─────────────────────────────────────────────────────────────
// 7. Callouts Obsidian → HTML
// ─────────────────────────────────────────────────────────────

function processCallouts(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const calloutStart = line.match(/^>\s*\[!(\w+)\]\s*(.*)$/);
    if (calloutStart) {
      const type = calloutStart[1].toLowerCase();
      const title = calloutStart[2].trim();
      const content = [];
      i++;
      while (i < lines.length && lines[i].startsWith('>')) {
        content.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      const innerMd = content.join('\n').trim();
      const innerHtml = innerMd ? marked.parse(innerMd) : '';
      out.push(
        `<aside class="atlas-callout atlas-callout-${type}">` +
          (title ? `<div class="atlas-callout-title">${escapeHtml(title)}</div>` : '') +
          `<div class="atlas-callout-body">${innerHtml}</div>` +
          `</aside>`
      );
    } else {
      out.push(line);
      i++;
    }
  }
  return out.join('\n');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ─────────────────────────────────────────────────────────────
// 8. Main pipeline
// ─────────────────────────────────────────────────────────────

function main() {
  const startedAt = Date.now();

  if (!fs.existsSync(VAULT_PATH)) {
    if (IF_AVAILABLE) {
      console.log(`[atlas] Vault não acessível (${VAULT_PATH}) — pulando regeneração (modo --if-available).`);
      process.exit(0);
    }
    console.error(`[atlas] ERRO: Vault não encontrado em ${VAULT_PATH}`);
    process.exit(1);
  }

  console.log(`[atlas] Lendo vault: ${VAULT_PATH}`);
  const { md: mdFiles, img: imgFiles } = walkVault(VAULT_PATH, VAULT_PATH);
  console.log(`[atlas] Encontrados ${mdFiles.length} .md e ${imgFiles.length} imagens (pós-skiplist)`);

  // Índice de imagens: nome → path completo
  const imgIndex = new Map();
  for (const img of imgFiles) {
    imgIndex.set(img.name, img);
    imgIndex.set(img.name.toLowerCase(), img);
  }

  // ─── Passo 1: ler, classificar, extrair metadata ───
  const notes = [];
  const tierCount = { A: 0, B: 0, C: 0, D: 0 };

  for (const f of mdFiles) {
    const raw = fs.readFileSync(f.full, 'utf8');
    const normalized = normalizeText(raw);
    const tier = detectTier(normalized, f.rel);
    tierCount[tier]++;

    if (tier === 'C' || tier === 'D') continue;

    const segments = f.rel.split('/');
    const topFolder = segments[0];
    const section = SECTION_MAP[topFolder];
    if (!section) {
      console.warn(`[atlas] Sem mapeamento de seção para: ${topFolder} (${f.rel})`);
      continue;
    }

    const { title, body } = extractTitle(normalized, f.name);
    if (!title) continue;
    // Permitimos notas curtas (até vazias) em "Conceitos transversais" pois funcionam como hubs de backlinks
    if (section.slug !== 'conceitos' && body.length < 100) continue;

    const tags = extractTags(body);
    const wikilinks = extractWikilinks(body);
    const images = extractImages(body);
    const wc = countWords(body);
    const readingMinutes = Math.max(1, Math.round(wc / 220));

    // Breadcrumb path (entre section e arquivo)
    const subpath = segments.slice(1, -1).map((s) => ({ raw: s, clean: cleanLabel(s) }));

    notes.push({
      relPath: f.rel,
      tier,
      section: section.slug,
      sectionLabel: section.label,
      topFolder,
      subpath,
      title,
      body,
      tags,
      wikilinks,
      images,
      wordCount: wc,
      readingMinutes,
    });
  }

  console.log(`[atlas] Tiers: A=${tierCount.A}  B=${tierCount.B}  C=${tierCount.C}(pulado)  D=${tierCount.D}(pulado)`);
  console.log(`[atlas] Publicáveis: ${notes.length}`);

  // ─── Passo 2: build slug index com desambiguação ───
  const slugIndex = new Map(); // title-normalized → slug
  const usedSlugs = new Set();

  for (const n of notes) {
    let base = slugify(n.title);
    if (!base) base = 'nota-sem-titulo-' + usedSlugs.size;
    let slug = base;
    let i = 2;
    while (usedSlugs.has(`${n.section}/${slug}`)) {
      slug = `${base}-${i}`;
      i++;
    }
    n.slug = slug;
    usedSlugs.add(`${n.section}/${slug}`);

    // índice por título normalizado (pra resolver wikilinks)
    const titleKey = slugify(n.title);
    if (!slugIndex.has(titleKey)) {
      slugIndex.set(titleKey, { section: n.section, slug: n.slug, title: n.title });
    }
  }

  // ─── Passo 3: copiar imagens usadas ───
  if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });
  const usedMedia = new Map(); // nome original → novo nome slug
  const missingImages = [];

  for (const n of notes) {
    for (const img of n.images) {
      const name = img.name;
      const found = imgIndex.get(name) || imgIndex.get(name.toLowerCase());
      if (!found) {
        missingImages.push(`${n.relPath}: ${name}`);
        continue;
      }
      const ext = path.extname(name);
      const base = slugify(path.basename(name, ext));
      const outName = `${base || 'img'}${ext.toLowerCase()}`;
      if (!usedMedia.has(name)) {
        try {
          fs.copyFileSync(found.full, path.join(MEDIA_DIR, outName));
          usedMedia.set(name, outName);
        } catch (e) {
          console.warn(`[atlas] Falha copiando ${name}: ${e.message}`);
        }
      }
    }
  }
  console.log(`[atlas] Imagens copiadas: ${usedMedia.size}  ausentes: ${missingImages.length}`);

  // ─── Passo 4: render body → HTML (substituindo wikilinks/imagens/callouts antes) ───
  for (const n of notes) {
    let body = n.body;

    // 4.1 Substitui ![[x]] — se extensão de imagem, <img>. Senão (transclude de nota), link pra nota ou texto neutro.
    body = body.replace(/!\[\[([^\]]+?)\]\]/g, (_, raw) => {
      const target = raw.trim();
      if (IMG_EXT_RE.test(target)) {
        const outName = usedMedia.get(target);
        if (!outName) return `<em class="atlas-image-missing">[imagem ausente: ${escapeHtml(target)}]</em>`;
        const altBase = path.basename(target, path.extname(target));
        return `<img src="${BASE_PATH}/atlas-media/${outName}" alt="${escapeHtml(altBase)}" class="atlas-image" loading="lazy">`;
      }
      // Transclude de nota (ex: ![[Nota#secao]]) — convertemos em link simples
      const noteRef = target.split('#')[0].trim();
      const aliasClean = target;
      const key = slugify(noteRef);
      const resolved = slugIndex.get(key);
      if (resolved) {
        return `<a href="${BASE_PATH}/atlas/${resolved.section}/${resolved.slug}" class="atlas-link atlas-transclude">↳ ${escapeHtml(resolved.title)}</a>`;
      }
      return `<span class="atlas-link-broken">${escapeHtml(aliasClean)}</span>`;
    });

    // 4.2 Substitui wikilinks [[target]], [[target|alias]], [[target#header|alias]]
    body = body.replace(/\[\[([^\]|]+?)(?:#([^\]|]+?))?(?:\|([^\]]+?))?\]\]/g, (_, target, header, alias) => {
      const targetClean = target.trim();
      const aliasClean = (alias || targetClean).trim();
      const key = slugify(targetClean);
      const resolved = slugIndex.get(key);
      if (resolved) {
        const hash = header ? `#${slugify(header)}` : '';
        return `<a href="${BASE_PATH}/atlas/${resolved.section}/${resolved.slug}${hash}" class="atlas-link">${escapeHtml(aliasClean)}</a>`;
      }
      // tag-like ou conceito não-mapeado → span neutro
      return `<span class="atlas-link-broken" title="Sem página — ${escapeHtml(targetClean)}">${escapeHtml(aliasClean)}</span>`;
    });

    // 4.3 Remove tags inline (#tag) do texto (coletadas em extractTags)
    body = body.replace(/(^|\s)#([a-zA-ZÀ-ÿ][\wÀ-ÿ-]*)(?=\s|$|[.,;:!?)])/g, (m, pre, tag) => {
      if (/^\d+$/.test(tag)) return m;
      return `${pre}<span class="atlas-tag-inline">#${escapeHtml(tag)}</span>`;
    });

    // 4.4 Callouts Obsidian
    body = processCallouts(body);

    // 4.5 Render final
    marked.use({
      gfm: true,
      breaks: false,
      renderer: {
        heading({ tokens, depth }) {
          const text = this.parser.parseInline(tokens);
          const id = slugify(text.replace(/<[^>]+>/g, ''));
          return `<h${depth} id="${id}">${text}</h${depth}>\n`;
        },
      },
    });
    const html = marked.parse(body);

    // Extrai TOC (h2/h3)
    const toc = [];
    const tocRe = /<h([23])\s+id="([^"]+)">([\s\S]*?)<\/h\1>/g;
    let tm;
    while ((tm = tocRe.exec(html)) !== null) {
      toc.push({
        level: parseInt(tm[1], 10),
        id: tm[2],
        text: tm[3].replace(/<[^>]+>/g, ''),
      });
    }

    n.html = html;
    n.toc = toc;
  }

  // ─── Passo 5: backlinks ───
  const backlinks = new Map(); // `${section}/${slug}` → array
  for (const n of notes) {
    for (const link of n.wikilinks) {
      const key = slugify(link.target);
      const resolved = slugIndex.get(key);
      if (!resolved) continue;
      const resolvedKey = `${resolved.section}/${resolved.slug}`;
      if (`${n.section}/${n.slug}` === resolvedKey) continue;
      if (!backlinks.has(resolvedKey)) backlinks.set(resolvedKey, []);
      const list = backlinks.get(resolvedKey);
      if (!list.find((b) => b.section === n.section && b.slug === n.slug)) {
        list.push({ section: n.section, slug: n.slug, title: n.title });
      }
    }
  }

  // ─── Passo 6: agregar tags ───
  const tagIndex = new Map();
  for (const n of notes) {
    for (const tag of n.tags) {
      const key = slugify(tag);
      if (!key) continue;
      if (!tagIndex.has(key)) tagIndex.set(key, { slug: key, label: tag, notes: [] });
      tagIndex.get(key).notes.push({ section: n.section, slug: n.slug, title: n.title });
    }
  }
  // Ordenar tags por # de notas desc, alfabético
  const tags = [...tagIndex.values()]
    .filter((t) => t.notes.length >= 2)
    .sort((a, b) => b.notes.length - a.notes.length || a.label.localeCompare(b.label));

  // ─── Passo 7: emitir atlas.json ───
  const sections = Object.values(SECTION_MAP)
    .map((s) => ({
      ...s,
      count: notes.filter((n) => n.section === s.slug).length,
    }))
    .filter((s) => s.count > 0)
    .sort((a, b) => a.order - b.order);

  const payload = {
    generatedAt: new Date().toISOString(),
    vaultPath: VAULT_PATH,
    stats: {
      totalFiles: mdFiles.length,
      published: notes.length,
      skippedTierC: tierCount.C,
      skippedTierD: tierCount.D,
      imagesCopied: usedMedia.size,
      imagesMissing: missingImages.length,
      tagCount: tags.length,
    },
    sections,
    notes: notes.map((n) => ({
      section: n.section,
      slug: n.slug,
      title: n.title,
      tier: n.tier,
      subpath: n.subpath,
      topFolder: n.topFolder,
      tags: n.tags,
      wordCount: n.wordCount,
      readingMinutes: n.readingMinutes,
      html: n.html,
      toc: n.toc,
      backlinks: backlinks.get(`${n.section}/${n.slug}`) || [],
      wikilinksOut: n.wikilinks
        .map((l) => {
          const r = slugIndex.get(slugify(l.target));
          return r ? { section: r.section, slug: r.slug, title: r.title } : null;
        })
        .filter(Boolean)
        .filter((v, i, a) => a.findIndex((x) => x.section === v.section && x.slug === v.slug) === i),
    })),
    tags,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');
  const elapsedMs = Date.now() - startedAt;
  console.log(`[atlas] Gerado ${OUT_JSON} (${(fs.statSync(OUT_JSON).size / 1024).toFixed(1)} KB) em ${elapsedMs}ms`);

  if (missingImages.length && missingImages.length < 20) {
    console.log(`[atlas] Imagens ausentes (mostrando até 20):`);
    missingImages.slice(0, 20).forEach((x) => console.log(`  - ${x}`));
  }
}

main();
