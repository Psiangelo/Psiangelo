'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import VisibilityGate from '@/components/VisibilityGate';
import { useSitedata } from '@/lib/useSitedata';
import { fadeUp, stagger } from '@/lib/constants';
import { getTrilhas, SITEDATA_KEYS } from '@/lib/sitedata';
import { TRILHA_TONE } from '@/data/trilhas';
import { migrateTrilhaBlocks } from '@/lib/linkResolver';
import { renderHighlightedTitle } from '@/lib/highlightTitle';

function trilhaSlug(t) {
  return t.slug || t.id;
}

export default function EstudosListingClient({ initialTrilhas }) {
  const trilhas = useSitedata(getTrilhas, initialTrilhas, SITEDATA_KEYS.trilhas);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {trilhas.map((rawTrilha, i) => {
                const t = migrateTrilhaBlocks(rawTrilha);
                const tone = t.archetype ? (TRILHA_TONE[t.archetype] || TRILHA_TONE.Self) : TRILHA_TONE.Self;
                const slug = trilhaSlug(t);
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

                        <div className="mt-auto pt-4 border-t border-border-subtle/50 inline-flex items-center gap-2 font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase">
                          Começar
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

            {trilhas.length === 0 && (
              <div className="text-center py-16 border border-dashed border-border-subtle">
                <p className="font-serif italic text-text-dim">Nenhuma trilha publicada ainda.</p>
              </div>
            )}
          </div>
        </motion.section>
      </main>
      <Footer />
    </VisibilityGate>
  );
}
