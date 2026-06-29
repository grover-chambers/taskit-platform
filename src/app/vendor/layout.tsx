"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data?.user?.role === 'VENDOR') {
            setAuthorized(true);
          } else {
            router.replace('/auth/login');
          }
        } else {
          router.replace('/auth/login');
        }
      } catch {
        router.replace('/auth/login');
      }
      setChecking(false);
    })();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex flex-col relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 relative z-10">
        {children}
      </main>

      <VendorNav />
    </div>
  );
}

function VendorNav() {
  const pathname = usePathname();

  const items = [
    { href: '/vendor', icon: '📋', label: 'Orders', match: (p: string) => p === '/vendor' },
    { href: '/vendor/orders/new', icon: '➕', label: 'New', match: (p: string) => p === '/vendor/orders/new' },
    { href: '/vendor/billing', icon: '📊', label: 'Billing', match: (p: string) => p === '/vendor/billing' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-md border-t border-midnight-800 z-50">
      <div className="max-w-lg mx-auto flex justify-between items-center px-6 py-3">
        {items.map(item => {
          const active = item.match(pathname);
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center w-1/3 ${active ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
              <span className="text-lg">{item.icon}</span>
              <span className={`text-[9px] mt-0.5 font-semibold ${active ? 'text-gold-500' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
