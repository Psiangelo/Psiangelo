'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_VISIBILITY, getSiteVisibility, SITEDATA_KEYS } from '@/lib/sitedata';

/**
 * useVisibility — hook que retorna o mapa de visibilidade do site.
 *
 * Começa com DEFAULT_VISIBILITY (tudo visível) para evitar flash
 * de conteúdo escondido durante SSR/hidratação, depois lê o
 * localStorage no useEffect. `ready` indica se já leu.
 */
export function useVisibility() {
  const [visibility, setVisibility] = useState(DEFAULT_VISIBILITY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setVisibility(getSiteVisibility());
    setReady(true);

    // Sincroniza entre abas quando admin altera em outra aba
    const onStorage = (e) => {
      if (e.key === SITEDATA_KEYS.visibility) {
        setVisibility(getSiteVisibility());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { visibility, ready };
}
