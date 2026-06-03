'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase, type SiteSetting } from '@/lib/supabase'
import { Save, CheckCircle, Upload, FileText, RefreshCw, Image as ImageIcon, X } from 'lucide-react'

// ── Image upload card ──────────────────────────────────────────────────────────
function ImageUploadCard({
  label,
  description,
  settingKey,
  currentUrl,
  onChange,
}: {
  label: string
  description: string
  settingKey: string
  currentUrl: string
  onChange: (key: string, url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [preview, setPreview] = useState(currentUrl)

  // sync if parent changes
  useEffect(() => { setPreview(currentUrl) }, [currentUrl])

  async function handleFile(file: File) {
    if (!file) return
    setUploading(true)
    setMsg('Uploading…')
    try {
      const ext = file.name.split('.').pop()
      const path = `site/${settingKey}-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('media').upload(path, file, { upsert: true })
      if (upErr) throw new Error(upErr.message)

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
      // Save to site_settings
      const { error: dbErr } = await supabase
        .from('site_settings')
        .upsert({ key: settingKey, value: publicUrl, label }, { onConflict: 'key' })
      if (dbErr) throw new Error(dbErr.message)

      setPreview(publicUrl)
      onChange(settingKey, publicUrl)
      setMsg('✓ Image updated')
    } catch (err) {
      setMsg(`✗ ${err instanceof Error ? err.message : 'Upload failed'}`)
    }
    setUploading(false)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
      {/* Preview */}
      <div className="relative" style={{ height: 180 }}>
        {preview ? (
          <img src={preview} alt={label} className="w-full h-full object-cover" style={{ filter: 'brightness(0.85)' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: '#111' }}>
            <ImageIcon size={32} color="#333" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <div className="text-xs font-black text-white uppercase tracking-wider">{label}</div>
          <div className="text-xs text-gray-400">{description}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex items-center gap-3">
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>
          {uploading
            ? <><RefreshCw size={12} className="animate-spin" /> Uploading…</>
            : <><Upload size={12} /> Replace Image</>}
        </button>
        {msg && (
          <span className="text-xs" style={{ color: msg.startsWith('✓') ? '#22c55e' : '#ef4444' }}>{msg}</span>
        )}
      </div>
    </div>
  )
}

// ── Main settings page ─────────────────────────────────────────────────────────
export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [kbFile, setKbFile] = useState<{ file_name: string; updated_at: string } | null>(null)
  const [kbUploading, setKbUploading] = useState(false)
  const [kbMsg, setKbMsg] = useState('')
  const kbInputRef = useRef<HTMLInputElement>(null)

  // Image setting values (keyed)
  const [imageSettings, setImageSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    supabase.from('site_settings').select('*').order('key').then(({ data }) => {
      const rows = data || []
      setSettings(rows)
      const imgs: Record<string, string> = {}
      for (const r of rows) {
        if (['hero_image', 'about_image', 'join_image'].includes(r.key)) imgs[r.key] = r.value
      }
      setImageSettings(imgs)
    })
    supabase.from('knowledge_base').select('file_name, updated_at').order('updated_at', { ascending: false }).limit(1)
      .then(({ data }) => data?.[0] && setKbFile(data[0]))
  }, [])

  function handleImageChange(key: string, url: string) {
    setImageSettings(prev => ({ ...prev, [key]: url }))
    setSettings(s => s.map(item => item.key === key ? { ...item, value: url } : item))
  }

  async function uploadKb(file: File) {
    setKbUploading(true)
    setKbMsg('Extracting text from PDF…')
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let text = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map((item) => ('str' in item ? item.str : '')).join(' ') + '\n'
      }
      text = text.trim()
      if (!text) throw new Error('No text found in PDF')

      await supabase.from('knowledge_base').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      const { error } = await supabase.from('knowledge_base').insert({ file_name: file.name, content: text, updated_at: new Date().toISOString() })
      if (error) throw new Error(error.message)
      setKbMsg(`✓ Uploaded — ${text.length.toLocaleString()} characters extracted`)
      setKbFile({ file_name: file.name, updated_at: new Date().toISOString() })
    } catch (err) {
      setKbMsg(`✗ ${err instanceof Error ? err.message : 'Failed to process PDF'}`)
    }
    setKbUploading(false)
  }

  function update(key: string, value: string) {
    setSettings(s => s.map(item => item.key === key ? { ...item, value } : item))
  }

  async function saveAll() {
    setLoading(true)
    await Promise.all(settings.map(s => supabase.from('site_settings').upsert({ key: s.key, value: s.value, label: s.label }, { onConflict: 'key' })))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const TEXT_GROUPS = [
    { label: 'Hero Section', keys: ['hero_headline_line1', 'hero_headline_line2', 'hero_headline_line3', 'hero_subtext'] },
    { label: 'About Section', keys: ['about_headline', 'about_body_1', 'about_body_2'] },
    { label: 'Rides Section', keys: ['rides_headline'] },
    { label: 'Join Section', keys: ['join_headline', 'join_subtext'] },
  ]

  const IMAGE_CARDS = [
    { key: 'hero_image', label: 'Hero Background', description: 'Full-page background on the homepage hero' },
    { key: 'about_image', label: 'About Section', description: 'Photo shown in the "Born in Brooklyn" section' },
    { key: 'join_image', label: 'Join Section', description: 'Photo shown in the "Ready to Ride" section' },
  ]

  const DEFAULTS: Record<string, string> = {
    hero_image:  'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=1800&q=80',
    about_image: 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=800&q=80',
    join_image:  'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80',
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Site Settings</h1>
          <p className="text-gray-500 mt-1">Manage images, content, and AI knowledge base</p>
        </div>
        <button onClick={saveAll} disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-black text-sm uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: saved ? '#22c55e' : '#F5A623', color: '#000' }}>
          {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} />{loading ? 'Saving…' : 'Save All'}</>}
        </button>
      </div>

      {/* ── Images section ──────────────────────────────────── */}
      <div className="rounded-xl p-6 mb-8" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
        <h2 className="font-black text-white mb-1 flex items-center gap-2">
          <ImageIcon size={18} style={{ color: '#F5A623' }} /> Site Images
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          Upload your own photos to replace the stock images. Supports JPG, PNG, WebP. Changes are live immediately.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {IMAGE_CARDS.map(card => (
            <ImageUploadCard
              key={card.key}
              label={card.label}
              description={card.description}
              settingKey={card.key}
              currentUrl={imageSettings[card.key] || DEFAULTS[card.key]}
              onChange={handleImageChange}
            />
          ))}
        </div>
      </div>

      {/* ── AI Knowledge Base ───────────────────────────────── */}
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
          {kbUploading ? <><RefreshCw size={14} className="animate-spin" /> Processing…</> : <><Upload size={14} />{kbFile ? 'Replace PDF' : 'Upload PDF'}</>}
        </button>
        {kbMsg && <p className="mt-3 text-sm" style={{ color: kbMsg.startsWith('✓') ? '#22c55e' : '#ef4444' }}>{kbMsg}</p>}
      </div>

      {/* ── Text content ───────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {TEXT_GROUPS.map(group => {
          const groupSettings = group.keys.map(k => settings.find(s => s.key === k)).filter(Boolean) as SiteSetting[]
          if (!groupSettings.length) return null
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
