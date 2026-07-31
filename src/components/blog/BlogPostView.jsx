'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AlchemicalTimeline from '@/components/ui/AlchemicalTimeline';
import ListenButton from '@/components/ListenButton';
import ReadingMode from '@/components/ReadingMode';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedPosts from '@/components/blog/RelatedPosts';
import PrevNextPost from '@/components/blog/PrevNextPost';
import TermPreview from '@/components/blog/TermPreview';
import BlogPostBody from '@/components/blog/BlogPostBody';
import AuthorBox from '@/components/blog/AuthorBox';
import { slugifyTag } from '@/lib/tagSlug';
import { renderHighlightedTitle, stripHighlights } from '@/lib/highlightTitle';
import { linkGlossaryTerms } from '@/lib/glossaryLinker';
import { getGlossario, getHomepage, DEFAULT_HOMEPAGE, SITEDATA_KEYS } from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';
import { BASE_PATH, resolveImageSrc } from '@/lib/basepath';
import { formatPostDate } from '@/lib/formatDate';
import Newsletter from '@/components/ui/Newsletter';

/**
 * BlogPostView — apresentação visual completa de um post individual.
 *
 * Extraído de BlogClient.jsx (era acoplado ao swap SPA via onBack/onNavigate
 * + history.pushState). Agora cada post tem rota estática própria
 * (/blog/<slug>/), então toda navegação aqui — "voltar", série, anterior/
 * próximo, relacionados — é link real (<Link>), não mais callback de estado.
 *
 * Usado tanto por /blog/[slug]/BlogSlugClient.js (rota estática, SEO)
 * quanto continua reaproveitável se o hub /blog quiser reintroduzir preview
 * embutido no futuro.
 */

/* ====== Helpers ====== */
// Data em UTC fixo, via helper compartilhado. Formatar no fuso local fazia o
// build (UTC) e o navegador do leitor (UTC-3) produzirem textos diferentes,
// o que quebrava a hidratação e derrubava a página. Ver src/lib/formatDate.js.
const formatDate = formatPostDate;

function calculateReadingTime(html) {
  if (!html) return 0;
  const words = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function stripHtmlToText(html) {
  if (!html) return '';
  return html
    /* O <details> é o aparato do ensaio (referências, notas de edição). Ficava
       na locução, e quem ouvia o post até o fim recebia "p. 31 — o homem como
       quantité négligeable. p. 35 — o objeto que coloca as questões..." lido em
       voz alta depois do último parágrafo. */
    .replace(/<details[\s\S]*?<\/details>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '.\n')
    .replace(/<\/h[1-6]>/gi, '.\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugifyHeading(text) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function extractHeadings(html) {
  if (!html) return [];
  const regex = /<h([1-4])[^>]*>(.*?)<\/h[1-4]>/gi;
  const headings = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    if (text) headings.push({ level: parseInt(match[1]), text, id: slugifyHeading(text) });
  }
  return headings;
}

function addHeadingIds(html) {
  if (!html) return html;
  return html.replace(/<h([1-4])([^>]*)>(.*?)<\/h[1-4]>/gi, (match, level, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    return `<h${level}${attrs} id="${slugifyHeading(text)}">${content}</h${level}>`;
  });
}

/* ====== Reading Progress Bar ====== */
function ReadingProgressBar({ targetRef }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const start = rect.top + window.scrollY - window.innerHeight * 0.2;
      const end = rect.top + window.scrollY + rect.height - window.innerHeight * 0.8;
      const span = Math.max(end - start, 1);
      const cur = Math.min(Math.max((window.scrollY - start) / span, 0), 1);
      setProgress(cur);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [targetRef]);

  return (
    <div className="fixed top-[60px] left-0 right-0 h-[2px] bg-bg-warm/40 z-[400] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-accent via-accent-bright to-accent origin-left"
        style={{ width: `${progress * 100}%`, transition: 'width 80ms linear' }}
      />
    </div>
  );
}

/* ====== Sumário do ensaio ======
   Duas apresentações da mesma régua: barra lateral fixa no desktop e bloco
   recolhível no topo do post no celular. O scroll-spy vive no BlogPostView e é
   passado às duas, para existir UM listener de scroll e não dois — no mobile a
   barra lateral continua montada (só escondida por CSS), então o segundo
   listener rodaria a cada rolagem sem pintar nada na tela. */

function useSecaoAtiva(headings) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!headings.length) return undefined;
    const handleScroll = () => {
      const offsets = headings
        .map((h) => {
          const el = document.getElementById(h.id);
          if (!el) return null;
          return { id: h.id, top: el.getBoundingClientRect().top };
        })
        .filter(Boolean);
      const passed = offsets.filter((o) => o.top < 120);
      const current = passed.length ? passed[passed.length - 1].id : offsets[0]?.id;
      setActiveId(current || null);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  return activeId;
}

function montarSumario(headings, activeId) {
  /* Qual nível conta como "seção" é relativo ao post, não fixo em h2: há post
     no ar com um único h2 de abertura e dez h3, e tratar h3 como subseção
     deixava dez itens recuados e sem número. Seção = o menor nível que aparece
     ao menos duas vezes; o que vier abaixo dele é subseção. */
  const porNivel = {};
  headings.forEach((h) => {
    const l = h.level || 2;
    porNivel[l] = (porNivel[l] || 0) + 1;
  });
  const niveis = Object.keys(porNivel).map(Number).sort((a, b) => a - b);
  const nivelSecao = niveis.find((l) => porNivel[l] >= 2) ?? niveis[0];

  // -1 (nenhuma seção passou ainda) cai no primeiro item
  const iAtivo = Math.max(0, headings.findIndex((h) => h.id === activeId));

  let n = 0;
  const itens = headings.map((h, i) => {
    const secao = (h.level || 2) <= nivelSecao;
    return {
      ...h,
      secao,
      numero: secao ? (n += 1) : null,
      ativo: i === iAtivo,
      passou: i <= iAtivo,
    };
  });

  return { itens, iAtivo, totalSecoes: n };
}

function TOCItens({ itens, onNavegar }) {
  return (
    <ul className="toc-list max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
      {itens.map((it, i) => (
        <li key={it.id || i}>
          <a
            href={`#${it.id}`}
            onClick={onNavegar}
            className="toc-item"
            data-active={it.ativo}
            data-passed={it.passou}
            data-level={it.secao ? 2 : 3}
            aria-current={it.ativo ? 'true' : undefined}
          >
            {it.numero !== null && (
              <span className="toc-num" aria-hidden="true">{String(it.numero).padStart(2, '0')}</span>
            )}
            <span className="toc-text">{it.text}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* No celular o sumário serve como mapa prévio do ensaio, não como navegação
   permanente: por isso é um bloco recolhível no topo, fechado por padrão, e não
   um elemento fixo — o canto inferior já tem o WhatsApp e o voltar-ao-topo.
   Fecha sozinho ao escolher uma seção, senão continuaria aberto ocupando a tela
   quando o leitor voltasse ao começo do post. */
function TOCMobile({ headings, activeId }) {
  const ref = useRef(null);
  if (headings.length < 3) return null;
  const { itens, totalSecoes } = montarSumario(headings, activeId);

  return (
    <details ref={ref} className="toc-mobile lg:hidden" data-reading-hide="true">
      <summary className="toc-mobile-summary">
        <span className="meta-caps-accent">Neste artigo</span>
        <span className="toc-mobile-meta">
          {totalSecoes} seções
          <span className="toc-mobile-chevron" aria-hidden="true" />
        </span>
      </summary>
      <div className="toc-mobile-corpo">
        <TOCItens itens={itens} onNavegar={() => { if (ref.current) ref.current.open = false; }} />
      </div>
    </details>
  );
}

function StickyTOC({ headings, activeId }) {
  if (headings.length < 3) return null;
  const { itens, iAtivo } = montarSumario(headings, activeId);

  return (
    <nav className="lg:sticky lg:top-28" aria-label="Sumário do artigo">
      <div className="flex items-baseline justify-between gap-3 mb-4 pb-3 border-b border-accent/20">
        <p className="meta-caps-accent">Neste artigo</p>
        <span className="toc-count" aria-hidden="true">
          {String(iAtivo + 1).padStart(2, '0')}
          <span className="toc-count-total">/{String(headings.length).padStart(2, '0')}</span>
        </span>
      </div>
      <TOCItens itens={itens} />
    </nav>
  );
}

/* ====== Series Navigation ======
   - Se a série tiver 2-3 posts: lista textual.
   - Se tiver exatamente 4 posts: vira AlchemicalTimeline
     (Nigredo → Albedo → Citrinitas → Rubedo).
   - Se tiver 5+: lista textual + indicador de progresso.
*/
const ALCHEMICAL_PHASES = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];

function SeriesNav({ currentPost, allPosts, seriesList }) {
  const router = useRouter();
  if (!currentPost.seriesId) return null;
  const series = seriesList.find((s) => s.id === currentPost.seriesId);
  if (!series) return null;

  const seriesPosts = allPosts
    .filter((p) => p.seriesId === currentPost.seriesId && p.status === 'published')
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));

  if (seriesPosts.length < 2) return null;

  const currentIdx = seriesPosts.findIndex((p) => p.id === currentPost.id);

  // Caso especial: série de 4 posts → timeline alquímica
  if (seriesPosts.length === 4) {
    const stages = seriesPosts.map((p, i) => ({
      phase: ALCHEMICAL_PHASES[i],
      post: { title: p.title, slug: p.slug || p.id },
      _ref: p,
    }));

    return (
      <div className="bg-bg-card border border-border-subtle p-6 md:p-8 mb-10">
        <p className="meta-caps-accent mb-1">Série: {series.name}</p>
        <p className="font-serif italic text-text-dim text-[0.9rem] mb-2">
          Parte {currentIdx + 1} de 4 — segue o ciclo da Grande Obra
        </p>
        <AlchemicalTimeline
          stages={stages}
          currentIdx={currentIdx}
          title="Fases da série"
          onSelectStage={(stage) => stage._ref && stage._ref.id !== currentPost.id && router.push(`/blog/${stage._ref.slug || stage._ref.id}/`)}
        />
      </div>
    );
  }

  const prev = currentIdx > 0 ? seriesPosts[currentIdx - 1] : null;
  const next = currentIdx < seriesPosts.length - 1 ? seriesPosts[currentIdx + 1] : null;

  return (
    <div className="bg-bg-card border border-border-subtle p-5 mb-10">
      <p className="meta-caps-accent mb-1">Série: {series.name}</p>
      <p className="text-xs text-text-dim font-sans mb-4">
        Parte {currentIdx + 1} de {seriesPosts.length}
      </p>

      <ul className="space-y-1 mb-4">
        {seriesPosts.map((p, i) => (
          <li key={p.id}>
            {p.id === currentPost.id ? (
              <span className="text-sm font-sans text-left w-full px-2 py-1 block text-accent font-medium bg-accent/10">
                <span className="text-text-dim mr-2">{i + 1}.</span>
                {p.title || 'Sem título'}
              </span>
            ) : (
              <Link
                href={`/blog/${p.slug || p.id}/`}
                className="text-sm font-sans text-left w-full px-2 py-1 block text-text-dim hover:text-text-bright hover:bg-bg-warm transition-colors"
              >
                <span className="text-text-dim mr-2">{i + 1}.</span>
                {p.title || 'Sem título'}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="flex justify-between gap-3">
        {prev ? (
          <Link href={`/blog/${prev.slug || prev.id}/`} className="text-xs font-sans text-text-dim hover:text-accent transition-colors">
            ← {prev.title}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/blog/${next.slug || next.id}/`} className="text-xs font-sans text-text-dim hover:text-accent transition-colors text-right">
            {next.title} →
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}

/* ====== Blog Post View ====== */
export default function BlogPostView({ post, allPosts, seriesList, visibility }) {
  const readTime = calculateReadingTime(post.content_html);
  const headings = extractHeadings(post.content_html);
  const htmlWithIds = addHeadingIds(post.content_html);
  // Autolink de termos do glossário — roda no render (não em useEffect),
  // pra existir no HTML estático (leitor sem JS + Google). Ver
  // src/lib/glossaryLinker.js: só primeira ocorrência de cada termo,
  // nunca dentro de <a>/heading/code/pre/blockquote, fronteira Unicode.
  // seedOnly=true: sempre snapshot publicado (site-content.json) ou fallback
  // hardcoded — nunca localStorage. É o que garante que este useMemo produza
  // o MESMO html no server (build) e no primeiro render do client: se lesse
  // localStorage aqui, o autolink do primeiro paint do visitante poderia
  // divergir do HTML estático e voltar o hydration mismatch que a primeira
  // onda já resolveu.
  const glossarioList = useMemo(() => getGlossario(true), []);
  const htmlWithGlossaryLinks = useMemo(
    () => linkGlossaryTerms(htmlWithIds, glossarioList, { title: post.title, basePath: BASE_PATH }).html,
    [htmlWithIds, post.title, glossarioList]
  );
  const plainText = useMemo(() => stripHtmlToText(post.content_html), [post.content_html]);
  const newsletterContent = useSitedata(
    () => getHomepage().newsletter,
    DEFAULT_HOMEPAGE.newsletter,
    SITEDATA_KEYS.homepage,
  );
  const articleRef = useRef(null);
  // um listener só, compartilhado pelas duas apresentações do sumário
  const secaoAtiva = useSecaoAtiva(headings);

  // Capa dupla: featured_image (horizontal, desktop) + featured_cover
  // (vertical, cadastrada pra celular). Sem a troca por <picture>, o mobile
  // herdava a mesma imagem 16/9 do desktop e virava uma tira fina no topo.
  // Resolvido em HTML puro (sem JS medindo largura de janela): o navegador
  // escolhe a <source> certa antes do primeiro paint, então funciona sem JS
  // e sem salto de layout. Se só uma capa existir, ela cobre os dois casos.
  const desktopCoverSrc = resolveImageSrc(post.featured_image || post.featured_cover);
  const mobileCoverSrc = resolveImageSrc(post.featured_cover || post.featured_image);
  const hasCover = Boolean(desktopCoverSrc || mobileCoverSrc);

  // Pullquote: detecta blockquotes curtas (<=220 chars) ou explicitas e
  // adiciona botao 'compartilhar trecho' que copia a URL
  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    const quotes = root.querySelectorAll('.blog-content blockquote');
    quotes.forEach((q, i) => {
      const text = q.textContent.trim();
      const hasMarker = q.classList.contains('pullquote') || q.dataset.pullquote === 'true';
      const short = text.length > 20 && text.length <= 220;
      if (!hasMarker && !short) return;
      q.classList.add('pullquote');
      if (!q.id) q.id = `pq-${i}`;
      if (q.querySelector('.quote-share')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quote-share';
      btn.setAttribute('aria-label', 'Compartilhar este trecho');
      btn.textContent = 'Compartilhar';
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const url = `${window.location.origin}${window.location.pathname}#${q.id}`;
        try {
          if (navigator.share) {
            await navigator.share({ title: post.title, text: `"${text}"`, url });
          } else {
            await navigator.clipboard.writeText(`"${text}"\n${url}`);
            btn.textContent = 'Copiado';
            setTimeout(() => { btn.textContent = 'Compartilhar'; }, 1800);
          }
        } catch { /* user cancel */ }
      });
      q.style.position = 'relative';
      q.appendChild(btn);
    });
  }, [post.content_html, post.title]);

  return (
    <>
      <ReadingProgressBar targetRef={articleRef} />

      {/* Hero do post — fullbleed cover quando tem imagem.
          <picture> com <source media> troca a capa vertical (celular) pela
          horizontal (desktop) no HTML servido, sem JS e sem CLS. */}
      {hasCover ? (
        <header className="relative h-[55vh] md:h-[65vh] min-h-[420px] overflow-hidden" data-reading-hide="true">
          <picture className="absolute inset-0 block w-full h-full">
            {mobileCoverSrc && mobileCoverSrc !== desktopCoverSrc && (
              <source media="(max-width: 767px)" srcSet={mobileCoverSrc} />
            )}
            <img
              src={desktopCoverSrc || mobileCoverSrc}
              alt={post.featured_image_alt || post.featured_cover_alt || post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/30" />
          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-6 md:px-12 pb-12 md:pb-16">
            <div className="max-w-[1180px] mx-auto">
              <Link
                href="/blog/"
                className="flex items-center gap-2 text-xs font-sans text-text-bright/80 hover:text-accent transition-colors uppercase tracking-widest mb-6"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Voltar ao blog
              </Link>
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <time className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-accent">
                  {formatDate(post.updated_at)}
                </time>
                <span className="font-mono text-[0.6rem] text-text-dim tracking-[0.2em] uppercase">
                  {readTime} min
                </span>
                {post.tags && post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${slugifyTag(tag)}/`}
                    className="font-mono text-[0.55rem] tracking-[0.2em] uppercase px-2 py-1 border border-accent/30 text-accent bg-accent/[0.08] hover:border-accent hover:text-text-bright transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <h1 className="font-serif text-[clamp(2.2rem,5.5vw,4.6rem)] text-text-bright leading-[1] tracking-[-0.015em] max-w-4xl">
                {renderHighlightedTitle(post.title)}
              </h1>
              {post.author && (
                <p className="text-sm text-text-dim font-sans mt-5">
                  Por <span className="text-text">{post.author}</span>
                </p>
              )}
            </div>
          </div>
        </header>
      ) : (
        // Sem imagem — header textual com PageHero-style
        <header className="pt-32 md:pt-40 pb-12 px-5 sm:px-6 md:px-12" data-reading-hide="true">
          <div className="max-w-[1180px] mx-auto">
            <Link
              href="/blog/"
              className="flex items-center gap-2 text-xs font-sans text-text-dim hover:text-accent transition-colors uppercase tracking-widest mb-8"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Voltar ao blog
            </Link>
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <time className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-accent">{formatDate(post.updated_at)}</time>
              <span className="font-mono text-[0.6rem] text-text-dim tracking-[0.2em] uppercase">{readTime} min</span>
              {post.tags && post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${slugifyTag(tag)}/`}
                  className="font-mono text-[0.55rem] tracking-[0.2em] uppercase px-2 py-1 border border-accent/30 text-accent bg-accent/[0.08] hover:border-accent hover:text-text-bright transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
            <h1 className="font-serif text-[clamp(2.2rem,5.5vw,4.6rem)] text-text-bright leading-[1] tracking-[-0.015em] max-w-4xl">
              {renderHighlightedTitle(post.title)}
            </h1>
          </div>
        </header>
      )}

      {/* Corpo do post + TOC sticky */}
      <div className="reading-shell px-5 sm:px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 lg:gap-16">
          <motion.article
            ref={articleRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-w-0 max-w-[760px]"
          >
            <SeriesNav currentPost={post} allPosts={allPosts} seriesList={seriesList} />

            {plainText && plainText.length > 100 && (
              <div className="mb-8 flex items-center gap-3 flex-wrap" data-reading-hide="true">
                {/* sem os asteriscos: eles marcam o destaque dourado do título
                    e estavam indo para a locução como texto */}
                <ListenButton text={plainText} title={stripHighlights(post.title)} />
                <ReadingMode />
              </div>
            )}

            <TOCMobile headings={headings} activeId={secaoAtiva} />

            <BlogPostBody html={htmlWithGlossaryLinks} />
            <TermPreview articleRef={articleRef} contentKey={post.id} />

            <div className="mt-12 pt-6 border-t border-border-subtle" data-reading-hide="true">
              <ShareButtons title={post.title} />
            </div>

            {visibility?.newsletter !== false && (
              <div className="mt-12" data-reading-hide="true">
                <Newsletter source="blog-post" {...newsletterContent} />
              </div>
            )}

            {visibility?.blogAuthorBox !== false && <AuthorBox />}

            <PrevNextPost currentPost={post} allPosts={allPosts} />

            <RelatedPosts currentPost={post} allPosts={allPosts} />

            <div className="mt-12 pt-6 border-t border-border-subtle flex justify-between items-center" data-reading-hide="true">
              <Link
                href="/blog/"
                className="text-xs font-sans text-accent hover:text-text-bright transition-colors uppercase tracking-widest"
              >
                ← Voltar ao blog
              </Link>
            </div>
          </motion.article>

          {/* TOC sticky lateral — só desktop */}
          <aside className="hidden lg:block" data-reading-hide="true">
            <StickyTOC headings={headings} activeId={secaoAtiva} />
          </aside>
        </div>
      </div>
    </>
  );
}
