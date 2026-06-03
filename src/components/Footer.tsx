import Link from 'next/link'

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const NAV_LINKS = [
  { href: '/rides', label: 'Upcoming Rides' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/ai-planner', label: 'AI Ride Planner' },
  { href: '/blog', label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/join', label: 'Join the Club' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#0D0D0D', borderTop: '1px solid #1A1A1A' }}>
      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-black mb-4">
              <span style={{ color: '#F5A623' }}>CY</span>
              <span className="text-white">BLIME</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Brooklyn's most passionate cycling community.<br />
              Riding like our lives depend on it since 2020.
            </p>
            <Link href="/join"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs transition-all hover:scale-105"
              style={{ background: '#F5A623', color: '#000' }}>
              Join the Club →
            </Link>
          </div>

          {/* Links */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-5">Quick Links</div>
            <div className="flex flex-col gap-2.5">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href}
                  className="text-sm text-gray-500 hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-5">Follow the Ride</div>
            <div className="flex flex-col gap-4">
              <a href="https://www.instagram.com/brooklyncyblimecycling/"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623' }}>
                  <InstagramIcon size={15} />
                </span>
                @brooklyncyblimecycling
              </a>
              <a href="https://www.strava.com/clubs/762372"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(252,76,2,0.1)' }}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="#FC4C02">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                  </svg>
                </span>
                CyBlime on Strava
              </a>
              <a href="https://cyblime-cyclingclub.com"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623' }}>
                  🌐
                </span>
                cyblime-cyclingclub.com
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-3"
          style={{ borderTop: '1px solid #1A1A1A' }}>
          <p className="text-gray-700 text-xs">
            © {new Date().getFullYear()} CyBlime Cycling Club · Brooklyn, NY · Est. 2020
          </p>
          <div className="flex items-center gap-4">
            <p className="text-gray-700 text-xs">Built with passion for the ride 🚴</p>
            <Link href="/admin" className="text-gray-700 text-xs hover:text-gray-500 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
