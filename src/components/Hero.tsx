'use client'
import Link from 'next/link'

const FALLBACK = 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=1800&q=80'

export default function Hero({ image }: { image?: string }) {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: '100svh' }}>
      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${image || FALLBACK}')`,
          filter: 'brightness(0.2)',
        }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, transparent 40%, rgba(10,10,10,0.8) 100%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(245,166,35,0.1) 0%, transparent 65%)' }} />

      <div className="relative z-10 text-center px-5 max-w-6xl mx-auto w-full pt-24 pb-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8"
          style={{ background: 'rgba(245,166,35,0.12)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#F5A623' }} />
          Brooklyn, NY · Est. 2020
        </div>

        {/* Headline */}
        <h1 className="font-black leading-[0.9] mb-6 text-white" style={{ fontSize: 'clamp(3.5rem, 12vw, 9rem)' }}>
          RIDE LIKE<br />
          <span style={{
            color: '#F5A623',
            textShadow: '0 0 80px rgba(245,166,35,0.3)',
          }}>
            YOUR LIFE
          </span><br />
          DEPENDS ON IT.
        </h1>

        <p className="text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)' }}>
          CyBlime Cycling Club is Brooklyn's most passionate two-wheel community.
          We don't just ride — we chase miles, build bonds, and own every street we touch.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/join"
            className="px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: '#F5A623', color: '#000', boxShadow: '0 0 30px rgba(245,166,35,0.25)' }}>
            Join the Club
          </Link>
          <Link href="/rides"
            className="px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)' }}>
            See Next Ride →
          </Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 sm:gap-16">
          {[
            { num: '339', label: 'IG Posts' },
            { num: '1,332', label: 'Followers' },
            { num: '31', label: 'Strava Riders' },
            { num: '4+', label: 'Years Rolling' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-black text-white" style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)' }}>
                {s.num}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
        <div className="text-xs uppercase tracking-widest font-medium">Scroll</div>
        <div className="w-px h-10 animate-pulse" style={{ background: 'linear-gradient(to bottom, #F5A623, transparent)' }} />
      </div>
    </div>
  )
}
