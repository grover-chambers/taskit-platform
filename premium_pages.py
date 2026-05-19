import os

files = {
    "src/app/dashboard/profile/page.tsx": """"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  // Settings Toggles State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Brayo Otieno');
  const [phone, setPhone] = useState('+254 7XX XXX XXX');

  useEffect(() => {
    if (searchParams.get('tab') === 'settings') {
      setActiveTab('settings');
    }
  }, [searchParams]);

  const handleSignOut = () => {
    // In a real app, clear Supabase auth session here
    router.push('/');
  };

  return (
    <div className="px-6 pt-4 pb-28">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 bg-midnight-800 border-2 border-gold-500 rounded-full flex items-center justify-center mb-4 shadow-gold">
          <span className="text-gold-500 font-bold text-4xl font-serif">B</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-white">{name}</h1>
        <p className="text-gray-400 text-sm mt-1">{phone}</p>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 bg-midnight-800 rounded-xl p-1 border border-midnight-700">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'profile' ? 'bg-gold-500 text-midnight-950' : 'text-gray-400 hover:text-white'}`}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'settings' ? 'bg-gold-500 text-midnight-950' : 'text-gray-400 hover:text-white'}`}
        >
          Settings
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="space-y-4">
          {/* Editable Account Details */}
          <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">Account Details</h3>
              <button onClick={() => setIsEditing(!isEditing)} className="text-gold-500 text-sm font-semibold hover:underline">
                {isEditing ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full bg-midnight-900 border ${isEditing ? 'border-gold-500' : 'border-midnight-700'} rounded-xl px-4 py-2 text-white outline-none transition-colors disabled:opacity-70`}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full bg-midnight-900 border ${isEditing ? 'border-gold-500' : 'border-midnight-700'} rounded-xl px-4 py-2 text-white outline-none transition-colors disabled:opacity-70`}
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
      ) : (
        <div className="space-y-4">
          {/* Working Toggles */}
          <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div>
              <span className="text-white font-semibold">Push Notifications</span>
            </div>
            <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className={`w-12 h-6 rounded-full relative transition-colors ${notificationsEnabled ? 'bg-gold-500' : 'bg-midnight-600'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all ${notificationsEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
            </button>
          </div>

          <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
              <span className="text-white font-semibold">Biometric Login</span>
            </div>
            <button onClick={() => setBiometricEnabled(!biometricEnabled)} className={`w-12 h-6 rounded-full relative transition-colors ${biometricEnabled ? 'bg-gold-500' : 'bg-midnight-600'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all ${biometricEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
            </button>
          </div>

          <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
              <span className="text-white font-semibold">Privacy & Security</span>
            </div>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
          
          <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <span className="text-white font-semibold">Help & Support</span>
            </div>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      )}
    </div>
  );
}
""",
    "src/app/page.tsx": """import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative pb-28">
      
      {/* Scrollable Content Area */}
      <div className="max-w-lg mx-auto px-6 pt-10">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gold-500 rounded-2xl flex items-center justify-center shadow-gold mb-6 mx-auto">
            <svg className="w-10 h-10 text-midnight-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-serif font-bold text-white tracking-tight">TaskIt</h1>
          <p className="text-gold-500 mt-2 text-lg font-semibold uppercase tracking-widest">Nairobi Errands</p>
          <p className="text-gray-400 mt-6 text-base leading-relaxed max-w-xs mx-auto">
            Fast, reliable errands delivered across Nairobi. Pay seamlessly via M-Pesa.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-white text-center mb-6">Why Choose TaskIt?</h2>
          <div className="space-y-4">
            <div className="bg-midnight-800 p-5 rounded-2xl border border-midnight-700 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Flat-Rate Zone Pricing</h3>
                <p className="text-gray-400 text-sm mt-1">No hidden fees. Know exactly what you pay before you book. CBD, Westlands, Eastleigh—flat rates every time.</p>
              </div>
            </div>
            <div className="bg-midnight-800 p-5 rounded-2xl border border-midnight-700 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">One-Tap M-Pesa</h3>
                <p className="text-gray-400 text-sm mt-1">Seamless STK Push checkout. No card details needed. Pay securely directly from your phone.</p>
              </div>
            </div>
            <div className="bg-midnight-800 p-5 rounded-2xl border border-midnight-700 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Real-Time Tracking</h3>
                <p className="text-gray-400 text-sm mt-1">Know exactly where your errand is. From rider assignment to delivery, you're in the loop.</p>
              </div>
            </div>
          </div>
        </div>

        {/* For Riders Section */}
        <div className="mb-12 bg-midnight-800 border border-gold-500/50 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/5 rounded-full -mr-10 -mt-10"></div>
          <h2 className="text-gold-500 font-bold text-2xl mb-2 font-serif">For Riders</h2>
          <p className="text-gray-300 text-sm mb-4">Turn your smartphone into a money-making machine. Flexible hours, reliable payouts, and a platform that respects your time.</p>
          <Link href="/auth/signup" className="inline-block bg-gold-500 text-midnight-950 px-6 py-2 rounded-xl font-bold text-sm shadow-gold hover:bg-gold-400 transition-colors">
            Join as a Rider
          </Link>
        </div>

        {/* Contact / About */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-400 text-sm mb-2">Have questions or a corporate inquiry?</p>
          <a href="mailto:hello@taskit.co.ke" className="text-gold-500 font-semibold hover:underline">hello@taskit.co.ke</a>
          <p className="text-gray-600 text-xs mt-6">&copy; {new Date().getFullYear()} TaskIt by Squareroot INC. All rights reserved.</p>
        </div>

      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-md border-t border-midnight-700 p-4 z-50">
        <div className="max-w-lg mx-auto flex space-x-3">
          <Link 
            href="/auth/login" 
            className="flex-1 bg-midnight-800 text-white border border-midnight-700 py-4 rounded-2xl font-bold text-center text-lg hover:bg-midnight-700 transition-colors active:scale-[0.98]"
          >
            Login
          </Link>
          <Link 
            href="/auth/signup" 
            className="flex-1 bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold text-center text-lg shadow-gold hover:bg-gold-400 transition-colors active:scale-[0.98]"
          >
            Join Us
          </Link>
        </div>
      </div>

    </div>
  );
}
"""
}

for filepath, content in files.items():
    dirpath = os.path.dirname(filepath)
    if dirpath:
        os.makedirs(dirpath, exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content.strip() + "\n")
    print(f"Created: {filepath}")

print("\nPremium Profile & Landing Page built successfully!")
