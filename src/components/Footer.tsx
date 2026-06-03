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

export default function Footer() {
  return (
    <footer style={{ background: '#111111', borderTop: '1px solid #1A1A1A' }}>
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="text-2xl font-black mb-3">
              <span style={{ color: '#F5A623' }}>CY</span>
              <span className="text-white">BLIME</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Brooklyn's most passionate cycling community.<br />
              Riding like our lives depend on it since 2020.
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">Quick Links</div>
            <div className="flex flex-col gap-2">
              {['#about', '#rides', '#leaderboard', '#ai-planner', '#gallery', '#join'].map((href) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-gray-500 hover:text-white transition-colors capitalize"
                >
                  {href.replace('#', '').replace('-', ' ')}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">Follow the Ride</div>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.instagram.com/brooklyncyblimecycling/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
              >
                <span style={{ color: '#F5A623' }}><InstagramIcon size={16} /></span>
                @brooklyncyblimecycling
              </a>
              <a
                href="https://www.strava.com/clubs/762372"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#FC4C02">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
                CyBlime on Strava
              </a>
              <a
                href="https://cyblime-cyclingclub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
              >
                <span style={{ color: '#F5A623' }}>🌐</span>
                cyblime-cyclingclub.com
              </a>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row justify-between items-center pt-6 gap-3"
          style={{ borderTop: '1px solid #1A1A1A' }}
        >
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} CyBlime Cycling Club · Brooklyn, NY · Est. 2020
          </p>
          <div className="flex items-center gap-4">
            <p className="text-gray-700 text-xs">Built with passion for the ride</p>
            <Link href="/admin" className="text-gray-700 text-xs hover:text-gray-500 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
