"use client";

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
