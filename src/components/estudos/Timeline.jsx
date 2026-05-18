'use client';

import { motion } from 'framer-motion';
import TrilhaIcon from './icons';

/**
 * Timeline — coluna vertical à esquerda com bolinhas + linha conectora.
 *
 * O caller passa `items` (array de { id, icon, pct, accent }) e a renderização
 * dos cards via render prop `renderItem(item, idx)`. A timeline cuida só do
 * fluxo visual à esquerda: bolinha (vazia / anel / cheia) + segmento de
 * linha entre bolinhas (preenchido se a trilha está 100%).
 *
 * Props:
 *   items: [{ id, icon, pct, accent }]
 *   renderItem: (item, idx) => ReactNode
 *   defaultAccent: string
 */
export default function Timeline({ items = [], renderItem, defaultAccent = '#B48C50' }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <ol role="list" className="relative" aria-label="Trilhas de estudo">
      {items.map((item, idx) => {
        const accent = item.accent || defaultAccent;
        const isFirst = idx === 0;
        const isLast = idx === items.length - 1;
        const pct = Math.max(0, Math.min(100, item.pct || 0));
        const nextPct = !isLast ? Math.max(0, Math.min(100, items[idx + 1].pct || 0)) : 0;
        // Cor do segmento que vai DESTA bolinha pra próxima:
        // - 100% nesta = accent sólido na primeira metade
        // - 100% na próxima = accent na segunda metade
        const segmentTop = pct === 100 ? accent : `${accent}22`;
        const segmentBottom = nextPct > 0 ? accent : `${accent}22`;

        // Estados visuais da bolinha
        const isComplete = pct === 100;
        const isStarted = pct > 0 && pct < 100;
        const sealStyle = isComplete
          ? { background: accent, color: '#0E0C0A', borderColor: accent }
          : isStarted
          ? { background: `${accent}14`, color: accent, borderColor: accent, borderWidth: 2 }
          : { background: 'transparent', color: `${accent}aa`, borderColor: `${accent}55` };

        return (
          <li key={item.id} className="relative grid grid-cols-[64px_1fr] md:grid-cols-[88px_1fr] gap-x-3 md:gap-x-6">
            {/* Coluna timeline */}
            <div className="relative flex flex-col items-center pt-1">
              {/* Segmento ANTES da bolinha (do topo até bolinha) */}
              {!isFirst && (
                <div
                  className="w-px flex-shrink-0"
                  style={{ height: 24, background: `${accent}22` }}
                />
              )}
              {isFirst && <div className="w-px flex-shrink-0" style={{ height: 8 }} />}

              {/* Bolinha-selo */}
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full border z-10 transition-colors"
                style={sealStyle}
                title={`${Math.round(pct)}% concluído`}
              >
                <TrilhaIcon name={item.icon || 'compass'} size={20} strokeWidth={1.5} />
              </motion.span>

              {/* Segmento DEPOIS da bolinha (até próxima trilha ou fim) */}
              {!isLast ? (
                <div className="flex-1 w-px min-h-[60px]">
                  <div
                    className="w-px h-full"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, ${segmentTop}, ${segmentBottom})`,
                    }}
                  />
                </div>
              ) : (
                <div className="flex-1 w-px min-h-[40px]">
                  <div
                    className="w-px h-full"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, ${segmentTop}, transparent)`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Coluna conteúdo */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="pb-12 md:pb-16"
            >
              {renderItem(item, idx)}
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}
