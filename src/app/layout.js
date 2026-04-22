import './globals.css';
import WhatsAppButton from '@/components/WhatsAppButton';
import AmbientPsi from '@/components/ui/AmbientPsi';
import ContentBootstrap from '@/components/ContentBootstrap';
import StructuredData from '@/components/StructuredData';
import CommandPalette from '@/components/CommandPalette';
import Analytics from '@/components/Analytics';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Psiangelo — Psicologia Analítica & Prática Clínica',
    template: '%s · Psiangelo',
  },
  description:
    'Estudante de psicologia e estagiário clínico em abordagem junguiana. Resumos, mapas mentais, trilhas de estudo e prática clínica em psicologia analítica.',
  keywords: [
    'psicologia analítica',
    'Jung',
    'mapas mentais',
    'resumos',
    'psicoterapia',
    'formação clínica',
    'individuação',
    'arquétipos',
    'sombra',
    'Psiangelo',
  ],
  authors: [{ name: 'Psiangelo' }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'Psiangelo',
    title: 'Psiangelo — Psicologia Analítica & Prática Clínica',
    description: 'Resumos, mapas mentais e materiais de estudo com experiência clínica junguiana.',
    images: [
      // Quadrado primeiro — WhatsApp/iMessage dão preferência à primeira imagem
      { url: `${SITE_URL}/og-square.png`, width: 1200, height: 1200, alt: 'Psiangelo', type: 'image/png' },
      { url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: 'Psiangelo', type: 'image/png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psiangelo — Psicologia Analítica & Prática Clínica',
    description: 'Resumos, mapas mentais e materiais de estudo com experiência clínica junguiana.',
    images: [`${SITE_URL}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <Analytics />
      </head>
      <body>
        <StructuredData />
        <ContentBootstrap />
        <CommandPalette />
        {children}
        <AmbientPsi />
        <WhatsAppButton />
      </body>
    </html>
  );
}
