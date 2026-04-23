import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import TherapyGate from '@/components/therapy/TherapyGate';
import TherapyContent from '@/components/therapy/TherapyContent';

// Defaults hardcoded aqui pra renderizar no SSR sem importar módulo client
const HERO_DEFAULT = {
  eyebrow: 'Psicoterapia analítica · abordagem junguiana',
  title: 'Um trabalho para escutar',
  emphasis: 'quem você é',
  lead:
    'Não parto de nenhum pressuposto sobre você. O trabalho começa do que você me conta e do que ressoa entre nós — e o que se segue é único para a sua vida.',
};

// SEO: combina as principais queries do nicho — psicoterapia analítica, psicólogo junguiano
export const metadata = {
  title: 'Psicoterapia analítica · abordagem junguiana',
  description:
    'Psicoterapia analítica de abordagem junguiana, online ou presencial em Recife. Um espaço de escuta e diálogo — cada processo é único para a vida de quem chega.',
  keywords: [
    'psicoterapia analítica',
    'psicólogo junguiano',
    'psicologia analítica',
    'terapia junguiana',
    'análise junguiana',
    'psicoterapia Recife',
    'psicólogo online',
    'Jung',
  ],
  openGraph: {
    title: 'Psicoterapia analítica · Psiangelo',
    description:
      'Psicoterapia analítica de abordagem junguiana. Escuta e diálogo. Online ou presencial em Recife.',
    type: 'website',
  },
};

export default function PsicoterapiaPage() {
  return (
    <TherapyGate>
      <Navbar />
      <main>
        <TherapyHeroSection />
        <TherapyContent />
      </main>
      <Footer />
    </TherapyGate>
  );
}

function TherapyHeroSection() {
  return (
    <PageHero
      eyebrow={HERO_DEFAULT.eyebrow}
      title={HERO_DEFAULT.title}
      emphasis={HERO_DEFAULT.emphasis}
      lead={HERO_DEFAULT.lead}
    />
  );
}
