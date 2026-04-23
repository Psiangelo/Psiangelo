/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Gera foo/index.html (em vez de foo.html) pra /blog/[slug]/ resolver
  // quando o WhatsApp/scrapers adicionam barra final na URL.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/Psiangelo',
  assetPrefix: '/Psiangelo/',
};

module.exports = nextConfig;
