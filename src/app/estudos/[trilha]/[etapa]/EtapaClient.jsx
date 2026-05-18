'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VisibilityGate from '@/components/VisibilityGate';
import BlockRenderer from '@/components/estudos/BlockRenderer';
import { useSitedata } from '@/lib/useSitedata';
import { useTrilhaProgress } from '@/lib/useTrilhaProgress';
import {
  getTrilhas, getMaterials, getGlossario,
  SITEDATA_KEYS,
} from '@/lib/sitedata';
import { STAGE_KIND_LABEL } from '@/data/trilhas';
import { migrateTrilhaBlocks } from '@/lib/linkResolver';
import { renderHighlightedTitle } from '@/lib/highlightTitle';

function readJsonSafe(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; } catch { return fallback; }
}

export default function EtapaClient({ initialTrilha, initialEtapaIdx, initialPosts = [], initialCourses = [] }) {
  const allTrilhas = useSitedata(getTrilhas, [initialTrilha], SITEDATA_KEYS.trilhas);
  const materials  = useSitedata(getMaterials, [], SITEDATA_KEYS.materials);
  const glossario  = useSitedata(getGlossario, [], SITEDATA_KEYS.glossario);
  const [posts, setPosts] = useState(initialPosts);
  const [courses, setCourses] = useState(initialCourses);

  useEffect(() => {
    setPosts(readJsonSafe('angelo_admin_blog', initialPosts));
    setCourses(readJsonSafe('angelo_admin_courses', initialCourses));
  }, [initialPosts, initialCourses]);

  const trilha = useMemo(() => {
    const trilhaSlug = initialTrilha.slug || initialTrilha.id;
    const found = allTrilhas.find((t) => (t.slug || t.id) === trilhaSlug);
    return found ? migrateTrilhaBlocks(found) : initialTrilha;
  }, [allTrilhas, initialTrilha]);

  const stage = trilha.stages[initialEtapaIdx] || trilha.stages.find((s) => s.slug === initialTrilha.stages[initialEtapaIdx]?.slug) || trilha.stages[initialEtapaIdx];
  const trilhaSlug = trilha.slug || trilha.id;
  const prev = initialEtapaIdx > 0 ? trilha.stages[initialEtapaIdx - 1] : null;
  const next = initialEtapaIdx < trilha.stages.length - 1 ? trilha.stages[initialEtapaIdx + 1] : null;
  const total = trilha.stages.length;
  const pct = Math.round(((initialEtapaIdx + 1) / total) * 100);

  const { isStageDone, toggleStage } = useTrilhaProgress();
  const done = isStageDone(trilha.id, stage?.title);

  const [tocOpen, setTocOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Atalhos de teclado: ← → navega entre etapas, T abre índice, M marca concluída
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onKey = (e) => {
      // Ignora se foco em input/textarea
      const tag = (e.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowLeft' && prev) {
        e.preventDefault();
        window.location.href = `/estudos/${trilhaSlug}/${prev.slug}`;
      } else if (e.key === 'ArrowRight' && next) {
        e.preventDefault();
        window.location.href = `/estudos/${trilhaSlug}/${next.slug}`;
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setTocOpen((v) => !v);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleStage(trilha.id, stage?.title);
      } else if (e.key === 'Escape' && tocOpen) {
        setTocOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, trilhaSlug, trilha.id, stage?.title, tocOpen, toggleStage]);

  // "Voltar ao topo": aparece após scrollar 400px
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!stage) return null;

  const kindLabel = STAGE_KIND_LABEL[stage.kind] || stage.kind;
  const lists = { materials, posts, courses, glossario };

  return (
    <VisibilityGate visibilityKey="estudos" title="Estudos indisponível">
      <Navbar />

      {/* Barra de progresso fixa no topo (abaixo do navbar) */}
      <div className="fixed top-[60px] left-0 right-0 z-[40] bg-bg/90 backdrop-blur-sm border-b border-border-subtle pointer-events-none">
        <div className="h-0.5 bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      <main className="pt-32 md:pt-40 pb-16">
        {/* Cover image da etapa (se houver) */}
        {stage.coverImage && (
          <div className="relative w-full max-w-[1100px] mx-auto h-[180px] md:h-[280px] mb-8 overflow-hidden">
            <img
              src={stage.coverImage}
              alt=""
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
          </div>
        )}

        {/* Breadcrumb + toggle índice */}
        <nav className="max-w-[800px] mx-auto px-5 sm:px-6 md:px-12 mb-6 flex items-center justify-between gap-3 font-mono text-[0.6rem] tracking-[0.22em] uppercase flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/estudos" className="text-accent hover:text-text-bright transition-colors">Estudos</Link>
            <span className="text-text-dim/40">/</span>
            <Link href={`/estudos/${trilhaSlug}`} className="text-accent hover:text-text-bright transition-colors">{trilha.name}</Link>
            <span className="text-text-dim/40">/</span>
            <span className="text-text-dim/70">Etapa {initialEtapaIdx + 1}</span>
          </div>
          <button
            onClick={() => setTocOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-border-subtle hover:border-accent/50 text-text-dim hover:text-accent transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Índice da trilha
          </button>
        </nav>

        <article className="max-w-[800px] mx-auto px-5 sm:px-6 md:px-12">
          {/* Header da etapa */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase px-2 py-1 border border-accent/30 text-accent bg-accent/[0.08]">
                {kindLabel}
              </span>
              <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.18em] uppercase">
                Etapa {initialEtapaIdx + 1} de {total}
              </span>
              <button
                onClick={() => toggleStage(trilha.id, stage.title)}
                aria-pressed={done}
                className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 border font-mono text-[0.55rem] tracking-[0.18em] uppercase transition-colors ${
                  done
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-border-subtle text-text-dim/60 hover:border-accent/50 hover:text-accent'
                }`}
              >
                <span className={`w-3 h-3 border flex items-center justify-center ${done ? 'border-accent bg-accent' : 'border-border-hover'}`}>
                  {done && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#0E0C0A" strokeWidth="3" className="w-full h-full">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                </span>
                {done ? 'Concluída' : 'Marcar concluída'}
              </button>
            </div>

            <h1 className="font-serif text-[clamp(2.2rem,4.5vw,3.4rem)] leading-[1.05] tracking-[-0.01em] text-text-bright mb-4">
              {renderHighlightedTitle(stage.title)}
            </h1>
            {stage.summary && (
              <p className="font-serif italic text-accent-soft text-[1.05rem] md:text-[1.15rem] leading-snug">
                {stage.summary}
              </p>
            )}
          </header>

          {/* Blocos */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {(stage.blocks || []).map((block, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.4 }}
              >
                <BlockRenderer block={block} lists={lists} />
              </motion.div>
            ))}

            {(!stage.blocks || stage.blocks.length === 0) && (
              <div className="my-8 p-6 border border-dashed border-border-subtle text-center">
                <p className="font-serif italic text-text-dim">Esta etapa ainda não tem conteúdo publicado.</p>
              </div>
            )}
          </motion.div>

          {/* Navegação anterior/próxima */}
          <nav className="mt-16 pt-8 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prev ? (
              <Link
                href={`/estudos/${trilhaSlug}/${prev.slug}`}
                className="group block bg-bg-card border border-border-subtle hover:border-accent/40 transition-colors p-4"
              >
                <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-text-dim/70 mb-1 inline-block">← Anterior</span>
                <p className="font-serif text-text-bright group-hover:text-accent transition-colors text-[0.95rem] leading-tight">
                  {prev.title}
                </p>
              </Link>
            ) : <div />}
            {next ? (
              <Link
                href={`/estudos/${trilhaSlug}/${next.slug}`}
                className="group block bg-bg-card border border-border-subtle hover:border-accent/40 transition-colors p-4 text-right"
              >
                <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-text-dim/70 mb-1 inline-block">Próxima →</span>
                <p className="font-serif text-text-bright group-hover:text-accent transition-colors text-[0.95rem] leading-tight">
                  {next.title}
                </p>
              </Link>
            ) : (
              <Link
                href={`/estudos/${trilhaSlug}`}
                className="group block bg-accent/10 border border-accent/40 hover:bg-accent/15 transition-colors p-4 text-right"
              >
                <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-accent mb-1 inline-block">Fim da trilha</span>
                <p className="font-serif text-text-bright text-[0.95rem] leading-tight">
                  Voltar para o sumário
                </p>
              </Link>
            )}
          </nav>
        </article>
      </main>

      {/* Botão voltar ao topo */}
      {showTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Voltar ao topo"
          className="fixed bottom-6 right-6 z-[50] w-11 h-11 bg-accent text-bg rounded-full shadow-lg shadow-black/30 hover:bg-text-bright transition-colors flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Tooltip de atalhos no footer */}
      <div className="max-w-[800px] mx-auto px-5 sm:px-6 md:px-12 pb-4 -mt-8 text-center">
        <p className="font-mono text-[0.55rem] text-text-dim/40 tracking-[0.18em] uppercase">
          ← anterior · → próxima · T índice · M marcar concluída
        </p>
      </div>

      {/* Índice flutuante (drawer lateral direita) */}
      {tocOpen && (
        <>
          <div onClick={() => setTocOpen(false)} className="fixed inset-0 bg-black/60 z-[60]" />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-[61] w-full sm:w-[380px] bg-bg-card border-l border-accent/30 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase">Trilha</p>
                <button onClick={() => setTocOpen(false)} className="w-8 h-8 flex items-center justify-center text-text-dim hover:text-accent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </div>
              <h2 className="font-serif text-xl text-text-bright leading-tight mb-5">{trilha.name}</h2>
              <ol className="space-y-1">
                {trilha.stages.map((s, i) => {
                  const isCurrent = i === initialEtapaIdx;
                  const stageDone = isStageDone(trilha.id, s.title);
                  return (
                    <li key={s.id || i}>
                      <Link
                        href={`/estudos/${trilhaSlug}/${s.slug}`}
                        onClick={() => setTocOpen(false)}
                        className={`flex items-baseline gap-3 px-3 py-2.5 border-l-2 transition-colors ${
                          isCurrent
                            ? 'border-accent bg-accent/10 text-text-bright'
                            : stageDone
                              ? 'border-accent/40 text-text-dim hover:text-accent hover:bg-accent/5'
                              : 'border-border-subtle text-text-dim hover:text-accent hover:border-accent/30'
                        }`}
                      >
                        <span className="font-mono italic text-accent/70 text-sm">{String(i + 1).padStart(2, '0')}</span>
                        <span className="font-serif text-[0.92rem] leading-tight flex-1">{s.title}</span>
                        {stageDone && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent flex-shrink-0">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          </motion.aside>
        </>
      )}

      <Footer />
    </VisibilityGate>
  );
}
