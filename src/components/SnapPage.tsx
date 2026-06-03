'use client'
import { ReactNode } from 'react'

export default function SnapPage({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
      }}
    >
      {children}
    </div>
  )
}

export function SnapSection({
  children,
  id,
  bg = '#0A0A0A',
  className = '',
}: {
  children: ReactNode
  id?: string
  bg?: string
  className?: string
}) {
  return (
    <section
      id={id}
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        height: '100dvh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        background: bg,
      }}
    >
      {children}
    </section>
  )
}
