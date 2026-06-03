import Navbar from '@/components/Navbar'
import AiRidePlanner from '@/components/AiRidePlanner'
import Footer from '@/components/Footer'

export const metadata = { title: 'AI Ride Planner | CyBlime Cycling Club' }

export default function AiPlannerPage() {
  return (
    <>
      <Navbar />
      <AiRidePlanner />
      <Footer />
    </>
  )
}
