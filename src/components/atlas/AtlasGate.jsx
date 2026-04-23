'use client';

import HiddenPlaceholder from '@/components/HiddenPlaceholder';
import { useVisibility } from '@/lib/useVisibility';

/**
 * AtlasGate — wrapper client que esconde o conteúdo do Atlas/Glossário
 * quando o admin ativa ocultar no VisibilityManager.
 *
 * Props: visibilityKey ('atlas' | 'glossario'), title.
 * Renderiza children quando visível OU enquanto `ready` for false (evita flash de placeholder).
 */
export default function AtlasGate({ visibilityKey, title, children }) {
  const { visibility, ready } = useVisibility();
  if (ready && !visibility[visibilityKey]) {
    return <HiddenPlaceholder title={title} />;
  }
  return children;
}
