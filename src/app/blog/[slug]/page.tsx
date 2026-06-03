import Navbar from '@/components/Navbar'
import BlogPostView from '@/components/BlogPostView'
import Footer from '@/components/Footer'
import { createServerClient } from '@/lib/supabase-server'
import type { BlogPost } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export const revalidate = 60

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    return data
  } catch {
    return null
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  return (
    <>
      <Navbar />
      <BlogPostView post={post} />
      <Footer />
    </>
  )
}
