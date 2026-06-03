import Link from 'next/link'
import type { BlogPost } from '@/lib/supabase'

const CATEGORY_COLORS: Record<string, string> = {
  'Ride Recap': '#F5A623',
  'Route Guide': '#3b82f6',
  'Member Spotlight': '#22c55e',
  'Training Tips': '#8b5cf6',
  'Club News': '#ef4444',
  'Gear': '#ec4899',
}

function formatDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [hero, second, ...rest] = posts
  const color = (cat: string) => CATEGORY_COLORS[cat] || '#F5A623'

  return (
    <main id="main-content" className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* Page header */}
      <div className="pt-28 pb-12 px-5 max-w-7xl mx-auto">
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#F5A623' }}>
          The CyBlime Blog
        </div>
        <div className="flex items-end justify-between">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-none">
            Ride Stories.<br />
            <span style={{ color: '#F5A623' }}>Real People.</span>
          </h1>
          <p className="hidden md:block text-gray-500 max-w-xs text-sm leading-relaxed pb-2">
            Recaps, routes, spotlights, and everything that happens when Brooklyn rides.
          </p>
        </div>
        <div className="mt-6 h-px" style={{ background: 'linear-gradient(to right, #F5A623, transparent)' }} />
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-32 text-gray-600 text-lg">No posts yet — check back after the next ride.</div>
      ) : (
        <div className="px-5 max-w-7xl mx-auto pb-20">

          {/* Hero post — full width cinematic */}
          {hero && (
            <Link href={`/blog/${hero.slug}`} className="group block mb-10">
              <div className="relative rounded-2xl overflow-hidden" style={{ height: 'clamp(280px, 50vw, 520px)', border: '1px solid #1A1A1A' }}>
                {hero.cover_image ? (
                  <img src={hero.cover_image} alt={hero.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: 'brightness(0.35)' }} />
                ) : (
                  <div className="w-full h-full" style={{ background: '#111' }} />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }} />

                <div className="absolute bottom-0 left-0 right-0 p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                      style={{ background: color(hero.category), color: '#000' }}>
                      {hero.category}
                    </span>
                    <span className="text-gray-400 text-sm">{formatDate(hero.published_at)}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3 group-hover:text-[#F5A623] transition-colors">
                    {hero.title}
                  </h2>
                  <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">{hero.excerpt}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest"
                    style={{ color: '#F5A623' }}>
                    Read Full Story
                    <span className="group-hover:translate-x-2 transition-transform inline-block">→</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Second post + sidebar layout */}
          {(second || rest.length > 0) && (
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Second post — large */}
              {second && (
                <Link href={`/blog/${second.slug}`} className="group lg:col-span-2 block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01]"
                  style={{ border: '1px solid #1A1A1A', background: '#111' }}>
                  {second.cover_image && (
                    <div className="h-56 overflow-hidden">
                      <img src={second.cover_image} alt={second.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ filter: 'brightness(0.6)' }} />
                    </div>
                  )}
                  <div className="p-7">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{ background: `${color(second.category)}15`, color: color(second.category), border: `1px solid ${color(second.category)}30` }}>
                        {second.category}
                      </span>
                      <span className="text-xs text-gray-600">{formatDate(second.published_at)}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight group-hover:text-[#F5A623] transition-colors mb-2">{second.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{second.excerpt}</p>
                  </div>
                </Link>
              )}

              {/* Remaining posts stacked */}
              <div className="flex flex-col gap-4">
                {rest.slice(0, 3).map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`}
                    className="group flex gap-4 p-4 rounded-xl transition-all hover:bg-white/[0.03]"
                    style={{ border: '1px solid #1A1A1A', background: '#111' }}>
                    {post.cover_image && (
                      <img src={post.cover_image} alt={post.title}
                        className="w-16 h-16 rounded-lg object-cover shrink-0 transition-transform duration-300 group-hover:scale-105" />
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: color(post.category) }}>{post.category}</span>
                      <h4 className="text-sm font-black text-white leading-snug mt-0.5 group-hover:text-[#F5A623] transition-colors line-clamp-2">{post.title}</h4>
                      <span className="text-xs text-gray-600 mt-1 block">{formatDate(post.published_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Extra posts grid */}
          {rest.length > 3 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {rest.slice(3).map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  style={{ border: '1px solid #1A1A1A', background: '#111' }}>
                  {post.cover_image && (
                    <div className="h-44 overflow-hidden">
                      <img src={post.cover_image} alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ filter: 'brightness(0.7)' }} />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: color(post.category) }}>{post.category}</span>
                      <span className="text-xs text-gray-600">{formatDate(post.published_at)}</span>
                    </div>
                    <h3 className="text-lg font-black text-white leading-tight group-hover:text-[#F5A623] transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 py-12 rounded-2xl text-center" style={{ background: '#111', border: '1px solid #1A1A1A' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#F5A623' }}>Want more?</div>
            <h3 className="text-3xl font-black text-white mb-2">Ride with us. Be the story.</h3>
            <p className="text-gray-500 mb-6">Every Saturday. Grand Army Plaza. 7AM.</p>
            <Link href="/join" className="inline-block px-8 py-4 rounded-lg font-black uppercase tracking-widest text-sm transition-all hover:scale-105"
              style={{ background: '#F5A623', color: '#000' }}>
              Join CyBlime
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
