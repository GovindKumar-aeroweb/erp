-- Run this in Supabase SQL Editor.
-- It aligns the database with the app, which uses public.profiles everywhere.

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid references public.schools(id) on delete cascade,
  email varchar(255) unique not null,
  full_name varchar(255) not null,
  role varchar(50) not null check (
    role in (
      'super_admin',
      'school_admin',
      'principal',
      'teacher',
      'student',
      'parent',
      'accountant',
      'librarian',
      'transport_manager',
      'hr_manager',
      'admission_counsellor'
    )
  ),
  phone varchar(50),
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create or replace function public.get_user_school_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select school_id from public.profiles where id = auth.uid();
$$;

create or replace function public.get_user_role()
returns varchar
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Move old data from public.users into public.profiles if needed.
insert into public.profiles (id, school_id, email, full_name, role, phone, avatar_url, is_active, created_at, updated_at)
select u.id, u.school_id, u.email, u.full_name, u.role, u.phone, u.avatar_url, coalesce(u.is_active, true), coalesce(u.created_at, now()), coalesce(u.updated_at, now())
from public.users u
where exists (select 1 from auth.users au where au.id = u.id)
on conflict (id) do update set
  school_id = excluded.school_id,
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  phone = excluded.phone,
  avatar_url = excluded.avatar_url,
  is_active = excluded.is_active,
  updated_at = now();

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles in their school" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

create policy "Users can view their own profile"
on public.profiles
for select
using (id = auth.uid());

create policy "Users can view profiles in their school"
on public.profiles
for select
using (
  school_id = public.get_user_school_id()
  or public.get_user_role() = 'super_admin'
);

create policy "Admins can insert profiles"
on public.profiles
for insert
with check (
  (
    school_id = public.get_user_school_id()
    and public.get_user_role() = 'school_admin'
  )
  or public.get_user_role() = 'super_admin'
);

create policy "Admins can update profiles"
on public.profiles
for update
using (
  (
    school_id = public.get_user_school_id()
    and public.get_user_role() in ('school_admin', 'principal')
  )
  or public.get_user_role() = 'super_admin'
)
with check (
  (
    school_id = public.get_user_school_id()
    and public.get_user_role() in ('school_admin', 'principal')
  )
  or public.get_user_role() = 'super_admin'
);

create policy "Admins can delete profiles"
on public.profiles
for delete
using (
  (
    school_id = public.get_user_school_id()
    and public.get_user_role() in ('school_admin', 'principal')
  )
  or public.get_user_role() = 'super_admin'
);

-- Strengthen students RLS for insert/update too.
DROP POLICY IF EXISTS "Users can view students in their school" ON public.students;
DROP POLICY IF EXISTS "Admins can manage students" ON public.students;

create policy "Users can view students in their school"
on public.students
for select
using (
  school_id = public.get_user_school_id()
  or public.get_user_role() = 'super_admin'
);

create policy "Admins can manage students"
on public.students
for all
using (
  (
    school_id = public.get_user_school_id()
    and public.get_user_role() in ('school_admin', 'principal', 'admission_counsellor')
  )
  or public.get_user_role() = 'super_admin'
)
with check (
  (
    school_id = public.get_user_school_id()
    and public.get_user_role() in ('school_admin', 'principal', 'admission_counsellor')
  )
  or public.get_user_role() = 'super_admin'
);
