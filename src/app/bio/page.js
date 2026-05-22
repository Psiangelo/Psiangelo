'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBio, DEFAULT_BIO } from '@/lib/sitedata';
import { img } from '@/lib/basepath';
import HiddenPlaceholder from '@/components/HiddenPlaceholder';
import { useVisibility } from '@/lib/useVisibility';
import { BioCardIcon, hasBioIcon, inferBioIcon } from '@/components/bio/BioCardIcons';
import './bio-cards.css';

/**
 * /bio — Linktree mobile-first, clone fiel do /bio da Tulipa
 * em paleta Psiangelo (dourado · sépia · creme · rubedo · ink).
 *
 * Estrutura idêntica: mesh + petals ambient + ornamentos laterais +
 * head (avatar conic, name, tagline com traços, bio) + wave divider +
 * cards blob (simple OU rich com mídia 140px) + footer.
 */

const ACCENT_CYCLE = ['gold', 'cream', 'sepia', 'rubedo', 'ink'];
const ACCENT_VALID = new Set(ACCENT_CYCLE);

function accentFor(link, idx) {
  if (link.accent && ACCENT_VALID.has(link.accent)) return link.accent;
  return ACCENT_CYCLE[idx % ACCENT_CYCLE.length];
}

function isExternal(href) {
  if (!href) return false;
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

function resolveImageSrc(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/Psiangelo')) return url;
  if (url.startsWith('/')) return img(url);
  return url;
}

function initials(name) {
  if (!name) return 'P';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

const ARROW_SVG = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12 L19 12 M13 6 L19 12 L13 18" />
  </svg>
);

function LinkCard({ link, accent, isAlt }) {
  const { label, href, image, description, id } = link;
  const external = isExternal(href);
  const Tag = external ? 'a' : Link;
  const extraProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const imageSrc = resolveImageSrc(image);
  // ícone explícito > inferido (sempre tem um, mesmo sem `icon` salvo)
  const resolvedIcon = link.icon && hasBioIcon(link.icon) ? link.icon : inferBioIcon(link);
  const showIcon = !imageSrc && !!resolvedIcon;
  const isRich = !!imageSrc || showIcon;

  if (!isRich) {
    return (
      <Tag
        href={href || '#'}
        {...extraProps}
        className="bio-card bio-card--simple"
        data-accent={accent}
        data-link-id={id || ''}
      >
        <h3 className="bio-card__title">{label}</h3>
        {description && <p className="bio-card__desc">{description}</p>}
        <span className="bio-card__cta">
          <span>visitar</span>
          {ARROW_SVG}
        </span>
      </Tag>
    );
  }

  return (
    <Tag
      href={href || '#'}
      {...extraProps}
      className={`bio-card bio-card--rich ${isAlt ? 'bio-card--alt' : ''}`}
      data-accent={accent}
      data-link-id={id || ''}
    >
      <div className="bio-card__media">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={label || ''} loading="lazy" decoding="async" />
        ) : (
          <BioCardIcon name={resolvedIcon} />
        )}
      </div>
      <div className="bio-card__body">
        <h3 className="bio-card__title">{label}</h3>
        {description && <p className="bio-card__desc">{description}</p>}
        <span className="bio-card__cta">
          <span>saiba mais</span>
          {ARROW_SVG}
        </span>
      </div>
    </Tag>
  );
}

/* Ornamento hermético — mandala dupla + linha vertical (substitui a flora botânica
   da Tulipa). Renderizado nas laterais com sway sutil. */
function HermeticOrnament({ side = 'left' }) {
  return (
    <svg
      className={`bio-ornament bio-ornament--${side}`}
      viewBox="0 0 200 700"
      aria-hidden="true"
      preserveAspectRatio={side === 'left' ? 'xMinYMin meet' : 'xMaxYMax meet'}
    >
      <defs>
        <linearGradient id={`ornStem-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4A853" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#6E5530" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id={`ornGlow-${side}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A853" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#D4A853" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="bio-ornament__group">
        {/* linha vertical mestra */}
        <line
          x1={side === 'left' ? 70 : 130}
          y1="20"
          x2={side === 'left' ? 70 : 130}
          y2="680"
          stroke={`url(#ornStem-${side})`}
          strokeWidth="0.8"
        />
        {/* halo mandala superior */}
        <g transform={`translate(${side === 'left' ? 70 : 130} 140)`}>
          <circle r="58" fill={`url(#ornGlow-${side})`} />
          <g fill="none" stroke="#B48C50" strokeWidth="0.4" opacity="0.75">
            <circle r="52" strokeWidth="0.25" />
            <circle r="40" strokeWidth="0.35" />
            <circle r="28" />
            <circle r="14" strokeWidth="0.5" />
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i * 22.5 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * 28}
                  y1={Math.sin(a) * 28}
                  x2={Math.cos(a) * 52}
                  y2={Math.sin(a) * 52}
                  strokeWidth={i % 4 === 0 ? 0.55 : 0.22}
                />
              );
            })}
          </g>
          <circle r="2.5" fill="#D4A853" />
        </g>
        {/* mandala média no meio */}
        <g transform={`translate(${side === 'left' ? 70 : 130} 380)`}>
          <circle r="42" fill={`url(#ornGlow-${side})`} opacity="0.7" />
          <g fill="none" stroke="#B48C50" strokeWidth="0.4" opacity="0.65">
            <circle r="36" strokeWidth="0.25" />
            <circle r="24" />
            <circle r="12" strokeWidth="0.45" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * 12}
                  y1={Math.sin(a) * 12}
                  x2={Math.cos(a) * 36}
                  y2={Math.sin(a) * 36}
                  strokeWidth={i % 3 === 0 ? 0.5 : 0.18}
                />
              );
            })}
          </g>
          <circle r="2" fill="#B48C50" />
        </g>
        {/* mandala inferior pequena */}
        <g transform={`translate(${side === 'left' ? 70 : 130} 600)`}>
          <g fill="none" stroke="#B48C50" strokeWidth="0.35" opacity="0.6">
            <circle r="22" strokeWidth="0.22" />
            <circle r="12" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * 45 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * 6}
                  y1={Math.sin(a) * 6}
                  x2={Math.cos(a) * 22}
                  y2={Math.sin(a) * 22}
                />
              );
            })}
          </g>
          <circle r="1.6" fill="#D4A853" />
        </g>
      </g>
    </svg>
  );
}

function WaveDivider() {
  return (
    <svg
      className="bio-wave"
      viewBox="0 0 540 56"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bioWaveMain" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#B48C50" stopOpacity="0" />
          <stop offset="20%"  stopColor="#B48C50" stopOpacity="0.85" />
          <stop offset="50%"  stopColor="#D4A853" stopOpacity="1" />
          <stop offset="80%"  stopColor="#B48C50" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#B48C50" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bioWaveSoft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#E8DDD0" stopOpacity="0" />
          <stop offset="50%"  stopColor="#E8DDD0" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#E8DDD0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bioWaveBronze" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#7A5E3A" stopOpacity="0" />
          <stop offset="50%"  stopColor="#7A5E3A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7A5E3A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* eco bronze por baixo, mais largo */}
      <path d="M-20 18 Q 80 -2, 180 18 T 380 18 T 580 18" fill="none" stroke="url(#bioWaveBronze)" strokeWidth="2.5" />
      {/* onda dourada principal */}
      <path d="M-20 28 Q 80 8, 180 28 T 380 28 T 580 28" fill="none" stroke="url(#bioWaveMain)" strokeWidth="2.4" />
      {/* eco creme sob */}
      <path className="bio-wave__slow" d="M-20 38 Q 100 58, 220 38 T 440 38 T 620 38" fill="none" stroke="url(#bioWaveSoft)" strokeWidth="1.3" />
      {/* nós + sombras */}
      <circle cx="270" cy="28" r="3.2" fill="#D4A853" opacity="1" />
      <circle cx="270" cy="28" r="6" fill="#D4A853" opacity="0.25" />
      <circle cx="135" cy="28" r="2" fill="#B48C50" opacity="0.9" />
      <circle cx="405" cy="28" r="2" fill="#B48C50" opacity="0.9" />
      <circle cx="80"  cy="28" r="1.2" fill="#9A7A48" opacity="0.7" />
      <circle cx="460" cy="28" r="1.2" fill="#9A7A48" opacity="0.7" />
    </svg>
  );
}

export default function BioPage() {
  const { visibility, ready } = useVisibility();
  const [bio, setBioState] = useState(DEFAULT_BIO);

  useEffect(() => {
    const reload = () => setBioState(getBio());
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener('sitedata:changed', reload);
    window.addEventListener('sitedata:bootstrap', reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener('sitedata:changed', reload);
      window.removeEventListener('sitedata:bootstrap', reload);
    };
  }, []);

  if (ready && !visibility.bio) {
    return <HiddenPlaceholder title="Bio indisponível" />;
  }

  const visibleLinks = (bio.links || []).filter((l) => !l.hidden);
  const avatarSrc = resolveImageSrc(bio.avatar);

  let richIndex = 0;

  return (
    <main className="bio-page">
      {/* Mesh gradient vivo no fundo */}
      <div className="bio-mesh" aria-hidden="true" />

      {/* 5 pétalas blur ambiente */}
      <div className="bio-ambient" aria-hidden="true">
        <span className="bio-petal bio-petal--a" />
        <span className="bio-petal bio-petal--b" />
        <span className="bio-petal bio-petal--c" />
        <span className="bio-petal bio-petal--d" />
        <span className="bio-petal bio-petal--e" />
      </div>

      {/* Ornamentos herméticos laterais (substituem flora da Tulipa) */}
      <HermeticOrnament side="left" />
      <HermeticOrnament side="right" />

      <div className="bio">
        {/* HEAD — identidade */}
        <header className="bio__head">
          <div className="bio__avatar">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt={bio.name || 'Psiangelo'}
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <span className="bio__avatar--fallback">{initials(bio.name)}</span>
            )}
          </div>
          <h1 className="bio__name">{bio.name}</h1>
          {bio.tagline && <p className="bio__tagline">{bio.tagline}</p>}
          {bio.bio && <p className="bio__bio">{bio.bio}</p>}
        </header>

        {/* Wave divider */}
        <WaveDivider />

        {/* CARDS — blob shape com accent cycling */}
        <div className="bio__cards">
          {visibleLinks.map((link, i) => {
            const accent = accentFor(link, i);
            const imageSrc = resolveImageSrc(link.image);
            const resolvedIcon = link.icon && hasBioIcon(link.icon) ? link.icon : inferBioIcon(link);
            const isRich = !!imageSrc || !!resolvedIcon;
            const isAlt = isRich && richIndex++ % 2 === 1;
            return (
              <LinkCard
                key={i}
                link={link}
                accent={accent}
                isAlt={isAlt}
              />
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="bio__foot">
        <Link href="/" className="bio__back">↩ site completo</Link>
        <span className="bio__credit">psiangelo</span>
      </footer>
    </main>
  );
}
