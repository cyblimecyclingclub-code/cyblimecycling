import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzxyzxyz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xyzxyzxyz.supabase.co'
)

export type Ride = {
  id: string
  title: string
  date: string
  time: string
  distance_miles: number
  pace: string
  level: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced'
  meetup_location: string
  description: string
  strava_segment_url?: string
  is_published: boolean
  created_at?: string
}

export type GalleryPhoto = {
  id: string
  url: string
  alt: string
  caption: string
  order_index: number
  is_published: boolean
  created_at?: string
}

export type JoinRequest = {
  id?: string
  name: string
  email: string
  phone?: string
  experience: string
  message?: string
  status?: 'pending' | 'contacted' | 'joined' | 'declined'
  created_at?: string
}

export type SiteSetting = {
  key: string
  value: string
  label?: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  author: string
  category: string
  is_published: boolean
  published_at?: string
  created_at?: string
  updated_at?: string
  post_type?: 'article' | 'link'
  link_url?: string
}

export const BLOG_CATEGORIES = ['Ride Recap', 'Route Guide', 'Member Spotlight', 'Training Tips', 'Club News', 'Gear']
