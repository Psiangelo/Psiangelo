'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VisibilityGate from '@/components/VisibilityGate';
import { useSitedata } from '@/lib/useSitedata';
import { useTrilhaProgress } from '@/lib/useTrilhaProgress';
import { fadeUp, stagger } from '@/lib/constants';
import { getTrilhas, SITEDATA_KEYS } from '@/lib/sitedata';
import { TRILHA_TONE, STAGE_KIND_LABEL } from '@/data/trilhas';
import { migrateTrilhaBlocks } from '@/lib/linkResolver';
import { renderHighlightedTitle } from '@/lib/highlightTitle';

function blockSummary(block) {
  if (!block) return '';
  if (block.type === 'text') return (block.body || '').slice(0, 60);
  if (block.type === 'link') return block.link?.label || '';
  if (block.type === 'media') return block.caption || 'Vídeo';
  if (block.type === 'cartography') return 'Cartografia';
  if (block.type === 'embed') return 'Embed';
  if (block.type === 'quote') return '"' + (block.body || '').slice(0, 60) + '"';
  return '';
}

export default function TrilhaDetailClient({ initialTrilha }) {
  const allTrilhas = useSitedata(getTrilhas, [initialTrilha], SITEDATA_KEYS.trilhas);

  const trilha = useMemo(() => {
    const found = allTrilhas.find((t) => (t.slug || t.id) === (initialTrilha.slug || initialTrilha.id));
    return found ? migrateTrilhaBlocks(found) : initialTrilha;
  }, [allTrilhas, initialTrilha]);

  const tone = trilha.archetype ? (TRILHA_TONE[trilha.archetype] || TRILHA_TONE.Self) : TRILHA_TONE.Self;
  const trilhaSlug = trilha.slug || trilha.id;
  const { percentOf, resetTrilha, progress, isStageDone, toggleStage } = useTrilhaProgress();
  const pct = percentOf(trilha);
  const doneCount = progress[trilha.id]?.completedStages?.length || 0;

  return (
    <VisibilityGate visibilityKey="estudos" title="Estudos indisponível">
      <Navbar />
      <main className="pt-28 md:pt-36 pb-16">
        {/* Breadcrumb */}
        <nav className="max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12 mb-6 flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.22em] uppercase">
          <Link href="/estudos" className="text-accent hover:text-text-bright transition-colors">← Estudos</Link>
          <span className="text-text-dim/40">/</span>
          <span className="text-text-dim/70">{trilha.name}</span>
        </nav>

        {/* Cover image como banner (se houver) */}
        {trilha.coverImage && (
          <div className="relative w-full h-[280px] md:h-[380px] mb-14 overflow-hidden">
            <img
              src={trilha.coverImage}
              alt=""
              className="w-full h-full object-cover opacity-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          </div>
        )}

        {/* Hero da trilha */}
        <header className={`max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12 mb-14 ${trilha.coverImage ? '-mt-32 relative z-10' : ''}`}>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {trilha.level && (
              <span
                className="font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2 py-1"
                style={{ background: tone.bg, color: tone.color, border: `1px solid ${tone.border}` }}
              >
                {trilha.level}
              </span>
            )}
            {trilha.duration && (
              <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.18em] uppercase">
                {trilha.duration}
              </span>
            )}
            <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.18em] uppercase">
              {trilha.stages.length} etapas
            </span>
            {pct > 0 && (
              <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2 py-1 border border-accent/40 text-accent">
                {doneCount}/{trilha.stages.length} concluído
              </span>
            )}
          </div>

          <h1 className="font-serif text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.02] tracking-[-0.01em] text-text-bright mb-4">
            {renderHighlightedTitle(trilha.name)}
          </h1>
          {trilha.subtitle && (
            <p className="font-serif italic text-text-dim text-[1.1rem] md:text-[1.2rem] leading-snug max-w-[700px] mb-5">
              {trilha.subtitle}
            </p>
          )}

          {/* Barra de progresso */}
          <div className="max-w-[520px] mt-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[0.55rem] text-accent tracking-[0.22em] uppercase">Progresso</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[0.55rem] text-text-dim tracking-[0.22em]">{pct}%</span>
                {pct > 0 && (
                  <button
                    onClick={() => resetTrilha(trilha.id)}
                    className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.22em] uppercase hover:text-accent transition-colors"
                  >
                    reiniciar
                  </button>
                )}
              </div>
            </div>
            <div className="h-1 bg-border-subtle overflow-hidden">
              <div className="h-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </header>

        {/* Lista de etapas */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12"
        >
          <div className="space-y-4">
            {trilha.stages.map((stage, idx) => {
              const done = isStageDone(trilha.id, stage.title);
              const kindLabel = STAGE_KIND_LABEL[stage.kind] || stage.kind;
              const number = String(idx + 1).padStart(2, '0');
              const stageHref = `/estudos/${trilhaSlug}/${stage.slug || stage.title}`;
              return (
                <motion.div key={stage.id || idx} variants={fadeUp}>
                  <Link
                    href={stageHref}
                    className={`group flex items-stretch gap-5 bg-bg-card border hover:border-border-hover transition-all overflow-hidden ${done ? 'border-accent/50' : 'border-border-subtle'}`}
                  >
                    {/* Coluna número */}
                    <div className="relative w-[100px] sm:w-[140px] flex-shrink-0 bg-bg-warm border-r border-border-subtle flex items-center justify-center">
                      <span className="font-serif italic text-[3rem] sm:text-[4rem] leading-none text-accent opacity-50 group-hover:opacity-90 transition-opacity">
                        {number}
                      </span>
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase px-2 py-0.5 border border-accent/30 text-accent bg-accent/[0.08]">
                          {kindLabel}
                        </span>
                        <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.18em] uppercase">
                          Etapa {idx + 1}
                        </span>
                        {(stage.blocks || []).length > 0 && (
                          <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.18em] uppercase">
                            · {stage.blocks.length} {stage.blocks.length === 1 ? 'bloco' : 'blocos'}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleStage(trilha.id, stage.title); }}
                          aria-pressed={done}
                          className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 border font-mono text-[0.55rem] tracking-[0.18em] uppercase transition-colors ${
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
                          {done ? 'Concluída' : 'Marcar'}
                        </button>
                      </div>

                      <h3 className="font-serif text-lg sm:text-xl text-text-bright group-hover:text-accent transition-colors leading-tight mb-1">
                        {renderHighlightedTitle(stage.title)}
                      </h3>
                      {stage.summary && (
                        <p className="text-[0.88rem] text-text-dim leading-[1.65] line-clamp-2">
                          {stage.summary}
                        </p>
                      )}

                      <div className="mt-3 inline-flex items-center gap-2 font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                        Abrir etapa
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </main>
      <Footer />
    </VisibilityGate>
  );
}
