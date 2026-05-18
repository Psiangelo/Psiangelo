import { notFound } from 'next/navigation';
import siteContent from '@/data/site-content.json';
import { glossario as GLOSSARIO_DEFAULT, CATEGORIES as CATEGORIES_DEFAULT } from '@/data/glossario';
import TermoClient from './TermoClient';

function getList() {
  const list = siteContent?.data?.angelo_admin_glossario;
  return Array.isArray(list) && list.length > 0
    ? list
    : GLOSSARIO_DEFAULT.map((g, i) => ({ ...g, links: [], hidden: false, ordem: i }));
}

function getCategories() {
  const cats = siteContent?.data?.angelo_admin_glossario_categories;
  return Array.isArray(cats) && cats.length > 0
    ? cats
    : Object.entries(CATEGORIES_DEFAULT).map(([slug, info], i) => ({ slug, label: info.label, tone: info.tone, ordem: i }));
}

function getPosts() {
  const posts = siteContent?.data?.angelo_admin_blog;
  return Array.isArray(posts) ? posts : [];
}

function getCourses() {
  const courses = siteContent?.data?.angelo_admin_courses;
  return Array.isArray(courses) ? courses : [];
}

export function generateStaticParams() {
  return getList().map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }) {
  const term = getList().find((t) => t.slug === params.slug);
  if (!term) return {};
  return {
    title: term.term,
    description: term.short,
    openGraph: {
      title: `${term.term} · Glossário junguiano`,
      description: term.short,
      type: 'article',
    },
  };
}

export default function TermoPage({ params }) {
  const list = getList();
  const termo = list.find((t) => t.slug === params.slug);
  if (!termo) return notFound();
  const categories = getCategories();
  return (
    <TermoClient
      initialTermo={termo}
      initialList={list}
      initialCategories={categories}
      initialPosts={getPosts()}
      initialCourses={getCourses()}
    />
  );
}
