'use client';

/**
 * BlockRenderer — renderiza um único bloco de etapa conforme `type`.
 * Tipos: text, link, media, embed, cartography, quote.
 */

import Link from 'next/link';
import { marked } from 'marked';
import CartographyView from '@/components/cartography/CartographyView';
import { resolveLink } from '@/lib/linkResolver';

// Configura marked com defaults seguros
marked.setOptions({ gfm: true, breaks: false });

function ytEmbed(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.replace(/^\//, '').split('/')[0]}`;
    if (host.endsWith('youtube.com')) {
      if (u.pathname === '/watch') return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
      if (u.pathname.startsWith('/embed/')) return url;
      if (u.pathname.startsWith('/shorts/')) return `https://www.youtube.com/embed/${u.pathname.replace('/shorts/', '').split('/')[0]}`;
    }
  } catch {}
  return null;
}

function driveEmbed(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes('drive.google.com')) return null;
    const m = u.pathname.match(/\/file\/d\/([^/]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  } catch {}
  return null;
}

function renderText(body) {
  // Parse markdown completo via marked (GFM): bold, italic, links, listas, quotes, code, headers
  const html = marked.parse(String(body || ''));
  return (
    <div
      className="prose-glossario estudos-text-block"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function LinkBlock({ block, lists }) {
  const resolved = resolveLink(block.link, lists);
  if (!resolved.href) {
    return (
      <div className="my-6 border border-border-subtle p-4 bg-bg-card">
        <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-accent/70 mb-1">
          {resolved.kindLabel}
        </p>
        <p className="font-serif italic text-text-dim">{resolved.label || 'Sem link'}</p>
      </div>
    );
  }
  const inner = (
    <article className="group flex items-center justify-between gap-4 px-5 py-4 bg-bg-card border border-border-subtle hover:border-accent/40 transition-colors">
      <div className="min-w-0">
        <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-accent/80 mb-1">
          {resolved.kindLabel}
        </p>
        <p className="font-serif text-lg text-text-bright group-hover:text-accent transition-colors leading-tight">
          {resolved.label}
        </p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent flex-shrink-0">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </article>
  );
  return (
    <div className="my-6">
      {resolved.isExternal ? (
        <a href={resolved.href} target="_blank" rel="noopener noreferrer">{inner}</a>
      ) : (
        <Link href={resolved.href}>{inner}</Link>
      )}
    </div>
  );
}

function MediaBlock({ block }) {
  const src = block.provider === 'drive' ? driveEmbed(block.url) : ytEmbed(block.url);
  if (!src) {
    return (
      <div className="my-6 p-4 bg-bg-card border border-border-subtle">
        <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-amber-500 mb-1">
          Vídeo inválido
        </p>
        <p className="font-serif italic text-text-dim text-sm break-all">{block.url}</p>
      </div>
    );
  }
  return (
    <div className="my-8">
      <div className="aspect-video bg-bg-card border border-border-subtle overflow-hidden">
        <iframe
          src={src}
          title={block.caption || 'Vídeo'}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      {block.caption && (
        <p className="font-serif italic text-text-dim text-sm mt-2">{block.caption}</p>
      )}
    </div>
  );
}

function EmbedBlock({ block }) {
  return (
    <div className="my-8">
      <div
        className="bg-bg-card border border-border-subtle p-4"
        dangerouslySetInnerHTML={{ __html: block.html || '' }}
      />
      {block.caption && (
        <p className="font-serif italic text-text-dim text-sm mt-2">{block.caption}</p>
      )}
    </div>
  );
}

function CartographyBlock({ block }) {
  return (
    <div className="my-8">
      <CartographyView slug={block.slug || 'home'} compact />
      {block.caption && (
        <p className="font-serif italic text-text-dim text-sm mt-2 text-center">{block.caption}</p>
      )}
    </div>
  );
}

function QuoteBlock({ block }) {
  return (
    <blockquote className="my-8 pl-6 border-l-2 border-accent">
      <p className="font-serif italic text-[1.15rem] text-text-bright leading-[1.7] mb-2">
        “{block.body}”
      </p>
      {block.cite && (
        <cite className="font-mono text-[0.6rem] not-italic text-accent tracking-[0.22em] uppercase">
          — {block.cite}
        </cite>
      )}
    </blockquote>
  );
}

export default function BlockRenderer({ block, lists }) {
  if (!block || !block.type) return null;
  switch (block.type) {
    case 'text':        return renderText(block.body);
    case 'link':        return <LinkBlock block={block} lists={lists} />;
    case 'media':       return <MediaBlock block={block} />;
    case 'embed':       return <EmbedBlock block={block} />;
    case 'cartography': return <CartographyBlock block={block} />;
    case 'quote':       return <QuoteBlock block={block} />;
    default:            return null;
  }
}
