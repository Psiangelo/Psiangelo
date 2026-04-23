import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import AtlasGate from '@/components/atlas/AtlasGate';
import WhenVisible from '@/components/atlas/WhenVisible';
import {
  atlasSections,
  atlasStats,
  getFeaturedNotes,
  atlasNotes,
} from '@/lib/atlas';

export const metadata = {
  title: 'Atlas',
  description:
    'Cartografia editorial de psicologia analítica, clínica e humanidades — notas interligadas do estudo contínuo de Gabriel.',
  openGraph: {
    title: 'Atlas · Psiangelo',
    description: 'Cartografia editorial de psicologia analítica, clínica e humanidades.',
    type: 'website',
  },
};

export default function AtlasHomePage() {
  const featured = getFeaturedNotes(9);
  const mostLinked = [...atlasNotes]
    .sort((a, b) => (b.backlinks?.length || 0) - (a.backlinks?.length || 0))
    .slice(0, 12);

  return (
    <AtlasGate visibilityKey="atlas" title="Atlas indisponível">
      <Navbar />
      <main>
        <PageHero
          meta={[
            ['Notas', atlasStats.published],
            ['Seções', atlasSections.length],
            ['Conceitos', atlasSections.find((s) => s.slug === 'conceitos')?.count || 0],
          ]}
          title="Atlas"
          emphasis="psíquico"
          kicker="Cartografia editorial, interligada, em construção"
          lead={`${atlasStats.published} notas de estudo — Jung, tipologia, epistemologia clínica, humanidades — com wikilinks, conceitos transversais e backlinks. Um mapa vivo, espelho do vault pessoal.`}
        />

        {/* Seções */}
        <section className="py-8 md:py-12 px-5 sm:px-6 md:px-12">
          <div className="max-w-[1180px] mx-auto">
            <header className="flex items-baseline gap-4 mb-8">
              <span className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase">Seções</span>
              <span className="flex-1 h-px bg-border-subtle" />
              <Link
                href="/atlas/indice"
                className="font-mono text-[0.6rem] text-text-dim hover:text-accent tracking-[0.22em] uppercase transition-colors"
              >
                Índice A–Z →
              </Link>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {atlasSections.map((s) => (
                <Link
                  key={s.slug}
                  href={`/atlas/${s.slug}`}
                  className="group block bg-bg-card border border-border-subtle hover:border-accent/40 transition-all p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-12 h-px bg-accent/40 group-hover:w-20 transition-all" />
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="font-serif text-[1.35rem] text-text-bright group-hover:text-accent transition-colors leading-tight">
                      {s.label}
                    </h3>
                    <span className="font-mono text-[0.6rem] text-accent/70 tracking-[0.2em]">
                      {String(s.count).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-[0.84rem] text-text-dim leading-relaxed">{s.kicker}</p>
                </Link>
              ))}
            </div>

            {/* Grafo */}
            <Link
              href="/atlas/grafo"
              className="group block mt-4 bg-bg-card border border-border-subtle hover:border-accent/40 transition-all p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-16 h-px bg-accent/60 group-hover:w-24 transition-all" />
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="font-mono text-[0.55rem] text-accent tracking-[0.22em] uppercase mb-2">
                    Visualização
                  </p>
                  <h3 className="font-serif text-[1.35rem] text-text-bright group-hover:text-accent transition-colors mb-1 leading-tight">
                    Grafo de conexões
                  </h3>
                  <p className="text-[0.84rem] text-text-dim">
                    Mapa interativo dos wikilinks entre notas — passe o mouse pra destacar vizinhos
                  </p>
                </div>
                <svg width="44" height="44" viewBox="0 0 44 44" className="flex-shrink-0 text-accent/70 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="22" cy="10" r="3" fill="currentColor" />
                  <circle cx="10" cy="28" r="2.5" fill="currentColor" />
                  <circle cx="34" cy="28" r="2.5" fill="currentColor" />
                  <circle cx="22" cy="36" r="2" fill="currentColor" />
                  <circle cx="6" cy="14" r="2" fill="currentColor" />
                  <circle cx="38" cy="14" r="2" fill="currentColor" />
                  <line x1="22" y1="10" x2="10" y2="28" />
                  <line x1="22" y1="10" x2="34" y2="28" />
                  <line x1="22" y1="10" x2="6" y2="14" />
                  <line x1="22" y1="10" x2="38" y2="14" />
                  <line x1="10" y1="28" x2="22" y2="36" />
                  <line x1="34" y1="28" x2="22" y2="36" />
                  <line x1="10" y1="28" x2="34" y2="28" />
                </svg>
              </div>
            </Link>
          </div>
        </section>

        {/* Destaques */}
        {featured.length > 0 && (
          <section className="py-10 md:py-16 px-5 sm:px-6 md:px-12 section-border-t">
            <div className="max-w-[1180px] mx-auto">
              <header className="flex items-baseline gap-4 mb-8">
                <span className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase">Destaques</span>
                <span className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">
                  {featured.length} ensaios
                </span>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featured.map((n) => (
                  <Link
                    key={`${n.section}/${n.slug}`}
                    href={`/atlas/${n.section}/${n.slug}`}
                    className="group block bg-bg-card/60 border border-border-subtle hover:border-accent/40 transition-colors p-5"
                  >
                    <p className="font-mono text-[0.55rem] text-accent/70 tracking-[0.22em] uppercase mb-2">
                      {atlasSections.find((s) => s.slug === n.section)?.label}
                    </p>
                    <h3 className="font-serif text-[1.15rem] text-text-bright group-hover:text-accent transition-colors mb-2 leading-snug">
                      {n.title}
                    </h3>
                    <p className="font-mono text-[0.55rem] text-text-dim tracking-[0.18em] uppercase">
                      {n.readingMinutes} min · {n.backlinks?.length || 0} ref
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Mais citadas */}
        {mostLinked.length > 0 && (
          <section className="py-10 md:py-16 px-5 sm:px-6 md:px-12 section-border-t">
            <div className="max-w-[1180px] mx-auto">
              <header className="flex items-baseline gap-4 mb-8">
                <span className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase">
                  Mais citadas
                </span>
                <span className="flex-1 h-px bg-border-subtle" />
              </header>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                {mostLinked.map((n) => (
                  <li
                    key={`${n.section}/${n.slug}`}
                    className="flex items-baseline gap-4 border-b border-border-subtle/40 py-2.5"
                  >
                    <Link
                      href={`/atlas/${n.section}/${n.slug}`}
                      className="font-serif text-text-bright hover:text-accent transition-colors flex-1 truncate"
                    >
                      {n.title}
                    </Link>
                    <span className="font-mono text-[0.55rem] text-accent/60 tracking-[0.2em]">
                      {String(n.backlinks?.length || 0).padStart(2, '0')} ref
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Glossário curado (link pra coleção separada) */}
        <WhenVisible k="glossario">
        <section className="py-8 md:py-10 px-5 sm:px-6 md:px-12 section-border-t">
          <div className="max-w-[1180px] mx-auto">
            <Link
              href="/glossario"
              className="group block bg-bg-card/40 border border-border-subtle hover:border-accent/40 transition-colors p-5 md:p-6"
            >
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="font-mono text-[0.55rem] text-accent tracking-[0.22em] uppercase mb-2">
                    Coleção complementar
                  </p>
                  <h3 className="font-serif text-[1.35rem] text-text-bright group-hover:text-accent transition-colors mb-1">
                    Glossário junguiano
                  </h3>
                  <p className="text-[0.84rem] text-text-dim">
                    24 termos essenciais da psicologia analítica — curadoria separada do Atlas
                  </p>
                </div>
                <span className="font-mono text-[0.6rem] text-text-dim group-hover:text-accent tracking-[0.22em] uppercase transition-colors">
                  Acessar →
                </span>
              </div>
            </Link>
          </div>
        </section>
        </WhenVisible>

      </main>
      <Footer />
    </AtlasGate>
  );
}
