import { notFound } from 'next/navigation';
import siteContent from '@/data/site-content.json';
import { trilhas as TRILHAS_DEFAULT } from '@/data/trilhas';
import { migrateTrilhaBlocks } from '@/lib/linkResolver';
import EtapaClient from './EtapaClient';

function getList() {
  const stored = siteContent?.data?.angelo_admin_trilhas;
  const raw = Array.isArray(stored) && stored.length > 0 ? stored : TRILHAS_DEFAULT;
  return raw.map(migrateTrilhaBlocks);
}

export function generateStaticParams() {
  const params = [];
  for (const t of getList()) {
    const trilhaSlug = t.slug || t.id;
    for (const s of t.stages || []) {
      params.push({ trilha: trilhaSlug, etapa: s.slug });
    }
  }
  return params;
}

export function generateMetadata({ params }) {
  const list = getList();
  const trilha = list.find((t) => (t.slug || t.id) === params.trilha);
  if (!trilha) return {};
  const etapa = trilha.stages.find((s) => s.slug === params.etapa);
  if (!etapa) return {};
  const cover = etapa.coverImage || trilha.coverImage;
  const og = {
    title: `${etapa.title} · ${trilha.name} · Psiangelo`,
    description: etapa.summary || `${trilha.name} — ${etapa.title}`,
    type: 'article',
  };
  if (cover) {
    og.images = [{ url: cover, alt: etapa.title }];
  }
  return {
    title: `${etapa.title} · ${trilha.name}`,
    description: etapa.summary || `${trilha.name} — ${etapa.title}`,
    openGraph: og,
  };
}

function getPosts() {
  return Array.isArray(siteContent?.data?.angelo_admin_blog) ? siteContent.data.angelo_admin_blog : [];
}
function getCourses() {
  return Array.isArray(siteContent?.data?.angelo_admin_courses) ? siteContent.data.angelo_admin_courses : [];
}

export default function EtapaPage({ params }) {
  const list = getList();
  const trilha = list.find((t) => (t.slug || t.id) === params.trilha);
  if (!trilha) return notFound();
  const idx = trilha.stages.findIndex((s) => s.slug === params.etapa);
  if (idx < 0) return notFound();
  return (
    <EtapaClient
      initialTrilha={trilha}
      initialEtapaIdx={idx}
      initialPosts={getPosts()}
      initialCourses={getCourses()}
    />
  );
}
