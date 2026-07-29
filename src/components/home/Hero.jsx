'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CursorGlow from '@/components/ui/CursorGlow';
import AmbientVideo from '@/components/ui/AmbientVideo';
import Button, { ArrowIcon, WhatsAppIcon } from '@/components/ui/Button';
import { getHomepage, getSettings, DEFAULT_HOMEPAGE, DEFAULT_SETTINGS, SITEDATA_KEYS } from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';
import { useVisibility } from '@/lib/useVisibility';

export default function Hero() {
  const content = useSitedata(
    () => getHomepage().hero,
    DEFAULT_HOMEPAGE.hero,
    SITEDATA_KEYS.homepage,
  );
  const settings = useSitedata(getSettings, DEFAULT_SETTINGS, SITEDATA_KEYS.settings);
  const { visibility: v } = useVisibility();

  const whatsappNumber = (settings.whatsappNumber || '').replace(/\D/g, '');
  const whatsappMsg = encodeURIComponent(
    settings.whatsappMessage ||
      'Oi Gabriel, vim pelo seu site e gostaria de marcar uma primeira conversa online.',
  );
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`
    : '#contato';

  // Cada letra sobe por trás da máscara de overflow do seu grupo
  const letterAnim = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.35 + i * 0.04,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const prefixLetters = (content.titlePrefix || 'Psi').split('');
  const emphasisLetters = (content.titleEmphasis || 'angelo').split('');

  return (
    <section className="relative min-h-[100svh] flex items-center px-5 sm:px-6 md:px-12 overflow-hidden pt-28 md:pt-24 pb-16 md:pb-24">
      {/* Footage de fundo — tinta preta se dissolvendo na água (solutio).
          Fica à direita do quadro; a esquerda é quase preta, que é onde o
          texto cai. eager: é a única faixa acima da dobra. */}
      <AmbientVideo
        src="/video/hero.mp4"
        poster="/video/hero.jpg"
        opacity={0.85}
        eager
        objectPosition="70% center"
      />

      {/* Scrim — segura a legibilidade do texto à esquerda e costura o vídeo
          com o fundo da página embaixo. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, #0E0C0A 0%, rgba(14,12,10,0.9) 28%, rgba(14,12,10,0.28) 56%, rgba(14,12,10,0) 100%), linear-gradient(to top, #0E0C0A 2%, rgba(14,12,10,0) 32%)',
        }}
      />

      <CursorGlow contained size={460} intensity={0.09} />

      {/* Malha fina — mantém a textura editorial por cima do vídeo */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(180,140,80,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(180,140,80,0.3) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />

      {/* Sem retrato aqui: ele vive na faixa "quem escreve", e ter a mesma foto
          duas vezes na mesma rolagem não somava. O lado direito fica para a
          tinta, que é onde o clipe tem movimento. */}
      <div className="relative z-10 max-w-[1180px] w-full mx-auto">
        <div className="relative pl-0 md:pl-10 max-w-[640px]">
          <span className="vertical-spine hidden md:block left-0" aria-hidden />

          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-mono text-[0.65rem] text-accent tracking-[0.32em] uppercase mb-7 flex items-center gap-3"
          >
            <span className="block w-8 h-px bg-accent/40" />
            {content.eyebrow}
          </motion.p>

          <motion.svg
            initial={{ opacity: 0, y: -8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            width="46"
            height="42"
            viewBox="0 0 46 42"
            className="mb-4 text-accent"
            aria-hidden
          >
            <polygon points="23,4 42,38 4,38" fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.2" strokeLinejoin="round" />
            <circle cx="23" cy="28" r="3" fill="currentColor" />
          </motion.svg>

          <h1 className="font-serif font-normal text-text-bright leading-[1.05] mb-5 tracking-[-0.02em]">
            <span className="sr-only">
              {(content.titlePrefix || 'Psi') + (content.titleEmphasis || 'angelo')}
            </span>
            <span aria-hidden className="flex items-baseline flex-wrap text-[clamp(3.2rem,9vw,6.8rem)]">
              <span className="inline-flex overflow-hidden align-baseline">
                {prefixLetters.map((letter, i) => (
                  <motion.span
                    key={`p-${i}`}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={letterAnim}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
              <span className="inline-flex overflow-hidden align-baseline italic text-accent-bright">
                {emphasisLetters.map((letter, i) => (
                  <motion.span
                    key={`e-${i}`}
                    custom={i + prefixLetters.length}
                    initial="hidden"
                    animate="visible"
                    variants={letterAnim}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </span>
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-full max-w-[420px] bg-gradient-to-r from-accent/60 via-accent/30 to-transparent origin-left mb-7"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="font-serif italic text-accent-soft text-lg md:text-xl mb-7 tracking-wide"
          >
            {content.tagline}
            <span className="ml-3 font-mono not-italic text-[0.65rem] text-text-dim/70 tracking-[0.25em] uppercase">
              · γνῶθι σεαυτόν
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            className="text-[0.98rem] text-text max-w-md leading-[1.85] mb-9"
          >
            {content.lead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="btn-row"
          >
            <Button href={whatsappUrl} variant="solid" iconLeft={<WhatsAppIcon />}>
              Marcar conversa
            </Button>
            <Button href="/psicoterapia-analitica" variant="outline">
              Como atendo
            </Button>
            {v.blog !== false && (
              <Link href="/blog" className="link-arrow">
                Ler os ensaios
                <ArrowIcon />
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-mono text-[0.55rem] text-text-dim/50 tracking-[0.3em] uppercase">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-accent/50 via-accent/20 to-transparent"
        />
      </motion.div>
    </section>
  );
}
