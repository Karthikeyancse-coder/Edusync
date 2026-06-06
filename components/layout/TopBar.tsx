'use client'

import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { NotificationBell } from '@/components/ui/NotificationBell'
import { Logo } from '@/components/ui/Logo'

export function TopBar() {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between md:justify-end">
      {/* Show Logo only on mobile */}
      <div className="md:hidden">
        <Logo size="sm" />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell />
      </div>
    </header>
  )
}
