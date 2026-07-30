-- ============================================================
-- Newsletter — Psiangelo
-- Rode este script no SQL Editor do painel do Supabase.
--
-- Sem acentuacao nos comentarios de proposito: acento se perde em
-- alguns caminhos de copia/cola e quebra o parse no editor.
--
-- Idempotente: pode rodar de novo sem quebrar.
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
-- extraisse baixaria a lista inteira de e-mails. A ausencia de policy
-- de SELECT para `anon` e o que bloqueia (o RLS nega por padrao).
-- Nao crie uma policy de SELECT para `anon`.

-- Admin (service_role key, usada fora do navegador): acesso total, para
-- exportar ou gerenciar a lista fora do painel do Supabase.
DROP POLICY IF EXISTS "service_role_acesso_total" ON newsletter_subscribers;
CREATE POLICY "service_role_acesso_total"
  ON newsletter_subscribers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
