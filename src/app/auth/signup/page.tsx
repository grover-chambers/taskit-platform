"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);
const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
);

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', password: '', confirmPassword: '',
    licenseNumber: '', plateNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setError(data.error);
    } else {
      router.push('/auth/login?registered=true');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="pt-4 mb-4">
        <Link href="/" className="text-gray-400 hover:text-brand-500 transition-colors inline-flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="text-sm font-semibold">Back</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h1 className="text-3xl font-serif font-bold text-white">Create Account</h1>
        <p className="text-gray-400 mt-2">Join Nairobi's fastest errand platform</p>

        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          {error && <div className="bg-red-900/30 text-red-400 text-sm text-center p-3 rounded-lg">{error}</div>}

          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Full Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" placeholder="Brayo Otieno" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Phone Number</label>
            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" placeholder="+254 7XX XXX XXX" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Email <span className="text-gray-600">(Optional)</span></label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" placeholder="you@email.com" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Password</label>
            <div className="relative">
              <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required minLength={8} className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" placeholder="Min 8 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 transition-colors">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Confirm Password</label>
            <div className="relative">
              <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" placeholder="Re-enter password" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 transition-colors">
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole('CUSTOMER')} className={`p-4 rounded-xl border-2 transition-all text-center font-semibold ${role === 'CUSTOMER' ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-midnight-700 bg-midnight-800 text-gray-400'}`}>Customer</button>
              <button type="button" onClick={() => setRole('RIDER')} className={`p-4 rounded-xl border-2 transition-all text-center font-semibold ${role === 'RIDER' ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-midnight-700 bg-midnight-800 text-gray-400'}`}>Rider</button>
            </div>
          </div>

          {role === 'RIDER' && (
            <div className="space-y-4 pt-2">
              <div className="bg-brand-500/10 border border-brand-500/30 p-3 rounded-xl text-brand-500 text-sm">To join as a rider, provide your vehicle details.</div>
              <input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" placeholder="License Number" />
              <input name="plateNumber" value={formData.plateNumber} onChange={handleChange} required className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" placeholder="Bike Plate (e.g KBA 123J)" />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-brand-500 text-midnight-950 py-4 rounded-2xl font-bold text-lg shadow-gold mt-4 hover:bg-brand-400 transition-colors active:scale-[0.98] disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account? <Link href="/auth/login" className="text-brand-500 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
