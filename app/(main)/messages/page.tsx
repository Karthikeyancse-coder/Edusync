'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Send, Paperclip, MoreVertical, CheckCheck, Mic, X, ImageIcon, Reply, Forward, Trash2, ChevronDown, Edit2, Copy, User, BellOff, CheckSquare, XCircle, Pin, PinOff, MessageSquare, Archive, MinusCircle, ArrowLeft, Users, Calendar, BookOpen, Crown, Shield, GraduationCap, ChevronRight, Info } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

const initialContacts = [
  { id: 1, name: 'Dr. Sarah Jenkins', role: 'Professor', lastMessage: 'The syllabus has been updated.', time: '10:42 AM', unread: 2, avatar: 'SJ' },
  { id: 2, name: 'Computer Science 101', role: 'Group', lastMessage: 'Don\'t forget the assignment!', time: 'Yesterday', unread: 0, avatar: 'CS' },
  { id: 3, name: 'Michael Chen', role: 'Student', lastMessage: 'Thanks for the help!', time: 'Tuesday', unread: 0, avatar: 'MC' },
  { id: 4, name: 'Faculty Announcements', role: 'Group', lastMessage: 'Meeting at 3 PM in Room 4B.', time: 'Monday', unread: 5, avatar: 'FA' },
  { id: 5, name: 'Admin Principal', role: 'Principal', lastMessage: 'Tap to send a message (needs approval)', time: '', unread: 0, avatar: 'AP' },
]

const initialMessages = [
  { id: 1, senderId: 1, text: 'Hello! I wanted to remind you about the upcoming deadline for the final project.', time: '10:30 AM', isMe: false, image: null, isAudio: false },
  { id: 2, senderId: 'me', text: 'Hi Dr. Jenkins. Yes, I have already submitted it through the portal.', time: '10:35 AM', isMe: true, image: null, isAudio: false },
  { id: 3, senderId: 1, text: 'Excellent, I will review it this evening. The syllabus has been updated.', time: '10:42 AM', isMe: false, image: null, isAudio: false },
]

export default function Messages() {
  const [contacts, setContacts] = useState<any[]>(initialContacts)
  const [activeContact, setActiveContact] = useState<any | null>(null)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<'all' | 'individual' | 'group'>('all')
  const [chatMessages, setChatMessages] = useState<any[]>(initialMessages)
  
  const [attachments, setAttachments] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  
  const [contextMenu, setContextMenu] = useState<{ id: number, x: number, y: number, isMe: boolean, msg: any } | null>(null)
  const [contactContextMenu, setContactContextMenu] = useState<{ x: number, y: number, contact: any } | null>(null)
  const [pinnedMessage, setPinnedMessage] = useState<any | null>(null)
  const [replyingTo, setReplyingTo] = useState<any | null>(null)
  const [editingMessage, setEditingMessage] = useState<any | null>(null)
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [bubbles, setBubbles] = useState<any[]>([])
  const [archivedChatIds, setArchivedChatIds] = useState<number[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [pinnedChatIds, setPinnedChatIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  
  useEffect(() => {
    // Generate bubbles only on client side to prevent hydration mismatch
    const newBubbles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      xOffset: Math.random() * 100, // 0 to 100%
      size: Math.random() * 40 + 20, // 20 to 60px
      duration: Math.random() * 15 + 10, // 10 to 25s
      delay: Math.random() * 10,
      rotate: Math.random() * 90 - 45
    }))
    setBubbles(newBubbles)
  }, [])

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  useEffect(() => {
    const handleGlobalClick = () => {
      setContextMenu(null)
      setContactContextMenu(null)
    }
    window.addEventListener('click', handleGlobalClick)
    
    // Check for query parameters to open chat directly
    const params = new URLSearchParams(window.location.search)
    const userId = params.get('userId')
    const name = params.get('name')
    const isGroup = params.get('isGroup') === 'true'
    
    if (userId && name) {
      const existing = initialContacts.find(c => c.name === name)
      if (existing) {
        setActiveContact(existing)
      } else {
        const newContact = { 
          id: parseInt(userId) + 1000, 
          name, 
          role: isGroup ? 'Group' : 'Directory User', 
          lastMessage: '', 
          time: 'Just now', 
          unread: 0, 
          avatar: name.substring(0, 2).toUpperCase() 
        }
        setContacts(prev => {
          if (!prev.find(c => c.name === name)) {
            return [newContact, ...prev]
          }
          return prev
        })
        setActiveContact(newContact)
      }
      
      // Clean up the URL without triggering a page reload
      window.history.replaceState({}, '', '/messages')
    }

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => {
      window.removeEventListener('click', handleGlobalClick)
      clearTimeout(timer)
    }
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelect(e.dataTransfer.files)
    }
  }

  const handleFilesSelect = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 5 - attachments.length)
    if (validFiles.length === 0) return

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setAttachments(prev => [...prev, e.target!.result as string].slice(0, 5))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0 && !isRecording) return

    if (editingMessage) {
      setChatMessages(prev => prev.map(m => 
        m.id === editingMessage.id 
          ? { ...m, text: message, isEdited: true } 
          : m
      ))
      setEditingMessage(null)
      setMessage('')
      return
    }

    // Detect if sending to a principal or HOD — needs approval chain
    const recipientRole = activeContact?.role?.toLowerCase() || ''
    const needsApproval = recipientRole.includes('principal')
    const needsHodApproval = recipientRole.includes('principal') // student→principal needs faculty+hod

    const newMessage = {
      id: Date.now(),
      senderId: 'me',
      text: isRecording ? 'Audio Message' : message,
      image: null,
      images: attachments.length > 0 ? attachments : null,
      isAudio: isRecording,
      replyTo: replyingTo,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      // Approval chain tracking
      approvalStatus: needsApproval ? 'pending_faculty' : null,
      approvalSteps: needsApproval ? [
        { label: 'Faculty', status: 'pending' },
        { label: 'HOD', status: 'pending' },
        { label: 'Principal', status: 'pending' },
      ] : null,
    }

    setChatMessages([...chatMessages, newMessage])
    setMessage('')
    setAttachments([])
    setIsRecording(false)
    setReplyingTo(null)
  }

  const handleDeleteMessage = (id: number) => {
    setChatMessages(prev => prev.filter(m => m.id !== id))
    if (pinnedMessage?.id === id) setPinnedMessage(null)
    setContextMenu(null)
  }

  const handleArchiveChat = (id: number) => {
    if (archivedChatIds.includes(id)) {
      setArchivedChatIds(prev => prev.filter(aid => aid !== id)) // Unarchive
    } else {
      setArchivedChatIds(prev => [...prev, id]) // Archive
    }
    setContactContextMenu(null)
  }

  const handlePinContact = (id: number) => {
    if (pinnedChatIds.includes(id)) {
      setPinnedChatIds(prev => prev.filter(pid => pid !== id))
    } else {
      setPinnedChatIds(prev => [...prev, id])
    }
    setContactContextMenu(null)
  }

  const handleToggleUnreadContact = (id: number) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: c.unread > 0 ? 0 : 1 } : c))
    setContactContextMenu(null)
  }

  const handleClearChatContact = (id: number) => {
    if (activeContact?.id === id) setChatMessages([])
    setContacts(prev => prev.map(c => c.id === id ? { ...c, lastMessage: '' } : c))
    setContactContextMenu(null)
  }

  const handleDeleteContact = (id: number) => {
    setContacts(prev => prev.filter(c => c.id !== id))
    if (activeContact?.id === id) setActiveContact(null)
    setContactContextMenu(null)
  }

  const handleReplyMessage = (msg: any) => {
    setReplyingTo(msg)
    setContextMenu(null)
  }

  const handleForwardMessage = (msg: any) => {
    alert(`Forwarding message: "${msg.text || 'Attachment'}"`)
    setContextMenu(null)
  }

  const handleCopyMessage = (msg: any) => {
    navigator.clipboard.writeText(msg.text || '')
    setContextMenu(null)
  }

  const handleEditMessage = (msg: any) => {
    setEditingMessage(msg)
    setMessage(msg.text || '')
    setReplyingTo(null)
    setContextMenu(null)
  }

  const handlePinMessage = (msg: any) => {
    setPinnedMessage(msg)
    setContextMenu(null)
  }

  const handleClearChat = () => {
    setChatMessages([])
    setIsHeaderMenuOpen(false)
  }

  const handleCloseChat = () => {
    setActiveContact(null)
    setIsHeaderMenuOpen(false)
  }

  const handleMute = () => {
    alert(`Notifications muted for ${activeContact.name}`)
    setIsHeaderMenuOpen(false)
  }

  const handleContactInfo = () => {
    if (activeContact?.role === 'Group') {
      setShowGroupInfo(true)
    } else {
      alert(`Contact Info: ${activeContact.name}\nRole: ${activeContact.role}`)
    }
    setIsHeaderMenuOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const filteredContacts = contacts.filter(c => {
    const isArchived = archivedChatIds.includes(c.id)
    if (showArchived && !isArchived) return false
    if (!showArchived && isArchived) return false

    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false
    
    if (filterMode === 'group') return c.role === 'Group'
    if (filterMode === 'individual') return c.role !== 'Group'
    return true
  }).sort((a, b) => {
    const aPinned = pinnedChatIds.includes(a.id)
    const bPinned = pinnedChatIds.includes(b.id)
    if (aPinned && !bPinned) return -1
    if (!aPinned && bPinned) return 1
    return 0
  })

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] md:h-screen p-4 md:p-6 pb-4 md:pb-6 overflow-hidden relative">
      {/* Background for the entire page behind the cards */}
      <div className="absolute inset-0 bg-blue-300 dark:bg-slate-900 z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex gap-4 md:gap-6 max-w-7xl mx-auto relative z-10"
      >
        {/* Contacts Sidebar */}
        <Card className={`w-full md:w-80 lg:w-96 flex-col h-full relative bg-white/50 dark:bg-surface/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 ${activeContact ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {showArchived ? 'Archived Chats' : 'Messages'}
            </h2>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" size={18} />
              <Input 
                placeholder="Search messages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-900 border-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/30" 
              />
            </div>
            
            {/* Filter Toggle */}
            <div className="flex bg-slate-100/60 dark:bg-slate-800/60 p-1 rounded-xl mt-4 relative">
              {['all', 'individual', 'group'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setFilterMode(tab as any)}
                  className={`relative flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-colors z-10 ${filterMode === tab ? 'text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  {filterMode === tab && (
                    <motion.div
                      layoutId="filter-indicator"
                      className="absolute inset-0 bg-white dark:bg-slate-700 shadow-[0_1px_3px_rgba(0,0,0,0.1)] rounded-lg -z-10 border border-slate-200/50 dark:border-slate-600/50"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  {tab.charAt(0).toUpperCase() + tab.slice(1) + (tab === 'group' ? 's' : '')}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 overflow-x-hidden">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="w-full text-left p-3 rounded-2xl mb-1 flex items-center gap-3">
                    <Skeleton circle width="48px" height="48px" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between"><Skeleton width="100px" height="16px" /><Skeleton width="40px" height="12px" /></div>
                      <Skeleton width="150px" height="14px" />
                    </div>
                  </div>
                ))
              ) : filteredContacts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8 text-slate-500 dark:text-slate-400"
                >
                  <p className="text-sm">No chats found.</p>
                </motion.div>
              ) : (
                filteredContacts.map((contact) => (
                  <motion.button
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    key={contact.id}
                    onClick={() => setActiveContact(contact)}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      setContactContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        contact: contact
                      })
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${activeContact?.id === contact.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-lg">
                        {contact.avatar}
                      </div>
                      {contact.unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-surface flex items-center justify-center text-[10px] font-bold text-white">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate flex items-center gap-2">
                          {contact.name}
                          {pinnedChatIds.includes(contact.id) && <Pin size={12} className="text-slate-400" />}
                        </h3>
                        <span className="text-xs text-slate-500">{contact.time}</span>
                      </div>
                      <p className={`text-sm truncate mt-0.5 ${contact.unread > 0 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                        {contact.lastMessage || 'No recent messages'}
                      </p>
                    </div>
                  </motion.button>
                ))
              )}
            </AnimatePresence>
          </div>
          
          {/* Archived Chats Toggle FAB */}
          <button 
            onClick={() => setShowArchived(!showArchived)}
            className={`absolute bottom-6 right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 ${showArchived ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
            title={showArchived ? 'Back to inbox' : 'View archived chats'}
          >
            <Archive size={20} />
            {archivedChatIds.length > 0 && !showArchived && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                {archivedChatIds.length}
              </span>
            )}
          </button>
        </Card>

        {/* Active Chat Area */}
        <Card 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`${activeContact ? 'flex' : 'hidden'} md:flex flex-1 flex-col h-full bg-[#f8f9fc]/90 dark:bg-slate-900/90 backdrop-blur-xl border-none shadow-xl relative overflow-hidden rounded-2xl transition-colors duration-300 ${isDragging ? 'ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}
        >
          {activeContact ? (
            <>

          {/* Decorative Mesh Gradient Background */}
          <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-indigo-300/60 dark:bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-violet-300/60 dark:bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-[30%] left-[20%] w-[25rem] h-[25rem] bg-emerald-300/40 dark:bg-emerald-600/10 rounded-full blur-[80px] pointer-events-none" />
          
          {/* Chat Header */}
          <div className="relative z-20 shrink-0 p-4 md:p-6 flex items-center justify-between border-b border-indigo-100/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
            <div
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => { if (activeContact?.role === 'Group') setShowGroupInfo(true) }}
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveContact(null); }}
                  className="md:hidden p-2 -ml-2 mr-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {activeContact.avatar}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-[17px] flex items-center gap-1.5">
                    {activeContact.name}
                    {activeContact.role === 'Group' && <ChevronRight size={14} className="text-slate-400" />}
                  </h3>
                  <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-0.5">{activeContact.role}</p>
                </div>
              </div>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                className="text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 shadow-sm rounded-full w-10 h-10 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700 transition-colors focus:outline-none"
              >
                <MoreVertical size={20} />
              </Button>
              <AnimatePresence>
                {isHeaderMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
                  >
                    <button onClick={handleContactInfo} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <User size={16} /> Contact Info
                    </button>
                    <button onClick={() => { alert('Select messages mode'); setIsHeaderMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <CheckSquare size={16} /> Select messages
                    </button>
                    <button onClick={handleMute} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <BellOff size={16} /> Mute Notifications
                    </button>
                    <button onClick={handleCloseChat} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <XCircle size={16} /> Close chat
                    </button>
                    <div className="h-px w-full bg-slate-100 dark:bg-slate-700/50" />
                    <button onClick={handleClearChat} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={16} /> Clear Chat
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Approval Chain Info Banner */}
          {activeContact?.role?.toLowerCase() === 'principal' && (
            <div className="relative z-20 shrink-0 px-4 py-2.5 flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/50">
              <div className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-amber-500 flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 1v3M4 6h.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">2-Step Approval Required</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                  Your message needs approval from <strong>Faculty</strong> then <strong>HOD</strong> before reaching the Principal.
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {['You', 'Faculty', 'HOD', 'Principal'].map((step, i) => (
                    <div key={step} className="flex items-center gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        step === 'You' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' :
                        step === 'Principal' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' :
                        'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                      }`}>{step}</span>
                      {i < 3 && <span className="text-amber-400 text-xs font-bold">{'>'}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeContact?.role?.toLowerCase() === 'hod' && (
            <div className="relative z-20 shrink-0 px-4 py-2.5 flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800/50">
              <div className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-blue-500 flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 1v3M4 6h.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">1-Step Approval Required</p>
                <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">
                  Your message needs approval from <strong>Faculty</strong> before reaching the HOD.
                </p>
              </div>
            </div>
          )}

          {/* Pinned Message */}
          <AnimatePresence>
            {pinnedMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-indigo-100/50 dark:border-slate-800/50 px-6 py-3 flex items-center justify-between shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                onClick={() => {
                  const element = document.getElementById(`msg-${pinnedMessage.id}`)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    element.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-2', 'dark:ring-offset-slate-900')
                    setTimeout(() => element.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-2', 'dark:ring-offset-slate-900'), 2000)
                  }
                }}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Pin size={16} className="text-indigo-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Pinned Message</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 truncate font-medium">{pinnedMessage.text || 'Attachment'}</p>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setPinnedMessage(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 p-2">
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Messages */}
          <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-6 relative z-10">
            <AnimatePresence initial={false}>
              {chatMessages.map((msg, index) => (
                <motion.div
                  id={`msg-${msg.id}`}
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 transition-shadow duration-500 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setContextMenu({ id: msg.id, x: e.clientX, y: e.clientY, isMe: msg.isMe, msg })
                  }}
              >
                {!msg.isMe && (
                  <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs self-end mb-1 border border-white dark:border-slate-800 shadow-sm">
                    {activeContact.avatar}
                  </div>
                )}
                <div className={`relative max-w-[75%] group rounded-3xl p-5 shadow-md border ${
                  msg.isMe 
                    ? 'bg-indigo-600 border-indigo-500 text-white rounded-br-sm' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-sm'
                }`}>
                  
                  {/* Reply Context Banner */}
                  {msg.replyTo && (
                    <div className={`mb-3 p-2.5 rounded-xl border-l-4 ${msg.isMe ? 'bg-black/10 border-white/40' : 'bg-slate-100 dark:bg-slate-700/50 border-indigo-500'}`}>
                      <p className={`text-[11px] font-bold mb-1 ${msg.isMe ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`}>
                        Replying to {msg.replyTo.isMe ? 'You' : contacts.find(c => c.id === msg.replyTo.senderId)?.name || 'Someone'}
                      </p>
                      <p className={`text-xs truncate opacity-80 ${msg.isMe ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                        {msg.replyTo.text || 'Attachment'}
                      </p>
                    </div>
                  )}
                  {msg.images && msg.images.map((img: string, i: number) => (
                    <div key={i} className="mb-3 rounded-xl overflow-hidden">
                      <img src={img} alt="Attachment" className="max-w-full h-auto object-cover max-h-64 rounded-xl" />
                    </div>
                  ))}
                  {msg.image && (
                    <div className="mb-3 rounded-xl overflow-hidden">
                      <img src={msg.image} alt="Attachment" className="max-w-full h-auto object-cover max-h-64 rounded-xl" />
                    </div>
                  )}
                  {msg.isAudio ? (
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white">
                        <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1" />
                      </Button>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5, 4, 3, 5, 6, 4, 2].map((h, i) => (
                          <div key={i} className="w-1 bg-white/60 rounded-full" style={{ height: `${h * 4}px` }} />
                        ))}
                      </div>
                      <span className="text-xs font-medium opacity-80">0:14</span>
                    </div>
                  ) : (
                    <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                  )}
                  <div className={`flex items-center justify-end gap-1 mt-3 text-[11px] font-bold tracking-wider ${msg.isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.isEdited && <span className="mr-1 italic opacity-80 font-normal capitalize tracking-normal">edited</span>}
                    <span>{msg.time}</span>
                    {msg.isMe && <CheckCheck size={16} className="text-indigo-200" />}
                  </div>
                  {/* Approval Chain Tracker */}
                  {msg.isMe && msg.approvalSteps && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-200 mb-2">
                        Approval Required
                      </p>
                      <div className="flex items-center gap-1">
                        {msg.approvalSteps.map((step: any, i: number) => (
                          <React.Fragment key={step.label}>
                            <div className="flex flex-col items-center gap-1">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                step.status === 'approved'
                                  ? 'bg-green-400 border-green-300'
                                  : step.status === 'rejected'
                                  ? 'bg-red-400 border-red-300'
                                  : 'bg-white/20 border-white/40'
                              }`}>
                                {step.status === 'approved' && (
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                  </svg>
                                )}
                                {step.status === 'rejected' && (
                                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                    <path d="M2 2l4 4M6 2l-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                  </svg>
                                )}
                              </div>
                              <span className="text-[9px] text-indigo-200 font-medium whitespace-nowrap">{step.label}</span>
                            </div>
                            {i < msg.approvalSteps.length - 1 && (
                              <div className={`flex-1 h-0.5 mb-3 mx-0.5 rounded ${
                                step.status === 'approved' ? 'bg-green-400' : 'bg-white/20'
                              }`} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <p className="text-[10px] text-indigo-200 mt-1.5">
                        {msg.approvalSteps.every((s: any) => s.status === 'approved')
                          ? '✓ Delivered to Principal'
                          : msg.approvalSteps.find((s: any) => s.status === 'rejected')
                          ? '✗ Rejected'
                          : `Waiting for ${msg.approvalSteps.find((s: any) => s.status === 'pending')?.label} approval`
                        }
                      </p>
                    </div>
                  )}

                </div>
              </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Chat Input */}
          <div className="relative z-10 shrink-0 p-6 flex flex-col gap-3">
            <AnimatePresence>
              {editingMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  className="relative self-stretch bg-emerald-50/80 dark:bg-emerald-900/20 backdrop-blur-sm border-l-4 border-emerald-500 rounded-r-xl p-3 flex justify-between items-start"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-0.5 flex items-center gap-1.5">
                      <Edit2 size={12} /> Editing Message
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 truncate font-medium">
                      {editingMessage.text || 'Attachment'}
                    </p>
                  </div>
                  <button onClick={() => { setEditingMessage(null); setMessage(''); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X size={16} />
                  </button>
                </motion.div>
              )}

              {replyingTo && !editingMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  className="relative self-stretch bg-indigo-50/80 dark:bg-indigo-900/20 backdrop-blur-sm border-l-4 border-indigo-500 rounded-r-xl p-3 flex justify-between items-start"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">
                      Replying to {replyingTo.isMe ? 'You' : contacts.find(c => c.id === replyingTo.senderId)?.name || 'Someone'}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 truncate font-medium">
                      {replyingTo.text || 'Attachment'}
                    </p>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X size={16} />
                  </button>
                </motion.div>
              )}

              {attachments.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  className="relative flex gap-3 flex-wrap items-start"
                >
                  {attachments.map((att, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-indigo-500 shadow-md">
                      <img src={att} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-6 h-6 bg-slate-900/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-end gap-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
              <input 
                type="file" 
                multiple
                ref={fileInputRef} 
                onChange={(e) => e.target.files && handleFilesSelect(e.target.files)}
                className="hidden" 
                accept="image/*"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full w-10 h-10 mb-0.5"
              >
                <Paperclip size={20} />
              </Button>
              
              <div className="flex-1 max-h-32 min-h-[44px] flex items-center relative overflow-y-auto hide-scrollbar py-2 px-2">
                {isRecording ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex items-center gap-2 text-red-500 font-medium"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-2.5 h-2.5 bg-red-500 rounded-full"
                    />
                    <span className="text-sm">Recording... 0:03</span>
                  </motion.div>
                ) : (
                  <textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                      e.target.style.height = 'auto'
                      e.target.style.height = `${e.target.scrollHeight}px`
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="w-full bg-transparent text-[15px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none resize-none hide-scrollbar m-0 p-0 block"
                    rows={1}
                    style={{ minHeight: '24px' }}
                  />
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0 mb-0.5">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-10 h-10 rounded-full transition-colors ${isRecording ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
                >
                  <Mic size={20} />
                </Button>
                <Button 
                  onClick={handleSend}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 rounded-full flex items-center justify-center p-0 shadow-md shadow-indigo-600/20 transition-transform hover:scale-105"
                >
                  <Send size={18} className="ml-0.5" />
                </Button>
              </div>
            </div>
          </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-slate-900/90 dark:to-indigo-950/90">
              {/* Floating Chat Bubbles Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {bubbles.map((b) => (
                  <motion.div
                    key={b.id}
                    initial={{ y: "110vh", opacity: 0, x: 0 }}
                    animate={{ 
                      y: "-20vh", 
                      opacity: [0, 0.7, 0],
                      rotate: b.rotate 
                    }}
                    transition={{ 
                      duration: b.duration, 
                      repeat: Infinity, 
                      delay: b.delay,
                      ease: "linear"
                    }}
                    className="absolute bottom-0 text-indigo-400/60 dark:text-indigo-400/40"
                    style={{ left: `${b.xOffset}%` }}
                  >
                    <MessageSquare size={b.size} strokeWidth={1.5} fill="currentColor" />
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center justify-center p-12 text-center backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 rounded-[2.5rem] border border-white/50 dark:border-slate-700/50 shadow-xl shadow-indigo-900/5 max-w-md mx-4"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                  className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/30 text-white transform -rotate-6 relative"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white/20 rounded-[2rem] blur-md"
                  />
                  <MessageSquare size={40} className="rotate-6 relative z-10" />
                </motion.div>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Your Messages</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed">Select a conversation from the sidebar or start a new chat to begin messaging.</p>
              </motion.div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Global Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-[100] w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
            style={{ 
              top: Math.min(contextMenu.y, typeof window !== 'undefined' ? window.innerHeight - 250 : contextMenu.y), 
              left: Math.min(contextMenu.x, typeof window !== 'undefined' ? window.innerWidth - 200 : contextMenu.x) 
            }}
          >
            <button onClick={() => handleReplyMessage(contextMenu.msg)} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <Reply size={14} /> Reply
            </button>
            {contextMenu.isMe && (
              <button onClick={() => handleEditMessage(contextMenu.msg)} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <Edit2 size={14} /> Edit
              </button>
            )}
            <button onClick={() => handleCopyMessage(contextMenu.msg)} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <Copy size={14} /> Copy
            </button>
            <button onClick={() => handleForwardMessage(contextMenu.msg)} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <Forward size={14} /> Forward
            </button>
            <button onClick={() => handlePinMessage(contextMenu.msg)} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <Pin size={14} /> Pin Message
            </button>
            <div className="h-px w-full bg-slate-100 dark:bg-slate-700/50" />
            <button onClick={() => handleDeleteMessage(contextMenu.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <Trash2 size={14} /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Contact Context Menu */}
      <AnimatePresence>
        {contactContextMenu && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-[100] w-52 bg-[#1a1a1a] dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden py-2"
            style={{ 
              top: Math.min(contactContextMenu.y, typeof window !== 'undefined' ? window.innerHeight - 250 : contactContextMenu.y), 
              left: Math.min(contactContextMenu.x, typeof window !== 'undefined' ? window.innerWidth - 200 : contactContextMenu.x) 
            }}
          >
            <button onClick={() => handleArchiveChat(contactContextMenu.contact.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-slate-200 hover:bg-slate-800 transition-colors">
              <Archive size={16} /> {archivedChatIds.includes(contactContextMenu.contact.id) ? 'Unarchive chat' : 'Archive chat'}
            </button>
            <button onClick={() => handlePinContact(contactContextMenu.contact.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-slate-200 hover:bg-slate-800 transition-colors">
              {pinnedChatIds.includes(contactContextMenu.contact.id) ? <PinOff size={16} /> : <Pin size={16} />}
              {pinnedChatIds.includes(contactContextMenu.contact.id) ? 'Unpin chat' : 'Pin chat'}
            </button>
            <button onClick={() => handleToggleUnreadContact(contactContextMenu.contact.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-slate-200 hover:bg-slate-800 transition-colors">
              <CheckCheck size={16} /> {contactContextMenu.contact?.unread > 0 ? 'Mark as read' : 'Mark as unread'}
            </button>
            
            <div className="h-px bg-slate-700/50 my-1 mx-4" />
            
            <button onClick={() => handleClearChatContact(contactContextMenu.contact.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-slate-200 hover:bg-slate-800 transition-colors">
              <MinusCircle size={16} /> Clear chat
            </button>
            <button onClick={() => handleDeleteContact(contactContextMenu.contact.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-red-400 hover:bg-slate-800 transition-colors">
              <Trash2 size={16} /> Delete chat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Info Panel - Slide in from right */}
      <AnimatePresence>
        {showGroupInfo && activeContact?.role === 'Group' && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-black/30 backdrop-blur-sm"
              onClick={() => setShowGroupInfo(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm z-[120] bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Panel Header */}
              <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 pt-12 pb-8 px-6 flex flex-col items-center text-center">
                <button
                  onClick={() => setShowGroupInfo(false)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X size={16} />
                </button>
                {/* Group Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-3">
                  {activeContact.avatar}
                </div>
                <h2 className="text-white font-bold text-xl mb-1">{activeContact.name}</h2>
                <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Group</span>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-100 dark:border-slate-800">
                  {[
                    { icon: Users, label: 'Members', value: '124' },
                    { icon: Calendar, label: 'Created', value: 'Jan 2024' },
                    { icon: BookOpen, label: 'Category', value: 'Subject' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col items-center py-4 gap-1">
                      <Icon size={18} className="text-indigo-500" />
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
                      <p className="text-[10px] text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Info size={12} /> Description
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    This group is for all students and faculty involved in Advanced Mathematics. Use this space for announcements, doubt clearing, and assignment updates.
                  </p>
                </div>

                {/* Members */}
                <div className="px-5 py-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Users size={12} /> Members (124)
                  </h3>
                  <div className="space-y-1">
                    {[
                      { name: 'Dr. Sarah Jenkins', id: 'FAC-CSE-001', role: 'faculty', label: 'Admin', icon: Crown },
                      { name: 'Prof. Alan Turing', id: 'HOD-CSE-001', role: 'hod', label: 'HOD', icon: Shield },
                      { name: 'Aarav Shah', id: 'STU-CSE-2024-001', role: 'student', label: 'Student', icon: GraduationCap },
                      { name: 'Priya Nair', id: 'STU-CSE-2024-002', role: 'student', label: 'Student', icon: GraduationCap },
                      { name: 'Rohan Verma', id: 'STU-CSE-2024-003', role: 'student', label: 'Student', icon: GraduationCap },
                      { name: 'Kavya Reddy', id: 'STU-CSE-2024-004', role: 'student', label: 'Student', icon: GraduationCap },
                      { name: 'Arjun Mehta', id: 'STU-ECE-2024-001', role: 'student', label: 'Student', icon: GraduationCap },
                    ].map((member) => {
                      const roleColors: Record<string, string> = {
                        faculty: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
                        hod: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
                        student: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
                      }
                      return (
                        <div key={member.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${roleColors[member.role]}`}>
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{member.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{member.id}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {member.label === 'Admin' && <Crown size={13} className="text-amber-500" />}
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleColors[member.role]}`}>
                              {member.label}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                    <button className="w-full mt-2 text-sm text-indigo-600 dark:text-indigo-400 font-semibold py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors">
                      View all 124 members →
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="px-5 pb-8 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button className="w-full py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                    Leave Group
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
