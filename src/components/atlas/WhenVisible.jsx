'use client';

import { useVisibility } from '@/lib/useVisibility';

/**
 * WhenVisible — renderiza children só se a chave de visibility for true.
 * Enquanto `ready` é false mostra children (evita flash de sumiço).
 */
export default function WhenVisible({ k, children, fallback = null }) {
  const { visibility, ready } = useVisibility();
  if (!ready) return children;
  return visibility[k] ? children : fallback;
}
