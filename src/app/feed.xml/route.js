import siteContent from '@/data/site-content.json';

export const dynamic = 'force-static';

const BASE = 'https://psiangelo.github.io/Psiangelo';

function escapeXml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html = '') {
  return String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function getPublishedPosts() {
  const data = siteContent?.data || {};
  const posts = data['angelo_admin_blog'] || [];
  if (!Array.isArray(posts)) return [];
  return posts
    .filter((p) => p && p.status === 'published')
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
    .slice(0, 30);
}

export function GET() {
  const posts = getPublishedPosts();
  const now = new Date().toUTCString();

  const items = posts
    .map((p) => {
      const link = `${BASE}/blog?post=${encodeURIComponent(p.slug || p.id)}`;
      const pub = new Date(p.updated_at || Date.now()).toUTCString();
      const excerpt = p.excerpt || stripHtml(p.content_html).slice(0, 280);
      return `<item>
<title>${escapeXml(p.title || 'Sem título')}</title>
<link>${escapeXml(link)}</link>
<guid isPermaLink="false">${escapeXml(p.id || p.slug)}</guid>
<pubDate>${pub}</pubDate>
<description>${escapeXml(excerpt)}</description>
${(p.tags || []).map((t) => `<category>${escapeXml(t)}</category>`).join('')}
</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Psiangelo — Blog</title>
<link>${BASE}/blog</link>
<atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
<description>Ensaios sobre psicologia analítica, clínica junguiana e prática de estudo.</description>
<language>pt-BR</language>
<lastBuildDate>${now}</lastBuildDate>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
