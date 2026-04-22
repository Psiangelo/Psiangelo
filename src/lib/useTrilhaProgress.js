'use client';

import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'angelo_trilha_progress';

function readAll() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('trilha-progress:changed'));
  } catch {
    /* noop */
  }
}

/**
 * useTrilhaProgress — hook completo de progresso por trilha.
 * Retorna:
 *   progress: { [trilhaId]: { completedStages: string[], startedAt, updatedAt } }
 *   isStageDone(trilhaId, stageTitle)
 *   toggleStage(trilhaId, stageTitle)
 *   resetTrilha(trilhaId)
 *   percentOf(trilha) — trilha é objeto { id, stages }
 */
export function useTrilhaProgress() {
  const [progress, setProgress] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(readAll());
    setReady(true);

    const onChange = () => setProgress(readAll());
    window.addEventListener('trilha-progress:changed', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('trilha-progress:changed', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const isStageDone = useCallback(
    (trilhaId, stageTitle) => {
      const t = progress[trilhaId];
      return t?.completedStages?.includes(stageTitle) || false;
    },
    [progress]
  );

  const toggleStage = useCallback((trilhaId, stageTitle) => {
    const all = readAll();
    const now = new Date().toISOString();
    const entry = all[trilhaId] || { completedStages: [], startedAt: now, updatedAt: now };
    const done = entry.completedStages.includes(stageTitle);
    const updated = {
      ...entry,
      completedStages: done
        ? entry.completedStages.filter((s) => s !== stageTitle)
        : [...entry.completedStages, stageTitle],
      updatedAt: now,
      startedAt: entry.startedAt || now,
    };
    writeAll({ ...all, [trilhaId]: updated });
  }, []);

  const resetTrilha = useCallback((trilhaId) => {
    const all = readAll();
    delete all[trilhaId];
    writeAll(all);
  }, []);

  const percentOf = useCallback(
    (trilha) => {
      if (!trilha?.stages?.length) return 0;
      const t = progress[trilha.id];
      if (!t) return 0;
      return Math.round((t.completedStages.length / trilha.stages.length) * 100);
    },
    [progress]
  );

  return { progress, ready, isStageDone, toggleStage, resetTrilha, percentOf };
}
