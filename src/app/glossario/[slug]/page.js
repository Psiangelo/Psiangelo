import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { glossario, getGlossarioBySlug, CATEGORIES } from '@/data/glossario';
import { materials } from '@/data/materials';

export function generateStaticParams() {
  return glossario.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }) {
  const term = getGlossarioBySlug(params.slug);
  if (!term) return {};
  return {
    title: term.term,
    description: term.short,
    openGraph: {
      title: `${term.term} · Glossário junguiano`,
      description: term.short,
      type: 'article',
    },
  };
}

function formatFull(text) {
  return text.split(/\n\n+/).filter(Boolean);
}

export default function TermoPage({ params }) {
  const term = getGlossarioBySlug(params.slug);
  if (!term) return notFound();

  const cat = CATEGORIES[term.category];
  const relatedTerms = (term.related?.terms || [])
    .map((slug) => glossario.find((g) => g.slug === slug))
    .filter(Boolean);
  const relatedMaterials = (term.related?.materials || [])
    .map((id) => materials.find((m) => m.id === id))
    .filter(Boolean);

  const paragraphs = formatFull(term.full);

  return (
    <>
      <Navbar />
      <main className="pt-28 md:pt-40 pb-16 px-5 sm:px-6 md:px-12">
        <article className="max-w-[760px] mx-auto">
          <nav className="mb-6 flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.22em] uppercase">
            <Link href="/glossario" className="text-accent hover:text-text-bright transition-colors">
              ← Glossário
            </Link>
            <span className="text-text-dim/40">/</span>
            <span className="text-text-dim/70">{cat?.label || 'Termo'}</span>
          </nav>

          <header className="mb-8">
            <h1 className="font-serif text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.02] tracking-[-0.01em] text-text-bright mb-4">
              {term.term}
            </h1>
            <p className="font-serif italic text-accent-soft text-[1.1rem] md:text-[1.2rem] leading-snug max-w-[640px]">
              {term.short}
            </p>
          </header>

          <div className="prose-glossario">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-serif text-[1.02rem] text-text leading-[1.85] mb-5"
              >
                {p}
              </p>
            ))}
          </div>

          {/* Relações */}
          {(relatedTerms.length > 0 || relatedMaterials.length > 0) && (
            <aside className="mt-14 pt-8 border-t border-border-subtle grid gap-8 md:grid-cols-2">
              {relatedTerms.length > 0 && (
                <div>
                  <p className="meta-caps-accent mb-3">Termos relacionados</p>
                  <ul className="space-y-1.5">
                    {relatedTerms.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/glossario/${t.slug}`}
                          className="font-serif text-text hover:text-accent transition-colors"
                        >
                          {t.term}
                          <span className="text-text-dim/60 text-[0.85rem] ml-2">— {t.short}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {relatedMaterials.length > 0 && (
                <div>
                  <p className="meta-caps-accent mb-3">Materiais</p>
                  <ul className="space-y-1.5">
                    {relatedMaterials.map((m) => (
                      <li key={m.id}>
                        <Link
                          href={`/materiais#${m.id}`}
                          className="font-serif text-text hover:text-accent transition-colors"
                        >
                          {m.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
