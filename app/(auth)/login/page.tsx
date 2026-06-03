'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Hash, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [uniqueId, setUniqueId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uniqueId || !password) {
      setError('Please enter both ID and password')
      return
    }

    setIsLoading(true)
    setError('')

    const { profile, error: loginError } = await login(uniqueId, password)

    if (loginError) {
      setError(loginError)
      setIsLoading(false)
      return
    }

    if (profile) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0F] via-[#13131A] to-[#0A0A2E]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary)] opacity-20 rounded-full blur-[120px]" />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-[380px] mx-4"
      >
        <motion.div
          animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-white/5 dark:bg-surface/50 backdrop-blur-xl border border-white/10 dark:border-border-default rounded-card shadow-modal p-8"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex justify-center mb-2"
          >
            <Logo size="lg" />
          </motion.div>
          
          <p className="text-sm text-muted text-center mb-8">
            College Communication Platform
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                placeholder="e.g. FAC-CSE-001"
                icon={<Hash size={18} />}
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                error={error && !uniqueId ? ' ' : undefined}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                icon={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error && !password ? ' ' : undefined}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted hover:text-primary-color transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-[var(--error)] text-sm bg-[var(--error)]/10 p-3 rounded-input"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-2"
            >
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={isLoading}
              >
                {!isLoading && (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[12px] text-muted">
              Forgot your ID? Contact your administrator
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
