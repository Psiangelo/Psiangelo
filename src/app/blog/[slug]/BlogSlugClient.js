'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BASE_PATH } from '@/lib/basepath';

/**
 * Cliente da rota /blog/[slug] — redireciona humanos pro SPA /blog?post=slug
 * e renderiza um fallback amigável enquanto o browser navega.
 *
 * O ganho dessa rota é puramente metadata: scrapers de redes sociais
 * pegam o <head> antes do redirect.
 *
 * IMPORTANTE: usa window.location.replace em vez de router.replace. O
 * Next.js App Router prepend basePath automaticamente — se a gente
 * passasse BASE_PATH manualmente, viraria /Psiangelo/Psiangelo/blog
 * e quebrava em 404 no mobile.
 */
export default function BlogSlugClient({ slug }) {
  const target = `${BASE_PATH}/blog/?post=${encodeURIComponent(slug || '')}`;

  useEffect(() => {
    if (!slug) return;
    // replace: não empilha no histórico (voltar não volta pra rota /slug/)
    window.location.replace(target);
  }, [slug, target]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-accent mb-4">
            abrindo publicação
          </p>
          <p className="font-serif italic text-text-dim text-base">
            Se não redirecionar automaticamente,{' '}
            <a
              href={target}
              className="text-accent underline underline-offset-4 hover:text-text-bright transition-colors"
            >
              clique aqui
            </a>
            .
          </p>
        </div>
      </main>
      <Footer showMaterialsCta={false} />
    </>
  );
}
