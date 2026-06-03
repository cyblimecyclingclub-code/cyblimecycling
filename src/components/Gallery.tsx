'use client'
import { useEffect } from 'react'

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export default function Gallery() {
  useEffect(() => {
    if (document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) return
    const script = document.createElement('script')
    script.src = 'https://elfsightcdn.com/platform.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <section id="gallery" className="py-24 px-5 w-full" style={{ background: '#111111' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#F5A623' }}>
              Instagram
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white">Life on Two Wheels</h2>
          </div>
          <a
            href="https://www.instagram.com/brooklyncyblimecycling/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm px-5 py-2.5 rounded-lg transition-all hover:scale-105 self-start md:self-auto"
            style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', color: '#fff' }}
            aria-label="Follow CyBlime on Instagram"
          >
            <InstagramIcon size={16} />
            @brooklyncyblimecycling
          </a>
        </div>

        {/* Elfsight Instagram Feed */}
        <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
          <div
            className="elfsight-app-2d8d00ba-72e1-4194-ac43-a42805e820de"
            data-elfsight-app-lazy
          />
        </div>
      </div>
    </section>
  )
}
