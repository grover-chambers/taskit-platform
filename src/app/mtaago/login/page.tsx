"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

const DEMO_ACCOUNTS = [
  { role: 'boss', label: 'Owner', email: 'kanini.boss@taskit.co.ke', password: 'boss123', color: 'from-amber-500 to-amber-600' },
  { role: 'operator', label: 'Operator', email: 'kanini.desk@taskit.co.ke', password: 'desk123', color: 'from-haraka-600 to-haraka-700' },
];

export default function MtaagoLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signIn('credentials', { email, password, redirect: false });
      setLoading(false);
      if (res?.error) {
        try {
          const lockoutRes = await fetch(`/api/auth/check-lockout?email=${encodeURIComponent(email)}`);
          const lockout = await lockoutRes.json();
          if (lockout.locked) {
            setError('Account temporarily locked. Please try again in 15 minutes.');
          } else {
            setError('Invalid email or password');
          }
        } catch {
          setError('Invalid email or password');
        }
      } else {
        const meRes = await fetch('/api/enterprise/me');
        if (meRes.ok) {
          router.push('/mtaago');
          router.refresh();
        } else {
          setError('This account does not have enterprise access. Use the main login for marketplace vendors.');
        }
      }
    } catch {
      setLoading(false);
      setError('An unexpected error occurred.');
    }
  };

  const handleDemoLogin = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setDemoLoading(acc.role);
    setError('');
    try {
      const signInRes = await signIn('credentials', { email: acc.email, password: acc.password, redirect: false });
      if (signInRes?.error) {
        setError('Demo login failed — run seed first');
      } else {
        router.push('/mtaago');
        router.refresh();
      }
    } catch {
      setError('Demo login failed');
    }
    setDemoLoading(null);
  };

  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative flex flex-col">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/90"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-6">
        <div className="pt-4 mb-4">
          <Link href="/" className="text-gray-400 hover:text-haraka-500 transition-colors inline-flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="text-sm font-semibold">Back</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-haraka-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-haraka">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white">
              <span className="text-haraka-400">Mtaago</span> Enterprise
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Enterprise dispatch & logistics management</p>
          </div>

          <form onSubmit={handleLogin} className="bg-midnight-800/80 backdrop-blur-md p-6 rounded-2xl border border-haraka-500/20 shadow-haraka space-y-4">
            {error && <div className="bg-red-900/30 text-red-400 text-sm text-center p-3 rounded-lg">{error}</div>}

            <div>
              <label className="text-sm font-semibold text-gray-400 block mb-2">Enterprise Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@enterprise.com"
                className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-haraka-500 transition-colors placeholder:text-midnight-600"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-400 block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-haraka-500 transition-colors placeholder:text-midnight-600"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-haraka-500 transition-colors">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-haraka-500 text-white py-4 rounded-2xl font-bold text-lg shadow-haraka hover:bg-haraka-600 transition-colors active:scale-[0.98] disabled:opacity-50">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-midnight-700" /></div>
              <div className="relative flex justify-center"><span className="bg-midnight-950 px-4 text-sm text-gray-500">Demo Quick Login</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  onClick={() => handleDemoLogin(acc)}
                  disabled={demoLoading === acc.role}
                  className={`bg-gradient-to-r ${acc.color} text-white py-3 px-4 rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-sm`}
                >
                  {demoLoading === acc.role ? 'Loading...' : acc.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Marketplace vendor? <Link href="/auth/login" className="text-haraka-500 font-semibold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
