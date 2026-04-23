import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import { atlasSections, getSection, getNotesBySectionGrouped } from '@/lib/atlas';

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
  const groups = getNotesBySectionGrouped(params.secao);

  return (
    <>
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
            {groups.map((g) => (
              <section key={g.label} className="mb-12">
                <header className="flex items-baseline gap-4 mb-4">
                  <span className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase">
                    {g.label}
                  </span>
                  <span className="flex-1 h-px bg-border-subtle" />
                  <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">
                    {String(g.notes.length).padStart(2, '0')}
                  </span>
                </header>
                <ul className="divide-y divide-border-subtle/40">
                  {g.notes.map((n) => (
                    <li key={`${n.section}/${n.slug}`} className="py-3">
                      <Link
                        href={`/atlas/${n.section}/${n.slug}`}
                        className="group flex items-baseline gap-4"
                      >
                        <span className="font-serif text-[1.02rem] text-text-bright group-hover:text-accent transition-colors flex-1 truncate">
                          {n.title}
                        </span>
                        {n.subpath.length > 1 && (
                          <span className="hidden md:inline font-mono text-[0.55rem] text-text-dim/50 tracking-[0.18em] uppercase truncate max-w-[40%]">
                            {n.subpath
                              .slice(1)
                              .map((s) => s.clean)
                              .join(' › ')}
                          </span>
                        )}
                        <span className="font-mono text-[0.55rem] text-text-dim tracking-[0.2em] whitespace-nowrap">
                          {n.readingMinutes}min
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
