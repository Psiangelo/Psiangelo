const BASE = 'https://psiangelo.github.io/Psiangelo';

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/'] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
