'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import TrilhaIcon from './icons';
import { resolveImageSrc } from '@/lib/basepath';
import { iconLabel } from '@/lib/trilhaIcons';
import { renderHighlightedTitle } from '@/lib/highlightTitle';
import { isExtra, resolveExtraAccent, EXTRA_ICON } from '@/lib/extraTone';

/**
 * TrilhaCard — card vertical cerimonial de uma trilha no listing /estudos.
 *
 * Desktop: split com texto à esquerda + capa 4:3 à direita (com fade).
 * Mobile/tablet: capa em cima, texto embaixo (stack).
 *
 * Conteúdo:
 *  - Chip da Área + tags meta (nível, duração)
 *  - Título serif gigante (com renderHighlightedTitle)
 *  - Subtítulo italic
 *  - Mini-selos das primeiras etapas (até 6, com estado de progresso)
 *  - Barra de progresso linear + % textual
 *  - CTA "Começar" ou "Continuar"
 *  - Hover state rico (translate, accent, capa anima)
 *
 * Props:
 *   trilha (já migrated), area (resolved), pct, completedTitles, accent
 */
export default function TrilhaCard({ trilha, area, pct = 0, completedTitles = [], accent }) {
  const prefersReduced = useReducedMotion();
  const slug = trilha.slug || trilha.id;
  const fallbackAccent = '#B48C50';
  const baseAccent = accent || area?.color || fallbackAccent;
  const extra = isExtra(trilha);
  const tone = resolveExtraAccent(trilha, baseAccent);
  const trilhaIcon = extra ? EXTRA_ICON : (trilha.icon || 'compass');
  const stages = trilha.stages || [];
  const totalStages = stages.length;
  const comingSoon = trilha.comingSoon === true;
  const ctaLabel = comingSoon ? 'Em breve' : (pct > 0 ? 'Continuar' : 'Começar');

  // Mini-selos: mostra até 6 etapas em fila, com estado individual
  const visibleStages = stages.slice(0, 6);
  const hiddenCount = stages.length - visibleStages.length;

  return (
    <motion.div
      whileHover={prefersReduced ? undefined : { y: -2 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={comingSoon ? '#' : `/estudos/${slug}`}
        onClick={(e) => { if (comingSoon) e.preventDefault(); }}
        aria-disabled={comingSoon ? true : undefined}
        className={`group relative block bg-bg-card border border-border-subtle transition-colors overflow-hidden rounded-sm ${
          comingSoon ? 'cursor-default opacity-80' : 'hover:border-accent/40'
        }`}
        style={{ '--card-accent': tone }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          {/* Coluna texto */}
          <div className="p-6 md:p-8 flex flex-col">
            {/* Linha de meta */}
            <div className="flex items-center gap-2 flex-wrap mb-5">
              {comingSoon && (
                <span
                  className="inline-flex items-center gap-1.5 font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2.5 py-1 rounded"
                  style={{
                    color: '#0E0C0A',
                    background: tone,
                    border: `1px solid ${tone}`,
                  }}
                  title="Esta trilha ainda não está aberta"
                >
                  Em breve
                </span>
              )}
              {extra && (
                <span
                  className="inline-flex items-center gap-1.5 font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2.5 py-1 rounded"
                  style={{
                    color: tone,
                    background: `${tone}1a`,
                    border: `1px solid ${tone}55`,
                  }}
                  title="Trilha extra — fora do caminho principal"
                >
                  <TrilhaIcon name={EXTRA_ICON} size={11} />
                  Extra
                </span>
              )}
              {area && (
                <span
                  className="inline-flex items-center gap-1.5 font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2.5 py-1 rounded"
                  style={{
                    color: tone,
                    background: `${tone}14`,
                    border: `1px solid ${tone}44`,
                  }}
                >
                  <TrilhaIcon name={area.icon} size={11} />
                  {area.label}
                </span>
              )}
              {trilha.level && (
                <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-text-dim">
                  {trilha.level}
                </span>
              )}
              {trilha.duration && (
                <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-text-dim/70">
                  · {trilha.duration}
                </span>
              )}
              <span className="ml-auto font-mono text-[0.55rem] tracking-[0.22em] uppercase text-text-dim/70">
                {totalStages} {totalStages === 1 ? 'etapa' : 'etapas'}
              </span>
            </div>

            {/* Título + subtítulo */}
            <h2
              className="font-serif text-text-bright leading-[1.05] mb-3 transition-colors group-hover:[color:var(--card-accent)]"
              style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
            >
              {renderHighlightedTitle(trilha.name)}
            </h2>

            {trilha.subtitle && (
              <p className="font-serif italic text-text-dim text-[0.95rem] leading-[1.7] mb-5 max-w-prose">
                {trilha.subtitle}
              </p>
            )}

            {/* Mini-selos das etapas */}
            {visibleStages.length > 0 && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                {visibleStages.map((s, i) => {
                  const isDone = completedTitles.includes(s.title);
                  return (
                    <span
                      key={s.id || s.slug || i}
                      title={`${s.title}${isDone ? ' — concluída' : ''}`}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full border transition-colors"
                      style={{
                        color: isDone ? '#0E0C0A' : tone,
                        background: isDone ? tone : 'transparent',
                        borderColor: isDone ? tone : `${tone}55`,
                        opacity: isDone ? 1 : 0.7,
                      }}
                    >
                      <TrilhaIcon name={s.icon || 'book'} size={14} strokeWidth={1.6} />
                    </span>
                  );
                })}
                {hiddenCount > 0 && (
                  <span className="font-mono text-[0.55rem] tracking-widest uppercase text-text-dim/60 ml-1">
                    + {hiddenCount}
                  </span>
                )}
              </div>
            )}

            {/* Barra de progresso */}
            {pct > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-text-dim">
                    Progresso
                  </span>
                  <span
                    className="font-mono text-[0.6rem] tracking-[0.18em]"
                    style={{ color: tone }}
                  >
                    {pct}%
                  </span>
                </div>
                <div className="h-[3px] bg-border-subtle/30">
                  <div
                    className="h-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: tone }}
                  />
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-auto pt-4 border-t border-border-subtle/50 flex items-center justify-between gap-3">
              <span
                className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.22em] uppercase"
                style={{ color: tone }}
              >
                {ctaLabel}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              {pct === 100 && (
                <span
                  className="font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2 py-0.5 rounded"
                  style={{
                    color: '#0E0C0A',
                    background: tone,
                  }}
                >
                  ✦ Concluída
                </span>
              )}
            </div>
          </div>

          {/* Coluna capa */}
          <div className="relative h-48 lg:h-auto lg:min-h-[280px] overflow-hidden order-first lg:order-last">
            {trilha.thumbMode !== 'icon' && trilha.coverImage ? (
              <>
                <img
                  src={resolveImageSrc(trilha.coverImage)}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                {/* Fade gradients pra texto da esquerda emergir */}
                <div
                  className="absolute inset-0 lg:bg-gradient-to-l lg:from-transparent lg:via-bg-card/30 lg:to-bg-card"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-transparent to-transparent lg:from-bg-card/20"
                  aria-hidden
                />
              </>
            ) : (
              // Sem capa: gradiente cerimonial + ícone gigante visível
              <div
                className="absolute inset-0 flex items-center justify-center overflow-hidden"
                style={{
                  background: `radial-gradient(circle at 65% 45%, ${tone}40 0%, ${tone}14 50%, transparent 80%), linear-gradient(135deg, ${tone}22 0%, transparent 80%)`,
                }}
              >
                <svg
                  aria-hidden
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ opacity: 0.5 }}
                >
                  <line x1="0" y1="22" x2="100" y2="22" stroke={tone} strokeWidth="0.25" strokeDasharray="1.5 4" />
                  <line x1="0" y1="78" x2="100" y2="78" stroke={tone} strokeWidth="0.25" strokeDasharray="1.5 4" />
                </svg>
                <span className="relative" style={{ color: `${tone}cc` }} aria-hidden>
                  <TrilhaIcon name={trilhaIcon} size={140} strokeWidth={1.2} />
                </span>
              </div>
            )}

            {/* Glifo accent no canto da capa */}
            <span
              className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full border backdrop-blur-sm"
              style={{
                color: tone,
                borderColor: `${tone}66`,
                background: `${tone}1a`,
              }}
              aria-hidden
              title={extra ? 'Trilha extra' : iconLabel(trilha.icon)}
            >
              <TrilhaIcon name={trilhaIcon} size={18} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
