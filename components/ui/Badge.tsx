import React from 'react'
import { cn, getRoleColor } from '@/lib/utils'
import type { Role } from '@/types'
import { Crown, Shield, BookOpen, GraduationCap, Clock, Check, X } from 'lucide-react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: 'role' | 'status' | 'count' | 'success' | 'warning' | 'default'
  role?: Role
  status?: 'pending' | 'approved' | 'rejected'
  count?: number
  className?: string
}

export function Badge({ variant, role, status, count, className, children, ...props }: BadgeProps) {
  if (variant === 'role' && role) {
    const RoleIcon = {
      principal: Crown,
      hod: Shield,
      faculty: BookOpen,
      student: GraduationCap,
    }[role]
    
    return (
      <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-white", className)} style={{ backgroundColor: getRoleColor(role) }} {...props}>
        <RoleIcon size={12} />
        <span className="capitalize">{role}</span>
      </span>
    )
  }

  if (variant === 'status' && status) {
    const config = {
      pending: { icon: Clock, className: 'bg-warning/20 text-warning border border-warning/50', label: 'Pending' },
      approved: { icon: Check, className: 'bg-success/20 text-success border border-success/50', label: 'Approved' },
      rejected: { icon: X, className: 'bg-error/20 text-error border border-error/50', label: 'Rejected' },
    }[status]
    
    const StatusIcon = config.icon
    
    return (
      <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium", config.className, className)} {...props}>
        <StatusIcon size={12} />
        <span>{config.label}</span>
      </span>
    )
  }

  if (variant === 'count' && count !== undefined) {
    if (count === 0) return null
    return (
      <span className={cn("inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 bg-[var(--error)] text-white text-[11px] font-bold rounded-full", className)} {...props}>
        {count > 99 ? '99+' : count}
      </span>
    )
  }

  const variantStyles = {
    success: "px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    default: "px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  }

  if (variant === 'success' || variant === 'warning' || variant === 'default') {
    return (
      <span className={cn("inline-flex items-center", variantStyles[variant], className)} {...props}>
        {children}
      </span>
    )
  }

  return null
}
