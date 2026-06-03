'use client'
import { ReactNode } from 'react'

export default function SnapPage({ children }: { children: ReactNode }) {
  return (
    <div>
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
        minHeight: '100dvh',
        background: bg,
      }}
    >
      {children}
    </section>
  )
}
