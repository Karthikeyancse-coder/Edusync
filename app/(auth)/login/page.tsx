'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Hash, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { login, loginWithOAuth } from '@/lib/auth'
import { Iridescence } from '@/components/ui/Iridescence'

export default function LoginPage() {
  const router = useRouter()
  const [uniqueId, setUniqueId] = useState('PRIN-001') // Default for dev
  const [password, setPassword] = useState('password123') // Default for dev
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
    <div className="relative min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      {/* Ambient Full-Screen Background with Glassic Blur */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Iridescence color={[0.48, 0.43, 1.0]} speed={0.4} amplitude={0.05} mouseReact={false} />
        <div className="absolute inset-0 backdrop-blur-[100px] bg-white/40 dark:bg-[#0A0A0F]/70" />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-[900px] flex flex-col md:flex-row bg-white/60 dark:bg-[#13131A]/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl shadow-[0_16px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_16px_40px_rgb(0,0,0,0.4)] overflow-hidden"
      >
        {/* Left Side: Login Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center max-w-[420px] w-full mx-auto">
          <motion.div
            animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
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
              Welcome back! Please enter your details.
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

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-default"></div>
              <span className="px-3 text-[11px] text-muted uppercase tracking-wider font-medium">or continue with</span>
              <div className="flex-1 border-t border-default"></div>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                type="button" 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2 bg-surface2/50 border-default hover:bg-surface2 text-primary-color"
                onClick={() => loginWithOAuth('google')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Google
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2 bg-surface2/50 border-default hover:bg-surface2 text-primary-color"
                onClick={() => loginWithOAuth('azure')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width="18" height="18">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                Microsoft
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-[12px] text-muted">
                Forgot your ID? Contact your administrator
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Iridescence Animation */}
        <div className="hidden md:flex flex-1 relative flex-col items-center justify-center p-12 text-center overflow-hidden border-l border-white/30 dark:border-white/5">
          {/* The Iridescence canvas fills this absolute container */}
          <div className="absolute inset-0 opacity-100 dark:opacity-80">
            <Iridescence 
              color={[0.48, 0.43, 1.0]} 
              speed={0.8} 
              amplitude={0.2} 
              mouseReact={false} 
            />
          </div>
          
          {/* Overlay text on top of animation */}
          <div className="relative z-10 p-8 rounded-2xl bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/10 mt-auto mb-10 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-md">College Communication</h2>
            <p className="text-white/90 text-sm leading-relaxed drop-shadow-sm">
              Connect effortlessly with faculty, departments, and students.
              Real-time messaging, announcements, and group discussions all in one place.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
