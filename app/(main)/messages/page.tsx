'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Send, Paperclip, MoreVertical, CheckCheck, Mic, X, ImageIcon, Reply, Forward, Trash2, ChevronDown, Edit2, Copy, User, BellOff, CheckSquare, XCircle, Pin, PinOff, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const contacts = [
  { id: 1, name: 'Dr. Sarah Jenkins', role: 'Professor', lastMessage: 'The syllabus has been updated.', time: '10:42 AM', unread: 2, avatar: 'SJ' },
  { id: 2, name: 'Computer Science 101', role: 'Group', lastMessage: 'Don\'t forget the assignment!', time: 'Yesterday', unread: 0, avatar: 'CS' },
  { id: 3, name: 'Michael Chen', role: 'Student', lastMessage: 'Thanks for the help!', time: 'Tuesday', unread: 0, avatar: 'MC' },
  { id: 4, name: 'Faculty Announcements', role: 'Group', lastMessage: 'Meeting at 3 PM in Room 4B.', time: 'Monday', unread: 5, avatar: 'FA' },
]

const initialMessages = [
  { id: 1, senderId: 1, text: 'Hello! I wanted to remind you about the upcoming deadline for the final project.', time: '10:30 AM', isMe: false, image: null, isAudio: false },
  { id: 2, senderId: 'me', text: 'Hi Dr. Jenkins. Yes, I have already submitted it through the portal.', time: '10:35 AM', isMe: true, image: null, isAudio: false },
  { id: 3, senderId: 1, text: 'Excellent, I will review it this evening. The syllabus has been updated.', time: '10:42 AM', isMe: false, image: null, isAudio: false },
]

export default function Messages() {
  const [activeContact, setActiveContact] = useState<any | null>(contacts[0])
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<any[]>(initialMessages)
  
  const [isDragging, setIsDragging] = useState(false)
  const [attachment, setAttachment] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  
  const [contextMenu, setContextMenu] = useState<{ id: number, x: number, y: number, isMe: boolean, msg: any } | null>(null)
  const [pinnedMessage, setPinnedMessage] = useState<any | null>(null)
  const [replyingTo, setReplyingTo] = useState<any | null>(null)
  const [editingMessage, setEditingMessage] = useState<any | null>(null)
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  
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
    const handleGlobalClick = () => setContextMenu(null)
    window.addEventListener('click', handleGlobalClick)
    return () => window.removeEventListener('click', handleGlobalClick)
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAttachment(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSend = () => {
    if (!message.trim() && !attachment && !isRecording) return

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

    const newMessage = {
      id: Date.now(),
      senderId: 'me',
      text: isRecording ? 'Audio Message' : message,
      image: attachment,
      isAudio: isRecording,
      replyTo: replyingTo,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }

    setChatMessages([...chatMessages, newMessage])
    setMessage('')
    setAttachment(null)
    setIsRecording(false)
    setReplyingTo(null)
  }

  const handleDeleteMessage = (id: number) => {
    setChatMessages(prev => prev.filter(m => m.id !== id))
    if (pinnedMessage?.id === id) setPinnedMessage(null)
    setContextMenu(null)
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
    alert(`Contact Info: ${activeContact.name}\nRole: ${activeContact.role}`)
    setIsHeaderMenuOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] md:h-screen p-4 md:p-6 pb-24 md:pb-6 overflow-hidden relative">
      {/* Background for the entire page behind the cards */}
      <div className="absolute inset-0 bg-blue-300 dark:bg-slate-900 z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex gap-4 md:gap-6 max-w-7xl mx-auto relative z-10"
      >
        {/* Contacts Sidebar */}
        <Card className="w-full md:w-80 lg:w-96 flex flex-col h-full bg-white/50 dark:bg-surface/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/60">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Search messages..." className="pl-10 bg-slate-50 dark:bg-slate-900 border-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setActiveContact(contact)}
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
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{contact.name}</h3>
                    <span className="text-xs text-slate-500">{contact.time}</span>
                  </div>
                  <p className={`text-sm truncate mt-0.5 ${contact.unread > 0 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                    {contact.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Active Chat Area */}
        <Card 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`hidden md:flex flex-1 flex-col h-full bg-[#f8f9fc]/90 dark:bg-slate-900/90 backdrop-blur-xl border-none shadow-xl relative overflow-hidden rounded-2xl transition-colors duration-300 ${isDragging ? 'ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}
        >
          {activeContact ? (
            <>
          {/* Drag Overlay */}
          <AnimatePresence>
            {isDragging && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <ImageIcon size={32} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Drop image to attach</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">Release your mouse to add this file to the chat</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative Mesh Gradient Background */}
          <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-indigo-300/60 dark:bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-violet-300/60 dark:bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-[30%] left-[20%] w-[25rem] h-[25rem] bg-emerald-300/40 dark:bg-emerald-600/10 rounded-full blur-[80px] pointer-events-none" />
          
          {/* Chat Header */}
          <div className="relative z-20 shrink-0 p-6 flex items-center justify-between border-b border-indigo-100/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {activeContact.avatar}
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-[17px]">{activeContact.name}</h3>
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

              {attachment && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  className="relative self-start"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-indigo-500 shadow-md">
                    <img src={attachment} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setAttachment(null)}
                      className="absolute top-1 right-1 w-6 h-6 bg-slate-900/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3 w-full">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                className="hidden" 
                accept="image/*"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-full h-12 w-12 shadow-md hover:text-indigo-600 border border-slate-100 dark:border-slate-700 transition-transform hover:scale-105"
              >
                <Paperclip size={22} />
              </Button>
              <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full px-5 py-3 shadow-md flex items-center focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all relative overflow-hidden">
                {isRecording ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex items-center gap-3 text-red-500 font-medium"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-3 h-3 bg-red-500 rounded-full"
                    />
                    Recording audio... 0:03
                  </motion.div>
                ) : (
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent text-[15px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-9 h-9 rounded-full ${isRecording ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-slate-400 hover:text-indigo-600'}`}
                >
                  <Mic size={20} />
                </Button>
              </div>
              <Button 
                onClick={handleSend}
                className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white w-12 h-12 rounded-full flex items-center justify-center p-0 shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105"
              >
                <Send size={20} className="ml-1" />
              </Button>
            </div>
          </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-slate-900/90 dark:to-indigo-950/90">
              {/* Floating Chat Bubbles Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: "100vh", opacity: 0, x: (i % 2 === 0 ? 1 : -1) * (i * 40) }}
                    animate={{ 
                      y: "-20vh", 
                      opacity: [0, 0.4, 0],
                      rotate: (i % 3 === 0 ? 1 : -1) * (i * 15) 
                    }}
                    transition={{ 
                      duration: 10 + (i % 5) * 2, 
                      repeat: Infinity, 
                      delay: (i % 10) * 1.5,
                      ease: "linear"
                    }}
                    className="absolute bottom-0 left-1/2 text-indigo-400/50 dark:text-indigo-500/40"
                    style={{ marginLeft: `${(i % 2 === 0 ? 1 : -1) * (i * 4)}%` }}
                  >
                    <MessageSquare size={30 + (i % 4) * 10} strokeWidth={1.5} fill="currentColor" />
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
    </div>
  )
}
