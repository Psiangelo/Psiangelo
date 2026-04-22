'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionLabel from '@/components/SectionLabel';
import PageHero from '@/components/ui/PageHero';
import { MaterialCardFull } from '@/components/materiais/MaterialCard';
import { materials, comingSoon, contentTypeLabels } from '@/data/materials';
import { fadeUp, stagger } from '@/lib/constants';
import { img } from '@/lib/basepath';
import HiddenPlaceholder from '@/components/HiddenPlaceholder';
import { useVisibility } from '@/lib/useVisibility';

/* ========================================
   HERO
======================================== */
function MateriaisHero() {
  return (
    <PageHero
      eyebrow="Catálogo · Resumos & Mapas Mentais"
      title="Materiais"
      emphasis="de estudo"
      kicker="Resumos e mapas no Obsidian"
      lead="Materiais que uso para estudar e ensinar — resumos, mapas e diagramas. Cada item indica seu formato."
      actions={
        <>
          <a
            href="#catalogo"
            className="group relative inline-flex items-center gap-3 px-7 py-3.5 font-sans text-[0.74rem] font-semibold tracking-[0.18em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/15"
          >
            Ir ao catálogo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <Link
            href="/#cartografia"
            className="font-sans text-[0.7rem] font-medium tracking-[0.18em] uppercase text-text-dim hover:text-accent transition-colors link-underline"
          >
            Ver cartografia
          </Link>
        </>
      }
    />
  );
}

/* ========================================
   EXPLANATION — compacta, 1 linha de 3 bullets
======================================== */
function Explanation() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const features = [
    { title: 'Feitos no Obsidian',     desc: 'Resumos interconectados com links entre conceitos.' },
    { title: 'Mapas mentais completos', desc: 'Diagramas detalhados — alguns bastam por si só.' },
    { title: 'Percepção clínica',      desc: 'Misturados com experiência de atendimento.' },
  ];

  return (
    <section ref={ref} className="py-10 md:py-14 px-5 sm:px-6 md:px-12 bg-bg-warm section-border-t section-border-b">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1280px] mx-auto"
      >
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {features.map((feat) => (
            <motion.div key={feat.title} variants={fadeUp} className="border-l-2 border-accent/30 pl-4">
              <h3 className="font-serif text-base text-text-bright leading-tight mb-1.5">{feat.title}</h3>
              <p className="text-[0.85rem] text-text-dim leading-[1.7]">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ========================================
   CATALOG — sidebar 240px + grid bento
======================================== */
const ALL_AUTHORS = Array.from(new Set(materials.map((m) => m.author).filter(Boolean))).sort();
const ALL_TAGS    = Array.from(new Set(materials.flatMap((m) => m.tags || []))).sort();
const ALL_FORMATS = Object.keys(contentTypeLabels);

// Filtro multi-seleção: arrays vazios = "todos"
const initialFilters = {
  category: [],   // ['livro','tema']
  format:   [],   // ['resumo','mapa','resumo-mapa']
  author:   [],   // string[]
  tags:     [],   // string[]
};

function FilterSection({ title, options, selected, onToggle, counts }) {
  return (
    <div className="border-b border-border-subtle py-5 first:pt-0">
      <p className="meta-caps-accent mb-3">{title}</p>
      <ul className="space-y-1.5">
        {options.map((opt) => {
          const active = selected.includes(opt.value);
          const count = counts?.[opt.value] ?? null;
          return (
            <li key={opt.value}>
              <button
                onClick={() => onToggle(opt.value)}
                className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 text-left transition-colors group ${
                  active ? 'text-accent' : 'text-text-dim hover:text-accent'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span
                    className={`w-3 h-3 border flex-shrink-0 transition-colors ${
                      active
                        ? 'border-accent bg-accent'
                        : 'border-border-hover group-hover:border-accent/50'
                    }`}
                  >
                    {active && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#0E0C0A" strokeWidth="3" className="w-full h-full">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-[0.82rem] truncate ${active ? 'font-medium' : ''}`}>
                    {opt.label}
                  </span>
                </span>
                {count !== null && (
                  <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.15em] flex-shrink-0">
                    {count}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FilterPanel({ filters, setFilters, onClear, total, filteredCount, hideHeader }) {
  const toggle = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const counts = useMemo(() => {
    const byCat = {}, byFmt = {}, byAuth = {}, byTag = {};
    materials.forEach((m) => {
      byCat[m.category] = (byCat[m.category] || 0) + 1;
      byFmt[m.contentType] = (byFmt[m.contentType] || 0) + 1;
      if (m.author) byAuth[m.author] = (byAuth[m.author] || 0) + 1;
      (m.tags || []).forEach((t) => { byTag[t] = (byTag[t] || 0) + 1; });
    });
    return { category: byCat, format: byFmt, author: byAuth, tags: byTag };
  }, []);

  const totalActive = Object.values(filters).reduce((s, arr) => s + arr.length, 0);

  return (
    <>
      {!hideHeader && (
        <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-accent/20">
          <p className="meta-caps-accent">Filtros</p>
          {totalActive > 0 ? (
            <button
              onClick={onClear}
              className="font-mono text-[0.55rem] text-accent tracking-[0.18em] uppercase hover:text-text-bright transition-colors"
            >
              limpar ({totalActive})
            </button>
          ) : (
            <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.18em]">
              {filteredCount}/{total}
            </span>
          )}
        </div>
      )}

      <FilterSection
        title="Categoria"
        selected={filters.category}
        counts={counts.category}
        onToggle={(v) => toggle('category', v)}
        options={[
          { value: 'livro', label: 'Livros' },
          { value: 'tema',  label: 'Temas' },
        ]}
      />

      <FilterSection
        title="Formato"
        selected={filters.format}
        counts={counts.format}
        onToggle={(v) => toggle('format', v)}
        options={ALL_FORMATS.map((f) => ({ value: f, label: contentTypeLabels[f].label }))}
      />

      <FilterSection
        title="Autor"
        selected={filters.author}
        counts={counts.author}
        onToggle={(v) => toggle('author', v)}
        options={ALL_AUTHORS.map((a) => ({ value: a, label: a }))}
      />

      <FilterSection
        title="Tags"
        selected={filters.tags}
        counts={counts.tags}
        onToggle={(v) => toggle('tags', v)}
        options={ALL_TAGS.map((t) => ({ value: t, label: t }))}
      />
    </>
  );
}

function FilterDrawer({ open, onClose, filters, setFilters, onClear, total, filteredCount }) {
  const totalActive = Object.values(filters).reduce((s, arr) => s + arr.length, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-[90]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[91] bg-bg-warm border-t border-accent/30 rounded-t-2xl max-h-[85vh] flex flex-col sm:max-w-[480px] sm:left-1/2 sm:-translate-x-1/2 sm:rounded-t-2xl"
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border-subtle">
              <div>
                <p className="meta-caps-accent">Filtros</p>
                <p className="text-[0.7rem] text-text-dim mt-0.5">
                  {filteredCount} de {total} materiais
                </p>
              </div>
              <div className="flex items-center gap-3">
                {totalActive > 0 && (
                  <button
                    onClick={onClear}
                    className="font-mono text-[0.6rem] text-accent tracking-[0.18em] uppercase px-3 py-1.5 border border-accent/30 rounded"
                  >
                    limpar ({totalActive})
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Fechar"
                  className="w-9 h-9 flex items-center justify-center text-text-dim hover:text-accent"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-4">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                onClear={onClear}
                total={total}
                filteredCount={filteredCount}
                hideHeader
              />
            </div>

            <div className="px-5 py-3 border-t border-border-subtle bg-bg-card/50">
              <button
                onClick={onClose}
                className="w-full py-3 bg-accent hover:bg-text-bright transition-colors text-bg font-sans text-[0.72rem] font-semibold tracking-[0.18em] uppercase"
              >
                Ver {filteredCount} resultados
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ============== TILE TEMA — compacto uniforme ============== */
function TemaTile({ material }) {
  const typeInfo = contentTypeLabels[material.contentType];
  const image = material.image
    ? (material.image.startsWith('http') ? material.image : img(material.image))
    : null;

  return (
    <motion.article
      layout
      id={material.id}
      className="group relative bg-bg-card border border-border-subtle overflow-hidden flex flex-col hover:border-border-hover transition-colors min-h-[160px]"
    >
      {image && (
        <div className="absolute inset-0">
          <img
            src={image}
            alt={material.title}
            className="w-full h-full object-cover opacity-35 group-hover:opacity-55 transition-opacity duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/90 to-bg/40" />
        </div>
      )}

      <div className="relative z-10 p-4 flex flex-col h-full gap-2">
        {typeInfo && (
          <span className="self-start font-mono text-[0.5rem] tracking-[0.18em] uppercase px-1.5 py-0.5 text-accent/80">
            {typeInfo.label}
          </span>
        )}

        <div className="mt-auto">
          <h3 className="font-serif text-[0.95rem] text-text-bright leading-tight group-hover:text-accent transition-colors">
            {material.title}
          </h3>
          {material.available && (
            <a
              href={material.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-2 inline-flex items-center gap-1.5 font-mono text-[0.55rem] tracking-[0.18em] uppercase text-accent hover:text-text-bright transition-colors"
            >
              {material.price} →
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function Catalog() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      if (filters.category.length && !filters.category.includes(m.category)) return false;
      if (filters.format.length   && !filters.format.includes(m.contentType)) return false;
      if (filters.author.length   && !filters.author.includes(m.author)) return false;
      if (filters.tags.length) {
        const has = (m.tags || []).some((t) => filters.tags.includes(t));
        if (!has) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const hay = [m.title, m.subtitle, m.description, ...(m.tags || [])].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filters, search]);

  const livros = filtered.filter((m) => m.category === 'livro');
  const temas  = filtered.filter((m) => m.category === 'tema');
  const totalActiveFilters = Object.values(filters).reduce((s, arr) => s + arr.length, 0);

  return (
    <section id="catalogo" ref={ref} className="py-10 md:py-16 px-5 sm:px-6 md:px-12">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1100px] mx-auto"
      >
        <div className="mb-6">
          <SectionLabel label="Catálogo" />
        </div>

        <FilterDrawer
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filters={filters}
          setFilters={setFilters}
          onClear={() => setFilters(initialFilters)}
          total={materials.length}
          filteredCount={filtered.length}
        />

        {/* Barra de busca + botão Filtros */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex-1 relative border-b border-border-subtle focus-within:border-accent/50 transition-colors">
            <svg
              className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-transparent text-text-bright placeholder:text-text-dim/50 focus:outline-none font-serif italic text-[0.95rem]"
            />
          </div>

          <button
            onClick={() => setFiltersOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 border border-border-subtle hover:border-accent/50 text-text-dim hover:text-accent font-mono text-[0.6rem] tracking-[0.18em] uppercase transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M6 12h12M10 18h4" />
            </svg>
            Filtros
            {totalActiveFilters > 0 && (
              <span className="ml-1 min-w-[16px] h-[16px] px-1 rounded-full bg-accent text-bg flex items-center justify-center text-[0.55rem] font-sans font-semibold">
                {totalActiveFilters}
              </span>
            )}
          </button>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 border border-border-subtle border-dashed">
            <p className="font-serif italic text-text-dim mb-4">Nenhum material com esses filtros.</p>
            <button
              onClick={() => { setFilters(initialFilters); setSearch(''); }}
              className="font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase hover:text-text-bright transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* LIVROS */}
        {livros.length > 0 && (
          <div className="mb-12">
            <header className="flex items-baseline gap-4 mb-4">
              <span className="font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase">Livros</span>
              <span className="flex-1 h-px bg-border-subtle" />
              <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">{livros.length}</span>
            </header>
            <div className="flex flex-col gap-3">
              {livros.map((mat) => (
                <MaterialCardFull key={mat.id} material={mat} />
              ))}
            </div>
          </div>
        )}

        {/* TEMAS — grid uniforme */}
        {temas.length > 0 && (
          <div>
            <header className="flex items-baseline gap-4 mb-4">
              <span className="font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase">Temas</span>
              <span className="flex-1 h-px bg-border-subtle" />
              <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">{temas.length}</span>
            </header>
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              <AnimatePresence mode="popLayout">
                {temas.map((mat) => (
                  <TemaTile key={mat.id} material={mat} />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* EM BREVE */}
        {comingSoon.length > 0 && (
          <motion.div variants={fadeUp} className="mt-14">
            <header className="flex items-baseline gap-4 mb-4">
              <span className="font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase">Em breve</span>
              <span className="flex-1 h-px bg-border-subtle" />
              <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">{comingSoon.length}</span>
            </header>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
              {comingSoon.map((title) => (
                <li key={title} className="py-1.5 text-text-dim/60 font-serif text-[0.88rem] leading-tight">
                  {title}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

/* ========================================
   PAGE
======================================== */
export default function MateriaisPage() {
  const { visibility, ready } = useVisibility();
  if (ready && !visibility.materiais) {
    return <HiddenPlaceholder title="Materiais indisponíveis" />;
  }
  return (
    <>
      <Navbar />
      <main>
        <MateriaisHero />
        <Explanation />
        <Catalog />
      </main>
      <Footer />
    </>
  );
}
