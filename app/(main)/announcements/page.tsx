'use client'

import React from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { Bell, Calendar, Pin, AlertCircle, FileText, ChevronRight, UploadCloud, File as FileIcon, Paperclip, Image as ImageIcon, Mic } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

import { Input } from '@/components/ui/Input'
import { X } from 'lucide-react'

const initialAnnouncements = [
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
  const [announcementsData, setAnnouncementsData] = React.useState(initialAnnouncements)
  const [expandedIds, setExpandedIds] = React.useState<Set<number>>(new Set())
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false)
  const [newAnnouncement, setNewAnnouncement] = React.useState({
    title: '',
    content: '',
    type: 'info',
    pinned: false,
    file: null as any,
    audiences: ['All'] as string[]
  })
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handlePost = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return
    const nextId = Math.max(0, ...announcementsData.map(a => a.id)) + 1
    const announcement = {
      id: nextId,
      title: newAnnouncement.title,
      author: 'Admin Principal',
      role: 'principal',
      date: 'Just now',
      content: newAnnouncement.content,
      type: newAnnouncement.type,
      pinned: newAnnouncement.pinned,
    }
    setAnnouncementsData(prev => [announcement, ...prev])
    setIsPostModalOpen(false)
    setNewAnnouncement({ title: '', content: '', type: 'info', pinned: false, file: null, audiences: ['All'] })
  }

  const toggleAudience = (aud: string) => {
    setNewAnnouncement(prev => {
      let next = [...prev.audiences]
      if (aud === 'All') return { ...prev, audiences: ['All'] }
      next = next.filter(a => a !== 'All')
      if (next.includes(aud)) next = next.filter(a => a !== aud)
      else next.push(aud)
      if (next.length === 0) next = ['All']
      return { ...prev, audiences: next }
    })
  }

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="p-6 md:p-8 min-h-[calc(100vh-theme(spacing.16))] md:min-h-screen relative bg-red-300 dark:bg-slate-900 overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8 pb-24 relative z-10">
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
        <Button onClick={() => setIsPostModalOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
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

        {announcementsData.map((announcement) => {
          const isUrgent = announcement.type === 'urgent'
          const Icon = isUrgent ? AlertCircle : announcement.type === 'event' ? Calendar : FileText
          const isExpanded = expandedIds.has(announcement.id)
          
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

                        <p className={`text-slate-600 dark:text-slate-300 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {announcement.content}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center sm:flex-col gap-2 shrink-0">
                      <Button onClick={() => toggleExpand(announcement.id)} variant="ghost" className="w-full sm:w-auto justify-start sm:justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                        {isExpanded ? 'Show Less' : 'Read More'}
                        <ChevronRight size={16} className={`ml-1 transition-transform ${isExpanded ? '-rotate-90' : ''}`} />
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

      {/* Post Modal */}
      <AnimatePresence>
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-md w-full relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Post Announcement</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsPostModalOpen(false)} className="-mr-2 -mt-2">
                  <X size={20} />
                </Button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Title <span className="text-red-500">*</span></label>
                  <Input value={newAnnouncement.title} onChange={e => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))} placeholder="Enter title..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Type</label>
                  <select 
                    value={newAnnouncement.type} 
                    onChange={e => setNewAnnouncement(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <option value="info">Info</option>
                    <option value="academic">Academic</option>
                    <option value="event">Event</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                {/* Target Audience */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Target Audience</label>
                  <div className="flex flex-wrap gap-4">
                    {['All', 'Student', 'Faculty', 'HOD'].map(role => (
                      <label key={role} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={newAnnouncement.audiences.includes(role)}
                          onChange={() => toggleAudience(role)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Content Chat Input */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Content & Attachments <span className="text-red-500">*</span></label>
                  
                  {newAnnouncement.file && (
                    <div className="mb-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 flex items-center gap-3 shadow-sm max-w-full relative inline-flex">
                      <div className="w-10 h-10 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                        <FileIcon size={20} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                          {newAnnouncement.file.name}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Attached File</p>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setNewAnnouncement(prev => ({ ...prev, file: null })) }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm border border-slate-100 dark:border-slate-700"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-end gap-2 w-full">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewAnnouncement(prev => ({ ...prev, file: e.target.files![0] }))
                        }
                      }}
                      className="hidden" 
                    />
                    <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl pl-2 pr-4 py-2 flex items-end focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all shadow-sm w-full">
                      <div className="flex items-center pb-0.5 mr-1">
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon" 
                          onClick={() => fileInputRef.current?.click()}
                          className="shrink-0 text-slate-400 hover:text-indigo-600 rounded-full h-8 w-8"
                        >
                          <Paperclip size={18} />
                        </Button>
                      </div>
                      <textarea
                        value={newAnnouncement.content}
                        onChange={e => {
                          setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))
                          e.target.style.height = 'auto'
                          e.target.style.height = `${e.target.scrollHeight}px`
                        }}
                        rows={1}
                        className="w-full bg-transparent text-sm focus-visible:outline-none resize-none py-1.5 dark:text-white"
                        placeholder="Type announcement details..."
                        style={{ minHeight: '36px', maxHeight: '120px' }}
                      />
                      <div className="flex items-center gap-1 pb-0.5 pl-2 shrink-0">
                        <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-indigo-600 h-8 w-8 rounded-full">
                          <ImageIcon size={18} />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 h-8 w-8 rounded-full">
                          <Mic size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <input 
                    type="checkbox" 
                    id="pinned"
                    checked={newAnnouncement.pinned}
                    onChange={e => setNewAnnouncement(prev => ({ ...prev, pinned: e.target.checked }))}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="pinned" className="text-sm font-medium text-slate-700 dark:text-slate-300">Pin to top of timeline</label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsPostModalOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handlePost} 
                  disabled={!newAnnouncement.title || !newAnnouncement.content}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                >
                  Post
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
