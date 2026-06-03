'use client'
import Link from 'next/link'
import type { BlogPost } from '@/lib/supabase'
import { ExternalLink } from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  'Ride Recap': '#F5A623',
  'Route Guide': '#3b82f6',
  'Member Spotlight': '#22c55e',
  'Training Tips': '#8b5cf6',
  'Club News': '#ef4444',
  'Gear': '#ec4899',
}

function isHTML(str: string) {
  return /<[a-z][\s\S]*>/i.test(str)
}

export default function BlogPostView({ post }: { post: BlogPost }) {
  const color = CATEGORY_COLORS[post.category] || '#F5A623'
  const contentIsHTML = isHTML(post.content)

  return (
    <article id="main-content" className="min-h-screen pt-20" style={{ background: '#0A0A0A' }}>
      {/* Cover */}
      {post.cover_image && (
        <div className="relative overflow-hidden" style={{ height: 'clamp(220px, 55vw, 55vh)' }}>
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" style={{ filter: 'brightness(0.35)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0A0A0A 0%, transparent 60%)' }} />
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-12 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{ background: color, color: '#000' }}>{post.category}</span>
              <span className="text-sm text-gray-400">
                {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : ''}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white leading-tight">{post.title}</h1>
            <p className="text-gray-300 mt-3 text-lg max-w-2xl">{post.excerpt}</p>
          </div>
        </div>
      )}

      {/* Author */}
      <div className="max-w-3xl mx-auto px-5 pt-10 pb-4">
        <div className="flex items-center gap-3 pb-8" style={{ borderBottom: '1px solid #1A1A1A' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
            style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>
            {post.author.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-black text-white">{post.author}</div>
            <div className="text-xs text-gray-500">CyBlime Cycling Club · Brooklyn, NY</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 pb-20">
        {post.post_type === 'link' && post.link_url ? (
          <div className="flex flex-col items-center gap-6 py-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)' }}>
              <ExternalLink size={28} color="#F5A623" />
            </div>
            <p className="text-gray-400 text-center text-lg max-w-lg">{post.excerpt}</p>
            <a href={post.link_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base uppercase tracking-wider transition-all hover:scale-105"
              style={{ background: '#F5A623', color: '#000' }}
              aria-label={`Read full article: ${post.title}`}>
              <ExternalLink size={18} /> Read Full Article
            </a>
            <p className="text-xs text-gray-600">Opens in a new tab · {(() => { try { return new URL(post.link_url!).hostname } catch { return post.link_url } })()}</p>
          </div>
        ) : contentIsHTML ? (
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <div className="blog-content">
            {post.content.split('\n').map((line, i) => (
              <p key={i} className="mb-4 text-gray-300 leading-relaxed text-lg">{line}</p>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderTop: '1px solid #1A1A1A' }}>
          <Link href="/blog" className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors">← All Posts</Link>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/brooklyncyblimecycling/" target="_blank" rel="noopener noreferrer"
              className="text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all hover:scale-105"
              style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)' }}>
              Follow on IG
            </a>
            <Link href="/join" className="text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all hover:scale-105"
              style={{ background: '#F5A623', color: '#000' }}>
              Join the Club
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .blog-content { font-size:1.1rem; line-height:1.85; color:#D1D5DB; }
        .blog-content h2 { font-size:1.75rem; font-weight:900; color:#fff; margin:2.5rem 0 1rem; padding-bottom:0.75rem; border-bottom:1px solid #1A1A1A; }
        .blog-content h3 { font-size:1.35rem; font-weight:900; color:#fff; margin:2rem 0 0.75rem; }
        .blog-content p { margin-bottom:1.25rem; }
        .blog-content strong { font-weight:900; color:#fff; }
        .blog-content em { color:#9CA3AF; }
        .blog-content ul { list-style:none; padding:0; margin:0 0 1.25rem; }
        .blog-content ul li { display:flex; gap:0.5rem; margin-bottom:0.5rem; }
        .blog-content ul li::before { content:"→"; color:#F5A623; font-weight:900; flex-shrink:0; }
        .blog-content ol { margin:0 0 1.25rem 1.5rem; }
        .blog-content ol li { margin-bottom:0.5rem; }
        .blog-content blockquote { border-left:3px solid #F5A623; padding-left:1.25rem; margin:2rem 0; color:#9CA3AF; font-style:italic; font-size:1.2rem; }
        .blog-content hr { border:none; border-top:1px solid #1A1A1A; margin:2.5rem 0; }
        .blog-content a { color:#F5A623; text-decoration:underline; }
        .blog-content img { max-width:100%; border-radius:12px; border:1px solid #1A1A1A; height:auto; }
        .blog-content::after { content:""; display:table; clear:both; }
      `}</style>
    </article>
  )
}
