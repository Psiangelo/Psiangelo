import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import TherapyGate from '@/components/therapy/TherapyGate';
import TherapySchema from '@/components/therapy/TherapySchema';
import TherapistCard from '@/components/therapy/TherapistCard';
import { CLINICAL_FAQ } from '@/data/clinical-faq';

const FAQ = [
  {
    q: 'A partir de que idade você atende adolescentes?',
    a: 'A partir de 14 anos, com consentimento expresso dos responsáveis legais. Conforme as resoluções do Conselho Federal de Psicologia, o atendimento de menor de idade exige autorização formal de pai, mãe ou responsável legal antes da primeira sessão.',
  },
  {
    q: 'Como funciona o sigilo no atendimento de adolescente?',
    a: 'O sigilo do(a) adolescente é resguardado integralmente. O conteúdo das sessões não é compartilhado com a família. A única exceção, prevista em código de ética, é situação de risco grave à integridade física do(a) adolescente ou de terceiros — e mesmo aí, sempre com transparência prévia. Tudo isso é conversado com a família e com o(a) adolescente antes de começarmos.',
  },
  {
    q: 'Os pais participam das sessões?',
    a: 'Não, em geral. As sessões são individuais, do(a) adolescente. Em momentos pontuais — combinação inicial, eventual reavaliação, situações específicas — pode haver uma conversa com a família, sempre com o conhecimento e consentimento do(a) adolescente.',
  },
  {
    q: 'E se meu filho ou minha filha não quiser fazer terapia?',
    a: 'Vale uma conversa antes de impor. Posso oferecer uma primeira conversa breve apenas para que ele(a) me conheça, sem compromisso de seguir. A terapia funciona quando há disposição mínima — não precisa estar entusiasmado(a), basta querer experimentar uma conversa.',
  },
  {
    q: 'Funciona online com adolescente?',
    a: 'Sim, e com frequência funciona melhor que presencial — adolescentes desta geração estão à vontade no formato digital, e a sessão acontece num espaço escolhido por eles(as), o que costuma facilitar a abertura. O essencial é ter um lugar tranquilo, onde a privacidade da conversa esteja garantida.',
  },
  {
    q: 'Quais demandas são mais comuns na adolescência?',
    a: 'Ansiedade, sensação de não pertencer, conflitos familiares, dúvidas sobre identidade e sexualidade, escolha profissional, sofrimento difuso, sintomas alimentares, autolesão, ideações, isolamento, crises de sentido. A psicologia analítica trata cada caso a partir de sua singularidade — sem rotular cedo demais.',
  },
  {
    q: 'O que é a abordagem junguiana e por que ela combina com adolescentes?',
    a: 'A psicologia analítica de Jung valoriza o que está em formação — e a adolescência é, por definição, a vida em formação. Trabalha com símbolos, sonhos, identidade em construção, e dá espaço para que o(a) jovem se reconheça em sua singularidade, ao invés de ser reduzido(a) a um diagnóstico.',
  },
  {
    q: 'Como faço para marcar uma primeira conversa?',
    a: 'Pelo WhatsApp ou pelo formulário do site. A primeira conversa é gratuita e sem compromisso — pode vir o(a) adolescente, pode vir o(a) responsável primeiro, ou os dois juntos. Conversamos sobre o que está acontecendo, esclareço dúvidas e, se fizer sentido, combinamos como começar.',
  },
];

export const metadata = {
  title: 'Psicólogo Online para Adolescente · Abordagem Junguiana',
  description:
    'Psicoterapia analítica online para adolescentes (14+), em todo o Brasil. Espaço seguro de escuta, com sigilo cuidadoso e diálogo claro com a família. Marque uma conversa.',
  keywords: [
    'psicólogo para adolescente online',
    'terapia para adolescente online',
    'psicólogo de adolescente',
    'psicoterapia adolescente junguiana',
    'meu filho não quer falar comigo',
    'psicólogo para jovem online',
    'ansiedade adolescente psicólogo',
  ],
  alternates: { canonical: '/psicoterapia-analitica/adolescentes' },
  openGraph: {
    title: 'Psicólogo Online para Adolescente · Psiangelo',
    description:
      'Atendimento online de adolescentes (14+) em psicoterapia analítica junguiana, em todo o Brasil.',
    type: 'website',
    url: '/psicoterapia-analitica/adolescentes',
  },
};

export default function PsicoterapiaAdolescentesPage() {
  return (
    <TherapyGate>
      <TherapySchema
        path="/psicoterapia-analitica/adolescentes"
        title="Psicoterapia Analítica para Adolescentes"
        serviceName="Psicoterapia analítica online para adolescentes"
        description="Atendimento clínico de adolescentes (14 a 18 anos) em psicoterapia analítica de abordagem junguiana, online, em todo o Brasil. Com consentimento dos responsáveis e sigilo resguardado."
        audience={{ name: 'Adolescentes', suggestedMinAge: 14, suggestedMaxAge: 18 }}
        faq={[...FAQ, ...CLINICAL_FAQ]}
        breadcrumb={[
          { name: 'Psicoterapia Analítica', path: '/psicoterapia-analitica' },
        ]}
      />
      <Navbar />
      <main>
        <PageHero
          breadcrumbs={[
            { name: 'Psicoterapia Analítica', href: '/psicoterapia-analitica/' },
            { name: 'Adolescentes' },
          ]}
          eyebrow="Adolescentes · 14 a 18 anos · 100% online"
          title="Um espaço próprio"
          emphasis="para o que está em formação"
          lead="Psicoterapia analítica online para adolescentes em todo o Brasil. Uma escuta sem julgamento, com sigilo cuidadoso e diálogo transparente com a família — um lugar onde o que está se construindo pode ser falado e pensado."
          sideCard={<TherapistCard />}
        />

        <ContentBlock />
        <ForParents />
        <ForTeens />
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
            Uma vida em formação
          </p>
        </div>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] text-text-bright leading-[1.15] mb-6 tracking-[-0.01em]">
          A adolescência <em className="italic text-accent">não é um problema a ser resolvido.</em>
        </h2>
        <div className="space-y-5 font-serif text-[1.05rem] text-text leading-[1.9]">
          <p>
            <span className="font-serif text-accent text-[1.1em]">A</span>{' '}
            adolescência é, por definição, a vida em formação. Identidade,
            corpo, afetos, lugar no mundo — tudo está se reorganizando ao
            mesmo tempo. É um período em que o sofrimento aparece com
            facilidade, mas também é um momento de invenção, de descoberta,
            de abertura para o que ainda não tem nome.
          </p>
          <p>
            A <strong className="text-text-bright font-normal">psicologia
            analítica</strong>, desenvolvida por Carl Gustav Jung, é
            particularmente acolhedora para essa fase porque valoriza
            justamente o que está em movimento — símbolos, sonhos, fantasias,
            buscas, contradições. Em vez de tentar encaixar o(a) adolescente
            num diagnóstico cedo demais, a clínica junguiana escuta o que
            ainda está se formando e oferece um espaço para que isso possa
            acontecer com mais consciência.
          </p>
          <p>
            Atendo adolescentes a partir de <strong className="text-text-bright font-normal">14
            anos</strong>, online, em todo o Brasil. As sessões são individuais,
            por videochamada, com sigilo resguardado e diálogo claro com a
            família sobre o que envolve responsabilidade legal.
          </p>
        </div>
      </div>
    </section>
  );
}

function ForParents() {
  return (
    <section className="relative py-12 md:py-20 px-5 sm:px-6 md:px-12 section-border-t">
      <div className="relative max-w-[820px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            Para pais e responsáveis
          </p>
        </div>
        <h2 className="font-serif text-[clamp(1.6rem,3.4vw,2.4rem)] text-text-bright leading-[1.15] mb-6 tracking-[-0.01em]">
          Quando procurar terapia <em className="italic text-accent">para um(a) filho(a).</em>
        </h2>
        <div className="space-y-5 font-serif text-[1.02rem] text-text leading-[1.9]">
          <p>
            Você pode estar aqui porque algo mudou — um silêncio, um
            isolamento, uma queda na escola, sintomas no corpo, irritação
            constante, choro inexplicado, sinais de ansiedade. Ou porque o(a)
            seu(sua) filho(a) pediu. Ou porque algo te diz, sem que você saiba
            exatamente o quê.
          </p>
          <p>
            Não é preciso esperar o quadro piorar para procurar. Muitas vezes
            uma conversa em momento certo evita que algo se cristalize. E,
            mesmo quando já há sofrimento intenso instalado, a abordagem
            analítica — com tempo e cuidado — costuma encontrar caminhos.
          </p>
          <p>
            <strong className="text-text-bright font-normal">Pode entrar em contato você
            primeiro</strong>, sem o(a) adolescente. A primeira conversa serve
            para que você me conte o que está acontecendo, esclareça dúvidas
            sobre a abordagem, sigilo, formato e investimento, e juntos
            decidirmos o melhor caminho para apresentar a possibilidade ao(à)
            seu(sua) filho(a).
          </p>
        </div>
      </div>
    </section>
  );
}

function ForTeens() {
  return (
    <section className="relative py-12 md:py-20 px-5 sm:px-6 md:px-12 section-border-t">
      <div className="relative max-w-[820px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            Se você é adolescente
          </p>
        </div>
        <h2 className="font-serif text-[clamp(1.6rem,3.4vw,2.4rem)] text-text-bright leading-[1.15] mb-6 tracking-[-0.01em]">
          Um lugar para falar <em className="italic text-accent">o que não cabe em outros lugares.</em>
        </h2>
        <div className="space-y-5 font-serif text-[1.02rem] text-text leading-[1.9]">
          <p>
            Se você chegou aqui por conta própria, ou se alguém te mandou esse
            link — vale saber: não é preciso ter um motivo claro para começar
            terapia. Não é preciso estar &ldquo;mal o suficiente&rdquo;. Basta
            ter algo que te incomoda e a vontade (mesmo que pequena) de
            conversar sobre.
          </p>
          <p>
            O que você falar fica entre nós. Eu não conto pros seus pais — só
            em situações de risco grave, e mesmo nessas o assunto é
            conversado com você antes. A terapia é sua, não deles.
          </p>
          <p>
            A primeira conversa é uma conversa só. Sem custo, sem
            compromisso. Você decide se quer continuar ou não.
          </p>
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
          {[...FAQ, ...CLINICAL_FAQ].map((f, i) => (
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
          Sem custo e sem compromisso. Pode vir você primeiro (responsável),
          o(a) adolescente, ou os dois juntos.
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
