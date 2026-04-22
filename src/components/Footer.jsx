'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/constants';
import JungQuote from '@/components/JungQuote';
import { LogoMarkFull } from '@/components/ui/LogoMark';
import { getSettings, DEFAULT_SETTINGS, SITEDATA_KEYS } from '@/lib/sitedata';
import { useSitedata } from '@/lib/useSitedata';

export default function Footer({ showMaterialsCta = false }) {
  const settings = useSitedata(getSettings, DEFAULT_SETTINGS, SITEDATA_KEYS.settings);
  const socials = [
    settings.instagramLink && { label: 'Instagram', href: settings.instagramLink },
    settings.youtubeLink   && { label: 'YouTube',   href: settings.youtubeLink },
    settings.emailAddress  && { label: 'E-mail',    href: `mailto:${settings.emailAddress}` },
  ].filter(Boolean);

  return (
    <footer className="border-t border-border-subtle">
      {/* Optional CTA band */}
      {showMaterialsCta && (
        <div className="py-16 flex flex-col items-center text-center px-6 border-b border-border-subtle">
          <p className="font-mono text-[0.65rem] text-accent tracking-[0.35em] uppercase mb-4">
            Pronto para estudar?
          </p>
          <h3 className="font-serif text-2xl md:text-3xl text-text-bright mb-6">
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

      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12 pt-12 md:pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-8 md:gap-12">
          <div>
            <div className="max-w-[280px] mb-4">
              <LogoMarkFull showTagline={false} />
            </div>
            <p className="text-sm text-text-dim max-w-xs leading-7">
              Futuro psicólogo clínico de abordagem junguiana. Materiais de estudo,
              formação e conteúdo para quem quer compreender a psiquê com profundidade.
            </p>
          </div>
          <div>
            <h4 className="font-sans text-[0.6rem] font-semibold tracking-[0.25em] uppercase text-accent mb-5">
              Navegação
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-text-dim hover:text-text-bright transition-colors">Home</Link>
              <Link href="/#sobre" className="text-sm text-text-dim hover:text-text-bright transition-colors">Sobre</Link>
              <Link href="/materiais" className="text-sm text-text-dim hover:text-text-bright transition-colors">Materiais</Link>
              <Link href="/glossario" className="text-sm text-text-dim hover:text-text-bright transition-colors">Glossário</Link>
              <Link href="/feed.xml" className="text-sm text-text-dim hover:text-text-bright transition-colors">RSS</Link>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-[0.6rem] font-semibold tracking-[0.25em] uppercase text-accent mb-5">
              Redes
            </h4>
            <div className="flex flex-col gap-2">
              {socials.length > 0 ? (
                socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={s.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="text-sm text-text-dim hover:text-text-bright transition-colors"
                  >
                    {s.label}
                  </a>
                ))
              ) : (
                <span className="text-sm text-text-dim/40 italic">Em breve</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-border-subtle flex flex-col gap-8">
          {/* Citação Jung rotativa */}
          <JungQuote variant="footer" />

          {/* Tagline grega promovida — frontispício do rodapé */}
          <div className="flex flex-col items-center gap-2 text-center">
            <span
              className="font-serif italic text-2xl md:text-3xl text-accent leading-none tracking-wide"
              style={{ opacity: 0.6 }}
            >
              γνῶθι σεαυτόν
            </span>
            <span className="font-mono text-[0.6rem] text-text-dim tracking-[0.3em] uppercase opacity-60">
              conhece-te a ti mesmo · Delfos
            </span>
          </div>
          <div className="pt-6 border-t border-border-subtle/60 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="font-sans text-[0.7rem] text-text-dim opacity-50">
              © {new Date().getFullYear()} Psiangelo
            </p>
            <p className="font-mono text-[0.6rem] text-text-dim/60 tracking-[0.25em] uppercase">
              Nosce te ipsum
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
