'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase, type SiteSetting } from '@/lib/supabase'
import { Save, CheckCircle, Upload, FileText, RefreshCw } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [kbFile, setKbFile] = useState<{ file_name: string; updated_at: string } | null>(null)
  const [kbUploading, setKbUploading] = useState(false)
  const [kbMsg, setKbMsg] = useState('')
  const kbInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/knowledge-base').then(r => r.json()).then(d => d && setKbFile(d))
  }, [])

  async function uploadKb(file: File) {
    setKbUploading(true)
    setKbMsg('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/knowledge-base', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.success) {
      setKbMsg(`✓ Uploaded — ${data.chars.toLocaleString()} characters extracted`)
      setKbFile({ file_name: data.file, updated_at: new Date().toISOString() })
    } else {
      setKbMsg(`✗ ${data.error}`)
    }
    setKbUploading(false)
  }

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

      {/* Knowledge Base */}
      <div className="rounded-xl p-6 mb-8" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
        <h2 className="font-black text-white mb-1">AI Knowledge Base</h2>
        <p className="text-xs text-gray-500 mb-5">The AI assistant answers questions using ONLY the content in this PDF. Upload a new version anytime to update what it knows.</p>
        <input ref={kbInputRef} type="file" accept=".pdf" className="hidden"
          onChange={e => e.target.files?.[0] && uploadKb(e.target.files[0])} />
        {kbFile && (
          <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-lg" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
            <FileText size={18} color="#F5A623" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">{kbFile.file_name}</div>
              <div className="text-xs text-gray-500">Last updated: {new Date(kbFile.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>
        )}
        <button onClick={() => kbInputRef.current?.click()} disabled={kbUploading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>
          {kbUploading ? <><RefreshCw size={14} className="animate-spin" /> Processing...</> : <><Upload size={14} />{kbFile ? 'Replace PDF' : 'Upload PDF'}</>}
        </button>
        {kbMsg && <p className="mt-3 text-sm" style={{ color: kbMsg.startsWith('✓') ? '#22c55e' : '#ef4444' }}>{kbMsg}</p>}
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
