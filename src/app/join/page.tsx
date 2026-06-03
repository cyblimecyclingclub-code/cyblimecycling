import SnapPage, { SnapSection } from '@/components/SnapPage'
import Navbar from '@/components/Navbar'
import Join from '@/components/Join'

export const metadata = { title: 'Join | CyBlime Cycling Club' }

export default function JoinPage() {
  return (
    <>
      <Navbar />
      <SnapPage>
        <SnapSection bg="#0A0A0A">
          <Join />
        </SnapSection>
      </SnapPage>
    </>
  )
}
