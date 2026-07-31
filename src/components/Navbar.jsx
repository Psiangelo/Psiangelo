'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useVisibility } from '@/lib/useVisibility';
import { useSitedata } from '@/lib/useSitedata';
import { getLabels, DEFAULT_LABELS, SITEDATA_KEYS } from '@/lib/sitedata';
import { LogoMarkInline } from '@/components/ui/LogoMark';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  /* /blog/<slug>/ é post; /blog/ e /blog/tag/<tag>/ não são. Só o post desenha
     a própria barra de progresso de leitura. */
  const ehPaginaDePost = (() => {
    const partes = (pathname || '').split('/').filter(Boolean);
    return partes[0] === 'blog' && partes.length === 2 && partes[1] !== 'tag';
  })();

  useEffect(() => {
    // A versão anterior fazia setState em CADA evento de scroll e lia
    // scrollHeight junto, o que força recálculo de layout a cada quadro. Agora:
    // a altura fica em cache (recalculada só no resize), o trabalho acontece
    // dentro de um requestAnimationFrame, e o progresso é arredondado pra
    // inteiro — sem isso o React re-renderizava a barra por evento.
    let raf = 0;
    let total = 0;
    let lastPct = -1;
    let lastScrolled = null;

    const measure = () => {
      total = document.documentElement.scrollHeight - window.innerHeight;
    };

    const apply = () => {
      raf = 0;
      const y = window.scrollY;

      const isScrolled = y > 50;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        setScrolled(isScrolled);
      }

      const pct = total > 0 ? Math.round((y / total) * 100) : 0;
      if (pct !== lastPct) {
        lastPct = pct;
        setScrollProgress(pct / 100);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const { visibility: v } = useVisibility();
  const labels = useSitedata(getLabels, DEFAULT_LABELS, SITEDATA_KEYS.labels);
  const navLabels = labels?.nav || DEFAULT_LABELS.nav;
  // Site é "um blog com um autor": a navegação principal é ensaios, léxico e
  // estudo, com Sobre por último (âncora na home). Psicoterapia/materiais/
  // cursos ficam de fora do menu enquanto ocultos — voltam sozinhos se o
  // admin religar a chave de visibilidade correspondente.
  const allLinks = [
    { href: '/blog',      label: navLabels.blog      || 'Ensaios',   key: 'blog' },
    { href: '/glossario', label: navLabels.glossario || 'Glossário', key: 'glossario' },
    { href: '/estudos',   label: navLabels.estudos   || 'Estudos',   key: 'estudos' },
    { href: '/#sobre',    label: navLabels.about     || 'Sobre',     key: 'about' },
  ];
  const links = allLinks.filter((l) => v[l.key] !== false);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname.startsWith(href);
  };

  return (
    <motion.nav
      data-nav="main"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`fixed top-0 w-full z-[500] flex items-center justify-between transition-all duration-500 ${
        scrolled
          ? // Fundo opaco no celular: backdrop-blur numa barra fixa reprocessa o
            // desfoque conforme a página rola atrás, e isso pesa em mobile.
            'py-3 px-5 sm:px-6 md:px-12 bg-bg border-b border-border-subtle md:bg-bg/[0.92] md:backdrop-blur-xl'
          : 'py-4 sm:py-5 px-5 sm:px-6 md:px-12'
      }`}
    >
      <Link href="/" className="flex items-center group" aria-label="Psiangelo · Home">
        <LogoMarkInline height={28} className="transition-opacity group-hover:opacity-85" />
      </Link>

      <div className="hidden md:flex items-center gap-8 lg:gap-10">
      <ul className="flex items-center gap-8 lg:gap-10">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.href} className="relative">
              <Link
                href={link.href}
                className={`font-sans text-[0.72rem] font-medium uppercase tracking-[0.18em] transition-colors ${
                  active ? 'text-accent' : 'text-text-dim hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute -bottom-1.5 left-0 right-0 h-px bg-accent"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </li>
          );
        })}
      </ul>
      </div>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden flex flex-col gap-1.5 p-2"
        aria-label="Menu"
      >
        <motion.span
          animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          className="block w-5 h-px bg-text-bright"
        />
        <motion.span
          animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
          className="block w-5 h-px bg-text-bright"
        />
        <motion.span
          animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          className="block w-5 h-px bg-text-bright"
        />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-bg border-b border-border-subtle md:hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-sans text-sm transition-colors ${
                    isActive(link.href) ? 'text-accent' : 'text-text-dim hover:text-accent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Na página de um post esta barra fica de fora: o BlogPostView já
          desenha a sua logo abaixo (ReadingProgressBar), e as duas juntas
          apareciam como dois filetes dourados quase colados medindo coisas
          diferentes — esta mede a rolagem da página inteira (que só chega a
          100% depois do rodapé), a de lá mede o corpo do ensaio. Fica a do
          ensaio, que é a que interessa a quem está lendo. */}
      {scrolled && !ehPaginaDePost && (
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-accent/40"
          style={{ width: `${scrollProgress * 100}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.nav>
  );
}
