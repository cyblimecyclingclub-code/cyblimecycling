import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import HomepageRides from '@/components/HomepageRides'
import HomepagePlanner from '@/components/HomepagePlanner'
import HomepageJoin from '@/components/HomepageJoin'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <HomepageRides />
        <HomepagePlanner />
        <HomepageJoin />
      </main>
      <Footer />
    </>
  )
}
