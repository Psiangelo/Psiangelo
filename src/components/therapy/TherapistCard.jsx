'use client';

import { getTherapy, DEFAULT_THERAPY, SITEDATA_KEYS } from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';
import { resolveImageSrc } from '@/lib/basepath';

/**
 * TherapistCard — foto + bio curta ao lado do hero de /psicoterapia-analitica.
 * Fonte própria (DEFAULT_THERAPY.hero.photo), independente da Bio/Linktree —
 * a foto e o tom aqui são deliberadamente mais clínicos que os do resto do site.
 * Editável em Admin → Terapia → Hero. Some se `show` estiver desligado ou sem foto.
 */
export default function TherapistCard() {
  const therapy = useSitedata(getTherapy, DEFAULT_THERAPY, SITEDATA_KEYS.therapy);
  const photo = therapy.hero?.photo;
  const src = resolveImageSrc(photo?.src);

  if (!photo?.show || !src) return null;

  return (
    <div className="relative max-w-[300px] mx-auto lg:mx-0 lg:ml-auto">
      <div className="relative aspect-[4/5] overflow-hidden border border-border-subtle bg-bg-card">
        <img
          src={src}
          alt={photo.alt || photo.name || 'Retrato do terapeuta'}
          className="absolute inset-0 w-full h-full object-cover"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent pointer-events-none" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 border-t border-r border-accent/30 pointer-events-none" />
      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b border-l border-accent/30 pointer-events-none" />

      <div className="mt-4 text-center lg:text-left">
        {photo.name && (
          <p className="font-serif text-text-bright text-[1.05rem] leading-snug">{photo.name}</p>
        )}
        {photo.credential && (
          <p className="font-mono text-[0.58rem] tracking-[0.18em] uppercase text-accent/70 mt-1">
            {photo.credential}
          </p>
        )}
        {photo.bio && (
          <p className="text-[0.82rem] text-text-dim leading-relaxed mt-2">{photo.bio}</p>
        )}
      </div>
    </div>
  );
}
