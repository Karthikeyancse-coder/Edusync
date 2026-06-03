'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthProvider'

interface RealtimeContextType {
  unreadMessages: number
  unreadNotifications: number
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const { user, profile } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user || !profile) return

    let mounted = true

    // Fetch initial counts
    async function fetchCounts() {
      // Unread messages
      const { count: msgCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user!.id)
        .eq('is_read', false)
      
      // Unread notifications
      const { count: notifCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .eq('is_read', false)

      if (mounted) {
        setUnreadMessages(msgCount || 0)
        setUnreadNotifications(notifCount || 0)
      }
    }

    fetchCounts()

    // Subscribe to messages
    const messagesChannel = supabase.channel('realtime:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          setUnreadMessages(prev => prev + 1)
        }
      )
      .subscribe()

    // Subscribe to notifications
    const notificationsChannel = supabase.channel('realtime:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          setUnreadNotifications(prev => prev + 1)
        }
      )
      .subscribe()

    // Subscribe to announcements based on role/department
    let announcementFilter = ''
    if (profile.role === 'principal') {
      announcementFilter = `target_role=is.null` // or custom logic for principal
    } else {
      announcementFilter = `target_department=eq.${profile.department}`
    }

    const announcementsChannel = supabase.channel('realtime:announcements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'announcements',
          // Note: filter is simplified, might need adjustment based on exact requirement
        },
        () => {
          // You might want to update a different state or trigger a toast here
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(messagesChannel)
      supabase.removeChannel(notificationsChannel)
      supabase.removeChannel(announcementsChannel)
    }
  }, [user, profile, supabase])

  return (
    <RealtimeContext.Provider value={{ unreadMessages, unreadNotifications }}>
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}
