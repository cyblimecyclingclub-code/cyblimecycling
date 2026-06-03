import SnapPage, { SnapSection } from '@/components/SnapPage'
import Navbar from '@/components/Navbar'
import Leaderboard from '@/components/Leaderboard'

export const metadata = { title: 'Leaderboard | CyBlime Cycling Club' }

export default function LeaderboardPage() {
  return (
    <>
      <Navbar />
      <SnapPage>
        <SnapSection bg="#111111">
          <Leaderboard />
        </SnapSection>
      </SnapPage>
    </>
  )
}
