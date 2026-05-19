"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validate credentials with Supabase here
    router.push('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      {/* Back Button */}
      <div className="pt-4 mb-4">
        <Link href="/" className="text-gray-400 hover:text-gold-500 transition-colors inline-flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="text-sm font-semibold">Back</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h1 className="text-3xl font-serif font-bold text-white">Welcome Back</h1>
        <p className="text-gray-400 mt-2">Sign in to your TaskIt account</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+254 7XX XXX XXX"
              className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Password / OTP</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
            />
          </div>

          <button type="submit" className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold text-lg shadow-gold mt-4 hover:bg-gold-400 transition-colors active:scale-[0.98]">
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account? <Link href="/auth/signup" className="text-gold-500 font-semibold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
