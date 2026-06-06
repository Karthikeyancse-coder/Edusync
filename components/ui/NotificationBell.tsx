'use client'

import React, { useState } from 'react'
import { Bell, Check, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button'
import { cn } from '@/lib/utils'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Assignment', desc: 'Data Structures assignment uploaded.', time: '2h ago', read: false },
    { id: 2, title: 'Meeting Scheduled', desc: 'Department meeting at 3 PM.', time: '4h ago', read: false },
    { id: 3, title: 'System Maintenance', desc: 'Server down for maintenance tonight.', time: '1d ago', read: true }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 focus:outline-none"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 text-xs py-0.5 px-2 rounded-full font-medium">
                      {unreadCount} New
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={markAllRead} className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800" title="Mark all as read">
                    <Check size={16} />
                  </button>
                  <button onClick={clearAll} className="p-1.5 text-slate-500 hover:text-red-600 transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800" title="Clear all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <Bell className="mx-auto mb-3 opacity-20" size={32} />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={cn(
                          "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 items-start",
                          !notification.read && "bg-indigo-50/50 dark:bg-indigo-500/5"
                        )}
                        onClick={() => {
                          setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n))
                        }}
                      >
                        <div className={cn(
                          "w-2 h-2 mt-1.5 rounded-full shrink-0",
                          !notification.read ? "bg-indigo-500" : "bg-transparent"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium mb-0.5 truncate",
                            !notification.read ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {notification.desc}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <Button variant="ghost" className="w-full text-sm text-indigo-600 dark:text-indigo-400">
                  View All Notifications
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
