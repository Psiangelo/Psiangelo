'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import TrilhaIcon, { IconSeal } from './icons';
import { renderHighlightedTitle } from '@/lib/highlightTitle';

/**
 * TrilhaHero — hero cerimonial da página /estudos/[trilha].
 *
 * Layout:
 *  - Capa em background full-bleed com parallax leve (translateY conforme scroll)
 *  - Esquerda: chip-área + nome + subtítulo + meta + barra de progresso + CTA
 *  - Direita (desktop): IconSeal grande da trilha com anel girando
 *
 * Props:
 *   trilha (migrated)
 *   area: objeto { label, icon, color }
 *   pct: number
 *   nextStage: stage | null
 *   onReset: () => void
 *   accent: string
 */
export default function TrilhaHero({ trilha, area, pct, nextStage, onReset, accent }) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  // Parallax: vazio quando prefers-reduced-motion (transform fixo)
  const coverY = useTransform(scrollYProgress, [0, 1], prefersReduced ? ['0%', '0%'] : ['0%', '20%']);
  const coverOpacity = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0.35, 0.35] : [0.5, 0.15]);

  const trilhaSlug = trilha.slug || trilha.id;
  const stages = trilha.stages || [];
  const totalStages = stages.length;
  const doneCount = Math.round((pct / 100) * totalStages);

  const ctaLabel = pct === 0 ? 'Começar trilha' : pct === 100 ? 'Revisar' : 'Continuar';
  const ctaTarget = nextStage?.slug
    ? `/estudos/${trilhaSlug}/${nextStage.slug}`
    : stages[0]?.slug
    ? `/estudos/${trilhaSlug}/${stages[0].slug}`
    : `/estudos/${trilhaSlug}`;

  return (
    <header ref={ref} className="relative overflow-hidden">
      {/* Cover image em background com parallax */}
      {trilha.coverImage ? (
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ y: coverY }}
        >
          <motion.img
            src={trilha.coverImage}
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            style={{ opacity: coverOpacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/40" />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 75% 30%, ${accent}1f 0%, transparent 55%)`,
            }}
          />
        </motion.div>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(circle at 70% 30%, ${accent}1f 0%, transparent 60%), linear-gradient(to bottom, #0E0C0A, #0A0908)`,
          }}
        />
      )}

      <div className="relative max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12 pt-28 md:pt-40 pb-12 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-start">
          {/* Coluna texto */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {area && (
                <Link
                  href="/estudos"
                  className="inline-flex items-center gap-1.5 font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2.5 py-1 rounded transition-colors hover:brightness-125"
                  style={{
                    color: accent,
                    background: `${accent}14`,
                    border: `1px solid ${accent}44`,
                  }}
                >
                  <TrilhaIcon name={area.icon} size={11} />
                  {area.label}
                </Link>
              )}
              {trilha.level && (
                <span className="font-mono text-[0.55rem] text-text-dim tracking-[0.22em] uppercase">
                  · {trilha.level}
                </span>
              )}
              {trilha.duration && (
                <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.22em] uppercase">
                  · {trilha.duration}
                </span>
              )}
              <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.22em] uppercase">
                · {totalStages} {totalStages === 1 ? 'etapa' : 'etapas'}
              </span>
              {pct > 0 && (
                <span
                  className="font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2 py-0.5 rounded ml-1"
                  style={{ color: accent, border: `1px solid ${accent}55`, background: `${accent}0d` }}
                >
                  {doneCount}/{totalStages}
                </span>
              )}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(2.4rem,5.5vw,4.2rem)] leading-[1.02] tracking-[-0.01em] text-text-bright mb-4"
            >
              {renderHighlightedTitle(trilha.name)}
            </motion.h1>

            {trilha.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="font-serif italic text-text-dim text-[1.05rem] md:text-[1.15rem] leading-snug max-w-[640px] mb-7"
              >
                {trilha.subtitle}
              </motion.p>
            )}

            {/* Progress bar */}
            <div className="max-w-[520px] mb-7">
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="font-mono text-[0.55rem] tracking-[0.22em] uppercase"
                  style={{ color: accent }}
                >
                  Progresso
                </span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[0.55rem] text-text-dim tracking-[0.22em]">{pct}%</span>
                  {pct > 0 && (
                    <button
                      type="button"
                      onClick={onReset}
                      className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.22em] uppercase hover:text-accent transition-colors"
                    >
                      reiniciar
                    </button>
                  )}
                </div>
              </div>
              <div
                className="h-1 overflow-hidden rounded-full"
                style={{ background: `${accent}1a` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ background: accent }}
                />
              </div>
            </div>

            {/* CTA principal */}
            <div className="flex flex-wrap gap-3 items-center">
              <Link
                href={ctaTarget}
                className="inline-flex items-center gap-2 px-6 py-3 font-mono text-[0.6rem] font-semibold tracking-[0.22em] uppercase rounded-sm transition-colors"
                style={{
                  background: accent,
                  color: '#0E0C0A',
                }}
              >
                {ctaLabel}
                {nextStage && pct > 0 && pct < 100 && (
                  <span className="font-serif italic normal-case tracking-normal text-[0.75rem] opacity-80 ml-1">
                    · {nextStage.title}
                  </span>
                )}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              {pct === 100 && (
                <span
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-sm font-mono text-[0.6rem] tracking-[0.22em] uppercase"
                  style={{
                    color: accent,
                    background: `${accent}14`,
                    border: `1px solid ${accent}44`,
                  }}
                >
                  ✦ Trilha concluída
                </span>
              )}
            </div>
          </div>

          {/* Coluna selo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-shrink-0 items-start justify-end pt-4"
          >
            <div className="relative">
              {/* Anéis decorativos girando (pausam se prefers-reduced-motion) */}
              <motion.div
                aria-hidden
                animate={prefersReduced ? undefined : { rotate: 360 }}
                transition={prefersReduced ? undefined : { duration: 200, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 rounded-full border opacity-25"
                style={{ borderColor: `${accent}66`, borderStyle: 'dashed' }}
              />
              <motion.div
                aria-hidden
                animate={prefersReduced ? undefined : { rotate: -360 }}
                transition={prefersReduced ? undefined : { duration: 320, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-10 rounded-full border opacity-15"
                style={{ borderColor: `${accent}88`, borderStyle: 'dotted' }}
              />
              <IconSeal name={trilha.icon || 'compass'} size={128} color={accent} ringWidth={1.5} />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
