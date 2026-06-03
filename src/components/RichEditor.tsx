'use client'
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewProps } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Bold, Italic, UnderlineIcon, Heading2, Heading3,
  List, ListOrdered, Quote, AlignLeft, AlignCenter,
  AlignRight, Link2, ImageIcon, Minus, Undo, Redo, X
} from 'lucide-react'

type Props = { value: string; onChange: (html: string) => void }

// ── Layout option type ────────────────────────────────────────────────────────
type LayoutOption = {
  id: string
  label: string
  icon: React.ReactNode
  apply: (attrs: Record<string, string>) => Record<string, string>
}

const INLINE_LAYOUTS: LayoutOption[] = [
  {
    id: 'inline',
    label: 'In Line with Text',
    icon: <InlineIcon />,
    apply: () => ({ float: 'none', display: 'inline', align: 'inline' }),
  },
]

const WRAP_LAYOUTS: LayoutOption[] = [
  {
    id: 'wrap-left',
    label: 'Square – Left',
    icon: <WrapLeftIcon />,
    apply: () => ({ float: 'left', display: 'block', align: 'left' }),
  },
  {
    id: 'wrap-center',
    label: 'Top and Bottom',
    icon: <WrapTopBotIcon />,
    apply: () => ({ float: 'none', display: 'block', align: 'center' }),
  },
  {
    id: 'wrap-right',
    label: 'Square – Right',
    icon: <WrapRightIcon />,
    apply: () => ({ float: 'right', display: 'block', align: 'right' }),
  },
  {
    id: 'wide',
    label: 'Full Width',
    icon: <FullWidthIcon />,
    apply: () => ({ float: 'none', display: 'block', align: 'full' }),
  },
]

// ── SVG layout icons (matching Word style) ────────────────────────────────────
function InlineIcon() {
  return (
    <svg width="32" height="26" viewBox="0 0 32 26">
      <rect x="2" y="4" width="12" height="10" rx="1" fill="#888" />
      <rect x="16" y="5" width="14" height="2" rx="1" fill="#555" />
      <rect x="16" y="9" width="10" height="2" rx="1" fill="#555" />
      <rect x="2" y="16" width="28" height="2" rx="1" fill="#555" />
      <rect x="2" y="20" width="22" height="2" rx="1" fill="#555" />
    </svg>
  )
}
function WrapLeftIcon() {
  return (
    <svg width="32" height="26" viewBox="0 0 32 26">
      <rect x="2" y="4" width="12" height="14" rx="1" fill="#888" />
      <rect x="16" y="5" width="14" height="2" rx="1" fill="#555" />
      <rect x="16" y="9" width="14" height="2" rx="1" fill="#555" />
      <rect x="16" y="13" width="10" height="2" rx="1" fill="#555" />
      <rect x="2" y="20" width="28" height="2" rx="1" fill="#555" />
    </svg>
  )
}
function WrapRightIcon() {
  return (
    <svg width="32" height="26" viewBox="0 0 32 26">
      <rect x="18" y="4" width="12" height="14" rx="1" fill="#888" />
      <rect x="2" y="5" width="14" height="2" rx="1" fill="#555" />
      <rect x="2" y="9" width="14" height="2" rx="1" fill="#555" />
      <rect x="6" y="13" width="10" height="2" rx="1" fill="#555" />
      <rect x="2" y="20" width="28" height="2" rx="1" fill="#555" />
    </svg>
  )
}
function WrapTopBotIcon() {
  return (
    <svg width="32" height="26" viewBox="0 0 32 26">
      <rect x="2" y="2" width="28" height="2" rx="1" fill="#555" />
      <rect x="8" y="7" width="16" height="10" rx="1" fill="#888" />
      <rect x="2" y="20" width="28" height="2" rx="1" fill="#555" />
      <rect x="2" y="24" width="20" height="2" rx="1" fill="#555" />
    </svg>
  )
}
function FullWidthIcon() {
  return (
    <svg width="32" height="26" viewBox="0 0 32 26">
      <rect x="2" y="2" width="28" height="2" rx="1" fill="#555" />
      <rect x="2" y="7" width="28" height="10" rx="1" fill="#888" />
      <rect x="2" y="20" width="28" height="2" rx="1" fill="#555" />
      <rect x="2" y="24" width="20" height="2" rx="1" fill="#555" />
    </svg>
  )
}

// ── Layout Options popup ──────────────────────────────────────────────────────
function LayoutOptionsPanel({
  currentAlign,
  onSelect,
  onClose,
}: {
  currentAlign: string
  onSelect: (layout: LayoutOption) => void
  onClose: () => void
}) {
  return (
    <div
      contentEditable={false}
      style={{
        position: 'absolute',
        top: 30,
        right: 0,
        zIndex: 100,
        background: '#1A1A1A',
        border: '1px solid #3A3A3A',
        borderRadius: 10,
        padding: '12px',
        width: 170,
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Layout Options</span>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
          <X size={12} />
        </button>
      </div>

      <div style={{ fontSize: 10, color: '#666', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>In Line with Text</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {INLINE_LAYOUTS.map(opt => (
          <LayoutIcon key={opt.id} opt={opt} active={currentAlign === 'inline'} onSelect={onSelect} />
        ))}
      </div>

      <div style={{ fontSize: 10, color: '#666', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>With Text Wrapping</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {WRAP_LAYOUTS.map(opt => (
          <LayoutIcon key={opt.id} opt={opt} active={currentAlign === opt.apply({}).align} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

function LayoutIcon({ opt, active, onSelect }: { opt: LayoutOption; active: boolean; onSelect: (o: LayoutOption) => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      title={opt.label}
      onClick={() => onSelect(opt)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 44,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        cursor: 'pointer',
        border: active ? '2px solid #F5A623' : hovered ? '1px solid #444' : '1px solid #2A2A2A',
        background: active ? 'rgba(245,166,35,0.15)' : hovered ? '#222' : '#111',
        transition: 'all 0.15s',
      }}
    >
      {opt.icon}
    </div>
  )
}

// ── Resizable image node view ─────────────────────────────────────────────────
function ResizableImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const startW = useRef(0)
  const [showLayout, setShowLayout] = useState(false)
  const [active, setActive] = useState(false)

  const float = node.attrs.float ?? 'none'
  const align = node.attrs.align ?? 'full'
  const width = node.attrs.width ?? '100%'

  // Use TipTap selected OR our own active state (persists while panel is open)
  const isSelected = selected || active

  // Close when clicking elsewhere — use setTimeout so button onClick fires first
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setTimeout(() => {
          setActive(false)
          setShowLayout(false)
        }, 0)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent, side: 'left' | 'right') => {
    e.preventDefault()
    e.stopPropagation()
    startX.current = e.clientX
    startW.current = imgRef.current?.offsetWidth ?? 400

    function onMove(ev: MouseEvent) {
      const dx = side === 'right' ? ev.clientX - startX.current : startX.current - ev.clientX
      const newW = Math.max(80, startW.current + dx)
      if (imgRef.current) imgRef.current.style.width = `${newW}px`
      if (wrapRef.current) wrapRef.current.style.width = `${newW}px`
    }

    function onUp(ev: MouseEvent) {
      const dx = side === 'right' ? ev.clientX - startX.current : startX.current - ev.clientX
      const newW = Math.max(80, startW.current + dx)
      updateAttributes({ width: `${newW}px` })
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [updateAttributes])

  function applyLayout(opt: LayoutOption) {
    const newAttrs = opt.apply({})
    updateAttributes({
      float: newAttrs.float,
      align: newAttrs.align,
      // Reset width to % when switching layout
      width: newAttrs.align === 'full' ? '100%' : newAttrs.align === 'inline' ? '40%' : '45%',
    })
    setShowLayout(false)
  }

  const wrapStyle: React.CSSProperties = {
    position: 'relative',
    display: float !== 'none' ? 'inline-block' : 'block',
    float: float as 'left' | 'right' | 'none',
    width: align === 'full' ? '100%' : width,
    maxWidth: '100%',
    margin: float === 'left'
      ? '0.25rem 1.5rem 1rem 0'
      : float === 'right'
        ? '0.25rem 0 1rem 1.5rem'
        : '1.5rem auto',
    lineHeight: 0,
    cursor: 'default',
  }

  const handleBase: React.CSSProperties = {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: '50%',
    background: '#F5A623',
    border: '2px solid #000',
    cursor: 'ew-resize',
    zIndex: 20,
    opacity: isSelected ? 1 : 0,
    transition: 'opacity 0.15s',
  }

  return (
    <NodeViewWrapper style={{ display: 'inline' }}>
      <div ref={wrapRef} style={wrapStyle} contentEditable={false}>
        <img
          ref={imgRef}
          src={node.attrs.src}
          alt={node.attrs.alt ?? ''}
          draggable={false}
          onClick={() => setActive(true)}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: 10,
            border: isSelected ? '2px solid #F5A623' : '1px solid #2A2A2A',
            boxSizing: 'border-box',
            cursor: 'pointer',
          }}
        />

        {/* Resize handles — corners */}
        <div style={{ ...handleBase, top: -5, left: -5, cursor: 'nwse-resize' }} onMouseDown={e => onMouseDown(e, 'left')} />
        <div style={{ ...handleBase, top: -5, right: -5, cursor: 'nesw-resize' }} onMouseDown={e => onMouseDown(e, 'right')} />
        <div style={{ ...handleBase, bottom: -5, left: -5, cursor: 'nesw-resize' }} onMouseDown={e => onMouseDown(e, 'left')} />
        <div style={{ ...handleBase, bottom: -5, right: -5, cursor: 'nwse-resize' }} onMouseDown={e => onMouseDown(e, 'right')} />
        {/* Mid-edge handles */}
        <div style={{ ...handleBase, top: '50%', left: -5, marginTop: -5, cursor: 'ew-resize' }} onMouseDown={e => onMouseDown(e, 'left')} />
        <div style={{ ...handleBase, top: '50%', right: -5, marginTop: -5, cursor: 'ew-resize' }} onMouseDown={e => onMouseDown(e, 'right')} />

        {/* Layout Options button (Word-style icon in top-right) */}
        {isSelected && (
          <button
            type="button"
            title="Layout Options"
            onClick={() => setShowLayout(v => !v)}
            style={{
              position: 'absolute',
              top: -14,
              right: -14,
              width: 22,
              height: 22,
              borderRadius: 4,
              background: '#F5A623',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              zIndex: 30,
            }}
          >
            {/* Word-style layout icon */}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="0.5" fill="#000" />
              <rect x="7" y="1" width="5" height="2" rx="0.5" fill="#000" />
              <rect x="7" y="4" width="3" height="2" rx="0.5" fill="#000" />
              <rect x="1" y="8" width="11" height="2" rx="0.5" fill="#000" />
              <rect x="1" y="11" width="7" height="1.5" rx="0.5" fill="#000" />
            </svg>
          </button>
        )}

        {/* Layout panel */}
        {showLayout && (
          <LayoutOptionsPanel
            currentAlign={align}
            onSelect={applyLayout}
            onClose={() => setShowLayout(false)}
          />
        )}
      </div>
    </NodeViewWrapper>
  )
}

// ── TipTap image extension ────────────────────────────────────────────────────
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: el => {
          const s = el.getAttribute('style') || ''
          const m = s.match(/width\s*:\s*([^;]+)/)
          return m ? m[1].trim() : (el.getAttribute('width') || '100%')
        },
        renderHTML: () => ({}),
      },
      float: {
        default: 'none',
        parseHTML: el => {
          const s = el.getAttribute('style') || ''
          if (/float\s*:\s*left/.test(s)) return 'left'
          if (/float\s*:\s*right/.test(s)) return 'right'
          return 'none'
        },
        renderHTML: () => ({}),
      },
      align: {
        default: 'full',
        parseHTML: el => {
          const s = el.getAttribute('style') || ''
          if (/float\s*:\s*left/.test(s)) return 'left'
          if (/float\s*:\s*right/.test(s)) return 'right'
          const m = s.match(/width\s*:\s*([^;]+)/)
          const w = m ? m[1].trim() : '100%'
          return w === '100%' ? 'full' : 'center'
        },
        renderHTML: () => ({}),
      },
      style: {
        default: null,
        parseHTML: () => null,
        renderHTML: attrs => {
          const f = attrs.float ?? 'none'
          const w = attrs.width ?? '100%'
          let style = ''
          if (f === 'left') {
            style = `width:${w}; float:left; margin:0.5rem 1.5rem 1rem 0;`
          } else if (f === 'right') {
            style = `width:${w}; float:right; margin:0.5rem 0 1rem 1.5rem;`
          } else {
            style = `width:${w}; float:none; display:block; margin:1.5rem auto;`
          }
          return { style }
        },
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView)
  },
})

// ── Toolbar button ────────────────────────────────────────────────────────────
function ToolbarButton({ onClick, active = false, title, children }: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode
}) {
  return (
    <button type="button" title={title} onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded transition-all hover:text-white"
      style={{
        background: active ? 'rgba(245,166,35,0.2)' : 'transparent',
        color: active ? '#F5A623' : '#9CA3AF',
        border: active ? '1px solid rgba(245,166,35,0.3)' : '1px solid transparent',
      }}>
      {children}
    </button>
  )
}

// ── Main editor ───────────────────────────────────────────────────────────────
export default function RichEditor({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      ResizableImage.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write your post here... Click an uploaded image to see resize handles and layout options.' }),
    ],
    content: value,
    onUpdate({ editor }) { onChange(editor.getHTML()) },
    editorProps: {
      attributes: {
        class: 'rich-editor-content',
        style: 'min-height:400px; outline:none; padding:20px; color:#E5E5E5; font-size:16px; line-height:1.8;',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value)
  }, [])

  if (!editor) return null

  function addImage() {
    const url = window.prompt('Image URL:')
    if (url) editor?.chain().focus().setImage({ src: url } as never).run()
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('media').upload(path, file, { upsert: false })
      if (error) throw error
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      editor?.chain().focus().setImage({ src: data.publicUrl } as never).run()
    } catch (err) {
      alert('Upload failed. Make sure the "media" storage bucket exists in Supabase.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  function addLink() {
    const url = window.prompt('URL:')
    if (url) editor?.chain().focus().setLink({ href: url }).run()
  }

  const tb = editor

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2A', background: '#0D0D0D' }}>
      <div className="flex flex-wrap items-center gap-1 px-3 py-2" style={{ borderBottom: '1px solid #2A2A2A', background: '#111' }}>
        <ToolbarButton onClick={() => tb.chain().focus().undo().run()} title="Undo"><Undo size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => tb.chain().focus().redo().run()} title="Redo"><Redo size={14} /></ToolbarButton>
        <div className="w-px h-5 mx-1" style={{ background: '#2A2A2A' }} />
        <ToolbarButton onClick={() => tb.chain().focus().toggleBold().run()} active={tb.isActive('bold')} title="Bold"><Bold size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => tb.chain().focus().toggleItalic().run()} active={tb.isActive('italic')} title="Italic"><Italic size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => tb.chain().focus().toggleUnderline().run()} active={tb.isActive('underline')} title="Underline"><UnderlineIcon size={14} /></ToolbarButton>
        <div className="w-px h-5 mx-1" style={{ background: '#2A2A2A' }} />
        <ToolbarButton onClick={() => tb.chain().focus().toggleHeading({ level: 2 }).run()} active={tb.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => tb.chain().focus().toggleHeading({ level: 3 }).run()} active={tb.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={14} /></ToolbarButton>
        <div className="w-px h-5 mx-1" style={{ background: '#2A2A2A' }} />
        <ToolbarButton onClick={() => tb.chain().focus().toggleBulletList().run()} active={tb.isActive('bulletList')} title="Bullet List"><List size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => tb.chain().focus().toggleOrderedList().run()} active={tb.isActive('orderedList')} title="Numbered List"><ListOrdered size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => tb.chain().focus().toggleBlockquote().run()} active={tb.isActive('blockquote')} title="Quote"><Quote size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => tb.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={14} /></ToolbarButton>
        <div className="w-px h-5 mx-1" style={{ background: '#2A2A2A' }} />
        <ToolbarButton onClick={() => tb.chain().focus().setTextAlign('left').run()} active={tb.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => tb.chain().focus().setTextAlign('center').run()} active={tb.isActive({ textAlign: 'center' })} title="Align Center"><AlignCenter size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => tb.chain().focus().setTextAlign('right').run()} active={tb.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight size={14} /></ToolbarButton>
        <div className="w-px h-5 mx-1" style={{ background: '#2A2A2A' }} />
        <ToolbarButton onClick={addLink} active={tb.isActive('link')} title="Add Link"><Link2 size={14} /></ToolbarButton>
        <ToolbarButton onClick={addImage} title="Insert Image (URL)"><ImageIcon size={14} /></ToolbarButton>
        <button type="button" title="Upload Image from Computer"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all hover:text-white"
          style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)', opacity: uploading ? 0.6 : 1 }}>
          <ImageIcon size={12} /> {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadImage} className="hidden" />
      </div>

      <EditorContent editor={editor} />

      <style>{`
        .rich-editor-content h2 { font-size:1.6rem; font-weight:900; color:#fff; margin:2rem 0 0.75rem; padding-bottom:0.5rem; border-bottom:1px solid #2A2A2A; }
        .rich-editor-content h3 { font-size:1.25rem; font-weight:900; color:#fff; margin:1.5rem 0 0.5rem; }
        .rich-editor-content p { margin-bottom:1rem; color:#D1D5DB; }
        .rich-editor-content strong { font-weight:900; color:#fff; }
        .rich-editor-content em { color:#9CA3AF; }
        .rich-editor-content ul { list-style:none; margin:0 0 1rem; padding:0; }
        .rich-editor-content ul li::before { content:"→ "; color:#F5A623; font-weight:bold; }
        .rich-editor-content ol { margin:0 0 1rem 1.5rem; color:#D1D5DB; }
        .rich-editor-content blockquote { border-left:3px solid #F5A623; padding-left:1rem; margin:1.5rem 0; color:#9CA3AF; font-style:italic; }
        .rich-editor-content hr { border:none; border-top:1px solid #2A2A2A; margin:2rem 0; }
        .rich-editor-content a { color:#F5A623; text-decoration:underline; }
        .tiptap p.is-editor-empty:first-child::before { content:attr(data-placeholder); float:left; color:#4B5563; pointer-events:none; height:0; }
      `}</style>
    </div>
  )
}
