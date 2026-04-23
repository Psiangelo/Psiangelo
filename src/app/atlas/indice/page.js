import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import AtlasGate from '@/components/atlas/AtlasGate';
import { getAllNotesAlpha, atlasStats } from '@/lib/atlas';

export const metadata = {
  title: 'Índice A–Z',
  description: 'Índice alfabético de todas as notas do Atlas.',
};

export default function IndicePage() {
  const notes = getAllNotesAlpha();
  const groups = new Map();
  for (const n of notes) {
    const first = n.title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .charAt(0)
      .toUpperCase();
    const letter = /[A-Z]/.test(first) ? first : '#';
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(n);
  }
  const letters = [...groups.keys()].sort();

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
          <div className="max-w-[1000px] mx-auto">
            <nav className="sticky top-20 z-10 bg-bg/92 backdrop-blur-sm py-3 mb-6 flex flex-wrap gap-1.5">
              {letters.map((l) => (
                <a
                  key={l}
                  href={`#letra-${l.toLowerCase()}`}
                  className="font-mono text-[0.65rem] tracking-[0.2em] uppercase px-2.5 py-1 border border-border-subtle hover:border-accent hover:text-accent text-text-dim transition-colors"
                >
                  {l}
                </a>
              ))}
            </nav>

            {letters.map((l) => (
              <section key={l} className="mb-10" id={`letra-${l.toLowerCase()}`}>
                <header className="flex items-baseline gap-4 mb-4">
                  <span className="font-serif text-[2rem] text-accent leading-none">{l}</span>
                  <span className="flex-1 h-px bg-border-subtle" />
                  <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">
                    {String(groups.get(l).length).padStart(2, '0')}
                  </span>
                </header>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1.5">
                  {groups.get(l).map((n) => (
                    <li
                      key={`${n.section}/${n.slug}`}
                      className="flex items-baseline gap-3 border-b border-border-subtle/30 py-1.5"
                    >
                      <Link
                        href={`/atlas/${n.section}/${n.slug}`}
                        className="font-serif text-[0.95rem] text-text-bright hover:text-accent transition-colors flex-1 truncate"
                      >
                        {n.title}
                      </Link>
                      <span className="font-mono text-[0.5rem] text-text-dim/50 tracking-[0.18em] uppercase whitespace-nowrap">
                        {n.section.replace(/-/g, ' ')}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </AtlasGate>
  );
}
