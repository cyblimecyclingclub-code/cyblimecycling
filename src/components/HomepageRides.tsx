import Link from 'next/link'
import { Clock, Gauge, MapPin, ChevronRight, ArrowRight } from 'lucide-react'

const LEVEL_COLORS: Record<string, string> = {
  'All Levels': '#22c55e',
  'Beginner': '#3b82f6',
  'Intermediate': '#F5A623',
  'Advanced': '#ef4444',
}

const RIDES = [
  {
    id: '1',
    title: 'Saturday Morning Brooklyn Loop',
    date: 'Sat, Jun 7',
    time: '7:00 AM',
    distance_miles: 35,
    pace: '16–18 mph',
    level: 'Intermediate',
    meetup_location: 'Grand Army Plaza, Brooklyn',
  },
  {
    id: '2',
    title: 'Sunday Easy Spin — Prospect Park',
    date: 'Sun, Jun 8',
    time: '8:00 AM',
    distance_miles: 15,
    pace: '12–14 mph',
    level: 'All Levels',
    meetup_location: 'Prospect Park Boathouse',
  },
  {
    id: '3',
    title: 'Bridges & Boroughs — NYC Epic',
    date: 'Sat, Jun 14',
    time: '6:30 AM',
    distance_miles: 65,
    pace: '18–20 mph',
    level: 'Advanced',
    meetup_location: 'Brooklyn Bridge Park, Pier 1',
  },
]

export default function HomepageRides() {
  return (
    <section style={{ background: '#0D0D0D', borderTop: '1px solid #1A1A1A' }}>
      <div className="max-w-7xl mx-auto px-5 py-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#F5A623' }}>
              This Week
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              Upcoming Rides
            </h2>
          </div>
          <Link href="/rides"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all hover:gap-3"
            style={{ color: '#F5A623' }}>
            See all rides <ChevronRight size={16} />
          </Link>
        </div>

        {/* Ride cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {RIDES.map((ride) => (
            <div key={ride.id}
              className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.02] hover:border-yellow-500/40"
              style={{ background: '#141414', border: '1px solid #242424' }}>
              {/* Top row */}
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{
                    background: `${LEVEL_COLORS[ride.level]}18`,
                    color: LEVEL_COLORS[ride.level],
                    border: `1px solid ${LEVEL_COLORS[ride.level]}35`,
                  }}>
                  {ride.level}
                </span>
                <div className="text-right">
                  <div className="text-3xl font-black leading-none" style={{ color: '#F5A623' }}>{ride.distance_miles}</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">mi</div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-black text-white leading-snug">{ride.title}</h3>

              {/* Meta */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                  <Clock size={11} style={{ color: '#F5A623' }} />
                  <span>{ride.date} · {ride.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                  <Gauge size={11} style={{ color: '#F5A623' }} />
                  <span>{ride.pace}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                  <MapPin size={11} style={{ color: '#F5A623' }} />
                  <span className="truncate">{ride.meetup_location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl"
          style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.15)' }}>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white font-bold">New to the crew?</p>
            <p className="text-gray-500 text-sm">Join the club to get added to the ride group chat and never miss a roll.</p>
          </div>
          <Link href="/join"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-wider text-sm transition-all hover:scale-105"
            style={{ background: '#F5A623', color: '#000' }}>
            Join Free <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
