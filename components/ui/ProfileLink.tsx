import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'

interface ProfileLinkProps {
  uniqueId: string
  children: React.ReactNode
  className?: string
}

export function ProfileLink({ uniqueId, children, className }: ProfileLinkProps) {
  return (
    <Link href={`/profile/${uniqueId}`} className={cn("inline-block hover:opacity-80 transition-opacity", className)}>
      {children}
    </Link>
  )
}
