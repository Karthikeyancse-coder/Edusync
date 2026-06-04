'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Users, MoreHorizontal, UserPlus, BookOpen } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

const groups = [
  { id: 1, name: 'Advanced Mathematics', instructor: 'Dr. Sarah Jenkins', members: 124, type: 'Course', color: 'bg-indigo-500' },
  { id: 2, name: 'Computer Science 101', instructor: 'Prof. Alan Turing', members: 340, type: 'Course', color: 'bg-emerald-500' },
  { id: 3, name: 'Physics Department', instructor: 'Dr. Marie Curie', members: 45, type: 'Department', color: 'bg-violet-500' },
  { id: 4, name: 'Student Council', instructor: 'Admin Principal', members: 12, type: 'Club', color: 'bg-amber-500' },
  { id: 5, name: 'Literature 204', instructor: 'Dr. Jane Austen', members: 86, type: 'Course', color: 'bg-rose-500' },
  { id: 6, name: 'Faculty Lounge', instructor: 'Admin Principal', members: 184, type: 'Private', color: 'bg-blue-500' },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export default function Groups() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Groups & Classes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your courses, departments, and study groups.
          </p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
          <UserPlus size={18} />
          Create Group
        </Button>
      </motion.div>

      {/* Groups Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {groups.map((group) => (
          <motion.div key={group.id} variants={itemVariants}>
            <Card className="group h-full flex flex-col bg-white/50 dark:bg-surface/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className={`h-24 ${group.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <BookOpen className="absolute -bottom-6 -right-6 text-white/20 w-32 h-32 transform group-hover:scale-110 transition-transform duration-500" />
              </div>
              <CardContent className="pt-6 flex-1 relative">
                <div className="absolute -top-10 left-6">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-sm">
                    <div className={`w-full h-full rounded-xl ${group.color} flex items-center justify-center text-white font-bold text-xl`}>
                      {group.name.charAt(0)}
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <MoreHorizontal size={20} />
                </Button>

                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                      {group.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {group.instructor}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <Users size={16} />
                  {group.members} members
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900" />
                  ))}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
