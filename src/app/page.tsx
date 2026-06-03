import SnapPage, { SnapSection } from '@/components/SnapPage'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'

export default function Home() {
  return (
    <>
      <Navbar />
      <SnapPage>
        <SnapSection bg="#0A0A0A">
          <Hero />
        </SnapSection>
        <SnapSection bg="#111111" id="about">
          <About />
        </SnapSection>
      </SnapPage>
    </>
  )
}
