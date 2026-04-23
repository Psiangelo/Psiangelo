import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import AtlasGraph from '@/components/atlas/AtlasGraph';
import { getGraphData, atlasStats } from '@/lib/atlas';

export const metadata = {
  title: 'Grafo de conexões',
  description: 'Visualização em rede das notas do Atlas — nós são notas, arestas são wikilinks.',
};

export default function GrafoPage() {
  const { nodes, links, sectionLabels } = getGraphData();

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          meta={[
            ['Nós', nodes.length],
            ['Arestas', links.length],
            ['Densidade', `${((links.length / (nodes.length * (nodes.length - 1) / 2)) * 100).toFixed(2)}%`],
          ]}
          eyebrow={
            <Link href="/atlas" className="hover:text-text-bright transition-colors">
              ← Atlas
            </Link>
          }
          title="Grafo"
          emphasis="de conexões"
          kicker="Mapa vivo dos wikilinks entre notas"
          lead={`${atlasStats.published} nós ligados por ${links.length} relações. Nós maiores têm mais conexões. Cores indicam a seção. Uma cartografia emergente do estudo.`}
        />

        <section className="px-5 sm:px-6 md:px-12 pb-20">
          <div className="max-w-[1400px] mx-auto">
            <AtlasGraph nodes={nodes} links={links} sectionLabels={sectionLabels} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
