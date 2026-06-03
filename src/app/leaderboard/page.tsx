import Navbar from '@/components/Navbar'
import Leaderboard from '@/components/Leaderboard'
import Footer from '@/components/Footer'

export const metadata = { title: 'Leaderboard | CyBlime Cycling Club' }

export default function LeaderboardPage() {
  return (
    <>
      <Navbar />
      <Leaderboard />
      <Footer />
    </>
  )
}
