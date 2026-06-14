'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { TopBar } from '@/components/layout/TopBar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ''
  
  const getBgColor = () => {
    if (pathname.includes('/dashboard')) return 'bg-indigo-50 dark:bg-slate-900'
    if (pathname.includes('/attendance')) return 'bg-amber-100 dark:bg-slate-900'
    if (pathname.includes('/marks')) return 'bg-cyan-100 dark:bg-slate-900'
    if (pathname.includes('/timetable')) return 'bg-violet-100 dark:bg-slate-900'
    if (pathname.includes('/announcements')) return 'bg-yellow-100 dark:bg-slate-900'
    if (pathname.includes('/profile')) return 'bg-rose-100 dark:bg-slate-900'
    if (pathname.includes('/admin')) return 'bg-slate-200 dark:bg-slate-900'
    if (pathname.includes('/search')) return 'bg-fuchsia-100 dark:bg-slate-900'
    if (pathname.includes('/approvals')) return 'bg-teal-100 dark:bg-slate-900'
    if (pathname.includes('/assignments')) return 'bg-lime-100 dark:bg-slate-900'
    
    // Default fallback
    return 'bg-[var(--bg-primary)]'
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${getBgColor()}`}>
      <Sidebar />
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0 md:ml-64">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
