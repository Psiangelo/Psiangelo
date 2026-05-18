'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import TrilhaIcon, { IconSeal } from './icons';
import { resolveImageSrc } from '@/lib/basepath';
import { renderHighlightedTitle } from '@/lib/highlightTitle';
import { toRoman } from '@/lib/stageThumb';
import { STAGE_KIND_LABEL } from '@/data/trilhas';
import { isExtra, EXTRA_ICON } from '@/lib/extraTone';

/**
 * EtapaHero — abertura cerimonial da página de uma etapa.
 *
 * Layout centralizado:
 *  - Topo: chip-trilha (volta) + chip-área
 *  - Centro: numeração romana grande + IconSeal + título + summary
 *  - Meta: kind · blocos · tempo de leitura
 *  - Bottom: selo circular "marcar concluída" prominente
 *
 * Cover image (se houver) vai em background com parallax leve.
 *
 * Props:
 *   stage, trilha, area
 *   idx (0-based), total
 *   readingTime (minutos)
 *   done, onToggle
 *   accent (cor da área)
 */
export default function EtapaHero({
  stage,
  trilha,
  area,
  idx,
  total,
  readingTime,
  done,
  onToggle,
  accent = '#B48C50',
}) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const coverY = useTransform(scrollYProgress, [0, 1], prefersReduced ? ['0%', '0%'] : ['0%', '25%']);
  const coverOpacity = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0.3, 0.3] : [0.4, 0.1]);

  const extra = isExtra(stage);
  const heroIcon = extra ? EXTRA_ICON : (stage.icon || 'book');
  const kindLabel = extra ? 'Extra' : (STAGE_KIND_LABEL[stage.kind] || stage.kind || '');
  const blockCount = (stage.blocks || []).length;
  const trilhaSlug = trilha.slug || trilha.id;
  const number = toRoman(idx + 1);

  const cover = stage.coverImage || trilha.coverImage;

  return (
    <header ref={ref} className="relative overflow-hidden">
      {/* Cover em background com parallax */}
      {cover ? (
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ y: coverY }}
        >
          <motion.img
            src={resolveImageSrc(cover)}
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            style={{ opacity: coverOpacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/90 to-bg" />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${accent}26 0%, transparent 60%)`,
            }}
          />
        </motion.div>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${accent}1a 0%, transparent 65%)`,
          }}
        />
      )}

      <div className="relative max-w-[820px] mx-auto px-5 sm:px-6 md:px-12 pt-28 md:pt-36 pb-10 md:pb-14 text-center">
        {/* Linha de retorno: chip-trilha + chip-área */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-10 flex-wrap"
        >
          {extra && (
            <span
              className="inline-flex items-center gap-1.5 font-mono text-[0.5rem] tracking-[0.22em] uppercase px-2 py-0.5 rounded"
              style={{
                color: accent,
                background: `${accent}1f`,
                border: `1px solid ${accent}66`,
              }}
              title="Etapa extra — opcional"
            >
              <TrilhaIcon name={EXTRA_ICON} size={10} />
              Extra
            </span>
          )}
          {area && (
            <Link
              href="/estudos"
              className="inline-flex items-center gap-1.5 font-mono text-[0.5rem] tracking-[0.22em] uppercase px-2 py-0.5 rounded transition-colors hover:brightness-125"
              style={{
                color: accent,
                background: `${accent}14`,
                border: `1px solid ${accent}33`,
              }}
            >
              <TrilhaIcon name={area.icon} size={10} />
              {area.label}
            </Link>
          )}
          <Link
            href={`/estudos/${trilhaSlug}`}
            className="inline-flex items-center gap-1.5 font-mono text-[0.55rem] tracking-[0.22em] uppercase text-text-dim hover:[color:var(--hero-accent)] transition-colors"
            style={{ '--hero-accent': accent }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <TrilhaIcon name={trilha.icon || 'compass'} size={11} />
            {trilha.name}
          </Link>
        </motion.div>

        {/* Numeração romana */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif italic text-[clamp(2rem,4vw,3rem)] leading-none mb-3"
          style={{ color: `${accent}aa`, letterSpacing: '0.05em' }}
        >
          {number}
        </motion.p>

        {/* IconSeal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <motion.div
              aria-hidden
              animate={prefersReduced ? undefined : { rotate: 360 }}
              transition={prefersReduced ? undefined : { duration: 180, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-3 rounded-full border opacity-30"
              style={{ borderColor: `${accent}66`, borderStyle: 'dashed' }}
            />
            <IconSeal name={heroIcon} size={88} color={accent} ringWidth={1.5} />
          </div>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.05] tracking-[-0.01em] text-text-bright mb-4"
        >
          {renderHighlightedTitle(stage.title)}
        </motion.h1>

        {stage.summary && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="font-serif italic text-text-dim text-[1.05rem] md:text-[1.15rem] leading-snug max-w-[640px] mx-auto mb-7"
          >
            {stage.summary}
          </motion.p>
        )}

        {/* Meta linha */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex items-center justify-center gap-3 flex-wrap mb-8 font-mono text-[0.55rem] tracking-[0.22em] uppercase text-text-dim"
        >
          {kindLabel && (
            <span className="inline-flex items-center gap-1.5" style={{ color: accent }}>
              <TrilhaIcon name={heroIcon} size={11} />
              {kindLabel}
            </span>
          )}
          <span className="text-text-dim/40">·</span>
          <span>Etapa {idx + 1} de {total}</span>
          {blockCount > 0 && (
            <>
              <span className="text-text-dim/40">·</span>
              <span>{blockCount} {blockCount === 1 ? 'bloco' : 'blocos'}</span>
            </>
          )}
          {readingTime > 0 && (
            <>
              <span className="text-text-dim/40">·</span>
              <span>{readingTime} min de leitura</span>
            </>
          )}
        </motion.div>

        {/* Toggle concluída — selo prominente */}
        <motion.button
          type="button"
          onClick={onToggle}
          aria-pressed={done}
          aria-label={done ? 'Desmarcar etapa como concluída' : 'Marcar etapa como concluída'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-3 px-5 py-3 rounded-full font-mono text-[0.6rem] tracking-[0.22em] uppercase transition-colors"
          style={
            done
              ? { background: accent, color: '#0E0C0A', border: `1px solid ${accent}` }
              : {
                  background: `${accent}0d`,
                  color: accent,
                  border: `1px solid ${accent}55`,
                }
          }
        >
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-full"
            style={
              done
                ? { background: '#0E0C0A', color: accent }
                : { background: 'transparent', color: accent, border: `1px solid ${accent}88` }
            }
          >
            {done ? (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="w-4 h-4"
              >
                <path d="M5 12l5 5L20 7" />
              </motion.svg>
            ) : (
              <span className="w-2 h-2 rounded-full" style={{ background: `${accent}88` }} />
            )}
          </span>
          {done ? 'Etapa concluída' : 'Marcar como concluída'}
        </motion.button>
      </div>
    </header>
  );
}
