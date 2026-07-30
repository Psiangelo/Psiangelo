import LegalPage from '@/components/ui/LegalPage';

const SITE_URL = 'https://psiangelo.github.io/Psiangelo';

export const metadata = {
  title: 'Política de Privacidade',
  description:
    'Como o Psiangelo trata dados pessoais: o que é coletado, para quê, com quem é compartilhado e como exercer os seus direitos previstos na LGPD.',
  alternates: { canonical: `${SITE_URL}/privacidade/` },
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  return (
    <LegalPage
      eyebrow="Documentos"
      title="Política de Privacidade"
      updatedAt="30 de julho de 2026"
    >
      <p>
        Este site é um projeto pessoal de estudo e escrita sobre a obra de Carl Gustav Jung.
        Esta página descreve, em linguagem direta, quais dados pessoais são tratados aqui, com
        que finalidade, por quanto tempo e o que você pode exigir a respeito deles. Está escrita
        conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
      </p>

      <h2>Quem é o responsável</h2>
      <p>
        O responsável pelo tratamento dos dados (o «controlador», na linguagem da LGPD) é Ângelo,
        pessoa física, autor e mantenedor deste site. Para qualquer assunto relativo a dados
        pessoais, inclusive os pedidos descritos ao final, o canal de contato é o WhatsApp
        indicado no rodapé do site.
      </p>

      <h2>O que este site coleta</h2>

      <h3>Se você se inscreve para receber avisos por e-mail</h3>
      <p>
        É a única coleta ativa de dados pessoais do site. Ao preencher o formulário, são
        guardados:
      </p>
      <ul>
        <li>o <strong>endereço de e-mail</strong> que você digitou;</li>
        <li>
          a <strong>página em que você se inscreveu</strong> (home ou fim de um ensaio), para eu
          saber o que leva as pessoas a assinar;
        </li>
        <li>
          a <strong>data e o texto exato do consentimento</strong> que estava na tela quando você
          marcou a caixa. Isso existe para o seu benefício: se um dia eu mudar as regras, fica
          registrado a que você consentiu de fato.
        </li>
      </ul>
      <p>
        <strong>Finalidade:</strong> enviar aviso quando eu publico um ensaio, um verbete de
        glossário ou uma trilha de leitura. Nada além disso.
      </p>
      <p>
        <strong>Base legal:</strong> o seu consentimento (art. 7º, I da LGPD), dado ao marcar a
        caixa. Consentimento é livre: a caixa nunca vem marcada, e recusar não impede o uso de
        nenhuma parte do site.
      </p>
      <p>
        <strong>O que eu não faço:</strong> não envio propaganda, não envio conteúdo de parceiro
        comercial, não vendo, alugo, troco nem repasso o seu e-mail para ninguém, em nenhuma
        hipótese. Se um dia eu passar a vender algo, avisar sobre isso pode entrar nos e-mails,
        e você continuará podendo sair a qualquer momento.
      </p>
      <p>
        <strong>Por quanto tempo:</strong> enquanto você quiser receber. Ao pedir para sair, o
        seu e-mail é apagado da base, não apenas marcado como inativo.
      </p>

      <h3>Se você navega sem se inscrever</h3>
      <p>
        Nenhum dado pessoal é coletado por mim. Você pode ler todos os ensaios, o glossário e as
        trilhas sem se identificar de nenhuma forma.
      </p>

      <h2>Armazenamento no seu navegador</h2>
      <p>
        O site guarda informação no <code>localStorage</code> do seu navegador, que é uma área de
        armazenamento local. Não são <em>cookies</em>, não acompanham você por outros sites e não
        são enviados para servidor nenhum. Servem para duas coisas:
      </p>
      <ul>
        <li>
          <strong>Guardar o conteúdo do site</strong> (textos, ensaios, verbetes), para as páginas
          carregarem rápido e o site funcionar mesmo com conexão ruim.
        </li>
        <li>
          <strong>Lembrar preferências suas</strong>, como o progresso em uma trilha de estudo.
        </li>
      </ul>
      <p>
        Você pode apagar tudo isso a qualquer momento, limpando os dados do site nas
        configurações do seu navegador. Nada se perde além das preferências locais. Detalhes na{' '}
        <a href="/Psiangelo/cookies/">Política de Cookies</a>.
      </p>

      <h2>Serviços de terceiros envolvidos</h2>
      <p>
        Ser honesto aqui significa listar também o que não é escolha minha, mas afeta você:
      </p>
      <ul>
        <li>
          <strong>GitHub Pages</strong> (GitHub, Inc., Estados Unidos) hospeda o site. Como
          qualquer servidor web, registra automaticamente acessos, incluindo endereço IP, para
          operação e segurança. Não tenho acesso a esses registros.
        </li>
        <li>
          <strong>Supabase</strong> guarda a lista de e-mails e o conteúdo do site, com acesso
          restrito. A lista de inscritos não pode ser lida por visitantes: só por mim, autenticado.
        </li>
        <li>
          <strong>Google Fonts</strong> (Google LLC, Estados Unidos) fornece as fontes tipográficas.
          Ao carregar a página, o seu navegador faz uma requisição aos servidores do Google, que
          nessa requisição recebem o seu endereço IP. É um efeito técnico do carregamento das
          fontes, não uma escolha de rastreamento, e pretendo passar a hospedar as fontes aqui
          mesmo para eliminar essa transferência.
        </li>
        <li>
          <strong>WhatsApp</strong> (Meta Platforms) é usado se você clicar no botão de contato.
          A conversa passa a ser regida pela política do WhatsApp, não por esta.
        </li>
      </ul>
      <p>
        <strong>Não há Google Analytics, pixel do Facebook, remarketing nem qualquer rastreador
        publicitário neste site.</strong> Se um dia eu adotar alguma medição de audiência, será
        uma que não usa cookies nem identifica visitantes individualmente, e esta página será
        atualizada antes.
      </p>

      <h2>Não me envie informação sensível de saúde</h2>
      <p>
        Este site é material de estudo, não atendimento. Por favor, não descreva sintomas,
        histórico clínico ou qualquer informação de saúde no formulário de e-mail nem em mensagem
        pelos canais daqui. Dado de saúde é categoria especialmente protegida pela LGPD, e este
        não é o lugar adequado para tratá-lo.
      </p>

      <h2>Segurança</h2>
      <p>
        A lista de inscritos fica protegida por controle de acesso no banco de dados: a chave
        pública que o site usa consegue inserir uma inscrição, mas não consegue ler a lista.
        Nenhum sistema é imune, e caso ocorra um incidente de segurança com risco relevante aos
        seus dados, você e a Autoridade Nacional de Proteção de Dados serão comunicados.
      </p>

      <h2>Os seus direitos</h2>
      <p>
        A LGPD (art. 18) garante a você, a qualquer momento e sem custo, o direito de:
      </p>
      <ul>
        <li>saber se eu trato dados seus e quais são;</li>
        <li>obter uma cópia deles;</li>
        <li>corrigir dado incompleto ou desatualizado;</li>
        <li>
          <strong>revogar o consentimento e ter os dados eliminados</strong>, que no caso deste
          site significa sair da lista e ter o e-mail apagado;
        </li>
        <li>ser informado sobre com quem os dados foram compartilhados;</li>
        <li>opor-se a um tratamento que considere irregular.</li>
      </ul>
      <p>
        Para exercer qualquer um deles, basta pedir pelo contato no rodapé. Não preciso de
        justificativa, e o pedido de saída da lista é atendido sem tentativa de retenção.
      </p>

      <h2>Menores de idade</h2>
      <p>
        Este site não é dirigido a crianças e não coleta dados de menores de 16 anos de forma
        deliberada. Se souber que isso ocorreu, avise pelo contato do rodapé e os dados serão
        eliminados.
      </p>

      <h2>Mudanças nesta política</h2>
      <p>
        Se esta política mudar, a data no topo é atualizada. Mudança que altere a finalidade do
        uso do seu e-mail será comunicada por e-mail antes de valer, e dependerá de novo
        consentimento seu.
      </p>
    </LegalPage>
  );
}
