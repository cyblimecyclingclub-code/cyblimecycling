import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import HomepageRides from '@/components/HomepageRides'
import HomepagePlanner from '@/components/HomepagePlanner'
import HomepageJoin from '@/components/HomepageJoin'
import Footer from '@/components/Footer'
import { getSettings } from '@/lib/settings'

export const revalidate = 60

export default async function Home() {
  const settings = await getSettings(['hero_image', 'about_image', 'join_image'])

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero image={settings.hero_image} />
        <About image={settings.about_image} />
        <HomepageRides />
        <HomepagePlanner />
        <HomepageJoin image={settings.join_image} />
      </main>
      <Footer />
    </>
  )
}
