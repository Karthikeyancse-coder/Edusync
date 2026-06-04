'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, icon, className, children, disabled, ...props }, ref) => {
    
    const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-btn"
    
    const variants = {
      primary: "bg-[var(--primary)] text-white shadow-btn-primary hover:brightness-110",
      secondary: "bg-transparent border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-glow)]",
      ghost: "bg-transparent text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
      danger: "bg-[var(--error)] text-white hover:brightness-110 shadow-btn-primary",
      outline: "bg-transparent border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
    }
    
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base",
      icon: "h-10 w-10 p-0 flex items-center justify-center rounded-full",
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : icon}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'
