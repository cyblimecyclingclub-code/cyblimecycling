'use client'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

const EXPERIENCE_LEVELS = [
  "Just getting started (under 1 year)",
  "Casual rider (1–2 years)",
  "Regular rider (2–4 years)",
  "Experienced (4+ years)",
  "Racer / Competitive",
]

export default function Join() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', experience: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setDone(true)
    } catch {
      alert('Something went wrong — try reaching us on Instagram @brooklyncyblimecycling')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="join" className="py-24 px-5" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#F5A623' }}>
            Membership
          </div>
          <h2 className="text-5xl font-black text-white mb-6">
            Ready to Roll<br />
            <span style={{ color: '#F5A623' }}>With Us?</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            We ride every weekend, year-round. No dues, no politics — just show up, clip in, and keep up.
            Fill out the form and we'll add you to the group chat before the next ride.
          </p>

          <div className="flex flex-col gap-4">
            {[
              'Weekly group rides for all levels',
              'Private group chat with ride updates',
              'Access to CyBlime custom kit orders',
              'Strava club membership & leaderboard',
              'Community events & cycling trips',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-gray-300">
                <CheckCircle size={18} style={{ color: '#F5A623', flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          {done ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{ background: '#111', border: '1px solid rgba(245,166,35,0.3)' }}
            >
              <CheckCircle size={48} className="mx-auto mb-4" style={{ color: '#F5A623' }} />
              <h3 className="text-2xl font-black text-white mb-2">You're in the mix!</h3>
              <p className="text-gray-400">
                We'll reach out via email before the next ride. In the meantime, follow us on{' '}
                <a
                  href="https://www.instagram.com/brooklyncyblimecycling/"
                  className="underline"
                  style={{ color: '#F5A623' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>{' '}
                and join the{' '}
                <a
                  href="https://www.strava.com/clubs/762372"
                  className="underline"
                  style={{ color: '#F5A623' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Strava club
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="rounded-2xl p-8 flex flex-col gap-5"
              style={{ background: '#111', border: '1px solid #2A2A2A' }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Your name"
                    className="px-4 py-3 rounded-lg text-sm text-white outline-none focus:ring-1 transition-all"
                    style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', focusRingColor: '#F5A623' } as React.CSSProperties}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="(optional)"
                    className="px-4 py-3 rounded-lg text-sm text-white outline-none transition-all"
                    style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="your@email.com"
                  className="px-4 py-3 rounded-lg text-sm text-white outline-none transition-all"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Riding Experience *</label>
                <select
                  required
                  value={form.experience}
                  onChange={(e) => update('experience', e.target.value)}
                  className="px-4 py-3 rounded-lg text-sm text-white outline-none transition-all appearance-none"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                >
                  <option value="">Select your level...</option>
                  {EXPERIENCE_LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Anything else?</label>
                <textarea
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder="Questions, how you heard about us, what you ride..."
                  rows={3}
                  className="px-4 py-3 rounded-lg text-sm text-white outline-none resize-none transition-all"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-lg font-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: '#F5A623', color: '#000' }}
              >
                {loading ? 'Sending...' : 'Join the Club'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
