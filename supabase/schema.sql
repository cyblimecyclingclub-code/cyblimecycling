-- CyBlime Cycling Club — Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Rides table
create table if not exists rides (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  date text not null,
  time text not null,
  distance_miles numeric not null default 0,
  pace text not null default '15-17 mph',
  level text not null default 'All Levels',
  meetup_location text not null,
  description text,
  strava_segment_url text,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Gallery table
create table if not exists gallery (
  id uuid default uuid_generate_v4() primary key,
  url text not null,
  alt text default '',
  caption text default '',
  order_index integer default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- Join requests table
create table if not exists join_requests (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  experience text not null,
  message text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Site settings (CMS key/value store)
create table if not exists site_settings (
  key text primary key,
  value text not null default '',
  label text,
  updated_at timestamptz default now()
);

-- Seed default site settings
insert into site_settings (key, label, value) values
  ('hero_headline_line1', 'Hero — Line 1', 'RIDE LIKE YOUR'),
  ('hero_headline_line2', 'Hero — Line 2 (orange)', 'LIFE DEPENDS'),
  ('hero_headline_line3', 'Hero — Line 3', 'ON IT.'),
  ('hero_subtext', 'Hero — Subtext', 'CyBlime Cycling Club is Brooklyn''s most passionate two-wheel community. We don''t just ride — we chase miles, build bonds, and own every street we touch.'),
  ('about_headline', 'About — Headline', 'Born in Brooklyn. Built on Passion.'),
  ('about_body_1', 'About — Paragraph 1', 'CyBlime started in 2020 with a simple idea: get a group of Brooklyn cyclists together and ride like we mean it. No gatekeeping. No ego. Just people who love the sport showing up every weekend, rain or shine.'),
  ('about_body_2', 'About — Paragraph 2', 'Four years later, we''re 31 strong on Strava, 1,300+ deep on Instagram, and we''ve logged thousands of miles across Brooklyn, Queens, Manhattan and beyond.'),
  ('rides_headline', 'Rides — Headline', 'Next on the Road'),
  ('join_headline', 'Join — Headline', 'Ready to Roll With Us?'),
  ('join_subtext', 'Join — Subtext', 'We ride every weekend, year-round. No dues, no politics — just show up, clip in, and keep up.')
on conflict (key) do nothing;

-- Seed sample rides
insert into rides (title, date, time, distance_miles, pace, level, meetup_location, description, is_published) values
  ('Saturday Morning Brooklyn Loop', 'Sat, Jun 7', '7:00 AM', 35, '16–18 mph', 'Intermediate', 'Grand Army Plaza, Brooklyn', 'Our flagship weekly ride. We roll from Grand Army Plaza, hit Prospect Park, then cruise through Bay Ridge, along the waterfront, and back. Coffee stop at the end.', true),
  ('Sunday Easy Spin — Prospect Park', 'Sun, Jun 8', '8:00 AM', 15, '12–14 mph', 'All Levels', 'Prospect Park Boathouse', 'No drop, no stress. Perfect for new members or anyone shaking off Saturday''s legs. We do 3 laps and grab breakfast after.', true),
  ('Bridges & Boroughs — NYC Epic', 'Sat, Jun 14', '6:30 AM', 65, '18–20 mph', 'Advanced', 'Brooklyn Bridge Park, Pier 1', 'The big one. Manhattan Bridge → Central Park → GW Bridge → Palisades → back over the Verrazzano. Serious riders only.', true),
  ('Weeknight Flatbush Hammerfest', 'Wed, Jun 11', '6:30 PM', 25, '18–20 mph', 'Advanced', 'Prospect Park, Ocean Ave entrance', 'Fast midweek blast. No waiting, no mercy. If you can hold the wheel, you''re welcome.', true)
on conflict do nothing;

-- RLS Policies
alter table rides enable row level security;
alter table gallery enable row level security;
alter table join_requests enable row level security;
alter table site_settings enable row level security;

-- Public can read published rides, gallery, settings
create policy "Public read rides" on rides for select using (is_published = true);
create policy "Public read gallery" on gallery for select using (is_published = true);
create policy "Public read settings" on site_settings for select using (true);

-- Public can insert join requests
create policy "Public insert join_requests" on join_requests for insert with check (true);

-- Authenticated users (admin) can do everything
create policy "Admin all rides" on rides for all using (auth.role() = 'authenticated');
create policy "Admin all gallery" on gallery for all using (auth.role() = 'authenticated');
create policy "Admin all join_requests" on join_requests for all using (auth.role() = 'authenticated');
create policy "Admin all settings" on site_settings for all using (auth.role() = 'authenticated');
