"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RiderBottomNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-md border-t border-midnight-800 z-50">
      <div className="max-w-lg mx-auto flex justify-between items-center px-6 py-3">
        
        <Link href="/rider" className={`flex flex-col items-center w-1/4 transition-colors ${isActive('/rider') && pathname === '/rider' ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Home</span>
        </Link>

        <Link href="/rider/earnings" className={`flex flex-col items-center w-1/4 transition-colors ${isActive('/rider/earnings') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Earnings</span>
        </Link>

        <Link href="/rider/history" className={`flex flex-col items-center w-1/4 transition-colors ${isActive('/rider/history') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[10px] mt-1 font-semibold">History</span>
        </Link>

        <Link href="/rider/account" className={`flex flex-col items-center w-1/4 transition-colors ${isActive('/rider/account') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Account</span>
        </Link>

      </div>
    </div>
  );
}
