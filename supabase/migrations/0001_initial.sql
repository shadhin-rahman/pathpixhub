-- ============================================================
-- PathPixHub — Account / Credits system (Level 2)
-- Run this in the Supabase SQL Editor (or apply via migrations).
-- ============================================================

-- ---------- Helper: is the current user an admin? ----------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- ---------- profiles (one row per auth.users row) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text default '',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  credits_balance integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- orders ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default '',
  description text default '',
  service text default '',
  image_count integer not null default 0,
  credit_cost integer not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- credit_transactions (ledger) ----------
create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  change integer not null default 0, -- positive = added, negative = spent
  reason text not null default '',
  created_at timestamptz not null default now()
);

-- ---------- RLS: enable on all tables ----------
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.credit_transactions enable row level security;

-- profiles: a user can read/update their own row; admins can manage all.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- orders: a user sees their own; admins see all.
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own"
  on public.orders for insert
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin"
  on public.orders for update
  using (public.is_admin());

-- credit_transactions: a user sees their own; admins see all.
drop policy if exists "credit_transactions_select_own" on public.credit_transactions;
create policy "credit_transactions_select_own"
  on public.credit_transactions for select
  using (user_id = auth.uid() or public.is_admin());

-- ---------- credit balance updates (admin only) ----------
-- Atomically adjusts a user's balance and logs the ledger entry.
create or replace function public.adjust_credits(
  p_user_id uuid,
  p_change integer,
  p_reason text default ''
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Forbidden: admin only';
  end if;

  update public.profiles
  set credits_balance = credits_balance + p_change,
      updated_at = now()
  where id = p_user_id;

  if p_change <> 0 then
    insert into public.credit_transactions (user_id, change, reason)
    values (p_user_id, p_change, coalesce(p_reason, ''));
  end if;
end;
$$;

-- Make the function callable by authenticated users.
revoke all on function public.adjust_credits(uuid, integer, text) from public;
grant execute on function public.adjust_credits(uuid, integer, text) to authenticated;

-- ---------- refresh updated_at ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------- storage buckets ----------
-- Clients upload proof/order images here (admin reviews them).
insert into storage.buckets (id, name, public)
values ('client-uploads', 'client-uploads', false)
on conflict (id) do nothing;
