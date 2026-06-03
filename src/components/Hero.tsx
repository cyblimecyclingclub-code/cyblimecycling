'use client'
import Link from 'next/link'

export default function Hero() {
  return (
    <div className="relative w-full h-full min-h-screen flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')`, filter: 'brightness(0.22)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(245,166,35,0.12) 0%, transparent 70%)' }} />

      <div className="relative z-10 text-center px-5 max-w-5xl mx-auto w-full">
        <div className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8"
          style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>
          Brooklyn, NY · Est. 2020
        </div>
        <h1 className="font-black leading-none mb-6 text-white" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}>
          RIDE LIKE YOUR<br />
          <span style={{ color: '#F5A623' }}>LIFE DEPENDS</span><br />
          ON IT.
        </h1>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
          CyBlime Cycling Club is Brooklyn's most passionate two-wheel community. We don't just ride — we chase miles, build bonds, and own every street we touch.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/join" className="px-8 py-4 rounded font-black uppercase tracking-widest text-sm transition-all hover:scale-105"
            style={{ background: '#F5A623', color: '#000' }}>
            Join the Club
          </Link>
          <Link href="/rides" className="px-8 py-4 rounded font-bold uppercase tracking-widest text-sm transition-all hover:bg-white hover:text-black"
            style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
            See Next Ride
          </Link>
        </div>
        <div className="flex justify-center gap-12">
          {[{ num: '339', label: 'Posts' }, { num: '1,332', label: 'Followers' }, { num: '31', label: 'Strava Members' }, { num: '4+', label: 'Years Rolling' }].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black" style={{ color: '#F5A623' }}>{s.num}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
        <div className="text-xs uppercase tracking-widest">About</div>
        <div className="w-px h-10 animate-pulse" style={{ background: 'linear-gradient(to bottom, #F5A623, transparent)' }} />
      </div>
    </div>
  )
}
