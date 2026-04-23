'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { atlasNotes } from '@/lib/atlas';
import { useAtlasOverrides } from '@/lib/useAtlasOverrides';

export default function AtlasIndexContent() {
  const { isNoteHidden, ready } = useAtlasOverrides();

  const { groups, letters } = useMemo(() => {
    const visible = (ready ? atlasNotes.filter((n) => !isNoteHidden(n)) : atlasNotes)
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title, 'pt'));
    const groups = new Map();
    for (const n of visible) {
      const first = n.title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .charAt(0)
        .toUpperCase();
      const letter = /[A-Z]/.test(first) ? first : '#';
      if (!groups.has(letter)) groups.set(letter, []);
      groups.get(letter).push(n);
    }
    return { groups, letters: [...groups.keys()].sort() };
  }, [ready, isNoteHidden]);

  return (
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

      {letters.length === 0 && (
        <p className="font-serif italic text-text-dim text-center py-12">
          Nenhuma nota publicada no momento.
        </p>
      )}
    </div>
  );
}
