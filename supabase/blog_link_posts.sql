-- Run this in your Supabase SQL Editor to add external link post support

alter table blog_posts
  add column if not exists post_type text default 'article' check (post_type in ('article', 'link')),
  add column if not exists link_url text default '';
