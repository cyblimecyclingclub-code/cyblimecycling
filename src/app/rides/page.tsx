import SnapPage, { SnapSection } from '@/components/SnapPage'
import Navbar from '@/components/Navbar'
import RidesContent from '@/components/RidesContent'
import Footer from '@/components/Footer'

export const metadata = { title: 'Rides | CyBlime Cycling Club' }

export default function RidesPage() {
  return (
    <>
      <Navbar />
      <SnapPage>
        <SnapSection bg="#0A0A0A">
          <RidesContent />
        </SnapSection>
      </SnapPage>
      <Footer />
    </>
  )
}
