-- OAB Simulado — Schema Supabase
-- Execute no SQL Editor do Supabase Dashboard

-- ─── Extensões ────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Tabela: users ────────────────────────────────────────────
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  name        text,
  picture     text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Tabela: subscriptions ────────────────────────────────────
create table if not exists public.subscriptions (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.users(id) on delete cascade,
  stripe_customer_id  text,
  stripe_sub_id       text unique,
  mp_payment_id       text,
  plano               text check (plano in ('mensal', 'trimestral', 'semestral')),
  status              text not null default 'none' check (status in ('active', 'canceled', 'past_due', 'trialing', 'none')),
  valido_ate          timestamptz,
  acesso_manual       boolean not null default false,
  acesso_manual_obs   text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create unique index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

-- ─── Tabela: simulado_sessions ────────────────────────────────
create table if not exists public.simulado_sessions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  data        timestamptz not null default now(),
  total       int not null,
  acertos     int not null,
  opcoes      jsonb,
  resultado   jsonb
);

create index if not exists sessions_user_idx on public.simulado_sessions(user_id);

-- ─── Row Level Security ────────────────────────────────────────
alter table public.users          enable row level security;
alter table public.subscriptions  enable row level security;
alter table public.simulado_sessions enable row level security;

-- users: cada usuário lê/atualiza apenas a si mesmo
create policy "users_self_select" on public.users
  for select using (auth.uid() = id);

create policy "users_self_update" on public.users
  for update using (auth.uid() = id);

-- subscriptions: cada usuário lê a própria
create policy "subs_self_select" on public.subscriptions
  for select using (auth.uid() = user_id);

-- simulado_sessions: cada usuário gerencia as próprias
create policy "sessions_self" on public.simulado_sessions
  for all using (auth.uid() = user_id);

-- ─── Trigger: auto-criar user após signup ─────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name, picture)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Função: atualizar updated_at automaticamente ─────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at before update on public.users
  for each row execute procedure public.set_updated_at();

create trigger subs_updated_at before update on public.subscriptions
  for each row execute procedure public.set_updated_at();
