'use client'

import React from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { Bell, Calendar, Pin, AlertCircle, FileText, ChevronRight, File as FileIcon, Paperclip, Mic, Send, Edit2, Copy, Trash2, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { X } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useAnnouncements } from '@/hooks/useAnnouncements'
import { getAcknowledgmentList } from '@/lib/announcements'
import Link from 'next/link'

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

function AcknowledgeButton({ 
  onAcknowledge, 
  hasAcknowledged 
}: { 
  onAcknowledge: () => Promise<void>, 
  hasAcknowledged: boolean 
}) {
  const [progress, setProgress] = React.useState(0)
  const [isDone, setIsDone] = React.useState(hasAcknowledged)
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (isDone || hasAcknowledged) return
    let start = Date.now()
    const duration = 3000
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const p = Math.min((elapsed / duration) * 100, 100)
      setProgress(p)
      if (p >= 100) {
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [isDone, hasAcknowledged])

  if (hasAcknowledged || isDone) {
    return (
      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
        <CheckCircle size={16} />
        Acknowledged
      </div>
    )
  }

  const handleAck = async () => {
    if (progress < 100) return
    setIsLoading(true)
    setError('')
    try {
      await onAcknowledge()
      setIsDone(true)
    } catch (err: any) {
      setError(err.message || 'Error acknowledging')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1 items-end sm:items-start">
      <Button 
        onClick={handleAck} 
        disabled={progress < 100 || isLoading}
        variant="outline"
        className="relative overflow-hidden group w-full sm:w-auto border-slate-200 dark:border-slate-700"
      >
        <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }} />
        <span className="relative z-10 flex items-center gap-2">
          {progress < 100 ? <Clock size={16} className="text-slate-400 animate-pulse" /> : <CheckCircle size={16} className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />}
          {progress < 100 ? 'Reading...' : isLoading ? 'Acknowledging...' : 'Acknowledge'}
        </span>
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

export default function Announcements() {
  const { user, role, department } = useAuth()
  const canPost = role === 'principal' || role === 'hod' || role === 'faculty'
  
  const { announcements, create, update, remove, view, acknowledge } = useAnnouncements(user?.id, role as any, department)
  
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [contextMenu, setContextMenu] = React.useState<{ id: string, x: number, y: number, announcement: any } | null>(null)
  const [postError, setPostError] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Acknowledgment List Modal state
  const [ackModalId, setAckModalId] = React.useState<string | null>(null)
  const [ackList, setAckList] = React.useState<any[]>([])
  const [loadingAcks, setLoadingAcks] = React.useState(false)

  // Dialog state for custom alerts/confirms
  const [dialog, setDialog] = React.useState<{
    isOpen: boolean,
    title: string,
    message: string,
    type: 'alert' | 'confirm',
    onConfirm?: () => void
  }>({ isOpen: false, title: '', message: '', type: 'alert' })

  const showAlert = (title: string, message: string) => {
    setDialog({ isOpen: true, title, message, type: 'alert' })
  }

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setDialog({ isOpen: true, title, message, type: 'confirm', onConfirm })
  }

  // New announcement state
  const [newAnnouncement, setNewAnnouncement] = React.useState({
    title: '',
    content: '',
    type: 'info',
    pinned: false,
    target_role: 'All', // 'All', 'student', 'faculty', 'hod'
    target_department: 'All' // 'All', 'Computer Science', etc.
  })

  React.useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null)
    window.addEventListener('click', handleGlobalClick)
    return () => window.removeEventListener('click', handleGlobalClick)
  }, [])

  const handleContextMenu = (e: React.MouseEvent, announcement: any) => {
    e.preventDefault()
    // Only principal or creator can edit/delete
    if (role !== 'principal' && announcement.created_by !== user?.id) return

    setContextMenu({
      id: announcement.id,
      x: e.clientX,
      y: e.clientY,
      announcement
    })
  }

  const handlePost = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return
    setIsSubmitting(true)
    setPostError('')
    
    try {
      const payload = {
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        type: newAnnouncement.type as 'urgent' | 'event' | 'academic' | 'info',
        is_pinned: newAnnouncement.pinned,
        target_role: role === 'faculty' ? 'student' : (newAnnouncement.target_role === 'All' ? null : newAnnouncement.target_role),
        target_department: role === 'principal' ? (newAnnouncement.target_department === 'All' ? null : newAnnouncement.target_department) : department
      }

      if (editingId) {
        await update(editingId, payload)
      } else {
        await create(payload)
      }
      
      setIsPostModalOpen(false)
      setNewAnnouncement({ title: '', content: '', type: 'info', pinned: false, target_role: 'All', target_department: 'All' })
    } catch (err: any) {
      setPostError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        // Log view when expanding for the first time
        const ann = announcements.find(a => a.id === id)
        if (ann && !ann._hasViewed) {
          view(id)
        }
      }
      return next
    })
  }

  const fetchAcks = async (announcementId: string) => {
    setAckModalId(announcementId)
    setLoadingAcks(true)
    try {
      const data = await getAcknowledgmentList(announcementId)
      setAckList(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingAcks(false)
    }
  }

  const getTargetLabel = (announcement: any) => {
    if (!announcement.target_department && !announcement.target_role) return 'College-wide'
    if (!announcement.target_department && announcement.target_role) return `All ${announcement.target_role}s`
    if (announcement.target_department && !announcement.target_role) return announcement.target_department
    return `${announcement.target_department} - ${announcement.target_role}s`
  }

  return (
    <div className="p-6 md:p-8 min-h-[calc(100vh-theme(spacing.16))] md:min-h-screen relative overflow-hidden">
      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-[100] bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 min-w-[160px] overflow-hidden"
            style={{ 
              left: Math.min(contextMenu.x, typeof window !== 'undefined' ? window.innerWidth - 180 : contextMenu.x), 
              top: Math.min(contextMenu.y, typeof window !== 'undefined' ? window.innerHeight - 200 : contextMenu.y) 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center gap-2"
              onClick={() => {
                if (contextMenu.id.startsWith('fallback-')) {
                  showAlert('Action Denied', 'This is an offline sample announcement and cannot be edited.')
                  setContextMenu(null)
                  return
                }
                const a = contextMenu.announcement
                setNewAnnouncement({
                  title: a.title,
                  content: a.content,
                  type: a.type || 'info',
                  pinned: a.is_pinned || false,
                  target_role: a.target_role || 'All',
                  target_department: a.target_department || 'All'
                })
                setEditingId(a.id)
                setIsPostModalOpen(true)
                setContextMenu(null)
              }}
            >
              <Edit2 size={16} className="text-indigo-500" />
              Edit Announcement
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center gap-2"
              onClick={async () => {
                if (contextMenu.id.startsWith('fallback-')) {
                  showAlert('Action Denied', 'This is an offline sample announcement and cannot be modified.')
                  setContextMenu(null)
                  return
                }
                try {
                  await update(contextMenu.id, { is_pinned: !contextMenu.announcement.is_pinned })
                } catch (e: any) {
                  showAlert('Error', "Error updating pin status: " + e.message)
                }
                setContextMenu(null)
              }}
            >
              <Pin size={16} className="text-orange-500" />
              {contextMenu.announcement.is_pinned ? 'Unpin' : 'Pin to Top'}
            </button>
            <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
              onClick={() => {
                if (contextMenu.id.startsWith('fallback-')) {
                  showAlert('Action Denied', 'This is an offline sample announcement and cannot be deleted.')
                  setContextMenu(null)
                  return
                }
                
                showConfirm('Delete Announcement', 'Are you sure you want to delete this announcement? This action cannot be undone.', async () => {
                  try {
                    await remove(contextMenu.id)
                  } catch (e: any) {
                    showAlert('Error', "Error deleting: " + e.message)
                  }
                })
                
                setContextMenu(null)
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
        {canPost && (
          <Button onClick={() => { setEditingId(null); setIsPostModalOpen(true); }} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
            <Bell size={18} />
            Post Announcement
          </Button>
        )}
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
          const isExpanded = expandedIds.has(announcement.id)
          const authorName = announcement.author?.name || 'Unknown'
          
          return (
            <motion.div key={announcement.id} variants={itemVariants} className="relative md:pl-24">
              {/* Timeline dot */}
              <div className={`hidden md:flex absolute left-5 top-8 w-6 h-6 rounded-full border-4 border-slate-50 dark:border-slate-900 items-center justify-center z-10 ${
                isUrgent ? 'bg-red-500' : announcement.is_pinned ? 'bg-amber-500' : 'bg-indigo-500'
              }`}>
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>

              <Card 
                onContextMenu={canPost ? (e) => handleContextMenu(e, announcement) : undefined}
                className={`group relative overflow-hidden bg-white/50 dark:bg-surface/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md ${
                isUrgent ? 'border-red-200 dark:border-red-900/50' : 'border-slate-200/60 dark:border-slate-800/60'
              }`}>
                {/* Urgent Top Bar */}
                {isUrgent && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500" />
                )}

                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <Avatar name={authorName} role={announcement.author?.role as any || 'faculty'} size="md" />
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {authorName}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            • {new Date(announcement.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${!announcement.target_department && !announcement.target_role ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300' : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300'}`}>
                            {getTargetLabel(announcement)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          {announcement.is_pinned && (
                            <Pin size={14} className="text-amber-500 fill-amber-500 shrink-0" />
                          )}
                          <h2 className={`text-lg font-bold leading-tight ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                            {announcement.title}
                          </h2>
                        </div>

                        <p className={`text-slate-600 dark:text-slate-300 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {announcement.content}
                        </p>

                        {/* Expanded details (Acknowledgments) */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
                            >
                              <AcknowledgeButton 
                                onAcknowledge={() => acknowledge(announcement.id)} 
                                hasAcknowledged={announcement._hasAcknowledged || false} 
                              />

                              {/* Progress bar for creator / admins */}
                              {(role === 'principal' || role === 'hod' || announcement.created_by === user?.id) && (
                                <div 
                                  className="flex-1 w-full max-w-xs cursor-pointer group/progress"
                                  onClick={() => fetchAcks(announcement.id)}
                                >
                                  <div className="flex justify-between text-xs text-slate-500 mb-1 group-hover/progress:text-indigo-600 transition-colors">
                                    <span>Acknowledgments</span>
                                    <span>{announcement._acksCount || 0} / {announcement.total_targets || 0}</span>
                                  </div>
                                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-emerald-500 transition-all duration-500" 
                                      style={{ width: `${Math.min(((announcement._acksCount || 0) / Math.max(announcement.total_targets || 1, 1)) * 100, 100)}%` }} 
                                    />
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    </div>

                    {/* Expand Toggle Action */}
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
        {isPostModalOpen && canPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-md w-full relative my-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingId ? 'Edit Announcement' : 'Post Announcement'}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsPostModalOpen(false)} className="-mr-2 -mt-2">
                  <X size={20} />
                </Button>
              </div>
              
              <div className="space-y-4 mb-6">
                {postError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{postError}</span>
                  </div>
                )}
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

                {/* Target Department (Only for Principal) */}
                {role === 'principal' && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Target Department</label>
                    <select 
                      value={newAnnouncement.target_department} 
                      onChange={e => setNewAnnouncement(prev => ({ ...prev, target_department: e.target.value }))}
                      className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                    >
                      <option value="All">All Departments</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Physics">Physics</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>
                )}

                {/* Target Role */}
                {role !== 'faculty' && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Target Role</label>
                    <select 
                      value={newAnnouncement.target_role} 
                      onChange={e => setNewAnnouncement(prev => ({ ...prev, target_role: e.target.value }))}
                      className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                    >
                      <option value="All">All Roles</option>
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      {role === 'principal' && <option value="hod">HOD</option>}
                    </select>
                  </div>
                )}

                {/* Content Chat Input */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Content <span className="text-red-500">*</span></label>
                  <div className="flex items-end gap-2 w-full">
                    <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-4 pr-2 py-3 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all shadow-sm w-full">
                      <textarea
                        value={newAnnouncement.content}
                        onChange={e => {
                          setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))
                          e.target.style.height = 'auto'
                          e.target.style.height = `${e.target.scrollHeight}px`
                        }}
                        rows={4}
                        className="w-full bg-transparent text-[15px] focus-visible:outline-none resize-none dark:text-white"
                        placeholder="Type announcement details..."
                        style={{ minHeight: '80px', maxHeight: '240px' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <input 
                    type="checkbox" 
                    id="pinned"
                    checked={newAnnouncement.pinned}
                    onChange={e => setNewAnnouncement(prev => ({ ...prev, pinned: e.target.checked }))}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <label htmlFor="pinned" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Pin to top of timeline</label>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={handlePost} disabled={!newAnnouncement.title || !newAnnouncement.content || isSubmitting} className="bg-indigo-600 text-white w-full sm:w-auto">
                    {isSubmitting ? 'Posting...' : editingId ? 'Update Announcement' : 'Post Announcement'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Acknowledgment List Modal */}
      <AnimatePresence>
        {ackModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm w-full relative max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Acknowledged By</h3>
                <Button variant="ghost" size="icon" onClick={() => setAckModalId(null)} className="-mr-2">
                  <X size={20} />
                </Button>
              </div>
              <div className="overflow-y-auto flex-1 pr-2 space-y-3">
                {loadingAcks ? (
                  <p className="text-slate-500 text-center py-4">Loading...</p>
                ) : ackList.length === 0 ? (
                  <p className="text-slate-500 text-center py-4 text-sm">No acknowledgments yet.</p>
                ) : (
                  ackList.map((ack, idx) => (
                    <Link key={idx} href={`/profile/${ack.user.unique_id}`} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors">
                      <Avatar name={ack.user.name} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{ack.user.name}</p>
                        <p className="text-xs text-slate-500">{new Date(ack.acknowledged_at).toLocaleString()}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Dialog Modal */}
      <AnimatePresence>
        {dialog.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full relative"
            >
              <div className="flex items-center gap-3 mb-3 text-slate-900 dark:text-white">
                <AlertCircle className={dialog.type === 'alert' && dialog.title === 'Error' ? 'text-red-500' : 'text-indigo-500'} size={24} />
                <h3 className="text-lg font-bold">{dialog.title}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                {dialog.message}
              </p>
              <div className="flex items-center justify-end gap-3">
                {dialog.type === 'confirm' && (
                  <Button variant="ghost" onClick={() => setDialog(prev => ({ ...prev, isOpen: false }))}>
                    Cancel
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    if (dialog.type === 'confirm' && dialog.onConfirm) {
                      dialog.onConfirm()
                    }
                    setDialog(prev => ({ ...prev, isOpen: false }))
                  }}
                  className={dialog.type === 'confirm' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
                >
                  {dialog.type === 'confirm' ? 'Delete' : 'OK'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
