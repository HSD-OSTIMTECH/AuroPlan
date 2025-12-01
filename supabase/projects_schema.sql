-- Aura Plan - Proje Yönetimi Şeması
-- Bu dosya Supabase SQL Editor veya CLI üzerinden uygulanabilir.

-- Gerekli extension
create extension if not exists "uuid-ossp";

--------------------------------------------------------------------------------
-- STORAGE BUCKET
--------------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', false)
on conflict (id) do nothing;

-- Var olan politikaları temizle
drop policy if exists "project asset read" on storage.objects;
drop policy if exists "project asset insert" on storage.objects;
drop policy if exists "project asset delete" on storage.objects;

-- Storage policy: Takım üyesi olan herkes kendi takımının proje dosyalarını görebilir.
-- Obje path formatı: teamId/projectId/filename
create policy "project asset read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'project-assets'
  and (
    -- teamId klasörünü path'ten alıp mevcut kullanıcı ile eşleştiriyoruz
    exists (
      select 1
      from team_members tm
      where tm.team_id::text = split_part(name, '/', 1)
        and tm.user_id = auth.uid()
    )
  )
);

create policy "project asset insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'project-assets'
  and (
    exists (
      select 1
      from team_members tm
      where tm.team_id::text = split_part(name, '/', 1)
        and tm.user_id = auth.uid()
        and tm.role in ('owner', 'admin')
    )
  )
);

create policy "project asset delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'project-assets'
  and (
    exists (
      select 1
      from team_members tm
      where tm.team_id::text = split_part(name, '/', 1)
        and tm.user_id = auth.uid()
        and tm.role in ('owner', 'admin')
    )
  )
);

--------------------------------------------------------------------------------
-- TABLE: projects
--------------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams (id) on delete cascade,
  owner_id uuid not null references auth.users (id),
  name text not null,
  slug text not null,
  description text,
  objective text,
  status text not null default 'planning'
    check (status in ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  priority text default 'medium'
    check (priority in ('low', 'medium', 'high', 'critical')),
  start_date date,
  due_date date,
  completed_at timestamptz,
  cover_image_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists projects_team_slug_idx
  on public.projects (team_id, slug);

create index if not exists projects_team_idx on public.projects (team_id);

alter table public.projects enable row level security;

create policy "team members can select projects"
on public.projects
for select
using (
  exists (
    select 1 from team_members tm
    where tm.team_id = projects.team_id
      and tm.user_id = auth.uid()
  )
);

create policy "team admins can insert projects"
on public.projects
for insert
with check (
  (
    exists (
      select 1 from team_members tm
      where tm.team_id = projects.team_id
        and tm.user_id = auth.uid()
        and tm.role in ('owner', 'admin')
    )
  )
  or (
    exists (
      select 1 from teams t
      where t.id = projects.team_id
        and t.owner_id = auth.uid()
    )
  )
);

create policy "team admins can update projects"
on public.projects
for update
using (
  (
    exists (
      select 1 from team_members tm
      where tm.team_id = projects.team_id
        and tm.user_id = auth.uid()
        and tm.role in ('owner', 'admin')
    )
  )
  or (
    exists (
      select 1 from teams t
      where t.id = projects.team_id
        and t.owner_id = auth.uid()
    )
  )
)
with check (
  (
    exists (
      select 1 from team_members tm
      where tm.team_id = projects.team_id
        and tm.user_id = auth.uid()
        and tm.role in ('owner', 'admin')
    )
  )
  or (
    exists (
      select 1 from teams t
      where t.id = projects.team_id
        and t.owner_id = auth.uid()
    )
  )
);

create policy "team owners can delete projects"
on public.projects
for delete
using (
  exists (
    select 1 from team_members tm
    where tm.team_id = projects.team_id
      and tm.user_id = auth.uid()
      and tm.role = 'owner'
  )
  or exists (
    select 1 from teams t
    where t.id = projects.team_id
      and t.owner_id = auth.uid()
  )
);

--------------------------------------------------------------------------------
-- TABLE: project_members
--------------------------------------------------------------------------------
create table if not exists public.project_members (
  id bigserial primary key,
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references auth.users (id),
  role text not null default 'contributor'
    check (role in ('owner', 'manager', 'contributor', 'viewer')),
  color_label text,
  created_at timestamptz not null default now(),
  unique (project_id, user_id)
);

alter table public.project_members enable row level security;

create policy "team members can select project_members"
on public.project_members
for select
using (
  exists (
    select 1 from public.projects p
    join public.team_members tm on tm.team_id = p.team_id
    where p.id = project_members.project_id
      and tm.user_id = auth.uid()
  )
);

create policy "project managers can manage project_members"
on public.project_members
for all
using (
  exists (
    select 1 from public.project_members pm
    where pm.project_id = project_members.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner', 'manager')
  )
)
with check (
  exists (
    select 1 from public.project_members pm
    where pm.project_id = project_members.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner', 'manager')
  )
);

--------------------------------------------------------------------------------
-- TABLE: project_milestones
--------------------------------------------------------------------------------
create table if not exists public.project_milestones (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'planned'
    check (status in ('planned', 'in_progress', 'blocked', 'done')),
  due_date date,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_milestones_project_idx
  on public.project_milestones (project_id);

alter table public.project_milestones enable row level security;

create policy "team members can select milestones"
on public.project_milestones
for select
using (
  exists (
    select 1 from public.projects p
    join public.team_members tm on tm.team_id = p.team_id
    where p.id = project_milestones.project_id
      and tm.user_id = auth.uid()
  )
);

create policy "project editors can mutate milestones"
on public.project_milestones
for all
using (
  exists (
    select 1 from public.project_members pm
    where pm.project_id = project_milestones.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner', 'manager')
  )
)
with check (
  exists (
    select 1 from public.project_members pm
    where pm.project_id = project_milestones.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner', 'manager')
  )
);

--------------------------------------------------------------------------------
-- TABLE: project_updates (aktivite ve planlama notları)
--------------------------------------------------------------------------------
create table if not exists public.project_updates (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects (id) on delete cascade,
  author_id uuid not null references auth.users (id),
  update_type text not null default 'note'
    check (update_type in ('note', 'risk', 'decision', 'retro')),
  title text not null,
  body text,
  highlight boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists project_updates_project_idx
  on public.project_updates (project_id, created_at desc);

alter table public.project_updates enable row level security;

create policy "team members can read updates"
on public.project_updates
for select
using (
  exists (
    select 1 from public.projects p
    join public.team_members tm on tm.team_id = p.team_id
    where p.id = project_updates.project_id
      and tm.user_id = auth.uid()
  )
);

create policy "project members can insert updates"
on public.project_updates
for insert
with check (
  exists (
    select 1 from public.project_members pm
    where pm.project_id = project_updates.project_id
      and pm.user_id = auth.uid()
  )
);

--------------------------------------------------------------------------------
-- TABLE: project_documents (metadata, dosya storage referansı)
--------------------------------------------------------------------------------
create table if not exists public.project_documents (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects (id) on delete cascade,
  uploader_id uuid not null references auth.users (id),
  storage_path text not null,
  file_name text not null,
  file_type text,
  file_size bigint,
  version integer not null default 1,
  description text,
  created_at timestamptz not null default now()
);

create unique index if not exists project_documents_unique_version
  on public.project_documents (project_id, storage_path, version);

alter table public.project_documents enable row level security;

create policy "team members can read documents"
on public.project_documents
for select
using (
  exists (
    select 1 from public.projects p
    join public.team_members tm on tm.team_id = p.team_id
    where p.id = project_documents.project_id
      and tm.user_id = auth.uid()
  )
);

create policy "project editors can manage documents"
on public.project_documents
for all
using (
  exists (
    select 1 from public.project_members pm
    where pm.project_id = project_documents.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner', 'manager')
  )
)
with check (
  exists (
    select 1 from public.project_members pm
    where pm.project_id = project_documents.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner', 'manager')
  )
);

--------------------------------------------------------------------------------
-- Trigger to maintain updated_at on projects & milestones
--------------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
before update on public.projects
for each row
execute function public.touch_updated_at();

drop trigger if exists project_milestones_touch_updated_at on public.project_milestones;
create trigger project_milestones_touch_updated_at
before update on public.project_milestones
for each row
execute function public.touch_updated_at();
