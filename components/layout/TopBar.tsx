'use client'

import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { NotificationBell } from '@/components/ui/NotificationBell'

export function TopBar() {
  return (
    <div className="absolute top-3 right-4 z-40 flex items-center gap-2 md:top-4 md:right-6">
      <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <ThemeToggle />
      </div>
      <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <NotificationBell />
      </div>
    </div>
  )
}
