'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrilhas, setTrilhas, getMaterials, getGlossario, getCartographies } from '@/lib/sitedata';
import { LINK_KINDS, BLOCK_KINDS, migrateStageToBlocks, migrateTrilhaBlocks } from '@/lib/linkResolver';
import MarkdownTextarea from './MarkdownTextarea';

const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
const TEXTAREA = INPUT + ' resize-y';
const LABEL = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER = 'px-3 py-1.5 border border-red-500/30 text-red-400 text-xs font-sans rounded-lg hover:bg-red-500/10 transition-colors';

const ARCHETYPES = ['Persona', 'Self', 'Anima', 'Animus', 'Sombra'];
const STAGE_KINDS = ['livro', 'leitura', 'mapa', 'curso', 'ensaio', 'video', 'extra'];
const LEVELS = ['Introdutório', 'Intermediário', 'Avançado'];

function readJsonSafe(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function slugify(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const EMPTY_TRILHA = () => ({
  id: `trilha-${Date.now().toString(36)}`,
  slug: '',
  name: '',
  subtitle: '',
  coverImage: '',
  archetype: '',
  duration: '',
  level: '',
  stages: [],
});

const EMPTY_STAGE = (idx = 0) => ({
  id: `stage-${Date.now().toString(36).slice(-5)}`,
  slug: `etapa-${idx + 1}`,
  title: '',
  kind: 'leitura',
  summary: '',
  blocks: [],
});

const EMPTY_BLOCK = (type = 'text') => {
  switch (type) {
    case 'text':        return { type, body: '' };
    case 'link':        return { type, link: { kind: 'material', value: '', label: '' } };
    case 'media':       return { type, provider: 'youtube', url: '', caption: '' };
    case 'embed':       return { type, html: '', caption: '' };
    case 'cartography': return { type, slug: 'home', caption: '' };
    case 'quote':       return { type, body: '', cite: '' };
    default:            return { type: 'text', body: '' };
  }
};

/* ───────────────────── LinkPicker (interno do block tipo 'link') ───────────────────── */
function LinkPicker({ link, onChange, lists }) {
  const safeLink = link && link.kind ? link : { kind: 'material', value: '', label: '' };
  const update = (k, v) => onChange({ ...safeLink, [k]: v });

  const renderValue = () => {
    switch (safeLink.kind) {
      case 'material':
        return (
          <select value={safeLink.value || ''} onChange={(e) => update('value', e.target.value)} className={INPUT}>
            <option value="">— escolher material —</option>
            {lists.materials.map((m) => (<option key={m.id} value={m.id}>{m.title}</option>))}
          </select>
        );
      case 'blog':
        return (
          <select value={safeLink.value || ''} onChange={(e) => update('value', e.target.value)} className={INPUT}>
            <option value="">— escolher post —</option>
            {lists.posts.map((p) => (<option key={p.slug || p.id} value={p.slug || p.id}>{p.title}</option>))}
          </select>
        );
      case 'course':
        return (
          <select value={safeLink.value || ''} onChange={(e) => update('value', e.target.value)} className={INPUT}>
            <option value="">— escolher curso —</option>
            {lists.courses.map((c) => (<option key={c.slug || c.id} value={c.slug || c.id}>{c.title}</option>))}
          </select>
        );
      case 'glossario':
        return (
          <select value={safeLink.value || ''} onChange={(e) => update('value', e.target.value)} className={INPUT}>
            <option value="">— escolher verbete —</option>
            {lists.glossario.map((g) => (<option key={g.slug} value={g.slug}>{g.term}</option>))}
          </select>
        );
      case 'youtube':
      case 'drive':
      case 'url':
        return (
          <input
            value={safeLink.value || ''}
            onChange={(e) => update('value', e.target.value)}
            placeholder={safeLink.kind === 'youtube' ? 'https://www.youtube.com/watch?v=...' : safeLink.kind === 'drive' ? 'https://drive.google.com/...' : 'https://...'}
            className={INPUT + ' font-mono text-xs'}
          />
        );
      default:
        return <p className="text-xs text-[#6E6458] italic py-2">Tipo não suportado aqui.</p>;
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2">
        <select value={safeLink.kind} onChange={(e) => update('kind', e.target.value)} className={INPUT}>
          {LINK_KINDS.filter((k) => k.value !== 'none' && k.value !== 'embed').map((k) => (
            <option key={k.value} value={k.value}>{k.label}</option>
          ))}
        </select>
        {renderValue()}
      </div>
      <input
        value={safeLink.label || ''}
        onChange={(e) => update('label', e.target.value)}
        placeholder="Rótulo do card (opcional)"
        className={INPUT + ' text-xs'}
      />
    </div>
  );
}

/* ───────────────────── BlockEditor (1 bloco) ───────────────────── */
function BlockEditor({ block, idx, onChange, onRemove, onMove, onDragStart, onDragOver, onDrop, isDragging, isOver, lists }) {
  const update = (k, v) => onChange({ ...block, [k]: v });

  const renderFields = () => {
    switch (block.type) {
      case 'text':
        return (
          <div>
            <label className={LABEL}>Texto (parágrafos separados por linha em branco)</label>
            <MarkdownTextarea
              value={block.body || ''}
              onChange={(v) => update('body', v)}
              rows={6}
              placeholder="**negrito**, *itálico dourado*, [link](url), citações com >"
            />
          </div>
        );
      case 'link':
        return (
          <div>
            <label className={LABEL}>Material vinculado</label>
            <LinkPicker link={block.link} onChange={(link) => update('link', link)} lists={lists} />
          </div>
        );
      case 'media':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
              <select value={block.provider || 'youtube'} onChange={(e) => update('provider', e.target.value)} className={INPUT}>
                <option value="youtube">YouTube</option>
                <option value="drive">Google Drive</option>
              </select>
              <input value={block.url || ''} onChange={(e) => update('url', e.target.value)} placeholder="URL do vídeo" className={INPUT + ' font-mono text-xs'} />
            </div>
            <input value={block.caption || ''} onChange={(e) => update('caption', e.target.value)} placeholder="Legenda (opcional)" className={INPUT + ' text-xs'} />
          </div>
        );
      case 'embed':
        return (
          <div className="space-y-2">
            <textarea value={block.html || ''} onChange={(e) => update('html', e.target.value)} rows={4} placeholder='<iframe src="..." ...></iframe>' className={TEXTAREA + ' font-mono text-xs'} />
            <input value={block.caption || ''} onChange={(e) => update('caption', e.target.value)} placeholder="Legenda (opcional)" className={INPUT + ' text-xs'} />
          </div>
        );
      case 'cartography':
        return (
          <div className="space-y-2">
            <select value={block.slug || 'home'} onChange={(e) => update('slug', e.target.value)} className={INPUT}>
              {lists.cartographies.map((c) => (<option key={c.slug} value={c.slug}>{c.name} · {c.source}</option>))}
            </select>
            <input value={block.caption || ''} onChange={(e) => update('caption', e.target.value)} placeholder="Legenda (opcional)" className={INPUT + ' text-xs'} />
          </div>
        );
      case 'quote':
        return (
          <div className="space-y-2">
            <textarea value={block.body || ''} onChange={(e) => update('body', e.target.value)} rows={3} className={TEXTAREA} placeholder="Texto da citação" />
            <input value={block.cite || ''} onChange={(e) => update('cite', e.target.value)} placeholder="Autor / fonte (opcional)" className={INPUT + ' text-xs'} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, idx)}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(idx); }}
      onDragEnd={() => onDragOver?.(null)}
      onDrop={(e) => { e.preventDefault(); onDrop?.(idx); }}
      className={`bg-[#0E0C0A] border rounded-lg p-4 space-y-3 transition-all ${
        isDragging ? 'opacity-40' : ''
      } ${isOver ? 'border-[#B48C50] border-2' : 'border-[rgba(180,140,80,0.12)]'}`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="cursor-grab text-[#6E6458] hover:text-[#B48C50] select-none" title="Arraste para reordenar">⋮⋮</span>
          <span className="font-mono text-[10px] text-[#B48C50] tracking-widest uppercase">Bloco {idx + 1}</span>
          <select value={block.type} onChange={(e) => onChange(EMPTY_BLOCK(e.target.value))} className={INPUT + ' text-xs max-w-[280px]'}>
            {BLOCK_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onMove(-1)} className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50]">↑</button>
          <button onClick={() => onMove(1)} className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50]">↓</button>
          <button onClick={onRemove} className={BTN_DANGER}>Remover</button>
        </div>
      </div>
      {renderFields()}
    </div>
  );
}

/* ───────────────────── StageEditor ───────────────────── */
function StageEditor({ stage, idx, onChange, onRemove, onMove, onDragStart, onDragOver, onDrop, isDragging, isOver, lists }) {
  const update = (k, v) => onChange({ ...stage, [k]: v });

  const addBlock = () => onChange({ ...stage, blocks: [...(stage.blocks || []), EMPTY_BLOCK('text')] });
  const updateBlock = (i, b) => onChange({ ...stage, blocks: stage.blocks.map((x, j) => j === i ? b : x) });
  const removeBlock = (i) => onChange({ ...stage, blocks: stage.blocks.filter((_, j) => j !== i) });
  const moveBlock = (i, delta) => {
    const next = [...(stage.blocks || [])];
    const swap = i + delta;
    if (swap < 0 || swap >= next.length) return;
    [next[i], next[swap]] = [next[swap], next[i]];
    onChange({ ...stage, blocks: next });
  };

  // Drag-and-drop de blocos
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const onBlockDragStart = (e, i) => {
    setDragIdx(i);
    try { e.dataTransfer.effectAllowed = 'move'; } catch {}
  };
  const onBlockDragOver = (i) => setOverIdx(i);
  const onBlockDrop = (i) => {
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setOverIdx(null); return; }
    const next = [...(stage.blocks || [])];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    onChange({ ...stage, blocks: next });
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div
      draggable
      onDragStart={(e) => { e.stopPropagation(); onDragStart?.(e, idx); try { e.dataTransfer.effectAllowed = 'move'; } catch {} }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); onDragOver?.(idx); }}
      onDragEnd={() => onDragOver?.(null)}
      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onDrop?.(idx); }}
      className={`${CARD} space-y-4 transition-all ${isDragging ? 'opacity-40' : ''} ${isOver ? 'ring-2 ring-[#B48C50]' : ''}`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="cursor-grab text-[#6E6458] hover:text-[#B48C50] select-none" title="Arraste para reordenar">⋮⋮</span>
          <span className="font-mono text-[10px] text-[#B48C50] tracking-widest uppercase">Etapa {idx + 1}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onMove(-1)} className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50]">↑</button>
          <button onClick={() => onMove(1)} className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50]">↓</button>
          <button onClick={onRemove} className={BTN_DANGER}>Remover etapa</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-3">
        <div>
          <label className={LABEL}>Título</label>
          <input
            value={stage.title}
            onChange={(e) => {
              const title = e.target.value;
              const newSlug = !stage.slug || stage.slug.startsWith('etapa-') ? slugify(title) : stage.slug;
              onChange({ ...stage, title, slug: newSlug });
            }}
            placeholder="Ex: I · Antes do Jung"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Tipo (rótulo)</label>
          <select value={stage.kind || 'leitura'} onChange={(e) => update('kind', e.target.value)} className={INPUT}>
            {STAGE_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL}>Slug (URL: /estudos/&lt;trilha&gt;/<span className="text-[#B48C50]">{stage.slug}</span>)</label>
        <input
          value={stage.slug || ''}
          onChange={(e) => update('slug', e.target.value)}
          onBlur={(e) => update('slug', slugify(e.target.value))}
          className={INPUT + ' font-mono text-xs'}
        />
      </div>

      <div>
        <label className={LABEL}>Resumo (aparece no card e no hero da etapa)</label>
        <textarea value={stage.summary || ''} onChange={(e) => update('summary', e.target.value)} rows={2} className={TEXTAREA} placeholder="Frase curta que explica esta etapa..." />
      </div>

      <div>
        <label className={LABEL}>Imagem de capa da etapa (opcional)</label>
        <input
          value={stage.coverImage || ''}
          onChange={(e) => update('coverImage', e.target.value)}
          placeholder="https://... ou /images/capa.jpg"
          className={INPUT + ' text-xs font-mono'}
        />
        {stage.coverImage && (
          <div className="mt-2 w-32 h-20 rounded overflow-hidden border border-[rgba(180,140,80,0.15)]">
            <img src={stage.coverImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={LABEL + ' mb-0'}>
            Conteúdo da etapa ({(stage.blocks || []).length} {(stage.blocks || []).length === 1 ? 'bloco' : 'blocos'})
          </label>
          <button onClick={addBlock} className={BTN_SECONDARY}>+ Bloco</button>
        </div>
        <div className="space-y-3">
          {(stage.blocks || []).map((b, i) => (
            <BlockEditor
              key={i}
              block={b}
              idx={i}
              onChange={(nb) => updateBlock(i, nb)}
              onRemove={() => removeBlock(i)}
              onMove={(delta) => moveBlock(i, delta)}
              onDragStart={onBlockDragStart}
              onDragOver={onBlockDragOver}
              onDrop={onBlockDrop}
              isDragging={dragIdx === i}
              isOver={overIdx === i && dragIdx !== null && dragIdx !== i}
              lists={lists}
            />
          ))}
          {(stage.blocks || []).length === 0 && (
            <p className="text-xs text-[#6E6458] italic text-center py-6 border border-dashed border-[rgba(180,140,80,0.15)] rounded-lg">
              Sem blocos. Clique em "+ Bloco" para adicionar texto, vídeo, link, cartografia…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── TrilhaEditor ───────────────────── */
function TrilhaEditor({ trilha, onChange, onCancel, onDelete, lists }) {
  const [draft, setDraft] = useState(() => migrateTrilhaBlocks(trilha));
  useEffect(() => setDraft(migrateTrilhaBlocks(trilha)), [trilha.id]);

  const update = (k, v) => setDraft({ ...draft, [k]: v });
  const updateStage = (idx, ns) => setDraft({ ...draft, stages: draft.stages.map((s, i) => i === idx ? ns : s) });
  const addStage = () => setDraft({ ...draft, stages: [...draft.stages, migrateStageToBlocks(EMPTY_STAGE(draft.stages.length), draft.stages.length)] });
  const removeStage = (idx) => setDraft({ ...draft, stages: draft.stages.filter((_, i) => i !== idx) });
  const moveStage = (idx, delta) => {
    const next = [...draft.stages];
    const swap = idx + delta;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setDraft({ ...draft, stages: next });
  };

  // Drag-and-drop entre etapas
  const [stageDragIdx, setStageDragIdx] = useState(null);
  const [stageOverIdx, setStageOverIdx] = useState(null);
  const onStageDragStart = (e, i) => setStageDragIdx(i);
  const onStageDragOver = (i) => setStageOverIdx(i);
  const onStageDrop = (i) => {
    if (stageDragIdx === null || stageDragIdx === i) { setStageDragIdx(null); setStageOverIdx(null); return; }
    const next = [...draft.stages];
    const [moved] = next.splice(stageDragIdx, 1);
    next.splice(i, 0, moved);
    setDraft({ ...draft, stages: next });
    setStageDragIdx(null);
    setStageOverIdx(null);
  };

  return (
    <div className={CARD + ' space-y-5'}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-serif text-[#E8DDD0]">{draft.name ? `Editar: ${draft.name}` : 'Nova trilha'}</h3>
        <div className="flex gap-2">
          <button onClick={onCancel} className={BTN_SECONDARY}>Cancelar</button>
          <button onClick={() => onChange(draft)} className={BTN_PRIMARY}>Salvar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Nome *</label>
          <input
            value={draft.name}
            onChange={(e) => {
              const name = e.target.value;
              const next = { ...draft, name };
              if (!draft.slug || draft.slug.startsWith('trilha-')) next.slug = slugify(name);
              setDraft(next);
            }}
            placeholder="Ex: Começando em Jung"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Subtítulo</label>
          <input value={draft.subtitle} onChange={(e) => update('subtitle', e.target.value)} placeholder="Para quem está chegando agora..." className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Slug (URL: /estudos/<span className="text-[#B48C50]">{draft.slug || draft.id}</span>)</label>
          <input
            value={draft.slug || ''}
            onChange={(e) => update('slug', e.target.value)}
            onBlur={(e) => update('slug', slugify(e.target.value))}
            className={INPUT + ' font-mono text-xs'}
          />
        </div>
        <div>
          <label className={LABEL}>Imagem de capa (opcional)</label>
          <input
            value={draft.coverImage || ''}
            onChange={(e) => update('coverImage', e.target.value)}
            placeholder="https://... ou /images/capa.jpg"
            className={INPUT + ' text-xs font-mono'}
          />
          {draft.coverImage && (
            <div className="mt-2 w-40 h-24 rounded overflow-hidden border border-[rgba(180,140,80,0.15)]">
              <img src={draft.coverImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL}>Nível (opcional)</label>
          <select value={draft.level || ''} onChange={(e) => update('level', e.target.value)} className={INPUT}>
            <option value="">— sem nível —</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>Duração (opcional)</label>
          <input value={draft.duration || ''} onChange={(e) => update('duration', e.target.value)} placeholder="4 a 6 semanas" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Arquétipo / tom (opcional)</label>
          <select value={draft.archetype || ''} onChange={(e) => update('archetype', e.target.value)} className={INPUT}>
            <option value="">— sem tom —</option>
            {ARCHETYPES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={LABEL + ' mb-0'}>Etapas ({draft.stages.length})</label>
          <button onClick={addStage} className={BTN_SECONDARY}>+ Etapa</button>
        </div>
        <div className="space-y-4">
          {draft.stages.map((s, i) => (
            <StageEditor
              key={s.id || i}
              stage={s}
              idx={i}
              onChange={(ns) => updateStage(i, ns)}
              onRemove={() => removeStage(i)}
              onMove={(delta) => moveStage(i, delta)}
              onDragStart={onStageDragStart}
              onDragOver={onStageDragOver}
              onDrop={onStageDrop}
              isDragging={stageDragIdx === i}
              isOver={stageOverIdx === i && stageDragIdx !== null && stageDragIdx !== i}
              lists={lists}
            />
          ))}
          {draft.stages.length === 0 && (
            <p className="text-xs text-[#6E6458] italic text-center py-6 border border-dashed border-[rgba(180,140,80,0.15)] rounded-lg">
              Nenhuma etapa ainda — clique em &ldquo;+ Etapa&rdquo;.
            </p>
          )}
        </div>
      </div>

      {onDelete && (
        <div className="pt-4 border-t border-[rgba(180,140,80,0.1)] flex justify-end">
          <button onClick={onDelete} className={BTN_DANGER}>Apagar trilha</button>
        </div>
      )}
    </div>
  );
}

/* ───────────────────── Main ───────────────────── */
export default function TrilhasManager({ addToast, addLogEntry }) {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [lists, setLists] = useState({ materials: [], posts: [], courses: [], glossario: [], cartographies: [] });

  useEffect(() => {
    setList(getTrilhas());
  }, []);

  useEffect(() => {
    const sync = () => {
      setLists({
        materials: getMaterials() || [],
        posts: readJsonSafe('angelo_admin_blog', []),
        courses: readJsonSafe('angelo_admin_courses', []),
        glossario: getGlossario() || [],
        cartographies: getCartographies() || [],
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

  const persist = (newList) => {
    setList(newList);
    setTrilhas(newList);
  };

  const handleSave = (trilha) => {
    // Garante slug
    const final = { ...trilha, slug: trilha.slug || slugify(trilha.name) || trilha.id };
    const exists = list.some((t) => t.id === final.id);
    const newList = exists ? list.map((t) => (t.id === final.id ? final : t)) : [...list, final];
    persist(newList);
    setEditing(null);
    addLogEntry?.(exists ? 'Trilha atualizada' : 'Trilha criada', final.name);
    addToast?.(exists ? 'Trilha atualizada' : 'Trilha criada', 'success');
  };

  const handleDelete = (id) => {
    if (!confirm('Apagar esta trilha?')) return;
    const t = list.find((x) => x.id === id);
    persist(list.filter((x) => x.id !== id));
    setEditing(null);
    addLogEntry?.('Trilha apagada', t?.name || id);
    addToast?.('Trilha apagada', 'success');
  };

  const handleMove = (id, delta) => {
    const idx = list.findIndex((t) => t.id === id);
    const newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= list.length) return;
    const next = [...list];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    persist(next);
  };

  const editingTrilha = editing === 'new' ? EMPTY_TRILHA() : list.find((t) => t.id === editing);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Estudos · Trilhas</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Cada trilha é um guia rico — etapas com texto, vídeos, materiais, cartografia e ensaios. Aparece em /estudos.
          </p>
        </div>
        {!editing && <button onClick={() => setEditing('new')} className={BTN_PRIMARY}>+ Nova trilha</button>}
      </div>

      <AnimatePresence mode="wait">
        {editing && editingTrilha ? (
          <motion.div key="editor" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <TrilhaEditor
              trilha={editingTrilha}
              onChange={handleSave}
              onCancel={() => setEditing(null)}
              onDelete={editing !== 'new' ? () => handleDelete(editing) : null}
              lists={lists}
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {list.length === 0 && (
              <div className="text-center py-12 border border-dashed border-[rgba(180,140,80,0.15)] rounded-xl">
                <p className="text-sm text-[#6E6458] font-sans italic mb-4">Nenhuma trilha ainda.</p>
                <button onClick={() => setEditing('new')} className={BTN_PRIMARY}>+ Criar primeira trilha</button>
              </div>
            )}
            {list.map((t, i) => {
              const migrated = migrateTrilhaBlocks(t);
              const slug = migrated.slug || migrated.id;
              const tagParts = [migrated.level, migrated.archetype, migrated.duration].filter(Boolean);
              return (
                <div key={t.id} className={CARD + ' flex items-start justify-between gap-4'}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {tagParts.length > 0 && (
                        <span className="font-mono text-[10px] text-[#B48C50] tracking-widest uppercase">{tagParts.join(' · ')}</span>
                      )}
                      <span className="font-mono text-[10px] text-[#6E6458] tracking-widest uppercase">
                        {migrated.stages.length} etapas · {migrated.stages.reduce((sum, s) => sum + (s.blocks?.length || 0), 0)} blocos
                      </span>
                      <span className="font-mono text-[9px] text-[#6E6458] tracking-widest">
                        /estudos/<span className="text-[#B48C50]">{slug}</span>
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-[#E8DDD0] leading-tight">{migrated.name}</h3>
                    <p className="text-xs text-[#B8AD9E] mt-1 italic">{migrated.subtitle}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <div className="flex gap-1">
                      <button onClick={() => handleMove(t.id, -1)} disabled={i === 0} className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50] disabled:opacity-30">↑</button>
                      <button onClick={() => handleMove(t.id, 1)} disabled={i === list.length - 1} className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50] disabled:opacity-30">↓</button>
                    </div>
                    <button onClick={() => setEditing(t.id)} className={BTN_SECONDARY}>Editar</button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
