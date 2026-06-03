import Link from 'next/link'

export default function About() {
  return (
    <div className="w-full max-w-7xl mx-auto px-5 py-16">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#F5A623' }}>Our Story</div>
          <h2 className="text-5xl font-black leading-tight mb-6 text-white">
            Born in Brooklyn.<br />Built on Passion.
          </h2>
          <p className="text-gray-400 leading-relaxed mb-5 text-lg">
            CyBlime started in 2020 with a simple idea: get a group of Brooklyn cyclists together and ride like we mean it. No gatekeeping. No ego. Just people who love the sport showing up every weekend, rain or shine.
          </p>
          <p className="text-gray-400 leading-relaxed mb-8 text-lg">
            Four years later, we're 31 strong on Strava, 1,300+ deep on Instagram, and we've logged thousands of miles across Brooklyn, Queens, Manhattan and beyond.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[{ num: '2020', label: 'Founded' }, { num: '1000s', label: 'Miles Logged' }, { num: '100%', label: 'Brooklyn Built' }].map(s => (
              <div key={s.label} className="text-center py-4 rounded-lg" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                <div className="text-2xl font-black" style={{ color: '#F5A623' }}>{s.num}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <Link href="/rides" className="inline-block px-6 py-3 rounded font-black uppercase tracking-widest text-sm transition-all hover:scale-105"
            style={{ background: '#F5A623', color: '#000' }}>
            See Upcoming Rides →
          </Link>
        </div>

        <div className="relative">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
            <img src="https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=800&q=80" alt="CyBlime riders"
              className="w-full h-96 object-cover" style={{ filter: 'brightness(0.85)' }} />
          </div>
          <div className="absolute -bottom-5 -left-5 px-6 py-4 rounded-xl" style={{ background: '#F5A623' }}>
            <div className="text-xl font-black text-black">@brooklyncyblimecycling</div>
            <div className="text-xs font-bold text-black/70 uppercase tracking-wider">Follow the ride</div>
          </div>
        </div>
      </div>
    </div>
  )
}
