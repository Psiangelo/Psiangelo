'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger } from '@/lib/constants';
import { trilhas as TRILHAS_DEFAULT, TRILHA_TONE } from '@/data/trilhas';
import { getTrilhas, SITEDATA_KEYS } from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';
import { useTrilhaProgress } from '@/lib/useTrilhaProgress';
import { useSectionLabel } from '@/lib/useLabels';
import { OrbitalAccent, QuaternioSigil } from '@/components/illustrations';

/**
 * StudyPaths — preview na home das trilhas publicadas.
 * Resolve o "em que ordem consumir" antes que o leitor pergunte.
 *
 * Usa useSitedata (seed-first) em vez de useState+useEffect com o default
 * hardcoded: sem isso, o HTML estático saía sempre com as 3 trilhas de
 * src/data/trilhas.js, mesmo quando o snapshot publicado tem só 1 — e o
 * texto "três caminhos" ficava falso no próprio HTML gerado.
 */
export default function StudyPaths() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const trilhas = useSitedata(getTrilhas, TRILHAS_DEFAULT, SITEDATA_KEYS.trilhas);
  const { percentOf, progress } = useTrilhaProgress();

  if (!trilhas || trilhas.length === 0) return null;

  // Texto precisa derivar da contagem real de trilhas publicadas: com uma
  // trilha só, "três caminhos curados" seria falso.
  const shownCount = Math.min(trilhas.length, 3);
  const COUNT_WORD = { 1: 'Uma trilha', 2: 'Dois caminhos', 3: 'Três caminhos' };
  const leadText = shownCount === 1
    ? 'Uma trilha curada para quem chega: do primeiro contato com Jung ao aprofundamento contínuo. Ela indica a ordem, o tempo e os materiais.'
    : `${COUNT_WORD[shownCount]} curados para quem chega: do primeiro contato com Jung ao aprofundamento contínuo. Cada trilha indica a ordem, o tempo e os materiais.`;
  const gridCols = shownCount === 1
    ? 'grid-cols-1 max-w-md mx-auto'
    : shownCount === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-3';

  // Procura uma trilha em andamento (tem progresso, mas não 100%)
  const ongoing = trilhas.find((t) => {
    const p = progress[t.id];
    return p && p.completedStages.length > 0 && p.completedStages.length < t.stages.length;
  });

  return (
    <section ref={ref} className="py-12 md:py-20 px-5 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Orbital accent no canto direito */}
      <OrbitalAccent
        className="absolute -top-20 -right-24 pointer-events-none hidden md:block"
        size={360}
        opacity={0.08}
      />
      {/* Quaternio sutil no canto esquerdo inferior */}
      <QuaternioSigil
        className="absolute bottom-10 left-8 pointer-events-none hidden lg:block"
        size={72}
        opacity={0.18}
      />
      <motion.div
        initial="visible"
        animate="visible"
        variants={stagger}
        className="max-w-[1180px] mx-auto relative"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <SectionLabel label="Trilhas" />
            <motion.h2
              variants={fadeUp}
              className="font-serif text-[clamp(2rem,4vw,3rem)] text-text-bright leading-[1.05] mb-4 max-w-2xl"
            >
              {useSectionLabel('trilhas', '') || (
                <>Por onde <em className="italic text-accent">começar</em></>
              )}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[0.95rem] text-text-dim leading-[1.85] max-w-xl"
            >
              {leadText}
            </motion.p>
          </div>
          <motion.div variants={fadeUp}>
            <Link
              href="/estudos"
              className="font-sans text-[0.72rem] font-medium tracking-[0.18em] uppercase text-accent hover:text-text-bright transition-colors inline-flex items-center gap-2 link-underline"
            >
              Ver todas as trilhas
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Continue de onde parou */}
        {ongoing && (
          <motion.div variants={fadeUp} className="mb-8 bg-accent/8 border-l-2 border-accent p-4 md:p-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-[0.55rem] text-accent tracking-[0.22em] uppercase mb-1">
                Continue de onde parou
              </p>
              <p className="font-serif text-text-bright text-lg leading-tight">
                {ongoing.name}
              </p>
              <p className="text-[0.8rem] text-text-dim mt-1">
                {percentOf(ongoing)}% concluído · {progress[ongoing.id].completedStages.length} de {ongoing.stages.length} etapas
              </p>
            </div>
            <Link
              href={`/estudos/${ongoing.slug || ongoing.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-text-bright text-bg font-sans text-[0.65rem] font-semibold tracking-[0.2em] uppercase transition-colors flex-shrink-0"
            >
              Continuar
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        )}

        <motion.div variants={stagger} className={`grid ${gridCols} gap-5`}>
          {trilhas.slice(0, 3).map((t, i) => {
            const tone = TRILHA_TONE[t.archetype] || TRILHA_TONE.Self;
            const pct = percentOf(t);
            return (
              <motion.div key={t.id} variants={fadeUp}>
                <Link
                  href={`/estudos/${t.slug || t.id}`}
                  className="group block bg-bg-card border border-border-subtle hover:border-border-hover transition-all h-full p-7 relative overflow-hidden"
                  style={{ borderBottom: `2px solid ${tone.border}` }}
                >
                  {/* Numeração romana grande no fundo */}
                  <span className="absolute -top-2 -right-1 font-serif italic text-[6rem] leading-none opacity-[0.06] text-accent select-none pointer-events-none">
                    {['I', 'II', 'III'][i]}
                  </span>

                  {/* Header */}
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
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
                  </div>

                  <h3 className="font-serif text-2xl text-text-bright leading-tight mb-2 group-hover:text-accent transition-colors">
                    {t.name}
                  </h3>
                  <p className="font-serif italic text-text-dim text-[0.92rem] leading-snug mb-6">
                    {t.subtitle}
                  </p>

                  {/* Etapas (preview compacto) */}
                  <ol className="space-y-2 mb-5">
                    {t.stages.slice(0, 3).map((s) => (
                      <li
                        key={s.title}
                        className="flex items-baseline gap-3 text-[0.82rem] text-text-dim leading-snug"
                      >
                        <span className="font-mono text-accent text-[0.6rem] tracking-[0.18em] flex-shrink-0">
                          {s.title.split('·')[0].trim()}
                        </span>
                        <span className="truncate">{s.title.split('·')[1]?.trim() || s.title}</span>
                      </li>
                    ))}
                    {t.stages.length > 3 && (
                      <li className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em] uppercase pl-12">
                        + {t.stages.length - 3} {t.stages.length - 3 === 1 ? 'etapa' : 'etapas'}
                      </li>
                    )}
                  </ol>

                  {pct > 0 && (
                    <div className="pt-4 mb-3 border-t border-border-subtle/60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[0.5rem] text-accent/80 tracking-[0.2em] uppercase">Progresso</span>
                        <span className="font-mono text-[0.5rem] text-text-dim tracking-[0.18em]">{pct}%</span>
                      </div>
                      <div className="h-0.5 bg-border-subtle overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}

                  <div className={`flex items-center gap-2 font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase ${pct > 0 ? '' : 'pt-4 border-t border-border-subtle/60'}`}>
                    {pct > 0 ? 'Continuar' : 'Ver trilha'}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="group-hover:translate-x-1 transition-transform">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
