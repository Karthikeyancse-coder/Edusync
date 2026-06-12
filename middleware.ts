import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Create Supabase client
  let response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(),
      setAll: (c) => c.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const demoRole = request.cookies.get('demo_role')?.value

  // Not authenticated → redirect to login
  if (!user && !demoRole && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Authenticated + on login → redirect to dashboard
  if ((user || demoRole) && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // /admin → principal only
  if (pathname.startsWith('/admin')) {
    if (demoRole) {
      if (demoRole !== 'principal') return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      const { data: profile } = await supabase
        .from('users').select('role').eq('id', user?.id).single()
      if (profile?.role !== 'principal') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  // /approvals → faculty and hod only (not student or principal)
  if (pathname.startsWith('/approvals')) {
    if (demoRole) {
      if (demoRole === 'student' || demoRole === 'principal') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } else if (user) {
      const { data: profile } = await supabase
        .from('users').select('role').eq('id', user?.id).single()
      if (profile?.role === 'student' || profile?.role === 'principal') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
