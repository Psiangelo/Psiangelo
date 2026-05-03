/**
 * HomeSeoIntro — manifesto curto da home (server-rendered, indexável).
 *
 * A /psicoterapia-analitica/ cobre o atendimento como serviço (públicos,
 * processo, valores, horários, queixas). Esta seção cobre o ângulo
 * complementar: o que é a abordagem junguiana como visão, e por que esta
 * casa une clínica, estudo e escrita.
 *
 * Server component — sem 'use client', sem hooks, sem animações. Isso
 * garante texto rico no HTML inicial, mesmo antes da hidratação.
 *
 * Keywords distintas da landing clínica: psicólogo junguiano, abordagem
 * junguiana, psicologia analítica, obra de Jung, individuação, vida
 * simbólica, sonhos. (A landing /psicoterapia-analitica cobre o long-tail
 * de conversão: "psicoterapia analítica online", "primeira conversa", etc.)
 */
export default function HomeSeoIntro() {
  return (
    <section
      id="manifesto"
      aria-labelledby="manifesto-title"
      className="relative py-14 md:py-24 px-5 sm:px-6 md:px-12 section-border-t"
    >
      <div className="relative max-w-[820px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="block w-10 h-px bg-accent/50" />
          <p className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase">
            A casa
          </p>
        </div>
        <h2
          id="manifesto-title"
          className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] text-text-bright leading-[1.15] mb-6 tracking-[-0.01em]"
        >
          Uma escuta junguiana{' '}
          <em className="italic text-accent">
            para a vida que se vive agora.
          </em>
        </h2>
        <div className="space-y-5 font-serif text-[1.05rem] text-text leading-[1.9]">
          <p>
            <span className="font-serif text-accent text-[1.1em]">A</span>{' '}
            <strong className="text-text-bright font-normal">
              psicologia analítica
            </strong>{' '}
            — também conhecida como{' '}
            <em className="italic">abordagem junguiana</em> — é a tradição clínica
            iniciada por Carl Gustav Jung. Ela escuta a vida pelos seus
            elementos próprios:{' '}
            <em className="italic">sonhos, complexos, símbolos</em> e o
            movimento de tornar-se quem se é, que Jung chamou de{' '}
            <em className="italic">individuação</em>.
          </p>
          <p>
            Esta casa reúne três frentes que dependem umas das outras —{' '}
            <strong className="text-text-bright font-normal">clínica</strong>,{' '}
            <strong className="text-text-bright font-normal">estudo</strong> e{' '}
            <strong className="text-text-bright font-normal">escrita</strong>.
            Atendo por videochamada, em todo o Brasil, e publico aqui o que
            atravessa o trabalho: trilhas de leitura, mapas conceituais,
            ensaios e o vault de notas que mantenho em estudo contínuo.
          </p>
          <p>
            O formato online não é só operacional: amplia o acesso à clínica
            junguiana — ainda rara fora dos grandes centros — para quem mora
            longe de um(a) psicólogo(a) desta abordagem, inclusive brasileiros
            vivendo no exterior.
          </p>
        </div>
      </div>
    </section>
  );
}
