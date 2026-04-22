'use client';

import { useEffect, useState } from 'react';

/**
 * useSitedata — hook genérico que reagir a mudanças no localStorage.
 *
 * - Valor inicial: `initial` (evita flash em SSR)
 * - Após mount: chama `reader()` e reassiste
 * - Re-lê quando:
 *     • 'storage' event (admin editou em outra aba)
 *     • 'sitedata:changed' custom event (admin editou na mesma aba)
 *     • 'sitedata:bootstrap' custom event (ContentBootstrap populou localStorage)
 *
 * @param reader   () => T — função que lê do localStorage (ex: getHomepage)
 * @param initial  T — valor default pra SSR/hidratação
 * @param watchKey string | null — se definido, só reage quando essa chave mudar
 */
export function useSitedata(reader, initial, watchKey = null) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    setValue(reader());

    const resync = () => setValue(reader());

    const onStorage = (e) => {
      if (watchKey && e.key && e.key !== watchKey) return;
      resync();
    };
    const onChanged = (e) => {
      if (watchKey && e.detail?.key && e.detail.key !== watchKey) return;
      resync();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('sitedata:changed', onChanged);
    window.addEventListener('sitedata:bootstrap', resync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('sitedata:changed', onChanged);
      window.removeEventListener('sitedata:bootstrap', resync);
    };
    // reader é estável em prática (funções top-level exportadas); watchKey raramente muda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchKey]);

  return value;
}
