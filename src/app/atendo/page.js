import AtendoClient from './AtendoClient';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

export const metadata = {
  title: 'O que atendo · Queixas e temas clínicos',
  description:
    'Ansiedade, crises de sentido, sonhos recorrentes, luto, conflitos familiares, burnout, transições de vida. Psicoterapia analítica online para adolescentes, adultos e idosos.',
  alternates: { canonical: `${SITE_URL}/atendo/` },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/atendo/`,
    siteName: 'Psiangelo',
    title: 'O que atendo · Psiangelo',
    description:
      'Queixas e temas mais comuns na clínica analítica: ansiedade, sentido, sonhos, luto, relações, individuação.',
    images: [
      { url: `${SITE_URL}/og-square.png`, width: 1200, height: 1200, alt: 'Psiangelo', type: 'image/png' },
      { url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: 'Psiangelo', type: 'image/png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O que atendo · Psiangelo',
    description: 'Queixas e temas mais comuns na clínica analítica.',
    images: [`${SITE_URL}/og.png`],
  },
};

export default function Page() {
  return <AtendoClient />;
}
