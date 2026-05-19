"use client";

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
