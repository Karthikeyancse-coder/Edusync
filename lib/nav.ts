import { 
  LayoutDashboard, MessageSquare, Users, BookOpen, BookMarked, 
  Search, Bell, UserCircle, ClipboardList, CheckSquare, 
  BarChart2, CheckCircle, Calendar, Shield 
} from 'lucide-react'
import { Role } from '@/types'

export const getNavItems = (role: Role | null) => {
  const commonBottom = [
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Bell, label: 'Notices', href: '/announcements' },
    { icon: UserCircle, label: 'Profile', href: '/profile' }
  ]

  if (role === 'student') return [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Chat', href: '/messages' },
    { icon: Users, label: 'Groups', href: '/groups' },
    { icon: BookOpen, label: 'Tasks', href: '/assignments' },
    { icon: BookMarked, label: 'Marks', href: '/marks' },
    ...commonBottom
  ]

  if (role === 'faculty') return [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Chat', href: '/messages' },
    { icon: Users, label: 'Groups', href: '/groups' },
    { icon: ClipboardList, label: 'Tasks', href: '/assignments' },
    { icon: CheckSquare, label: 'Attd', href: '/attendance' },
    { icon: BarChart2, label: 'Marks', href: '/marks' },
    { icon: CheckCircle, label: 'Appr', href: '/approvals' },
    { icon: Calendar, label: 'Time', href: '/timetable' },
    ...commonBottom
  ]

  if (role === 'hod') return [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Chat', href: '/messages' },
    { icon: Users, label: 'Groups', href: '/groups' },
    { icon: CheckCircle, label: 'Appr', href: '/approvals' },
    { icon: CheckSquare, label: 'Attd', href: '/attendance' },
    { icon: BarChart2, label: 'Marks', href: '/marks' },
    ...commonBottom
  ]

  if (role === 'principal') return [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Chat', href: '/messages' },
    { icon: Users, label: 'Groups', href: '/groups' },
    { icon: CheckSquare, label: 'Attd', href: '/attendance' },
    { icon: BarChart2, label: 'Marks', href: '/marks' },
    { icon: Calendar, label: 'Time', href: '/timetable' },
    ...commonBottom,
    { icon: Shield, label: 'Admin', href: '/admin' }
  ]

  return []
}
