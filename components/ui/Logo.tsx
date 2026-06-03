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
            <stop stopColor="#7C6FFF" />
            <stop offset="1" stopColor="#00D4AA" />
          </linearGradient>
        </defs>
        <path d="M4 4V20M4 18H10M4 12H15M4 6H20" stroke="url(#logo-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className={cn("font-bold tracking-tight", isLg ? "text-2xl" : "text-base")}>
        <span style={{ color: 'var(--primary)' }}>Edu</span>
        <span style={{ color: 'var(--secondary)' }}>Sync</span>
      </span>
    </div>
  )
}
