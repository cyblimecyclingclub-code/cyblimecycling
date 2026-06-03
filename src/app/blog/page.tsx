import Navbar from '@/components/Navbar'
import BlogList from '@/components/BlogList'
import Footer from '@/components/Footer'
import { createServerClient } from '@/lib/supabase-server'
import type { BlogPost } from '@/lib/supabase'

export const metadata = { title: 'Blog | CyBlime Cycling Club' }
export const revalidate = 60

async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
    return data || []
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()
  return (
    <>
      <Navbar />
      <BlogList posts={posts} />
      <Footer />
    </>
  )
}
