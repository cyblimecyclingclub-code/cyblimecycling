'use client'
import { useEffect, useState } from 'react'
import { supabase, type JoinRequest } from '@/lib/supabase'
import { Mail, Phone, Trash2, ChevronDown } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  pending: '#F5A623',
  contacted: '#3b82f6',
  joined: '#22c55e',
  declined: '#ef4444',
}

export default function AdminMembers() {
  const [members, setMembers] = useState<JoinRequest[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  async function load() {
    let q = supabase.from('join_requests').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setMembers(data || [])
  }
  useEffect(() => { load() }, [filter])

  async function updateStatus(id: string, status: string) {
    await supabase.from('join_requests').update({ status }).eq('id', id)
    await load()
  }

  async function del(id: string) {
    if (!confirm('Delete this member request?')) return
    await supabase.from('join_requests').delete().eq('id', id)
    await load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Members</h1>
          <p className="text-gray-500 mt-1">{members.length} requests</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'contacted', 'joined', 'declined'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              style={{
                background: filter === s ? (STATUS_COLORS[s] || '#F5A623') : '#1A1A1A',
                color: filter === s ? '#000' : '#9CA3AF',
                border: '1px solid #2A2A2A',
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {members.map(m => (
          <div key={m.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2A', background: '#111' }}>
            <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => setExpanded(expanded === m.id ? null : m.id!)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm" style={{ background: '#1A1A1A', color: '#F5A623' }}>
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white">{m.name}</div>
                  <div className="text-sm text-gray-500">{m.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1 rounded-full font-bold"
                  style={{ background: `${STATUS_COLORS[m.status || 'pending']}20`, color: STATUS_COLORS[m.status || 'pending'] }}>
                  {m.status || 'pending'}
                </span>
                <span className="text-xs text-gray-600">{m.created_at ? new Date(m.created_at).toLocaleDateString() : ''}</span>
                <ChevronDown size={16} className="text-gray-500" style={{ transform: expanded === m.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>

            {expanded === m.id && (
              <div className="px-5 pb-5 pt-0" style={{ borderTop: '1px solid #1A1A1A' }}>
                <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
                  <div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Experience</div>
                    <div className="text-sm text-gray-300">{m.experience}</div>
                  </div>
                  {m.phone && (
                    <div>
                      <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Phone</div>
                      <div className="text-sm text-gray-300">{m.phone}</div>
                    </div>
                  )}
                  {m.message && (
                    <div className="col-span-2">
                      <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Message</div>
                      <div className="text-sm text-gray-300">{m.message}</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-600 uppercase tracking-wider mr-2">Update Status:</span>
                  {['pending', 'contacted', 'joined', 'declined'].map(s => (
                    <button key={s} onClick={() => updateStatus(m.id!, s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                      style={{
                        background: m.status === s ? STATUS_COLORS[s] : '#1A1A1A',
                        color: m.status === s ? '#000' : '#9CA3AF',
                        border: `1px solid ${m.status === s ? STATUS_COLORS[s] : '#2A2A2A'}`,
                      }}>
                      {s}
                    </button>
                  ))}
                  <a href={`mailto:${m.email}`} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors" style={{ border: '1px solid #2A2A2A' }}>
                    <Mail size={12} /> Email
                  </a>
                  <button onClick={() => del(m.id!)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-400/10 transition-colors" style={{ border: '1px solid #2A2A2A' }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {members.length === 0 && (
          <div className="text-center py-16 text-gray-600">No {filter !== 'all' ? filter : ''} requests yet.</div>
        )}
      </div>
    </div>
  )
}
