'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* 404 Number and Pikachu */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
          className="relative mb-6 flex flex-col items-center"
        >
          <div className="w-48 h-48 mb-2 rounded-2xl overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
            <img 
              src="/pikachu.gif" 
              alt="Lost Pikachu"
              className="w-32 h-32 object-contain rendering-pixelated drop-shadow-md"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="text-[80px] font-black leading-none tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">4</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">0</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">4</span>
          </div>
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-indigo-400/10 blur-3xl rounded-full -z-10" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-2xl font-bold text-slate-900 dark:text-white mb-3"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8"
        >
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. 
          Check the URL or head back to where you came from.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft size={16} /> Go Back
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Home size={16} /> Go to Dashboard
          </Button>
          <Button
            onClick={() => router.push('/search')}
            variant="ghost"
            className="gap-2"
          >
            <Search size={16} /> Search
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
