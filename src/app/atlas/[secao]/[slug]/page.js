import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AtlasGate from '@/components/atlas/AtlasGate';
import { atlasNotes, getNote, getSection, formatBreadcrumb } from '@/lib/atlas';

export function generateStaticParams() {
  return atlasNotes.map((n) => ({ secao: n.section, slug: n.slug }));
}

export function generateMetadata({ params }) {
  const n = getNote(params.secao, params.slug);
  if (!n) return {};
  const section = getSection(n.section);
  const description = n.html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
  return {
    title: n.title,
    description,
    openGraph: {
      title: `${n.title} · ${section?.label}`,
      description,
      type: 'article',
    },
  };
}

export default function NotePage({ params }) {
  const n = getNote(params.secao, params.slug);
  if (!n) return notFound();
  const section = getSection(n.section);
  const crumbs = formatBreadcrumb(n);
  const showToc = (n.toc || []).length >= 3;
  const hubSection = n.section === 'conceitos';

  return (
    <AtlasGate visibilityKey="atlas" title="Atlas indisponível">
      <Navbar />
      <main className="pt-28 md:pt-36 pb-16 px-5 sm:px-6 md:px-12">
        <article className="max-w-[860px] mx-auto">
          {/* Back bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/atlas/${n.section}`}
              className="group inline-flex items-center gap-2 px-3 py-2 border border-border-subtle hover:border-accent/50 bg-bg-card/40 transition-colors"
            >
              <span className="text-accent group-hover:-translate-x-0.5 transition-transform">←</span>
              <span className="font-mono text-[0.6rem] text-text-dim group-hover:text-text-bright tracking-[0.22em] uppercase transition-colors">
                {section?.label || 'Atlas'}
              </span>
            </Link>
            <Link
              href="/atlas"
              className="font-mono text-[0.6rem] text-text-dim hover:text-accent tracking-[0.22em] uppercase transition-colors"
            >
              Atlas · Home
            </Link>
          </div>

          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[0.58rem] tracking-[0.22em] uppercase">
            <Link href="/atlas" className="text-accent hover:text-text-bright transition-colors">
              Atlas
            </Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-text-dim/40">/</span>
                {c.href ? (
                  <Link href={c.href} className="text-accent hover:text-text-bright transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-text-dim/70">{c.label}</span>
                )}
              </span>
            ))}
          </nav>

          {/* Hero */}
          <header className="mb-8">
            {n.tier === 'B' && (
              <div className="mb-5 inline-flex items-baseline gap-2 px-3 py-1.5 border border-accent/20 bg-accent/5">
                <span className="font-mono text-[0.55rem] text-accent tracking-[0.22em] uppercase">
                  Notas de curso
                </span>
                <span className="font-serif italic text-[0.78rem] text-text-dim">
                  — texto derivado de aula, pode conter brevidades
                </span>
              </div>
            )}
            {hubSection && !n.html.trim() && (
              <div className="mb-5 inline-flex items-baseline gap-2 px-3 py-1.5 border border-border-subtle bg-bg-card/50">
                <span className="font-mono text-[0.55rem] text-accent tracking-[0.22em] uppercase">
                  Conceito-hub
                </span>
                <span className="font-serif italic text-[0.78rem] text-text-dim">
                  — referenciado em outras notas do Atlas
                </span>
              </div>
            )}

            <h1 className="font-serif text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.02] tracking-[-0.01em] text-text-bright mb-3">
              {n.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[0.55rem] text-text-dim tracking-[0.22em] uppercase">
              <span>{n.readingMinutes}min de leitura</span>
              <span className="text-text-dim/30">·</span>
              <span>{n.wordCount} palavras</span>
              {n.tags.length > 0 && (
                <>
                  <span className="text-text-dim/30">·</span>
                  <span className="flex flex-wrap gap-2">
                    {n.tags.slice(0, 8).map((t) => (
                      <span key={t} className="text-accent/80">
                        #{t}
                      </span>
                    ))}
                  </span>
                </>
              )}
            </div>
          </header>

          <div className="h-px w-20 bg-accent/40 mb-8" />

          {/* TOC + Body */}
          <div className={showToc ? 'lg:grid lg:grid-cols-[220px_1fr] lg:gap-10' : ''}>
            {showToc && (
              <aside className="hidden lg:block">
                <div className="sticky top-32">
                  <p className="meta-caps-accent mb-3">Neste texto</p>
                  <ul className="space-y-1.5">
                    {n.toc.map((t) => (
                      <li
                        key={t.id}
                        className={t.level === 3 ? 'pl-3 text-[0.78rem]' : 'text-[0.84rem]'}
                      >
                        <a
                          href={`#${t.id}`}
                          className="text-text-dim hover:text-accent transition-colors block leading-snug line-clamp-3"
                          title={t.text}
                        >
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}

            <div>
              {hubSection && !n.html.trim() ? (
                <p className="font-serif italic text-text-dim leading-[1.85] mb-10">
                  Esta é uma página-hub para o conceito <strong className="text-text-bright not-italic">{n.title}</strong>.
                  O termo aparece em outras notas do Atlas — veja as referências abaixo.
                </p>
              ) : (
                <div
                  className="prose-atlas"
                  dangerouslySetInnerHTML={{ __html: n.html }}
                />
              )}
            </div>
          </div>

          {/* Prev / Next */}
          {(n.prev || n.next) && (
            <nav className="mt-16 pt-10 border-t border-border-subtle grid gap-4 md:grid-cols-2">
              {n.prev ? (
                <Link
                  href={`/atlas/${n.prev.section}/${n.prev.slug}`}
                  className="group block p-5 border border-border-subtle hover:border-accent/40 bg-bg-card/40 transition-colors"
                >
                  <p className="font-mono text-[0.55rem] text-text-dim tracking-[0.22em] uppercase mb-1.5 flex items-center gap-2">
                    <span className="text-accent group-hover:-translate-x-0.5 transition-transform">←</span>
                    Anterior
                  </p>
                  <p className="font-serif text-[1.02rem] text-text-bright group-hover:text-accent transition-colors leading-snug">
                    {n.prev.title}
                  </p>
                </Link>
              ) : <div />}
              {n.next ? (
                <Link
                  href={`/atlas/${n.next.section}/${n.next.slug}`}
                  className="group block p-5 border border-border-subtle hover:border-accent/40 bg-bg-card/40 transition-colors md:text-right"
                >
                  <p className="font-mono text-[0.55rem] text-text-dim tracking-[0.22em] uppercase mb-1.5 flex items-center gap-2 md:justify-end">
                    Próxima
                    <span className="text-accent group-hover:translate-x-0.5 transition-transform">→</span>
                  </p>
                  <p className="font-serif text-[1.02rem] text-text-bright group-hover:text-accent transition-colors leading-snug">
                    {n.next.title}
                  </p>
                </Link>
              ) : <div />}
            </nav>
          )}

          {/* Rodapé: relações */}
          <footer className="mt-12 pt-10 border-t border-border-subtle grid gap-10 md:grid-cols-2">
            {(n.wikilinksOut || []).length > 0 && (
              <div>
                <p className="meta-caps-accent mb-3">Conceitos citados</p>
                <ul className="space-y-1.5">
                  {n.wikilinksOut.map((l) => (
                    <li key={`${l.section}/${l.slug}`}>
                      <Link
                        href={`/atlas/${l.section}/${l.slug}`}
                        className="font-serif text-text hover:text-accent transition-colors"
                      >
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(n.backlinks || []).length > 0 && (
              <div>
                <p className="meta-caps-accent mb-3">
                  Citada em <span className="text-text-dim/70">{n.backlinks.length}</span>
                </p>
                <ul className="space-y-1.5">
                  {n.backlinks.slice(0, 20).map((l) => (
                    <li key={`${l.section}/${l.slug}`}>
                      <Link
                        href={`/atlas/${l.section}/${l.slug}`}
                        className="font-serif text-text hover:text-accent transition-colors"
                      >
                        {l.title}
                      </Link>
                    </li>
                  ))}
                  {n.backlinks.length > 20 && (
                    <li className="font-mono text-[0.55rem] text-text-dim tracking-[0.22em] uppercase pt-2">
                      + {n.backlinks.length - 20} outras
                    </li>
                  )}
                </ul>
              </div>
            )}
          </footer>

          {/* Voltar */}
          <div className="mt-14 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border-subtle/40">
            <Link
              href={`/atlas/${n.section}`}
              className="group inline-flex items-center gap-2 font-mono text-[0.6rem] text-text-dim hover:text-accent tracking-[0.22em] uppercase transition-colors"
            >
              <span className="text-accent group-hover:-translate-x-0.5 transition-transform">←</span>
              Voltar a {section?.label}
            </Link>
            <a
              href="#top"
              className="group inline-flex items-center gap-2 font-mono text-[0.6rem] text-text-dim hover:text-accent tracking-[0.22em] uppercase transition-colors"
            >
              Topo
              <span className="text-accent group-hover:-translate-y-0.5 transition-transform">↑</span>
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </AtlasGate>
  );
}

