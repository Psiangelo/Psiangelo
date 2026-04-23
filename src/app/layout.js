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
    default: 'Psicoterapia Junguiana Online · Adolescentes, Adultos e Idosos · Psiangelo',
    template: '%s · Psiangelo',
  },
  description:
    'Psicoterapia analítica online em abordagem junguiana, para adolescentes, adultos e idosos em todo o Brasil. Escuta clínica da tradição de Jung, por videochamada. Marque uma conversa inicial sem compromisso.',
  keywords: [
    'psicoterapia analítica online',
    'psicoterapia junguiana online',
    'terapia junguiana online',
    'psicologia analítica online',
    'análise junguiana online',
    'terapeuta junguiano online',
    'psicoterapia online Brasil',
    'análise de sonhos online',
    'terapia para adolescente online',
    'terapia para idoso online',
    'crise de meia idade',
    'individuação',
    'segunda metade da vida',
    'Psiangelo',
  ],
  authors: [{ name: 'Psiangelo' }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'Psiangelo',
    title: 'Psicoterapia Junguiana Online · Psiangelo',
    description:
      'Psicoterapia analítica online em abordagem junguiana — adolescentes, adultos e idosos, em todo o Brasil. Marque uma conversa inicial sem compromisso.',
    images: [
      // Quadrado primeiro — WhatsApp/iMessage dão preferência à primeira imagem
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
