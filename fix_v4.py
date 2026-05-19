import os

files = {
    # 1. Fix Tailwind v4 CSS-First Theme (Replaces tailwind.config.ts logic)
    "src/app/globals.css": """@import "tailwindcss";

@theme {
  /* Brand: Black & Metallic Gold */
  --color-brand-50: #FFF9E6;
  --color-brand-100: #FFF0BF;
  --color-brand-200: #FFE699;
  --color-brand-300: #FFDB66;
  --color-brand-400: #FFD233;
  --color-brand-500: #D4AF37; /* Metallic Gold */
  --color-brand-600: #B8960B;
  --color-brand-700: #8B7200;
  --color-brand-800: #5C4C00;
  --color-brand-900: #3A3000;

  /* Surface: Premium Dark Mode */
  --color-surface-50: #F8FAFC;
  --color-surface-100: #F1F5F9;
  --color-surface-800: #1E293B;
  --color-surface-900: #0F172A;
  --color-surface-950: #020617;

  /* Classy Fonts */
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-serif: var(--font-playfair), Georgia, serif;

  /* Premium Shadows */
  --shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04);
  --shadow-premium: 0 10px 40px -10px rgba(212, 175, 55, 0.3);
}

/* Base body styles */
body {
  @apply bg-surface-950 text-white antialiased;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--color-surface-900);
}
::-webkit-scrollbar-thumb {
  background: var(--color-surface-800);
  border-radius: 9999px;
}
""",
    # 2. Fix Middleware Crash (Bypass Supabase if .env is missing placeholders)
    "src/middleware.ts": """import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Safety check: Bypass Supabase auth if .env variables are placeholders or missing
  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard and booking routes (Only if Supabase is connected)
  if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/book'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/' 
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
""",
    # 3. Ensure PostCSS is configured for Tailwind v4
    "postcss.config.mjs": """""" @tailwindcss/postcss """
}

for filepath, content in files.items():
    dirpath = os.path.dirname(filepath)
    if dirpath:
        os.makedirs(dirpath, exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content.strip() + "\n")
    print(f"Fixed: {filepath}")

print("\nV4 Compatibility & Middleware Fixes applied!")
