'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import { Avatar } from '@/components/ui/Avatar'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useAuth } from '@/providers/AuthProvider'
import { getNavItems } from '@/lib/nav'

export function Sidebar() {
  const pathname = usePathname()
  const { profile, role, signOut } = useAuth()
  
  const navItems = getNavItems(role)

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40">
      <div className="p-6">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto pt-4 pb-20">
        {navItems.map((link) => {
          const isActive = pathname.startsWith(link.href)
          const Icon = link.icon
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "text-white shadow-md" 
                  : "text-slate-600 hover:text-indigo-700 dark:text-slate-400 dark:hover:text-indigo-300"
              )}
            >
              {/* Active Background - Framer Motion */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0 bg-indigo-600 dark:bg-indigo-600 rounded-xl z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              {/* Hover Background */}
              {!isActive && (
                <div className="absolute inset-0 bg-indigo-200/0 group-hover:bg-indigo-200/50 dark:group-hover:bg-indigo-900/40 rounded-xl z-0 transition-colors duration-300" />
              )}

              {/* Active Left Border - Removed to prefer the solid block style */}

              <div className="relative z-10 flex items-center gap-3 transform group-hover:translate-x-1 transition-transform duration-300 w-full">
                <Icon 
                  size={20} 
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "scale-110 drop-shadow-sm" : "group-hover:scale-110"
                  )} 
                />
                <span className="relative">
                  {link.label}
                </span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-default">
        <div className="flex items-center gap-3 p-3 rounded-card bg-surface2">
          {profile && <Avatar name={profile.name} role={profile.role} size="md" showRoleBadge />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary-color truncate">
              {profile?.name || 'Loading...'}
            </p>
            <p className="text-xs text-muted truncate capitalize">
              {profile?.role || ''}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button 
              onClick={() => signOut()}
              className="p-2 text-slate-500 hover:text-[var(--error)] transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
