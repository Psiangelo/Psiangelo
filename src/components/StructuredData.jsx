const BASE = 'https://psiangelo.github.io/Psiangelo';

// Reposicionamento 2026-07: o site é hoje um projeto de estudo público sobre
// Jung — blog, glossário, trilhas de leitura — não uma clínica. A psicoterapia
// está oculta enquanto o Ângelo não tem CRP (atua como estagiário sob
// supervisão). Declarar `ProfessionalService`/`MedicalTherapy` aqui seria
// anunciar um serviço clínico que a própria página não expõe mais — schema
// mentindo sobre o conteúdo real. Person + WebSite + Blog descreve o que a
// página de fato é, e preserva a descrição honesta de estagiário sob
// supervisão, que é o sinal de experiência de primeira mão que sustenta
// o E-E-A-T do site.
export default function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${BASE}#person`,
        name: 'Ângelo',
        givenName: 'Ângelo',
        jobTitle: 'Estudante de psicologia — estágio clínico supervisionado',
        description:
          'Estudante de psicologia, estagiário clínico sob supervisão (Associação Allos). Mantém aqui um projeto de estudo público sobre a obra de Carl Gustav Jung e a psicologia analítica — ensaios, glossário e trilhas de leitura.',
        url: BASE,
        image: `${BASE}/images/angelo-portrait.png`,
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
