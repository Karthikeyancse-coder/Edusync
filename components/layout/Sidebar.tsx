'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Users, BookOpen, Bell, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/providers/AuthProvider'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/directory', label: 'Directory', icon: BookOpen },
  { href: '/announcements', label: 'Announcements', icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface border-r border-default z-40">
      <div className="p-6">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {NAV_LINKS.map((link) => {
          const isActive = pathname.startsWith(link.href)
          const Icon = link.icon
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative",
                isActive 
                  ? "bg-surface2 text-primary-color" 
                  : "text-muted hover:bg-surface2 hover:text-primary-color"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--primary)] rounded-r-full" />
              )}
              <Icon size={20} className={isActive ? "text-[var(--primary)]" : ""} />
              {link.label}
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
          <button 
            onClick={() => signOut()}
            className="p-2 text-muted hover:text-[var(--error)] transition-colors"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}
