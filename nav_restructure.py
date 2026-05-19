import os

files = {
    "src/components/BottomNav.tsx": """"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-midnight-900 border-t border-midnight-800 z-50">
      <div className="max-w-lg mx-auto flex justify-between items-end px-4 pb-4 pt-2 relative">
        
        {/* Wallet */}
        <Link href="/dashboard/wallet" className={`flex flex-col items-center w-1/5 transition-colors ${isActive('/dashboard/wallet') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Wallet</span>
        </Link>

        {/* Orders */}
        <Link href="/dashboard/orders" className={`flex flex-col items-center w-1/5 transition-colors ${isActive('/dashboard/orders') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Orders</span>
        </Link>

        {/* Home (Center Floating) */}
        <Link href="/dashboard" className="flex flex-col items-center w-1/5 relative -mt-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-gold transition-colors ${isActive('/dashboard') && pathname === '/dashboard' ? 'bg-gold-400' : 'bg-gold-500 hover:bg-gold-400'}`}>
            <svg className="w-8 h-8 text-midnight-950" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>
          </div>
        </Link>

        {/* Profile */}
        <Link href="/dashboard/profile" className={`flex flex-col items-center w-1/5 transition-colors ${isActive('/dashboard/profile') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Profile</span>
        </Link>

        {/* Settings */}
        <Link href="/dashboard/profile?tab=settings" className={`flex flex-col items-center w-1/5 transition-colors ${pathname.includes('settings') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
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
    <div className="min-h-screen bg-midnight-950 antialiased flex flex-col">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-midnight-950 border-b border-midnight-800 px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-xs">Good morning</p>
          <h1 className="text-lg font-serif font-bold text-white">Hello, Brayo</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/notifications" className="relative text-gray-400 hover:text-gold-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {/* Notification Dot */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-gold-500 rounded-full"></span>
          </Link>
          <div className="w-9 h-9 bg-midnight-800 border border-midnight-700 rounded-full flex items-center justify-center">
            <span className="text-gold-500 font-bold text-sm">B</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-28">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
""",
    "src/app/dashboard/page.tsx": """"use client";

import Link from 'next/link';

const ERRAND_TYPES = [
  { name: 'Shopping', icon: '🛍️', href: '/book' },
  { name: 'Bills', icon: '📄', href: '/book' },
  { name: 'Documents', icon: '📁', href: '/book' },
  { name: 'Groceries', icon: '🥑', href: '/book' },
  { name: 'Pharmacy', icon: '💊', href: '/book' },
  { name: 'Custom', icon: '✨', href: '/book' },
];

export default function CustomerDashboard() {
  return (
    <div className="px-6 pt-4">
      {/* Referral & Search Card */}
      <div className="mb-6">
        <div className="bg-midnight-800 border border-midnight-700 p-6 rounded-2xl shadow-soft-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full -mr-10 -mt-10"></div>
          <h3 className="text-gold-500 font-bold text-lg mb-2">Earn Ksh 100</h3>
          <p className="text-gray-300 text-sm mb-4">Invite a friend to TaskIt and get Ksh 100 credit for your next errand.</p>
          <div className="bg-midnight-900 border border-midnight-700 rounded-xl px-4 py-3 text-gray-500 text-sm flex items-center space-x-2 cursor-pointer hover:border-gold-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span>Where is your errand?</span>
          </div>
        </div>
      </div>

      {/* Quick Options */}
      <div className="mb-8">
        <h2 className="text-white font-bold text-lg mb-4">Quick Options</h2>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/book" className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-gold-500 transition-colors group">
            <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-gold-500 group-hover:text-midnight-950 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="text-white text-xs font-semibold">Create</span>
          </Link>
          <Link href="/dashboard/orders" className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-gold-500 transition-colors group">
            <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-gold-500 group-hover:text-midnight-950 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <span className="text-white text-xs font-semibold">Track</span>
          </Link>
          <Link href="/book" className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-gold-500 transition-colors group">
            <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-gold-500 group-hover:text-midnight-950 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-white text-xs font-semibold">Schedule</span>
          </Link>
        </div>
      </div>

      {/* Errand Types */}
      <div className="mb-8">
        <h2 className="text-white font-bold text-lg mb-4">Errand Types</h2>
        <div className="grid grid-cols-3 gap-3">
          {ERRAND_TYPES.map((type) => (
            <Link href={type.href} key={type.name} className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-gold-500 transition-colors group">
              <span className="text-2xl mb-2">{type.icon}</span>
              <span className="text-white text-xs font-semibold">{type.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Delivery Zones - Stylized Map */}
      <div className="mb-4">
        <h2 className="text-white font-bold text-lg mb-4">Delivery Zones</h2>
        <div className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl shadow-soft-dark relative overflow-hidden">
          <div className="relative w-full h-64 mb-4">
            <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 150 Q150 50 200 150 T350 100" stroke="#262626" strokeWidth="8" strokeLinecap="round" />
              <path d="M100 50 Q150 150 100 250" stroke="#262626" strokeWidth="8" strokeLinecap="round" />
              <path d="M50 200 H350" stroke="#262626" strokeWidth="8" strokeLinecap="round" />
              <path d="M300 50 V250" stroke="#262626" strokeWidth="8" strokeLinecap="round" />
              <circle cx="120" cy="210" r="40" fill="rgba(255, 215, 0, 0.03)" stroke="#EAB308" strokeWidth="2" strokeDasharray="8 4" className="animate-pulse" />
              <text x="120" y="215" textAnchor="middle" fill="#EAB308" fontSize="12" fontWeight="bold">Ngara</text>
              <text x="120" y="230" textAnchor="middle" fill="#737373" fontSize="9">Ksh 300</text>
              <circle cx="200" cy="150" r="35" fill="rgba(255, 215, 0, 0.05)" stroke="#FFD700" strokeWidth="3" className="animate-pulse" />
              <text x="200" y="155" textAnchor="middle" fill="#FFD700" fontSize="14" fontWeight="bold">CBD</text>
              <text x="200" y="172" textAnchor="middle" fill="#A3A3A3" fontSize="10">Ksh 150</text>
              <circle cx="130" cy="90" r="45" fill="rgba(255, 215, 0, 0.03)" stroke="#EAB308" strokeWidth="2" strokeDasharray="8 4" className="animate-pulse" />
              <text x="130" y="95" textAnchor="middle" fill="#EAB308" fontSize="12" fontWeight="bold">Westlands</text>
              <text x="130" y="110" textAnchor="middle" fill="#737373" fontSize="9">Ksh 250</text>
              <circle cx="300" cy="130" r="50" fill="rgba(255, 215, 0, 0.03)" stroke="#EAB308" strokeWidth="2" strokeDasharray="8 4" className="animate-pulse" />
              <text x="300" y="135" textAnchor="middle" fill="#EAB308" fontSize="12" fontWeight="bold">Eastleigh</text>
              <text x="300" y="150" textAnchor="middle" fill="#737373" fontSize="9">Ksh 300</text>
              <path d="M200 130 L204 140 L200 138 L196 140 Z" fill="#FFD700" />
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/book" className="bg-midnight-900 border border-midnight-700 p-3 rounded-xl flex items-center justify-between hover:border-gold-500 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gold-500 rounded-full"></div>
                <span className="text-white text-sm font-semibold">CBD</span>
              </div>
              <span className="text-gold-500 text-xs font-bold">Ksh 150</span>
            </Link>
            <Link href="/book" className="bg-midnight-900 border border-midnight-700 p-3 rounded-xl flex items-center justify-between hover:border-gold-500 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gold-600 rounded-full"></div>
                <span className="text-white text-sm font-semibold">Westlands</span>
              </div>
              <span className="text-gold-500 text-xs font-bold">Ksh 250</span>
            </Link>
            <Link href="/book" className="bg-midnight-900 border border-midnight-700 p-3 rounded-xl flex items-center justify-between hover:border-gold-500 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gold-600 rounded-full"></div>
                <span className="text-white text-sm font-semibold">Eastleigh</span>
              </div>
              <span className="text-gold-500 text-xs font-bold">Ksh 300</span>
            </Link>
            <Link href="/book" className="bg-midnight-900 border border-midnight-700 p-3 rounded-xl flex items-center justify-between hover:border-gold-500 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gold-600 rounded-full"></div>
                <span className="text-white text-sm font-semibold">Ngara</span>
              </div>
              <span className="text-gold-500 text-xs font-bold">Ksh 300</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
""",
    "src/app/dashboard/wallet/page.tsx": """"use client";

import Link from 'next/link';

const MOCK_TRANSACTIONS = [
  { id: 'TXN-101', order: 'TSK-901', desc: 'Errand - Nairobi CBD', amount: -150, status: 'Paid', date: 'Today, 10:30 AM' },
  { id: 'TXN-102', order: 'TSK-899', desc: 'Errand - Westlands', amount: -250, status: 'Paid', date: 'Yesterday, 02:15 PM' },
  { id: 'TXN-103', order: 'REF-001', desc: 'Referral Bonus', amount: 100, status: 'Credited', date: 'Apr 20, 09:00 AM' },
];

export default function WalletPage() {
  return (
    <div className="px-6 pt-4">
      <div className="bg-midnight-800 border border-midnight-700 p-6 rounded-2xl shadow-soft-dark mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full -mr-10 -mt-10"></div>
        <p className="text-gray-400 text-sm mb-1">Total Spent this Month</p>
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Ksh 4,500</h2>
        <div className="bg-midnight-900 border border-midnight-700 rounded-xl p-3 flex items-center space-x-2">
          <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
          <span className="text-white text-sm font-semibold">Apply Promo Code</span>
        </div>
      </div>

      <h3 className="text-white font-bold text-lg mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {MOCK_TRANSACTIONS.map((txn) => (
          <div key={txn.id} className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl shadow-soft-dark">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">{txn.date}</span>
              <span className={`text-sm font-bold ${txn.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                {txn.amount > 0 ? '+' : ''} Ksh {Math.abs(txn.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-white font-semibold">{txn.desc}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${txn.amount > 0 ? 'bg-green-900/30 text-green-400' : 'bg-midnight-700 text-gray-300'}`}>
                {txn.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
""",
    "src/app/dashboard/profile/page.tsx": """"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  useEffect(() => {
    if (searchParams.get('tab') === 'settings') {
      setActiveTab('settings');
    }
  }, [searchParams]);

  return (
    <div className="px-6 pt-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 bg-midnight-800 border-2 border-gold-500 rounded-full flex items-center justify-center mb-4 shadow-gold">
          <span className="text-gold-500 font-bold text-4xl font-serif">B</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-white">Brayo Otieno</h1>
        <p className="text-gray-400 text-sm mt-1">+254 7XX XXX XXX</p>
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
        <div className="space-y-3">
          <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
              <span className="text-white font-semibold">Account Details</span>
            </div>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
          <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
              <span className="text-white font-semibold">Saved Addresses</span>
            </div>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
          <Link href="/" className="bg-midnight-800 p-4 rounded-2xl border border-red-900/50 shadow-soft-dark flex justify-between items-center hover:border-red-500 transition-colors cursor-pointer mt-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-900/20 rounded-xl flex items-center justify-center text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></div>
              <span className="text-red-400 font-semibold">Log Out</span>
            </div>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div>
              <span className="text-white font-semibold">Notifications</span>
            </div>
            <div className="w-12 h-6 bg-gold-500 rounded-full relative cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
            </div>
          </div>
          <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
              <span className="text-white font-semibold">Privacy & Security</span>
            </div>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
          <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg></div>
              <span className="text-white font-semibold">Language</span>
            </div>
            <span className="text-gray-400 text-sm">English</span>
          </div>
        </div>
      )}
    </div>
  );
}
""",
    "src/app/dashboard/notifications/page.tsx": """import Link from 'next/link';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'order', text: 'Rider Kamau has picked up your errand TSK-901.', time: '2m ago', read: false },
  { id: 2, type: 'promo', text: 'Get 10% off deliveries to Westlands this weekend!', time: '1h ago', read: false },
  { id: 3, type: 'payment', text: 'M-Pesa payment of Ksh 150 confirmed for TSK-901.', time: '3h ago', read: true },
  { id: 4, type: 'system', text: 'Welcome to TaskIt! Your account is set up.', time: '1d ago', read: true },
];

export default function NotificationsPage() {
  return (
    <div className="px-6 pt-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-white">Notifications</h1>
        <button className="text-gold-500 text-sm font-semibold hover:underline">Mark all read</button>
      </div>

      <div className="relative space-y-4">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-midnight-700"></div>

        {MOCK_NOTIFICATIONS.map((notif) => (
          <div key={notif.id} className="relative flex items-start space-x-4 pl-6">
            {/* Dot */}
            <div className={`absolute left-0 top-2 w-6 h-6 rounded-full flex items-center justify-center border-2 ${notif.read ? 'border-midnight-700 bg-midnight-800' : 'border-gold-500 bg-midnight-950 shadow-gold'}`}>
              {!notif.read && <div className="w-2 h-2 bg-gold-500 rounded-full"></div>}
            </div>
            
            {/* Card */}
            <div className={`flex-1 p-4 rounded-2xl border shadow-soft-dark ${notif.read ? 'bg-midnight-800 border-midnight-700 opacity-70' : 'bg-midnight-800 border-midnight-600'}`}>
              <p className="text-white text-sm font-medium">{notif.text}</p>
              <p className="text-gray-500 text-xs mt-2">{notif.time}</p>
            </div>
          </div>
        ))}
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

print("\nNav restructure and dashboard pages built successfully!")
