"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Brayo Otieno');
  const [phone, setPhone] = useState('+254 7XX XXX XXX');
  const [email, setEmail] = useState('brayo@taskit.co.ke');

  const handleSignOut = () => {
    router.push('/');
  };

  return (
    <div className="px-6 pt-4 pb-28">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 bg-midnight-800 border-2 border-gold-500 rounded-full flex items-center justify-center mb-4 shadow-gold">
          <span className="text-gold-500 font-bold text-4xl font-serif">B</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-white">{name}</h1>
        <p className="text-gray-400 text-sm mt-1">{phone}</p>
      </div>

      <div className="space-y-4">
        {/* Editable Account Details */}
        <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark relative">
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className={`absolute top-4 right-4 text-sm font-semibold px-3 py-1 rounded-lg transition-colors ${isEditing ? 'bg-gold-500 text-midnight-950' : 'text-gold-500 hover:text-gold-400'}`}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          
          <h3 className="text-white font-bold text-lg mb-4">Account Details</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className={`w-full bg-midnight-900 border rounded-xl px-4 py-2 text-white outline-none transition-all ${isEditing ? 'border-gold-500 ring-1 ring-gold-500/50' : 'border-midnight-700 cursor-default'}`}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Phone Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                className={`w-full bg-midnight-900 border rounded-xl px-4 py-2 text-white outline-none transition-all ${isEditing ? 'border-gold-500 ring-1 ring-gold-500/50' : 'border-midnight-700 cursor-default'}`}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className={`w-full bg-midnight-900 border rounded-xl px-4 py-2 text-white outline-none transition-all ${isEditing ? 'border-gold-500 ring-1 ring-gold-500/50' : 'border-midnight-700 cursor-default'}`}
              />
            </div>
          </div>
        </div>

        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
            <span className="text-white font-semibold">Saved Addresses</span>
          </div>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>

        {/* Sign Out Button */}
        <button onClick={handleSignOut} className="w-full bg-midnight-800 p-4 rounded-2xl border border-red-900/50 shadow-soft-dark flex justify-between items-center hover:border-red-500 transition-colors mt-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-900/20 rounded-xl flex items-center justify-center text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></div>
            <span className="text-red-400 font-semibold">Sign Out</span>
          </div>
        </button>
      </div>
    </div>
  );
}
