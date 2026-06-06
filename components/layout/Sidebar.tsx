'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/providers/AuthProvider'
import { getNavItems } from '@/lib/nav'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, role, signOut } = useAuth()
  
  const navItems = getNavItems(role)

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <Logo size="sm" />
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
          const Icon = link.icon
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                isActive 
                  ? "text-white bg-indigo-600 shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <Icon 
                size={18} 
                className={cn(
                  "shrink-0 transition-all duration-200",
                  isActive ? "drop-shadow-sm" : "group-hover:scale-110"
                )} 
              />
              <span className="flex-1 truncate">{link.label}</span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                  isActive 
                    ? "bg-white/30 text-white" 
                    : "bg-indigo-600 text-white"
                )}>
                  {link.badge > 99 ? '99+' : link.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Profile Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          {/* Clicking avatar/name goes to profile */}
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-3 flex-1 min-w-0 text-left"
          >
            {profile && (
              <Avatar name={profile.name} role={profile.role} size="md" showRoleBadge />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {profile?.name || 'Loading...'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">
                {profile?.role || ''} · {profile?.unique_id || ''}
              </p>
            </div>
          </button>
          <div className="flex items-center shrink-0">
            <button 
              onClick={() => signOut()}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
