const BASE = 'https://psiangelo.github.io/Psiangelo';

export default function sitemap() {
  const now = new Date();
  const routes = [
    // Captação clínica — prioridade máxima
    { path: '',                                   priority: 1.0,  changeFrequency: 'weekly'  },
    { path: '/psicoterapia-analitica',            priority: 1.0,  changeFrequency: 'weekly'  },
    { path: '/psicoterapia-analitica/adultos',    priority: 0.95, changeFrequency: 'monthly' },
    { path: '/psicoterapia-analitica/adolescentes', priority: 0.95, changeFrequency: 'monthly' },
    { path: '/psicoterapia-analitica/idosos',     priority: 0.95, changeFrequency: 'monthly' },

    // Autoridade / E-E-A-T
    { path: '/bio',        priority: 0.85, changeFrequency: 'monthly' },

    // Conteúdo e estudo
    { path: '/blog',       priority: 0.8, changeFrequency: 'weekly'  },
    { path: '/materiais',  priority: 0.7, changeFrequency: 'weekly'  },
    { path: '/cursos',     priority: 0.7, changeFrequency: 'monthly' },
    { path: '/trilhas',    priority: 0.7, changeFrequency: 'monthly' },
    { path: '/glossario',  priority: 0.6, changeFrequency: 'monthly' },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
