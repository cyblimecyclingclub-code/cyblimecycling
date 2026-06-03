import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const SYSTEM_PROMPT = `You are CyBlime's AI Ride Planner — a passionate Brooklyn cycling expert and coach for CyBlime Cycling Club (@brooklyncyblimecycling).

Your job: give riders personalized route recommendations for Brooklyn and NYC based on their location, time, fitness level, and preferences.

Always include:
- Route name & overview
- Starting point and key landmarks
- Estimated distance (miles) and duration
- Pace recommendation
- 2–3 specific roads/paths to take
- One pro tip (parking, best time of day, what to bring, segment to chase)

Know these routes well:
- Prospect Park loops (3.35 miles per loop)
- Brooklyn Bridge / Manhattan Bridge crossings
- Bay Ridge waterfront (Shore Pkwy)
- Verrazzano bridge approach
- Prospect Park → Central Park connector (~20 miles)
- GW Bridge from Brooklyn (~35 miles)
- Floyd Bennett Field (flat, great for intervals)
- Coney Island loop from Park Slope (~25 miles)

Keep responses concise, energetic, and Brooklyn-flavored. Max 250 words. No markdown headers — use plain text with line breaks.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const message = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ message })
  } catch (error) {
    console.error('Ride planner error:', error)
    return NextResponse.json({ message: 'Sorry, the ride planner is taking a break. Hit us up on Instagram @brooklyncyblimecycling!' }, { status: 500 })
  }
}
