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
    default: 'Psiângelo — Psicologia Analítica & Prática Clínica',
    template: '%s · Psiângelo',
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
    'Psiângelo',
  ],
  authors: [{ name: 'Psiângelo' }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'Psiângelo',
    title: 'Psiângelo — Psicologia Analítica & Prática Clínica',
    description: 'Resumos, mapas mentais e materiais de estudo com experiência clínica junguiana.',
    images: [{ url: `${SITE_URL}/og.svg`, width: 1200, height: 630, alt: 'Psiângelo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psiângelo — Psicologia Analítica & Prática Clínica',
    description: 'Resumos, mapas mentais e materiais de estudo com experiência clínica junguiana.',
    images: [`${SITE_URL}/og.svg`],
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
