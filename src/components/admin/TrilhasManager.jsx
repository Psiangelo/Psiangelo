'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrilhas, setTrilhas, getMaterials, getGlossario } from '@/lib/sitedata';
import { LINK_KINDS, migrateStageLink } from '@/lib/linkResolver';

const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
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

const EMPTY_TRILHA = () => ({
  id: `trilha-${Date.now().toString(36)}`,
  name: '',
  subtitle: '',
  archetype: '',
  duration: '',
  level: '',
  stages: [],
});

const EMPTY_STAGE = () => ({
  title: '',
  kind: 'leitura',
  detail: '',
  link: { kind: 'none', value: '', label: '' },
});

/* ───────────────────── LinkPicker ─────────────────────
   Componente compartilhado: seletor de tipo de link + valor apropriado.
   Recebe `link={kind, value, label}` e `onChange(link)`.
*/
function LinkPicker({ link, onChange, lists }) {
  const safeLink = link && link.kind ? link : { kind: 'none', value: '', label: '' };
  const update = (k, v) => onChange({ ...safeLink, [k]: v });

  const renderValue = () => {
    switch (safeLink.kind) {
      case 'material':
        return (
          <select value={safeLink.value || ''} onChange={(e) => update('value', e.target.value)} className={INPUT}>
            <option value="">— escolher material —</option>
            {lists.materials.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
        );
      case 'blog':
        return (
          <select value={safeLink.value || ''} onChange={(e) => update('value', e.target.value)} className={INPUT}>
            <option value="">— escolher post —</option>
            {lists.posts.map((p) => (
              <option key={p.slug || p.id} value={p.slug || p.id}>{p.title}</option>
            ))}
          </select>
        );
      case 'course':
        return (
          <select value={safeLink.value || ''} onChange={(e) => update('value', e.target.value)} className={INPUT}>
            <option value="">— escolher curso —</option>
            {lists.courses.map((c) => (
              <option key={c.slug || c.id} value={c.slug || c.id}>{c.title}</option>
            ))}
          </select>
        );
      case 'glossario':
        return (
          <select value={safeLink.value || ''} onChange={(e) => update('value', e.target.value)} className={INPUT}>
            <option value="">— escolher verbete —</option>
            {lists.glossario.map((g) => (
              <option key={g.slug} value={g.slug}>{g.term}</option>
            ))}
          </select>
        );
      case 'youtube':
        return (
          <input
            value={safeLink.value || ''}
            onChange={(e) => update('value', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={INPUT + ' font-mono text-xs'}
          />
        );
      case 'drive':
        return (
          <input
            value={safeLink.value || ''}
            onChange={(e) => update('value', e.target.value)}
            placeholder="https://drive.google.com/file/d/.../view"
            className={INPUT + ' font-mono text-xs'}
          />
        );
      case 'embed':
        return (
          <textarea
            value={safeLink.value || ''}
            onChange={(e) => update('value', e.target.value)}
            placeholder='<iframe src="..." ...></iframe>'
            rows={3}
            className={INPUT + ' font-mono text-xs resize-y'}
          />
        );
      case 'url':
        return (
          <input
            value={safeLink.value || ''}
            onChange={(e) => update('value', e.target.value)}
            placeholder="https://..."
            className={INPUT + ' font-mono text-xs'}
          />
        );
      case 'none':
      default:
        return (
          <p className="text-xs text-[#6E6458] italic font-sans py-2">Sem link — etapa só exibe o texto descritivo.</p>
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2">
        <select value={safeLink.kind} onChange={(e) => update('kind', e.target.value)} className={INPUT}>
          {LINK_KINDS.map((k) => (
            <option key={k.value} value={k.value}>{k.label}</option>
          ))}
        </select>
        {renderValue()}
      </div>
      {safeLink.kind !== 'none' && (
        <input
          value={safeLink.label || ''}
          onChange={(e) => update('label', e.target.value)}
          placeholder="Texto do botão (opcional — usa o título do item por padrão)"
          className={INPUT + ' text-xs'}
        />
      )}
    </div>
  );
}

function StageEditor({ stage, idx, onChange, onRemove, onMove, lists }) {
  const update = (k, v) => onChange({ ...stage, [k]: v });
  return (
    <div className="bg-[#0E0C0A] border border-[rgba(180,140,80,0.12)] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-[#B48C50] tracking-widest uppercase">
          Etapa {idx + 1}
        </span>
        <div className="flex gap-1">
          <button onClick={() => onMove(-1)} className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50] transition-colors" title="Mover acima">↑</button>
          <button onClick={() => onMove(1)} className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50] transition-colors" title="Mover abaixo">↓</button>
          <button onClick={onRemove} className={BTN_DANGER}>Remover</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Título da etapa</label>
          <input
            value={stage.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Ex: I · Antes do Jung"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Tipo (rótulo visual)</label>
          <select
            value={stage.kind || 'leitura'}
            onChange={(e) => update('kind', e.target.value)}
            className={INPUT}
          >
            {STAGE_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL}>Descrição</label>
        <textarea
          value={stage.detail}
          onChange={(e) => update('detail', e.target.value)}
          rows={2}
          placeholder="Por que esta etapa importa neste ponto da trilha..."
          className={INPUT + ' resize-y'}
        />
      </div>

      <div>
        <label className={LABEL}>Material/Link vinculado</label>
        <LinkPicker
          link={stage.link}
          onChange={(link) => update('link', link)}
          lists={lists}
        />
      </div>
    </div>
  );
}

function TrilhaEditor({ trilha, onChange, onCancel, onDelete, lists }) {
  const [draft, setDraft] = useState(trilha);

  useEffect(() => setDraft(trilha), [trilha.id]);

  const update = (k, v) => setDraft({ ...draft, [k]: v });
  const updateStage = (idx, newStage) => {
    const stages = [...draft.stages];
    stages[idx] = newStage;
    setDraft({ ...draft, stages });
  };
  const addStage = () => setDraft({ ...draft, stages: [...draft.stages, EMPTY_STAGE()] });
  const removeStage = (idx) => setDraft({ ...draft, stages: draft.stages.filter((_, i) => i !== idx) });
  const moveStage = (idx, delta) => {
    const newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= draft.stages.length) return;
    const stages = [...draft.stages];
    [stages[idx], stages[newIdx]] = [stages[newIdx], stages[idx]];
    setDraft({ ...draft, stages });
  };

  return (
    <div className={CARD + ' space-y-5'}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-serif text-[#E8DDD0]">
          {draft.id.startsWith('trilha-') && !trilha.name ? 'Nova trilha' : 'Editar trilha'}
        </h3>
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
            onChange={(e) => update('name', e.target.value)}
            placeholder="Ex: Começando em Jung"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Subtítulo</label>
          <input
            value={draft.subtitle}
            onChange={(e) => update('subtitle', e.target.value)}
            placeholder="Para quem está chegando agora..."
            className={INPUT}
          />
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
          <input
            value={draft.duration || ''}
            onChange={(e) => update('duration', e.target.value)}
            placeholder="4 a 6 semanas (vazio = oculto)"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Arquétipo / tom (opcional)</label>
          <select value={draft.archetype || ''} onChange={(e) => update('archetype', e.target.value)} className={INPUT}>
            <option value="">— sem tom —</option>
            {ARCHETYPES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Etapas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={LABEL + ' mb-0'}>Etapas ({draft.stages.length})</label>
          <button onClick={addStage} className={BTN_SECONDARY}>+ Adicionar etapa</button>
        </div>
        <div className="space-y-3">
          {draft.stages.map((stage, i) => (
            <StageEditor
              key={i}
              stage={migrateStageLink(stage)}
              idx={i}
              onChange={(s) => updateStage(i, s)}
              onRemove={() => removeStage(i)}
              onMove={(delta) => moveStage(i, delta)}
              lists={lists}
            />
          ))}
          {draft.stages.length === 0 && (
            <p className="text-xs text-[#6E6458] font-sans italic text-center py-6 border border-dashed border-[rgba(180,140,80,0.15)] rounded-lg">
              Nenhuma etapa ainda — clique em &ldquo;Adicionar etapa&rdquo;.
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

export default function TrilhasManager({ addToast, addLogEntry }) {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setList(getTrilhas());
  }, []);

  // Listas para o LinkPicker — carregadas no mount, com sync por evento
  const [lists, setLists] = useState({ materials: [], posts: [], courses: [], glossario: [] });
  useEffect(() => {
    const sync = () => {
      setLists({
        materials: getMaterials() || [],
        posts: readJsonSafe('angelo_admin_blog', []),
        courses: readJsonSafe('angelo_admin_courses', []),
        glossario: getGlossario() || [],
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
    const exists = list.some((t) => t.id === trilha.id);
    const newList = exists
      ? list.map((t) => (t.id === trilha.id ? trilha : t))
      : [...list, trilha];
    persist(newList);
    setEditing(null);
    addLogEntry?.(exists ? 'Trilha atualizada' : 'Trilha criada', trilha.name);
    addToast?.(exists ? 'Trilha atualizada' : 'Trilha criada', 'success');
  };

  const handleDelete = (id) => {
    if (!confirm('Apagar esta trilha?')) return;
    const trilha = list.find((t) => t.id === id);
    persist(list.filter((t) => t.id !== id));
    setEditing(null);
    addLogEntry?.('Trilha apagada', trilha?.name || id);
    addToast?.('Trilha apagada', 'success');
  };

  const handleMove = (id, delta) => {
    const idx = list.findIndex((t) => t.id === id);
    const newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= list.length) return;
    const newList = [...list];
    [newList[idx], newList[newIdx]] = [newList[newIdx], newList[idx]];
    persist(newList);
  };

  const editingTrilha = editing === 'new'
    ? EMPTY_TRILHA()
    : list.find((t) => t.id === editing);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Trilhas de estudo</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Sequências curadas que aparecem na home, em /trilhas e em /estudos
          </p>
        </div>
        {!editing && (
          <button onClick={() => setEditing('new')} className={BTN_PRIMARY}>
            + Nova trilha
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing && editingTrilha ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
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
              const tagParts = [t.level, t.archetype, t.duration].filter(Boolean);
              return (
                <div key={t.id} className={CARD + ' flex items-start justify-between gap-4'}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {tagParts.length > 0 && (
                        <span className="font-mono text-[10px] text-[#B48C50] tracking-widest uppercase">
                          {tagParts.join(' · ')}
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-[#6E6458] tracking-widest uppercase">
                        {t.stages?.length || 0} etapas
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-[#E8DDD0] leading-tight">{t.name}</h3>
                    <p className="text-xs text-[#B8AD9E] mt-1 italic">{t.subtitle}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleMove(t.id, -1)}
                        disabled={i === 0}
                        className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50] transition-colors disabled:opacity-30"
                      >↑</button>
                      <button
                        onClick={() => handleMove(t.id, 1)}
                        disabled={i === list.length - 1}
                        className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50] transition-colors disabled:opacity-30"
                      >↓</button>
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
