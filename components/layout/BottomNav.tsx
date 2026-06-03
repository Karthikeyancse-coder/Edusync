'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Users, BookOpen, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/messages', label: 'Chat', icon: MessageSquare },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/directory', label: 'Directory', icon: BookOpen },
  { href: '/announcements', label: 'Alerts', icon: Bell },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-default z-40 px-2 pb-safe">
      <div className="flex items-center justify-around h-full">
        {NAV_LINKS.map((link) => {
          const isActive = pathname.startsWith(link.href)
          const Icon = link.icon
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-[var(--primary)]" : "text-muted hover:text-primary-color"
              )}
            >
              <Icon size={20} className={isActive ? "fill-[var(--primary)]/20" : ""} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
