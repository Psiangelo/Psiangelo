import MateriaisClient from './MateriaisClient';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

export const metadata = {
  title: 'Materiais · Biblioteca de estudo em psicologia analítica',
  description:
    'Catálogo de materiais para estudo de psicologia analítica junguiana: resumos, ensaios, roteiros de leitura e recursos didáticos construídos na prática clínica.',
  alternates: { canonical: `${SITE_URL}/materiais/` },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/materiais/`,
    siteName: 'Psiangelo',
    title: 'Materiais · Biblioteca de psicologia analítica · Psiangelo',
    description:
      'Catálogo de materiais para estudo de psicologia junguiana: resumos, ensaios e roteiros de leitura.',
    images: [
      { url: `${SITE_URL}/og-square.png`, width: 1200, height: 1200, alt: 'Psiangelo', type: 'image/png' },
      { url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: 'Psiangelo', type: 'image/png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Materiais · Biblioteca de psicologia analítica · Psiangelo',
    description: 'Catálogo de materiais para estudo de psicologia junguiana.',
    images: [`${SITE_URL}/og.png`],
  },
};

export default function Page() {
  return <MateriaisClient />;
}
