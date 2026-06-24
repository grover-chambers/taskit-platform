"use client";

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p className="text-gray-500 text-sm">Loading...</p></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setError(data.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login?reset=true');
      }, 3000);
    }
  };

  if (!token) {
    return (
      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full text-center">
          <div className="text-5xl mb-4">🔗</div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Invalid Link</h1>
          <p className="text-gray-400 mb-6">This reset link is missing or invalid. Please request a new one.</p>
          <Link href="/auth/login" className="text-brand-500 font-semibold hover:underline">Back to Login</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Password Reset!</h1>
          <p className="text-gray-400 mb-4">Your password has been updated. Redirecting to login...</p>
          <Link href="/auth/login" className="text-brand-500 font-semibold hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="pt-4 mb-4">
        <Link href="/auth/login" className="text-gray-400 hover:text-brand-500 transition-colors inline-flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="text-sm font-semibold">Back to Login</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔑</div>
          <h1 className="text-3xl font-serif font-bold text-white">Set New Password</h1>
          <p className="text-gray-400 mt-2">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-900/30 text-red-400 text-sm text-center p-3 rounded-lg">{error}</div>}

          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min 8 characters"
                className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 transition-colors">
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Re-enter new password"
              className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-brand-500 text-midnight-950 py-4 rounded-2xl font-bold text-lg shadow-gold mt-2 hover:bg-brand-400 transition-colors active:scale-[0.98] disabled:opacity-50">
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
