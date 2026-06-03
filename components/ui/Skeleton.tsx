import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  circle?: boolean
}

export function Skeleton({ width, height, className, circle }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "shimmer-bg rounded-md", 
        circle && "rounded-full",
        className
      )}
      style={{ 
        width: width || '100%', 
        height: height || '100%',
        minHeight: height ? undefined : '1rem'
      }}
    />
  )
}
