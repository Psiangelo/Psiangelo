'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getEstudosPage, setEstudosPage, DEFAULT_ESTUDOS_PAGE, ESTUDOS_BLOCK_TYPES,
  getTrilhas, getGlossario, getMaterials,
} from '@/lib/sitedata';

const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
const TEXTAREA = INPUT + ' resize-y';
const LABEL = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';

function readJsonSafe(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function blockLabel(id) {
  return ESTUDOS_BLOCK_TYPES.find((b) => b.id === id)?.label || id;
}

/* ───────── Toggle multi-seleção compacto ───────── */
function MultiPicker({ label, options, selected, onChange }) {
  const set = new Set(selected || []);
  const toggle = (val) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    onChange(Array.from(next));
  };
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {options.length === 0 ? (
        <p className="text-xs text-[#6E6458] italic">Sem itens disponíveis.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-[#0E0C0A]/60 border border-[rgba(180,140,80,0.08)] rounded-lg">
          {options.map((o) => {
            const active = set.has(o.value);
            return (
              <button
                key={o.value}
                onClick={() => toggle(o.value)}
                className={`px-2.5 py-1 text-[11px] font-sans rounded transition-colors ${
                  active
                    ? 'bg-[#B48C50] text-[#0E0C0A] font-semibold'
                    : 'border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] hover:border-[#B48C50]'
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}
      <p className="text-[10px] text-[#6E6458] mt-1">
        {set.size === 0 ? 'Vazio = mostrar todos (até o limite).' : `${set.size} selecionado(s).`}
      </p>
    </div>
  );
}

function BlockEditor({ block, idx, total, onChange, onMove, lists }) {
  const cfg = block.config || {};
  const updateConfig = (k, v) => onChange({ ...block, config: { ...cfg, [k]: v } });

  return (
    <div className={CARD}>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[#6E6458] tracking-widest">#{idx + 1}</span>
          <h3 className="font-serif text-[#E8DDD0] text-base">{blockLabel(block.id)}</h3>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!block.visible}
              onChange={(e) => onChange({ ...block, visible: e.target.checked })}
              className="w-4 h-4 accent-[#B48C50]"
            />
            <span className="text-xs text-[#B8AD9E]">Visível</span>
          </label>
          <button onClick={() => onMove(-1)} disabled={idx === 0} className={BTN_SECONDARY + ' disabled:opacity-30'}>↑</button>
          <button onClick={() => onMove(1)} disabled={idx === total - 1} className={BTN_SECONDARY + ' disabled:opacity-30'}>↓</button>
        </div>
      </div>

      {block.id === 'hero' && (
        <p className="text-[11px] text-[#6E6458] italic">Edite o hero no card "Hero" acima.</p>
      )}

      {block.id === 'manifesto' && (
        <div className="space-y-3">
          <div>
            <label className={LABEL}>Título</label>
            <input value={cfg.title || ''} onChange={(e) => updateConfig('title', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Corpo (texto livre, parágrafos separados por linha em branco)</label>
            <textarea value={cfg.body || ''} onChange={(e) => updateConfig('body', e.target.value)} rows={6} className={TEXTAREA} />
          </div>
        </div>
      )}

      {(block.id === 'trilhas' || block.id === 'glossario' || block.id === 'materiais' || block.id === 'cursos' || block.id === 'blog') && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Título da seção</label>
              <input value={cfg.title || ''} onChange={(e) => updateConfig('title', e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Subtítulo</label>
              <input value={cfg.subtitle || ''} onChange={(e) => updateConfig('subtitle', e.target.value)} className={INPUT} />
            </div>
          </div>

          {block.id === 'trilhas' && (
            <MultiPicker
              label="Trilhas exibidas (vazio = todas)"
              options={lists.trilhas.map((t) => ({ value: t.id, label: t.name }))}
              selected={cfg.selected}
              onChange={(v) => updateConfig('selected', v)}
            />
          )}
          {block.id === 'glossario' && (
            <>
              <MultiPicker
                label="Verbetes em destaque (vazio = ordem da curadoria)"
                options={lists.glossario.filter((t) => !t.hidden).map((t) => ({ value: t.slug, label: t.term }))}
                selected={cfg.selected}
                onChange={(v) => updateConfig('selected', v)}
              />
              <div>
                <label className={LABEL}>Limite</label>
                <input type="number" min="1" max="20" value={cfg.limit || 8} onChange={(e) => updateConfig('limit', Number(e.target.value) || 8)} className={INPUT + ' max-w-[120px]'} />
              </div>
            </>
          )}
          {block.id === 'materiais' && (
            <>
              <MultiPicker
                label="Materiais selecionados (vazio = todos os disponíveis)"
                options={lists.materials.map((m) => ({ value: m.id, label: m.title }))}
                selected={cfg.selected}
                onChange={(v) => updateConfig('selected', v)}
              />
              <div>
                <label className={LABEL}>Limite</label>
                <input type="number" min="1" max="20" value={cfg.limit || 6} onChange={(e) => updateConfig('limit', Number(e.target.value) || 6)} className={INPUT + ' max-w-[120px]'} />
              </div>
            </>
          )}
          {block.id === 'cursos' && (
            <MultiPicker
              label="Cursos selecionados (vazio = todos)"
              options={lists.courses.map((c) => ({ value: c.slug || c.id, label: c.title }))}
              selected={cfg.selected}
              onChange={(v) => updateConfig('selected', v)}
            />
          )}
          {block.id === 'blog' && (
            <>
              <MultiPicker
                label="Posts selecionados (vazio = mais recentes)"
                options={lists.posts.filter((p) => !p.status || p.status === 'published').map((p) => ({ value: p.slug || p.id, label: p.title }))}
                selected={cfg.selected}
                onChange={(v) => updateConfig('selected', v)}
              />
              <div>
                <label className={LABEL}>Limite</label>
                <input type="number" min="1" max="20" value={cfg.limit || 4} onChange={(e) => updateConfig('limit', Number(e.target.value) || 4)} className={INPUT + ' max-w-[120px]'} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function EstudosHubManager({ addToast, addLogEntry }) {
  const [data, setData] = useState(DEFAULT_ESTUDOS_PAGE);
  const [dirty, setDirty] = useState(false);
  const [lists, setLists] = useState({ trilhas: [], glossario: [], materials: [], courses: [], posts: [] });

  useEffect(() => {
    setData(getEstudosPage());
  }, []);

  useEffect(() => {
    const sync = () => {
      setLists({
        trilhas: getTrilhas() || [],
        glossario: getGlossario() || [],
        materials: getMaterials() || [],
        courses: readJsonSafe('angelo_admin_courses', []),
        posts: readJsonSafe('angelo_admin_blog', []),
      });
    };
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('sitedata:changed', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('sitedata:changed', sync);
    };
  }, []);

  const updateHero = (k, v) => {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, [k]: v } }));
    setDirty(true);
  };

  const updateBlock = (idx, newBlock) => {
    setData((prev) => ({ ...prev, blocks: prev.blocks.map((b, i) => (i === idx ? newBlock : b)) }));
    setDirty(true);
  };
  const moveBlock = (idx, delta) => {
    setData((prev) => {
      const next = [...prev.blocks];
      const swap = idx + delta;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return { ...prev, blocks: next };
    });
    setDirty(true);
  };

  const persist = () => {
    setEstudosPage(data);
    setDirty(false);
    addLogEntry?.('Página /estudos salva');
    addToast?.('Página /estudos salva', 'success');
  };

  const reset = () => {
    if (!confirm('Restaurar configuração padrão da /estudos?')) return;
    setData(DEFAULT_ESTUDOS_PAGE);
    setDirty(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Hub /estudos</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Segunda home para quem quer estudar. Edite o hero, ative blocos e selecione conteúdo.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={reset} className={BTN_SECONDARY}>Restaurar padrão</button>
          <button onClick={persist} disabled={!dirty} className={BTN_PRIMARY + (dirty ? '' : ' opacity-40 cursor-not-allowed')}>
            Salvar
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className={CARD}>
        <h3 className="font-serif text-[#B48C50] text-sm uppercase tracking-widest mb-4">Hero (topo)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className={LABEL}>Eyebrow</label>
            <input value={data.hero.eyebrow || ''} onChange={(e) => updateHero('eyebrow', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Título</label>
            <input value={data.hero.title || ''} onChange={(e) => updateHero('title', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Ênfase (itálico)</label>
            <input value={data.hero.emphasis || ''} onChange={(e) => updateHero('emphasis', e.target.value)} className={INPUT} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Kicker</label>
            <input value={data.hero.kicker || ''} onChange={(e) => updateHero('kicker', e.target.value)} className={INPUT} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Lead</label>
            <textarea value={data.hero.lead || ''} onChange={(e) => updateHero('lead', e.target.value)} rows={3} className={TEXTAREA} />
          </div>
          <div>
            <label className={LABEL}>Botão primário · texto</label>
            <input value={data.hero.primaryCtaLabel || ''} onChange={(e) => updateHero('primaryCtaLabel', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Botão primário · link</label>
            <input value={data.hero.primaryCtaHref || ''} onChange={(e) => updateHero('primaryCtaHref', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Botão secundário · texto</label>
            <input value={data.hero.secondaryCtaLabel || ''} onChange={(e) => updateHero('secondaryCtaLabel', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Botão secundário · link</label>
            <input value={data.hero.secondaryCtaHref || ''} onChange={(e) => updateHero('secondaryCtaHref', e.target.value)} className={INPUT} />
          </div>
        </div>
      </div>

      {/* Blocos */}
      <div className="space-y-3">
        <h3 className="font-serif text-[#B48C50] text-sm uppercase tracking-widest">Blocos da página</h3>
        <p className="text-xs text-[#6E6458] font-sans">Arraste a ordem com ↑↓ e desative blocos com a checkbox "Visível".</p>
        {data.blocks.map((b, i) => (
          <BlockEditor
            key={`${b.id}-${i}`}
            block={b}
            idx={i}
            total={data.blocks.length}
            onChange={(nb) => updateBlock(i, nb)}
            onMove={(delta) => moveBlock(i, delta)}
            lists={lists}
          />
        ))}
      </div>
    </motion.div>
  );
}
