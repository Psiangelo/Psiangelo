import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import TherapyGate from '@/components/therapy/TherapyGate';
import TherapySchema from '@/components/therapy/TherapySchema';

const FAQ = [
  {
    q: 'Como sei se a abordagem junguiana é pra mim?',
    a: 'A psicologia analítica costuma ressoar com pessoas que valorizam sentido, que tomam a própria vida interior a sério, que se interessam por sonhos, símbolos, mitologia, espiritualidade ou questões existenciais. Mas não é exclusivo: também atendo demandas mais cotidianas — ansiedade, relacionamentos, transições — com o mesmo cuidado. A primeira conversa serve para a gente avaliar juntos.',
  },
  {
    q: 'Vocês trabalham com sonhos?',
    a: 'Sim. A análise de sonhos é uma das ferramentas centrais da clínica analítica — não como decifração de manuais, mas como escuta cuidadosa do que o inconsciente está dizendo na sua linguagem própria. Quem tem sonhos recorrentes ou marcantes encontra aqui um espaço onde isso pode ser pensado.',
  },
  {
    q: 'Atendimento online funciona pra terapia profunda?',
    a: 'Sim. O vínculo clínico se faz pela palavra, pela continuidade e pela presença — o espaço físico não é o que sustenta o trabalho. A literatura clínica recente é consistente em demonstrar que a psicoterapia online tem eficácia comparável à presencial para a maioria das demandas adultas, inclusive processos longos de análise.',
  },
  {
    q: 'Quanto tempo dura um processo de análise?',
    a: 'Não há prazo prescrito. Pode ser meses ou anos. A psicologia analítica é uma clínica de longo prazo na maior parte dos casos — o trabalho com símbolos, individuação e integração da sombra leva tempo. Mas o tempo é seu: você decide quando, e até onde, faz sentido seguir.',
  },
  {
    q: 'Estou em crise de meia-idade. A abordagem junguiana ajuda?',
    a: 'Particularmente. Jung descreveu a passagem da primeira para a segunda metade da vida como uma das mais importantes transições psíquicas — o momento em que aquilo que sustentou a juventude (carreira, papéis, identidades) deixa de bastar e algo novo precisa ser ouvido. Esse é um dos territórios mais férteis para o trabalho analítico.',
  },
  {
    q: 'E se eu nunca fiz terapia antes?',
    a: 'A primeira conversa serve exatamente pra isso — você me conta o que te trouxe, eu explico como funciona, esclareço dúvidas. Não há necessidade de "saber falar" ou "estar pronto". O começo é começar.',
  },
  {
    q: 'Que tipo de demanda você atende?',
    a: 'Ansiedade, depressão, luto, crises de sentido, dificuldades nos relacionamentos, conflitos familiares, sonhos recorrentes, dúvidas existenciais, transições de carreira, autoconhecimento, integração da sombra. Avalio na primeira conversa se a abordagem é pertinente para o seu momento.',
  },
  {
    q: 'Atende brasileiros que vivem no exterior?',
    a: 'Sim, com frequência. Brasileiros vivendo fora encontram dificuldade de fazer terapia em português com escuta que entenda o contexto cultural — atendo várias pessoas em Portugal, Estados Unidos, Reino Unido, Europa em geral. Sessões em pt-BR, com horários flexíveis para fuso.',
  },
  {
    q: 'Como funciona o sigilo?',
    a: 'Absoluto, conforme o Código de Ética da profissão. Nada do que você trouxer sai daqui. Sessões realizadas em plataforma criptografada, sem gravação, sem compartilhamento.',
  },
];

export const metadata = {
  title: 'Psicoterapia Analítica Online para Adultos · Junguiana',
  description:
    'Psicoterapia analítica online para adultos em todo o Brasil — abordagem junguiana. Crise de sentido, sonhos, relações, transições. Marque uma primeira conversa.',
  keywords: [
    'psicoterapia analítica online',
    'psicólogo junguiano online',
    'terapia online junguiana',
    'análise junguiana',
    'análise de sonhos online',
    'psicólogo para crise de meia idade',
    'psicólogo para autoconhecimento',
    'psicoterapia para adultos online',
    'psicólogo brasileiro no exterior',
  ],
  alternates: { canonical: '/psicoterapia-analitica/adultos' },
  openGraph: {
    title: 'Psicoterapia Analítica Online para Adultos · Psiangelo',
    description:
      'Análise junguiana online para adultos. Crise de sentido, sonhos, relações, transições — escuta sem fórmulas prontas, em todo o Brasil.',
    type: 'website',
    url: '/psicoterapia-analitica/adultos',
  },
};

export default function PsicoterapiaAdultosPage() {
  return (
    <TherapyGate>
      <TherapySchema
        path="/psicoterapia-analitica/adultos"
        title="Psicoterapia Analítica para Adultos"
        serviceName="Psicoterapia analítica online para adultos"
        description="Atendimento clínico de adultos em psicoterapia analítica de abordagem junguiana, online, em todo o Brasil. Crise de sentido, sonhos, relações, transições, autoconhecimento."
        audience={{ name: 'Adultos', suggestedMinAge: 18, suggestedMaxAge: 60 }}
        faq={FAQ}
        breadcrumb={[
          { name: 'Psicoterapia Analítica', path: '/psicoterapia-analitica' },
        ]}
      />
      <Navbar />
      <main>
        <PageHero
          breadcrumbs={[
            { name: 'Psicoterapia Analítica', href: '/psicoterapia-analitica/' },
            { name: 'Adultos' },
          ]}
          eyebrow="Adultos · 18 a 60 · 100% online"
          title="Uma escuta sem"
          emphasis="fórmulas prontas"
          lead="Psicoterapia analítica online para adultos em todo o Brasil. Análise junguiana para crise de sentido, sonhos recorrentes, transições de vida, busca de autoconhecimento — uma clínica que se constrói no encontro, não num modelo pronto."
        />

        <ContentBlock />
        <DemandasBlock />
        <FAQSection />
        <CtaBlock />
      </main>
      <Footer />
    </TherapyGate>
  );
}

function ContentBlock() {
  return (
    <section className="relative py-12 md:py-20 px-5 sm:px-6 md:px-12 section-border-t">
      <div className="relative max-w-[820px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            A clínica analítica
          </p>
        </div>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] text-text-bright leading-[1.15] mb-6 tracking-[-0.01em]">
          A meio do caminho da vida, <em className="italic text-accent">algo pede para ser ouvido.</em>
        </h2>
        <div className="space-y-5 font-serif text-[1.05rem] text-text leading-[1.9]">
          <p>
            <span className="font-serif text-accent text-[1.1em]">A</span>{' '}
            vida adulta tem a sua qualidade própria de sofrimento.
            Decisões, papéis, responsabilidades, expectativas — e, no meio
            disso tudo, perguntas que insistem em retornar: <em className="italic">é
            isso?</em>, <em className="italic">o que estou fazendo da minha
            vida?</em>, <em className="italic">por que essa angústia que não
            passa?</em>. A psicologia analítica leva essas perguntas a sério.
          </p>
          <p>
            <strong className="text-text-bright font-normal">Carl Gustav Jung</strong>{' '}
            descreveu o desenvolvimento adulto como um processo contínuo de
            individuação — o caminho de tornar-se quem você é, integrando
            partes negadas, escutando símbolos e sonhos, fazendo as pazes com
            a própria sombra. Não é um caminho rápido nem confortável, mas é
            um caminho que faz sentido — e a clínica é o lugar onde ele pode
            ser percorrido com companhia.
          </p>
          <p>
            Atendo adultos online, em todo o Brasil (e em qualquer país, em
            português). Sessões de <strong className="text-text-bright font-normal">50
            minutos</strong>, em plataforma de videoconferência segura, com
            frequência semanal ou quinzenal conforme combinarmos.
          </p>
        </div>
      </div>
    </section>
  );
}

function DemandasBlock() {
  const demandas = [
    {
      title: 'Crise de sentido',
      body:
        'Quando o que sustentava a vida deixa de bastar — carreira que não preenche, relação esvaziada, sensação de viver no automático.',
    },
    {
      title: 'Sonhos recorrentes',
      body:
        'Sonhos que insistem, pesadelos, imagens marcantes — material precioso para a clínica analítica, escutado em sua linguagem própria.',
    },
    {
      title: 'Transições',
      body:
        'Meia-idade, mudança de carreira, separação, paternidade/maternidade, luto, perda de um lugar — momentos em que o velho não cabe mais e o novo ainda não tem nome.',
    },
    {
      title: 'Ansiedade e angústia',
      body:
        'Não como sintoma a suprimir, mas como sinal — escutar o que está tentando aparecer através do incômodo.',
    },
    {
      title: 'Autoconhecimento',
      body:
        'Para quem não está em crise aguda, mas quer um espaço onde a vida interior possa ser pensada com profundidade.',
    },
    {
      title: 'Relações',
      body:
        'Conflitos, padrões repetitivos, dificuldade de vínculo, escolhas amorosas que confundem — território de complexos, no vocabulário junguiano.',
    },
  ];

  return (
    <section className="relative py-12 md:py-24 px-5 sm:px-6 md:px-12 section-border-t">
      <div className="relative max-w-[1180px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            Demandas mais comuns
          </p>
        </div>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] text-text-bright leading-[1.15] mb-12 max-w-2xl tracking-[-0.01em]">
          O que costumo <em className="italic text-accent">acolher.</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {demandas.map((d) => (
            <article
              key={d.title}
              className="p-7 bg-bg-card/40 border border-border-subtle hover:border-accent/30 transition-colors"
            >
              <h3 className="font-serif text-[1.3rem] text-text-bright mb-3 leading-tight">
                {d.title}
              </h3>
              <p className="text-[0.96rem] text-text leading-[1.9]">{d.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="relative py-12 md:py-24 px-5 sm:px-6 md:px-12 section-border-t">
      <div className="relative max-w-[860px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            Dúvidas frequentes
          </p>
        </div>
        <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] text-text-bright leading-[1.1] mb-12 tracking-[-0.01em]">
          Antes de <em className="italic text-accent">marcar.</em>
        </h2>
        <dl className="space-y-8">
          {FAQ.map((f, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-3 md:gap-10 pb-6 border-b border-border-subtle/50"
            >
              <dt className="font-serif text-[1.08rem] text-text-bright leading-tight italic">
                {f.q}
              </dt>
              <dd className="font-serif text-[1rem] text-text leading-[1.9]">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function CtaBlock() {
  return (
    <section className="relative py-16 md:py-28 px-5 sm:px-6 md:px-12 section-border-t text-center">
      <div className="max-w-[640px] mx-auto">
        <h2 className="font-serif italic text-[clamp(1.8rem,3.6vw,2.6rem)] text-text-bright leading-[1.15] mb-5">
          Quer marcar uma <span className="text-accent">primeira conversa?</span>
        </h2>
        <p className="font-serif text-[1.02rem] text-text-dim leading-[1.85] mb-10 max-w-md mx-auto">
          Sem custo e sem compromisso. Vinte minutos pra a gente se conhecer e
          ver se faz sentido seguir.
        </p>
        <Link
          href="/psicoterapia-analitica#agendar"
          className="inline-block font-mono text-[0.7rem] tracking-[0.28em] uppercase text-bg bg-accent px-8 py-4 hover:bg-accent/90 transition-colors"
        >
          Marcar primeira conversa
        </Link>
      </div>
    </section>
  );
}
