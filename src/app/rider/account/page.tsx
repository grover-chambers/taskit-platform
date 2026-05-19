"use client";

import Link from 'next/link';

export default function RiderAccount() {
  return (
    <div className="p-6 pt-4">
      <h1 className="text-2xl font-serif font-bold text-white mb-6">Account</h1>
      
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-20 h-20 bg-midnight-800 border-2 border-gold-500 rounded-full flex items-center justify-center mb-3 shadow-gold">
          <span className="text-gold-500 font-bold text-3xl font-serif">K</span>
        </div>
        <h2 className="text-xl font-bold text-white">Kamau M.</h2>
        <p className="text-gray-400 text-sm">Plate: KBA 123J</p>
      </div>

      <div className="space-y-3">
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
          <span className="text-white font-semibold">Edit Profile</span>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
          <span className="text-white font-semibold">Vehicle Details</span>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
        <Link href="/auth/login" className="bg-midnight-800 p-4 rounded-2xl border border-red-900/50 shadow-soft-dark flex justify-between items-center hover:border-red-500 transition-colors cursor-pointer mt-6">
          <span className="text-red-400 font-semibold">Sign Out</span>
        </Link>
      </div>
    </div>
  );
}
