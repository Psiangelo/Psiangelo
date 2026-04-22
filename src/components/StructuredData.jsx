const BASE = 'https://psiangelo.github.io/Psiangelo';

export default function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${BASE}#person`,
        name: 'Psiangelo',
        givenName: 'Ângelo',
        jobTitle: 'Estagiário clínico em Psicologia',
        description:
          'Estudante de psicologia e estagiário clínico em abordagem junguiana. Conduz grupos de estudo, atende em clínica e escreve sobre psicologia analítica.',
        url: BASE,
        image: `${BASE}/images/angelo-portrait.png`,
        knowsAbout: [
          'Psicologia Analítica',
          'Carl Gustav Jung',
          'Psicoterapia',
          'Individuação',
          'Arquétipos',
          'Sombra',
        ],
        affiliation: [
          { '@type': 'Organization', name: 'Associação Allos' },
          { '@type': 'Organization', name: 'Liga de Psicologia Analítica — UNICAP' },
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${BASE}#service`,
        name: 'Psiangelo — Psicologia Analítica',
        description:
          'Atendimento clínico em psicologia analítica, grupos de estudo, materiais e cursos em abordagem junguiana.',
        url: BASE,
        provider: { '@id': `${BASE}#person` },
        serviceType: 'Psicoterapia de abordagem junguiana',
        areaServed: { '@type': 'Country', name: 'Brasil' },
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}#website`,
        url: BASE,
        name: 'Psiangelo',
        description:
          'Psicologia analítica, prática clínica e materiais de estudo em Jung.',
        publisher: { '@id': `${BASE}#person` },
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
