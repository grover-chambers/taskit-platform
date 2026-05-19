"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      router.push('/auth/login');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center p-6 max-w-md mx-auto w-full">
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
          <label className="text-sm font-semibold text-gray-400 block mb-2">Email (Optional)</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" placeholder="you@email.com" />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-400 block mb-2">Password</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required minLength={8} className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" placeholder="Min 8 characters" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-400 block mb-2">Confirm Password</label>
          <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600" placeholder="Re-enter password" />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-400 block mb-2">I am a...</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setRole('customer')} className={`p-4 rounded-xl border-2 transition-all text-center font-semibold ${role === 'customer' ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-midnight-700 bg-midnight-800 text-gray-400'}`}>Customer</button>
            <button type="button" onClick={() => setRole('rider')} className={`p-4 rounded-xl border-2 transition-all text-center font-semibold ${role === 'rider' ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-midnight-700 bg-midnight-800 text-gray-400'}`}>Rider</button>
          </div>
        </div>

        {role === 'rider' && (
          <div className="space-y-4 pt-2">
            <div className="bg-brand-500/10 border border-brand-500/30 p-3 rounded-xl text-brand-500 text-sm">To join as a rider, provide vehicle details.</div>
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
  );
}
