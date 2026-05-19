import os

files = {
    "src/app/admin/login/page.tsx": """"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // In a real app, this calls a Next.js Server Action that:
    // 1. Signs in via Supabase Auth
    // 2. Queries Neon/Prisma to verify profile.role === 'ADMIN'
    // 3. If not admin, signs them out immediately and blocks access.
    
    // Mock routing for UI demonstration:
    if (email && password) {
      router.push('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/90"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">Admin Console</h1>
            <p className="text-gray-400 text-sm mt-1">Restricted Access</p>
          </div>

          <form onSubmit={handleAdminLogin} className="bg-midnight-800/80 backdrop-blur-md p-6 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
            {error && <div className="bg-red-900/30 text-red-400 text-sm text-center p-3 rounded-lg">{error}</div>}
            <div>
              <label className="text-sm font-semibold text-gray-400 block mb-2">Admin Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@taskit.co.ke"
                className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-red-500 transition-colors placeholder:text-midnight-600"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400 block mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-red-500 transition-colors placeholder:text-midnight-600"
              />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-500 transition-colors active:scale-[0.98]">
              Secure Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">&larr; Back to Website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
""",
    "src/middleware.ts": """import { createServerClient } from '@supabase/ssr'
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
""",
    "src/app/page.tsx": """import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative flex flex-col">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/80 via-midnight-950/85 to-midnight-950"></div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 max-w-lg mx-auto w-full px-6 pt-16 pb-32">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gold-500 rounded-2xl flex items-center justify-center shadow-gold mb-6 mx-auto">
            <svg className="w-10 h-10 text-midnight-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-serif font-bold text-white tracking-tight">TaskIt</h1>
          <p className="text-gold-500 mt-2 text-lg font-semibold uppercase tracking-widest">Nairobi Errands</p>
          <p className="text-gray-300 mt-6 text-lg leading-relaxed max-w-xs mx-auto">
            We run your errands, so you don't have to. Fast, reliable, and seamless.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-white text-center mb-6">Why Choose TaskIt?</h2>
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Flat-Rate Zone Pricing</h3>
                <p className="text-gray-300 text-sm mt-1">No hidden fees. Know exactly what you pay before you book.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact / About with HIDDEN ADMIN LINK */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-300 text-sm mb-2">Have questions or a corporate inquiry?</p>
          <a href="tel:0707075630" className="text-gold-500 font-semibold hover:underline text-lg">0707 075 630</a>
          {/* THE HIDDEN ADMIN LINK - Disguised as the copyright text */}
          <p className="text-gray-600 text-xs mt-6">
            &copy; <Link href="/admin/login" className="hover:text-gray-500 transition-colors">{new Date().getFullYear()}</Link> TaskIt by Squareroot INC. All rights reserved.
          </p>
        </div>

      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-md border-t border-midnight-700 p-4 z-50">
        <div className="max-w-lg mx-auto flex space-x-3">
          <Link 
            href="/auth/login" 
            className="flex-1 bg-midnight-800 text-white border border-midnight-700 py-4 rounded-2xl font-bold text-center text-lg hover:bg-midnight-700 transition-colors active:scale-[0.98]"
          >
            Login
          </Link>
          <Link 
            href="/auth/signup" 
            className="flex-1 bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold text-center text-lg shadow-gold hover:bg-gold-400 transition-colors active:scale-[0.98]"
          >
            Join Us
          </Link>
        </div>
      </div>

    </div>
  );
}
"""
}

for filepath, content in files.items():
    dirpath = os.path.dirname(filepath)
    if dirpath:
        os.makedirs(dirpath, exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content.strip() + "\n")
    print(f"Created: {filepath}")

print("\nAdmin Security Layer & Hidden Route built successfully!")
