import Navbar from '@/components/Navbar'
import Gallery from '@/components/Gallery'
import { createServerClient } from '@/lib/supabase-server'
import type { GalleryPhoto } from '@/lib/supabase'

export const metadata = { title: 'Gallery | CyBlime Cycling Club' }
export const revalidate = 60

async function getPhotos(): Promise<GalleryPhoto[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true })
    return data || []
  } catch {
    return []
  }
}

export default async function GalleryPage() {
  const photos = await getPhotos()
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen" style={{ background: '#111111' }}>
        <Gallery photos={photos} />
      </main>
    </>
  )
}
