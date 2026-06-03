import Link from 'next/link'

export default function About() {
  return (
    <section id="about" style={{ background: '#111', borderTop: '1px solid #1A1A1A' }}>
      <div className="max-w-7xl mx-auto px-5 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#F5A623' }}>Our Story</div>
            <h2 className="font-black leading-tight mb-6 text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
              Born in Brooklyn.<br />Built on Passion.
            </h2>
            <p className="text-gray-400 leading-relaxed mb-5" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)' }}>
              CyBlime started in 2020 with a simple idea: get a group of Brooklyn cyclists together and ride like we mean it.
              No gatekeeping. No ego. Just people who love the sport showing up every weekend, rain or shine.
            </p>
            <p className="text-gray-400 leading-relaxed mb-10" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)' }}>
              Four years later, we're 31 strong on Strava, 1,300+ deep on Instagram, and we've logged thousands
              of miles across Brooklyn, Queens, Manhattan and beyond.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { num: '2020', label: 'Founded' },
                { num: '1000s', label: 'Miles Logged' },
                { num: '100%', label: 'Brooklyn Built' },
              ].map((s) => (
                <div key={s.label} className="text-center py-5 rounded-xl"
                  style={{ background: '#1A1A1A', border: '1px solid #242424' }}>
                  <div className="text-xl sm:text-2xl font-black mb-1" style={{ color: '#F5A623' }}>{s.num}</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            <Link href="/rides"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all hover:scale-105"
              style={{ background: '#F5A623', color: '#000' }}>
              See Upcoming Rides →
            </Link>
          </div>

          {/* Right: Image stack */}
          <div className="relative">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
              <img
                src="https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=800&q=80"
                alt="CyBlime riders"
                className="w-full object-cover"
                style={{ height: 'clamp(280px, 40vw, 480px)', filter: 'brightness(0.8)' }}
              />
            </div>

            {/* Floating badge — bottom left */}
            <div className="absolute -bottom-5 -left-5 px-5 py-4 rounded-2xl shadow-xl"
              style={{ background: '#F5A623' }}>
              <div className="text-base font-black text-black leading-tight">@brooklyncyblimecycling</div>
              <div className="text-xs font-bold text-black/60 uppercase tracking-wider">Follow the ride</div>
            </div>

            {/* Floating metric — top right */}
            <div className="absolute -top-4 -right-4 px-4 py-3 rounded-xl shadow-xl text-center"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
              <div className="text-xl font-black" style={{ color: '#F5A623' }}>Every</div>
              <div className="text-xl font-black text-white leading-tight">Weekend</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Rain or Shine</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
