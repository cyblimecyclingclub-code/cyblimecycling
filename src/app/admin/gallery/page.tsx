'use client'
import { useEffect, useState } from 'react'
import { supabase, type GalleryPhoto } from '@/lib/supabase'
import { Plus, Trash2, Eye, EyeOff, X, Save, GripVertical } from 'lucide-react'

const BLANK: Omit<GalleryPhoto, 'id' | 'created_at'> = { url: '', alt: '', caption: '', order_index: 0, is_published: true }

export default function AdminGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [editing, setEditing] = useState<Partial<GalleryPhoto> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from('gallery').select('*').order('order_index', { ascending: true })
    setPhotos(data || [])
  }
  useEffect(() => { load() }, [])

  async function save() {
    setLoading(true)
    if (isNew) {
      await supabase.from('gallery').insert([{ ...editing, order_index: photos.length }])
    } else {
      await supabase.from('gallery').update(editing).eq('id', editing!.id)
    }
    setEditing(null)
    setIsNew(false)
    await load()
    setLoading(false)
  }

  async function toggle(p: GalleryPhoto) {
    await supabase.from('gallery').update({ is_published: !p.is_published }).eq('id', p.id)
    await load()
  }

  async function del(id: string) {
    if (!confirm('Delete this photo?')) return
    await supabase.from('gallery').delete().eq('id', id)
    await load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Gallery</h1>
          <p className="text-gray-500 mt-1">{photos.length} photos</p>
        </div>
        <button onClick={() => { setEditing({ ...BLANK }); setIsNew(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider"
          style={{ background: '#F5A623', color: '#000' }}>
          <Plus size={16} /> Add Photo
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="rounded-xl overflow-hidden group relative"
            style={{ border: '1px solid #2A2A2A', opacity: photo.is_published ? 1 : 0.5 }}>
            <img src={photo.url} alt={photo.alt} className="w-full aspect-square object-cover" onError={e => (e.currentTarget.src = 'https://via.placeholder.com/300x300/1A1A1A/F5A623?text=IMG')} />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button onClick={() => { setEditing({ ...photo }); setIsNew(false) }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"><Plus size={16} /></button>
              <button onClick={() => toggle(photo)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" style={{ color: photo.is_published ? '#22c55e' : '#666' }}>{photo.is_published ? <Eye size={16} /> : <EyeOff size={16} />}</button>
              <button onClick={() => del(photo.id)} className="p-2 rounded-lg bg-white/10 hover:bg-red-500/30 text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>
            {photo.caption && <div className="px-3 py-2 text-xs text-gray-400 truncate" style={{ background: '#111' }}>{photo.caption}</div>}
          </div>
        ))}
        <button onClick={() => { setEditing({ ...BLANK }); setIsNew(true) }}
          className="aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-colors hover:bg-white/5"
          style={{ border: '2px dashed #2A2A2A', color: '#555' }}>
          <Plus size={24} />
          <span className="text-xs uppercase tracking-wider">Add Photo</span>
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">{isNew ? 'Add Photo' : 'Edit Photo'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            {editing.url && (
              <img src={editing.url} alt="preview" className="w-full h-40 object-cover rounded-lg" onError={e => (e.currentTarget.style.display = 'none')} />
            )}
            {([['url', 'Image URL'], ['alt', 'Alt Text'], ['caption', 'Caption']] as [keyof GalleryPhoto, string][]).map(([key, label]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
                <input value={String(editing[key] ?? '')} onChange={e => setEditing({ ...editing, [key]: e.target.value })}
                  className="px-4 py-2.5 rounded-lg text-white text-sm outline-none"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
              </div>
            ))}
            <div className="flex items-center gap-3">
              <input type="checkbox" id="gpub" checked={editing.is_published ?? true} onChange={e => setEditing({ ...editing, is_published: e.target.checked })} />
              <label htmlFor="gpub" className="text-sm text-gray-400">Published</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-lg text-sm font-bold text-gray-400" style={{ border: '1px solid #2A2A2A' }}>Cancel</button>
              <button onClick={save} disabled={loading} className="flex-1 py-3 rounded-lg font-black text-sm flex items-center justify-center gap-2"
                style={{ background: '#F5A623', color: '#000' }}>
                <Save size={16} />{loading ? 'Saving...' : 'Save Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
