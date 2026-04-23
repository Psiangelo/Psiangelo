const BASE = 'https://psiangelo.github.io/Psiangelo';

/**
 * JSON-LD inline para páginas clínicas.
 * Renderizado server-side (componente sem 'use client').
 *
 * Props:
 *  - path: caminho da página (ex.: '/psicoterapia-analitica/adultos')
 *  - title: título humano da página (usado em BreadcrumbList e Service.name)
 *  - description: descrição curta usada no Service
 *  - faq: array de { q, a } para FAQPage (omita pra não emitir FAQPage)
 *  - audience: objeto opcional { name, suggestedMinAge, suggestedMaxAge } para AudienceTarget
 *  - serviceName: nome explícito do serviço (default deriva do title)
 *  - breadcrumb: array de { name, path } (sem o item raiz, que é adicionado automaticamente)
 */
export default function TherapySchema({
  path,
  title,
  description,
  faq,
  audience,
  serviceName,
  breadcrumb = [],
}) {
  const url = `${BASE}${path}`;
  const graph = [];

  // Service específico (refina o ProfessionalService global)
  graph.push({
    '@type': 'Service',
    '@id': `${url}#service`,
    name: serviceName || title,
    description,
    url,
    serviceType: 'Psicoterapia analítica online',
    provider: { '@id': `${BASE}#person` },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url,
      availableLanguage: ['pt-BR'],
      serviceLocation: { '@type': 'VirtualLocation', url },
    },
    ...(audience && {
      audience: {
        '@type': 'PeopleAudience',
        name: audience.name,
        ...(audience.suggestedMinAge != null && {
          suggestedMinAge: audience.suggestedMinAge,
        }),
        ...(audience.suggestedMaxAge != null && {
          suggestedMaxAge: audience.suggestedMaxAge,
        }),
      },
    }),
  });

  // BreadcrumbList
  const breadcrumbItems = [
    { name: 'Início', path: '' },
    ...breadcrumb,
    { name: title, path },
  ];
  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: breadcrumbItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.path}`,
    })),
  });

  // FAQPage (opcional)
  if (faq && faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    });
  }

  const data = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
