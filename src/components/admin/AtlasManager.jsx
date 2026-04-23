'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  atlasSections,
  atlasStats,
  getSectionTree,
} from '@/lib/atlas';
import {
  getAtlasOverrides,
  setAtlasOverrides,
  DEFAULT_ATLAS_OVERRIDES,
} from '@/lib/sitedata';

const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-4 sm:p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';

function Switch({ on, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`${on ? 'Ocultar' : 'Publicar'} ${label}`}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!on);
      }}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B48C50] ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${on ? 'bg-[#B48C50]' : 'bg-[rgba(180,140,80,0.15)]'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-[#0E0C0A] transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function FolderRow({ folder, path, depth, hiddenNoteSet, hiddenFolderSet, onToggleFolder, onToggleNote, inherited }) {
  const [open, setOpen] = useState(depth === 0);
  const folderHidden = hiddenFolderSet.has(path);
  const effectivelyHidden = inherited || folderHidden;
  const published = !effectivelyHidden;

  // count visible/total recursivo
  const counts = useMemo(() => {
    let total = 0;
    let visible = 0;
    const walk = (node, parentHidden) => {
      for (const n of node.notes) {
        total++;
        const noteHidden = parentHidden || hiddenNoteSet.has(`${n.section}/${n.slug}`);
        if (!noteHidden) visible++;
      }
      for (const f of node.children) {
        const fPath = f._path; // preenchido antes
        const fh = parentHidden || hiddenFolderSet.has(fPath);
        walk(f, fh);
      }
    };
    // preenche _path recursivamente
    const addPaths = (node, parent) => {
      for (const f of node.children) {
        f._path = (parent ? parent + '/' : '') + f.raw;
        addPaths(f, f._path);
      }
    };
    addPaths(folder, path);
    walk(folder, effectivelyHidden);
    return { total, visible };
  }, [folder, path, hiddenNoteSet, hiddenFolderSet, effectivelyHidden]);

  const pad = depth === 0 ? '' : `pl-${Math.min(depth * 3, 9)}`;

  return (
    <li className={`${depth === 0 ? 'mt-2' : ''}`}>
      <div
        className={`flex items-center gap-2 py-1.5 pr-2 hover:bg-[rgba(180,140,80,0.04)] rounded ${pad}`}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-[#B48C50]/70 hover:text-[#B48C50] transition-transform"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          aria-label={open ? 'Recolher' : 'Expandir'}
        >
          ▸
        </button>
        <span
          className={`font-serif flex-1 min-w-0 truncate ${
            depth === 0 ? 'text-[0.95rem] text-[#E8DDD0]' : 'text-[0.88rem] text-[#B8AD9E]'
          } ${effectivelyHidden ? 'opacity-40 line-through' : ''}`}
        >
          {folder.label}
        </span>
        <span className="font-mono text-[0.55rem] text-[#6E6458] tracking-[0.18em] whitespace-nowrap">
          {counts.visible}/{counts.total}
        </span>
        <Switch
          on={published}
          onChange={() => onToggleFolder(path)}
          label={folder.label}
          disabled={inherited}
        />
      </div>

      {open && (
        <div className="ml-4 border-l border-[rgba(180,140,80,0.08)]">
          {folder.notes.length > 0 && (
            <ul>
              {folder.notes.map((n) => (
                <NoteRow
                  key={`${n.section}/${n.slug}`}
                  note={n}
                  inherited={effectivelyHidden}
                  hiddenNoteSet={hiddenNoteSet}
                  onToggleNote={onToggleNote}
                />
              ))}
            </ul>
          )}
          {folder.children.length > 0 && (
            <ul>
              {folder.children.map((sub) => (
                <FolderRow
                  key={sub.raw}
                  folder={sub}
                  path={path + '/' + sub.raw}
                  depth={depth + 1}
                  hiddenNoteSet={hiddenNoteSet}
                  hiddenFolderSet={hiddenFolderSet}
                  onToggleFolder={onToggleFolder}
                  onToggleNote={onToggleNote}
                  inherited={effectivelyHidden}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}

function NoteRow({ note, inherited, hiddenNoteSet, onToggleNote }) {
  const id = `${note.section}/${note.slug}`;
  const noteHidden = hiddenNoteSet.has(id);
  const effectivelyHidden = inherited || noteHidden;
  const published = !effectivelyHidden;

  return (
    <li>
      <div className="flex items-center gap-2 py-1 px-2 hover:bg-[rgba(180,140,80,0.04)] rounded">
        <span className="w-4 flex-shrink-0 text-[#B48C50]/40 text-[0.6rem] text-center">·</span>
        <span
          className={`font-serif flex-1 min-w-0 truncate text-[0.85rem] ${
            effectivelyHidden ? 'opacity-40 line-through text-[#6E6458]' : 'text-[#B8AD9E]'
          }`}
          title={note.title}
        >
          {note.title}
        </span>
        {note.tier === 'B' && (
          <span className="font-mono text-[0.48rem] text-[#B48C50]/60 tracking-[0.2em] uppercase">
            curso
          </span>
        )}
        <span className="font-mono text-[0.5rem] text-[#6E6458] tracking-[0.18em] whitespace-nowrap">
          {note.readingMinutes}m
        </span>
        <Switch
          on={published}
          onChange={() => onToggleNote(id)}
          label={note.title}
          disabled={inherited}
        />
      </div>
    </li>
  );
}

export default function AtlasManager({ addToast, addLogEntry }) {
  const [data, setData] = useState(DEFAULT_ATLAS_OVERRIDES);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setData(getAtlasOverrides());
  }, []);

  const hiddenNoteSet = useMemo(() => new Set(data.hiddenNotes || []), [data.hiddenNotes]);
  const hiddenFolderSet = useMemo(() => new Set(data.hiddenFolders || []), [data.hiddenFolders]);

  const toggleNote = (id) => {
    setData((prev) => {
      const next = new Set(prev.hiddenNotes || []);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, hiddenNotes: [...next] };
    });
    setDirty(true);
  };

  const toggleFolder = (path) => {
    setData((prev) => {
      const next = new Set(prev.hiddenFolders || []);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return { ...prev, hiddenFolders: [...next] };
    });
    setDirty(true);
  };

  const persist = () => {
    setAtlasOverrides(data);
    setDirty(false);
    const total = (data.hiddenNotes?.length || 0) + (data.hiddenFolders?.length || 0);
    addLogEntry?.('Atlas · curadoria salva', total ? `${total} ocultos` : 'tudo publicado');
    addToast?.('Curadoria salva', 'success');
  };

  const resetAll = () => {
    if (!confirm('Publicar tudo? Remove todos os filtros de ocultação.')) return;
    setData(DEFAULT_ATLAS_OVERRIDES);
    setDirty(true);
  };

  const totalHidden = (data.hiddenNotes?.length || 0) + (data.hiddenFolders?.length || 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Atlas · Curadoria</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Oculta notas e pastas do site público sem mexer no vault Obsidian.{' '}
            {totalHidden > 0 ? (
              <span className="text-[#B48C50]">
                {totalHidden} {totalHidden === 1 ? 'item oculto' : 'itens ocultos'}
              </span>
            ) : (
              <span>Tudo publicado.</span>
            )}
            {' · '}
            <span className="text-[#6E6458]/80">
              {atlasStats.published} notas no vault
            </span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={resetAll} className={BTN_SECONDARY}>
            Publicar tudo
          </button>
          <button
            onClick={persist}
            disabled={!dirty}
            className={BTN_PRIMARY + (dirty ? '' : ' opacity-40 cursor-not-allowed')}
          >
            Salvar
          </button>
        </div>
      </div>

      {dirty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-16 sm:bottom-4 z-40 bg-[#B48C50] text-[#0E0C0A] rounded-lg shadow-lg shadow-black/40 flex items-center justify-between gap-3 px-4 py-3"
        >
          <span className="text-xs sm:text-sm font-sans font-semibold">
            Você tem mudanças não salvas
          </span>
          <button
            onClick={persist}
            className="px-4 py-1.5 bg-[#0E0C0A] text-[#B48C50] text-xs font-sans font-semibold rounded tracking-wider uppercase"
          >
            Salvar agora
          </button>
        </motion.div>
      )}

      <div className="space-y-3">
        {atlasSections.map((s) => {
          const tree = getSectionTree(s.slug);
          const sectionHidden = hiddenFolderSet.has(s.slug);
          return (
            <div key={s.slug} className={CARD}>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <Switch
                    on={!sectionHidden}
                    onChange={() => toggleFolder(s.slug)}
                    label={s.label}
                  />
                  <div>
                    <h3
                      className={`font-serif text-base text-[#E8DDD0] ${
                        sectionHidden ? 'opacity-40 line-through' : ''
                      }`}
                    >
                      {s.label}
                    </h3>
                    <p className="text-[11px] text-[#6E6458] mt-0.5">{s.kicker}</p>
                  </div>
                </div>
                <span className="font-mono text-[0.55rem] text-[#6E6458] tracking-[0.18em] uppercase">
                  {s.count} notas
                </span>
              </div>

              {!sectionHidden && (
                <div className="border-t border-[rgba(180,140,80,0.06)] pt-2">
                  {tree.notes.length > 0 && (
                    <ul className="mb-1">
                      {tree.notes.map((n) => (
                        <NoteRow
                          key={`${n.section}/${n.slug}`}
                          note={n}
                          inherited={false}
                          hiddenNoteSet={hiddenNoteSet}
                          onToggleNote={toggleNote}
                        />
                      ))}
                    </ul>
                  )}
                  {tree.children.length > 0 && (
                    <ul>
                      {tree.children.map((f) => (
                        <FolderRow
                          key={f.raw}
                          folder={f}
                          path={s.slug + '/' + f.raw}
                          depth={0}
                          hiddenNoteSet={hiddenNoteSet}
                          hiddenFolderSet={hiddenFolderSet}
                          onToggleFolder={toggleFolder}
                          onToggleNote={toggleNote}
                          inherited={false}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
