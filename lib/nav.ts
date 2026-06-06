import { 
  LayoutDashboard, MessageSquare, Users, BookOpen, BookMarked, 
  Search, Bell, UserCircle, ClipboardList, CheckSquare, 
  BarChart2, CheckCircle, Calendar, Shield
} from 'lucide-react'
import { Role } from '@/types'

export type NavItem = {
  icon: React.ElementType
  label: string
  href: string
  badge?: number
}

// Common bottom items shared across all roles
const commonBottom: NavItem[] = [
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Bell, label: 'Notices', href: '/announcements' },
  { icon: UserCircle, label: 'Profile', href: '/profile' },
]

export const getNavItems = (role: Role | null): NavItem[] => {
  if (role === 'student') return [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: Users, label: 'Groups', href: '/groups' },
    { icon: ClipboardList, label: 'Assignments', href: '/assignments' },
    { icon: BarChart2, label: 'Marks', href: '/marks' },
    { icon: CheckSquare, label: 'Attendance', href: '/attendance' },
    { icon: Calendar, label: 'Timetable', href: '/timetable' },
    { icon: Users, label: 'Directory', href: '/directory' },
    ...commonBottom,
  ]

  if (role === 'faculty') return [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: Users, label: 'Groups', href: '/groups' },
    { icon: ClipboardList, label: 'Assignments', href: '/assignments' },
    { icon: CheckSquare, label: 'Attendance', href: '/attendance' },
    { icon: BarChart2, label: 'Marks', href: '/marks' },
    { icon: CheckCircle, label: 'Approvals', href: '/approvals' },
    { icon: Calendar, label: 'Timetable', href: '/timetable' },
    { icon: Users, label: 'Directory', href: '/directory' },
    ...commonBottom,
  ]

  if (role === 'hod') return [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: Users, label: 'Groups', href: '/groups' },
    { icon: CheckCircle, label: 'Approvals', href: '/approvals', badge: 28 },
    { icon: CheckSquare, label: 'Attendance', href: '/attendance' },
    { icon: BarChart2, label: 'Marks', href: '/marks' },
    { icon: Calendar, label: 'Timetable', href: '/timetable' },
    { icon: Users, label: 'Directory', href: '/directory' },
    ...commonBottom,
  ]

  if (role === 'principal') return [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: Users, label: 'Groups', href: '/groups' },
    { icon: CheckSquare, label: 'Attendance', href: '/attendance' },
    { icon: BarChart2, label: 'Marks', href: '/marks' },
    { icon: Calendar, label: 'Timetable', href: '/timetable' },
    { icon: Users, label: 'Directory', href: '/directory' },
    ...commonBottom,
    { icon: Shield, label: 'Admin', href: '/admin' },
  ]

  return []
}
