import siteContent from '@/data/site-content.json';
import { glossario } from '@/data/glossario';
import { trilhas as TRILHAS_DEFAULT } from '@/data/trilhas';

const BASE = 'https://psiangelo.github.io/Psiangelo';

function getPublishedPosts() {
  const posts = siteContent?.data?.angelo_admin_blog;
  if (!Array.isArray(posts)) return [];
  return posts.filter((p) => p && (p.slug || p.id) && (!p.status || p.status === 'published'));
}

// Mesma lógica de src/app/estudos/[trilha]/page.js: as trilhas realmente
// publicadas vêm do snapshot (angelo_admin_trilhas), com fallback pro
// default hardcoded em src/data/trilhas.js — e a rota usa slug||id.
function getTrilhas() {
  const stored = siteContent?.data?.angelo_admin_trilhas;
  return Array.isArray(stored) && stored.length > 0 ? stored : TRILHAS_DEFAULT;
}

function slugifyTag(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getUniqueTags() {
  const seen = new Set();
  for (const p of getPublishedPosts()) {
    for (const t of p.tags || []) {
      const slug = slugifyTag(t);
      if (slug) seen.add(slug);
    }
  }
  return Array.from(seen);
}

function toAbsolute(path, priority, changeFrequency, lastModified) {
  // trailingSlash:true no next.config — URL canônica sempre termina em /
  const normalized = path === '' ? '/' : path.endsWith('/') ? path : `${path}/`;
  return {
    url: `${BASE}${normalized}`,
    lastModified: lastModified || new Date(),
    changeFrequency,
    priority,
  };
}

export default function sitemap() {
  // Reposicionamento 2026-07: o site deixou de ser "consultório com blog" e
  // virou "um blog com um autor" — a psicoterapia está oculta enquanto o
  // Ângelo não tem CRP, então as rotas /psicoterapia-analitica e /atendo
  // saíram do sitemap por completo (anunciar uma página que hoje devolve
  // placeholder é sinal ruim pro Google, não ganho).
  const staticRoutes = [
    // Blog-first — home e ensaios no topo
    toAbsolute('',           1.0,  'weekly'),
    toAbsolute('/blog',      0.9,  'weekly'),
    toAbsolute('/glossario', 0.85, 'weekly'),

    // Estudo — trilhas de leitura logo abaixo
    toAbsolute('/estudos',   0.75, 'weekly'),

    // Autoridade / E-E-A-T
    toAbsolute('/bio',       0.85, 'monthly'),

    // Documentos legais — prioridade baixa (não competem por busca), mas
    // indexados de propósito: em assunto sensível, a existência pública de
    // política de privacidade é sinal de confiança que o Google pondera.
    toAbsolute('/privacidade', 0.3, 'yearly'),
    toAbsolute('/cookies',     0.3, 'yearly'),
  ];

  // Posts do blog — um entry por post publicado com lastModified real
  const postRoutes = getPublishedPosts().map((p) => {
    const slug = p.slug || p.id;
    const lm = p.updated_at || p.created_at;
    return toAbsolute(
      `/blog/${slug}`,
      0.8,
      'monthly',
      lm ? new Date(lm) : new Date(),
    );
  });

  // Categorias do blog — um entry por tag única
  const tagRoutes = getUniqueTags().map((tag) =>
    toAbsolute(`/blog/tag/${tag}`, 0.55, 'weekly'),
  );

  // Verbetes do glossário — ~25 landings estáticas de cauda longa,
  // hoje só a raiz /glossario/ estava no sitemap
  const glossarioRoutes = (Array.isArray(glossario) ? glossario : [])
    .filter((g) => g?.slug && !g.hidden)
    .map((g) => toAbsolute(`/glossario/${g.slug}`, 0.65, 'monthly'));

  // Trilhas de estudo — uma por trilha efetivamente publicada
  const trilhaRoutes = getTrilhas()
    .filter((t) => t?.slug || t?.id)
    .map((t) => toAbsolute(`/estudos/${t.slug || t.id}`, 0.6, 'monthly'));

  return [
    ...staticRoutes,
    ...postRoutes,
    ...tagRoutes,
    ...glossarioRoutes,
    ...trilhaRoutes,
  ];
}
