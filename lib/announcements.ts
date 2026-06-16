import { createClient } from '@/lib/supabase/client'
import type { Role } from '@/types'

export interface Announcement {
  id: string
  created_by: string
  title: string
  content: string
  target_role: string | null
  target_department: string | null
  total_targets: number
  type: 'urgent' | 'event' | 'academic' | 'info'
  is_pinned: boolean
  created_at: string
  author?: {
    id: string
    name: string
    role: string
    avatar_color: string
    department: string | null
  }
  _acksCount?: number
  _hasAcknowledged?: boolean
  _hasViewed?: boolean
}

// ─── Fetch Announcements ──────────────────────────────────────────────────────
export async function getAnnouncements(userId: string, role: Role, department: string | null) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('announcements')
    .select(`
      *,
      author:users!created_by(id, name, role, avatar_color, department),
      announcement_views(user_id),
      announcement_acknowledgments(user_id)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[announcements] get error:', error)
    throw error
  }

  // Filter based on role/dept logic
  // Principal: sees all
  // HOD: sees their dept (any role) + college-wide
  // Faculty: sees their dept (students only + faculty only) + college-wide
  // Student: sees their dept (student only) + college-wide
  const filtered = (data || []).filter((a: any) => {
    if (role === 'principal') return true
    
    // College-wide
    if (!a.target_department) {
      if (!a.target_role || a.target_role === 'All' || a.target_role === role) return true
      return false
    }

    // Dept specific
    if (a.target_department === department) {
      if (!a.target_role || a.target_role === 'All' || a.target_role === role) return true
      // Also allow creators to see their own
      if (a.created_by === userId) return true
      return false
    }

    return false
  })

  // Map to include extra helper fields
  return filtered.map((a: any) => {
    const _hasViewed = a.announcement_views?.some((v: any) => v.user_id === userId) || false
    const _hasAcknowledged = a.announcement_acknowledgments?.some((ack: any) => ack.user_id === userId) || false
    const _acksCount = a.announcement_acknowledgments?.length || 0

    return {
      ...a,
      _hasViewed,
      _hasAcknowledged,
      _acksCount
    }
  }) as Announcement[]
}

// ─── Create Announcement ──────────────────────────────────────────────────────
export async function createAnnouncement(data: {
  created_by: string
  title: string
  content: string
  target_role: string | null
  target_department: string | null
  type: string
  is_pinned: boolean
}, creatorRole: Role) {
  const supabase = createClient()

  // 1. Enforce Daily Limits (Max 3 per day for Faculty/HOD)
  if (creatorRole !== 'principal') {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    
    const { count, error: countErr } = await supabase
      .from('announcements')
      .select('id', { count: 'exact', head: true })
      .eq('created_by', data.created_by)
      .gte('created_at', startOfDay.toISOString())

    if (!countErr && count !== null && count >= 3) {
      throw new Error('Daily limit reached: You can only post 3 announcements per day.')
    }
  }

  // 2. Duplicate Detection (Same title + creator within 1 hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count: dupCount } = await supabase
    .from('announcements')
    .select('id', { count: 'exact', head: true })
    .eq('created_by', data.created_by)
    .eq('title', data.title.trim())
    .gte('created_at', oneHourAgo)

  if (dupCount && dupCount > 0) {
    throw new Error('You posted something similar recently. Please wait an hour before posting the exact same title.')
  }

  // 3. Compute Total Targets
  let usersQuery = supabase.from('users').select('id', { count: 'exact', head: true })
  if (data.target_department) {
    usersQuery = usersQuery.eq('department', data.target_department)
  }
  if (data.target_role && data.target_role !== 'All') {
    usersQuery = usersQuery.eq('role', data.target_role.toLowerCase())
  }
  const { count: targetCount } = await usersQuery
  const total_targets = targetCount || 0

  // 4. Insert
  const { data: newRow, error } = await supabase
    .from('announcements')
    .insert({
      created_by: data.created_by,
      title: data.title.trim(),
      content: data.content.trim(),
      target_role: data.target_role === 'All' ? null : data.target_role,
      target_department: data.target_department,
      type: data.type,
      is_pinned: data.is_pinned,
      total_targets
    })
    .select()
    .single()

  if (error) throw error

  // Create notification for targets
  // Note: in a real large-scale app, we would use a DB trigger or edge function.
  // We will let the realtime subscription handle showing it on the UI.
  return newRow
}

// ─── Update & Delete ──────────────────────────────────────────────────────────
export async function updateAnnouncement(id: string, data: Partial<Announcement>, userId: string, role: Role) {
  const supabase = createClient()
  
  // Verify ownership or principal
  if (role !== 'principal') {
    const { data: existing } = await supabase.from('announcements').select('created_by').eq('id', id).single()
    if (existing?.created_by !== userId) throw new Error('Unauthorized to edit this announcement.')
  }

  const { error } = await supabase.from('announcements').update({
    title: data.title,
    content: data.content,
    type: data.type,
    is_pinned: data.is_pinned
  }).eq('id', id)

  if (error) throw error
}

export async function deleteAnnouncement(id: string, userId: string, role: Role) {
  const supabase = createClient()

  if (role !== 'principal') {
    const { data: existing } = await supabase.from('announcements').select('created_by').eq('id', id).single()
    if (existing?.created_by !== userId) throw new Error('Unauthorized to delete this announcement.')
  }

  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) throw error
}

// ─── Views & Acknowledgments ──────────────────────────────────────────────────
export async function logAnnouncementView(announcementId: string, userId: string) {
  const supabase = createClient()
  await supabase
    .from('announcement_views')
    .insert({ announcement_id: announcementId, user_id: userId })
    // Ignore duplicate keys (already viewed)
    .select()
    .single()
}

export async function acknowledgeAnnouncement(announcementId: string, userId: string) {
  const supabase = createClient()

  // Verify server_open_time > 3 seconds
  const { data: viewData } = await supabase
    .from('announcement_views')
    .select('opened_at')
    .eq('announcement_id', announcementId)
    .eq('user_id', userId)
    .single()

  if (!viewData) {
    throw new Error('You must read the announcement before acknowledging.')
  }

  const openedAt = new Date(viewData.opened_at).getTime()
  const now = new Date().getTime()
  
  if (now - openedAt < 3000) {
    throw new Error('Please wait 3 seconds to ensure you have read the announcement.')
  }

  const { error } = await supabase
    .from('announcement_acknowledgments')
    .insert({ announcement_id: announcementId, user_id: userId })

  if (error) throw error
}

// ─── Fetch Acknowledgment List ────────────────────────────────────────────────
export async function getAcknowledgmentList(announcementId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('announcement_acknowledgments')
    .select(`
      acknowledged_at,
      user:users!user_id(id, name, unique_id, avatar_color)
    `)
    .eq('announcement_id', announcementId)
    .order('acknowledged_at', { ascending: false })

  if (error) throw error
  return data
}

// ─── Realtime Subscription ────────────────────────────────────────────────────
export function subscribeToAnnouncements(onUpdate: () => void) {
  const supabase = createClient()
  const channelName = `announcements-realtime:${Math.random().toString(36).substring(7)}`

  return supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, onUpdate)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcement_acknowledgments' }, onUpdate)
    .subscribe()
}
