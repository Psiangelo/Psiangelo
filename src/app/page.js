import HomeClient from './HomeClient';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

// Title da home foca em brand + o que a casa é hoje: estudo público da obra
// de Jung (ensaios, glossário, trilhas). O long-tail clínico fica reservado
// pra /psicoterapia-analitica/, que segue oculta enquanto não há CRP.
export const metadata = {
  title: {
    absolute: 'Psiangelo · Psicologia Analítica · Ensaios, Glossário e Trilhas de Leitura',
  },
  description:
    'Estudo público e contínuo da obra de Carl Gustav Jung: ensaios sobre psicologia analítica, um glossário de conceitos junguianos e trilhas de leitura para entrar na obra pela porta certa.',
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/`,
    siteName: 'Psiangelo',
    title: 'Psiangelo · Psicologia Analítica · Ensaios, Glossário e Trilhas de Leitura',
    description:
      'Estudo público da obra de Jung: ensaios, glossário de conceitos junguianos e trilhas de leitura.',
    images: [
      { url: `${SITE_URL}/og-square.png`, width: 1200, height: 1200, alt: 'Psiangelo', type: 'image/png' },
      { url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: 'Psiangelo', type: 'image/png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psiangelo · Psicologia Analítica · Ensaios, Glossário e Trilhas de Leitura',
    description:
      'Estudo público da obra de Jung: ensaios, glossário de conceitos junguianos e trilhas de leitura.',
    images: [`${SITE_URL}/og.png`],
  },
};

export default function Page() {
  return <HomeClient />;
}
