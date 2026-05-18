import siteContent from '@/data/site-content.json';
import { trilhas as TRILHAS_DEFAULT } from '@/data/trilhas';
import EstudosListingClient from './EstudosListingClient';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

export const metadata = {
  title: 'Estudos · Guias de leitura em psicologia analítica',
  description:
    'Guias de estudo em psicologia analítica junguiana — por onde começar, em que ordem ler, com vídeos, materiais, cartografia e ensaios em cada etapa.',
  alternates: { canonical: `${SITE_URL}/estudos/` },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/estudos/`,
    siteName: 'Psiangelo',
    title: 'Estudos · Psiangelo',
    description: 'Guias de estudo em psicologia analítica junguiana.',
  },
};

function getInitialTrilhas() {
  const stored = siteContent?.data?.angelo_admin_trilhas;
  return Array.isArray(stored) && stored.length > 0 ? stored : TRILHAS_DEFAULT;
}

export default function EstudosPage() {
  return <EstudosListingClient initialTrilhas={getInitialTrilhas()} />;
}
