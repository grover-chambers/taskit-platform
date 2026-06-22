"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  {
    href: '/rider/wallet',
    label: 'Wallet',
    position: 0,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    ),
  },
  {
    href: '/rider/verify',
    label: 'Verify',
    position: 1,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
  },
  {
    href: '/rider',
    label: 'Home',
    position: 2,
    isHome: true,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
  },
  {
    href: '/rider/profile',
    label: 'Profile',
    position: 3,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    ),
  },
  {
    href: '/rider/settings',
    label: 'Settings',
    position: 4,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
  },
];

export default function RiderBottomNav() {
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === '/rider') return pathname === '/rider';
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-lg mx-auto relative">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          if (tab.isHome) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="absolute left-1/2 -translate-x-1/2 -top-6 z-10"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                  active
                    ? 'bg-gold-500 text-midnight-950 shadow-gold'
                    : 'bg-gold-500/80 text-midnight-950 shadow-gold'
                }`}>
                  {tab.icon}
                </div>
              </Link>
            );
          }
          return null;
        })}

        <div className="bg-midnight-900/95 backdrop-blur-md border-t border-midnight-800">
          <div className="flex justify-between items-center px-2 py-2">
            {tabs.filter(t => !t.isHome).map((tab) => {
              const active = isActive(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex flex-col items-center flex-1 transition-colors ${
                    active ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span className="text-[9px] mt-0.5 font-semibold">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
