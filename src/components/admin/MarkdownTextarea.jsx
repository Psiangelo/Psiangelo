'use client';

/**
 * MarkdownTextarea — textarea + toolbar mínima (B / I / Link / Lista).
 * Envolve a seleção atual com tokens markdown. Atalhos Ctrl/Cmd+B e Ctrl/Cmd+I.
 *
 * Convenção: `*itálico dourado*` é renderizado pelo `renderHighlightedTitle`
 * em títulos/excerpts, e dentro do bloco text marcamos como `<em>`.
 */

import { useRef, useCallback } from 'react';

const TOOLBAR_BTN = 'px-2 py-1 text-[11px] font-mono text-[#B8AD9E] hover:text-[#B48C50] border border-[rgba(180,140,80,0.2)] hover:border-[#B48C50] rounded transition-colors';

function wrapSelection(textarea, before, after = before, placeholder = '') {
  if (!textarea) return null;
  const { selectionStart, selectionEnd, value } = textarea;
  const selected = value.slice(selectionStart, selectionEnd);
  const insertion = selected || placeholder;
  const newValue =
    value.slice(0, selectionStart) +
    before + insertion + after +
    value.slice(selectionEnd);
  const newCaret = selectionStart + before.length + insertion.length + after.length;
  return { newValue, newCaret };
}

export default function MarkdownTextarea({ value, onChange, rows = 6, placeholder = '', className = '' }) {
  const ref = useRef(null);

  const apply = useCallback((before, after, placeholderText) => {
    const ta = ref.current;
    if (!ta) return;
    const result = wrapSelection(ta, before, after, placeholderText);
    if (!result) return;
    onChange(result.newValue);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(result.newCaret, result.newCaret);
    });
  }, [onChange]);

  const handleKeyDown = (e) => {
    const meta = e.ctrlKey || e.metaKey;
    if (!meta) return;
    const key = e.key.toLowerCase();
    if (key === 'b') { e.preventDefault(); apply('**', '**', 'texto'); }
    else if (key === 'i') { e.preventDefault(); apply('*', '*', 'texto'); }
    else if (key === 'k') {
      e.preventDefault();
      const url = window.prompt('URL do link:', 'https://');
      if (url) apply('[', `](${url})`, 'texto');
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex gap-1 items-center">
        <button type="button" onClick={() => apply('**', '**', 'texto')} className={TOOLBAR_BTN} title="Negrito (Ctrl+B)"><b>B</b></button>
        <button type="button" onClick={() => apply('*', '*', 'texto')} className={TOOLBAR_BTN} title="Itálico (Ctrl+I)"><i>I</i></button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('URL do link:', 'https://');
            if (url) apply('[', `](${url})`, 'texto');
          }}
          className={TOOLBAR_BTN}
          title="Link (Ctrl+K)"
        >
          🔗
        </button>
        <button type="button" onClick={() => apply('> ', '', 'citação')} className={TOOLBAR_BTN} title="Citação">❝</button>
        <button type="button" onClick={() => apply('\n- ', '', 'item')} className={TOOLBAR_BTN} title="Lista">•</button>
        <span className="ml-auto text-[10px] text-[#6E6458] font-mono italic">markdown · Ctrl+B/I/K</span>
      </div>
      <textarea
        ref={ref}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={rows}
        placeholder={placeholder}
        className={`w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors resize-y ${className}`}
      />
    </div>
  );
}
