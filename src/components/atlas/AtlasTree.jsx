'use client';

import { useState } from 'react';
import Link from 'next/link';

// Profundidade até a qual pastas começam expandidas.
const DEFAULT_EXPANDED_DEPTH = 1;

export default function AtlasTree({ tree }) {
  // caminho completo "A / B / C" → boolean
  const [open, setOpen] = useState(() => {
    const init = {};
    const walk = (node, path, depth) => {
      if (node.type === 'folder') {
        const p = path;
        init[p] = depth < DEFAULT_EXPANDED_DEPTH;
      }
      for (const f of node.children || []) {
        walk(f, (path ? path + '/' : '') + f.raw, depth + 1);
      }
    };
    for (const f of tree.children || []) walk(f, f.raw, 0);
    return init;
  });

  const toggleAll = (value) => {
    const next = {};
    const walk = (node, path) => {
      if (node.type === 'folder') next[path] = value;
      for (const f of node.children || []) {
        walk(f, (path ? path + '/' : '') + f.raw);
      }
    };
    for (const f of tree.children || []) walk(f, f.raw);
    setOpen(next);
  };

  return (
    <div>
      {/* Controles expandir/recolher tudo */}
      <div className="flex items-center gap-3 mb-5 font-mono text-[0.55rem] tracking-[0.22em] uppercase">
        <button
          onClick={() => toggleAll(true)}
          className="text-text-dim hover:text-accent transition-colors"
        >
          Expandir tudo
        </button>
        <span className="text-text-dim/30">·</span>
        <button
          onClick={() => toggleAll(false)}
          className="text-text-dim hover:text-accent transition-colors"
        >
          Recolher tudo
        </button>
      </div>

      {/* Notas soltas na raiz da seção (sem subpasta) */}
      {tree.notes.length > 0 && (
        <ul className="mb-6 divide-y divide-border-subtle/30">
          {tree.notes.map((n) => (
            <NoteRow key={`${n.section}/${n.slug}`} note={n} />
          ))}
        </ul>
      )}

      {/* Árvore de pastas */}
      <ul>
        {tree.children.map((f) => (
          <TreeFolder key={f.raw} folder={f} path={f.raw} depth={0} open={open} setOpen={setOpen} />
        ))}
      </ul>
    </div>
  );
}

function TreeFolder({ folder, path, depth, open, setOpen }) {
  const isOpen = !!open[path];
  const toggle = () => setOpen((o) => ({ ...o, [path]: !o[path] }));
  // indent visual por nível
  const indent = depth === 0 ? '' : `pl-${Math.min(depth * 4, 12)}`;

  return (
    <li className={depth === 0 ? 'mb-3 border-l border-border-subtle/30' : 'border-l border-border-subtle/20'}>
      <button
        onClick={toggle}
        className="w-full group flex items-center gap-2.5 text-left py-2 px-3 hover:bg-accent/5 transition-colors"
      >
        <span
          className="inline-block w-3 text-accent/70 group-hover:text-accent text-[0.75rem] leading-none transition-transform"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▸
        </span>
        <span
          className={`font-serif flex-1 truncate ${
            depth === 0 ? 'text-[1.08rem] text-text-bright' : 'text-[0.96rem] text-text'
          }`}
        >
          {folder.label}
        </span>
        <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.18em]">
          {folder.totalNotes}
        </span>
      </button>

      {isOpen && (
        <div className="ml-4 pl-1 border-l border-border-subtle/20">
          {/* notas direto nesta pasta */}
          {folder.notes.length > 0 && (
            <ul className="divide-y divide-border-subtle/20">
              {folder.notes.map((n) => (
                <NoteRow key={`${n.section}/${n.slug}`} note={n} dense />
              ))}
            </ul>
          )}
          {/* subpastas */}
          {folder.children.length > 0 && (
            <ul>
              {folder.children.map((sub) => (
                <TreeFolder
                  key={sub.raw}
                  folder={sub}
                  path={path + '/' + sub.raw}
                  depth={depth + 1}
                  open={open}
                  setOpen={setOpen}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}

function NoteRow({ note, dense }) {
  return (
    <li>
      <Link
        href={`/atlas/${note.section}/${note.slug}`}
        className="group flex items-baseline gap-3 py-2 px-3 hover:bg-accent/5 transition-colors"
      >
        <span className="text-accent/50 group-hover:text-accent text-[0.7rem] leading-none">·</span>
        <span
          className={`font-serif flex-1 truncate text-text-bright group-hover:text-accent transition-colors ${
            dense ? 'text-[0.95rem]' : 'text-[1.02rem]'
          }`}
        >
          {note.title}
        </span>
        {note.tier === 'B' && (
          <span className="font-mono text-[0.5rem] text-accent/70 tracking-[0.2em] uppercase">
            curso
          </span>
        )}
        <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.2em] whitespace-nowrap">
          {note.readingMinutes}min
        </span>
      </Link>
    </li>
  );
}
