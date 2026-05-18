'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import VisibilityGate from '@/components/VisibilityGate';
import { useSitedata } from '@/lib/useSitedata';
import { useTrilhaProgress } from '@/lib/useTrilhaProgress';
import { fadeUp, stagger } from '@/lib/constants';
import { getTrilhas, SITEDATA_KEYS } from '@/lib/sitedata';
import { TRILHA_TONE } from '@/data/trilhas';
import { migrateTrilhaBlocks } from '@/lib/linkResolver';
import { renderHighlightedTitle, stripHighlights } from '@/lib/highlightTitle';

function normalize(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function trilhaSlug(t) {
  return t.slug || t.id;
}

export default function EstudosListingClient({ initialTrilhas }) {
  const trilhas = useSitedata(getTrilhas, initialTrilhas, SITEDATA_KEYS.trilhas);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState(null);

  const filtered = useMemo(() => {
    return (trilhas || []).filter((t) => {
      if (filterLevel && t.level !== filterLevel) return false;
      if (search) {
        const q = normalize(search);
        const hay = normalize(`${stripHighlights(t.name)} ${t.subtitle || ''} ${(t.stages || []).map((s) => s.title).join(' ')}`);
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [trilhas, search, filterLevel]);

  const levels = useMemo(() => {
    const set = new Set();
    (trilhas || []).forEach((t) => { if (t.level) set.add(t.level); });
    return Array.from(set);
  }, [trilhas]);

  // "Continue de onde parou": trilha com mais alto progresso parcial
  const { progress, percentOf } = useTrilhaProgress();
  const ongoing = useMemo(() => {
    const candidates = (trilhas || []).map(migrateTrilhaBlocks).map((t) => {
      const p = progress[t.id];
      if (!p?.completedStages?.length) return null;
      const pct = percentOf(t);
      if (pct === 0 || pct === 100) return null;
      const nextStage = t.stages.find((s) => !p.completedStages.includes(s.title));
      return { trilha: t, pct, nextStage };
    }).filter(Boolean);
    return candidates.sort((a, b) => b.pct - a.pct)[0] || null;
  }, [trilhas, progress, percentOf]);

  return (
    <VisibilityGate visibilityKey="estudos" title="Estudos indisponível">
      <Navbar />
      <main>
        <PageHero
          eyebrow="Sala de estudos · Psicologia Analítica"
          title="Estudos"
          emphasis="guiados"
          kicker="Por onde começar, em que ordem"
          lead="Cada trilha é um guia rico — texto explicativo, vídeos, materiais, cartografia e ensaios — montado para te levar pela obra de Jung passo a passo."
        />

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="py-12 md:py-20 px-5 sm:px-6 md:px-12"
        >
          <div className="max-w-[1180px] mx-auto">
            {/* Continue de onde parou */}
            {ongoing && (
              <div className="mb-8 bg-accent/8 border-l-2 border-accent p-4 md:p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-mono text-[0.55rem] text-accent tracking-[0.22em] uppercase mb-1">Continue de onde parou</p>
                  <p className="font-serif text-text-bright text-lg leading-tight">{ongoing.trilha.name}</p>
                  <p className="text-[0.8rem] text-text-dim mt-1">
                    {ongoing.pct}% concluído
                    {ongoing.nextStage && <> · próxima etapa: <em className="italic text-accent">{ongoing.nextStage.title}</em></>}
                  </p>
                </div>
                <Link
                  href={ongoing.nextStage
                    ? `/estudos/${ongoing.trilha.slug || ongoing.trilha.id}/${ongoing.nextStage.slug}`
                    : `/estudos/${ongoing.trilha.slug || ongoing.trilha.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-text-bright text-bg font-sans text-[0.65rem] font-semibold tracking-[0.2em] uppercase transition-colors flex-shrink-0"
                >
                  Continuar
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Filtros: busca + nível */}
            {(trilhas.length > 2 || search) && (
              <div className="mb-8 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px] relative border-b border-border-subtle focus-within:border-accent/50 transition-colors">
                  <svg className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar trilha ou etapa…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-transparent text-text-bright placeholder:text-text-dim/50 focus:outline-none font-serif italic text-[0.95rem]"
                  />
                </div>
                {levels.length > 1 && (
                  <div className="flex gap-1 flex-wrap">
                    <button
                      onClick={() => setFilterLevel(null)}
                      className={`px-3 py-1.5 font-mono text-[0.55rem] tracking-[0.18em] uppercase transition-colors ${
                        !filterLevel
                          ? 'bg-accent text-bg'
                          : 'border border-border-subtle text-text-dim hover:text-accent'
                      }`}
                    >
                      Todos
                    </button>
                    {levels.map((l) => (
                      <button
                        key={l}
                        onClick={() => setFilterLevel(filterLevel === l ? null : l)}
                        className={`px-3 py-1.5 font-mono text-[0.55rem] tracking-[0.18em] uppercase transition-colors ${
                          filterLevel === l
                            ? 'bg-accent text-bg'
                            : 'border border-border-subtle text-text-dim hover:text-accent'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((rawTrilha, i) => {
                const t = migrateTrilhaBlocks(rawTrilha);
                const tone = t.archetype ? (TRILHA_TONE[t.archetype] || TRILHA_TONE.Self) : TRILHA_TONE.Self;
                const slug = trilhaSlug(t);
                const trilhaPct = percentOf(t);
                return (
                  <motion.div key={t.id || slug} variants={fadeUp}>
                    <Link
                      href={`/estudos/${slug}`}
                      className="group relative block h-full bg-bg-card border border-border-subtle hover:border-accent/40 transition-colors overflow-hidden flex flex-col min-h-[240px]"
                    >
                      {t.coverImage && (
                        <div className="absolute inset-0">
                          <img
                            src={t.coverImage}
                            alt=""
                            className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/95 to-bg-card/40" />
                        </div>
                      )}

                      <div className="relative p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          {t.level && (
                            <span
                              className="font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2 py-1"
                              style={{ background: tone.bg, color: tone.color, border: `1px solid ${tone.border}` }}
                            >
                              {t.level}
                            </span>
                          )}
                          {t.duration && (
                            <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.18em] uppercase">
                              {t.duration}
                            </span>
                          )}
                          <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.18em] uppercase ml-auto">
                            {(t.stages || []).length} etapas
                          </span>
                        </div>

                        <h2 className="font-serif text-[1.5rem] md:text-2xl text-text-bright group-hover:text-accent transition-colors leading-tight mb-3">
                          {renderHighlightedTitle(t.name)}
                        </h2>

                        {t.subtitle && (
                          <p className="font-serif italic text-text-dim text-[0.95rem] leading-[1.65] mb-4">
                            {t.subtitle}
                          </p>
                        )}

                        <div className="mt-auto pt-4 border-t border-border-subtle/50 flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-2 font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase">
                            {trilhaPct > 0 ? 'Continuar' : 'Começar'}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </span>
                          {trilhaPct > 0 && (
                            <span className="font-mono text-[0.55rem] text-accent/80 tracking-[0.22em]">{trilhaPct}%</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {trilhas.length === 0 && (
              <div className="text-center py-16 border border-dashed border-border-subtle">
                <p className="font-serif italic text-text-dim">Nenhuma trilha publicada ainda.</p>
              </div>
            )}

            {trilhas.length > 0 && filtered.length === 0 && (
              <div className="text-center py-12 border border-dashed border-border-subtle">
                <p className="font-serif italic text-text-dim mb-3">Nenhuma trilha com esses filtros.</p>
                <button
                  onClick={() => { setSearch(''); setFilterLevel(null); }}
                  className="font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase hover:text-text-bright transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </motion.section>
      </main>
      <Footer />
    </VisibilityGate>
  );
}
