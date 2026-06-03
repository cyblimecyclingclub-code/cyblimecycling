import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { file_name, content } = await req.json()
    if (!file_name || !content) {
      return NextResponse.json({ error: 'Missing file_name or content' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('knowledge_base')
      .upsert({ file_name, content, updated_at: new Date().toISOString() }, { onConflict: 'file_name' })

    if (error) throw error
    return NextResponse.json({ success: true, chars: content.length, file: file_name })
  } catch (error) {
    console.error('Knowledge base upload error:', error)
    return NextResponse.json({ error: 'Failed to save knowledge base' }, { status: 500 })
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
