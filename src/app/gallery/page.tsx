import SnapPage, { SnapSection } from '@/components/SnapPage'
import Navbar from '@/components/Navbar'
import Gallery from '@/components/Gallery'

export const metadata = { title: 'Gallery | CyBlime Cycling Club' }

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <SnapPage>
        <SnapSection bg="#111111">
          <Gallery />
        </SnapSection>
      </SnapPage>
    </>
  )
}
