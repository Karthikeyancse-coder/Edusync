import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  rightElement?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && <label className="text-sm font-medium text-primary-color">{label}</label>}
        
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-muted">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              "w-full h-11 bg-surface2 border-default border rounded-input px-4 text-sm text-primary-color placeholder:text-muted transition-all",
              "focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]",
              icon && "pl-10",
              rightElement && "pr-12",
              error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]",
              className
            )}
            {...props}
          />
          
          {rightElement && (
            <div className="absolute right-3">
              {rightElement}
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-1.5 text-[var(--error)] text-xs mt-1"
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)
Input.displayName = 'Input'
