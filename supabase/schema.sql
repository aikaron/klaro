-- Schéma Facturo : à exécuter dans l'éditeur SQL de ton projet Supabase (Database > SQL Editor)

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  company_name text,
  full_name text,
  address text,
  siret text,
  plan text not null default 'free', -- 'free' | 'pro'
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  email text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  number text not null,
  type text not null default 'invoice', -- 'invoice' | 'quote'
  status text not null default 'draft', -- 'draft' | 'sent' | 'paid' | 'overdue'
  issue_date date not null default current_date,
  due_date date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  description text not null,
  quantity numeric not null default 1,
  unit_price numeric not null default 0
);

-- Row Level Security : chaque utilisateur ne voit que ses propres données
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

create policy "clients_all_own" on public.clients for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "invoices_all_own" on public.invoices for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "invoice_items_all_own" on public.invoice_items for all
  using (auth.uid() = (select user_id from public.invoices where id = invoice_id))
  with check (auth.uid() = (select user_id from public.invoices where id = invoice_id));

-- Crée automatiquement un profil (plan gratuit) à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
