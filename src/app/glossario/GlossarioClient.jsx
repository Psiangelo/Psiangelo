'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import VisibilityGate from '@/components/VisibilityGate';
import { useSitedata } from '@/lib/useSitedata';
import {
  getGlossario, getGlossarioCategories, getGlossarioPage,
  DEFAULT_GLOSSARIO_CATEGORIES, DEFAULT_GLOSSARIO_PAGE,
  SITEDATA_KEYS,
} from '@/lib/sitedata';

export default function GlossarioClient({ initialList, initialCategories }) {
  const list       = useSitedata(getGlossario, initialList,           SITEDATA_KEYS.glossario);
  const categories = useSitedata(getGlossarioCategories, initialCategories, SITEDATA_KEYS.glossarioCategories);
  const pageData   = useSitedata(getGlossarioPage, DEFAULT_GLOSSARIO_PAGE,  SITEDATA_KEYS.glossarioPage);
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();

  // Filtra ocultos, busca (termo + aliases) e agrupa por categoria, na
  // ordem definida pelo admin
  const grouped = useMemo(() => {
    const visible = list.filter((t) => !t.hidden);
    const filtered = normalizedQuery
      ? visible.filter((t) => {
          const haystack = [t.term, ...(t.aliases || [])].join(' ').toLowerCase();
          return haystack.includes(normalizedQuery);
        })
      : visible;
    const map = new Map(categories.map((c) => [c.slug, { cat: c, items: [] }]));
    const orphans = [];
    for (const t of filtered) {
      if (map.has(t.category)) map.get(t.category).items.push(t);
      else orphans.push(t);
    }
    return { groups: Array.from(map.values()), orphans };
  }, [list, categories, normalizedQuery]);

  const totalVisible = list.filter((t) => !t.hidden).length;
  const totalFiltered = grouped.groups.reduce((sum, g) => sum + g.items.length, 0) + grouped.orphans.length;

  return (
    <VisibilityGate visibilityKey="glossario" title="Glossário indisponível">
      <Navbar />
      <main>
        <PageHero
          eyebrow={pageData.hero.eyebrow}
          title={pageData.hero.title}
          emphasis={pageData.hero.emphasis}
          kicker={pageData.hero.kicker}
          lead={pageData.hero.lead?.replace?.('{count}', totalVisible) || pageData.hero.lead}
        />

        <section className="py-8 md:py-16 px-5 sm:px-6 md:px-12">
          <div className="max-w-[1100px] mx-auto">
            <div className="mb-10 max-w-md">
              <label htmlFor="glossario-search" className="sr-only">Buscar termo</label>
              <div className="relative">
                <input
                  id="glossario-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar termo (ex.: si mesmo, máscara, sombra...)"
                  className="w-full bg-bg-card border border-border-subtle focus:border-accent/60 outline-none transition-colors px-4 py-2.5 text-sm font-sans text-text placeholder:text-text-dim/60"
                />
              </div>
              {normalizedQuery && (
                <p className="mt-2 font-mono text-[0.6rem] tracking-[0.18em] uppercase text-text-dim/70">
                  {totalFiltered} {totalFiltered === 1 ? 'resultado' : 'resultados'}
                </p>
              )}
            </div>

            {grouped.groups.map(({ cat, items }) => {
              if (items.length === 0) return null;
              return (
                <section key={cat.slug} className="mb-14">
                  <header className="flex items-baseline gap-4 mb-5">
                    <span className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase">
                      {cat.label}
                    </span>
                    <span className="flex-1 h-px bg-border-subtle" />
                    <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">
                      {items.length}
                    </span>
                  </header>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((term) => (
                      <Link
                        key={term.slug}
                        href={`/glossario/${term.slug}`}
                        className="group block bg-bg-card border border-border-subtle hover:border-accent/40 transition-colors p-4"
                      >
                        <h3 className="font-serif text-lg text-text-bright group-hover:text-accent transition-colors mb-1.5">
                          {term.term}
                        </h3>
                        <p className="text-[0.82rem] text-text-dim leading-[1.6] line-clamp-3">
                          {term.short}
                        </p>
                        {(term.links || []).length > 0 && (
                          <span className="inline-block mt-2 font-mono text-[0.5rem] tracking-[0.18em] uppercase text-accent/70">
                            +{term.links.length} {term.links.length === 1 ? 'link' : 'links'}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}

            {grouped.orphans.length > 0 && (
              <section className="mb-14">
                <header className="flex items-baseline gap-4 mb-5">
                  <span className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase">Outros</span>
                  <span className="flex-1 h-px bg-border-subtle" />
                  <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">{grouped.orphans.length}</span>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {grouped.orphans.map((term) => (
                    <Link
                      key={term.slug}
                      href={`/glossario/${term.slug}`}
                      className="group block bg-bg-card border border-border-subtle hover:border-accent/40 transition-colors p-4"
                    >
                      <h3 className="font-serif text-lg text-text-bright group-hover:text-accent transition-colors mb-1.5">
                        {term.term}
                      </h3>
                      <p className="text-[0.82rem] text-text-dim leading-[1.6] line-clamp-3">{term.short}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {grouped.groups.every(({ items }) => items.length === 0) && grouped.orphans.length === 0 && (
              <p className="text-center font-serif italic text-text-dim py-16">
                {normalizedQuery
                  ? `Nenhum verbete encontrado para "${query.trim()}".`
                  : (pageData.empty?.emptyMessage || 'Nenhum verbete ainda.')}
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </VisibilityGate>
  );
}
