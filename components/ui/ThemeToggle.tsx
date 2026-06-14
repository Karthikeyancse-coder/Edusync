'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  // eslint-disable-next-line
  React.useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />

  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none overflow-hidden"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDark ? 0 : 90, 
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0 
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon size={18} />
      </motion.div>

      <motion.div
        initial={false}
        animate={{ 
          rotate: isDark ? -90 : 0, 
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1 
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="relative flex items-center justify-center"
      >
        <Sun size={18} />
      </motion.div>
    </button>
  )
}
