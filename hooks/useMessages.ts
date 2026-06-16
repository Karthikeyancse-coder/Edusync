'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  getConversation,
  sendMessage as sendMsg,
  approveMessage as approveMsg,
  rejectMessage as rejectMsg,
  editMessage as editMsg,
  deleteMessage as deleteMsg,
  markAsRead,
  subscribeToMessages,
} from '@/lib/messaging'
import type { Role } from '@/types'

export interface ChatMessage {
  id: string
  sender_id: string
  receiver_id: string | null
  content: string
  status: string
  is_read: boolean
  is_cross_dept: boolean
  is_locked: boolean
  rejection_reason?: string | null
  escalated_at?: string | null
  created_at: string
  sender?: {
    id: string
    name: string
    role: string
    avatar_color: string
  }
  attachments?: Array<{
    id: string
    file_name: string
    file_type: string
    file_url: string
  }>
  is_optimistic?: boolean
}

export function useMessages(
  userId: string | undefined,
  contactId: string | null,
  senderRole: Role | null,
  receiverRole: Role | null
) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof subscribeToMessages> | null>(null)
  const supabase = createClient()

  const fetchMessages = useCallback(async () => {
    if (!userId || !contactId) {
      setMessages([])
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const data = await getConversation(userId, contactId)
      setMessages(data as ChatMessage[])
      // Mark as read
      await markAsRead(userId, contactId)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }, [userId, contactId])

  // Load messages when contact changes
  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Real-time subscription
  useEffect(() => {
    if (!userId) return

    // Clean up previous subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    const handleNew = (msg: any) => {
      // Only add if this message belongs to the current conversation
      if (
        contactId &&
        (msg.sender_id === contactId || msg.receiver_id === contactId)
      ) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.find(m => m.id === msg.id)) return prev
          return [...prev, msg]
        })
        // Mark as read immediately if this convo is open
        if (msg.sender_id === contactId) {
          markAsRead(userId, contactId).catch(console.error)
        }
      }
    }

    const handleUpdate = (msg: any) => {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, ...msg } : m))
    }

    channelRef.current = subscribeToMessages(userId, handleNew, handleUpdate)

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, contactId])

  const send = useCallback(
    async (content: string, isCrossDept = false) => {
      if (!userId || !contactId || !senderRole || !receiverRole) {
        throw new Error('Missing context for sending message')
      }

      // Optimistic insert
      const optimisticId = `optimistic-${Date.now()}`
      const optimistic: ChatMessage = {
        id: optimisticId,
        sender_id: userId,
        receiver_id: contactId,
        content,
        status: 'sent',
        is_read: false,
        is_cross_dept: isCrossDept,
        is_locked: false,
        created_at: new Date().toISOString(),
        is_optimistic: true,
      }
      setMessages(prev => [...prev, optimistic])

      try {
        const real = await sendMsg(userId, contactId, content, senderRole, receiverRole, isCrossDept)
        // Replace optimistic with real
        setMessages(prev =>
          prev.map(m => m.id === optimisticId ? (real as ChatMessage) : m)
        )
      } catch (e: any) {
        // Remove optimistic on failure
        setMessages(prev => prev.filter(m => m.id !== optimisticId))
        throw e
      }
    },
    [userId, contactId, senderRole, receiverRole]
  )

  const approve = useCallback(
    async (messageId: string, approverRole: Role) => {
      if (!userId) return
      await approveMsg(messageId, userId, approverRole)
      // Update locally
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId
            ? { ...m, status: approverRole === 'faculty' ? 'pending_hod' : 'delivered' }
            : m
        )
      )
    },
    [userId]
  )

  const reject = useCallback(
    async (messageId: string, reason: string) => {
      await rejectMsg(messageId, reason)
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId
            ? { ...m, status: 'rejected', rejection_reason: reason }
            : m
        )
      )
    },
    []
  )

  const edit = useCallback(
    async (messageId: string, newContent: string) => {
      if (!userId) return
      // Optimistic update
      setMessages(prev =>
        prev.map(m => (m.id === messageId ? { ...m, content: newContent } : m))
      )
      try {
        await editMsg(messageId, userId, newContent)
      } catch (e: any) {
        // We could revert the optimistic update here if needed
        console.error('Failed to edit message', e)
        throw e
      }
    },
    [userId]
  )

  const remove = useCallback(
    async (messageId: string) => {
      if (!userId) return
      // Optimistic update
      setMessages(prev => prev.filter(m => m.id !== messageId))
      try {
        await deleteMsg(messageId, userId)
      } catch (e: any) {
        console.error('Failed to delete message', e)
        throw e
      }
    },
    [userId]
  )

  return { messages, isLoading, error, send, approve, reject, edit, remove, refetch: fetchMessages }
}
