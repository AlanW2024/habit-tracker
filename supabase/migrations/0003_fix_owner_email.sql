-- Keep local migrations aligned with the production fix applied on 2026-05-09.
create or replace function owner_email() returns text
  language sql immutable security definer
  as $$ select 'alanwong23032023@gmail.com' $$;
