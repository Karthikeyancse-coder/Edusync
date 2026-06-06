'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import { getNavItems } from '@/lib/nav'

export function BottomNav() {
  const pathname = usePathname()
  const { role } = useAuth()
  const navItems = getNavItems(role)

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 pb-safe">
      <div className="flex items-center h-full overflow-x-auto hide-scrollbar px-2 snap-x">
        {navItems.map((link) => {
          const isActive = pathname.startsWith(link.href)
          const Icon = link.icon
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[64px] h-full gap-1 transition-colors snap-center",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Icon size={20} className={isActive ? "fill-indigo-600/20 dark:fill-indigo-400/20" : ""} />
              <span className="text-[10px] font-medium whitespace-nowrap">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
