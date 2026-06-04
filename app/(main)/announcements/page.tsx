'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Bell, Calendar, Pin, AlertCircle, FileText, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

const announcements = [
  {
    id: 1,
    title: 'Urgent: Campus Closure Due to Weather',
    author: 'Admin Principal',
    role: 'principal',
    date: 'Today, 8:00 AM',
    content: 'Due to severe weather conditions, the campus will be closed for all non-essential personnel today. All classes will be moved online. Please check your course pages for specific instructions from your professors.',
    type: 'urgent',
    pinned: true,
  },
  {
    id: 2,
    title: 'Fall Semester Registration Opening Soon',
    author: 'Registrar Office',
    role: 'hod',
    date: 'Yesterday, 2:30 PM',
    content: 'Registration for the upcoming Fall semester will open next Monday at 8:00 AM. Please ensure you have met with your academic advisor and cleared any holds on your account before attempting to register.',
    type: 'academic',
    pinned: false,
  },
  {
    id: 3,
    title: 'Annual Science Fair - Call for Participants',
    author: 'Dr. Marie Curie',
    role: 'hod',
    date: 'Oct 12, 10:15 AM',
    content: 'The Physics and Chemistry departments are proud to announce the Annual Science Fair. We are currently looking for student volunteers and project submissions. The deadline for registration is the end of this month.',
    type: 'event',
    pinned: false,
  },
  {
    id: 4,
    title: 'New Library Hours for Finals Week',
    author: 'Library Services',
    role: 'faculty',
    date: 'Oct 10, 9:00 AM',
    content: 'To support students during finals week, the main library will be open 24/7 starting next Sunday. Coffee and snacks will be provided in the lobby during late night hours (10 PM - 2 AM).',
    type: 'info',
    pinned: false,
  }
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export default function Announcements() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Announcements</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Stay updated with the latest news and important notices.
          </p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
          <Bell size={18} />
          Post Announcement
        </Button>
      </motion.div>

      {/* Announcements Timeline */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 relative"
      >
        {/* Vertical Line for timeline effect (Desktop) */}
        <div className="hidden md:block absolute left-8 top-8 bottom-8 w-px bg-slate-200 dark:bg-slate-800" />

        {announcements.map((announcement) => {
          const isUrgent = announcement.type === 'urgent'
          const Icon = isUrgent ? AlertCircle : announcement.type === 'event' ? Calendar : FileText
          
          return (
            <motion.div key={announcement.id} variants={itemVariants} className="relative md:pl-24">
              {/* Timeline dot */}
              <div className={`hidden md:flex absolute left-5 top-8 w-6 h-6 rounded-full border-4 border-slate-50 dark:border-slate-900 items-center justify-center z-10 ${
                isUrgent ? 'bg-red-500' : announcement.pinned ? 'bg-amber-500' : 'bg-indigo-500'
              }`}>
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>

              <Card className={`group relative overflow-hidden bg-white/50 dark:bg-surface/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md ${
                isUrgent ? 'border-red-200 dark:border-red-900/50' : 'border-slate-200/60 dark:border-slate-800/60'
              }`}>
                {/* Urgent Top Bar */}
                {isUrgent && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500" />
                )}

                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <Avatar name={announcement.author} role={announcement.role as any} size="md" />
                      
                      {/* Content */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {announcement.author}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            • {announcement.date}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          {announcement.pinned && (
                            <Pin size={14} className="text-amber-500 fill-amber-500 shrink-0" />
                          )}
                          <h2 className={`text-lg font-bold leading-tight ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                            {announcement.title}
                          </h2>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                          {announcement.content}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center sm:flex-col gap-2 shrink-0">
                      <Button variant="ghost" className="w-full sm:w-auto justify-start sm:justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                        Read More
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
