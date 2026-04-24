'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';

// Temas agrupados por natureza clínica. Cada um aponta pro público mais
// recorrente, mas todos podem ser trabalhados em qualquer idade.
const TEMAS = [
  {
    group: 'Sofrimento emocional',
    items: [
      {
        title: 'Ansiedade e crises de pânico',
        body: 'Vigilância difusa, sensação de perigo sem causa clara, inquietação corporal. A abordagem analítica não busca apenas reduzir o sintoma — pergunta pelo que está em desequilíbrio na psique e precisando ser ouvido.',
        audience: 'adultos',
      },
      {
        title: 'Depressão e sentimento de vazio',
        body: 'Há dores que não são doença — são sinais. A psicologia analítica acolhe a depressão como um chamado da psique para dentro, um descenso necessário antes de uma nova configuração ganhar forma.',
        audience: 'adultos',
      },
      {
        title: 'Luto e perdas',
        body: 'Perda de alguém, de um vínculo, de uma identidade, de uma saúde. A clínica analítica dá espaço para que o luto possa ser vivido no tempo que precisa — sem pressa de "superar" —, com os símbolos que a psique oferecer.',
        audience: 'adultos',
      },
      {
        title: 'Burnout e esgotamento',
        body: 'Exaustão que não descansa, irritabilidade, perda de sentido no trabalho, despersonalização. Sinais de que a relação com a vocação precisa ser examinada em profundidade — não só no nível da agenda.',
        audience: 'adultos',
      },
    ],
  },
  {
    group: 'Sentido e direção de vida',
    items: [
      {
        title: 'Crise de meia-idade e busca de sentido',
        body: 'Jung descreveu a meia-idade como um segundo nascimento psíquico — o momento em que o Ego começa a dialogar com o Self e muitas pessoas sentem que "a vida precisa mudar". Não é crise: é processo.',
        audience: 'adultos',
      },
      {
        title: 'Autoconhecimento e individuação',
        body: 'Não é sofrimento agudo, é a disposição de se encontrar. Sonhos, sincronicidades, padrões que se repetem, figuras internas. O processo analítico é um espaço estruturado para esse trabalho ao longo do tempo.',
        audience: 'adultos',
      },
      {
        title: 'Envelhecimento e integração',
        body: 'A segunda metade da vida também pede escuta. Aposentadoria, mudanças no corpo, revisão de memória, reavaliação do que foi vivido, preparação espiritual. Jung via nisso uma forma específica de desenvolvimento — não declínio.',
        audience: 'idosos',
      },
      {
        title: 'Transições de vida',
        body: 'Início profissional, casamento, maternidade/paternidade, divórcio, mudança de cidade, aposentadoria. Todo atravessamento pede algum trabalho simbólico — o que está sendo deixado e o que está sendo gerado.',
        audience: 'adultos',
      },
    ],
  },
  {
    group: 'Sonhos e símbolos',
    items: [
      {
        title: 'Sonhos recorrentes ou perturbadores',
        body: 'Sonhos que voltam, pesadelos, figuras que se repetem, sensação de mensagem não entendida. A análise de sonhos é um dos eixos da clínica junguiana — não decodificação, mas escuta paciente do que está se elaborando.',
        audience: 'adultos',
      },
      {
        title: 'Experiências numinosas ou simbólicas',
        body: 'Sincronicidades, sonhos arquetípicos, experiências que parecem "maiores" que o cotidiano. Esses fenômenos têm lugar na clínica analítica — sem reduzi-los a sintoma, sem elevá-los a misticismo.',
        audience: 'adultos',
      },
    ],
  },
  {
    group: 'Vida relacional e familiar',
    items: [
      {
        title: 'Relacionamentos e conflitos afetivos',
        body: 'Padrões que se repetem, ciúmes, dependência, dificuldade de estabelecer intimidade, solidão persistente. Trabalhamos com o que está sendo projetado no outro e o que é próprio.',
        audience: 'adultos',
      },
      {
        title: 'Conflitos familiares (filhos adolescentes)',
        body: 'Para pais de adolescentes: escuta da sua posição, sem transformar você em terapeuta do filho. A terapia do(a) adolescente é dele(a) — os pais podem ter seu próprio espaço, se for o caso.',
        audience: 'adolescentes',
      },
    ],
  },
  {
    group: 'Específico de adolescentes',
    items: [
      {
        title: 'Dúvidas sobre identidade e sexualidade',
        body: 'Espaço livre de julgamento para pensar quem se é, sem ter que explicar, provar ou encaixar. A psicologia analítica acolhe a formação da identidade como processo, não como diagnóstico.',
        audience: 'adolescentes',
      },
      {
        title: 'Sintomas alimentares, autolesão, ideações',
        body: 'Quadros sérios que merecem acompanhamento específico e, quando indicado, articulação com psiquiatria ou nutrição. Não trabalho sozinho casos agudos — mas posso oferecer a escuta analítica quando faz parte do cuidado.',
        audience: 'adolescentes',
      },
    ],
  },
];

const AUDIENCE_LINKS = {
  adultos: { label: 'Adultos', href: '/psicoterapia-analitica/adultos/' },
  adolescentes: { label: 'Adolescentes', href: '/psicoterapia-analitica/adolescentes/' },
  idosos: { label: 'Idosos', href: '/psicoterapia-analitica/idosos/' },
};

export default function AtendoClient() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <PageHero
          breadcrumbs={[
            { name: 'Psicoterapia Analítica', href: '/psicoterapia-analitica/' },
            { name: 'O que atendo' },
          ]}
          eyebrow="Temas clínicos · Psicoterapia analítica"
          title="O que se trata"
          emphasis="na clínica analítica"
          lead="Lista não exaustiva de queixas e temas mais frequentes na minha prática. A abordagem analítica não trata síndromes, trata pessoas — mas essas pistas ajudam você a identificar se o que está vivendo pode encontrar escuta aqui."
        />

        <div className="relative max-w-[960px] mx-auto px-5 sm:px-6 md:px-12 pb-24">
          {TEMAS.map((group, gi) => (
            <section key={group.group} className="mb-16 md:mb-20">
              <motion.header
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-baseline gap-4 mb-8"
              >
                <span className="block w-10 h-px bg-accent/50" />
                <h2 className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
                  {group.group}
                </h2>
                <span className="flex-1 h-px bg-border-subtle" />
              </motion.header>

              <div className="space-y-8">
                {group.items.map((item, i) => (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 md:gap-10 pb-6 border-b border-border-subtle/50"
                  >
                    <header>
                      <h3 className="font-serif text-[1.15rem] text-text-bright leading-tight italic">
                        {item.title}
                      </h3>
                      {AUDIENCE_LINKS[item.audience] && (
                        <Link
                          href={AUDIENCE_LINKS[item.audience].href}
                          className="inline-block mt-3 font-mono text-[0.55rem] tracking-[0.22em] uppercase text-accent hover:text-text-bright transition-colors link-underline"
                        >
                          Ver página · {AUDIENCE_LINKS[item.audience].label}
                        </Link>
                      )}
                    </header>
                    <p className="font-serif text-[1rem] text-text leading-[1.9]">
                      {item.body}
                    </p>
                  </motion.article>
                ))}
              </div>
            </section>
          ))}

          {/* CTA final */}
          <section className="mt-20 pt-10 border-t border-accent/20 text-center">
            <p className="font-serif italic text-text-dim text-[1.05rem] mb-6 max-w-xl mx-auto">
              Esta lista não é diagnóstica, é apenas um mapa. Se alguma coisa
              aqui ressoa com o que você vive, podemos conversar.
            </p>
            <Link
              href="/psicoterapia-analitica/"
              className="inline-flex items-center gap-3 px-7 py-3.5 font-sans text-[0.72rem] font-medium tracking-[0.18em] uppercase text-bg bg-accent hover:bg-text-bright transition-colors"
            >
              Marcar uma primeira conversa
              <span aria-hidden>→</span>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
