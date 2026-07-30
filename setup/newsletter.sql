-- ============================================================
-- Newsletter — Psiangelo
-- Rode este script no SQL Editor do painel do Supabase.
--
-- Sem acentuacao nos comentarios de proposito: acento se perde em
-- alguns caminhos de copia/cola e quebra o parse no editor.
--
-- Idempotente: pode rodar de novo sem quebrar. Se voce ja rodou a
-- versao anterior deste arquivo, rode de novo: as colunas de
-- consentimento e a policy de leitura do admin sao novas.
-- ============================================================

-- Tabela de inscritos na lista de e-mail.
-- O UNIQUE em `email` nunca duplica um inscrito, e e o que sustenta o
-- comportamento do formulario: quem ja esta na lista ve mensagem de
-- sucesso, nao de erro (o app trata a violacao de unicidade como sucesso).
-- `source` registra de onde veio a inscricao: 'home', 'blog-post', etc.
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'home',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT newsletter_subscribers_email_key UNIQUE (email)
);

-- ============================================================
-- Consentimento (LGPD)
-- ============================================================
-- A LGPD pede consentimento livre, informado e especifico, e exige que
-- voce consiga DEMONSTRAR depois a que a pessoa consentiu. Um booleano
-- "aceitou: sim" nao prova nada: guardamos o TEXTO exato que estava na
-- tela, a versao dele e a data. Se o texto mudar, quem assinou antes
-- continua com o registro do que aceitou de fato.
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS consent_text TEXT;
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS consent_version INTEGER;
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ;

-- Indice para exportar a lista em ordem de chegada.
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at
  ON newsletter_subscribers (created_at DESC);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anonimo (o visitante do site, via anon key): pode SE INSCREVER.
DROP POLICY IF EXISTS "anon_pode_se_inscrever" ON newsletter_subscribers;
CREATE POLICY "anon_pode_se_inscrever"
  ON newsletter_subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anonimo NAO pode LER a lista, e isso e proposital: a anon key vai
-- embutida no bundle publico do site, entao qualquer pessoa que a
-- extraisse baixaria a lista inteira de e-mails.
-- Nao criar policy de SELECT para `anon`.

-- Admin LOGADO (sessao do Supabase Auth): pode LER a lista, para ver e
-- exportar os inscritos na aba do painel. Requer login de verdade; a anon
-- key sozinha nao alcanca isso.
-- ⚠️ Mantenha o signup FECHADO no painel do Supabase (Authentication >
-- Providers). Com signup aberto, qualquer pessoa cria conta e passa a
-- poder ler a lista.
DROP POLICY IF EXISTS "admin_logado_le_inscritos" ON newsletter_subscribers;
CREATE POLICY "admin_logado_le_inscritos"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);

-- Admin LOGADO pode APAGAR um inscrito. Isso nao e conveniencia: a LGPD
-- da ao titular o direito de eliminacao dos dados, e alguem precisa poder
-- executar o pedido.
DROP POLICY IF EXISTS "admin_logado_remove_inscrito" ON newsletter_subscribers;
CREATE POLICY "admin_logado_remove_inscrito"
  ON newsletter_subscribers FOR DELETE
  TO authenticated
  USING (true);

-- Admin (service_role key, usada FORA do navegador): acesso total.
-- ⚠️ Nunca exponha a service key no front-end (nunca como NEXT_PUBLIC_*):
-- ela ignora todo o RLS acima.
DROP POLICY IF EXISTS "service_role_acesso_total" ON newsletter_subscribers;
CREATE POLICY "service_role_acesso_total"
  ON newsletter_subscribers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
