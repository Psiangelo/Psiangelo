import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import AtlasGate from '@/components/atlas/AtlasGate';
import AtlasIndexContent from '@/components/atlas/AtlasIndexContent';
import { atlasStats } from '@/lib/atlas';

export const metadata = {
  title: 'Índice A–Z',
  description: 'Índice alfabético de todas as notas do Atlas.',
};

export default function IndicePage() {
  return (
    <AtlasGate visibilityKey="atlas" title="Atlas indisponível">
      <Navbar />
      <main>
        <PageHero
          meta={[['Notas', atlasStats.published]]}
          eyebrow={
            <Link href="/atlas" className="hover:text-text-bright transition-colors">
              ← Atlas
            </Link>
          }
          title="Índice A–Z"
          kicker="Todas as notas do Atlas em ordem alfabética"
        />

        <section className="py-8 md:py-12 px-5 sm:px-6 md:px-12">
          <AtlasIndexContent />
        </section>
      </main>
      <Footer />
    </AtlasGate>
  );
}
