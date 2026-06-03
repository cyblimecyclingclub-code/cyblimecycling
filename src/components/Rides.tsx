'use client'
import { useState } from 'react'
import { MapPin, Clock, Gauge, Users, ChevronRight } from 'lucide-react'

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
    description: 'Our flagship weekly ride. We roll from Grand Army Plaza, hit Prospect Park, then cruise through Bay Ridge, along the waterfront, and back. Coffee stop at the end.',
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
    description: 'No drop, no stress. Perfect for new members or anyone shaking off Saturday\'s legs. We do 3 laps and grab breakfast after.',
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
    description: 'The big one. Manhattan Bridge → Central Park → GW Bridge → Palisades → back over the Verrazzano. Serious riders only. Bring 2 bottles and a patch kit.',
  },
  {
    id: '4',
    title: 'Weeknight Flatbush Hammerfest',
    date: 'Wed, Jun 11',
    time: '6:30 PM',
    distance_miles: 25,
    pace: '18–20 mph',
    level: 'Advanced',
    meetup_location: 'Prospect Park, Ocean Ave entrance',
    description: 'Fast midweek blast. No waiting, no mercy. If you can hold the wheel, you\'re welcome. Great for race prep or just getting that midweek fix.',
  },
]

export default function Rides() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <section id="rides" className="py-24 px-5" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#F5A623' }}>
              Upcoming Rides
            </div>
            <h2 className="text-5xl font-black text-white">Next on the Road</h2>
          </div>
          <a
            href="https://www.strava.com/clubs/762372"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors"
            style={{ color: '#F5A623' }}
          >
            View All on Strava <ChevronRight size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {RIDES.map((ride) => (
            <div
              key={ride.id}
              className="rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{
                background: selected === ride.id ? '#1F1F1F' : '#141414',
                border: selected === ride.id ? '1px solid #F5A623' : '1px solid #2A2A2A',
              }}
              onClick={() => setSelected(selected === ride.id ? null : ride.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        background: `${LEVEL_COLORS[ride.level]}20`,
                        color: LEVEL_COLORS[ride.level],
                        border: `1px solid ${LEVEL_COLORS[ride.level]}40`,
                      }}
                    >
                      {ride.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">{ride.title}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black" style={{ color: '#F5A623' }}>{ride.distance_miles}</div>
                  <div className="text-xs text-gray-500 uppercase">miles</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <Clock size={13} style={{ color: '#F5A623' }} />
                  <span>{ride.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <Gauge size={13} style={{ color: '#F5A623' }} />
                  <span>{ride.pace}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <MapPin size={13} style={{ color: '#F5A623' }} />
                  <span className="truncate">Brooklyn</span>
                </div>
              </div>

              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#F5A623' }}>
                {ride.date}
              </div>

              {selected === ride.id && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid #2A2A2A' }}>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">{ride.description}</p>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <MapPin size={12} />
                    <span>{ride.meetup_location}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
