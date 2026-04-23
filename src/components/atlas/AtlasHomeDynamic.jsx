'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { atlasNotes, atlasSections } from '@/lib/atlas';
import { useAtlasOverrides } from '@/lib/useAtlasOverrides';

/**
 * AtlasHomeDynamic — renderiza Destaques + Mais citadas filtrados por overrides.
 * Roda client-side pra respeitar a curadoria do admin.
 */
export default function AtlasHomeDynamic() {
  const { isNoteHidden, ready } = useAtlasOverrides();

  const { featured, mostLinked, visibleCount } = useMemo(() => {
    const visible = ready ? atlasNotes.filter((n) => !isNoteHidden(n)) : atlasNotes;
    const featured = [...visible]
      .filter((n) => n.tier === 'A' && n.wordCount >= 500)
      .sort(
        (a, b) =>
          (b.backlinks?.length || 0) - (a.backlinks?.length || 0) ||
          b.wordCount - a.wordCount,
      )
      .slice(0, 9);
    const mostLinked = [...visible]
      .sort((a, b) => (b.backlinks?.length || 0) - (a.backlinks?.length || 0))
      .slice(0, 12);
    return { featured, mostLinked, visibleCount: visible.length };
  }, [ready, isNoteHidden]);

  const sectionLabels = useMemo(
    () => Object.fromEntries(atlasSections.map((s) => [s.slug, s.label])),
    [],
  );

  if (visibleCount === 0) return null;

  return (
    <>
      {/* Destaques */}
      {featured.length > 0 && (
        <section className="py-10 md:py-16 px-5 sm:px-6 md:px-12 section-border-t">
          <div className="max-w-[1180px] mx-auto">
            <header className="flex items-baseline gap-4 mb-8">
              <span className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase">
                Destaques
              </span>
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
                    {sectionLabels[n.section]}
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
    </>
  );
}
