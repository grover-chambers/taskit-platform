"use client";

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
