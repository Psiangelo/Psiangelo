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

    const resync = () => setVisibility(getSiteVisibility());

    // storage event: admin editou em outra aba
    const onStorage = (e) => {
      if (e.key === SITEDATA_KEYS.visibility) resync();
    };
    // sitedata:changed: admin editou na mesma aba
    const onChanged = (e) => {
      if (!e.detail?.key || e.detail.key === SITEDATA_KEYS.visibility) resync();
    };
    // sitedata:bootstrap: ContentBootstrap populou localStorage
    window.addEventListener('storage', onStorage);
    window.addEventListener('sitedata:changed', onChanged);
    window.addEventListener('sitedata:bootstrap', resync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('sitedata:changed', onChanged);
      window.removeEventListener('sitedata:bootstrap', resync);
    };
  }, []);

  return { visibility, ready };
}
