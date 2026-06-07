'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, MessageSquare, Users, UserCircle, Menu } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  const mobileNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: Users, label: 'Groups', href: '/groups' },
    { icon: Menu, label: 'Others', href: '/menu' },
    { icon: UserCircle, label: 'Profile', href: '/profile' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 pb-safe">
      <div className="flex items-center justify-around h-full px-2">
        {mobileNavItems.map((link) => {
          const isActive = pathname.startsWith(link.href)
          const Icon = link.icon
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Icon size={22} className={isActive ? "fill-indigo-600/20 dark:fill-indigo-400/20" : ""} />
              <span className="text-[10px] font-medium whitespace-nowrap">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
