import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createClient } from '@supabase/supabase-js'

let groq: Groq

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Cache knowledge base in memory (refreshes each cold start)
let cachedKnowledge: string | null = null
let cacheTime = 0

async function getKnowledge(): Promise<string> {
  // Refresh cache every 10 minutes
  if (cachedKnowledge && Date.now() - cacheTime < 10 * 60 * 1000) {
    return cachedKnowledge
  }
  try {
    const { data } = await supabase
      .from('knowledge_base')
      .select('content')
      .order('updated_at', { ascending: false })
      .limit(1)
    if (data?.[0]?.content) {
      cachedKnowledge = data[0].content
      cacheTime = Date.now()
      return data[0].content
    }
  } catch {
    // fall through to default
  }
  return ''
}

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ message: "The AI planner isn't configured yet. Hit us up on Instagram @brooklyncyblimecycling for ride help! 🚴" })
  }
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  try {
    const { messages } = await req.json()
    const knowledge = await getKnowledge()

    const systemPrompt = `You are the official AI assistant for CyBlime Cycling Club — a Brooklyn-based cycling community founded in 2020.

Answer all questions with energy, passion, and Brooklyn attitude. Be welcoming, community-first, and never corporate.

${knowledge
  ? `KNOWLEDGE BASE — use ONLY this information to answer questions about the club. Do not make up any facts not found here:\n\n${knowledge}`
  : `CORE FACTS:
- Club: CyBlime Cycling Club | Est. 2020 | Brooklyn, NY
- Instagram: @brooklyncyblimecycling
- Website: cyblime-cyclingclub.com
- Strava: strava.com/clubs/762372
- Mission: Promoting cycling through passion, experience, and the next ride`}

RULES:
- Only answer questions about CyBlime, cycling, rides, membership, routes, and events
- If you don't know something, direct users to Instagram DMs @brooklyncyblimecycling
- NEVER make up ride dates, fees, or policies not in the knowledge base
- Keep responses concise and energetic — max 200 words
- No markdown headers, use plain text with line breaks`

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 500,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
    })

    const message = response.choices[0]?.message?.content || ''
    return NextResponse.json({ message })
  } catch (error) {
    console.error('Ride planner error:', error)
    return NextResponse.json({ message: "Sorry, I'm taking a quick breather! Hit us up on Instagram @brooklyncyblimecycling for anything you need 🚴" })
  }
}
