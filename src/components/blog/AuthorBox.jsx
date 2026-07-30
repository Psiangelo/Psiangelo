'use client';

import Link from 'next/link';
import {
  getBio,
  DEFAULT_BIO,
  getBlogAuthorCta,
  DEFAULT_BLOG_AUTHOR_CTA,
  SITEDATA_KEYS,
} from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';
import { resolveImageSrc } from '@/lib/basepath';
import { clinicPhoto } from '@/lib/clinicPhoto';

/**
 * AuthorBox — foto pequena + bio curta + CTA pra terapia, no fim de cada post.
 * Nome/foto/bio vêm de `getBio().author` — a mesma identidade de autor usada
 * por AuthorBand e pelo JSON-LD (editável em Admin → Bio / Linktree, card
 * "Identidade de autor"). Antes lia os campos de topo do Bio (`name`/`avatar`/
 * `bio`), que são a marca do Linktree ("Psiangelo"), não a pessoa que escreve
 * ("Ângelo") — por isso o texto batia diferente do resto do site.
 * Só o CTA é próprio do blog (editável em Blog → Autor no admin).
 * Visibilidade controlada pela chave `blogAuthorBox` (Admin → Visibilidade).
 */
export default function AuthorBox() {
  const bio = useSitedata(getBio, DEFAULT_BIO, SITEDATA_KEYS.bio);
  const cta = useSitedata(getBlogAuthorCta, DEFAULT_BLOG_AUTHOR_CTA, SITEDATA_KEYS.blogAuthorCta);
  const author = bio?.author || DEFAULT_BIO.author;
  const avatarSrc = author?.photo?.src
    ? resolveImageSrc(clinicPhoto(author.photo.src, 'avatar').src)
    : null;

  return (
    <div
      className="mt-12 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6"
      data-reading-hide="true"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={author?.photo?.alt || author?.name}
            className="w-14 h-14 rounded-full object-cover border border-border-subtle shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-bg-card border border-border-subtle shrink-0" />
        )}
        <div className="min-w-0">
          <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-accent/70 mb-1">
            Sobre quem escreve
          </p>
          <p className="font-serif text-text-bright text-[1.05rem] leading-snug">
            {author?.name}
            {author?.credential && (
              <span className="block font-sans text-[0.62rem] font-medium tracking-[0.16em] uppercase text-text-dim mt-0.5">
                {author.credential}
              </span>
            )}
          </p>
          <p className="text-[0.85rem] text-text-dim leading-snug mt-1">{author?.bio}</p>
        </div>
      </div>

      <Link
        href={cta.href}
        className="shrink-0 w-full sm:w-auto text-center px-5 py-2.5 border border-accent/40 text-accent hover:bg-accent hover:text-bg transition-colors font-sans text-sm font-medium whitespace-nowrap"
      >
        {cta.label}
      </Link>
    </div>
  );
}
