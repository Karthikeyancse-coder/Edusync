'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'
import { getNavItems } from '@/lib/nav'
import { Card, CardContent } from '@/components/ui/Card'
import { ChevronRight } from 'lucide-react'

export default function MenuPage() {
  const { role } = useAuth()
  const navItems = getNavItems(role)

  // Filter out the items that are already in the BottomNav
  const bottomNavHrefs = ['/dashboard', '/messages', '/groups', '/profile']
  const balanceMenus = navItems.filter(item => !bottomNavHrefs.includes(item.href))

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] overflow-y-auto p-4 pb-20 bg-[#f8f9fc] dark:bg-slate-950 md:hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Menu</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explore all modules and features</p>
      </motion.div>

      <div className="space-y-3">
        {balanceMenus.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={item.href}>
                <Card className="hover:shadow-md transition-shadow active:scale-[0.98] border-none shadow-sm group bg-white dark:bg-slate-900">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 font-semibold text-slate-900 dark:text-white">
                      {item.label}
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge > 99 ? '99+' : item.badge}
                      </div>
                    )}
                    <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
