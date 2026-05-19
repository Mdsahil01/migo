-- MIGO events intelligence schema
-- Run in Supabase SQL editor or via CLI: supabase db push

alter table public.events
  add column if not exists short_description text,
  add column if not exists full_description text,
  add column if not exists mode text,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists max_team_size bigint,
  add column if not exists min_team_size bigint,
  add column if not exists registration_deadline timestamptz,
  add column if not exists organizer_type text,
  add column if not exists prize_pool text,
  add column if not exists tags text[],
  add column if not exists source_platform text;

comment on column public.events.short_description is 'Concise operational summary for lists and alerts';
comment on column public.events.full_description is 'Detailed source content for mission review';
comment on column public.events.mode is 'online | offline | hybrid';
comment on column public.events.source_platform is 'Ingestion source e.g. Devfolio';
