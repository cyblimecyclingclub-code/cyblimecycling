import { Trophy, Zap, Route } from 'lucide-react'
import { MOCK_LEADERBOARD, formatTime, metersToMiles } from '@/lib/strava'

export default function Leaderboard() {
  const entries = MOCK_LEADERBOARD

  return (
    <section id="leaderboard" className="py-24 px-5" style={{ background: '#111111' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#F5A623' }}>
              Strava · This Week
            </div>
            <h2 className="text-5xl font-black text-white">Weekly Leaders</h2>
          </div>
          <a
            href="https://www.strava.com/clubs/762372"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider px-5 py-2.5 rounded transition-all hover:scale-105"
            style={{ background: '#FC4C02', color: '#fff' }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
            Join on Strava
          </a>
        </div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {entries.slice(0, 3).map((entry, i) => {
            const podiumOrder = [1, 0, 2]
            const e = entries[podiumOrder[i]]
            const rank = podiumOrder[i] + 1
            const isFirst = rank === 1
            return (
              <div
                key={e.athlete.id}
                className="rounded-xl p-5 text-center flex flex-col items-center gap-2"
                style={{
                  background: isFirst ? 'rgba(245,166,35,0.1)' : '#1A1A1A',
                  border: isFirst ? '1px solid rgba(245,166,35,0.4)' : '1px solid #2A2A2A',
                  order: i,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg"
                  style={{
                    background: rank === 1 ? '#F5A623' : rank === 2 ? '#9CA3AF' : '#CD7F32',
                    color: '#000',
                  }}
                >
                  {rank === 1 ? <Trophy size={18} /> : rank}
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-black text-white">
                  {e.athlete.firstname[0]}{e.athlete.lastname[0]}
                </div>
                <div className="font-black text-white text-sm">{e.athlete.firstname} {e.athlete.lastname}</div>
                <div className="text-2xl font-black" style={{ color: '#F5A623' }}>
                  {metersToMiles(e.distance)}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">miles</div>
                <div className="text-xs text-gray-400">{formatTime(e.moving_time)} moving</div>
              </div>
            )
          })}
        </div>

        {/* Full table */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
          <div
            className="grid grid-cols-5 gap-4 px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500"
            style={{ background: '#1A1A1A', borderBottom: '1px solid #2A2A2A' }}
          >
            <span>#</span>
            <span className="col-span-2">Athlete</span>
            <span className="flex items-center gap-1"><Route size={12} /> Distance</span>
            <span className="flex items-center gap-1"><Zap size={12} /> Time</span>
          </div>
          {entries.map((entry) => (
            <div
              key={entry.athlete.id}
              className="grid grid-cols-5 gap-4 px-6 py-4 items-center transition-colors hover:bg-white/[0.02]"
              style={{ borderBottom: '1px solid #1A1A1A' }}
            >
              <span
                className="font-black text-lg"
                style={{ color: entry.rank === 1 ? '#F5A623' : '#666' }}
              >
                {entry.rank}
              </span>
              <div className="col-span-2 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black"
                  style={{ background: '#2A2A2A', color: '#F5A623' }}
                >
                  {entry.athlete.firstname[0]}
                </div>
                <span className="font-bold text-white text-sm">
                  {entry.athlete.firstname} {entry.athlete.lastname}
                </span>
              </div>
              <span className="font-bold text-white">{metersToMiles(entry.distance)} mi</span>
              <span className="text-gray-400 text-sm">{formatTime(entry.moving_time)}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs mt-5">
          Live data pulled from{' '}
          <a href="https://www.strava.com/clubs/762372" className="underline hover:text-gray-400" target="_blank" rel="noopener noreferrer">
            Strava Club #762372
          </a>
          {' '}· Updates weekly
        </p>
      </div>
    </section>
  )
}
