import os

files = {
    "src/components/BottomNav.tsx": """"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-md border-t border-midnight-800 z-50">
      <div className="max-w-lg mx-auto flex justify-between items-end px-4 pb-4 pt-2 relative">
        
        <Link href="/dashboard/wallet" className={`flex flex-col items-center w-1/5 transition-colors ${isActive('/dashboard/wallet') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Wallet</span>
        </Link>

        <Link href="/dashboard/orders" className={`flex flex-col items-center w-1/5 transition-colors ${isActive('/dashboard/orders') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Orders</span>
        </Link>

        <Link href="/dashboard" className="flex flex-col items-center w-1/5 relative -mt-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-gold transition-colors ${isActive('/dashboard') && pathname === '/dashboard' ? 'bg-gold-400' : 'bg-gold-500 hover:bg-gold-400'}`}>
            <svg className="w-8 h-8 text-midnight-950" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>
          </div>
        </Link>

        <Link href="/dashboard/profile" className={`flex flex-col items-center w-1/5 transition-colors ${isActive('/dashboard/profile') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Profile</span>
        </Link>

        <Link href="/dashboard/settings" className={`flex flex-col items-center w-1/5 transition-colors ${isActive('/dashboard/settings') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Settings</span>
        </Link>

      </div>
    </div>
  );
}
""",
    "src/app/dashboard/layout.tsx": """import BottomNav from '@/components/BottomNav';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex flex-col relative">
      {/* Faint Rider Background Watermark */}
      <div className="absolute inset-0 z-0 opacity-[0.04] bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
      
      {/* Dark overlay to ensure text readability over watermark */}
      <div className="absolute inset-0 z-0 bg-midnight-950/50"></div>

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-xs">Good morning</p>
          <h1 className="text-lg font-serif font-bold text-white">Hello, Brayo</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/notifications" className="relative text-gray-400 hover:text-gold-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-gold-500 rounded-full"></span>
          </Link>
          <div className="w-9 h-9 bg-midnight-800 border border-midnight-700 rounded-full flex items-center justify-center">
            <span className="text-gold-500 font-bold text-sm">B</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-28 relative z-10">
        {children}
      </main>

      <div className="relative z-50">
        <BottomNav />
      </div>
    </div>
  );
}
""",
    "src/app/dashboard/profile/page.tsx": """"use client";

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
""",
    "src/app/dashboard/settings/page.tsx": """"use client";

import { useState } from 'react';

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const Toggle = ({ enabled, setEnabled }: { enabled: boolean, setEnabled: (val: boolean) => void }) => (
    <button onClick={() => setEnabled(!enabled)} className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-gold-500' : 'bg-midnight-600'}`}>
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all ${enabled ? 'right-0.5' : 'left-0.5'}`}></div>
    </button>
  );

  return (
    <div className="px-6 pt-4 pb-28">
      <h1 className="text-2xl font-serif font-bold text-white mb-6">Settings</h1>

      <div className="space-y-4">
        {/* App Preferences */}
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold px-1">App Preferences</h3>
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div>
              <span className="text-white font-semibold">Push Notifications</span>
            </div>
            <Toggle enabled={notificationsEnabled} setEnabled={setNotificationsEnabled} />
          </div>
          <div className="border-t border-midnight-700"></div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
              <span className="text-white font-semibold">Biometric Login</span>
            </div>
            <Toggle enabled={biometricEnabled} setEnabled={setBiometricEnabled} />
          </div>
        </div>

        {/* Privacy & Security */}
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold px-1 pt-2">Privacy & Security</h3>
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
              <span className="text-white font-semibold">Location Services</span>
            </div>
            <Toggle enabled={locationEnabled} setEnabled={setLocationEnabled} />
          </div>
          <div className="border-t border-midnight-700"></div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
              <span className="text-white font-semibold">Analytics & Data</span>
            </div>
            <Toggle enabled={analyticsEnabled} setEnabled={setAnalyticsEnabled} />
          </div>
          <div className="border-t border-midnight-700"></div>
          <button className="w-full flex justify-between items-center pt-1 group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></div>
              <span className="text-white font-semibold">Change Password</span>
            </div>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Legal */}
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold px-1 pt-2">Legal</h3>
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
          <button className="w-full flex justify-between items-center group">
            <span className="text-white font-semibold text-sm">Terms of Service</span>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="border-t border-midnight-700"></div>
          <button className="w-full flex justify-between items-center group">
            <span className="text-white font-semibold text-sm">Privacy Policy</span>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs pt-4">TaskIt v1.0.0 &middot; Made in Nairobi</p>
      </div>
    </div>
  );
}
""",
    "src/app/page.tsx": """import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative flex flex-col">
      
      {/* Hero Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        {/* Gradient Overlay to hide poster text and ensure UI readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/95 via-midnight-950/85 to-midnight-950"></div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 max-w-lg mx-auto w-full px-6 pt-16 pb-32">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gold-500 rounded-2xl flex items-center justify-center shadow-gold mb-6 mx-auto">
            <svg className="w-10 h-10 text-midnight-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-serif font-bold text-white tracking-tight">TaskIt</h1>
          <p className="text-gold-500 mt-2 text-lg font-semibold uppercase tracking-widest">Nairobi Errands</p>
          <p className="text-gray-300 mt-6 text-lg leading-relaxed max-w-xs mx-auto">
            We run your errands, so you don't have to. Fast, reliable, and seamless.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-white text-center mb-6">Why Choose TaskIt?</h2>
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Flat-Rate Zone Pricing</h3>
                <p className="text-gray-300 text-sm mt-1">No hidden fees. Know exactly what you pay before you book.</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">One-Tap M-Pesa</h3>
                <p className="text-gray-300 text-sm mt-1">Seamless STK Push checkout. Pay securely from your phone.</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Real-Time Tracking</h3>
                <p className="text-gray-300 text-sm mt-1">From rider assignment to delivery, you are always in the loop.</p>
              </div>
            </div>
          </div>
        </div>

        {/* For Riders Section */}
        <div className="mb-12 bg-gold-500/10 border border-gold-500/30 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full -mr-10 -mt-10"></div>
          <h2 className="text-gold-500 font-bold text-2xl mb-2 font-serif">For Riders</h2>
          <p className="text-gray-200 text-sm mb-4">Turn your smartphone into a money-making machine. Flexible hours, reliable payouts.</p>
          <Link href="/auth/signup" className="inline-block bg-gold-500 text-midnight-950 px-6 py-2 rounded-xl font-bold text-sm shadow-gold hover:bg-gold-400 transition-colors">
            Join as a Rider
          </Link>
        </div>

        {/* Contact / About */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-300 text-sm mb-2">Have questions or a corporate inquiry?</p>
          <a href="tel:0707075630" className="text-gold-500 font-semibold hover:underline text-lg">0707 075 630</a>
          <p className="text-gray-500 text-xs mt-6">&copy; {new Date().getFullYear()} TaskIt by Squareroot INC. All rights reserved.</p>
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

print("\nPage Split & Background UI built successfully!")
