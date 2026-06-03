import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Default fallback values (stock images + default text)
export const DEFAULTS: Record<string, string> = {
  hero_image:  'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=1800&q=80',
  about_image: 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=800&q=80',
  join_image:  'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80',
  hero_headline_line1: 'RIDE LIKE',
  hero_headline_line2: 'YOUR LIFE',
  hero_headline_line3: 'DEPENDS ON IT.',
  hero_subtext: "CyBlime Cycling Club is Brooklyn's most passionate two-wheel community. We don't just ride — we chase miles, build bonds, and own every street we touch.",
  about_headline: 'Born in Brooklyn. Built on Passion.',
  about_body_1: 'CyBlime started in 2020 with a simple idea: get a group of Brooklyn cyclists together and ride like we mean it. No gatekeeping. No ego. Just people who love the sport showing up every weekend, rain or shine.',
  about_body_2: "Four years later, we're 31 strong on Strava, 1,300+ deep on Instagram, and we've logged thousands of miles across Brooklyn, Queens, Manhattan and beyond.",
}

export type SettingsMap = Record<string, string>

export async function getSettings(keys?: string[]): Promise<SettingsMap> {
  try {
    let query = supabase.from('site_settings').select('key, value')
    if (keys?.length) {
      query = query.in('key', keys)
    }
    const { data } = await query
    const map: SettingsMap = { ...DEFAULTS }
    if (data) {
      for (const row of data) {
        if (row.value) map[row.key] = row.value
      }
    }
    return map
  } catch {
    return { ...DEFAULTS }
  }
}
