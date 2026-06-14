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

  const DEMO_PROFILES: Record<string, { name: string; unique_id: string; department: string; role: Role }> = {
    student:   { name: 'Aarav Shah',        unique_id: 'STU-CSE-2024-001', department: 'Computer Science', role: 'student' },
    faculty:   { name: 'Dr. Sarah Jenkins', unique_id: 'FAC-CSE-001',      department: 'Mathematics',      role: 'faculty' },
    hod:       { name: 'Prof. Alan Turing', unique_id: 'HOD-CSE-001',      department: 'Computer Science', role: 'hod' },
    principal: { name: 'Admin Principal',   unique_id: 'PRIN-001',         department: 'Administration',   role: 'principal' },
  }

  useEffect(() => {
    let mounted = true

    // Helper — build a full demo profile from cookie role
    function buildDemoProfile(demoRole: string): User {
      const demo = DEMO_PROFILES[demoRole]
      return {
        id: 'demo-123',
        unique_id: demo?.unique_id ?? `DEMO-${demoRole.toUpperCase()}`,
        name: demo?.name ?? `Demo ${demoRole}`,
        role: (demo?.role ?? demoRole) as Role,
        department: demo?.department ?? 'Computer Science',
        is_active: true,
        avatar_color: '#7C6FFF',
        created_at: new Date().toISOString(),
      } as User
    }

    async function getSession() {
      // Check for demo role in cookies first
      const match = document.cookie.match(new RegExp('(^| )demo_role=([^;]+)'))
      const demoRole = match ? match[2] : null

      if (demoRole && mounted) {
        // Restore the full demo profile on refresh
        setProfile(buildDemoProfile(demoRole))
        setUser({ id: 'demo-123', email: `${demoRole}@edusync.edu` } as SupabaseUser)
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
        if (!mounted) return
        // Skip if this is a demo session — don't overwrite the demo profile
        const isDemoSession = document.cookie.includes('demo_role=')
        if (isDemoSession) return

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

  const demoLogin = (role: Role) => {
    const demo = DEMO_PROFILES[role]
    document.cookie = `demo_role=${role}; path=/`
    setProfile({
      id: 'demo-123',
      unique_id: demo.unique_id,
      name: demo.name,
      role: role,
      department: demo.department,
      is_active: true,
      avatar_color: '#7C6FFF',
      created_at: new Date().toISOString()
    } as User)
    setUser({ id: 'demo-123', email: `${role}@edusync.edu` } as SupabaseUser)
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
