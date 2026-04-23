'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAtlasOverrides, DEFAULT_ATLAS_OVERRIDES, SITEDATA_KEYS } from './sitedata';

/**
 * useAtlasOverrides — lê overrides do localStorage (hiddenNotes, hiddenFolders)
 * e devolve helpers pra checagem. Reativo a 'storage' e 'sitedata:changed'.
 *
 * Retorna: { overrides, ready, isNoteHidden(note), isFolderHidden(path) }
 *
 * Convenções de path:
 * - noteId   = `${section}/${slug}`
 * - folderPath = `${section}` (raiz) ou `${section}/${raw1}/${raw2}/...`
 */
export function useAtlasOverrides() {
  const [overrides, setOverrides] = useState(DEFAULT_ATLAS_OVERRIDES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOverrides(getAtlasOverrides());
    setReady(true);

    const resync = () => setOverrides(getAtlasOverrides());
    const onStorage = (e) => {
      if (e.key === SITEDATA_KEYS.atlasOverrides) resync();
    };
    const onChanged = (e) => {
      if (!e.detail?.key || e.detail.key === SITEDATA_KEYS.atlasOverrides) resync();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('sitedata:changed', onChanged);
    window.addEventListener('sitedata:bootstrap', resync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('sitedata:changed', onChanged);
      window.removeEventListener('sitedata:bootstrap', resync);
    };
  }, []);

  const hiddenNoteSet = useMemo(() => new Set(overrides.hiddenNotes || []), [overrides.hiddenNotes]);
  const hiddenFolderSet = useMemo(() => new Set(overrides.hiddenFolders || []), [overrides.hiddenFolders]);

  const isNoteHidden = (note) => {
    const id = `${note.section}/${note.slug}`;
    if (hiddenNoteSet.has(id)) return true;
    let p = note.section;
    if (hiddenFolderSet.has(p)) return true;
    for (const seg of note.subpath || []) {
      p = p + '/' + seg.raw;
      if (hiddenFolderSet.has(p)) return true;
    }
    return false;
  };

  const isFolderHidden = (path) => hiddenFolderSet.has(path);

  return { overrides, ready, isNoteHidden, isFolderHidden };
}
