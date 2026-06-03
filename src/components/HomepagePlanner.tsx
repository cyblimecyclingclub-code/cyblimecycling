import Link from 'next/link'
import { Sparkles, ArrowRight, MessageSquare } from 'lucide-react'

const EXAMPLES = [
  "I'm in Bed-Stuy, have 2 hours Saturday morning",
  "Beginner in Park Slope, want a flat 10-mile route",
  "Challenging 50-mile route hitting NYC bridges",
]

export default function HomepagePlanner() {
  return (
    <section style={{ background: '#0A0A0A', borderTop: '1px solid #1A1A1A' }}>
      <div className="max-w-7xl mx-auto px-5 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.25)' }}>
              <Sparkles size={12} />
              AI-Powered Feature
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
              Your Personal<br />
              <span style={{ color: '#F5A623' }}>Ride Planner</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Tell our AI where you're starting, how long you have, and your level.
              Get a custom Brooklyn/NYC route instantly — no app download required.
            </p>
            <Link href="/ai-planner"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black uppercase tracking-wider text-sm transition-all hover:scale-105"
              style={{ background: '#F5A623', color: '#000' }}>
              Try the Planner <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right: Chat preview mockup */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden" style={{ background: '#111', border: '1px solid #242424' }}>
              {/* Chat header */}
              <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #1F1F1F' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(245,166,35,0.15)' }}>
                  <Sparkles size={16} style={{ color: '#F5A623' }} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">CyBlime AI Planner</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    Online
                  </div>
                </div>
              </div>

              {/* Chat body */}
              <div className="p-5 flex flex-col gap-3 min-h-[180px]">
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={{ background: '#1A1A1A', color: '#E5E5E5', border: '1px solid #2A2A2A' }}>
                    What's your starting point and how long do you have to ride? 🚴
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm font-semibold"
                    style={{ background: '#F5A623', color: '#000' }}>
                    Starting from Williamsburg, got 90 minutes, intermediate level
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(245,166,35,0.15)' }}>
                      <Sparkles size={12} style={{ color: '#F5A623' }} />
                    </div>
                    <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                      style={{ background: '#1A1A1A', color: '#E5E5E5', border: '1px solid #2A2A2A' }}>
                      Perfect! Here's a great ~25-mile loop: Williamsburg → Greenpoint → Navy Yard → Brooklyn Bridge → DUMBO → back via the waterfront. About 1.5 hrs at your pace 🔥
                    </div>
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="px-5 py-4 flex items-center gap-3"
                style={{ borderTop: '1px solid #1F1F1F', background: '#0D0D0D' }}>
                <MessageSquare size={16} style={{ color: '#444' }} />
                <span className="text-gray-600 text-sm flex-1">Ask about your next ride...</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: '#F5A623' }}>
                  <ArrowRight size={14} style={{ color: '#000' }} />
                </div>
              </div>
            </div>

            {/* Example prompts */}
            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <span key={ex} className="text-xs px-3 py-1.5 rounded-full"
                  style={{ background: '#141414', border: '1px solid #242424', color: '#666' }}>
                  "{ex}"
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
