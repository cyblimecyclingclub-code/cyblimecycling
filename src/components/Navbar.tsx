'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/rides', label: 'Rides' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/ai-planner', label: 'Ride Planner' },
  { href: '/blog', label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/join', label: 'Join' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isAdmin = pathname.startsWith('/admin')
  if (isAdmin) return null

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,10,10,0.97)' : 'rgba(10,10,10,0.6)',
        borderBottom: scrolled ? '1px solid #2A2A2A' : '1px solid transparent',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight">
            <span style={{ color: '#F5A623' }}>CY</span>
            <span className="text-white">BLIME</span>
          </span>
          <span className="text-xs text-gray-500 hidden sm:block uppercase tracking-widest">
            Cycling Club
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm uppercase tracking-wider transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
              style={{ color: pathname === l.href ? '#F5A623' : '#9CA3AF' }}
              aria-current={pathname === l.href ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/join"
            className="text-sm font-black px-4 py-2 rounded uppercase tracking-wider transition-all duration-200 hover:scale-105"
            style={{ background: '#F5A623', color: '#000' }}
          >
            Ride With Us
          </Link>
        </nav>

        <button className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onClick={() => setOpen(!open)} style={{ color: '#F5A623' }}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open} aria-controls="mobile-nav">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile navigation"
          className="md:hidden px-5 pb-6 pt-2 flex flex-col gap-1"
          style={{ background: 'rgba(10,10,10,0.98)', borderBottom: '1px solid #2A2A2A' }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-base uppercase tracking-wider py-3 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{ color: pathname === l.href ? '#F5A623' : '#D1D5DB' }}
              aria-current={pathname === l.href ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/join" onClick={() => setOpen(false)}
            className="mt-2 text-center text-sm font-black px-4 py-3 rounded-lg uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-yellow-400"
            style={{ background: '#F5A623', color: '#000' }}>
            Ride With Us
          </Link>
        </nav>
      )}
    </header>
  )
}
