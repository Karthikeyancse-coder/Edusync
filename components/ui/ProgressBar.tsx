import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0 to 100
  color?: string
  height?: string
  className?: string
}

export function ProgressBar({ value, color = 'bg-indigo-500', height = 'h-2', className }: ProgressBarProps) {
  return (
    <div className={cn(`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden`, height, className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn("h-full rounded-full", color)}
      />
    </div>
  )
}
