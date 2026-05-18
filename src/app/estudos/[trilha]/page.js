import { notFound } from 'next/navigation';
import siteContent from '@/data/site-content.json';
import { trilhas as TRILHAS_DEFAULT } from '@/data/trilhas';
import { migrateTrilhaBlocks } from '@/lib/linkResolver';
import TrilhaDetailClient from './TrilhaDetailClient';

function getList() {
  const stored = siteContent?.data?.angelo_admin_trilhas;
  return Array.isArray(stored) && stored.length > 0 ? stored : TRILHAS_DEFAULT;
}

function bySlug(slug) {
  return getList().find((t) => (t.slug || t.id) === slug);
}

export function generateStaticParams() {
  return getList().map((t) => ({ trilha: t.slug || t.id }));
}

export function generateMetadata({ params }) {
  const t = bySlug(params.trilha);
  if (!t) return {};
  return {
    title: `${t.name} · Estudos`,
    description: t.subtitle || `Trilha de estudo: ${t.name}`,
    openGraph: { title: `${t.name} · Estudos · Psiangelo`, description: t.subtitle, type: 'article' },
  };
}

export default function TrilhaDetailPage({ params }) {
  const raw = bySlug(params.trilha);
  if (!raw) return notFound();
  const trilha = migrateTrilhaBlocks(raw);
  return <TrilhaDetailClient initialTrilha={trilha} />;
}
