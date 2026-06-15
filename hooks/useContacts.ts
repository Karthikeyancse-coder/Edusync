'use client'

import { useState, useEffect, useCallback } from 'react'
import { getContacts, getUnreadCounts, escalateStalePendingMessages } from '@/lib/messaging'
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
      escalateStalePendingMessages().catch(console.error)

      setContacts(
        (contactData as Contact[]).map(c => ({
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

  return { contacts, isLoading, error, unreadCounts, refetch: fetchContacts }
}
