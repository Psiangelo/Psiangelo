'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useVisibility } from '@/lib/useVisibility';
import { LogoMarkInline } from '@/components/ui/LogoMark';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { visibility: v } = useVisibility();
  const allLinks = [
    { href: '/', label: 'Home', key: null },
    { href: '/psicoterapia-analitica', label: 'Psicoterapia', key: 'psicoterapia' },
    { href: '/blog', label: 'Blog', key: 'blog' },
    { href: '/estudos', label: 'Estudos', key: 'estudos' },
    { href: '/materiais', label: 'Materiais', key: 'materiais' },
    { href: '/cursos', label: 'Cursos', key: 'cursos' },
  ];
  const links = allLinks.filter((l) => l.key == null || v[l.key]);

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
          ? 'py-3 px-5 sm:px-6 md:px-12 bg-bg/[0.92] backdrop-blur-xl border-b border-border-subtle'
          : 'py-4 sm:py-5 px-5 sm:px-6 md:px-12'
      }`}
    >
      <Link href="/" className="flex items-center group" aria-label="Psiangelo · Home">
        <LogoMarkInline height={28} className="transition-opacity group-hover:opacity-85" />
      </Link>

      <ul className="hidden md:flex items-center gap-10">
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
            className="absolute top-full left-0 w-full bg-bg/95 backdrop-blur-xl border-b border-border-subtle md:hidden"
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

      {scrolled && (
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
