-- Add default image settings to site_settings
-- Run in Supabase SQL editor

INSERT INTO site_settings (key, value, label) VALUES
  ('hero_image',  'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=1800&q=80', 'Hero Background Image'),
  ('about_image', 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=800&q=80',  'About Section Image'),
  ('join_image',  'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80',  'Join Section Image')
ON CONFLICT (key) DO NOTHING;
