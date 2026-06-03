'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#0A0A0A' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-black mb-1">
            <span style={{ color: '#F5A623' }}>CY</span><span className="text-white">BLIME</span>
          </div>
          <div className="text-gray-500 text-sm uppercase tracking-widest">Admin Portal</div>
        </div>

        <form onSubmit={login} className="flex flex-col gap-4 p-8 rounded-2xl" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg text-white text-sm outline-none"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="px-4 py-3 rounded-lg text-white text-sm outline-none"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="py-3 rounded-lg font-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: '#F5A623', color: '#000' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
