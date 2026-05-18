'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import TrilhaIcon from './icons';
import { iconLabel, defaultIconForKind } from '@/lib/trilhaIcons';
import { renderHighlightedTitle } from '@/lib/highlightTitle';
import { STAGE_KIND_LABEL } from '@/data/trilhas';
import { toRoman } from '@/lib/stageThumb';
import { resolveImageSrc } from '@/lib/basepath';
import { isExtra, resolveExtraAccent, EXTRA_ICON } from '@/lib/extraTone';

/**
 * StageCard — card de etapa na timeline da página /estudos/[trilha].
 *
 * Layout: split com texto à esquerda + thumb à direita (desktop).
 * Mobile: stack.
 *
 * Props:
 *   stage: objeto (com icon, kind, slug, title, summary, intro, blocks)
 *   idx: número da etapa (1-based)
 *   trilhaSlug: string
 *   accent: cor (da área)
 *   done: boolean
 *   onToggle: () => void
 *   thumb: string | null  (deriveStageThumb já calculado)
 */
export default function StageCard({ stage, idx, trilhaSlug, accent = '#B48C50', done, onToggle, thumb, trilhaCover }) {
  const prefersReduced = useReducedMotion();
  const comingSoon = stage.comingSoon === true;
  const stageHref = comingSoon ? '#' : `/estudos/${trilhaSlug}/${stage.slug || stage.title}`;
  // Cascata: thumb da etapa → capa da trilha → null (cai no fallback gráfico)
  // resolveImageSrc prefixa basePath em paths que começam com / (GH Pages)
  // Quando stage.thumbMode === 'icon', força o fallback ignorando qualquer imagem.
  const displayImage =
    stage.thumbMode === 'icon' ? null : resolveImageSrc(thumb || trilhaCover);
  const extra = isExtra(stage);
  const tone = resolveExtraAccent(stage, accent);
  const kindLabel = extra ? 'Extra' : (STAGE_KIND_LABEL[stage.kind] || stage.kind || '');
  const iconName = extra ? EXTRA_ICON : (stage.icon || defaultIconForKind(stage.kind));
  const number = toRoman(idx + 1);
  const blockCount = (stage.blocks || []).length;

  return (
    <motion.article
      whileHover={prefersReduced ? undefined : { y: -2 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <Link
        href={stageHref}
        onClick={(e) => { if (comingSoon) e.preventDefault(); }}
        aria-disabled={comingSoon ? true : undefined}
        className={`group block bg-bg-card border rounded-sm overflow-hidden transition-colors ${
          comingSoon ? 'cursor-default opacity-80' : ''
        }`}
        style={{
          borderColor: done ? `${tone}66` : extra ? `${tone}33` : 'rgba(180,140,80,0.18)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px]">
          {/* Conteúdo */}
          <div className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="font-serif italic text-[1.6rem] leading-none"
                style={{ color: `${tone}cc` }}
              >
                {number}
              </span>
              {comingSoon && (
                <span
                  className="font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2 py-0.5 rounded"
                  style={{
                    color: '#0E0C0A',
                    background: tone,
                    border: `1px solid ${tone}`,
                  }}
                  title="Etapa ainda não aberta"
                >
                  Em breve
                </span>
              )}
              {kindLabel && (
                <span
                  className="font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2 py-0.5 rounded"
                  style={{
                    color: tone,
                    background: `${tone}10`,
                    border: `1px solid ${tone}33`,
                  }}
                  title={extra ? 'Etapa extra' : undefined}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <TrilhaIcon name={iconName} size={11} />
                    {kindLabel}
                  </span>
                </span>
              )}
              {blockCount > 0 && (
                <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-text-dim/60">
                  · {blockCount} {blockCount === 1 ? 'bloco' : 'blocos'}
                </span>
              )}

              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle?.(); }}
                aria-pressed={done}
                aria-label={done ? 'Desmarcar como concluída' : 'Marcar como concluída'}
                className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[0.55rem] tracking-[0.18em] uppercase rounded transition-colors"
                style={{
                  color: done ? tone : '#B8AD9E',
                  background: done ? `${tone}1a` : 'transparent',
                  border: `1px solid ${done ? tone : 'rgba(180,140,80,0.2)'}`,
                }}
              >
                <span
                  className="w-3 h-3 inline-flex items-center justify-center rounded-[2px]"
                  style={{
                    background: done ? tone : 'transparent',
                    border: done ? 'none' : '1px solid rgba(180,140,80,0.3)',
                  }}
                >
                  {done && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#0E0C0A" strokeWidth="3" className="w-full h-full">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                </span>
                {done ? 'Concluída' : 'Marcar'}
              </button>
            </div>

            <h3
              className="font-serif text-[1.4rem] md:text-[1.55rem] leading-tight mb-2 text-text-bright transition-colors group-hover:[color:var(--stage-accent)]"
              style={{ '--stage-accent': tone }}
            >
              {renderHighlightedTitle(stage.title)}
            </h3>

            {stage.summary && (
              <p className="text-[0.92rem] text-text-dim leading-[1.7] mb-3 line-clamp-3 max-w-prose">
                {stage.summary}
              </p>
            )}

            <span
              className="inline-flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.22em] uppercase mt-2 opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ color: tone }}
            >
              Abrir etapa
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* Thumb */}
          <div className="relative order-first md:order-last h-32 md:h-auto md:min-h-[180px] overflow-hidden">
            {displayImage ? (
              <>
                <img
                  src={displayImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 md:bg-gradient-to-l md:from-transparent md:via-bg-card/30 md:to-bg-card" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-transparent to-transparent md:from-bg-card/20" />
              </>
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center overflow-hidden"
                style={{
                  background: `radial-gradient(circle at 65% 45%, ${tone}40 0%, ${tone}14 45%, transparent 75%), linear-gradient(135deg, ${tone}22 0%, transparent 80%)`,
                }}
              >
                {/* Linhas guia decorativas, bem sutis */}
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
                {/* Ícone gigante CENTRAL — agora bem visível */}
                <span
                  className="relative transition-transform duration-500 group-hover:scale-105"
                  style={{ color: `${tone}d9` }}
                  aria-hidden
                >
                  <TrilhaIcon name={iconName} size={92} strokeWidth={1.4} />
                </span>
              </div>
            )}

            {/* Selo de etapa no canto */}
            <span
              className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-sm"
              style={{
                color: done ? '#0E0C0A' : tone,
                background: done ? tone : `${tone}26`,
                border: `1px solid ${tone}66`,
              }}
              aria-hidden
              title={extra ? 'Etapa extra' : iconLabel(iconName)}
            >
              {done ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              ) : (
                <TrilhaIcon name={iconName} size={15} />
              )}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
