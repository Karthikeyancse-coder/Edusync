'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, MessageSquare, Bell, BookOpen, FileText, X, ArrowRight, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

// Mock search data
const ALL_USERS = [
  { id: 'u1', type: 'user', name: 'Dr. Sarah Jenkins', subtitle: 'Faculty — Mathematics', href: '/directory', role: 'faculty' as const },
  { id: 'u2', type: 'user', name: 'Aarav Shah', subtitle: 'Student — CSE, 3rd Year', href: '/directory', role: 'student' as const },
  { id: 'u3', type: 'user', name: 'Prof. Alan Turing', subtitle: 'HOD — Computer Science', href: '/directory', role: 'hod' as const },
  { id: 'u4', type: 'user', name: 'Admin Principal', subtitle: 'Principal — Administration', href: '/directory', role: 'principal' as const },
  { id: 'u5', type: 'user', name: 'Priya Patel', subtitle: 'Student — ECE, 2nd Year', href: '/directory', role: 'student' as const },
]

const ALL_GROUPS = [
  { id: 'g1', type: 'group', name: 'Computer Science 101', subtitle: '340 members', href: '/groups' },
  { id: 'g2', type: 'group', name: 'Advanced Mathematics', subtitle: '124 members', href: '/groups' },
  { id: 'g3', type: 'group', name: 'Physics Department', subtitle: '45 members', href: '/groups' },
  { id: 'g4', type: 'group', name: 'Student Council', subtitle: '12 members', href: '/groups' },
]

const ALL_ANNOUNCEMENTS = [
  { id: 'a1', type: 'announcement', name: 'Urgent: Campus Closure Due to Weather', subtitle: 'Admin Principal · Today', href: '/announcements' },
  { id: 'a2', type: 'announcement', name: 'Fall Semester Registration Opening Soon', subtitle: 'Registrar Office · Yesterday', href: '/announcements' },
  { id: 'a3', type: 'announcement', name: 'Annual Science Fair – Call for Participants', subtitle: 'Dr. Marie Curie · Oct 12', href: '/announcements' },
]

const ALL_SUBJECTS = [
  { id: 's1', type: 'subject', name: 'Data Structures', subtitle: 'Timetable: Mon & Wed 9 AM', href: '/timetable' },
  { id: 's2', type: 'subject', name: 'Algorithms', subtitle: 'Timetable: Tue & Thu 11 AM', href: '/timetable' },
  { id: 's3', type: 'subject', name: 'Operating Systems', subtitle: 'Timetable: Fri 2 PM', href: '/timetable' },
]

const ALL_ITEMS = [...ALL_USERS, ...ALL_GROUPS, ...ALL_ANNOUNCEMENTS, ...ALL_SUBJECTS]

const RECENT_SEARCHES = ['Dr. Sarah Jenkins', 'CS101 Assignment', 'Attendance Report', 'Timetable']

const TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  user: { icon: Users, label: 'People', color: 'text-indigo-600' },
  group: { icon: MessageSquare, label: 'Groups', color: 'text-emerald-600' },
  announcement: { icon: Bell, label: 'Announcements', color: 'text-amber-600' },
  subject: { icon: BookOpen, label: 'Subjects', color: 'text-blue-600' },
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<typeof ALL_ITEMS>([])
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timer = setTimeout(() => {
      const q = query.toLowerCase()
      const filtered = ALL_ITEMS.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
      )
      setResults(filtered)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const filteredResults = activeFilter === 'all'
    ? results
    : results.filter(r => r.type === activeFilter)

  const groupedResults = activeFilter === 'all'
    ? (['user', 'group', 'announcement', 'subject'] as const).reduce((acc, type) => {
        const items = results.filter(r => r.type === type)
        if (items.length) acc[type] = items
        return acc
      }, {} as Record<string, typeof ALL_ITEMS>)
    : { [activeFilter]: filteredResults }

  const hasResults = results.length > 0
  const hasFilteredResults = filteredResults.length > 0

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Search</h1>
        <p className="text-sm text-slate-500">Find people, groups, announcements, and more.</p>
      </motion.div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative mb-6"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search people, groups, announcements..."
          className="w-full pl-12 pr-12 py-4 text-base rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </motion.div>

      {/* Filter Pills (shown only when query exists) */}
      <AnimatePresence>
        {hasResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 mb-6 flex-wrap"
          >
            <button
              onClick={() => setActiveFilter('all')}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              All ({results.length})
            </button>
            {(['user', 'group', 'announcement', 'subject'] as const).map(type => {
              const count = results.filter(r => r.type === type).length
              if (!count) return null
              const conf = TYPE_CONFIG[type]
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                    activeFilter === type
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  {conf.label} ({count})
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state / Recent Searches */}
      {!query && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock size={14} /> Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {RECENT_SEARCHES.map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Browse</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(TYPE_CONFIG).map(([type, conf]) => (
                <Link
                  key={type}
                  href={type === 'user' ? '/directory' : type === 'group' ? '/groups' : type === 'announcement' ? '/announcements' : '/timetable'}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors", conf.color)}>
                    <conf.icon size={20} />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{conf.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      <AnimatePresence>
        {query && !isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {!hasFilteredResults ? (
              <div className="py-16 text-center text-slate-500 dark:text-slate-400">
                <Search size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-medium">No results for &ldquo;{query}&rdquo;</p>
                <p className="text-sm mt-1">Try a different search term.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedResults).map(([type, items]) => {
                  const conf = TYPE_CONFIG[type]
                  return (
                    <div key={type}>
                      {activeFilter === 'all' && (
                        <h3 className={cn("text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2", conf.color)}>
                          <conf.icon size={14} /> {conf.label}
                        </h3>
                      )}
                      <Card>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                          {items.map(item => (
                            <Link
                              key={item.id}
                              href={item.href}
                              className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                            >
                              {item.type === 'user' ? (
                                <Avatar name={item.name} role={(item as any).role} size="md" />
                              ) : (
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800", conf.color)}>
                                  <conf.icon size={18} />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.subtitle}</p>
                              </div>
                              <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
