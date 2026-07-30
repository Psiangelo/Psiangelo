'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import {
  BranchOrnament,
  SpiralAccent,
  HexRing,
  TriangleCompass,
  GoldenArc,
} from '@/components/illustrations';
import HiddenPlaceholder from '@/components/HiddenPlaceholder';
import { useVisibility } from '@/lib/useVisibility';
import { getBlogPosts, getBlogSeries, SITEDATA_KEYS } from '@/lib/sitedata';
import AuthorBand from '@/components/AuthorBand';
import PosterCover from '@/components/ui/PosterCover';
import { renderHighlightedTitle, stripHighlights } from '@/lib/highlightTitle';
import { BASE_PATH } from '@/lib/basepath';

const STORAGE_KEY = SITEDATA_KEYS.blog;
const SERIES_STORAGE_KEY = SITEDATA_KEYS.blogSeries;

/**
 * Nota de arquitetura (2026-07-30): a apresentação de um post individual
 * (header, corpo, TOC, série, prev/next, relacionados) foi extraída pra
 * src/components/blog/BlogPostView.jsx e agora vive só na rota estática
 * /blog/[slug]/ — cada post tem URL própria e é renderizado no HTML, o
 * que era o ponto cego de SEO deste blog. Este arquivo (o hub /blog) ficou
 * só com a listagem; cards linkam para /blog/<slug>/ (URL real).
 */

/* ====== Helpers ====== */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

function calculateReadingTime(html) {
  if (!html) return 0;
  const words = (html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ====== Card pequeno (para grid assimétrico) ====== */
function BlogCard({ post, variant = 'default' }) {
  const readTime = calculateReadingTime(post.content_html);
  const isLarge = variant === 'large';
  const isText  = variant === 'text';
  const href = `/blog/${post.slug || post.id}/`;

  if (isText) {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="h-full"
      >
        <Link
          href={href}
          className="group block p-6 border-l border-border-subtle hover:border-accent/40 transition-colors h-full flex flex-col"
        >
          <div className="flex items-center gap-3 mb-3">
            <time className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-text-dim">
              {formatDate(post.updated_at)}
            </time>
            <span className="font-mono text-[0.55rem] text-text-dim/70">{readTime} min</span>
          </div>
          <h3 className="font-serif text-xl text-text-bright leading-tight mb-3 group-hover:text-accent transition-colors">
            {renderHighlightedTitle(post.title)}
          </h3>
          <p className="text-[0.85rem] text-text-dim leading-[1.7] line-clamp-4 mb-4 flex-1">
            {post.excerpt}
          </p>
          {post.tags && post.tags[0] && (
            <span className="self-start font-mono text-[0.55rem] tracking-[0.2em] uppercase text-accent">
              {post.tags[0]}
            </span>
          )}
        </Link>
      </motion.article>
    );
  }

  const seed = post.slug || post.id || post.title || '';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative flex flex-col h-full ${isLarge ? 'min-h-[420px]' : ''}`}
    >
      <Link href={href} className="group relative flex flex-col h-full transition-all">
        {/* Moldura lateral dourada — assinatura editorial */}
        <span
          aria-hidden
          className="absolute left-0 top-3 bottom-3 w-[2px] bg-accent/20 group-hover:bg-accent/60 transition-colors"
        />

        <div className="pl-4">
          {(post.featured_cover || post.featured_image) ? (
            <div className={post.featured_cover ? 'sm:max-w-[280px] mx-auto' : ''}>
              <PosterCover
                src={post.featured_cover || post.featured_image}
                alt={post.featured_cover_alt || post.featured_image_alt || stripHighlights(post.title)}
                aspect={post.featured_cover ? '9/16' : (isLarge ? '16/10' : '16/9')}
                seed={seed}
                intensity={2}
                titleOverlay
                eyebrow={post.tags?.[0]}
                title={renderHighlightedTitle(post.title, { accentClassName: 'text-accent not-italic' })}
                footer={
                  <>
                    <time>{formatDate(post.updated_at)}</time>
                    <span className="text-text-dim/70">·</span>
                    <span>{readTime} min</span>
                  </>
                }
              />
            </div>
          ) : (
            // Sem imagem: card somente-texto com a mesma linguagem visual
            <div className="bg-bg-card border border-border-subtle group-hover:border-accent/40 rounded-lg p-6 transition-colors">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <time className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-text-dim">
                  {formatDate(post.updated_at)}
                </time>
                <span className="font-mono text-[0.55rem] text-text-dim/70">{readTime} min</span>
                {post.tags && post.tags[0] && (
                  <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-accent">
                    {post.tags[0]}
                  </span>
                )}
              </div>
              <h3 className={`font-serif text-text-bright leading-tight mb-3 group-hover:text-accent transition-colors line-clamp-2 ${
                isLarge ? 'text-2xl md:text-3xl' : 'text-lg'
              }`}>
                {renderHighlightedTitle(post.title)}
              </h3>
              <p className={`text-text-dim leading-relaxed ${
                isLarge ? 'text-[0.95rem] line-clamp-4' : 'text-[0.82rem] line-clamp-3'
              }`}>
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Com imagem: excerpt + linha dourada fica embaixo */}
          {(post.featured_cover || post.featured_image) && (
            <div className="mt-4 flex items-start gap-3">
              <span className="block w-8 h-px bg-accent/40 mt-[10px] flex-shrink-0 group-hover:bg-accent/80 transition-colors" />
              <p className={`text-text-dim leading-relaxed flex-1 ${
                isLarge ? 'text-[0.95rem] line-clamp-3' : 'text-[0.82rem] line-clamp-2'
              }`}>
                {post.excerpt}
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

/* ====== Featured Cover (post pinned, fullbleed 70vh) ====== */
function FeaturedCover({ post }) {
  const readTime = calculateReadingTime(post.content_html);
  const href = `/blog/${post.slug || post.id}/`;
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="relative h-[60vh] md:h-[70vh] min-h-[480px] overflow-hidden"
    >
      <Link href={href} className="group block absolute inset-0">
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.featured_image_alt || post.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-bg-warm via-bg-card to-bg" />
        )}

        {/* Filtro de identidade — tint dourado em multiply pra harmonizar a imagem */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-multiply"
          style={{
            background:
              'linear-gradient(135deg, rgba(180,140,80,0.22) 0%, rgba(180,140,80,0) 55%, rgba(14,12,10,0.30) 100%)',
          }}
        />
        {/* Gradient escuro que cobre e garante legibilidade do título */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/20" />
        {/* Vignette radial — derrete as bordas no fundo */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(14,12,10,0) 50%, rgba(14,12,10,0.55) 100%)',
          }}
        />

        {/* Mandala translúcida no canto */}
        <motion.svg
          className="absolute -right-32 -bottom-32 pointer-events-none"
          width="500"
          height="500"
          viewBox="0 0 500 500"
          style={{ opacity: 0.08 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
        >
          <g fill="none" stroke="#B48C50" strokeWidth="0.5">
            <circle cx="250" cy="250" r="240" />
            <circle cx="250" cy="250" r="180" />
            <circle cx="250" cy="250" r="120" />
            <circle cx="250" cy="250" r="60" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={250 + Math.cos(a) * 60}
                  y1={250 + Math.sin(a) * 60}
                  x2={250 + Math.cos(a) * 240}
                  y2={250 + Math.sin(a) * 240}
                />
              );
            })}
          </g>
        </motion.svg>

        <div className="absolute inset-x-0 bottom-0 px-5 sm:px-6 md:px-12 pb-12 md:pb-16">
          <div className="max-w-[1180px] mx-auto">
            {/* Pin badge */}
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-accent flex items-center gap-2">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3 9h9l-7.5 5.5L19 22l-7-5-7 5 2.5-5.5L0 11h9z" />
                </svg>
                Em destaque
              </span>
              <span className="block w-12 h-px bg-accent/40" />
              <time className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-text-dim">
                {formatDate(post.updated_at)}
              </time>
              <span className="font-mono text-[0.55rem] text-text-dim tracking-[0.2em] uppercase">
                {readTime} min
              </span>
            </div>

            <h2 className="font-serif text-[clamp(2.4rem,6vw,5rem)] text-text-bright leading-[1] tracking-[-0.015em] max-w-4xl mb-5 group-hover:text-accent transition-colors duration-500">
              {renderHighlightedTitle(post.title)}
            </h2>

            {post.excerpt && (
              <p className="font-serif italic text-text-dim text-lg max-w-2xl leading-relaxed mb-6">
                {post.excerpt}
              </p>
            )}

            <div className="inline-flex items-center gap-3 font-sans text-[0.7rem] font-medium tracking-[0.2em] uppercase text-text-bright group-hover:text-accent transition-colors">
              Ler artigo completo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.section>
  );
}

/* ====== BLOG PAGE ====== */
export default function BlogPage({ initialPosts = [], initialSeriesList = [] }) {
  const { visibility, ready } = useVisibility();
  const [allPosts, setAllPosts] = useState(initialPosts);
  const [seriesList, setSeriesList] = useState(initialSeriesList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    // seedOnly=false: preferimos localStorage quando existir (admin publicou
    // algo novo depois do build); cai pro snapshot/props quando ainda vazio.
    const load = () => {
      setAllPosts(getBlogPosts());
      setSeriesList(getBlogSeries());
    };

    load();

    const onStorage = (e) => {
      if (!e.key || e.key === STORAGE_KEY || e.key === SERIES_STORAGE_KEY) load();
    };
    const onChanged = (e) => {
      const k = e.detail?.key;
      if (!k || k === STORAGE_KEY || k === SERIES_STORAGE_KEY) load();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('sitedata:changed', onChanged);
    window.addEventListener('sitedata:bootstrap', load);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('sitedata:changed', onChanged);
      window.removeEventListener('sitedata:bootstrap', load);
    };
  }, []);

  // Links antigos (`/blog/?post=slug`, compartilhados no WhatsApp/Instagram)
  // continuam funcionando — redirecionamos pra URL canônica /blog/<slug>/.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postParam = params.get('post');
    if (!postParam || allPosts.length === 0) return;
    const found = allPosts.find((p) => p.slug === postParam || p.id === postParam);
    if (found) {
      const slug = found.slug || found.id;
      window.location.replace(`${BASE_PATH}/blog/${slug}/`);
    }
  }, [allPosts]);

  const publishedPosts = useMemo(() => {
    return allPosts
      .filter((p) => p.status === 'published')
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
      });
  }, [allPosts]);

  const allTags = useMemo(() => {
    const tags = new Set();
    publishedPosts.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [publishedPosts]);

  const filteredPosts = useMemo(() => {
    return publishedPosts.filter((p) => {
      const matchesSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || (p.tags || []).includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [publishedPosts, searchQuery, selectedTag]);

  // Pinned + restantes (para grid assimétrico)
  const pinnedPost = useMemo(() => {
    if (searchQuery || selectedTag) return null;
    return filteredPosts.find((p) => p.pinned) || null;
  }, [filteredPosts, searchQuery, selectedTag]);

  const restPosts = useMemo(() => {
    return filteredPosts.filter((p) => p !== pinnedPost);
  }, [filteredPosts, pinnedPost]);

  if (ready && !visibility.blog) {
    return <HiddenPlaceholder title="Blog indisponível" />;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Cover featured fullbleed quando há post pinned, senão PageHero */}
        {pinnedPost ? (
          <>
            <div className="pt-16" />
            <FeaturedCover post={pinnedPost} />
            <div className="px-5 sm:px-6 md:px-12 pt-8 md:pt-12 pb-6">
              <div className="max-w-[1180px] mx-auto flex items-baseline gap-4">
                <span className="font-mono text-[0.62rem] text-accent tracking-[0.25em] uppercase">
                  Reflexões & ensaios
                </span>
                <span className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em] uppercase">
                  {publishedPosts.length} publicações
                </span>
              </div>
            </div>
          </>
        ) : (
          <PageHero
            eyebrow="Blog · Reflexões & ensaios"
            title="Reflexões"
            emphasis="& ensaios"
            kicker="Textos"
            lead="Textos sobre psicologia analítica, clínica, mitologia e o processo de individuação. Atualizado quando há algo a dizer."
          />
        )}

        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 md:px-12 pb-24 relative">
          <SpiralAccent
            className="absolute top-20 -left-24 pointer-events-none hidden lg:block"
            size={260}
            opacity={0.08}
          />
          <HexRing
            className="absolute top-24 -right-6 pointer-events-none hidden md:block"
            size={100}
            opacity={0.18}
          />
          <TriangleCompass
            className="absolute bottom-20 right-0 pointer-events-none hidden lg:block"
            size={120}
            opacity={0.15}
            inverted
            animated
          />
          <GoldenArc
            className="absolute -bottom-10 -left-10 pointer-events-none hidden lg:block"
            size={240}
            opacity={0.12}
          />
          <div className="flex justify-center mb-8">
            <BranchOrnament opacity={0.4} />
          </div>
          {publishedPosts.length > 0 && (
            <div className="flex flex-col gap-6 mb-12 pb-8 border-b border-border-subtle relative">
              <div className="relative border-b border-border-subtle hover:border-border-hover focus-within:border-accent/50 transition-colors w-full md:max-w-md">
                <svg
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar publicações…"
                  className="w-full pl-9 pr-4 py-3 bg-transparent text-text-bright placeholder:text-text-dim/50 focus:outline-none font-serif italic text-base"
                />
              </div>

              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.22em] uppercase mr-2">
                    Filtrar
                  </span>
                  <button
                    onClick={() => setSelectedTag('')}
                    className={`px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.18em] uppercase transition-all ${
                      !selectedTag
                        ? 'bg-accent text-bg'
                        : 'border border-border-subtle text-text-dim hover:border-accent/40 hover:text-accent'
                    }`}
                  >
                    Todos
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                      className={`px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.18em] uppercase transition-all ${
                        selectedTag === tag
                          ? 'bg-accent text-bg'
                          : 'border border-border-subtle text-text-dim hover:border-accent/40 hover:text-accent'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Grid assimétrico — no mobile vira carrossel horizontal pra n virar uma parede vertical */}
          {restPosts.length > 0 ? (
            <>
              {/* Hint de swipe — só mobile, só se houver mais de 1 post */}
              {restPosts.length > 1 && (
                <div className="sm:hidden mb-3 flex items-center gap-2 text-text-dim/70">
                  <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase">
                    Arraste
                  </span>
                  <span aria-hidden className="font-mono text-[0.7rem] text-accent/60 tracking-[-0.08em]">
                    &gt;&gt;&gt;
                  </span>
                </div>
              )}
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 -mx-5 px-5 pb-6 scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:snap-none sm:mx-0 sm:px-0 sm:pb-0 lg:grid-cols-6 lg:gap-6 lg:auto-rows-min">
                {restPosts.map((post, i) => {
                  const mod = i % 7;
                  let span = 'lg:col-span-2';
                  let variant = 'default';
                  if (mod === 0) { span = 'lg:col-span-4'; variant = 'large'; }
                  else if (mod === 3) { span = 'lg:col-span-2'; variant = 'text'; }
                  else if (mod === 4) { span = 'lg:col-span-4'; variant = 'large'; }
                  else if (mod === 6) { span = 'lg:col-span-2'; variant = 'text'; }
                  // Capa vertical 9:16 — sempre default + span 2 (não fica
                  // gigante em 4-col como o horizontal)
                  if (post.featured_cover && variant !== 'text') {
                    span = 'lg:col-span-2';
                    variant = 'default';
                  }
                  return (
                    <div
                      key={post.id}
                      className={`w-[78vw] shrink-0 snap-start sm:w-auto sm:shrink ${span}`}
                    >
                      <BlogCard post={post} variant={variant} />
                    </div>
                  );
                })}
              </div>
            </>
          ) : publishedPosts.length > 0 ? (
            <div className="text-center py-20">
              <p className="text-text-dim font-sans text-sm">Nenhuma publicação encontrada com esses filtros.</p>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl font-serif text-accent/30 mb-4">ψ</div>
              <p className="text-text-dim font-sans text-sm">Em breve, novas publicações aqui.</p>
            </div>
          )}
        </div>

        {/* Quem escreve — fecha a listagem. Vivia na home, mas lá repetia o
            retrato do hero e a bio do "sobre"; aqui ela responde a pergunta
            que a leitura levanta. */}
        {visibility.autor !== false && <AuthorBand />}
      </main>
      <Footer />
    </>
  );
}
