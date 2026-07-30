-- ============================================================
-- Newsletter Schema for Psiangelo
-- Rode este script no SQL Editor do painel do Supabase.
-- ============================================================

-- Tabela de inscritos na lista de e-mail.
-- `email` é único (constraint abaixo) para nunca duplicar um inscrito;
-- o app trata a violação de unicidade como sucesso silencioso (a pessoa
-- já está na lista), então essa constraint é o que sustenta esse comportamento.
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'home',        -- de onde veio a inscrição: 'home', 'blog-post', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT newsletter_subscribers_email_key UNIQUE (email)
);

-- Índice para consulta por data (exportar lista em ordem de chegada).
CREATE INDEX idx_newsletter_subscribers_created_at
  ON newsletter_subscribers (created_at DESC);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anônimo (o visitante do site, via anon key): pode SE INSCREVER (insert),
-- mas não pode LER a lista. Sem essa restrição, qualquer pessoa com a
-- anon key (que fica embutida no bundle público) conseguiria ler a lista
-- inteira de e-mails de todo mundo que já se inscreveu.
CREATE POLICY "Anonimo pode se inscrever"
  ON newsletter_subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anônimo NÃO pode ler a lista. Não é preciso uma policy de SELECT para o
-- anon: sem policy de SELECT para essa role, o RLS já bloqueia a leitura
-- por padrão. Esta linha existe só para deixar a intenção explícita e
-- documentada (nenhuma policy de leitura para "anon" foi criada de propósito).

-- Admin (service_role key, usada fora do navegador): acesso total, para
-- o dono exportar/gerenciar a lista fora do painel do Supabase se quiser.
CREATE POLICY "Service role acesso total"
  ON newsletter_subscribers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
