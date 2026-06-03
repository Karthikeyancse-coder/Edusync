export type Role = 'principal' | 'hod' | 'faculty' | 'student'

export type MessageStatus =
  | 'sent' | 'pending_faculty' | 'pending_hod'
  | 'approved' | 'rejected' | 'delivered'

export type GroupType = 'faculty_group' | 'student_group'

export interface User {
  id: string
  unique_id: string
  name: string
  email?: string
  phone?: string
  role: Role
  department?: string
  is_active: boolean
  avatar_color: string
  created_at: string
}

export interface Department {
  id: string
  name: string
  code: string
  hod_id?: string
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id?: string
  group_id?: string
  content: string
  status: MessageStatus
  via_faculty_id?: string
  via_hod_id?: string
  is_locked: boolean
  rejection_reason?: string
  is_read: boolean
  created_at: string
  sender?: User
  receiver?: User
}

export interface Group {
  id: string
  name: string
  department?: string
  created_by: string
  type: GroupType
  principal_auto_added: boolean
  hod_auto_added: boolean
  created_at: string
  members?: GroupMember[]
  last_message?: Message
  unread_count?: number
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role_in_group: 'admin' | 'member'
  joined_at: string
  user?: User
}

export interface Announcement {
  id: string
  created_by: string
  title: string
  content: string
  target_role?: string
  target_department?: string
  total_targets: number
  created_at: string
  creator?: User
  ack_count?: number
  user_acknowledged?: boolean
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body?: string
  is_read: boolean
  related_id?: string
  created_at: string
}

export interface AuditLog {
  id: string
  action: string
  performed_by: string
  target_user_id?: string
  details?: Record<string, unknown>
  created_at: string
  performer?: User
  target?: User
}
