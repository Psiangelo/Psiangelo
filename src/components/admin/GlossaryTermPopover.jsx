'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getGlossario } from '@/lib/sitedata';

/**
 * GlossaryTermPopover — escolhe a qual verbete o trecho selecionado aponta.
 *
 * O autolink acerta o óbvio (a grafia do termo ou de um alias). Este popover
 * cobre o resto: marcar «aquele núcleo afetivo» como complexo, ou decidir que
 * neste parágrafo «a imagem» quer dizer arquétipo. Quem sabe isso é quem
 * escreveu.
 *
 * Grava só o slug no conteúdo; título e definição são lidos do glossário no
 * build, então reescrever um verbete atualiza todos os posts sozinho.
 */
export default function GlossaryTermPopover({ selectedText, currentSlug, onSubmit, onRemove, onClose }) {
  const [busca, setBusca] = useState('');
  const inputRef = useRef(null);
  const lista = useMemo(() => getGlossario(), []);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    const visiveis = (lista || []).filter((t) => t && t.slug && !t.hidden);
    if (!q) return visiveis.slice(0, 40);
    return visiveis
      .filter((t) => {
        const alvos = [t.term, t.slug, ...(t.aliases || [])].map((s) => String(s || '').toLowerCase());
        return alvos.some((a) => a.includes(q));
      })
      .slice(0, 40);
  }, [busca, lista]);

  return (
    <div className="absolute top-full left-0 mt-2 z-50 w-[320px] bg-[#1A1714] border border-[rgba(180,140,80,0.25)] rounded-xl shadow-xl shadow-black/50 overflow-hidden">
      <div className="px-3 pt-3 pb-2 border-b border-[rgba(180,140,80,0.12)]">
        <p className="text-[0.62rem] uppercase tracking-widest text-[#6E6458] font-sans mb-2">
          Apontar para um verbete
        </p>
        {selectedText ? (
          <p className="text-xs text-[#B8AD9E] font-sans mb-2 truncate">
            Trecho: <span className="text-[#E8DDD0]">“{selectedText}”</span>
          </p>
        ) : (
          <p className="text-xs text-yellow-200/70 font-sans mb-2">
            Selecione um trecho do texto primeiro.
          </p>
        )}
        <input
          ref={inputRef}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar verbete…"
          className="w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.2)] focus:border-[#B48C50] rounded-lg px-3 py-2 text-sm text-[#E8DDD0] outline-none font-sans"
        />
      </div>

      <ul className="max-h-[260px] overflow-y-auto">
        {filtrados.length === 0 && (
          <li className="px-3 py-4 text-xs text-[#6E6458] font-sans">Nenhum verbete encontrado.</li>
        )}
        {filtrados.map((t) => (
          <li key={t.slug}>
            <button
              type="button"
              disabled={!selectedText}
              onClick={() => onSubmit?.(t.slug)}
              className={`w-full text-left px-3 py-2 hover:bg-[#221E1A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                currentSlug === t.slug ? 'bg-[#221E1A]' : ''
              }`}
            >
              <span className="block text-sm text-[#E8DDD0] font-sans">
                {t.term}
                {currentSlug === t.slug && <span className="text-[#B48C50] text-xs"> · atual</span>}
              </span>
              {t.short && (
                <span className="block text-[0.7rem] text-[#6E6458] font-sans leading-snug line-clamp-2">
                  {t.short}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-[rgba(180,140,80,0.12)]">
        {currentSlug ? (
          <button
            type="button"
            onClick={() => onRemove?.()}
            className="text-[0.7rem] text-[#6E6458] hover:text-red-300 font-sans transition-colors"
          >
            remover marcação
          </button>
        ) : (
          <span className="text-[0.66rem] text-[#6E6458] font-sans">
            O autolink já cobre os termos óbvios
          </span>
        )}
        <button
          type="button"
          onClick={() => onClose?.()}
          className="text-[0.7rem] text-[#6E6458] hover:text-[#E8DDD0] font-sans transition-colors"
        >
          fechar
        </button>
      </div>
    </div>
  );
}
