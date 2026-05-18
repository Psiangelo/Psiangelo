'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger } from '@/lib/constants';
import { getMaterials, getCategories, getContentTypes, DEFAULT_CATEGORIES, DEFAULT_CONTENT_TYPES, SITEDATA_KEYS } from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';
import { img } from '@/lib/basepath';
import { SpiralAccent } from '@/components/illustrations';

// Bento layout — até 6 tiles com spans variados.
// Layout em md+:  [span2 row2 ] [span1] [span1]
//                 [          ] [span1] [span1]
//                 [span2     ] [    span2     ]
const BENTO_SPANS = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-2 md:row-span-1',
];

function resolveImg(item) {
  if (!item.image) return null;
  return item.image.startsWith('http') ? item.image : img(item.image);
}

function hexToToneStyle(hex) {
  const fallback = '#B48C50';
  const color = (hex && hex.startsWith('#')) ? hex : fallback;
  return {
    background: `${color}1A`,
    border: `1px solid ${color}55`,
    color,
  };
}

function Tile({ item, span, index, categories, contentTypes }) {
  const typeInfo = contentTypes.find((t) => t.slug === item.contentType);
  const catInfo  = categories.find((c) => c.slug === item.category);
  const image = resolveImg(item);
  const isFeatured = index === 0;
  const catTone = hexToToneStyle('#B48C50');

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative bg-bg-card border border-border-subtle overflow-hidden flex flex-col hover:border-border-hover transition-colors ${span}`}
    >
      {/* Imagem como fundo do tile, com gradient overlay */}
      {image ? (
        <>
          <div className="absolute inset-0">
            <img
              src={image}
              alt={item.title}
              className="w-full h-full object-cover opacity-50 group-hover:opacity-65 group-hover:scale-105 transition-all duration-700"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/35" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-bg-card to-bg" />
      )}

      {/* Conteúdo sobre o overlay */}
      <div className={`relative z-10 p-6 md:p-7 flex flex-col h-full ${isFeatured ? 'min-h-[360px]' : 'min-h-[210px]'}`}>
        {/* Badges topo */}
        <div className="flex items-center gap-2 mb-auto flex-wrap">
          {catInfo && (
            <span
              className="font-mono text-[0.55rem] tracking-[0.18em] uppercase px-2 py-1"
              style={catTone}
            >
              {catInfo.singular || catInfo.label}
            </span>
          )}
          {typeInfo && (
            <span
              className="font-mono text-[0.55rem] tracking-[0.15em] uppercase px-2 py-1 border"
              style={{ color: typeInfo.color, borderColor: `${typeInfo.color}55` }}
            >
              {typeInfo.label}
            </span>
          )}
        </div>

        {/* Título + subtítulo no rodapé */}
        <div className="mt-6">
          <h3
            className={`font-serif text-text-bright leading-tight mb-2 group-hover:text-accent transition-colors ${
              isFeatured ? 'text-2xl md:text-3xl' : 'text-lg'
            }`}
          >
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="text-[0.82rem] text-text-dim leading-snug line-clamp-2">
              {item.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Linha dourada inferior no hover */}
      <span className="absolute bottom-0 left-0 h-px w-0 bg-accent group-hover:w-full transition-all duration-500" />
    </motion.article>
  );
}

export default function MaterialsPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const materials = useSitedata(getMaterials, [], SITEDATA_KEYS.materials);
  const categories = useSitedata(getCategories, DEFAULT_CATEGORIES, SITEDATA_KEYS.categories);
  const contentTypes = useSitedata(getContentTypes, DEFAULT_CONTENT_TYPES, SITEDATA_KEYS.contentTypes);

  const previewItems = (materials || []).filter((m) => m.available).slice(0, 6);

  // Sem materiais publicados não renderiza nada — evita espaço vazio enorme na home
  if (previewItems.length === 0) return null;

  return (
    <section
      ref={ref}
      className="py-12 md:py-20 px-5 sm:px-6 md:px-12 section-border-t section-border-b relative overflow-hidden"
    >
      {/* Espiral decorativa no canto esquerdo */}
      <SpiralAccent
        className="absolute -top-20 -left-32 pointer-events-none hidden md:block"
        size={340}
        opacity={0.12}
      />
      <motion.div
        initial="visible"
        animate="visible"
        variants={stagger}
        className="max-w-[1180px] mx-auto relative"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <SectionLabel label="O que publico" />
            <motion.h2
              variants={fadeUp}
              className="font-serif text-[clamp(2rem,4vw,3rem)] text-text-bright leading-[1.05] mb-4"
            >
              Notas de estudo e <em className="italic text-accent">clínica</em>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[0.95rem] text-text-dim max-w-xl leading-[1.85]"
            >
              Resumos, mapas e ensaios que atravessam minha formação em
              psicologia analítica. Nada substitui o processo clínico — servem
              como companhia de estudo, leitura e aprofundamento.
            </motion.p>
          </div>
          <motion.div variants={fadeUp}>
            <Link
              href="/materiais"
              className="font-sans text-[0.72rem] font-medium tracking-[0.18em] uppercase text-accent hover:text-text-bright transition-colors inline-flex items-center gap-2 link-underline"
            >
              Ver todo o catálogo
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Bento grid */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:auto-rows-[180px] gap-4 md:gap-5"
        >
          {previewItems.map((item, i) => (
            <Link
              key={item.id}
              href={`/materiais#${item.id}`}
              className={`block ${BENTO_SPANS[i] || ''}`}
            >
              <Tile item={item} span="h-full" index={i} categories={categories} contentTypes={contentTypes} />
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
