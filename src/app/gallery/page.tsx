import Navbar from '@/components/Navbar'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'

export const metadata = { title: 'Gallery | CyBlime Cycling Club' }

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen" style={{ background: '#111111' }}>
        <Gallery />
      </main>
      <Footer />
    </>
  )
}
