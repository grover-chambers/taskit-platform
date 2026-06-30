"use client";
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

const DEMO_ROLES = [
  { role: 'admin', label: 'Admin', dashboard: '/admin', color: 'from-red-600 to-red-700' },
  { role: 'customer', label: 'Customer', dashboard: '/dashboard', color: 'from-brand-500 to-yellow-600' },
  { role: 'rider', label: 'Rider', dashboard: '/rider', color: 'from-blue-600 to-blue-700' },
  { role: 'vendor', label: 'Vendor', dashboard: '/vendor', color: 'from-purple-600 to-purple-700' },
  { role: 'boss', label: 'Boss', dashboard: '/mtaago', color: 'from-amber-600 to-amber-700' },
  { role: 'operator', label: 'Operator', dashboard: '/mtaago', color: 'from-haraka-600 to-emerald-700' },
];

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p className="text-gray-500 text-sm">Loading...</p></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      setError('');
    }
  }, [searchParams]);

  const resetSuccess = searchParams.get('reset') === 'true';
  const registered = searchParams.get('registered') === 'true';
  const emailVerified = searchParams.get('message') === 'email_verified';
  const alreadyVerified = searchParams.get('message') === 'already_verified';
  const invalidToken = searchParams.get('error') === 'invalid_token';

  const ROLE_REDIRECTS: Record<string, string> = {
    ADMIN: '/admin',
    RIDER: '/rider',
    VENDOR: '/vendor',
    CUSTOMER: '/dashboard',
  };

  const getRedirectPath = async (): Promise<string> => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      const role = data?.user?.role;
      return ROLE_REDIRECTS[role] || '/dashboard';
    } catch {
      return '/dashboard';
    }
  };

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
            setError('Account temporarily locked due to too many failed attempts. Please try again in 15 minutes.');
          } else {
            setError('Invalid email or password');
          }
        } catch {
          setError('Invalid email or password');
        }
      } else {
        const redirect = await getRedirectPath();
        router.push(redirect);
        router.refresh();
      }
    } catch {
      setLoading(false);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleDemoLogin = async (acc: typeof DEMO_ROLES[0]) => {
    setDemoLoading(acc.role);
    setError('');
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: acc.role }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Demo login failed — run seed first');
        setDemoLoading(null);
        return;
      }
      const signInRes = await signIn('credentials', { email: data.email, password: data.password, redirect: false });
      if (signInRes?.error) {
        setError('Demo login failed — run seed first');
      } else {
        const redirect = await getRedirectPath();
        router.push(redirect);
        router.refresh();
      }
    } catch {
      setError('Demo login failed');
    }
    setDemoLoading(null);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotStatus('');
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail }),
    });
    const data = await res.json();
    setForgotLoading(false);
    if (data.error) {
      setForgotStatus(data.error);
    } else {
      setForgotStatus(data.message);
    }
  };

  if (showForgot) {
    return (
      <div className="flex-1 flex flex-col p-6">
        <div className="pt-4 mb-4">
          <button onClick={() => { setShowForgot(false); setForgotStatus(''); }} className="text-gray-400 hover:text-brand-500 transition-colors inline-flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="text-sm font-semibold">Back to Login</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h1 className="text-3xl font-serif font-bold text-white">Forgot Password?</h1>
          <p className="text-gray-400 mt-2">Enter your email and we'll send you a reset link.</p>
          <form onSubmit={handleForgotPassword} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-400 block mb-2">Email Address</label>
              <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required placeholder="you@example.com" className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" />
            </div>
            {forgotStatus && (
              <div className={`text-sm text-center p-3 rounded-lg ${forgotStatus.includes('sent') || forgotStatus.includes('If') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{forgotStatus}</div>
            )}
            <button type="submit" disabled={forgotLoading} className="w-full bg-brand-500 text-midnight-950 py-4 rounded-2xl font-bold text-lg shadow-gold mt-4 hover:bg-brand-400 transition-colors active:scale-[0.98] disabled:opacity-50">
              {forgotLoading ? 'Sending Request...' : 'Send Reset Request'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="pt-4 mb-4">
        <Link href="/" className="text-gray-400 hover:text-brand-500 transition-colors inline-flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="text-sm font-semibold">Back</span>
        </Link>
      </div>
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h1 className="text-3xl font-serif font-bold text-white">Welcome Back</h1>
        <p className="text-gray-400 mt-2">Sign in to your TaskIt account</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          {error && <div className="bg-red-900/30 text-red-400 text-sm text-center p-3 rounded-lg">{error}</div>}
          {resetSuccess && <div className="bg-green-900/30 text-green-400 text-sm text-center p-3 rounded-lg">Password reset successfully! Please sign in with your new password.</div>}
          {registered && <div className="bg-green-900/30 text-green-400 text-sm text-center p-3 rounded-lg">Account created! Check your email to verify your account.</div>}
          {emailVerified && <div className="bg-green-900/30 text-green-400 text-sm text-center p-3 rounded-lg">Email verified! You can now sign in.</div>}
          {alreadyVerified && <div className="bg-blue-900/30 text-blue-400 text-sm text-center p-3 rounded-lg">Email already verified. Sign in to continue.</div>}
          {invalidToken && <div className="bg-red-900/30 text-red-400 text-sm text-center p-3 rounded-lg">Verification link expired or invalid. Please request a new one.</div>}

          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 transition-colors">
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-brand-500 hover:underline font-semibold">Forgot Password?</button>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-brand-500 text-midnight-950 py-4 rounded-2xl font-bold text-lg shadow-gold mt-2 hover:bg-brand-400 transition-colors active:scale-[0.98] disabled:opacity-50">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-midnight-700" /></div>
            <div className="relative flex justify-center"><span className="bg-midnight-900 px-4 text-sm text-gray-500">Demo Quick Login</span></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DEMO_ROLES.map(acc => (
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
          Don't have an account? <Link href="/auth/signup" className="text-brand-500 font-semibold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
