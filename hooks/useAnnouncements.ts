'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  logAnnouncementView,
  acknowledgeAnnouncement,
  subscribeToAnnouncements,
  Announcement
} from '@/lib/announcements'
import type { Role } from '@/types'

const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'fallback-1',
    created_by: 'admin-1',
    title: 'Urgent: Campus Closure Due to Weather',
    content: 'Due to severe weather conditions, the campus will be closed for all non-essential personnel today. All classes will be moved online. Please check your course pages for specific instructions.',
    target_role: null,
    target_department: null,
    total_targets: 1500,
    type: 'urgent',
    is_pinned: true,
    created_at: new Date().toISOString(),
    author: {
      id: 'admin-1',
      name: 'Admin Principal',
      role: 'principal',
      avatar_color: '#FF4D6D',
      department: 'Administration'
    },
    _acksCount: 432,
    _hasAcknowledged: false,
    _hasViewed: false
  },
  {
    id: 'fallback-2',
    created_by: 'hod-1',
    title: 'Fall Semester Registration Opening Soon',
    content: 'Registration for the upcoming Fall semester will open next Monday at 8:00 AM. Please ensure you have met with your academic advisor and cleared any holds on your account before attempting to register.',
    target_role: null,
    target_department: 'Computer Science',
    total_targets: 300,
    type: 'academic',
    is_pinned: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    author: {
      id: 'hod-1',
      name: 'Prof. Alan Turing',
      role: 'hod',
      avatar_color: '#FFB800',
      department: 'Computer Science'
    },
    _acksCount: 120,
    _hasAcknowledged: true,
    _hasViewed: true
  },
  {
    id: 'fallback-3',
    created_by: 'hod-2',
    title: 'Annual Science Fair - Call for Participants',
    content: 'The Physics and Chemistry departments are proud to announce the Annual Science Fair. We are currently looking for student volunteers and project submissions. The deadline for registration is the end of this month.',
    target_role: null,
    target_department: 'Physics',
    total_targets: 200,
    type: 'event',
    is_pinned: false,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    author: {
      id: 'hod-2',
      name: 'Dr. Marie Curie',
      role: 'hod',
      avatar_color: '#F97316',
      department: 'Physics'
    },
    _acksCount: 85,
    _hasAcknowledged: false,
    _hasViewed: false
  }
]

export function useAnnouncements(userId: string | undefined, role: Role | null, department: string | null) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof subscribeToAnnouncements> | null>(null)

  const fetchAnnouncements = useCallback(async () => {
    if (!userId || !role) {
      setAnnouncements([])
      setIsLoading(false)
      return
    }
    
    // Don't set isLoading(true) on subsequent fetches to avoid flicker
    setError(null)
    try {
      const data = await getAnnouncements(userId, role, department)
      if (!data || data.length === 0) {
        setAnnouncements(FALLBACK_ANNOUNCEMENTS)
      } else {
        setAnnouncements(data)
      }
    } catch (e: any) {
      console.error('Fetch announcements error:', e)
      setError('Database connection error. Showing offline samples.')
      setAnnouncements(FALLBACK_ANNOUNCEMENTS)
    } finally {
      setIsLoading(false)
    }
  }, [userId, role, department])

  // Initial load
  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  // Real-time subscription
  useEffect(() => {
    if (!userId) return

    if (channelRef.current) {
      // Channel cleanup is managed internally, but for safety we re-establish
    }

    const handleUpdate = () => {
      fetchAnnouncements()
    }

    const channel = subscribeToAnnouncements(handleUpdate)
    channelRef.current = channel

    return () => {
      if (channel) channel.unsubscribe()
    }
  }, [userId, fetchAnnouncements])

  const create = async (data: Omit<Parameters<typeof createAnnouncement>[0], 'created_by'>) => {
    if (!userId || !role) throw new Error('Not authenticated')
    await createAnnouncement({ ...data, created_by: userId }, role)
  }

  const update = async (id: string, data: Partial<Announcement>) => {
    if (!userId || !role) throw new Error('Not authenticated')
    await updateAnnouncement(id, data, userId, role)
  }

  const remove = async (id: string) => {
    if (!userId || !role) throw new Error('Not authenticated')
    await deleteAnnouncement(id, userId, role)
  }

  const view = async (id: string) => {
    if (!userId) return
    try {
      await logAnnouncementView(id, userId)
    } catch (e) {
      // Ignore if already viewed
    }
  }

  const acknowledge = async (id: string) => {
    if (!userId) return
    await acknowledgeAnnouncement(id, userId)
  }

  return {
    announcements,
    isLoading,
    error,
    create,
    update,
    remove,
    view,
    acknowledge,
    refetch: fetchAnnouncements
  }
}
