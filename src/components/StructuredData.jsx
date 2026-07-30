import siteContentSnapshot from '@/data/site-content.json';

const BASE = 'https://psiangelo.github.io/Psiangelo';

// Fallback local do author — não importamos de '@/lib/sitedata' aqui porque
// aquele módulo abre com 'use client' (é a camada de leitura do admin, usada
// só por componentes client). Importar um export seu de dentro de um Server
// Component quebra o build inteiro: o Next troca os exports de um módulo
// 'use client' por client references quando ele cruza a fronteira server→
// client, e essas referências não são chamáveis como função comum — daí o
// `TypeError: m is not a function` no prerender de TODAS as páginas quando
// isso foi tentado aqui. StructuredData roda só em build (sem 'use client'),
// então lemos o snapshot publicado (site-content.json) direto, e duplicamos
// aqui só o fallback (mesmo texto do DEFAULT_BIO.author em sitedata.js) —
// vale apenas antes do primeiro publish com o campo novo.
const DEFAULT_AUTHOR = {
  name: 'Ângelo',
  credential: 'Estagiário em Psicologia · Associação Allos',
  bio: 'Estudante de psicologia, em estágio clínico supervisionado pela Associação Allos. Escrevo a partir da leitura sistemática da obra de Jung — cada citação conferida contra a fonte, localizada por obra e parágrafo.',
  photo: {
    src: '/images/angelo-terapia.png',
    alt: 'Ângelo',
  },
};

function getPublishedAuthor() {
  const storedAuthor = siteContentSnapshot?.data?.angelo_admin_bio?.author;
  if (!storedAuthor || typeof storedAuthor !== 'object') return DEFAULT_AUTHOR;
  return {
    ...DEFAULT_AUTHOR,
    ...storedAuthor,
    photo: { ...DEFAULT_AUTHOR.photo, ...(storedAuthor.photo || {}) },
  };
}

// Reposicionamento 2026-07: o site é hoje um projeto de estudo público sobre
// Jung — blog, glossário, trilhas de leitura — não uma clínica. A psicoterapia
// está oculta enquanto o Ângelo não tem CRP (atua como estagiário sob
// supervisão). Declarar `ProfessionalService`/`MedicalTherapy` aqui seria
// anunciar um serviço clínico que a própria página não expõe mais — schema
// mentindo sobre o conteúdo real. Person + WebSite + Blog descreve o que a
// página de fato é, e preserva a descrição honesta de estagiário sob
// supervisão, que é o sinal de experiência de primeira mão que sustenta
// o E-E-A-T do site.
//
// name/jobTitle/description/image do Person vêm do snapshot publicado de
// angelo_admin_bio.author — a mesma identidade editável em Admin → Bio /
// Linktree → "Identidade de autor" que alimenta AuthorBand e AuthorBox.
// Antes eram literais fixos aqui, duplicados manualmente: editar a bio no
// admin não mudava o que o Google lê, e as duas versões podiam divergir sem
// ninguém notar.
export default function StructuredData() {
  const author = getPublishedAuthor();
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${BASE}#person`,
        name: author.name,
        givenName: author.name,
        jobTitle: author.credential,
        description: `${author.bio} Mantém aqui um projeto de estudo público sobre a obra de Carl Gustav Jung e a psicologia analítica — ensaios, glossário e trilhas de leitura.`,
        url: BASE,
        image: `${BASE}${author.photo?.src || '/images/angelo-terapia.png'}`,
        knowsAbout: [
          'Psicologia Analítica',
          'Carl Gustav Jung',
          'Análise de Sonhos',
          'Individuação',
          'Arquétipos',
          'Sombra',
          'Alquimia Psicológica',
          'Tipologia Junguiana',
        ],
        affiliation: [
          { '@type': 'Organization', name: 'Associação Allos' },
          { '@type': 'Organization', name: 'Liga de Psicologia Analítica — UNICAP' },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}#website`,
        url: BASE,
        name: 'Psiangelo',
        description:
          'Um projeto de estudo público sobre a obra de Carl Gustav Jung — ensaios, glossário e trilhas de leitura em psicologia analítica.',
        publisher: { '@id': `${BASE}#person` },
        inLanguage: 'pt-BR',
      },
      {
        '@type': 'Blog',
        '@id': `${BASE}#blog`,
        url: `${BASE}/blog`,
        name: 'Ensaios — Psiangelo',
        description:
          'Ensaios sobre Jung, símbolos, sonhos e o processo de individuação.',
        author: { '@id': `${BASE}#person` },
        publisher: { '@id': `${BASE}#person` },
        isPartOf: { '@id': `${BASE}#website` },
        inLanguage: 'pt-BR',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
