create table beds_dev (
  id uuid primary key,
  name text not null default 'New Bed',
  owner text not null default '',
  type text not null default '',
  color text not null default '#4ade80',
  points jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table plants_dev (
  id uuid primary key,
  bed_id uuid not null references beds_dev(id) on delete cascade,
  name text not null,
  date_planted text,
  created_at timestamptz not null default now()
);

alter table beds_dev enable row level security;
alter table plants_dev enable row level security;

create policy "Allow all access to beds_dev" on beds_dev for all using (true) with check (true);
create policy "Allow all access to plants_dev" on plants_dev for all using (true) with check (true);
