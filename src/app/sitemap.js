import siteContent from '@/data/site-content.json';

const BASE = 'https://psiangelo.github.io/Psiangelo';

function getPublishedPosts() {
  const posts = siteContent?.data?.angelo_admin_blog;
  if (!Array.isArray(posts)) return [];
  return posts.filter((p) => p && (p.slug || p.id) && (!p.status || p.status === 'published'));
}

function slugifyTag(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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
  const staticRoutes = [
    // Captação clínica — prioridade máxima
    toAbsolute('',                                   1.0,  'weekly'),
    toAbsolute('/psicoterapia-analitica',            1.0,  'weekly'),
    toAbsolute('/psicoterapia-analitica/adultos',    0.95, 'monthly'),
    toAbsolute('/psicoterapia-analitica/adolescentes', 0.95, 'monthly'),
    toAbsolute('/psicoterapia-analitica/idosos',     0.95, 'monthly'),
    toAbsolute('/atendo',                            0.9,  'monthly'),

    // Autoridade / E-E-A-T
    toAbsolute('/bio',        0.85, 'monthly'),

    // Conteúdo e estudo
    toAbsolute('/blog',       0.8, 'weekly'),
    toAbsolute('/materiais',  0.7, 'weekly'),
    toAbsolute('/cursos',     0.7, 'monthly'),
    toAbsolute('/trilhas',    0.7, 'monthly'),
    toAbsolute('/atlas',      0.65, 'monthly'),
    toAbsolute('/glossario',  0.6, 'monthly'),
  ];

  // Posts do blog — um entry por post publicado com lastModified real
  const postRoutes = getPublishedPosts().map((p) => {
    const slug = p.slug || p.id;
    const lm = p.updated_at || p.created_at;
    return toAbsolute(
      `/blog/${slug}`,
      0.75,
      'monthly',
      lm ? new Date(lm) : new Date(),
    );
  });

  // Categorias do blog — um entry por tag única
  const tagRoutes = getUniqueTags().map((tag) =>
    toAbsolute(`/blog/tag/${tag}`, 0.6, 'weekly'),
  );

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
