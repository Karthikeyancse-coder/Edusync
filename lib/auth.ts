import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

export async function login(uniqueId: string, password: string): Promise<{ profile: User | null; error: string | null }> {
  const supabase = createClient()
  
  // Find user by unique_id to get the email (since Supabase auth uses email by default)
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('email, id, role, is_active')
    .eq('unique_id', uniqueId)
    .single()
    
  if (userError || !users) {
    return { profile: null, error: 'Invalid ID or password' }
  }

  if (!users.is_active) {
    return { profile: null, error: 'Your account has been deactivated. Contact admin.' }
  }
  
  // If no email exists, we cannot use signInWithPassword. Usually email is required.
  // In a real app with pure Unique ID auth, you might need a custom auth provider or 
  // you map uniqueId to a predictable email internally (e.g. uniqueId@edusync.edu).
  // For this implementation, we assume the database has an email for the user.
  const emailToUse = users.email || `${uniqueId.toLowerCase()}@edusync.edu`

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: emailToUse,
    password: password,
  })

  if (authError) {
    // Check for rate limit / lock
    if (authError.message.includes('too many requests')) {
      return { profile: null, error: 'Account temporarily locked. Try again in 10 minutes.' }
    }
    return { profile: null, error: 'Invalid ID or password' }
  }

  // Fetch complete profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !profile) {
    return { profile: null, error: 'Error loading profile' }
  }

  return { profile: profile as User, error: null }
}
