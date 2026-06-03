'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import './override.css'
import { LayoutDashboard, Bike, Image, Users, Settings, LogOut, ChevronRight, FileText } from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/rides', label: 'Rides', icon: Bike },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
      setLoading(false)
    })
  }, [pathname, router])

  // Admin needs normal scroll, not snap
  useEffect(() => {
    document.body.style.overflow = 'auto'
    return () => { document.body.style.overflow = 'hidden' }
  }, [])

  if (pathname === '/admin/login') return <>{children}</>
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#F5A623', borderTopColor: 'transparent' }} />
    </div>
  )

  async function logout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0A0A' }}>
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col" style={{ background: '#0D0D0D', borderRight: '1px solid #1A1A1A' }}>
        <div className="px-5 py-5 border-b" style={{ borderColor: '#1A1A1A' }}>
          <div className="text-lg font-black">
            <span style={{ color: '#F5A623' }}>CY</span><span className="text-white">BLIME</span>
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-widest">Admin</div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                style={{ background: active ? 'rgba(245,166,35,0.1)' : 'transparent', color: active ? '#F5A623' : '#9CA3AF' }}>
                <Icon size={16} />
                <span className="font-medium">{label}</span>
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t" style={{ borderColor: '#1A1A1A' }}>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-white transition-colors mb-1">
            <span>← View Site</span>
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 transition-colors">
            <LogOut size={16} /><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto" data-admin="true" style={{ overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
