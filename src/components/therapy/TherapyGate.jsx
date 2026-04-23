'use client';

import HiddenPlaceholder from '@/components/HiddenPlaceholder';
import { useVisibility } from '@/lib/useVisibility';

export default function TherapyGate({ children }) {
  const { visibility, ready } = useVisibility();
  if (ready && visibility.psicoterapia === false) {
    return <HiddenPlaceholder title="Em breve" />;
  }
  return children;
}
