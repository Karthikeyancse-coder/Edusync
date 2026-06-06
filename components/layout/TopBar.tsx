'use client'

import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { NotificationBell } from '@/components/ui/NotificationBell'

export function TopBar() {
  return (
    <div className="absolute top-3 right-4 z-40 flex items-center gap-1 md:top-4 md:right-6">
      <ThemeToggle />
      <NotificationBell />
    </div>
  )
}
