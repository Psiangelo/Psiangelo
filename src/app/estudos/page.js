import siteContent from '@/data/site-content.json';
import EstudosClient from './EstudosClient';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

export const metadata = {
  title: 'Estudos · Sala de estudos em psicologia analítica',
  description:
    'Curadoria de trilhas, verbetes, materiais e ensaios para quem quer estudar psicologia analítica junguiana — por onde começar, o que ler, em que ordem.',
  alternates: { canonical: `${SITE_URL}/estudos/` },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/estudos/`,
    siteName: 'Psiangelo',
    title: 'Estudos · Psiangelo',
    description: 'Curadoria de trilhas, verbetes, materiais e ensaios para estudar psicologia analítica.',
  },
};

export default function EstudosPage() {
  const posts = Array.isArray(siteContent?.data?.angelo_admin_blog) ? siteContent.data.angelo_admin_blog : [];
  const courses = Array.isArray(siteContent?.data?.angelo_admin_courses) ? siteContent.data.angelo_admin_courses : [];
  return <EstudosClient initialPosts={posts} initialCourses={courses} />;
}
