// Helpers pra ler e manipular o Atlas (notas do vault Obsidian).
// Fonte de verdade: src/data/atlas.json (gerado por scripts/import-obsidian.mjs).

import atlas from '@/data/atlas.json';

export const atlasStats = atlas.stats;
export const atlasSections = atlas.sections;
export const atlasNotes = atlas.notes;
export const atlasTags = atlas.tags;
export const atlasGeneratedAt = atlas.generatedAt;

// Mapa section/slug → nota pra lookup O(1)
const byKey = new Map(atlas.notes.map((n) => [`${n.section}/${n.slug}`, n]));
const byTitleNorm = new Map();
for (const n of atlas.notes) {
  const k = slugify(n.title);
  if (!byTitleNorm.has(k)) byTitleNorm.set(k, n);
}

export function getNote(section, slug) {
  return byKey.get(`${section}/${slug}`);
}

export function getNoteByTitle(title) {
  return byTitleNorm.get(slugify(title));
}

export function getSection(slug) {
  return atlas.sections.find((s) => s.slug === slug);
}

export function getNotesBySection(slug) {
  return atlas.notes
    .filter((n) => n.section === slug)
    .sort((a, b) => a.title.localeCompare(b.title, 'pt'));
}

export function getNotesBySectionGrouped(slug) {
  // Agrupa por primeiro segmento do subpath (subcategoria)
  const notes = getNotesBySection(slug);
  const groups = new Map();
  for (const n of notes) {
    const groupLabel = n.subpath?.[0]?.clean || '—';
    if (!groups.has(groupLabel)) groups.set(groupLabel, []);
    groups.get(groupLabel).push(n);
  }
  return [...groups.entries()].map(([label, notes]) => ({ label, notes }));
}

// Constrói árvore hierárquica (pastas → pastas → notas) a partir do subpath.
// Usado em /atlas/[secao] para refletir a estrutura do vault Obsidian.
export function getSectionTree(slug) {
  const notes = getNotesBySection(slug);

  const natural = (s) => String(s || '').replace(/\d+/g, (d) => d.padStart(8, '0'));
  const root = { type: 'root', children: new Map(), notes: [] };

  for (const n of notes) {
    let cursor = root;
    for (const seg of n.subpath || []) {
      const key = seg.raw;
      if (!cursor.children.has(key)) {
        cursor.children.set(key, {
          type: 'folder',
          label: seg.clean || seg.raw,
          raw: seg.raw,
          children: new Map(),
          notes: [],
        });
      }
      cursor = cursor.children.get(key);
    }
    cursor.notes.push(n);
  }

  // Converte Map → array, recursivo, ordenado naturalmente pelo raw
  function toArray(node) {
    const folders = [...node.children.values()]
      .map(toArray)
      .sort((a, b) => natural(a.raw).localeCompare(natural(b.raw), 'pt'));
    const notes = [...node.notes].sort((a, b) =>
      natural(a.title).localeCompare(natural(b.title), 'pt')
    );
    const totalNotes =
      notes.length + folders.reduce((acc, f) => acc + f.totalNotes, 0);
    return { ...node, children: folders, notes, totalNotes };
  }

  return toArray(root);
}

export function getTag(slug) {
  return atlas.tags.find((t) => t.slug === slug);
}

// Notas destaque: Tier A, ≥500 palavras, com tags ou backlinks altos
export function getFeaturedNotes(limit = 12) {
  return [...atlas.notes]
    .filter((n) => n.tier === 'A' && n.wordCount >= 500)
    .sort((a, b) => (b.backlinks?.length || 0) - (a.backlinks?.length || 0) || b.wordCount - a.wordCount)
    .slice(0, limit);
}

// Para o índice alfabético
export function getAllNotesAlpha() {
  return [...atlas.notes].sort((a, b) => a.title.localeCompare(b.title, 'pt'));
}

// Formata breadcrumb a partir de subpath + section
export function formatBreadcrumb(note) {
  const section = getSection(note.section);
  const crumbs = [{ label: section?.label || note.section, href: `/atlas/${note.section}` }];
  for (const s of note.subpath || []) {
    crumbs.push({ label: s.clean, href: null });
  }
  return crumbs;
}

function slugify(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Gera nodes + edges para o grafo de conexões.
// Edges são a união (undirected) dos wikilinksOut de cada nota.
export function getGraphData() {
  const nodes = atlas.notes.map((n) => ({
    id: `${n.section}/${n.slug}`,
    title: n.title,
    section: n.section,
    slug: n.slug,
    degree: (n.backlinks?.length || 0) + (n.wikilinksOut?.length || 0),
  }));

  const edgeSet = new Set();
  const links = [];
  for (const n of atlas.notes) {
    const src = `${n.section}/${n.slug}`;
    for (const l of n.wikilinksOut || []) {
      const tgt = `${l.section}/${l.slug}`;
      if (src === tgt) continue;
      const key = [src, tgt].sort().join('::');
      if (edgeSet.has(key)) continue;
      edgeSet.add(key);
      links.push({ source: src, target: tgt });
    }
  }

  const sectionLabels = Object.fromEntries(atlas.sections.map((s) => [s.slug, s.label]));

  return { nodes, links, sectionLabels };
}
