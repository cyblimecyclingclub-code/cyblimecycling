import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file || !file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Please upload a PDF file' }, { status: 400 })
    }

    // Parse PDF text
    const buffer = Buffer.from(await file.arrayBuffer())
    const parsed = await pdfParse(buffer)
    const content = parsed.text.trim()

    if (!content) {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 })
    }

    // Upload raw PDF to Supabase Storage
    const path = `knowledge/${Date.now()}-${file.name}`
    await supabaseAdmin.storage.from('media').upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

    // Save extracted text to knowledge_base table (upsert by file_name)
    const { error } = await supabaseAdmin
      .from('knowledge_base')
      .upsert({ file_name: file.name, content, updated_at: new Date().toISOString() }, { onConflict: 'file_name' })

    if (error) throw error

    return NextResponse.json({ success: true, chars: content.length, file: file.name })
  } catch (error) {
    console.error('Knowledge base upload error:', error)
    return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from('knowledge_base')
      .select('file_name, updated_at, content')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()
    return NextResponse.json(data || null)
  } catch {
    return NextResponse.json(null)
  }
}
