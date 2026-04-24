import BlogClient from './BlogClient';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

export const metadata = {
  title: 'Blog · Ensaios de psicologia analítica',
  description:
    'Ensaios sobre psicologia analítica, clínica junguiana, prática de estudo, mitologia e individuação. Publicações atualizadas quando há algo a dizer.',
  alternates: { canonical: `${SITE_URL}/blog/` },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/blog/`,
    siteName: 'Psiangelo',
    title: 'Blog · Ensaios de psicologia analítica · Psiangelo',
    description:
      'Ensaios sobre psicologia analítica, clínica junguiana, mitologia e individuação.',
    images: [
      { url: `${SITE_URL}/og-square.png`, width: 1200, height: 1200, alt: 'Psiangelo', type: 'image/png' },
      { url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: 'Psiangelo', type: 'image/png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog · Ensaios de psicologia analítica · Psiangelo',
    description: 'Ensaios sobre psicologia analítica e prática clínica junguiana.',
    images: [`${SITE_URL}/og.png`],
  },
};

export default function Page() {
  return <BlogClient />;
}
