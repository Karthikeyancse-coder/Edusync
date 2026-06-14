import { 
  LayoutDashboard, MessageSquare, Users, BookOpen, BookMarked, 
  Search, Bell, UserCircle, ClipboardList, CheckSquare, 
  BarChart2, CheckCircle, Calendar, Shield, BookCheck, Megaphone
} from 'lucide-react'
import { Role } from '@/types'

export type NavItem = {
  icon: React.ElementType
  label: string
  href: string
  badge?: number
}

export const getNavItems = (role: Role | null): NavItem[] => {
  if (role === 'student') return [
    { icon: LayoutDashboard, label: 'Dashboard',     href: '/dashboard' },
    { icon: MessageSquare,   label: 'Messages',      href: '/messages' },
    { icon: Users,           label: 'Groups',        href: '/groups' },
    { icon: ClipboardList,   label: 'Assignments',   href: '/assignments' },
    { icon: BarChart2,       label: 'Marks',         href: '/marks' },
    { icon: Calendar,        label: 'Timetable',     href: '/timetable' },
    { icon: Megaphone,       label: 'Announcements', href: '/announcements' },
    { icon: Users,           label: 'Directory',     href: '/directory' },
    { icon: Search,          label: 'Search',        href: '/search' },
    { icon: UserCircle,      label: 'Profile',       href: '/profile' },
  ]

  if (role === 'faculty') return [
    { icon: LayoutDashboard, label: 'Dashboard',     href: '/dashboard' },
    { icon: MessageSquare,   label: 'Messages',      href: '/messages' },
    { icon: Users,           label: 'Groups',        href: '/groups' },
    { icon: ClipboardList,   label: 'Assignments',   href: '/assignments' },
    { icon: BarChart2,       label: 'Marks',         href: '/marks' },
    { icon: BookCheck,       label: 'Attendance',    href: '/attendance' },
    { icon: CheckCircle,     label: 'Approvals',     href: '/approvals' },
    { icon: Calendar,        label: 'Timetable',     href: '/timetable' },
    { icon: Megaphone,       label: 'Announcements', href: '/announcements' },
    { icon: Users,           label: 'Directory',     href: '/directory' },
    { icon: Search,          label: 'Search',        href: '/search' },
    { icon: UserCircle,      label: 'Profile',       href: '/profile' },
  ]

  if (role === 'hod') return [
    { icon: LayoutDashboard, label: 'Dashboard',     href: '/dashboard' },
    { icon: MessageSquare,   label: 'Messages',      href: '/messages' },
    { icon: Users,           label: 'Groups',        href: '/groups' },
    { icon: CheckCircle,     label: 'Approvals',     href: '/approvals', badge: 28 },
    { icon: BookCheck,       label: 'Attendance',    href: '/attendance' },
    { icon: BarChart2,       label: 'Marks',         href: '/marks' },
    { icon: Calendar,        label: 'Timetable',     href: '/timetable' },
    { icon: Megaphone,       label: 'Announcements', href: '/announcements' },
    { icon: Users,           label: 'Directory',     href: '/directory' },
    { icon: Search,          label: 'Search',        href: '/search' },
    { icon: UserCircle,      label: 'Profile',       href: '/profile' },
  ]

  if (role === 'principal') return [
    { icon: LayoutDashboard, label: 'Dashboard',     href: '/dashboard' },
    { icon: MessageSquare,   label: 'Messages',      href: '/messages' },
    { icon: Users,           label: 'Groups',        href: '/groups' },
    { icon: BookCheck,       label: 'Attendance Performance', href: '/attendance' },
    { icon: BarChart2,       label: 'Marks',         href: '/marks' },
    { icon: Calendar,        label: 'Timetable',     href: '/timetable' },
    { icon: Megaphone,       label: 'Announcements', href: '/announcements' },
    { icon: Users,           label: 'Directory',     href: '/directory' },
    { icon: Search,          label: 'Search',        href: '/search' },
    { icon: UserCircle,      label: 'Profile',       href: '/profile' },
    { icon: Shield,          label: 'Admin',         href: '/admin' },
  ]

  return []
}
