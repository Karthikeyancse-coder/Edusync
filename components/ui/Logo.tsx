import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'lg'
  className?: string
}

export function Logo({ size = 'sm', className }: LogoProps) {
  const isLg = size === 'lg'
  const svgSize = isLg ? 48 : 28
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg width={svgSize} height={svgSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--primary, #7C6FFF)" />
            <stop offset="1" stopColor="var(--secondary, #00D4AA)" />
          </linearGradient>
        </defs>
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" stroke="url(#logo-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 3v5h-5" stroke="url(#logo-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12h6" stroke="url(#logo-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 16h3" stroke="url(#logo-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 8h4" stroke="url(#logo-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className={cn("font-bold tracking-tight", isLg ? "text-2xl" : "text-base")}>
        <span style={{ color: 'var(--primary)' }}>Edu</span>
        <span style={{ color: 'var(--secondary)' }}>Sync</span>
      </span>
    </div>
  )
}
