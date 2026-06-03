import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, experience, message } = body

    if (!name || !email || !experience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // When Supabase is connected, insert here:
    // const { error } = await supabase.from('join_requests').insert([{ name, email, phone, experience, message }])
    // if (error) throw error

    console.log('New join request:', { name, email, phone, experience, message })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Join request error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
