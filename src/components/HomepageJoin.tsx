import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

const FALLBACK = 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80'

const PERKS = [
  'Weekly group rides for all levels',
  'Private group chat with live updates',
  'Custom CyBlime kit orders',
  'Strava club & leaderboard access',
  'Community events & cycling trips',
]

export default function HomepageJoin({ image }: { image?: string }) {
  return (
    <section style={{ background: '#0D0D0D', borderTop: '1px solid #1A1A1A' }}>
      <div className="max-w-7xl mx-auto px-5 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#F5A623' }}>
              No Dues. No Gatekeeping.
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Ready to Ride<br />
              <span style={{ color: '#F5A623' }}>With Brooklyn's Best?</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Just show up, clip in, and keep up. We ride every weekend, year-round —
              rain, shine, or snow. Fill out the form and we'll add you to the group chat before the next ride.
            </p>
            <div className="flex flex-col gap-3 mb-10">
              {PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-3">
                  <CheckCircle size={18} style={{ color: '#F5A623', flexShrink: 0 }} />
                  <span className="text-gray-300 text-sm">{perk}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/join"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black uppercase tracking-wider text-sm transition-all hover:scale-105"
                style={{ background: '#F5A623', color: '#000' }}>
                Join the Club <ArrowRight size={15} />
              </Link>
              <a href="https://www.instagram.com/brooklyncyblimecycling/"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all hover:bg-white/5"
                style={{ border: '1px solid #2A2A2A', color: '#fff' }}>
                Follow Us
              </a>
            </div>
          </div>

          {/* Right: image card */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #242424' }}>
              <img
                src={image || FALLBACK}
                alt="Cyclists riding together"
                className="w-full object-cover"
                style={{ height: '420px', filter: 'brightness(0.7)' }}
              />
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl backdrop-blur-sm"
                style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(245,166,35,0.2)' }}>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: '#F5A623' }}>31+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Members</div>
                  </div>
                  <div className="w-px h-10 bg-gray-800" />
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: '#F5A623' }}>1,332</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Followers</div>
                  </div>
                  <div className="w-px h-10 bg-gray-800" />
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: '#F5A623' }}>2020</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Est.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
