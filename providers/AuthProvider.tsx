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

  // Stable UUIDs that match db/seed.sql demo users
  const DEMO_IDS: Record<string, string> = {
    student:   '11111111-1111-1111-1111-111111111111',
    faculty:   '22222222-2222-2222-2222-222222222222',
    hod:       '33333333-3333-3333-3333-333333333333',
    principal: '44444444-4444-4444-4444-444444444444',
  }

  const DEMO_PROFILES: Record<string, { name: string; unique_id: string; department: string; role: Role; avatar_color: string }> = {
    student:   { name: 'Aarav Shah',        unique_id: 'STU-CSE-2024-001', department: 'Computer Science', role: 'student',   avatar_color: '#7C6FFF' },
    faculty:   { name: 'Dr. Sarah Jenkins', unique_id: 'FAC-CSE-001',      department: 'Computer Science', role: 'faculty',   avatar_color: '#00D4AA' },
    hod:       { name: 'Prof. Alan Turing', unique_id: 'HOD-CSE-001',      department: 'Computer Science', role: 'hod',       avatar_color: '#FFB800' },
    principal: { name: 'Admin Principal',   unique_id: 'PRIN-001',         department: 'Administration',   role: 'principal', avatar_color: '#FF4D6D' },
  }

  useEffect(() => {
    let mounted = true

    // Helper — build a full demo profile from cookie role
    function buildDemoProfile(demoRole: string): User {
      const demo = DEMO_PROFILES[demoRole]
      return {
        id: DEMO_IDS[demoRole] ?? 'demo-fallback',
        unique_id: demo?.unique_id ?? `DEMO-${demoRole.toUpperCase()}`,
        name: demo?.name ?? `Demo ${demoRole}`,
        role: (demo?.role ?? demoRole) as Role,
        department: demo?.department ?? 'Computer Science',
        is_cr: false,
        is_active: true,
        avatar_color: demo?.avatar_color ?? '#7C6FFF',
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
      id: DEMO_IDS[role],
      unique_id: demo.unique_id,
      name: demo.name,
      role: role,
      department: demo.department,
      is_cr: false,
      is_active: true,
      avatar_color: demo.avatar_color,
      created_at: new Date().toISOString()
    } as User)
    setUser({ id: DEMO_IDS[role], email: `${role}@edusync.edu` } as SupabaseUser)
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
