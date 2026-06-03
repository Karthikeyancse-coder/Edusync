import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Role } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUniqueId(
  role: Role,
  dept: string,
  count: number
): string {
  const deptCode = dept?.toUpperCase().slice(0, 3) || 'GEN'
  const year = new Date().getFullYear()
  const num = String(count).padStart(3, '0')
  switch (role) {
    case 'principal': return `PRIN-${num}`
    case 'hod':       return `HOD-${deptCode}-${num}`
    case 'faculty':   return `FAC-${deptCode}-${num}`
    case 'student':   return `STU-${deptCode}-${year}-${num}`
  }
}

export function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function getRoleColor(role: Role): string {
  const map: Record<Role, string> = {
    principal: '#FF4D6D',
    hod: '#FFB800',
    faculty: '#00D4AA',
    student: '#7C6FFF',
  }
  return map[role]
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function formatChatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    sent: 'Sent',
    pending_faculty: 'Waiting Faculty Approval',
    pending_hod: 'Waiting HOD Approval',
    approved: 'Approved',
    rejected: 'Rejected',
    delivered: 'Delivered',
  }
  return map[status] || status
}
