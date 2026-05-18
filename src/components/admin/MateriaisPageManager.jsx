'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMateriaisPage, setMateriaisPage, DEFAULT_MATERIAIS_PAGE } from '@/lib/sitedata';

const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
const TEXTAREA = INPUT + ' resize-y';
const LABEL = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER_INLINE = 'text-red-400/70 hover:text-red-400 text-xs px-1';

const ICON_OPTIONS = [
  { value: 'graph',    label: 'Grafo (nós conectados)' },
  { value: 'mindmap',  label: 'Mapa mental' },
  { value: 'eye',      label: 'Olho (percepção)' },
  { value: 'book',     label: 'Livro' },
  { value: 'video',    label: 'Vídeo' },
  { value: 'pen',      label: 'Caneta' },
  { value: 'spark',    label: 'Faísca' },
];

export default function MateriaisPageManager({ addToast, addLogEntry }) {
  const [data, setData] = useState(DEFAULT_MATERIAIS_PAGE);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setData(getMateriaisPage());
  }, []);

  const updateBlock = (block, key, value) => {
    setData((prev) => ({ ...prev, [block]: { ...prev[block], [key]: value } }));
    setDirty(true);
  };

  const updateFeature = (idx, key, value) => {
    setData((prev) => ({
      ...prev,
      explanation: {
        ...prev.explanation,
        features: prev.explanation.features.map((f, i) => (i === idx ? { ...f, [key]: value } : f)),
      },
    }));
    setDirty(true);
  };

  const addFeature = () => {
    setData((prev) => ({
      ...prev,
      explanation: {
        ...prev.explanation,
        features: [...prev.explanation.features, { icon: 'graph', title: 'Novo destaque', body: '' }],
      },
    }));
    setDirty(true);
  };

  const removeFeature = (idx) => {
    setData((prev) => ({
      ...prev,
      explanation: {
        ...prev.explanation,
        features: prev.explanation.features.filter((_, i) => i !== idx),
      },
    }));
    setDirty(true);
  };

  const persist = () => {
    setMateriaisPage(data);
    setDirty(false);
    addLogEntry?.('Página de materiais salva');
    addToast?.('Página de materiais salva', 'success');
  };

  const reset = () => {
    if (!confirm('Restaurar textos padrão da página /materiais?')) return;
    setData(DEFAULT_MATERIAIS_PAGE);
    setDirty(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Textos da página /materiais</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Hero, blocos de explicação e textos do catálogo. Salvas e exibidas em /materiais.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={reset} className={BTN_SECONDARY}>Restaurar padrão</button>
          <button onClick={persist} disabled={!dirty} className={BTN_PRIMARY + (dirty ? '' : ' opacity-40 cursor-not-allowed')}>
            Salvar
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className={CARD}>
        <h3 className="font-serif text-[#B48C50] text-sm uppercase tracking-widest mb-4">Hero (topo da página)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className={LABEL}>Eyebrow (pequena linha acima do título)</label>
            <input value={data.hero.eyebrow || ''} onChange={(e) => updateBlock('hero', 'eyebrow', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Título</label>
            <input value={data.hero.title || ''} onChange={(e) => updateBlock('hero', 'title', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Ênfase (em itálico)</label>
            <input value={data.hero.emphasis || ''} onChange={(e) => updateBlock('hero', 'emphasis', e.target.value)} className={INPUT} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Kicker</label>
            <input value={data.hero.kicker || ''} onChange={(e) => updateBlock('hero', 'kicker', e.target.value)} className={INPUT} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Lead (descrição abaixo do título)</label>
            <textarea value={data.hero.lead || ''} onChange={(e) => updateBlock('hero', 'lead', e.target.value)} rows={3} className={TEXTAREA} />
          </div>
          <div>
            <label className={LABEL}>Botão primário · texto</label>
            <input value={data.hero.primaryCtaLabel || ''} onChange={(e) => updateBlock('hero', 'primaryCtaLabel', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Botão primário · link</label>
            <input value={data.hero.primaryCtaHref || ''} onChange={(e) => updateBlock('hero', 'primaryCtaHref', e.target.value)} className={INPUT} placeholder="#catalogo" />
          </div>
          <div>
            <label className={LABEL}>Botão secundário · texto</label>
            <input value={data.hero.secondaryCtaLabel || ''} onChange={(e) => updateBlock('hero', 'secondaryCtaLabel', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Botão secundário · link</label>
            <input value={data.hero.secondaryCtaHref || ''} onChange={(e) => updateBlock('hero', 'secondaryCtaHref', e.target.value)} className={INPUT} placeholder="/#cartografia" />
          </div>
        </div>
      </div>

      {/* EXPLANATION */}
      <div className={CARD}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-serif text-[#B48C50] text-sm uppercase tracking-widest">Seção de destaques (entre hero e catálogo)</h3>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={data.explanation.show !== false} onChange={(e) => updateBlock('explanation', 'show', e.target.checked)} className="w-4 h-4 accent-[#B48C50]" />
              <span className="text-xs text-[#B8AD9E] font-sans">Mostrar</span>
            </label>
            <button onClick={addFeature} className={BTN_SECONDARY}>+ Destaque</button>
          </div>
        </div>

        <div className="space-y-3">
          {data.explanation.features.map((f, idx) => (
            <div key={idx} className="bg-[#0E0C0A]/60 border border-[rgba(180,140,80,0.08)] rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3">
                <div>
                  <label className={LABEL}>Ícone</label>
                  <select value={f.icon || 'graph'} onChange={(e) => updateFeature(idx, 'icon', e.target.value)} className={INPUT}>
                    {ICON_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Título</label>
                  <input value={f.title || ''} onChange={(e) => updateFeature(idx, 'title', e.target.value)} className={INPUT} />
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL}>Descrição</label>
                  <textarea value={f.body || ''} onChange={(e) => updateFeature(idx, 'body', e.target.value)} rows={2} className={TEXTAREA} />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button onClick={() => removeFeature(idx)} className={BTN_DANGER_INLINE}>Remover</button>
              </div>
            </div>
          ))}

          {data.explanation.features.length === 0 && (
            <p className="text-center font-serif italic text-[#6E6458] py-4">Sem destaques.</p>
          )}
        </div>
      </div>

      {/* CATALOG */}
      <div className={CARD}>
        <h3 className="font-serif text-[#B48C50] text-sm uppercase tracking-widest mb-4">Catálogo (textos)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Rótulo da seção</label>
            <input value={data.catalog.sectionLabel || ''} onChange={(e) => updateBlock('catalog', 'sectionLabel', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Placeholder da busca</label>
            <input value={data.catalog.searchPlaceholder || ''} onChange={(e) => updateBlock('catalog', 'searchPlaceholder', e.target.value)} className={INPUT} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Mensagem quando nada encontrado</label>
            <input value={data.catalog.emptyMessage || ''} onChange={(e) => updateBlock('catalog', 'emptyMessage', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Título "Em breve"</label>
            <input value={data.catalog.comingSoonLabel || ''} onChange={(e) => updateBlock('catalog', 'comingSoonLabel', e.target.value)} className={INPUT} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
