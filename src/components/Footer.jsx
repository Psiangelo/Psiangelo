'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import JungQuote from '@/components/JungQuote';
import { LogoMarkFull } from '@/components/ui/LogoMark';
import TrilhaIcon from '@/components/estudos/icons';
import { getSettings, DEFAULT_SETTINGS, SITEDATA_KEYS } from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';
import { useVisibility } from '@/lib/useVisibility';

/**
 * Footer cerimonial: frontispício grego em cima, três colunas (Atendimento,
 * Conteúdo, Contato), separador com glifo, JungQuote rotativa e copyright.
 *
 * - Glow accent radial ambiente no fundo (discreto, sem mexer em layout)
 * - Reduzido por prefers-reduced-motion
 * - WhatsApp/Instagram/Email vêm de settings (admin)
 */
export default function Footer({ showMaterialsCta = false }) {
  const settings = useSitedata(getSettings, DEFAULT_SETTINGS, SITEDATA_KEYS.settings);
  const { visibility: v } = useVisibility();
  const prefersReduced = useReducedMotion();
  const year = new Date().getFullYear();

  const whatsappHref = settings.whatsappNumber
    ? `https://wa.me/${String(settings.whatsappNumber).replace(/\D/g, '')}`
    : null;

  // "Autor" substitui a antiga coluna "Atendimento" — com a psicoterapia
  // oculta, aquela coluna ficava vazia (mostrava "Em breve"). /bio garante
  // que a coluna sempre tenha algo, e a psicoterapia volta sozinha aqui
  // quando o admin religar a visibilidade.
  const autor = [
    v.bio         !== false && { href: '/bio',                     label: 'Perfil' },
    v.psicoterapia !== false && { href: '/psicoterapia-analitica', label: 'Psicoterapia' },
  ].filter(Boolean);

  const conteudo = [
    v.blog       !== false && { href: '/blog',       label: 'Ensaios' },
    v.glossario  !== false && { href: '/glossario',  label: 'Glossário' },
    v.estudos    !== false && { href: '/estudos',    label: 'Estudos' },
    v.materiais  !== false && { href: '/materiais',  label: 'Materiais' },
    v.cursos     !== false && { href: '/cursos',     label: 'Cursos' },
    v.blog       !== false && { href: '/feed.xml',   label: 'RSS' },
  ].filter(Boolean);

  const contato = [
    whatsappHref            && { href: whatsappHref,             label: 'WhatsApp',  external: true },
    settings.instagramLink  && { href: settings.instagramLink,   label: 'Instagram', external: true },
    settings.youtubeLink    && { href: settings.youtubeLink,     label: 'YouTube',   external: true },
    settings.emailAddress   && { href: `mailto:${settings.emailAddress}`, label: 'E-mail' },
  ].filter(Boolean);

  return (
    <footer className="relative overflow-hidden border-t border-border-subtle">
      {/* Glow ambiente */}
      <div
        aria-hidden
        className="absolute pointer-events-none rounded-full blur-3xl"
        style={{
          top: '0%',
          left: '50%',
          transform: 'translate(-50%, -30%)',
          width: 800,
          height: 600,
          background: 'radial-gradient(ellipse, rgba(180,140,80,0.08) 0%, transparent 65%)',
          opacity: prefersReduced ? 0.5 : 1,
        }}
      />

      {/* CTA opcional */}
      {showMaterialsCta && v.materiais !== false && (
        <div className="relative py-16 flex flex-col items-center text-center px-6 border-b border-border-subtle">
          <p className="font-mono text-[0.65rem] text-accent tracking-[0.35em] uppercase mb-4">
            Pronto para estudar?
          </p>
          <h3 className="font-serif text-2xl md:text-3xl text-text-bright mb-6 max-w-2xl">
            Comece agora com materiais construídos na <em className="italic text-accent">prática clínica</em>
          </h3>
          <Link
            href="/materiais"
            className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-bg bg-accent px-8 py-3.5 hover:bg-text-bright transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10"
          >
            Quero os materiais
          </Link>
        </div>
      )}

      {/* Frontispício grego — abertura cerimonial */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center text-center pt-16 md:pt-20 pb-10 px-5"
      >
        <span
          aria-hidden
          className="block w-px h-12 mb-7"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(180,140,80,0.5))' }}
        />
        <p className="font-serif italic text-accent text-3xl md:text-4xl leading-none tracking-wide mb-3">
          γνῶθι σεαυτόν
        </p>
        <p className="font-mono text-[0.6rem] text-text-dim tracking-[0.32em] uppercase">
          Conhece-te a ti mesmo · Delfos
        </p>
      </motion.div>

      {/* Divisor com glifo */}
      <div className="relative flex items-center justify-center px-6 mb-10">
        <div className="flex-1 h-px max-w-[300px]" style={{ background: 'linear-gradient(to right, transparent, rgba(180,140,80,0.3))' }} />
        <span className="mx-4 text-accent/60" aria-hidden>
          <TrilhaIcon name="star" size={14} />
        </span>
        <div className="flex-1 h-px max-w-[300px]" style={{ background: 'linear-gradient(to left, transparent, rgba(180,140,80,0.3))' }} />
      </div>

      {/* Grid principal */}
      <div className="relative max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 md:gap-12">
          {/* Logo + manifesto */}
          <div>
            <div className="max-w-[280px] mb-5">
              <LogoMarkFull showTagline={false} />
            </div>
            <p className="text-[0.88rem] text-text-dim max-w-xs leading-[1.85]">
              Um estudo público e uma escrita contínua sobre a obra de Carl
              Gustav Jung: ensaios, glossário e trilhas de leitura.
            </p>
            {settings.whatsappNumber && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.22em] uppercase text-accent hover:text-text-bright transition-colors"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{ animationDuration: prefersReduced ? '0s' : '2.5s' }} />
                Disponível pelo WhatsApp
              </a>
            )}
          </div>

          <FooterColumn title="Autor"    items={autor} />
          <FooterColumn title="Conteúdo" items={conteudo} />
          <FooterColumn title="Contato"  items={contato} />
        </div>
      </div>

      {/* JungQuote */}
      <div className="relative max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12 pb-10">
        <div className="pt-10 border-t border-border-subtle/40">
          <JungQuote variant="footer" />
        </div>
      </div>

      {/* Disclaimer estagiário */}
      <div className="relative max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12 pb-8">
        <p
          className="font-serif italic text-[0.78rem] text-text-dim/60 text-center max-w-2xl mx-auto leading-relaxed"
        >
          Atendo como estagiário em psicologia, sob supervisão clínica.
          Quando concluir a graduação e obtiver registro no CRP, esta indicação será atualizada.
        </p>
      </div>

      {/* Copyright + tagline */}
      <div className="relative border-t border-border-subtle/40">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[0.7rem] text-text-dim/50 flex items-center gap-2">
            <span aria-hidden className="text-accent/40">
              <TrilhaIcon name="compass" size={11} />
            </span>
            © {year} Psiangelo · Todos os direitos reservados
          </p>
          <p className="font-mono text-[0.6rem] text-text-dim/40 tracking-[0.28em] uppercase">
            Nosce te ipsum
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────── Coluna do footer ────────────────── */
function FooterColumn({ title, items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div>
        <h4 className="font-mono text-[0.55rem] font-semibold tracking-[0.28em] uppercase text-accent mb-5">
          {title}
        </h4>
        <p className="text-[0.85rem] text-text-dim/40 italic">Em breve</p>
      </div>
    );
  }
  return (
    <div>
      <h4 className="font-mono text-[0.55rem] font-semibold tracking-[0.28em] uppercase text-accent mb-5 flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block w-4 h-px"
          style={{ background: 'rgba(180,140,80,0.4)' }}
        />
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5" role="list">
        {items.map((item) => {
          const isExternal = item.external || item.href?.startsWith('http');
          return (
            <li key={item.href + item.label}>
              {isExternal ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.88rem] text-text-dim hover:text-accent transition-colors inline-flex items-center gap-1.5 group"
                >
                  {item.label}
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all"
                    aria-hidden
                  >
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="text-[0.88rem] text-text-dim hover:text-accent transition-colors inline-block"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
