#!/usr/bin/env node
/**
 * gen-og-posts — gera OG images 1200x630 por post do blog, com o filtro
 * de identidade visual (tint dourado + vignette + ornamento geométrico +
 * título serif sobreposto).
 *
 * Fonte dos dados: src/data/site-content.json (publicado via admin).
 * Fonte das imagens: featured_image pode ser data URI (upload comprimido)
 * ou path relativo (ex. /images/...) que é resolvido em public/.
 *
 * Saída: public/og/posts/{slug}.png
 *
 * Rodado automaticamente no prebuild (package.json) — não quebra o build
 * se algum post falhar: só loga e segue.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const pub  = resolve(root, 'public');
const out  = resolve(pub, 'og', 'posts');

const WIDTH  = 1200;
const HEIGHT = 630;

// OG vertical (WhatsApp portrait preview)
const V_WIDTH  = 1080;
const V_HEIGHT = 1920;

// Paleta do site
const GOLD = '#B48C50';
const BG   = '#0E0C0A';

function readSnapshot() {
  const p = resolve(root, 'src', 'data', 'site-content.json');
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf-8'));
  } catch (e) {
    console.warn('[og-posts] não consegui ler site-content.json:', e.message);
    return null;
  }
}

function fileToDataUri(filePath) {
  if (!existsSync(filePath)) return null;
  const ext = extname(filePath).toLowerCase().replace('.', '');
  const mime =
    ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
    ext === 'png' ? 'image/png' :
    ext === 'webp' ? 'image/webp' :
    'image/jpeg';
  const buf = readFileSync(filePath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

function resolveImageDataUri(src) {
  if (!src) return null;
  if (src.startsWith('data:')) return src;
  if (src.startsWith('http')) return null; // resvg não fetch
  // Path: remove basePath /Psiangelo se existir, resolve em public/
  const clean = src.replace(/^\/Psiangelo\//, '/').replace(/^\//, '');
  return fileToDataUri(resolve(pub, clean));
}

// Remove marcação *asterisco* de destaque (contexto de texto puro)
function stripHighlights(s) {
  return String(s ?? '').replace(/\*([^*]+)\*/g, '$1');
}

// XML-safe
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Quebra o título em até 3 linhas (~28 chars/linha)
function wrapTitle(title, maxChars = 30, maxLines = 3) {
  const words = String(title || '').split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
      if (lines.length === maxLines - 1) break;
    } else {
      cur = next;
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  // Se ainda sobrou palavras, truncar a última linha
  return lines.slice(0, maxLines);
}

// Ornamento geométrico — sortido por hash do slug
function hashSeed(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function ornament(seed, cx, cy) {
  const kind = hashSeed(seed) % 5;
  const o = 0.55;
  if (kind === 0) {
    // Triângulo (TriangleCompass simplificado)
    const s = 70;
    return `
      <g transform="translate(${cx},${cy})" stroke="${GOLD}" stroke-width="1.5" fill="none" opacity="${o}">
        <polygon points="0,${-s} ${s * 0.87},${s / 2} ${-s * 0.87},${s / 2}" />
        <circle r="${s * 0.45}" />
        <circle r="3" fill="${GOLD}" />
      </g>`;
  }
  if (kind === 1) {
    // Hexágono concêntrico
    const s = 64;
    const poly = (r) => Array.from({ length: 6 }).map((_, i) => {
      const a = (i * 60 - 30) * Math.PI / 180;
      return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
    }).join(' ');
    return `
      <g transform="translate(${cx},${cy})" stroke="${GOLD}" stroke-width="1.5" fill="none" opacity="${o}">
        <polygon points="${poly(s)}" />
        <polygon points="${poly(s * 0.7)}" />
        <circle r="4" fill="${GOLD}" />
      </g>`;
  }
  if (kind === 2) {
    // Quaternio — 4 círculos em cruz
    const r = 28;
    return `
      <g transform="translate(${cx},${cy})" stroke="${GOLD}" stroke-width="1.5" fill="none" opacity="${o}">
        <circle cx="${-r}" cy="0" r="${r}" />
        <circle cx="${r}" cy="0" r="${r}" />
        <circle cx="0" cy="${-r}" r="${r}" />
        <circle cx="0" cy="${r}" r="${r}" />
        <circle r="6" fill="${GOLD}" />
      </g>`;
  }
  if (kind === 3) {
    // Espiral concêntrica
    return `
      <g transform="translate(${cx},${cy})" stroke="${GOLD}" stroke-width="1.3" fill="none" opacity="${o * 0.8}">
        ${[12, 28, 46, 66, 88].map(r => `<circle r="${r}" />`).join('')}
        <circle r="4" fill="${GOLD}" />
      </g>`;
  }
  // Círculo pontilhado
  const r = 60;
  const dots = Array.from({ length: 24 }).map((_, i) => {
    const a = (i * 15) * Math.PI / 180;
    return `<circle cx="${(r * Math.cos(a)).toFixed(1)}" cy="${(r * Math.sin(a)).toFixed(1)}" r="2" fill="${GOLD}" />`;
  }).join('');
  return `
    <g transform="translate(${cx},${cy})" opacity="${o}">${dots}</g>`;
}

function composeSvg({ imageUri, title, eyebrow, date, seed, width = WIDTH, height = HEIGHT }) {
  const isVertical = height > width;
  const maxChars = isVertical ? 18 : 28;
  const lineHeight = isVertical ? 110 : 62;
  const titleFontSize = isVertical ? 96 : 54;
  const padX = isVertical ? 80 : 90;
  const eyebrowY = isVertical ? 160 : 100;
  const eyebrowSize = isVertical ? 34 : 22;
  const eyebrowTick = isVertical ? 44 : 28;
  const signatureBottom = isVertical ? 90 : 50;
  const signatureSize = isVertical ? 26 : 18;
  const ornamentCx = isVertical ? width - 150 : width - 110;
  const ornamentCy = isVertical ? 220 : 120;
  const frameWidth = isVertical ? 4 : 3;

  const titleLines = wrapTitle(title, maxChars, 4);
  const titleStartY = height - (isVertical ? 220 : 100) - (titleLines.length - 1) * lineHeight;

  // Dessatura + escurece levemente via filter SVG — harmoniza a imagem
  const imageLayer = imageUri
    ? `<image href="${imageUri}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" filter="url(#desat)" />`
    : `<rect x="0" y="0" width="${width}" height="${height}" fill="${BG}" />`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <!-- Dessatura + escurecimento sutil da imagem -->
    <filter id="desat" x="0" y="0" width="100%" height="100%">
      <feColorMatrix type="saturate" values="0.55" />
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.9" />
        <feFuncG type="linear" slope="0.9" />
        <feFuncB type="linear" slope="0.9" />
      </feComponentTransfer>
    </filter>
    <!-- Tint dourado diagonal -->
    <linearGradient id="tint" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="${GOLD}" stop-opacity="0.28" />
      <stop offset="55%" stop-color="${GOLD}" stop-opacity="0" />
      <stop offset="100%" stop-color="${BG}"  stop-opacity="0.55" />
    </linearGradient>
    <!-- Gradient escuro no rodapé pra legibilidade do título -->
    <linearGradient id="darken" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%"  stop-color="${BG}" stop-opacity="0.95" />
      <stop offset="45%" stop-color="${BG}" stop-opacity="0.55" />
      <stop offset="80%" stop-color="${BG}" stop-opacity="0.10" />
      <stop offset="100%" stop-color="${BG}" stop-opacity="0.35" />
    </linearGradient>
    <!-- Vignette sutil (leve escurecimento das bordas) -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="45%"  stop-color="${BG}" stop-opacity="0" />
      <stop offset="85%"  stop-color="${BG}" stop-opacity="0.4" />
      <stop offset="100%" stop-color="${BG}" stop-opacity="0.7" />
    </radialGradient>
  </defs>

  <!-- 1. Imagem de fundo -->
  ${imageLayer}

  <!-- 2. Tint dourado (harmonização de identidade) -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#tint)" />

  <!-- 3. Vignette -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#vignette)" />

  <!-- 4. Gradient escuro embaixo pra legibilidade -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#darken)" />

  <!-- 5. Ornamento geométrico (canto superior-direito) -->
  ${ornament(seed || title || 'psi', ornamentCx, ornamentCy)}

  <!-- 6. Faixa lateral dourada (moldura editorial) -->
  <rect x="60" y="60" width="${frameWidth}" height="${height - 120}" fill="${GOLD}" opacity="0.7" />

  <!-- 7. Eyebrow: meta caps -->
  ${eyebrow ? `
    <g transform="translate(${padX}, ${eyebrowY})">
      <rect x="0" y="-4" width="${eyebrowTick}" height="2" fill="${GOLD}" />
      <text x="${eyebrowTick + 14}" y="0" font-family="Courier New, monospace" font-size="${eyebrowSize}" font-weight="bold"
            fill="${GOLD}" letter-spacing="4">${esc(eyebrow.toUpperCase())}</text>
    </g>` : ''}

  <!-- 8. Título -->
  <g font-family="Georgia, 'Times New Roman', serif" fill="#E8DDD0">
    ${titleLines.map((line, i) => `
      <text x="${padX}" y="${titleStartY + i * lineHeight}" font-size="${titleFontSize}" font-weight="400">${esc(line)}</text>
    `).join('')}
  </g>

  <!-- 9. Assinatura rodapé -->
  <g transform="translate(${padX}, ${height - signatureBottom})">
    <rect x="0" y="-4" width="20" height="1.5" fill="${GOLD}" opacity="0.7" />
    <text x="32" y="0" font-family="Courier New, monospace" font-size="${signatureSize}" fill="${GOLD}"
          letter-spacing="3" opacity="0.85">PSIANGELO${date ? `  ·  ${esc(date.toUpperCase())}` : ''}</text>
  </g>
</svg>`;
}

function fmtDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const months = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
    return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return '';
  }
}

async function main() {
  const snap = readSnapshot();
  const posts = snap?.data?.angelo_admin_blog;
  if (!Array.isArray(posts) || posts.length === 0) {
    console.log('[og-posts] nenhum post publicado em site-content.json — skip');
    return;
  }

  const outV = resolve(pub, 'og', 'posts-v');
  mkdirSync(out, { recursive: true });
  mkdirSync(outV, { recursive: true });

  let ok = 0;
  let skip = 0;
  for (const post of posts) {
    const slug = post.slug || post.id;
    if (!slug) { skip++; continue; }
    if (post.status && post.status !== 'published') { skip++; continue; }

    const outFile  = resolve(out,  `${slug}.png`);
    const outFileV = resolve(outV, `${slug}.png`);
    try {
      const imageUri  = resolveImageDataUri(post.featured_image);
      // Vertical prefere featured_cover (já 9:16); fallback pra featured_image
      const imageUriV = resolveImageDataUri(post.featured_cover) || imageUri;

      const baseOpts = {
        title: stripHighlights(post.title) || 'Sem título',
        eyebrow: post.tags?.[0] || 'Ensaio',
        date: fmtDate(post.updated_at || post.created_at),
        seed: slug,
      };
      const fontOpts = {
        loadSystemFonts: true,
        defaultFontFamily: 'Georgia',
        serifFamily: 'Georgia',
        sansSerifFamily: 'Arial',
        monospaceFamily: 'Courier New',
      };

      // Horizontal (Twitter/Facebook/Fallback)
      const svg = composeSvg({ imageUri, ...baseOpts, width: WIDTH, height: HEIGHT });
      const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH }, font: fontOpts, background: BG }).render().asPng();
      writeFileSync(outFile, png);

      // Vertical (WhatsApp portrait)
      const svgV = composeSvg({ imageUri: imageUriV, ...baseOpts, width: V_WIDTH, height: V_HEIGHT });
      const pngV = new Resvg(svgV, { fitTo: { mode: 'width', value: V_WIDTH }, font: fontOpts, background: BG }).render().asPng();
      writeFileSync(outFileV, pngV);

      console.log(`✓ og/posts/${slug}.png (${(png.length/1024).toFixed(0)} KB) + posts-v (${(pngV.length/1024).toFixed(0)} KB)`);
      ok++;
    } catch (e) {
      console.warn(`✗ falhou ${slug}: ${e.message}`);
      skip++;
    }
  }

  console.log(`[og-posts] gerados: ${ok}, pulados: ${skip}`);
}

main().catch((e) => {
  console.error('[og-posts] erro fatal:', e);
  // Não quebra o build — OG images são enhancement, fallback é og.png global
  process.exit(0);
});
