import React from 'react'
import { cn, getInitials, getRoleColor } from '@/lib/utils'
import type { Role } from '@/types'
import { Crown, Shield, BookOpen, GraduationCap } from 'lucide-react'

interface AvatarProps {
  name: string
  role: Role
  size?: 'sm' | 'md' | 'lg' | 'xl'
  online?: boolean
  showRoleBadge?: boolean
  className?: string
}

export function Avatar({ name, role, size = 'md', online = false, showRoleBadge = false, className }: AvatarProps) {
  const initials = getInitials(name)
  const bgColor = getRoleColor(role)
  
  const sizeClasses = {
    sm: 'w-[28px] h-[28px] text-[11px]',
    md: 'w-[40px] h-[40px] text-sm',
    lg: 'w-[56px] h-[56px] text-lg',
    xl: 'w-[80px] h-[80px] text-2xl',
  }

  const RoleIcon = {
    principal: Crown,
    hod: Shield,
    faculty: BookOpen,
    student: GraduationCap,
  }[role]

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <div 
        className={cn("relative flex items-center justify-center rounded-full text-white font-medium", sizeClasses[size])}
        style={{ backgroundColor: bgColor }}
      >
        {initials}
        
        {online && (
          <span className="absolute bottom-0 right-0 w-[25%] h-[25%] min-w-[8px] min-h-[8px] bg-success border-2 border-surface rounded-full animate-pulse-dot" />
        )}
      </div>
      
      {showRoleBadge && (
        <div 
          className="absolute -bottom-2 bg-surface border-default border rounded-full p-0.5"
          style={{ color: bgColor }}
        >
          <RoleIcon size={12} />
        </div>
      )}
    </div>
  )
}
