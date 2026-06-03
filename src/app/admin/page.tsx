'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Bike, Image, Users, Settings, ArrowRight, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ rides: 0, gallery: 0, members: 0, pending: 0 })
  const [recent, setRecent] = useState<{ name: string; email: string; created_at: string }[]>([])

  useEffect(() => {
    async function load() {
      const [{ count: rides }, { count: gallery }, { count: members }, { count: pending }, { data: recentData }] = await Promise.all([
        supabase.from('rides').select('*', { count: 'exact', head: true }),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
        supabase.from('join_requests').select('*', { count: 'exact', head: true }),
        supabase.from('join_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('join_requests').select('name,email,created_at').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({ rides: rides || 0, gallery: gallery || 0, members: members || 0, pending: pending || 0 })
      setRecent(recentData || [])
    }
    load()
  }, [])

  const cards = [
    { label: 'Rides', value: stats.rides, icon: Bike, href: '/admin/rides', color: '#F5A623' },
    { label: 'Gallery Photos', value: stats.gallery, icon: Image, href: '/admin/gallery', color: '#3b82f6' },
    { label: 'Total Members', value: stats.members, icon: Users, href: '/admin/members', color: '#22c55e' },
    { label: 'Pending Requests', value: stats.pending, icon: Clock, href: '/admin/members', color: '#ef4444' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Dashboard</h1>
        <p className="text-gray-500 mt-1">CyBlime Cycling Club — Admin Portal</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className="rounded-xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.02]"
            style={{ background: '#111', border: '1px solid #2A2A2A' }}>
            <div className="flex items-center justify-between">
              <Icon size={20} style={{ color }} />
              <ArrowRight size={14} className="text-gray-600" />
            </div>
            <div>
              <div className="text-3xl font-black text-white">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent join requests */}
        <div className="rounded-xl p-6" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-white">Recent Join Requests</h2>
            <Link href="/admin/members" className="text-xs uppercase tracking-wider" style={{ color: '#F5A623' }}>View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-gray-600 text-sm">No requests yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recent.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1A1A1A' }}>
                  <div>
                    <div className="text-sm font-bold text-white">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.email}</div>
                  </div>
                  <div className="text-xs text-gray-600">{new Date(r.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-xl p-6" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
          <h2 className="font-black text-white mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Add a new ride', href: '/admin/rides', icon: Bike },
              { label: 'Upload gallery photo', href: '/admin/gallery', icon: Image },
              { label: 'Edit site copy', href: '/admin/settings', icon: Settings },
              { label: 'View all members', href: '/admin/members', icon: Users },
            ].map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/5"
                style={{ border: '1px solid #2A2A2A' }}>
                <Icon size={16} style={{ color: '#F5A623' }} />
                <span className="text-sm text-gray-300">{label}</span>
                <ArrowRight size={14} className="ml-auto text-gray-600" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
