"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState('customer');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, register user with Supabase here
    if (role === 'rider') {
      router.push('/rider');
    } else {
      router.push('/dashboard');
    }
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
        <h1 className="text-3xl font-serif font-bold text-white">Create Account</h1>
        <p className="text-gray-400 mt-2">Join Nairobi's fastest errand platform</p>

        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g., Brayo Otieno"
              className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+254 7XX XXX XXX"
              className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setRole('customer')}
                className={`p-4 rounded-xl border-2 transition-all text-center font-semibold
                  ${role === 'customer' ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-midnight-700 bg-midnight-800 text-gray-400 hover:border-midnight-600'}`}
              >
                Customer
              </button>
              <button 
                type="button"
                onClick={() => setRole('rider')}
                className={`p-4 rounded-xl border-2 transition-all text-center font-semibold
                  ${role === 'rider' ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-midnight-700 bg-midnight-800 text-gray-400 hover:border-midnight-600'}`}
              >
                Rider
              </button>
            </div>
          </div>

          {/* Conditional Rider Fields */}
          {role === 'rider' && (
            <div className="space-y-4 pt-2">
              <div className="bg-gold-500/10 border border-gold-500/30 p-3 rounded-xl text-gold-500 text-sm">
                To join as a rider, please provide your vehicle details for verification.
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-400 block mb-2">Bike Plate Number</label>
                <input 
                  type="text" 
                  placeholder="e.g., KBA 123J"
                  className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-400 block mb-2">Driving License Number</label>
                <input 
                  type="text" 
                  placeholder="e.g., 123456789"
                  className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
                />
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold text-lg shadow-gold mt-4 hover:bg-gold-400 transition-colors active:scale-[0.98]">
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account? <Link href="/auth/login" className="text-gold-500 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
