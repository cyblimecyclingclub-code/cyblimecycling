'use client'
import { useEffect, useState } from 'react'
import { supabase, type Ride } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save } from 'lucide-react'

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const BLANK: Omit<Ride, 'id' | 'created_at'> = { title: '', date: '', time: '', distance_miles: 0, pace: '', level: 'All Levels', meetup_location: '', description: '', is_published: true }

export default function AdminRides() {
  const [rides, setRides] = useState<Ride[]>([])
  const [editing, setEditing] = useState<Partial<Ride> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from('rides').select('*').order('created_at', { ascending: false })
    setRides(data || [])
  }
  useEffect(() => { load() }, [])

  async function save() {
    setLoading(true)
    if (isNew) {
      await supabase.from('rides').insert([editing])
    } else {
      await supabase.from('rides').update(editing!).eq('id', editing!.id)
    }
    setEditing(null)
    setIsNew(false)
    await load()
    setLoading(false)
  }

  async function toggle(ride: Ride) {
    await supabase.from('rides').update({ is_published: !ride.is_published }).eq('id', ride.id)
    await load()
  }

  async function del(id: string) {
    if (!confirm('Delete this ride?')) return
    await supabase.from('rides').delete().eq('id', id)
    await load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Rides</h1>
          <p className="text-gray-500 mt-1">{rides.length} total rides</p>
        </div>
        <button onClick={() => { setEditing({ ...BLANK }); setIsNew(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider"
          style={{ background: '#F5A623', color: '#000' }}>
          <Plus size={16} /> Add Ride
        </button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
        <div className="grid grid-cols-6 gap-4 px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500"
          style={{ background: '#1A1A1A', borderBottom: '1px solid #2A2A2A' }}>
          <span className="col-span-2">Title</span>
          <span>Date</span>
          <span>Distance</span>
          <span>Level</span>
          <span>Actions</span>
        </div>
        {rides.map(ride => (
          <div key={ride.id} className="grid grid-cols-6 gap-4 px-6 py-4 items-center transition-colors hover:bg-white/[0.02]"
            style={{ borderBottom: '1px solid #1A1A1A', opacity: ride.is_published ? 1 : 0.5 }}>
            <div className="col-span-2 font-bold text-white text-sm truncate">{ride.title}</div>
            <div className="text-gray-400 text-sm">{ride.date}</div>
            <div className="text-gray-400 text-sm">{ride.distance_miles} mi</div>
            <div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#F5A62320', color: '#F5A623' }}>{ride.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing({ ...ride }); setIsNew(false) }} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><Pencil size={14} /></button>
              <button onClick={() => toggle(ride)} className="p-1.5 rounded hover:bg-white/10 transition-colors" style={{ color: ride.is_published ? '#22c55e' : '#666' }}>{ride.is_published ? <Eye size={14} /> : <EyeOff size={14} />}</button>
              <button onClick={() => del(ride.id)} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {rides.length === 0 && <div className="px-6 py-10 text-center text-gray-600">No rides yet. Add one above.</div>}
      </div>

      {/* Edit / Add Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 overflow-y-auto max-h-[90vh]" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">{isNew ? 'New Ride' : 'Edit Ride'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            {([
              ['title', 'Title', 'text'],
              ['date', 'Date (e.g. Sat, Jun 7)', 'text'],
              ['time', 'Time (e.g. 7:00 AM)', 'text'],
              ['distance_miles', 'Distance (miles)', 'number'],
              ['pace', 'Pace (e.g. 16-18 mph)', 'text'],
              ['meetup_location', 'Meetup Location', 'text'],
            ] as [keyof Ride, string, string][]).map(([key, label, type]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
                <input type={type} value={String(editing[key] ?? '')}
                  onChange={e => setEditing({ ...editing, [key]: type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                  className="px-4 py-2.5 rounded-lg text-white text-sm outline-none"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Level</label>
              <select value={editing.level || 'All Levels'} onChange={e => setEditing({ ...editing, level: e.target.value as Ride['level'] })}
                className="px-4 py-2.5 rounded-lg text-white text-sm outline-none appearance-none"
                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
              <textarea rows={3} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })}
                className="px-4 py-2.5 rounded-lg text-white text-sm outline-none resize-none"
                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="pub" checked={editing.is_published ?? true} onChange={e => setEditing({ ...editing, is_published: e.target.checked })} />
              <label htmlFor="pub" className="text-sm text-gray-400">Published (visible on site)</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-lg text-sm font-bold text-gray-400 hover:text-white transition-colors" style={{ border: '1px solid #2A2A2A' }}>Cancel</button>
              <button onClick={save} disabled={loading} className="flex-1 py-3 rounded-lg font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                style={{ background: '#F5A623', color: '#000' }}>
                <Save size={16} />{loading ? 'Saving...' : 'Save Ride'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
