'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCategories, setCategories, DEFAULT_CATEGORIES } from '@/lib/sitedata';

const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
const LABEL = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER = 'px-3 py-1.5 border border-red-500/30 text-red-400/80 text-xs font-sans rounded-lg hover:bg-red-500/10 transition-colors';

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function CategoriesManager({ addToast, addLogEntry }) {
  const [items, setItems] = useState(DEFAULT_CATEGORIES);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setItems(getCategories());
  }, []);

  const update = (idx, key, value) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));
    setDirty(true);
  };

  const move = (idx, dir) => {
    setItems((prev) => {
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next.map((it, i) => ({ ...it, ordem: i }));
    });
    setDirty(true);
  };

  const remove = (idx) => {
    if (!confirm(`Remover categoria "${items[idx].label}"? Materiais com esse slug perdem o vínculo.`)) return;
    setItems((prev) => prev.filter((_, i) => i !== idx).map((it, i) => ({ ...it, ordem: i })));
    setDirty(true);
  };

  const add = () => {
    const novo = {
      slug: `categoria-${Date.now()}`,
      label: 'Nova categoria',
      singular: 'Item',
      displayMode: 'compact',
      ordem: items.length,
    };
    setItems((prev) => [...prev, novo]);
    setDirty(true);
  };

  const persist = () => {
    const cleaned = items.map((it, i) => ({
      slug: slugify(it.slug) || `categoria-${i}`,
      label: it.label || 'Sem nome',
      singular: it.singular || it.label || 'Item',
      displayMode: it.displayMode === 'full' ? 'full' : 'compact',
      ordem: i,
    }));
    const slugs = new Set();
    for (const c of cleaned) {
      if (slugs.has(c.slug)) {
        addToast?.(`Slug duplicado: "${c.slug}"`, 'error');
        return;
      }
      slugs.add(c.slug);
    }
    setCategories(cleaned);
    setItems(cleaned);
    setDirty(false);
    addLogEntry?.('Categorias salvas', `${cleaned.length} itens`);
    addToast?.('Categorias salvas', 'success');
  };

  const reset = () => {
    if (!confirm('Restaurar categorias padrão? Sua personalização será perdida.')) return;
    setItems(DEFAULT_CATEGORIES);
    setDirty(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Categorias de materiais</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Ex.: Livros, Temas, E-book, Vídeo. O modo de exibição muda o tamanho do card no catálogo.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={reset} className={BTN_SECONDARY}>Restaurar padrão</button>
          <button onClick={add} className={BTN_SECONDARY}>+ Nova categoria</button>
          <button onClick={persist} disabled={!dirty} className={BTN_PRIMARY + (dirty ? '' : ' opacity-40 cursor-not-allowed')}>
            Salvar
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((cat, idx) => (
          <div key={`${cat.slug}-${idx}`} className={CARD}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Nome (plural)</label>
                <input value={cat.label} onChange={(e) => update(idx, 'label', e.target.value)} className={INPUT} placeholder="Livros" />
              </div>
              <div>
                <label className={LABEL}>Nome (singular)</label>
                <input value={cat.singular} onChange={(e) => update(idx, 'singular', e.target.value)} className={INPUT} placeholder="Livro" />
              </div>
              <div>
                <label className={LABEL}>Slug (identificador)</label>
                <input
                  value={cat.slug}
                  onChange={(e) => update(idx, 'slug', e.target.value)}
                  onBlur={(e) => update(idx, 'slug', slugify(e.target.value))}
                  className={INPUT + ' font-mono text-xs'}
                  placeholder="livro"
                />
              </div>
              <div>
                <label className={LABEL}>Modo de exibição</label>
                <select value={cat.displayMode} onChange={(e) => update(idx, 'displayMode', e.target.value)} className={INPUT}>
                  <option value="full">Cards grandes (com capa + descrição)</option>
                  <option value="compact">Tiles compactos (grid)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-[rgba(180,140,80,0.08)]">
              <span className="text-[10px] font-mono text-[#6E6458] tracking-widest">#{idx + 1}</span>
              <div className="flex gap-2">
                <button onClick={() => move(idx, -1)} disabled={idx === 0} className={BTN_SECONDARY + ' disabled:opacity-30'}>↑</button>
                <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className={BTN_SECONDARY + ' disabled:opacity-30'}>↓</button>
                <button onClick={() => remove(idx)} className={BTN_DANGER}>Remover</button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-10 border border-dashed border-[rgba(180,140,80,0.15)] rounded-xl">
            <p className="font-serif italic text-[#6E6458]">Sem categorias. Clique em "+ Nova categoria".</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
