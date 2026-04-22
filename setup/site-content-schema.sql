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

-- RLS: leitura pública, escrita via service_role (bypassa RLS)
alter table site_content enable row level security;

drop policy if exists "site_content anon read" on site_content;
create policy "site_content anon read"
  on site_content for select
  to anon, authenticated
  using (true);

-- Sem policy de INSERT/UPDATE/DELETE: apenas service_role pode escrever.
-- PublishManager usa NEXT_PUBLIC_SUPABASE_SERVICE_KEY (mesmo padrão do blog).
