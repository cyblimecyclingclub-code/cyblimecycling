import SnapPage, { SnapSection } from '@/components/SnapPage'
import Navbar from '@/components/Navbar'
import AiRidePlanner from '@/components/AiRidePlanner'

export const metadata = { title: 'AI Ride Planner | CyBlime Cycling Club' }

export default function AiPlannerPage() {
  return (
    <>
      <Navbar />
      <SnapPage>
        <SnapSection bg="#0A0A0A">
          <AiRidePlanner />
        </SnapSection>
      </SnapPage>
    </>
  )
}
