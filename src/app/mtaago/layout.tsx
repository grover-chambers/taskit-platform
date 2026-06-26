"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MtaagoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex flex-col relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      <div className="sticky top-0 z-40 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-haraka-500 font-bold text-lg">Mtaago</span>
          <span className="text-gray-600 text-[10px] font-semibold">by TaskIt</span>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 relative z-10">
        {children}
      </main>

      <MtaagoNav />
    </div>
  );
}

function MtaagoNav() {
  const pathname = usePathname();

  const items = [
    { href: '/mtaago', icon: '🎛️', label: 'Home', match: (p: string) => p === '/mtaago' },
    { href: '/mtaago/orders/new', icon: '➕', label: 'New', match: (p: string) => p === '/mtaago/orders/new' },
    { href: '/mtaago/riders', icon: '🛵', label: 'Riders', match: (p: string) => p.startsWith('/mtaago/riders') },
    { href: '/mtaago/billing', icon: '💰', label: 'Billing', match: (p: string) => p === '/mtaago/billing' },
    { href: '/mtaago/settings', icon: '⚙️', label: 'More', match: (p: string) => p.startsWith('/mtaago/settings') || p.startsWith('/mtaago/notifications') || p.startsWith('/mtaago/orders') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-md border-t border-midnight-800 z-50">
      <div className="max-w-lg mx-auto flex justify-between items-center px-6 py-3">
        {items.map(item => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center w-1/5 py-1 ${active ? 'text-haraka-500' : 'text-gray-500 hover:text-gray-300'} ${active ? 'border-t-2 border-haraka-500 -mt-[2px]' : ''}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className={`text-[9px] mt-0.5 font-semibold ${active ? 'text-haraka-500' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
