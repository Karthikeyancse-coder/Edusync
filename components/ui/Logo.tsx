import React from 'react'
import { cn } from '@/lib/utils'
import { GraduationCap } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'lg'
  className?: string
  forceDarkText?: boolean
}

export function Logo({ size = 'sm', className, forceDarkText = false }: LogoProps) {
  const isLg = size === 'lg'
  
  const boxSizeClass = isLg ? "w-12 h-12 rounded-xl" : "w-8 h-8 rounded-lg"
  const iconSize = isLg ? 28 : 18

  return (
    <div className={cn("flex items-center gap-2 font-black select-none tracking-tight", isLg ? "text-3xl" : "text-xl", className)}>
      <div className={cn("bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0", boxSizeClass)}>
        <GraduationCap size={iconSize} className="text-white" />
      </div>
      <span className={forceDarkText ? "text-white" : "text-slate-900 dark:text-white"}>
        Edu<span className={forceDarkText ? "text-indigo-400" : "text-indigo-600 dark:text-indigo-400"}>Sync</span>
      </span>
    </div>
  )
}
