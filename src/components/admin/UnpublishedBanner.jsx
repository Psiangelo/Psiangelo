'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUnpublishedChanges } from '@/lib/useUnpublishedChanges';
import {
  collectAdminSnapshot,
  markPublished,
} from '@/lib/unpublishedChanges';
import {
  publishSnapshot,
  isSiteSupabaseWriteConfigured,
} from '@/lib/supabase-site';

function formatAgo(iso) {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return null;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora mesmo';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return `há ${d} dia${d > 1 ? 's' : ''}`;
}

// Parse das strings cruas de collectAdminSnapshot pra objetos (que é o
// que o Supabase espera no jsonb). Se alguma chave não for JSON válido,
// pula (mesmo comportamento do PublishManager original).
function buildPublishData() {
  const raw = collectAdminSnapshot();
  const out = {};
  for (const key of Object.keys(raw)) {
    try {
      out[key] = JSON.parse(raw[key]);
    } catch {
      /* skip */
    }
  }
  return out;
}

export default function UnpublishedBanner({ addToast, addLogEntry, onGoToPublish }) {
  const { ready, hasChanges, publishedAt } = useUnpublishedChanges();
  const [publishing, setPublishing] = useState(false);

  if (!ready || !hasChanges) return null;

  const handlePublish = async () => {
    if (!isSiteSupabaseWriteConfigured) {
      addToast?.('Supabase não configurado — abra a aba Publicar', 'error');
      onGoToPublish?.();
      return;
    }
    setPublishing(true);
    const data = buildPublishData();
    const result = await publishSnapshot({
      data,
      note: 'Publicado via banner',
    });
    setPublishing(false);
    if (result.ok) {
      markPublished();
      addToast?.('Publicado — visitantes e celular já veem as mudanças', 'success');
      addLogEntry?.('Publicado (banner)', `versão ${result.version}`);
    } else {
      addToast?.(`Falha ao publicar: ${result.error}`, 'error');
    }
  };

  const lastPublishedText = publishedAt
    ? `Última publicação: ${formatAgo(publishedAt)}`
    : 'Nunca publicado ainda';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="sticky top-[56px] sm:top-[64px] z-30 bg-[#B48C50] border-b border-[#9A7A48] shadow-md shadow-black/30"
        role="status"
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full bg-[#0E0C0A] animate-pulse flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-sans font-semibold text-[#0E0C0A] leading-tight">
                Você tem mudanças não publicadas
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#0E0C0A]/70 font-sans leading-tight">
                {lastPublishedText} · mobile e visitantes veem o conteúdo antigo até você publicar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {onGoToPublish && (
              <button
                type="button"
                onClick={onGoToPublish}
                className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-widest text-[#0E0C0A]/80 hover:text-[#0E0C0A] px-2 py-1"
              >
                ver detalhes →
              </button>
            )}
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="bg-[#0E0C0A] hover:bg-[#1A1714] disabled:opacity-60 disabled:cursor-not-allowed text-[#B48C50] text-xs sm:text-sm font-sans font-semibold tracking-wide px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              {publishing ? 'Publicando…' : 'Publicar agora'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
