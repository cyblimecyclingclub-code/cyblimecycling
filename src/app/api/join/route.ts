import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, experience, message } = body

    if (!name || !email || !experience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save to Supabase
    await supabase.from('join_requests').insert([{ name, email, phone, experience, message }])

    // Send email notification
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'CyBlime Website <noreply@aagariabro.resend.app>',
        to: 'cyblimecycling@gmail.com',
        subject: `New Join Request — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#fff;padding:32px;border-radius:12px;">
            <h2 style="color:#F5A623;margin:0 0 24px;">New Join Request 🚴</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#9CA3AF;width:120px;">Name</td><td style="padding:8px 0;font-weight:bold;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#9CA3AF;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#F5A623;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#9CA3AF;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>` : ''}
              <tr><td style="padding:8px 0;color:#9CA3AF;">Experience</td><td style="padding:8px 0;">${experience}</td></tr>
              ${message ? `<tr><td style="padding:8px 0;color:#9CA3AF;">Message</td><td style="padding:8px 0;">${message}</td></tr>` : ''}
            </table>
            <div style="margin-top:32px;padding-top:24px;border-top:1px solid #2A2A2A;">
              <a href="https://cyblimecycling.vercel.app/admin/members" style="background:#F5A623;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:900;font-size:14px;">View in Admin →</a>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Join request error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
