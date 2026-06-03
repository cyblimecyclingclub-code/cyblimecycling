-- Run this in your Supabase SQL Editor

create table if not exists blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  excerpt text default '',
  content text not null default '',
  cover_image text default '',
  author text default 'CyBlime Cycling Club',
  category text default 'Ride Recap',
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table blog_posts enable row level security;
create policy "Public read published posts" on blog_posts for select using (is_published = true);
create policy "Admin all blog_posts" on blog_posts for all using (auth.role() = 'authenticated');

-- Seed 3 sample posts
insert into blog_posts (title, slug, excerpt, content, cover_image, author, category, is_published, published_at) values
(
  'Bridges & Boroughs 2025 — We Conquered All Five',
  'bridges-boroughs-2025',
  'Saturday we did the unthinkable — 65 miles, 5 bridges, 4 boroughs. Here''s how it went down.',
  '## The Morning

6:30 AM. Brooklyn Bridge Park, Pier 1. The sky was still purple.

Twenty-two CyBlime riders rolled out into the quiet city streets — the kind of quiet you only get before 7 AM in New York. Cold air, empty roads, and the kind of nervous energy you feel before something big.

This was our annual Bridges & Boroughs epic. 65 miles. Every borough except Staten Island. No mercy.

## The Route

We crossed the **Manhattan Bridge** first, weaving through Chinatown before dawn broke over the East River. From there, up through the East Village, across Central Park at sunrise — honestly one of the most beautiful things you''ll ever do on a bike.

Then north to the **George Washington Bridge**. The upper level at 9 AM with almost no traffic is a different world. The views of the Hudson hit different when your legs are already burning.

**Palisades Interstate Park** gave us a 20-mile stretch of pure road cycling bliss before we turned back toward the city.

## The Hurt

Miles 45–55 were where people found out what they''re made of. The climb back from the Palisades is deceptively punishing. Two riders bonked. Three more cramped up. We waited for everyone.

That''s the CyBlime way — no one gets left behind, no matter how fast or slow.

## The Finish

We rolled back over the **Verrazzano Bridge** into Brooklyn at 1:47 PM. Seven hours and eleven minutes after we left.

David M. led the whole thing. Juan Carlos held tempo for 40 miles straight. The entire crew showed up.

## Next Time

We''re doing this again in October. Mark it.

— CyBlime',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  'CyBlime',
  'Ride Recap',
  true,
  now() - interval '3 days'
),
(
  'The 5 Best Brooklyn Cycling Routes You''re Not Doing',
  'best-brooklyn-cycling-routes',
  'We''ve logged thousands of miles across the borough. Here are the five routes every Brooklyn cyclist needs to know.',
  '## 1. The Bay Ridge Waterfront Loop

**Distance:** 22 miles | **Difficulty:** Easy-Moderate

Start at Prospect Park and head south on Ocean Pkwy bike path — one of the oldest protected bike lanes in the country. Hit Shore Parkway along the water, loop around Bay Ridge, and grind back up through Sunset Park.

**Why it''s great:** Flat, mostly protected, stunning harbor views. Perfect for new members.

## 2. The Prospect Park Intervals

**Distance:** 3.35 miles per loop | **Difficulty:** Depends on you

Just laps. But done right — progressive effort, chasing Strava segments, sprinting the finish on Wellhouse Drive — this is one of the best training tools in NYC.

**Why it''s great:** Zero traffic. Measurable. You can do 3 easy laps or 10 hard ones.

## 3. Floyd Bennett Field Sprint Circuit

**Distance:** 20 miles with loops | **Difficulty:** Moderate

Flattest roads in Brooklyn. Old airport runways. No cars. Perfect for hammering.

**Why it''s great:** If you want to go fast in a straight line with no obstacles, this is your place.

## 4. Brooklyn to Central Park

**Distance:** 20 miles one way | **Difficulty:** Moderate

Manhattan Bridge → Canal St → Hudson River Greenway → Central Park. The full NYC cycling experience.

**Why it''s great:** The Hudson River Greenway is world-class infrastructure. Do it on a weekday morning.

## 5. The Coney Island Classic

**Distance:** 28 miles round trip | **Difficulty:** Easy

Ocean Pkwy to Coney Island. Get a Nathan''s hot dog. Ride back.

**Why it''s great:** It''s classic Brooklyn. Every cyclist should do it at least once.

---

*Join CyBlime every Saturday morning at Grand Army Plaza — we ride all of these and more.*',
  'https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=1200&q=80',
  'CyBlime',
  'Route Guide',
  true,
  now() - interval '7 days'
),
(
  'Member Spotlight: David M. — The Engine of CyBlime',
  'member-spotlight-david-m',
  'Every club has that one rider who sets the tone. For CyBlime, that''s David. We sat down with our Strava leaderboard king.',
  '## Who is David M.?

If you''ve ever ridden with CyBlime, you know the wheel you''re trying to hold. That''s David.

He''s been with the club since 2021 and has topped our Strava leaderboard more weeks than anyone can count. Last week alone: 133 miles, 22 hours of saddle time.

We caught up with him after Saturday''s ride.

---

**How did you get into cycling?**

*"I used to run marathons. Blew out my knee in 2019. Doctor said find something low impact. Bought a bike. Never looked back."*

**What does a typical training week look like?**

*"Monday rest. Tuesday and Thursday I do Prospect Park intervals before work — 5:30 AM. Saturday is the CyBlime group ride, that''s non-negotiable. Sunday I either rest or do an easy spin depending on how Saturday went."*

**What makes CyBlime different from other clubs?**

*"Most clubs have a culture problem — too fast for beginners, too slow for racers, or just too much ego. CyBlime doesn''t have that. We ride hard but we wait for each other. That''s rare."*

**Advice for new riders joining the club?**

*"Just show up. Don''t worry about your pace or your bike. Show up, keep pedaling, and you''ll get faster. I promise."*

---

David will be leading our next **Bridges & Boroughs** epic in October. If you want to hold his wheel for 65 miles, start training now.

*Want to be featured in a member spotlight? DM us on Instagram @brooklyncyblimecycling.*',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80',
  'CyBlime',
  'Member Spotlight',
  true,
  now() - interval '14 days'
)
on conflict (slug) do nothing;
