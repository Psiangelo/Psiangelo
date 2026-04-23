'use client';

import HiddenPlaceholder from '@/components/HiddenPlaceholder';
import { useAtlasOverrides } from '@/lib/useAtlasOverrides';

/**
 * NoteGate — esconde uma nota específica (ou pasta ancestral oculta) do visitante.
 * Usado em /atlas/[secao]/[slug].
 */
export default function NoteGate({ note, children }) {
  const { isNoteHidden, ready } = useAtlasOverrides();
  if (ready && isNoteHidden(note)) {
    return <HiddenPlaceholder title="Nota indisponível" />;
  }
  return children;
}
