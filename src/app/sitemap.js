const BASE = 'https://psiangelo.github.io/Psiangelo';

export default function sitemap() {
  const now = new Date();
  const routes = [
    { path: '',            priority: 1.0, changeFrequency: 'weekly' },
    { path: '/bio',        priority: 0.9, changeFrequency: 'monthly' },
    { path: '/materiais',  priority: 0.9, changeFrequency: 'weekly' },
    { path: '/blog',       priority: 0.9, changeFrequency: 'weekly' },
    { path: '/cursos',     priority: 0.8, changeFrequency: 'monthly' },
    { path: '/trilhas',    priority: 0.8, changeFrequency: 'monthly' },
    { path: '/glossario',  priority: 0.7, changeFrequency: 'monthly' },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
