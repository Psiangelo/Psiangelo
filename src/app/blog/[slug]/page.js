/**
 * Rota estática por post — HTML de verdade no export estático (título, data,
 * autor, tags e o content_html completo), não mais um redirect client-side.
 * Isso é o que torna o blog rastreável pelo Google: antes, essa rota fazia
 * `window.location.replace('/blog?post=slug')` e o crawler via conteúdo
 * vazio; agora o post inteiro sai no HTML gerado no build.
 *
 * generateStaticParams lê o snapshot publicado (src/data/site-content.json)
 * e gera um HTML por slug no export estático.
 */

import siteContent from '@/data/site-content.json';
import BlogSlugClient from './BlogSlugClient';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

// Remove marcação *asterisco* de destaque — contexto de texto puro
function stripHighlights(t) {
  return typeof t === 'string' ? t.replace(/\*([^*]+)\*/g, '$1') : (t ?? '');
}

function getAllPosts() {
  const posts = siteContent?.data?.angelo_admin_blog;
  return Array.isArray(posts) ? posts : [];
}

function getSeriesList() {
  const series = siteContent?.data?.angelo_admin_blog_series;
  return Array.isArray(series) ? series : [];
}

function getPosts() {
  return getAllPosts().filter((p) => p && (p.slug || p.id) && (!p.status || p.status === 'published'));
}

export function generateStaticParams() {
  const posts = getPosts();
  if (posts.length === 0) {
    // Next 14 + output:'export' exige ao menos um param. Gera um
    // placeholder que redireciona pro blog — some assim que houver posts.
    return [{ slug: '__placeholder__' }];
  }
  return posts.map((p) => ({ slug: String(p.slug || p.id) }));
}

export function generateMetadata({ params }) {
  const posts = getPosts();
  const post = posts.find((p) => String(p.slug || p.id) === params.slug);

  if (!post) {
    return {
      title: 'Publicação — Psiangelo',
    };
  }

  const title = stripHighlights(post.title) || 'Publicação';
  const description =
    stripHighlights(post.excerpt) ||
    'Ensaio de psicologia analítica — Psiangelo. Psicoterapia junguiana online.';
  const slug = post.slug || post.id;
  const ogImage  = `${SITE_URL}/og/posts/${slug}.png`;
  const ogImageV = `${SITE_URL}/og/posts-v/${slug}.png`;
  // trailingSlash:true no next.config — canonical precisa bater com a rota real
  const url = `${SITE_URL}/blog/${slug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      url,
      siteName: 'Psiangelo',
      title,
      description,
      images: [
        // Vertical primeiro — scrapers do WhatsApp costumam pegar o primeiro
        { url: ogImageV, width: 720,  height: 1280, alt: title, type: 'image/png' },
        { url: ogImage,  width: 1200, height: 630,  alt: title, type: 'image/png' },
        // Fallback global, caso a imagem gerada não exista
        { url: `${SITE_URL}/og-square.png`, width: 1200, height: 1200, alt: 'Psiangelo' },
      ],
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      tags: post.tags || [],
    },
    twitter: {
      // Twitter lida melhor com a horizontal
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

function stripHtml(s) {
  return typeof s === 'string' ? s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

function buildBlogPostingSchema(post) {
  if (!post) return null;
  const slug = post.slug || post.id;
  const url = `${SITE_URL}/blog/${slug}/`;
  const title = stripHighlights(post.title) || 'Publicação';
  const description =
    stripHighlights(post.excerpt) ||
    stripHtml(post.content_html).slice(0, 280) ||
    'Ensaio de psicologia analítica — Psiangelo.';
  const body = stripHtml(post.content_html);
  const wordCount = body ? body.split(/\s+/).filter(Boolean).length : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#blogposting`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: title,
    description,
    image: [
      `${SITE_URL}/og/posts-v/${slug}.png`,
      `${SITE_URL}/og/posts/${slug}.png`,
    ],
    datePublished: post.created_at || post.updated_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      '@id': `${SITE_URL}#person`,
      name: post.author || 'Angelo',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Psiangelo',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/og-square.png`,
      },
    },
    keywords: (post.tags || []).join(', ') || undefined,
    wordCount,
    inLanguage: 'pt-BR',
    url,
  };
}

export default function BlogSlugPage({ params }) {
  const post = getPosts().find((p) => String(p.slug || p.id) === params.slug);
  const schema = buildBlogPostingSchema(post);

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <BlogSlugClient
        slug={params.slug}
        initialPost={post || null}
        initialAllPosts={getAllPosts()}
        initialSeriesList={getSeriesList()}
      />
    </>
  );
}
