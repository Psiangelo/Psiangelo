import './globals.css';
import WhatsAppButton from '@/components/WhatsAppButton';
import BackToTop from '@/components/BackToTop';
import SkipLink from '@/components/SkipLink';
import AmbientPsi from '@/components/ui/AmbientPsi';
import ContentBootstrap from '@/components/ContentBootstrap';
import StructuredData from '@/components/StructuredData';
import CommandPalette from '@/components/CommandPalette';
import Analytics from '@/components/Analytics';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Psiangelo — Ensaios e Glossário sobre Jung e Psicologia Analítica',
    template: '%s · Psiangelo',
  },
  description:
    'Um projeto de estudo público sobre a obra de Carl Gustav Jung: ensaios, glossário e trilhas de leitura em psicologia analítica, escritos por um estudante de psicologia em estágio clínico supervisionado.',
  keywords: [
    'psicologia analítica',
    'psicologia junguiana',
    'Carl Gustav Jung',
    'glossário junguiano',
    'individuação',
    'arquétipos',
    'sombra',
    'self',
    'análise de sonhos',
    'alquimia psicológica',
    'sincronicidade',
    'trilhas de leitura Jung',
    'Psiangelo',
  ],
  authors: [{ name: 'Psiangelo' }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'Psiangelo',
    title: 'Psiangelo — Ensaios e Glossário sobre Jung',
    description:
      'Ensaios, glossário e trilhas de leitura sobre a obra de Carl Gustav Jung e a psicologia analítica.',
    images: [
      // Quadrado primeiro — WhatsApp/iMessage dão preferência à primeira imagem
      { url: `${SITE_URL}/og-square.png`, width: 1200, height: 1200, alt: 'Psiangelo', type: 'image/png' },
      { url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: 'Psiangelo', type: 'image/png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psiangelo — Ensaios e Glossário sobre Jung',
    description:
      'Ensaios, glossário e trilhas de leitura sobre a obra de Carl Gustav Jung e a psicologia analítica.',
    images: [`${SITE_URL}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: `${SITE_URL}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Psiangelo',
  },
};

// Next.js 14: themeColor migrou de `metadata` para `viewport` export
export const viewport = {
  themeColor: '#0E0C0A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <Analytics />
      </head>
      <body>
        <SkipLink />
        <StructuredData />
        <ContentBootstrap />
        <CommandPalette />
        {children}
        <AmbientPsi />
        <WhatsAppButton />
        <BackToTop />
      </body>
    </html>
  );
}
