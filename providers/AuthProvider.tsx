'use client'

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
  demoLogin: (role: Role) => void
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
      const demoRole = typeof window !== 'undefined' ? sessionStorage.getItem('demo_role') : null
      if (demoRole && mounted) {
        setProfile({
          id: 'demo-123',
          unique_id: `DEMO-${demoRole.toUpperCase()}`,
          name: `Demo ${demoRole}`,
          role: demoRole as Role,
          department: 'Computer Science',
          is_active: true,
          avatar_color: '#7C6FFF',
          created_at: new Date().toISOString()
        } as User)
        setUser({ id: 'demo-123', email: `demo@edusync.edu` } as SupabaseUser)
        setIsLoading(false)
        return
      }

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
        }
        setIsLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null)
          if (session?.user) {
            fetchProfile(session.user.id)
          } else {
            setProfile(null)
            setIsLoading(false)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    sessionStorage.removeItem('demo_role')
    await supabase.auth.signOut()
    router.push('/login')
  }

  const demoLogin = (role: Role) => {
    sessionStorage.setItem('demo_role', role)
    setProfile({
      id: 'demo-123',
      unique_id: `DEMO-${role.toUpperCase()}`,
      name: `Demo ${role}`,
      role: role,
      department: 'Computer Science',
      is_active: true,
      avatar_color: '#7C6FFF',
      created_at: new Date().toISOString()
    } as User)
    setUser({ id: 'demo-123', email: `demo@edusync.edu` } as SupabaseUser)
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
