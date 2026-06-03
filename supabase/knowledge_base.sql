-- Run this in your Supabase SQL Editor

-- Table to store parsed knowledge base text
create table if not exists knowledge_base (
  id uuid default uuid_generate_v4() primary key,
  file_name text not null,
  content text not null,
  updated_at timestamptz default now()
);

-- Only one row allowed (upsert by file_name)
alter table knowledge_base enable row level security;
create policy "Public read knowledge_base" on knowledge_base for select using (true);
create policy "Admin write knowledge_base" on knowledge_base for all using (auth.role() = 'authenticated');

-- Storage bucket for knowledge base PDFs (run separately if needed)
-- insert into storage.buckets (id, name, public) values ('knowledge', 'knowledge', false);
