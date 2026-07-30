-- ============================================================
-- site_content — snapshots do painel admin publicados pro site
-- ============================================================
-- Fluxo:
--   admin edita (localStorage) → aba "Publicar" chama publishSnapshot()
--   → INSERT em site_content → visitantes pegam o snapshot mais novo
--   → ContentBootstrap popula localStorage deles.
--
-- Cada publicação cria um registro novo (histórico preservado).
-- O cliente sempre busca o de maior `version`.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists site_content (
  id           uuid primary key default gen_random_uuid(),
  version      bigint not null,              -- Date.now() no momento da publicação
  published_at timestamptz not null default now(),
  note         text,
  data         jsonb not null                -- objeto { "angelo_admin_*": <valor> }
);

create index if not exists site_content_version_idx
  on site_content (version desc);

-- ============================================================
-- RLS: leitura publica, escrita para ADMIN LOGADO
-- ============================================================
-- ⚠️ 2026-07-30 — mudanca de seguranca. Rode este bloco de novo se o
-- banco ainda estiver na versao antiga.
--
-- Antes: nao havia policy de INSERT, e o PublishManager escrevia com a
-- service key, exposta no site como NEXT_PUBLIC_SUPABASE_SERVICE_KEY. No
-- Next, NEXT_PUBLIC_* vai para o bundle publico: a chave estava servida no
-- JavaScript, e ela IGNORA o RLS. Qualquer visitante podia ler, alterar e
-- apagar qualquer tabela do projeto.
--
-- Agora: publicar exige sessao autenticada (login do admin no Supabase
-- Auth), e o RLS abaixo e o que autoriza. Nao voltar a usar service key
-- no cliente.
alter table site_content enable row level security;

drop policy if exists "site_content anon read" on site_content;
create policy "site_content anon read"
  on site_content for select
  to anon, authenticated
  using (true);

-- Publicar: qualquer usuario autenticado insere. O unico usuario do projeto
-- e o proprio Angelo (criado a mao em Authentication > Users; signup nao
-- deve ficar aberto no painel do Supabase, senao qualquer pessoa cria conta
-- e ganha permissao de publicar).
drop policy if exists "site_content authenticated insert" on site_content;
create policy "site_content authenticated insert"
  on site_content for insert
  to authenticated
  with check (true);

-- Sem UPDATE nem DELETE para ninguem: cada publicacao e um registro novo, e
-- o historico e imutavel de proposito (permite voltar a uma versao anterior).
