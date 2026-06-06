export type Role = 'principal' | 'hod' | 'faculty' | 'student'
export type MessageStatus = 'sent' | 'pending_faculty' | 'pending_hod' | 'approved' | 'rejected' | 'delivered' | 'escalated'
export type GroupType = 'faculty_group' | 'student_group'
export type FileType = 'pdf' | 'image' | 'word' | 'ppt' | 'video'
export type AttendanceStatus = 'present' | 'absent' | 'late'
export type ExamType = 'unit_test_1' | 'unit_test_2' | 'unit_test_3' | 'mid_semester' | 'final' | 'practical' | 'assignment' | 'internal' | 'attendance_marks'
export type SubmissionType = 'download_only' | 'upload_required' | 'both'
export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

export interface User {
  id: string
  unique_id: string
  name: string
  email?: string
  phone?: string
  role: Role
  department?: string
  year?: string
  section?: string
  batch?: string
  is_cr: boolean
  cr_class?: string
  is_active: boolean
  avatar_color: string
  last_active_at?: string
  deputy_approver_id?: string
  created_at: string
}

export interface FacultySubject {
  id: string
  faculty_id: string
  subject_name: string
  department_code: string
}

export interface Department {
  id: string
  name: string
  code: string
  hod_id?: string
  created_at: string
}

export interface TimetableSlot {
  id: string
  faculty_id: string
  subject_name: string
  department: string
  year: string
  section: string
  day: Day
  start_time: string
  end_time: string
  room?: string
  created_at: string
  faculty?: User
}

export interface AttendanceRecord {
  id: string
  faculty_id: string
  student_id: string
  subject_name: string
  department: string
  date: string
  status: AttendanceStatus
  marked_at: string
  student?: User
}

export interface AttendanceSummary {
  subject_name: string
  total: number
  present: number
  absent: number
  late: number
  percentage: number
  is_at_risk: boolean
}

export interface Mark {
  id: string
  faculty_id: string
  student_id: string
  subject_name: string
  department: string
  exam_type: ExamType
  marks_obtained: number
  max_marks: number
  is_published: boolean
  remarks?: string
  created_at: string
  student?: User
}

export interface Assignment {
  id: string
  faculty_id: string
  subject_name: string
  department: string
  year: string
  section?: string
  batch?: string
  title: string
  description?: string
  due_date: string
  submission_type: SubmissionType
  file_url?: string
  file_name?: string
  is_published: boolean
  max_marks?: number
  created_at: string
  faculty?: User
  submission?: AssignmentSubmission
  submission_count?: number
}

export interface AssignmentSubmission {
  id: string
  assignment_id: string
  student_id: string
  file_url?: string
  file_name?: string
  submitted_at: string
  marks_given?: number
  feedback?: string
  status: 'submitted' | 'graded' | 'late'
  student?: User
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
  is_cross_dept: boolean
  escalated_at?: string
  created_at: string
  sender?: User
  receiver?: User
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  message_id: string
  file_name: string
  file_type: FileType
  file_size: number
  file_url: string
  uploaded_by: string
  created_at: string
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
