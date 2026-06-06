import React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { TopBar } from '@/components/layout/TopBar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] transition-colors duration-300">
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
