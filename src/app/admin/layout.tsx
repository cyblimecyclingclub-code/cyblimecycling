'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import './override.css'
import { LayoutDashboard, Bike, Image, Users, Settings, LogOut, ChevronRight, FileText, Menu, X } from 'lucide-react'

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
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
      setLoading(false)
    })
  }, [pathname, router])

  useEffect(() => {
    document.body.style.overflow = 'auto'
    return () => { document.body.style.overflow = 'hidden' }
  }, [])

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

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

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b flex items-center justify-between" style={{ borderColor: '#1A1A1A' }}>
        <div>
          <div className="text-lg font-black">
            <span style={{ color: '#F5A623' }}>CY</span><span className="text-white">BLIME</span>
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-widest">Admin</div>
        </div>
        <button onClick={() => setMobileOpen(false)} className="md:hidden text-gray-500 hover:text-white p-1" aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all"
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
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0A0A' }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col" style={{ background: '#0D0D0D', borderRight: '1px solid #1A1A1A' }}>
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col z-10" style={{ background: '#0D0D0D', borderRight: '1px solid #1A1A1A' }}>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-40" style={{ background: '#0D0D0D', borderBottom: '1px solid #1A1A1A' }}>
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="text-sm font-black">
            <span style={{ color: '#F5A623' }}>CY</span><span className="text-white">BLIME</span>
            <span className="text-gray-600 font-normal ml-2 uppercase tracking-widest text-xs">Admin</span>
          </div>
        </div>

        <main className="flex-1" data-admin="true">
          {children}
        </main>
      </div>
    </div>
  )
}
