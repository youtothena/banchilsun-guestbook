create extension if not exists pgcrypto;

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 12),
  relationship text not null check (char_length(relationship) between 1 and 20),
  message text not null check (char_length(message) between 1 and 140),
  mood text not null default '🥳' check (char_length(mood) between 1 and 8),
  created_at timestamptz not null default now()
);

alter table public.guestbook enable row level security;

drop policy if exists "guestbook_public_read" on public.guestbook;
create policy "guestbook_public_read"
on public.guestbook
for select
to anon, authenticated
using (true);

drop policy if exists "guestbook_public_insert" on public.guestbook;
create policy "guestbook_public_insert"
on public.guestbook
for insert
to anon, authenticated
with check (
  char_length(name) between 1 and 12
  and char_length(relationship) between 1 and 20
  and char_length(message) between 1 and 140
  and char_length(mood) between 1 and 8
);

revoke update, delete on public.guestbook from anon, authenticated;
grant select, insert on public.guestbook to anon, authenticated;

create index if not exists guestbook_created_at_idx
on public.guestbook (created_at desc);
