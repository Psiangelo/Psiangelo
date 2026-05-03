import HomeClient from './HomeClient';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

// Title da home foca em brand + visão da casa (clínica + estudo + escrita).
// O long-tail clínico ("psicoterapia analítica online", públicos, "primeira
// conversa") fica reservado pra /psicoterapia-analitica/ pra evitar
// canibalização — a home aponta pra ela via bússola e manifesto.
export const metadata = {
  title: {
    absolute: 'Psiangelo · Psicologia Analítica · Clínica, Estudo e Escrita',
  },
  description:
    'A casa do Psiangelo — clínica junguiana online em todo o Brasil, trilhas de estudo, ensaios e o vault aberto de notas sobre psicologia analítica. Por onde começar.',
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/`,
    siteName: 'Psiangelo',
    title: 'Psiangelo · Psicologia Analítica · Clínica, Estudo e Escrita',
    description:
      'Clínica junguiana online no Brasil, trilhas de estudo, ensaios e o vault aberto de notas sobre psicologia analítica.',
    images: [
      { url: `${SITE_URL}/og-square.png`, width: 1200, height: 1200, alt: 'Psiangelo', type: 'image/png' },
      { url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: 'Psiangelo', type: 'image/png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psiangelo · Psicologia Analítica · Clínica, Estudo e Escrita',
    description:
      'Clínica junguiana online no Brasil, trilhas de estudo, ensaios e o vault aberto de notas sobre psicologia analítica.',
    images: [`${SITE_URL}/og.png`],
  },
};

export default function Page() {
  return <HomeClient />;
}
