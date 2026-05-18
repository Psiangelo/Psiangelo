'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VisibilityGate from '@/components/VisibilityGate';
import { useSitedata } from '@/lib/useSitedata';
import {
  getGlossario, getGlossarioCategories, getMaterials,
  SITEDATA_KEYS,
} from '@/lib/sitedata';
import { resolveLink } from '@/lib/linkResolver';

function formatFull(text) {
  return (text || '').split(/\n\n+/).filter(Boolean);
}

export default function TermoClient({ initialTermo, initialList, initialCategories, initialPosts = [], initialCourses = [] }) {
  const list       = useSitedata(getGlossario, initialList, SITEDATA_KEYS.glossario);
  const categories = useSitedata(getGlossarioCategories, initialCategories, SITEDATA_KEYS.glossarioCategories);
  const materials  = useSitedata(getMaterials, [], SITEDATA_KEYS.materials);

  // Resolve verbete atual via list (admin pode ter editado)
  const term = useMemo(() => {
    return list.find((t) => t.slug === initialTermo.slug) || initialTermo;
  }, [list, initialTermo]);

  const cat = categories.find((c) => c.slug === term.category);
  const relatedTerms = (term.related?.terms || [])
    .map((slug) => list.find((g) => g.slug === slug))
    .filter(Boolean);
  const relatedMaterials = (term.related?.materials || [])
    .map((id) => materials.find((m) => m.id === id))
    .filter(Boolean);
  const paragraphs = formatFull(term.full);

  const lists = { materials, posts: initialPosts, courses: initialCourses, glossario: list };
  const resolvedLinks = (term.links || []).map((l) => resolveLink(l, lists));

  return (
    <VisibilityGate visibilityKey="glossario" title="Glossário indisponível">
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
              <p key={i} className="font-serif text-[1.02rem] text-text leading-[1.85] mb-5">
                {p}
              </p>
            ))}
          </div>

          {/* Embeds inline (YouTube/Drive) */}
          {resolvedLinks.some((r) => r.embed && r.embed.provider !== 'raw') && (
            <div className="mt-10 space-y-6">
              {resolvedLinks
                .filter((r) => r.embed && r.embed.provider !== 'raw')
                .map((r, i) => (
                  <div key={i}>
                    <p className="meta-caps-accent mb-2">{r.kindLabel}</p>
                    <div className="aspect-video bg-bg-card border border-border-subtle">
                      <iframe
                        src={r.embed.src}
                        title={r.label}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    {r.label && <p className="font-serif italic text-text-dim text-sm mt-2">{r.label}</p>}
                  </div>
                ))}
            </div>
          )}

          {/* Links externos (post do blog, materiais, url) — sem embed */}
          {resolvedLinks.some((r) => !r.embed && r.href) && (
            <aside className="mt-10 pt-8 border-t border-border-subtle">
              <p className="meta-caps-accent mb-3">Conteúdos relacionados</p>
              <ul className="space-y-2">
                {resolvedLinks
                  .filter((r) => !r.embed && r.href)
                  .map((r, i) => {
                    const inner = (
                      <>
                        <span className="font-serif text-text hover:text-accent transition-colors">{r.label}</span>
                        <span className="text-text-dim/60 font-mono text-[0.6rem] tracking-[0.18em] uppercase ml-2">{r.kindLabel}</span>
                      </>
                    );
                    return (
                      <li key={i}>
                        {r.isExternal ? (
                          <a href={r.href} target="_blank" rel="noopener noreferrer">{inner}</a>
                        ) : (
                          <Link href={r.href}>{inner}</Link>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </aside>
          )}

          {/* Termos relacionados + materiais (legacy related) */}
          {(relatedTerms.length > 0 || relatedMaterials.length > 0) && (
            <aside className="mt-14 pt-8 border-t border-border-subtle grid gap-8 md:grid-cols-2">
              {relatedTerms.length > 0 && (
                <div>
                  <p className="meta-caps-accent mb-3">Termos relacionados</p>
                  <ul className="space-y-1.5">
                    {relatedTerms.map((t) => (
                      <li key={t.slug}>
                        <Link href={`/glossario/${t.slug}`} className="font-serif text-text hover:text-accent transition-colors">
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
                        <Link href={`/materiais#${m.id}`} className="font-serif text-text hover:text-accent transition-colors">
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
    </VisibilityGate>
  );
}
