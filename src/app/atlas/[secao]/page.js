import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import AtlasTree from '@/components/atlas/AtlasTree';
import AtlasGate from '@/components/atlas/AtlasGate';
import { atlasSections, getSection, getSectionTree } from '@/lib/atlas';

export function generateStaticParams() {
  return atlasSections.map((s) => ({ secao: s.slug }));
}

export function generateMetadata({ params }) {
  const s = getSection(params.secao);
  if (!s) return {};
  return {
    title: s.label,
    description: s.kicker,
    openGraph: { title: `${s.label} · Atlas`, description: s.kicker, type: 'website' },
  };
}

export default function SecaoPage({ params }) {
  const section = getSection(params.secao);
  if (!section) return notFound();
  const tree = getSectionTree(params.secao);

  return (
    <AtlasGate visibilityKey="atlas" title="Atlas indisponível">
      <Navbar />
      <main>
        <PageHero
          meta={[
            ['Seção', String(section.order).padStart(2, '0')],
            ['Notas', section.count],
          ]}
          eyebrow={
            <Link href="/atlas" className="hover:text-text-bright transition-colors">
              ← Atlas
            </Link>
          }
          title={section.label}
          kicker={section.kicker}
        />

        <section className="py-8 md:py-12 px-5 sm:px-6 md:px-12">
          <div className="max-w-[1100px] mx-auto">
            <AtlasTree tree={tree} sectionSlug={section.slug} />
          </div>
        </section>
      </main>
      <Footer />
    </AtlasGate>
  );
}
