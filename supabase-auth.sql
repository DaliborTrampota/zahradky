-- Profiles table (shared between dev and prod — tied to auth.users which is global)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Anyone can read profiles"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================
-- beds: anyone reads, logged-in users edit, admin creates/deletes
-- =============================================================

drop policy if exists "Allow all access to beds" on beds;

create policy "Anyone can read beds"
  on beds for select using (true);

create policy "Authenticated can update beds"
  on beds for update using (auth.role() = 'authenticated');

create policy "Admin can insert beds"
  on beds for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can delete beds"
  on beds for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- =============================================================
-- plants: anyone reads, logged-in users can add/edit/remove
-- =============================================================

drop policy if exists "Allow all access to plants" on plants;

create policy "Anyone can read plants"
  on plants for select using (true);

create policy "Authenticated can insert plants"
  on plants for insert with check (auth.role() = 'authenticated');

create policy "Authenticated can update plants"
  on plants for update using (auth.role() = 'authenticated');

create policy "Authenticated can delete plants"
  on plants for delete using (auth.role() = 'authenticated');

-- =============================================================
-- beds_dev: same as beds
-- =============================================================

drop policy if exists "Allow all access to beds_dev" on beds_dev;

create policy "Anyone can read beds_dev"
  on beds_dev for select using (true);

create policy "Authenticated can update beds_dev"
  on beds_dev for update using (auth.role() = 'authenticated');

create policy "Admin can insert beds_dev"
  on beds_dev for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can delete beds_dev"
  on beds_dev for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- =============================================================
-- plants_dev: same as plants
-- =============================================================

drop policy if exists "Allow all access to plants_dev" on plants_dev;

create policy "Anyone can read plants_dev"
  on plants_dev for select using (true);

create policy "Authenticated can insert plants_dev"
  on plants_dev for insert with check (auth.role() = 'authenticated');

create policy "Authenticated can update plants_dev"
  on plants_dev for update using (auth.role() = 'authenticated');

create policy "Authenticated can delete plants_dev"
  on plants_dev for delete using (auth.role() = 'authenticated');

-- =============================================================
-- SETUP: After running this, create your admin user in Supabase
-- Dashboard (Authentication > Users > Add user), then promote:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
-- =============================================================
