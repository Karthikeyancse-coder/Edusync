'use client'

import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Search, Filter, Mail, Phone, MoreHorizontal } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

const users = [
  { id: 1, name: 'Emma Thompson', role: 'student', department: 'Computer Science', email: 'emma.t@edusync.edu', status: 'online' },
  { id: 2, name: 'Dr. Sarah Jenkins', role: 'faculty', department: 'Mathematics', email: 's.jenkins@edusync.edu', status: 'offline' },
  { id: 3, name: 'Admin Principal', role: 'principal', department: 'Administration', email: 'principal@edusync.edu', status: 'online' },
  { id: 4, name: 'Prof. Alan Turing', role: 'hod', department: 'Computer Science', email: 'a.turing@edusync.edu', status: 'offline' },
  { id: 5, name: 'Michael Chen', role: 'student', department: 'Physics', email: 'm.chen@edusync.edu', status: 'online' },
  { id: 6, name: 'Sarah Connor', role: 'student', department: 'Engineering', email: 's.connor@edusync.edu', status: 'offline' },
  { id: 7, name: 'Dr. Marie Curie', role: 'hod', department: 'Physics', email: 'm.curie@edusync.edu', status: 'online' },
  { id: 8, name: 'John Doe', role: 'student', department: 'Mathematics', email: 'j.doe@edusync.edu', status: 'offline' },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export default function Directory() {
  const [filter, setFilter] = useState('all')

  const filteredUsers = users.filter(u => filter === 'all' || u.role === filter)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Campus Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Find and connect with students, faculty, and staff.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Search name or email..." className="pl-10 bg-white dark:bg-surface border-slate-200 dark:border-slate-800" />
          </div>
          <Button variant="outline" className="gap-2 shrink-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-surface">
            <Filter size={18} />
            Filters
          </Button>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {['all', 'student', 'faculty', 'hod', 'principal'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${
              filter === tab 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white dark:bg-surface text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Directory Grid */}
      <Card className="bg-white/50 dark:bg-surface/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-slate-100 dark:divide-slate-800/60"
            >
              {filteredUsers.map((user) => (
                <motion.tr 
                  key={user.id} 
                  variants={itemVariants}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar name={user.name} role={user.role as any} size="sm" showRoleBadge />
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-surface ${
                          user.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {user.name}
                        </div>
                        <div className="text-xs text-slate-500 sm:hidden mt-0.5">{user.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                      user.role === 'principal' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' :
                      user.role === 'hod' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                      user.role === 'faculty' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                      'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {user.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Mail size={14} />
                      <span className="truncate max-w-[200px]">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        <Phone size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        <Mail size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
