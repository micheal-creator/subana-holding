create extension if not exists "pgcrypto";
create table if not exists public.site_settings (id text primary key default 'global', data jsonb not null default '{}', updated_at timestamptz default now());
create table if not exists public.site_content (id uuid primary key default gen_random_uuid(), collection text not null, slug text not null, data jsonb not null default '{}', status text not null default 'draft', sort_order integer not null default 0, updated_at timestamptz default now(), unique(collection, slug));
create table if not exists public.media (id uuid primary key default gen_random_uuid(), path text not null, alt text, created_at timestamptz default now());
create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, email text, is_admin boolean default false, created_at timestamptz default now());
alter table public.site_settings enable row level security;
alter table public.site_content enable row level security;
alter table public.media enable row level security;
alter table public.profiles enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select coalesce((select is_admin from profiles where id=auth.uid()), false); $$;
create policy "public can read published content" on public.site_content for select using (status='published' or public.is_admin());
create policy "admins manage content" on public.site_content for all using (public.is_admin()) with check (public.is_admin());
create policy "public can read settings" on public.site_settings for select using (true);
create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "public can read media" on public.media for select using (true);
create policy "admins manage media" on public.media for all using (public.is_admin()) with check (public.is_admin());
create policy "users read own profile" on public.profiles for select using (auth.uid()=id);
insert into storage.buckets (id, name, public) values ('site-media','site-media',true) on conflict (id) do nothing;
create policy "public media read" on storage.objects for select using (bucket_id='site-media');
create policy "admin media insert" on storage.objects for insert with check (bucket_id='site-media' and public.is_admin());
create policy "admin media update" on storage.objects for update using (bucket_id='site-media' and public.is_admin());
create policy "admin media delete" on storage.objects for delete using (bucket_id='site-media' and public.is_admin());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,email) values(new.id,new.email) on conflict(id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
