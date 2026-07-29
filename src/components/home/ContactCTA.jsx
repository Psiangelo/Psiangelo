'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger } from '@/lib/constants';
import { QuaternioSigil } from '@/components/illustrations';
import AmbientVideo from '@/components/ui/AmbientVideo';
import { WhatsAppIcon } from '@/components/ui/Button';
import { useAmbientMotion } from '@/lib/useAmbientMotion';
import { getHomepage, DEFAULT_HOMEPAGE, SITEDATA_KEYS } from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';
import { useSectionLabel } from '@/lib/useLabels';

const SECONDARY_CONTACTS = [
  {
    label: 'Instagram',
    value: '@psiangelo',
    href: 'https://instagram.com/psiangelo',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'E-mail',
    value: 'contato@angelopsicologia.com',
    href: 'mailto:contato@angelopsicologia.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13 2 4" />
      </svg>
    ),
  },
];

export default function ContactCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const ambient = useAmbientMotion();
  const homepage = useSitedata(getHomepage, DEFAULT_HOMEPAGE, SITEDATA_KEYS.homepage);
  const c = homepage.contact || DEFAULT_HOMEPAGE.contact;

  const whatsappUrl = `https://wa.me/${(c.whatsappNumber || '').replace(/\D/g, '')}`;
  const secondary = [
    c.instagramValue && c.instagramUrl && {
      label: c.instagramLabel || 'Instagram',
      value: c.instagramValue,
      href: c.instagramUrl,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    c.emailValue && {
      label: c.emailLabel || 'E-mail',
      value: c.emailValue,
      href: `mailto:${c.emailValue}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 4L12 13 2 4" />
        </svg>
      ),
    },
  ].filter(Boolean);

  return (
    <section
      id="contato"
      className="relative py-12 md:py-20 px-5 sm:px-6 md:px-12 section-border-t overflow-hidden"
      ref={ref}
    >
      {/* Céu real no convite final — substitui o campo estelar em SVG, que
          custava caro em nós e nunca chegou perto de parecer um céu. */}
      <AmbientVideo
        src="/video/contato.mp4"
        srcMobile="/video/contato-m.mp4"
        poster="/video/contato.jpg"
        opacity={0.5}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(80% 90% at 50% 45%, rgba(14,12,10,0.62) 0%, rgba(14,12,10,0.9) 72%)',
        }}
      />

      <div className="ambient-glow w-[700px] h-[700px] -top-40 left-1/2 -translate-x-1/2 opacity-60" />

      <motion.div
        initial="visible"
        animate="visible"
        variants={stagger}
        className="relative max-w-[1100px] mx-auto"
      >
        <div className="text-center mb-14">
          <div className="flex justify-center mb-4">
            <QuaternioSigil size={56} opacity={0.4} animated={true} />
          </div>
          <SectionLabel label={c.sectionLabel || 'Contato'} />
          <motion.h2
            variants={fadeUp}
            className="font-serif italic text-[clamp(2rem,4vw,3rem)] text-text-bright leading-[1.1] mt-3 mb-4"
          >
            {useSectionLabel('contato', c.title)}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-[0.95rem] text-text leading-[1.85] max-w-[540px] mx-auto"
          >
            {c.lead}
          </motion.p>
        </div>

        {/* Hero de contato — WhatsApp 60% + QR + secundários 40% */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8"
        >
          {/* Bloco WhatsApp primário */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-bg-card border border-accent/30 hover:border-accent/60 transition-colors p-8 md:p-10 flex flex-col md:flex-row items-center gap-8"
          >
            {/* Coluna texto + botão */}
            <div className="flex-1 text-center md:text-left">
              <p className="meta-caps-accent mb-3">{c.primaryLabel}</p>
              <h3 className="font-serif text-2xl md:text-3xl text-text-bright leading-tight mb-3">
                {c.primaryHeadingPrefix}{' '}
                <em className="italic text-accent">{c.primaryHeadingEmphasis}</em>
              </h3>
              <p className="text-[0.92rem] text-text-dim leading-relaxed mb-7 max-w-md mx-auto md:mx-0">
                {c.primaryText}
              </p>
              <span className="btn btn--solid btn--in-card pointer-events-none">
                <WhatsAppIcon />
                <span>{c.primaryButton}</span>
              </span>
            </div>

            {/* Selo — ocupava um QR code que era decorativo (padrão simulado,
                não levava a lugar nenhum quando escaneado). Sem legenda de
                prazo: não cabe ao site prometer tempo de resposta. */}
            <div className="flex items-center justify-center flex-shrink-0">
              <QuaternioSigil size={132} opacity={0.5} animated={ambient} />
            </div>
          </a>

          {/* Coluna secundária — Instagram + Email empilhados */}
          <div className="flex flex-col gap-4">
            {secondary.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-5 bg-bg-card border border-border-subtle p-6 hover:border-accent/40 transition-colors flex-1"
              >
                <span className="w-12 h-12 flex items-center justify-center border border-border-subtle text-accent opacity-70 group-hover:opacity-100 group-hover:border-accent/40 transition-all">
                  {c.icon}
                </span>
                <div className="flex flex-col flex-1">
                  <span className="font-mono text-[0.58rem] font-medium text-text-dim tracking-[0.22em] uppercase mb-1">
                    {c.label}
                  </span>
                  <span className="font-serif text-[0.95rem] text-text-bright group-hover:text-accent transition-colors leading-tight">
                    {c.value}
                  </span>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-text-dim group-hover:text-accent group-hover:translate-x-1 transition-all"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
