-- Phase 2: Auth + RLS lockdown
-- Single-user app. Owner email hardcoded in SQL function.
-- Anyone else who magic-link signs up will pass auth but get 0 rows from RLS.

-- 1. Owner email function — single source of truth
create or replace function owner_email() returns text
  language sql immutable security definer
  as $$ select 'alanwongra@gmail.com' $$;

-- 2. Enable RLS on every data table
alter table profiles      enable row level security;
alter table habits        enable row level security;
alter table habit_logs    enable row level security;
alter table streak_state  enable row level security;
alter table draw_cards    enable row level security;
alter table draw_log      enable row level security;

-- 3. Policies — only the owner email can SELECT/INSERT/UPDATE/DELETE
-- "for all" covers all 4 verbs in one policy (USING + WITH CHECK both apply).
create policy "owner only" on profiles
  for all to authenticated
  using (auth.email() = owner_email())
  with check (auth.email() = owner_email());

create policy "owner only" on habits
  for all to authenticated
  using (auth.email() = owner_email())
  with check (auth.email() = owner_email());

create policy "owner only" on habit_logs
  for all to authenticated
  using (auth.email() = owner_email())
  with check (auth.email() = owner_email());

create policy "owner only" on streak_state
  for all to authenticated
  using (auth.email() = owner_email())
  with check (auth.email() = owner_email());

create policy "owner only" on draw_cards
  for all to authenticated
  using (auth.email() = owner_email())
  with check (auth.email() = owner_email());

create policy "owner only" on draw_log
  for all to authenticated
  using (auth.email() = owner_email())
  with check (auth.email() = owner_email());

-- Note: today_completion view inherits RLS from base tables. No separate policy needed.
