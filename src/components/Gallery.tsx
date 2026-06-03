import Link from 'next/link'
import type { GalleryPhoto } from '@/lib/supabase'

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const FALLBACK_PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80', alt: 'Group ride on Brooklyn Bridge' },
  { src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80', alt: 'Cyclist on open road' },
  { src: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=600&q=80', alt: 'Urban cycling' },
  { src: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80', alt: 'Race pace' },
  { src: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=600&q=80', alt: 'Brooklyn ride' },
  { src: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&q=80', alt: 'Team kit' },
  { src: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80', alt: 'Gravel ride' },
  { src: 'https://images.unsplash.com/photo-1558618047-f4e90e8b7957?w=600&q=80', alt: 'City loop' },
]

export default function Gallery({ photos }: { photos?: GalleryPhoto[] }) {
  const displayPhotos = photos && photos.length > 0
    ? photos.map(p => ({ src: p.url, alt: p.alt || p.caption || 'CyBlime ride photo' }))
    : FALLBACK_PHOTOS

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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {displayPhotos.map((p, i) => (
            <a
              key={i}
              href="https://www.instagram.com/brooklyncyblimecycling/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl aspect-square"
              style={{ border: '1px solid #2A2A2A' }}
              aria-label={`View ${p.alt} on Instagram`}
            >
              <img
                src={p.src}
                alt={p.alt}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
                <InstagramIcon size={28} />
              </div>
            </a>
          ))}
        </div>

        {(!photos || photos.length === 0) && (
          <p className="text-center text-gray-600 text-sm mt-8">
            Upload your Instagram photos in the{' '}
            <Link href="/admin/gallery" className="underline" style={{ color: '#F5A623' }}>admin gallery</Link>
            {' '}to replace these placeholders.
          </p>
        )}
      </div>
    </section>
  )
}
