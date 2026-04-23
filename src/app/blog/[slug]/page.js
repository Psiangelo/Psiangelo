/**
 * Rota estática por post — existe pra social scrapers (WhatsApp, Twitter etc)
 * verem metadata específica (título, descrição, OG image gerada com filtro).
 *
 * Humanos que acessam essa URL são redirecionados client-side para /blog?post=slug
 * (mantém o SPA de navegação do blog que já existe em /blog/page.js).
 *
 * generateStaticParams lê o snapshot publicado (src/data/site-content.json)
 * e gera um HTML por slug no export estático.
 */

import siteContent from '@/data/site-content.json';
import BlogSlugClient from './BlogSlugClient';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

function getPosts() {
  const posts = siteContent?.data?.angelo_admin_blog;
  if (!Array.isArray(posts)) return [];
  return posts.filter((p) => p && (p.slug || p.id) && (!p.status || p.status === 'published'));
}

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: String(p.slug || p.id) }));
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const posts = getPosts();
  const post = posts.find((p) => String(p.slug || p.id) === params.slug);

  if (!post) {
    return {
      title: 'Publicação — Psiangelo',
    };
  }

  const title = post.title || 'Publicação';
  const description =
    post.excerpt ||
    'Ensaio de psicologia analítica — Psiangelo. Psicoterapia junguiana online.';
  const ogImage = `${SITE_URL}/og/posts/${post.slug || post.id}.png`;
  const url = `${SITE_URL}/blog/${post.slug || post.id}`;

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
        { url: ogImage, width: 1200, height: 630, alt: title, type: 'image/png' },
        // Fallback global, caso a imagem gerada não exista
        { url: `${SITE_URL}/og-square.png`, width: 1200, height: 1200, alt: 'Psiangelo' },
      ],
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      tags: post.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function BlogSlugPage({ params }) {
  return <BlogSlugClient slug={params.slug} />;
}
