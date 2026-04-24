import CursosClient from './CursosClient';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

export const metadata = {
  title: 'Cursos · Formação em psicologia analítica',
  description:
    'Cursos de psicologia analítica e prática clínica junguiana. Formação continuada para estudantes e profissionais, com leitura orientada e supervisão.',
  alternates: { canonical: `${SITE_URL}/cursos/` },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/cursos/`,
    siteName: 'Psiangelo',
    title: 'Cursos · Formação em psicologia analítica · Psiangelo',
    description:
      'Cursos de psicologia analítica e prática clínica junguiana, com leitura orientada e supervisão.',
    images: [
      { url: `${SITE_URL}/og-square.png`, width: 1200, height: 1200, alt: 'Psiangelo', type: 'image/png' },
      { url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: 'Psiangelo', type: 'image/png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cursos · Formação em psicologia analítica · Psiangelo',
    description: 'Cursos de psicologia analítica e prática clínica junguiana.',
    images: [`${SITE_URL}/og.png`],
  },
};

export default function Page() {
  return <CursosClient />;
}
