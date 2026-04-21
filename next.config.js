/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Psiangelo',
  assetPrefix: '/Psiangelo/',
};

module.exports = nextConfig;
