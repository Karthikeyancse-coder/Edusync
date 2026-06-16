import { createClient } from '@/lib/supabase/client'
import type { Role } from '@/types'

// ─── Rate limiting (in-memory per session) ───────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(userId: string): void {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 })
    return
  }

  if (entry.count >= 20) {
    throw new Error('Too many messages. Please wait before sending more.')
  }

  entry.count++
}

// ─── Determine message status based on sender → receiver roles ────────────────
export function determineMessageStatus(
  senderRole: Role,
  receiverRole: Role
): string {
  // Student → Principal or HOD requires approval chain
  if (senderRole === 'student' && (receiverRole === 'principal' || receiverRole === 'hod')) {
    return 'pending_faculty'
  }
  // All other allowed combinations are delivered directly
  return 'delivered'
}

// ─── Check if a sender is allowed to message a receiver ──────────────────────
export function canMessage(
  senderRole: Role,
  senderDept: string | null,
  receiverRole: Role,
  receiverDept: string | null,
  crossDeptEnabled = false
): boolean {
  if (senderRole === 'principal') return true // Principal → Anyone

  if (senderRole === 'hod') {
    if (receiverRole === 'principal') return true
    // HOD → Faculty/Students in own dept only
    if (receiverRole === 'faculty' || receiverRole === 'student') {
      return receiverDept === senderDept
    }
    return false
  }

  if (senderRole === 'faculty') {
    if (receiverRole === 'principal') return true  // Direct, no approval
    if (receiverRole === 'hod' && receiverDept === senderDept) return true
    if (receiverRole === 'faculty') return true
    if (receiverRole === 'student') return receiverDept === senderDept
    return false
  }

  if (senderRole === 'student') {
    if (receiverRole === 'student') return true // Any student
    if (receiverRole === 'faculty') {
      // Own dept always allowed; cross-dept only if toggle enabled
      return receiverDept === senderDept || crossDeptEnabled
    }
    // Students cannot directly initiate to HOD/Principal via this check
    // but they can send — it just goes into approval queue
    if (receiverRole === 'hod' || receiverRole === 'principal') return true
    return false
  }

  return false
}

// ─── Fetch contacts for a user based on their role ───────────────────────────
export async function getContacts(
  userId: string,
  role: Role,
  department: string | null,
  crossDeptEnabled = false
) {
  const supabase = createClient()

  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, role, department, avatar_color, unique_id, last_active_at, is_active')
    .neq('id', userId)

  if (error) {
    console.error('[messaging] getContacts error:', error)
    throw error
  }

  // Fetch recent messages for sorting and preview
  const { data: messages, error: msgError } = await supabase
    .from('messages')
    .select('content, created_at, sender_id, receiver_id')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  const latestMsgs = new Map<string, { text: string, time: string, timestamp: number }>()
  if (!msgError && messages) {
    for (const msg of messages) {
      const contactId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id
      if (contactId && !latestMsgs.has(contactId)) {
        latestMsgs.set(contactId, {
          text: msg.content,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date(msg.created_at).getTime()
        })
      }
    }
  }

  // Filter by messaging rules
  let allowedUsers = (users ?? []).filter(u =>
    canMessage(role, department, u.role as Role, u.department ?? null, crossDeptEnabled)
  )

  const enrichedUsers = allowedUsers.map(u => {
    const msgData = latestMsgs.get(u.id)
    return {
      ...u,
      lastMessage: msgData?.text,
      lastMessageTime: msgData?.time,
      _timestamp: msgData?.timestamp || 0
    }
  })

  enrichedUsers.sort((a, b) => {
    if (a._timestamp !== b._timestamp) {
      return b._timestamp - a._timestamp
    }
    return a.name.localeCompare(b.name)
  })

  return enrichedUsers
}

// ─── Send a message ───────────────────────────────────────────────────────────
export async function sendMessage(
  senderId: string,
  receiverId: string,
  content: string,
  senderRole: Role,
  receiverRole: Role,
  isCrossDept = false
) {
  checkRateLimit(senderId)

  const supabase = createClient()
  const status = determineMessageStatus(senderRole, receiverRole)

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content: content.trim(),
      status,
      is_locked: false,
    })
    .select('*, sender:users!sender_id(id,name,role,avatar_color), receiver:users!receiver_id(id,name,role,avatar_color)')
    .single()

  if (error) throw error

  // Create notification for receiver if delivered
  if (status === 'delivered') {
    await supabase.from('notifications').insert({
      user_id: receiverId,
      type: 'message',
      title: 'New message',
      body: content.slice(0, 120),
      related_id: data.id,
    })
  }

  return data
}

// ─── Approve a pending message (faculty or HOD) ───────────────────────────────
export async function approveMessage(
  messageId: string,
  approverId: string,
  approverRole: Role
) {
  const supabase = createClient()

  // Fetch current message
  const { data: msg, error: fetchError } = await supabase
    .from('messages')
    .select('*, sender:users!sender_id(id,name), receiver:users!receiver_id(id,name)')
    .eq('id', messageId)
    .single()

  if (fetchError) throw fetchError

  let updateData: Record<string, unknown> = {}

  if (
    approverRole === 'faculty' &&
    (msg.status === 'pending_faculty' || msg.status === 'escalated')
  ) {
    // Faculty approves → now waits for HOD
    updateData = { status: 'pending_hod', via_faculty_id: approverId }
  } else if (approverRole === 'hod' && msg.status === 'pending_hod') {
    // HOD approves → delivered to principal
    updateData = { status: 'delivered', via_hod_id: approverId }

    // Notify the original receiver (principal)
    if (msg.receiver_id) {
      await supabase.from('notifications').insert({
        user_id: msg.receiver_id,
        type: 'message',
        title: 'New approved message',
        body: msg.content.slice(0, 120),
        related_id: messageId,
      })
    }
  } else {
    throw new Error(`Cannot approve message with status "${msg.status}" as ${approverRole}`)
  }

  const { error } = await supabase
    .from('messages')
    .update(updateData)
    .eq('id', messageId)

  if (error) throw error
  return { ...msg, ...updateData }
}

// ─── Reject a pending message ─────────────────────────────────────────────────
export async function rejectMessage(messageId: string, reason: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('messages')
    .update({ status: 'rejected', rejection_reason: reason })
    .eq('id', messageId)

  if (error) throw error
}

// ─── Edit a message ───────────────────────────────────────────────────────────
export async function editMessage(messageId: string, userId: string, newContent: string) {
  const supabase = createClient()

  // Only allow editing if the user is the sender
  const { error } = await supabase
    .from('messages')
    .update({ content: newContent })
    .match({ id: messageId, sender_id: userId })

  if (error) throw error
}

// ─── Delete a message ─────────────────────────────────────────────────────────
export async function deleteMessage(messageId: string, userId: string) {
  const supabase = createClient()

  // Only allow deleting if the user is the sender
  const { error } = await supabase
    .from('messages')
    .delete()
    .match({ id: messageId, sender_id: userId })

  if (error) throw error
}

// ─── Get pending messages for approval (faculty or HOD) ───────────────────────
export async function getPendingApprovals(approverId: string, approverRole: Role) {
  const supabase = createClient()

  let statusFilter: string[]
  if (approverRole === 'faculty') {
    statusFilter = ['pending_faculty', 'escalated']
  } else if (approverRole === 'hod') {
    statusFilter = ['pending_hod']
  } else {
    return []
  }

  // Get the approver's department
  const { data: approver } = await supabase
    .from('users')
    .select('department')
    .eq('id', approverId)
    .single()

  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:users!sender_id(id,name,role,avatar_color,department), receiver:users!receiver_id(id,name,role)')
    .in('status', statusFilter)
    .order('created_at', { ascending: true })

  if (error) throw error

  // Filter to approver's department (faculty approves messages from their dept students)
  return (data ?? []).filter((msg: any) => {
    if (!approver?.department) return true
    return msg.sender?.department === approver.department
  })
}

// ─── Fetch conversation messages between two users ────────────────────────────
export async function getConversation(userId: string, contactId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:users!sender_id(id,name,role,avatar_color)')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

// ─── Mark messages as read ────────────────────────────────────────────────────
export async function markAsRead(userId: string, senderId: string) {
  const supabase = createClient()

  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('receiver_id', userId)
    .eq('sender_id', senderId)
    .eq('is_read', false)
}

// ─── Escalate stale pending_faculty messages (>24h) ──────────────────────────
export async function escalateStalePendingMessages() {
  const supabase = createClient()
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase
    .from('messages')
    .update({
      status: 'escalated',
      escalated_at: new Date().toISOString(),
    })
    .eq('status', 'pending_faculty')
    .lt('created_at', cutoff)

  if (error) console.error('Escalation error:', error)
}

// ─── Get unread counts per contact ───────────────────────────────────────────
export async function getUnreadCounts(userId: string): Promise<Record<string, number>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('sender_id')
    .eq('receiver_id', userId)
    .eq('is_read', false)
    .eq('status', 'delivered')

  if (error) return {}

  const counts: Record<string, number> = {}
  for (const msg of data ?? []) {
    counts[msg.sender_id] = (counts[msg.sender_id] ?? 0) + 1
  }
  return counts
}

// ─── Subscribe to new messages (real-time) ────────────────────────────────────
export function subscribeToMessages(
  userId: string,
  onNew: (msg: unknown) => void,
  onUpdate: (msg: unknown) => void
) {
  const supabase = createClient()
  const channelName = `messages-realtime:${userId}:${Math.random().toString(36).substring(7)}`

  return supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` },
      (payload) => onNew(payload.new)
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${userId}` },
      (payload) => onNew(payload.new)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'messages', filter: `sender_id=eq.${userId}` },
      (payload) => onUpdate(payload.new)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` },
      (payload) => onUpdate(payload.new)
    )
    .subscribe()
}
