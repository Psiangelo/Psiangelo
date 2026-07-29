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
    q: 'Idoso(a) costuma se adaptar a terapia online?',
    a: 'Sim — e muitas vezes melhor do que se imagina. A geração que está hoje na terceira idade conviveu com tecnologia digital nas últimas duas décadas. O que costuma ajudar é uma sessão inicial breve para a pessoa se familiarizar com a plataforma, e a partir daí é só conversa, como em qualquer atendimento.',
  },
  {
    q: 'Posso marcar para meu pai, minha mãe, meu(minha) avô(ó)?',
    a: 'Sim. Filhos e familiares próximos frequentemente são quem inicia o contato. Podemos marcar uma primeira conversa onde você me conta o que está acontecendo — e juntos pensamos como apresentar a possibilidade à pessoa, respeitando o tempo dela.',
  },
  {
    q: 'Por que a abordagem junguiana é especialmente boa para idosos?',
    a: 'Carl Gustav Jung dedicou parte importante de sua obra ao que chamou de "segunda metade da vida" — a fase em que as questões de sentido, integração, memória, reconciliação e transcendência se tornam centrais. Para Jung, esse não é um período de declínio, mas de uma forma específica e preciosa de desenvolvimento psíquico. Poucas abordagens dão a este tempo da vida o lugar que ele merece.',
  },
  {
    q: 'Que demandas costumam aparecer nessa fase da vida?',
    a: 'Luto (perda do(a) cônjuge, de irmãos, de amigos), ansiedade ligada à saúde, sensação de inutilidade após aposentadoria, conflitos com filhos adultos, redescoberta de sentido, ressentimento, revisão de vida, medo da morte, solidão, transição para o cuidado de outros (cônjuge adoecido, por exemplo). Tudo isso é trabalhável.',
  },
  {
    q: 'Preciso de algum equipamento especial?',
    a: 'Apenas um computador, tablet ou celular com câmera, e uma conexão de internet razoável. Posso ajudar a orientar no primeiro contato, e familiares podem auxiliar na configuração inicial se necessário. Depois disso, é só clicar num link na hora marcada.',
  },
  {
    q: 'E se a pessoa tiver perda de audição ou outra dificuldade?',
    a: 'Conversamos antes. A maioria das plataformas tem opções de legenda automática e ajustes de volume. O ritmo da sessão se adapta a quem chega — não há pressa, e qualquer ajuste necessário é parte do cuidado.',
  },
  {
    q: 'Vocês trabalha com pessoas com início de demência ou Alzheimer?',
    a: 'Avalio caso a caso. Em estágios iniciais, com lucidez preservada e desejo de conversar, o trabalho pode ser muito significativo — inclusive como elaboração da própria condição. Em estágios mais avançados, o atendimento individual analítico não costuma ser o melhor formato, e é importante ser honesto sobre isso.',
  },
  {
    q: 'Como funciona o sigilo, mesmo com a família próxima?',
    a: 'Absoluto, conforme o Código de Ética. Mesmo quando um(a) familiar inicia o contato, o conteúdo das sessões é da pessoa atendida e não é compartilhado. Isso é dito com clareza desde o começo, para todos os envolvidos.',
  },
];

export const metadata = {
  title: 'Psicólogo Online para Idoso · Psicoterapia na Maturidade',
  description:
    'Psicoterapia analítica online para idosos (60+) em todo o Brasil. A segunda metade da vida segundo Jung — sentido, memória, reconciliação. Marque uma primeira conversa.',
  keywords: [
    'psicólogo para idoso',
    'psicólogo para idoso online',
    'terapia para idoso online',
    'psicólogo terceira idade',
    'psicoterapia idoso junguiana',
    'psicólogo para meu pai',
    'psicólogo para minha mãe',
    'luto na terceira idade',
    'depressão idoso terapia',
    'segunda metade da vida Jung',
  ],
  alternates: { canonical: '/psicoterapia-analitica/idosos' },
  openGraph: {
    title: 'Psicólogo Online para Idoso · Psiangelo',
    description:
      'Psicoterapia analítica online para idosos. A segunda metade da vida em Jung — sentido, memória, novos começos.',
    type: 'website',
    url: '/psicoterapia-analitica/idosos',
  },
};

export default function PsicoterapiaIdososPage() {
  return (
    <TherapyGate>
      <TherapySchema
        path="/psicoterapia-analitica/idosos"
        title="Psicoterapia Analítica para Idosos"
        serviceName="Psicoterapia analítica online para idosos"
        description="Atendimento clínico de idosos (60+) em psicoterapia analítica de abordagem junguiana, online, em todo o Brasil. A segunda metade da vida segundo Jung — sentido, memória, reconciliação, novos começos."
        audience={{ name: 'Idosos', suggestedMinAge: 60 }}
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
            { name: 'Idosos' },
          ]}
          eyebrow="Idosos · 60+ · 100% online"
          title="A segunda metade da vida"
          emphasis="também pede escuta"
          lead="Psicoterapia analítica online para idosos em todo o Brasil. Para Carl Gustav Jung, a maturidade não é declínio — é uma forma específica de desenvolvimento psíquico, com questões próprias de sentido, memória, integração e novos começos."
          sideCard={<TherapistCard />}
        />

        <ContentBlock />
        <ForFamily />
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
            A segunda metade da vida
          </p>
        </div>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] text-text-bright leading-[1.15] mb-6 tracking-[-0.01em]">
          Para Jung, a maturidade <em className="italic text-accent">tem um trabalho próprio.</em>
        </h2>
        <div className="space-y-5 font-serif text-[1.1rem] text-text leading-[2]">
          <p>
            <span className="font-serif text-accent text-[1.15em]">C</span>arl
            Gustav Jung escreveu que a primeira metade da vida é dedicada a
            construir uma posição no mundo — carreira, família, identidade
            social. Já a segunda metade tem outra tarefa: voltar-se para
            dentro, integrar o que ficou de fora, reconciliar-se com a própria
            história, fazer sentido do que foi vivido e do que ainda está por
            vir. É um trabalho que a cultura contemporânea quase não nomeia.
          </p>
          <p>
            <strong className="text-text-bright font-normal">A
            psicoterapia analítica</strong> é uma das poucas abordagens
            clínicas que toma esse tempo da vida com a profundidade que ele
            merece. Não como fase de declínio a ser administrada, mas como
            momento de uma forma específica de desenvolvimento — a que
            antigos chamavam de sabedoria.
          </p>
          <p>
            Atendo idosos online, em todo o Brasil. Sessões de{' '}
            <strong className="text-text-bright font-normal">50 minutos</strong>,
            por videochamada, com ritmo adaptado ao que faz sentido para
            quem chega. Sem pressa, sem fórmulas.
          </p>
        </div>
      </div>
    </section>
  );
}

function ForFamily() {
  return (
    <section className="relative py-12 md:py-20 px-5 sm:px-6 md:px-12 section-border-t">
      <div className="relative max-w-[820px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            Se você está procurando para alguém da família
          </p>
        </div>
        <h2 className="font-serif text-[clamp(1.6rem,3.4vw,2.4rem)] text-text-bright leading-[1.15] mb-6 tracking-[-0.01em]">
          Para um pai, uma mãe, <em className="italic text-accent">um(a) avô(ó).</em>
        </h2>
        <div className="space-y-5 font-serif text-[1.05rem] text-text leading-[1.9]">
          <p>
            Talvez você tenha visto sua mãe se isolar depois da viuvez. Talvez
            seu pai esteja deprimido desde a aposentadoria. Talvez sua avó
            ande dizendo, baixinho, que &ldquo;já viveu o que tinha que
            viver&rdquo;. Você sente que precisa de algo, mas não sabe por
            onde começar.
          </p>
          <p>
            <strong className="text-text-bright font-normal">Comece por uma conversa.</strong>{' '}
            Não com a pessoa idosa de imediato — comigo. Você pode marcar uma
            primeira conversa onde me conta o que está acontecendo, eu
            esclareço dúvidas sobre como funciona terapia nessa fase da vida,
            e juntos pensamos como apresentar a possibilidade, respeitando
            o tempo e a autonomia de quem você ama.
          </p>
          <p>
            Atendimento online também simplifica logística — sem
            deslocamento, sem cansaço, sem dependência de carona. Para
            muitas famílias, é o que torna a terapia possível.
          </p>
        </div>
      </div>
    </section>
  );
}

function DemandasBlock() {
  const demandas = [
    {
      title: 'Luto e perdas',
      body:
        'Perda do(a) cônjuge, de irmãos, de amigos próximos. Lutos que a vida vai exigindo e que precisam ser elaborados.',
    },
    {
      title: 'Sentido após aposentadoria',
      body:
        'A pergunta "e agora?" depois de décadas de trabalho. A reinvenção do tempo, dos vínculos, da identidade.',
    },
    {
      title: 'Revisão de vida',
      body:
        'O movimento natural de olhar para trás — reconciliações pendentes, escolhas a perdoar, sentido a fazer do que foi vivido.',
    },
    {
      title: 'Medo da morte e da dependência',
      body:
        'Espaço para falar do que dificilmente cabe em outras conversas — finitude, fragilidade, o que vem depois.',
    },
    {
      title: 'Conflitos com filhos adultos',
      body:
        'Distanciamentos, ressentimentos, expectativas frustradas, novos arranjos familiares.',
    },
    {
      title: 'Solidão',
      body:
        'A solidão da terceira idade tem qualidade própria — e merece um espaço onde possa ser nomeada e habitada com mais consciência.',
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
          O que costuma <em className="italic text-accent">aparecer.</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {demandas.map((d) => (
            <article
              key={d.title}
              className="p-7 bg-bg-card/40 border border-border-subtle hover:border-accent/30 transition-colors"
            >
              <h3 className="font-serif text-[1.35rem] text-text-bright mb-3 leading-tight">
                {d.title}
              </h3>
              <p className="text-[1rem] text-text leading-[1.9]">{d.body}</p>
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
          {[...FAQ, ...CLINICAL_FAQ].map((f, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-3 md:gap-10 pb-6 border-b border-border-subtle/50"
            >
              <dt className="font-serif text-[1.1rem] text-text-bright leading-tight italic">
                {f.q}
              </dt>
              <dd className="font-serif text-[1.02rem] text-text leading-[1.95]">{f.a}</dd>
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
        <p className="font-serif text-[1.05rem] text-text-dim leading-[1.95] mb-10 max-w-md mx-auto">
          Sem custo e sem compromisso. Pode ser você quem chega — ou um(a)
          familiar que quer conversar primeiro.
        </p>
        <Link
          href="/psicoterapia-analitica#agendar"
          className="inline-block font-mono text-[0.72rem] tracking-[0.28em] uppercase text-bg bg-accent px-8 py-4 hover:bg-accent/90 transition-colors"
        >
          Marcar primeira conversa
        </Link>
      </div>
    </section>
  );
}
