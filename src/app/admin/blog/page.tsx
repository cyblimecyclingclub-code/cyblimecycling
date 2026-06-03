'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase, type BlogPost, BLOG_CATEGORIES } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, ExternalLink, Upload, Link2 } from 'lucide-react'
import dynamic from 'next/dynamic'
const RichEditor = dynamic(() => import('@/components/RichEditor'), { ssr: false })

const BLANK: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = {
  title: '', slug: '', excerpt: '', content: '', cover_image: '',
  author: 'CyBlime Cycling Club', category: 'Ride Recap', is_published: false,
  post_type: 'article', link_url: '',
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const [tab, setTab] = useState<'write' | 'preview'>('write') // kept for compat, unused
  const coverInputRef = useRef<HTMLInputElement>(null)

  async function uploadCover(file: File) {
    setCoverUploading(true)
    const ext = file.name.split('.').pop()
    const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setEditing(prev => ({ ...prev, cover_image: data.publicUrl }))
    }
    setCoverUploading(false)
  }

  async function load() {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
  }
  useEffect(() => { load() }, [])

  async function save() {
    setLoading(true)
    const payload = {
      ...editing,
      updated_at: new Date().toISOString(),
      published_at: editing?.is_published && !editing?.published_at ? new Date().toISOString() : editing?.published_at,
    }
    if (isNew) {
      await supabase.from('blog_posts').insert([payload])
    } else {
      await supabase.from('blog_posts').update(payload).eq('id', editing!.id)
    }
    setEditing(null)
    setIsNew(false)
    await load()
    setLoading(false)
  }

  async function toggle(post: BlogPost) {
    await supabase.from('blog_posts').update({
      is_published: !post.is_published,
      published_at: !post.is_published ? new Date().toISOString() : post.published_at,
    }).eq('id', post.id)
    await load()
  }

  async function del(id: string) {
    if (!confirm('Delete this post?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    await load()
  }

  const CATEGORY_COLORS: Record<string, string> = {
    'Ride Recap': '#F5A623', 'Route Guide': '#3b82f6', 'Member Spotlight': '#22c55e',
    'Training Tips': '#8b5cf6', 'Club News': '#ef4444', 'Gear': '#ec4899',
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Blog</h1>
          <p className="text-gray-500 mt-1">{posts.length} posts · {posts.filter(p => p.is_published).length} published</p>
        </div>
        <button onClick={() => { setEditing({ ...BLANK }); setIsNew(true); setTab('write') }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider"
          style={{ background: '#F5A623', color: '#000' }}>
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {posts.map(post => (
          <div key={post.id} className="flex items-center gap-4 px-5 py-4 rounded-xl transition-colors hover:bg-white/[0.02]"
            style={{ background: '#111', border: '1px solid #2A2A2A', opacity: post.is_published ? 1 : 0.6 }}>
            {post.cover_image && (
              <img src={post.cover_image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${CATEGORY_COLORS[post.category] || '#F5A623'}20`, color: CATEGORY_COLORS[post.category] || '#F5A623' }}>
                  {post.category}
                </span>
                {!post.is_published && <span className="text-xs text-gray-600 uppercase tracking-wider">Draft</span>}
              </div>
              <div className="font-black text-white truncate">{post.title}</div>
              <div className="text-xs text-gray-500 truncate mt-0.5">{post.excerpt}</div>
            </div>
            <div className="text-xs text-gray-600 shrink-0">
              {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Unpublished'}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {post.is_published && (
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <ExternalLink size={14} />
                </a>
              )}
              <button onClick={() => { setEditing({ ...post }); setIsNew(false); setTab('write') }}
                className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => toggle(post)} className="p-1.5 rounded hover:bg-white/10 transition-colors"
                style={{ color: post.is_published ? '#22c55e' : '#666' }}>
                {post.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button onClick={() => del(post.id)}
                className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-20 text-gray-600">No posts yet. Write your first one above.</div>
        )}
      </div>

      {/* Editor Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-4xl rounded-2xl flex flex-col overflow-hidden" style={{ background: '#111', border: '1px solid #2A2A2A', maxHeight: '92vh' }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1px solid #2A2A2A' }}>
              <h2 className="text-xl font-black text-white">{isNew ? 'New Post' : 'Edit Post'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6 flex flex-col gap-4">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Title *</label>
                  <input value={editing.title || ''} placeholder="Enter post title..."
                    onChange={e => setEditing({ ...editing, title: e.target.value, slug: isNew ? slugify(e.target.value) : editing.slug })}
                    className="px-4 py-3 rounded-lg text-white text-lg font-bold outline-none"
                    style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Slug */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Slug (URL)</label>
                    <input value={editing.slug || ''} onChange={e => setEditing({ ...editing, slug: e.target.value })}
                      className="px-4 py-2.5 rounded-lg text-white text-sm outline-none font-mono"
                      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
                  </div>
                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
                    <select value={editing.category || 'Ride Recap'} onChange={e => setEditing({ ...editing, category: e.target.value })}
                      className="px-4 py-2.5 rounded-lg text-white text-sm outline-none appearance-none"
                      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                      {BLOG_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Excerpt (shown in listing)</label>
                  <textarea rows={2} value={editing.excerpt || ''} onChange={e => setEditing({ ...editing, excerpt: e.target.value })}
                    placeholder="Short description shown on the blog listing page..."
                    className="px-4 py-3 rounded-lg text-white text-sm outline-none resize-none"
                    style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
                </div>

                {/* Post type toggle */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Post Type</label>
                  <div className="flex gap-2">
                    {(['article', 'link'] as const).map(type => (
                      <button key={type} onClick={() => setEditing({ ...editing, post_type: type })}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all"
                        style={editing.post_type === type
                          ? { background: '#F5A623', color: '#000' }
                          : { background: '#1A1A1A', color: '#666', border: '1px solid #2A2A2A' }}>
                        {type === 'link' ? <Link2 size={14} /> : null}
                        {type === 'article' ? 'Written Article' : 'External Link'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Link URL (only for link posts) */}
                {editing.post_type === 'link' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Article URL *</label>
                    <input value={editing.link_url || ''} onChange={e => setEditing({ ...editing, link_url: e.target.value })}
                      placeholder="https://example.com/article..."
                      className="px-4 py-2.5 rounded-lg text-white text-sm outline-none"
                      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
                    <p className="text-xs text-gray-600">Visitors will see a CyBlime-branded preview page with a link to the original article.</p>
                  </div>
                )}

                {/* Cover image */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Cover Image</label>
                  <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && uploadCover(e.target.files[0])} />
                  <div className="flex gap-3">
                    <input value={editing.cover_image || ''} onChange={e => setEditing({ ...editing, cover_image: e.target.value })}
                      placeholder="https://... or upload below"
                      className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm outline-none"
                      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
                    <button onClick={() => coverInputRef.current?.click()} disabled={coverUploading}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                      style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}
                      aria-label="Upload cover image">
                      <Upload size={14} />{coverUploading ? 'Uploading…' : 'Upload'}
                    </button>
                    {editing.cover_image && (
                      <img src={editing.cover_image} alt="" className="w-12 h-12 rounded-lg object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    )}
                  </div>
                </div>

                {/* Content editor (article only) */}
                {editing.post_type !== 'link' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Content</label>
                  <RichEditor
                    value={editing.content || ''}
                    onChange={html => setEditing(prev => ({ ...prev, content: html }))}
                  />
                </div>
                )}

                {/* Author + publish */}
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Author</label>
                    <input value={editing.author || ''} onChange={e => setEditing({ ...editing, author: e.target.value })}
                      className="px-4 py-2.5 rounded-lg text-white text-sm outline-none"
                      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
                  </div>
                  <div className="flex items-center gap-3 mt-5">
                    <input type="checkbox" id="pub" checked={editing.is_published ?? false}
                      onChange={e => setEditing({ ...editing, is_published: e.target.checked })} />
                    <label htmlFor="pub" className="text-sm text-gray-400">Publish immediately</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 shrink-0" style={{ borderTop: '1px solid #2A2A2A' }}>
              <button onClick={() => setEditing(null)}
                className="flex-1 py-3 rounded-lg text-sm font-bold text-gray-400 hover:text-white transition-colors"
                style={{ border: '1px solid #2A2A2A' }}>
                Cancel
              </button>
              <button onClick={save} disabled={loading || !editing.title || !editing.slug || (editing.post_type === 'link' && !editing.link_url)}
                className="flex-1 py-3 rounded-lg font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-40"
                style={{ background: '#F5A623', color: '#000' }}>
                <Save size={16} />{loading ? 'Saving...' : editing.is_published ? 'Publish Post' : 'Save Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
