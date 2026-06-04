'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Send, Paperclip, MoreVertical, CheckCheck } from 'lucide-react'
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

const messages = [
  { id: 1, senderId: 1, text: 'Hello! I wanted to remind you about the upcoming deadline for the final project.', time: '10:30 AM', isMe: false },
  { id: 2, senderId: 'me', text: 'Hi Dr. Jenkins. Yes, I have already submitted it through the portal.', time: '10:35 AM', isMe: true },
  { id: 3, senderId: 1, text: 'Excellent, I will review it this evening. The syllabus has been updated.', time: '10:42 AM', isMe: false },
]

export default function Messages() {
  const [activeContact, setActiveContact] = useState(contacts[0])
  const [message, setMessage] = useState('')

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] md:h-screen p-4 md:p-6 pb-24 md:pb-6 overflow-hidden max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex gap-4 md:gap-6"
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
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${
                  activeContact.id === contact.id
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
        <Card className="hidden md:flex flex-1 flex-col h-full bg-white/50 dark:bg-surface/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                {activeContact.avatar}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{activeContact.name}</h3>
                <p className="text-xs text-slate-500">{activeContact.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <MoreVertical size={20} />
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl p-4 ${
                  msg.isMe 
                    ? 'bg-indigo-600 text-white rounded-br-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                    <span>{msg.time}</span>
                    {msg.isMe && <CheckCheck size={14} />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/60 flex items-end gap-2">
            <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-indigo-600">
              <Paperclip size={20} />
            </Button>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 max-h-32 min-h-[44px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={1}
            />
            <Button className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white w-11 h-11 rounded-xl flex items-center justify-center p-0">
              <Send size={18} className="ml-1" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
