'use client'
import { useEffect, useState } from 'react'
import { supabase, type SiteSetting } from '@/lib/supabase'
import { Save, CheckCircle } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('*').order('key').then(({ data }) => setSettings(data || []))
  }, [])

  function update(key: string, value: string) {
    setSettings(s => s.map(item => item.key === key ? { ...item, value } : item))
  }

  async function saveAll() {
    setLoading(true)
    await Promise.all(settings.map(s => supabase.from('site_settings').upsert({ key: s.key, value: s.value, label: s.label })))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const groups = [
    { label: 'Hero Section', keys: ['hero_headline_line1', 'hero_headline_line2', 'hero_headline_line3', 'hero_subtext'] },
    { label: 'About Section', keys: ['about_headline', 'about_body_1', 'about_body_2'] },
    { label: 'Rides Section', keys: ['rides_headline'] },
    { label: 'Join Section', keys: ['join_headline', 'join_subtext'] },
  ]

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Site Settings</h1>
          <p className="text-gray-500 mt-1">Edit all text content across the site</p>
        </div>
        <button onClick={saveAll} disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-black text-sm uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: saved ? '#22c55e' : '#F5A623', color: '#000' }}>
          {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} />{loading ? 'Saving...' : 'Save All'}</>}
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {groups.map(group => {
          const groupSettings = group.keys.map(k => settings.find(s => s.key === k)).filter(Boolean) as SiteSetting[]
          return (
            <div key={group.label} className="rounded-xl p-6" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
              <h2 className="font-black text-white mb-5" style={{ borderBottom: '1px solid #2A2A2A', paddingBottom: '12px' }}>{group.label}</h2>
              <div className="flex flex-col gap-4">
                {groupSettings.map(setting => (
                  <div key={setting.key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{setting.label || setting.key}</label>
                    {(setting.value?.length > 80 || setting.key.includes('body') || setting.key.includes('subtext')) ? (
                      <textarea rows={3} value={setting.value} onChange={e => update(setting.key, e.target.value)}
                        className="px-4 py-3 rounded-lg text-white text-sm outline-none resize-none leading-relaxed"
                        style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
                    ) : (
                      <input value={setting.value} onChange={e => update(setting.key, e.target.value)}
                        className="px-4 py-3 rounded-lg text-white text-sm outline-none"
                        style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
