import HomeClient from './HomeClient';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

export const metadata = {
  title: {
    absolute: 'Psicoterapia Junguiana Online · Adolescentes, Adultos e Idosos · Psiangelo',
  },
  description:
    'Psicoterapia analítica online em abordagem junguiana, para adolescentes, adultos e idosos em todo o Brasil. Escuta clínica da tradição de Jung, por videochamada. Marque uma conversa inicial sem compromisso.',
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/`,
    siteName: 'Psiangelo',
    title: 'Psicoterapia Junguiana Online · Psiangelo',
    description:
      'Psicoterapia analítica online em abordagem junguiana — adolescentes, adultos e idosos, em todo o Brasil. Marque uma conversa inicial sem compromisso.',
    images: [
      { url: `${SITE_URL}/og-square.png`, width: 1200, height: 1200, alt: 'Psiangelo', type: 'image/png' },
      { url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: 'Psiangelo', type: 'image/png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psicoterapia Junguiana Online · Psiangelo',
    description:
      'Psicoterapia analítica online em abordagem junguiana — adolescentes, adultos e idosos, em todo o Brasil.',
    images: [`${SITE_URL}/og.png`],
  },
};

export default function Page() {
  return <HomeClient />;
}
