create table beds (
  id uuid primary key,
  name text not null default 'New Bed',
  owner text not null default '',
  type text not null default '',
  color text not null default '#4ade80',
  points jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table plants (
  id uuid primary key,
  bed_id uuid not null references beds(id) on delete cascade,
  name text not null,
  date_planted text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (open access for now — add auth policies later)
alter table beds enable row level security;
alter table plants enable row level security;

create policy "Allow all access to beds" on beds for all using (true) with check (true);
create policy "Allow all access to plants" on plants for all using (true) with check (true);
