import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Allow pass-through if Supabase isn't configured (for UI dev)
  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 1. ADMIN PROTECTION (Strict RBAC)
  if (path.startsWith('/admin')) {
    // Allow access to the login page itself
    if (path === '/admin/login') {
      // If already logged in as admin, redirect to command center
      if (user) {
        const role = user.app_metadata?.role;
        if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
      }
      return supabaseResponse
    }

    // For all other /admin routes, require auth + ADMIN role
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Check Supabase App Metadata for Admin Role (Set this in Supabase Dashboard)
    const role = user.app_metadata?.role;
    if (role !== 'ADMIN') {
      // Intruder detected! Kick them back to the customer site.
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 2. CUSTOMER & RIDER PROTECTION
  if (path.startsWith('/dashboard') || path.startsWith('/book') || path.startsWith('/rider')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
