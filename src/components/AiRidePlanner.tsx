'use client'
import { useState } from 'react'
import { Sparkles, Send, RotateCcw } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  "I'm in Bed-Stuy, have 2 hours Saturday morning, intermediate rider",
  "Beginner rider in Park Slope, want a flat easy 10-mile route",
  "I want a challenging 50-mile route that hits some NYC bridges",
  "Best route from Williamsburg to avoid traffic on a weekday evening",
]

export default function AiRidePlanner() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function send(text?: string) {
    const content = text || input.trim()
    if (!content || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ride-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.message }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong. Try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="ai-planner" className="py-24 px-5" style={{ background: '#0A0A0A' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)' }}
          >
            <Sparkles size={12} />
            AI-Powered · Exclusive Feature
          </div>
          <h2 className="text-5xl font-black text-white mb-4">Your AI Ride Planner</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Tell it where you are, how long you have, and your level. Get a custom Brooklyn/NYC route — instantly.
          </p>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid #2A2A2A', background: '#111' }}
        >
          {/* Chat area */}
          <div className="h-96 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)' }}
                >
                  <Sparkles size={24} style={{ color: '#F5A623' }} />
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Ask me anything about riding in NYC</p>
                  <p className="text-gray-500 text-sm">Routes, pacing, where to start, what to bring</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-2 rounded-lg text-left transition-colors hover:text-white"
                      style={{
                        background: '#1A1A1A',
                        border: '1px solid #2A2A2A',
                        color: '#999',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0"
                    style={{ background: 'rgba(245,166,35,0.15)' }}
                  >
                    <Sparkles size={14} style={{ color: '#F5A623' }} />
                  </div>
                )}
                <div
                  className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                  style={
                    msg.role === 'user'
                      ? { background: '#F5A623', color: '#000', fontWeight: 600 }
                      : { background: '#1A1A1A', color: '#E5E5E5', border: '1px solid #2A2A2A' }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(245,166,35,0.1)' }}
                >
                  <Sparkles size={14} style={{ color: '#F5A623' }} />
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: '#F5A623', animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-3 px-4 py-4"
            style={{ borderTop: '1px solid #2A2A2A', background: '#0A0A0A' }}
          >
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="p-2 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: '#666' }}
              >
                <RotateCcw size={16} />
              </button>
            )}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Where are you starting? How long do you have?"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-lg transition-all hover:scale-105 disabled:opacity-40"
              style={{ background: '#F5A623', color: '#000' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
