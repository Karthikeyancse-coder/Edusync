const fs = require('fs');

let content = fs.readFileSync('providers/AuthProvider.tsx', 'utf8');

const newContent = `'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { User, Role } from '@/types'

interface AuthContextType {
  user: SupabaseUser | null
  profile: User | null
  role: Role | null
  department: string | null
  isLoading: boolean
  signOut: () => Promise<void>
  demoLogin: (role: Role) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    async function getSession() {
      // Clear any legacy demo cookie to avoid confusion
      document.cookie = 'demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

      const { data: { session } } = await supabase.auth.getSession()
      if (mounted) {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setIsLoading(false)
        }
      }
    }

    async function fetchProfile(userId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (mounted) {
        if (!error && data) {
          setProfile(data as User)
        } else {
           console.error("Failed to fetch profile:", error)
        }
        setIsLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setIsLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    document.cookie = 'demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    await supabase.auth.signOut()
    router.push('/login')
  }

  const demoLogin = async (role: Role) => {
    setIsLoading(true)
    const email = \`\${role}@edusync.edu\`
    const password = 'password123'
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error("Demo login failed:", error)
      alert("Failed to login to demo user. Please try again.")
      setIsLoading(false)
      return
    }
    
    // onAuthStateChange handles state update
    router.push('/dashboard')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role ?? null,
        department: profile?.department ?? null,
        isLoading,
        signOut,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
`;

fs.writeFileSync('providers/AuthProvider.tsx', newContent, 'utf8');
console.log('Rewrote AuthProvider.tsx to use real Supabase Auth');
