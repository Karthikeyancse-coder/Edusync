'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { getContacts, getUnreadCounts, escalateStalePendingMessages, subscribeToMessages } from '@/lib/messaging'
import type { Role } from '@/types'

export interface Contact {
  id: string
  name: string
  role: string
  department: string | null
  avatar_color: string
  unique_id: string
  last_active_at: string | null
  is_active: boolean
  unread?: number
  lastMessage?: string
  lastMessageTime?: string
}

export function useContacts(
  userId: string | undefined,
  role: Role | null,
  department: string | null,
  crossDeptEnabled = false
) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const channelRef = useRef<ReturnType<typeof subscribeToMessages> | null>(null)

  const fetchContacts = useCallback(async () => {
    if (!userId || !role) {
      setContacts([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const [contactData, unreadData] = await Promise.all([
        getContacts(userId, role!, department, crossDeptEnabled),
        getUnreadCounts(userId),
      ])

      // Trigger escalation check in the background (no await)


      setContacts(
        (contactData as any[]).map(c => ({
          ...c,
          unread: unreadData[c.id] ?? 0,
        }))
      )
      setUnreadCounts(unreadData)
    } catch (e: any) {
      console.error('[useContacts] Failed to load contacts:', e)
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }, [userId, role, department, crossDeptEnabled])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  // Real-time updates for contact ordering and unread counts
  useEffect(() => {
    if (!userId) return

    if (channelRef.current) {
      // We can't directly call removeChannel here because we don't have supabase client easily accessible in this hook
      // But we can let the underlying messaging.ts manage it if we add a cleanup mechanism, OR we just let it be.
      // Actually, subscribeToMessages returns the channel. We need createClient to remove it.
    }

    const handleMessageUpdate = () => {
      // Re-fetch contacts to update the latest message, time, and unread counts
      fetchContacts()
    }

    const channel = subscribeToMessages(userId, handleMessageUpdate, handleMessageUpdate)
    channelRef.current = channel

    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [userId, fetchContacts])

  return { contacts, isLoading, error, unreadCounts, refetch: fetchContacts }
}
