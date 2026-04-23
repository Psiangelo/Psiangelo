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
        jobTitle: 'Estagiário de psicologia — atendimento clínico supervisionado',
        description:
          'Estagiário de psicologia em estágio clínico supervisionado (Associação Allos), atuando em psicoterapia analítica de abordagem junguiana. Atendimento 100% online para adolescentes, adultos e idosos em todo o Brasil.',
        url: BASE,
        image: `${BASE}/images/angelo-portrait.png`,
        knowsAbout: [
          'Psicologia Analítica',
          'Carl Gustav Jung',
          'Psicoterapia Junguiana',
          'Análise de Sonhos',
          'Individuação',
          'Arquétipos',
          'Sombra',
          'Segunda Metade da Vida',
          'Psicologia do Adolescente',
          'Psicologia do Idoso',
        ],
        affiliation: [
          { '@type': 'Organization', name: 'Associação Allos' },
          { '@type': 'Organization', name: 'Liga de Psicologia Analítica — UNICAP' },
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${BASE}#service`,
        name: 'Psiangelo — Psicoterapia Analítica Online',
        description:
          'Atendimento clínico em psicoterapia analítica de abordagem junguiana, 100% online, para adolescentes, adultos e idosos em todo o Brasil.',
        url: `${BASE}/psicoterapia-analitica`,
        provider: { '@id': `${BASE}#person` },
        serviceType: 'Psicoterapia analítica online',
        areaServed: { '@type': 'Country', name: 'Brasil' },
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: `${BASE}/psicoterapia-analitica`,
          availableLanguage: ['pt-BR'],
          serviceLocation: {
            '@type': 'VirtualLocation',
            url: `${BASE}/psicoterapia-analitica`,
          },
        },
        audience: [
          {
            '@type': 'PeopleAudience',
            name: 'Adolescentes',
            suggestedMinAge: 14,
            suggestedMaxAge: 18,
          },
          {
            '@type': 'PeopleAudience',
            name: 'Adultos',
            suggestedMinAge: 18,
            suggestedMaxAge: 60,
          },
          {
            '@type': 'PeopleAudience',
            name: 'Idosos',
            suggestedMinAge: 60,
          },
        ],
        availableService: [
          {
            '@type': 'MedicalTherapy',
            name: 'Psicoterapia analítica online para adultos',
          },
          {
            '@type': 'MedicalTherapy',
            name: 'Psicoterapia analítica online para adolescentes',
          },
          {
            '@type': 'MedicalTherapy',
            name: 'Psicoterapia analítica online para idosos',
          },
          {
            '@type': 'MedicalTherapy',
            name: 'Análise de sonhos em psicoterapia junguiana',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}#website`,
        url: BASE,
        name: 'Psiangelo',
        description:
          'Psicoterapia analítica online em abordagem junguiana, para adolescentes, adultos e idosos em todo o Brasil.',
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
