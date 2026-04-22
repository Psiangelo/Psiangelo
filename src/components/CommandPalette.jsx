'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { glossario } from '@/data/glossario';
import { materials } from '@/data/materials';
import { trilhas } from '@/data/trilhas';

const STATIC_PAGES = [
  { id: 'home',       title: 'Home',       href: '/',          hint: 'Página inicial' },
  { id: 'sobre',      title: 'Sobre',      href: '/#sobre',    hint: 'Formação e atuação' },
  { id: 'cartografia',title: 'Cartografia',href: '/#cartografia', hint: 'Mapa de conceitos' },
  { id: 'materiais',  title: 'Materiais',  href: '/materiais', hint: 'Resumos e mapas mentais' },
  { id: 'trilhas',    title: 'Trilhas',    href: '/trilhas',   hint: 'Rotas de estudo' },
  { id: 'cursos',     title: 'Cursos',     href: '/cursos',    hint: 'Formação' },
  { id: 'blog',       title: 'Blog',       href: '/blog',      hint: 'Ensaios' },
  { id: 'glossario',  title: 'Glossário',  href: '/glossario', hint: 'Termos junguianos' },
  { id: 'bio',        title: 'Bio · Links',href: '/bio',       hint: 'Linktree' },
];

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function buildIndex() {
  const idx = [];

  for (const p of STATIC_PAGES) {
    idx.push({
      type: 'page',
      typeLabel: 'Página',
      title: p.title,
      hint: p.hint,
      href: p.href,
      haystack: normalize(`${p.title} ${p.hint}`),
    });
  }

  for (const g of glossario) {
    idx.push({
      type: 'glossario',
      typeLabel: 'Glossário',
      title: g.term,
      hint: g.short,
      href: `/glossario/${g.slug}`,
      haystack: normalize(`${g.term} ${g.aliases?.join(' ') || ''} ${g.short}`),
    });
  }

  for (const m of materials) {
    idx.push({
      type: 'material',
      typeLabel: 'Material',
      title: m.title,
      hint: m.subtitle || m.description || '',
      href: `/materiais#${m.id}`,
      haystack: normalize(`${m.title} ${m.subtitle || ''} ${m.author || ''} ${(m.tags || []).join(' ')}`),
    });
  }

  for (const t of trilhas) {
    idx.push({
      type: 'trilha',
      typeLabel: 'Trilha',
      title: t.name,
      hint: t.subtitle || '',
      href: `/trilhas#${t.id}`,
      haystack: normalize(`${t.name} ${t.subtitle || ''} ${t.archetype || ''}`),
    });
  }

  return idx;
}

function searchIndex(idx, query) {
  const q = normalize(query).trim();
  if (!q) return idx.slice(0, 8); // vazio = primeiros itens
  const tokens = q.split(/\s+/).filter(Boolean);
  return idx
    .map((item) => {
      let score = 0;
      for (const t of tokens) {
        if (item.haystack.includes(t)) score += 1;
        if (normalize(item.title).startsWith(t)) score += 3;
      }
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((r) => r.item);
}

const TYPE_TONE = {
  page: 'text-text-dim',
  glossario: 'text-accent',
  material: 'text-text-bright',
  trilha: 'text-accent/80',
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const router = useRouter();

  const index = useMemo(() => buildIndex(), []);
  const results = useMemo(() => searchIndex(index, query), [index, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  // Global shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Foco no input quando abre
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  // Reset active ao mudar query
  useEffect(() => { setActive(0); }, [query]);

  // Scroll into view do active
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[active];
      if (item) {
        close();
        if (item.href.startsWith('http')) {
          window.open(item.href, '_blank', 'noopener,noreferrer');
        } else {
          router.push(item.href);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[10vh] left-1/2 -translate-x-1/2 z-[201] w-[92vw] max-w-[640px] bg-bg-warm border border-accent/25 shadow-2xl shadow-black/50 overflow-hidden"
            role="dialog"
            aria-label="Buscar no site"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border-subtle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-text-dim">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Buscar no site…"
                className="flex-1 bg-transparent font-serif italic text-lg text-text-bright placeholder:text-text-dim/50 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[0.55rem] tracking-[0.15em] text-text-dim px-2 py-1 border border-border-subtle">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[55vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-5 py-10 text-center text-text-dim font-serif italic">
                  Nada encontrado.
                </div>
              ) : (
                <ul>
                  {results.map((item, i) => (
                    <li key={`${item.type}-${item.href}-${i}`} data-idx={i}>
                      <Link
                        href={item.href}
                        onClick={close}
                        onMouseEnter={() => setActive(i)}
                        className={`flex items-baseline justify-between gap-4 px-5 py-3 border-b border-border-subtle/40 transition-colors ${
                          active === i ? 'bg-accent/10' : 'hover:bg-accent/5'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-3">
                            <span className={`font-serif text-[1rem] ${active === i ? 'text-accent' : 'text-text-bright'}`}>
                              {item.title}
                            </span>
                            <span className={`font-mono text-[0.55rem] tracking-[0.2em] uppercase flex-shrink-0 ${TYPE_TONE[item.type] || 'text-text-dim'}`}>
                              {item.typeLabel}
                            </span>
                          </div>
                          {item.hint && (
                            <p className="text-[0.82rem] text-text-dim mt-0.5 line-clamp-1">
                              {item.hint}
                            </p>
                          )}
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`flex-shrink-0 ${active === i ? 'text-accent' : 'text-text-dim/40'}`}>
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-border-subtle bg-bg-card/40">
              <div className="flex gap-4 text-[0.55rem] text-text-dim/70 font-mono tracking-[0.18em] uppercase">
                <span>↑↓ Navegar</span>
                <span>↵ Abrir</span>
              </div>
              <span className="text-[0.55rem] text-text-dim/50 font-mono tracking-[0.18em] uppercase">
                {results.length} resultados
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
