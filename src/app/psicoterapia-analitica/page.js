import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TherapyHeroSection from '@/components/therapy/TherapyHeroSection';
import TherapyGate from '@/components/therapy/TherapyGate';
import TherapyContent from '@/components/therapy/TherapyContent';
import AudienceCards from '@/components/therapy/AudienceCards';
import TherapySchema from '@/components/therapy/TherapySchema';

// FAQ rica para JSON-LD (também alimenta a renderização visual via DEFAULT_THERAPY)
const SEO_FAQ = [
  {
    q: 'O que é psicoterapia analítica?',
    a: 'Psicoterapia analítica — também conhecida como psicologia analítica ou abordagem junguiana — é a prática clínica desenvolvida a partir do trabalho de Carl Gustav Jung. Trabalha com símbolos, sonhos, complexos e o processo de individuação, que é o caminho de tornar-se quem você verdadeiramente é. Difere da psicanálise clássica por valorizar o futuro tanto quanto o passado, e por considerar dimensões simbólicas e arquetípicas da experiência humana.',
  },
  {
    q: 'Você atende online em todo o Brasil?',
    a: 'Sim. Todo o atendimento é online, por videochamada — basta uma conexão estável e um lugar tranquilo. Atendo pessoas em qualquer estado do Brasil e brasileiros vivendo no exterior, em português.',
  },
  {
    q: 'Para quais públicos você atende?',
    a: 'Adolescentes a partir de 14 anos (com consentimento dos responsáveis), adultos e idosos. Cada faixa etária tem suas particularidades clínicas e o trabalho é ajustado a quem chega.',
  },
  {
    q: 'Atendimento online funciona tão bem quanto presencial?',
    a: 'Sim. O vínculo clínico se estabelece pela palavra e pela continuidade — o essencial é a presença e o cuidado, não o espaço físico. A literatura clínica recente é consistente em demonstrar a eficácia da psicoterapia online para a maioria das demandas.',
  },
  {
    q: 'Quanto tempo dura um processo de psicoterapia analítica?',
    a: 'Depende do momento e do que aparece no trabalho. Pode ser meses, pode ser anos. O tempo é acompanhado, não prescrito — não há promessa de prazo.',
  },
  {
    q: 'Como é a primeira conversa?',
    a: 'É uma conversa curta, sem custo e sem compromisso. Serve para você me conhecer, me contar o que traz e avaliarmos juntos se faz sentido seguir. Marcamos pelo WhatsApp ou pelo formulário do site.',
  },
  {
    q: 'Quais demandas você atende?',
    a: 'Ansiedade, questões de sentido, relacionamentos, sonhos recorrentes, crises de transição (adolescência, meia-idade, aposentadoria), luto, busca de autoconhecimento, integração da sombra. Na primeira conversa avaliamos juntos se a abordagem é pertinente para o seu momento.',
  },
  {
    q: 'Como funciona o sigilo?',
    a: 'Absoluto, conforme o Código de Ética da profissão. Nada do que você trouxer sai daqui. No atendimento de adolescente, o sigilo também é resguardado — converso com a família apenas o necessário e sempre com transparência prévia.',
  },
  {
    q: 'Vocês fazem análise de sonhos?',
    a: 'Sim, quando faz sentido. A análise de sonhos é uma das ferramentas centrais da psicologia analítica — não como decifração de manuais, mas como escuta cuidadosa do que o inconsciente está dizendo na sua linguagem própria.',
  },
];

export const metadata = {
  title: 'Psicoterapia Analítica Online · Psicólogo Junguiano · Adolescentes, Adultos e Idosos',
  description:
    'Psicoterapia analítica online de abordagem junguiana, para todo o Brasil. Atendimento de adolescentes, adultos e idosos. Marque uma conversa inicial sem compromisso.',
  keywords: [
    'psicoterapia analítica online',
    'psicólogo junguiano online',
    'terapia online junguiana',
    'psicologia analítica',
    'análise junguiana online',
    'análise de sonhos online',
    'psicólogo para adolescente online',
    'psicólogo para idoso online',
    'crise de meia idade psicólogo',
    'individuação',
  ],
  alternates: { canonical: '/psicoterapia-analitica' },
  openGraph: {
    title: 'Psicoterapia Analítica Online · Psiangelo',
    description:
      'Atendimento clínico em abordagem junguiana, 100% online, para adolescentes, adultos e idosos em todo o Brasil.',
    type: 'website',
    url: '/psicoterapia-analitica',
  },
};

export default function PsicoterapiaPage() {
  return (
    <TherapyGate>
      <TherapySchema
        path="/psicoterapia-analitica"
        title="Psicoterapia Analítica Online"
        serviceName="Psicoterapia analítica online — abordagem junguiana"
        description="Atendimento clínico em psicoterapia analítica de abordagem junguiana, 100% online, para adolescentes, adultos e idosos em todo o Brasil."
        faq={SEO_FAQ}
      />
      <Navbar />
      <main>
        <TherapyHeroSection />
        <SeoIntro />
        <AudienceCards heading="Para quem atendo" />
        <TemasClinicosBridge />
        <TherapyContent />
      </main>
      <Footer />
    </TherapyGate>
  );
}

// Ponte enxuta entre AudienceCards (segmentação por idade) e TherapyContent
// (copy estendido). Leva quem quer saber "e meu caso específico?" pra /atendo/.
function TemasClinicosBridge() {
  return (
    <section className="relative py-12 md:py-16 px-5 sm:px-6 md:px-12 section-border-t">
      <div className="max-w-[820px] mx-auto text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            Temas clínicos
          </p>
          <span className="block w-10 h-px bg-accent/50" />
        </div>
        <h2 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] text-text-bright leading-[1.2] mb-5 tracking-[-0.01em]">
          E a sua <em className="italic text-accent">queixa específica?</em>
        </h2>
        <p className="font-serif text-[1rem] text-text leading-[1.85] mb-7 max-w-xl mx-auto">
          Ansiedade, luto, crise de meia-idade, sonhos recorrentes, conflitos
          familiares, busca de sentido. Reuni uma lista não-exaustiva dos
          temas mais frequentes na clínica analítica — pra você reconhecer
          se o que vive pode encontrar escuta aqui.
        </p>
        <Link
          href="/atendo/"
          className="inline-flex items-center gap-3 px-7 py-3.5 font-sans text-[0.72rem] font-medium tracking-[0.18em] uppercase text-text border border-border-hover hover:border-accent hover:text-accent transition-all focus-visible:outline-2 focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          Ver todos os temas
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

/**
 * Bloco SEO server-rendered — copy long-form com keywords naturais.
 * Renderizado antes do TherapyContent (que é client-side com animações).
 * Sem isso, o Googlebot recebe HTML pobre porque a maior parte do conteúdo
 * vem de componentes 'use client' com useSitedata().
 */
function SeoIntro() {
  return (
    <section className="relative py-12 md:py-20 px-5 sm:px-6 md:px-12 section-border-t">
      <div className="relative max-w-[820px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            O que é
          </p>
        </div>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] text-text-bright leading-[1.15] mb-6 tracking-[-0.01em]">
          Uma escuta junguiana <em className="italic text-accent">para a sua vida.</em>
        </h2>
        <div className="prose-editorial space-y-5 font-serif text-[1.05rem] text-text leading-[1.9]">
          <p>
            <span className="font-serif text-accent text-[1.1em]">A</span>{' '}
            <strong className="text-text-bright font-normal">psicoterapia analítica</strong>{' '}
            — também chamada de psicologia analítica ou abordagem junguiana —
            é a prática clínica desenvolvida a partir do trabalho de Carl Gustav
            Jung. Trabalha com a vida simbólica: sonhos, imagens, complexos e o
            que Jung chamou de <em className="italic">individuação</em> — o
            caminho singular de tornar-se quem você é.
          </p>
          <p>
            Diferente de abordagens que partem de um modelo pronto sobre o
            psiquismo, a clínica analítica se constrói no encontro. Não há
            formato fixo, não há prazo prescrito, não há fórmula. O que se
            segue é único para cada vida que chega — e isso vale para um(a)
            adolescente em formação, para um(a) adulto(a) em transição ou para
            um(a) idoso(a) na segunda metade da existência.
          </p>
          <p>
            O atendimento é <strong className="text-text-bright font-normal">100%
            online</strong>, por videochamada, para qualquer cidade do Brasil
            (e para brasileiros vivendo no exterior). A escolha do online não
            é apenas operacional: amplia o acesso à clínica junguiana — ainda
            rara fora dos grandes centros — para quem mora longe de um(a)
            terapeuta dessa abordagem.
          </p>
        </div>
      </div>
    </section>
  );
}
