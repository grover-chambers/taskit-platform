"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { EnterpriseContext } from './EnterpriseContext';

export default function MtaagoLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [subRole, setSubRole] = useState<'OWNER' | 'OPERATOR' | null>(null);
  const [enterprise, setEnterprise] = useState<{ id: string; name: string; rate: number; active: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/api/enterprise/me');
      if (res.ok) {
        const data = await res.json();
        setSubRole(data.subRole);
        setEnterprise(data.enterprise);
        setAuthorized(true);
      } else {
        router.replace('/auth/login');
      }
    } catch {
      router.replace('/auth/login');
    }
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-haraka-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <EnterpriseContext.Provider value={{ subRole, enterprise, loading }}>
      <div className="min-h-screen bg-midnight-950 antialiased flex flex-col relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
          <div className="absolute inset-0 bg-midnight-950/85"></div>
        </div>

        <div className="sticky top-0 z-40 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-haraka-500 font-bold text-lg">Mtaago</span>
            <span className="text-gray-600 text-[10px] font-semibold">by TaskIt</span>
          </div>
          {!loading && subRole && (
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                subRole === 'OWNER'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-haraka-500/15 text-haraka-500 border border-haraka-500/30'
              }`}>
                {subRole === 'OWNER' ? 'Owner' : 'Operator'}
              </span>
              {enterprise && (
                <span className="text-gray-500 text-[9px] font-semibold hidden sm:inline">{enterprise.name}</span>
              )}
            </div>
          )}
        </div>

        <main className="flex-1 overflow-y-auto pb-24 relative z-10">
          {children}
        </main>

        <MtaagoNav subRole={subRole} />
      </div>
    </EnterpriseContext.Provider>
  );
}

function MtaagoNav({ subRole }: { subRole: string | null }) {
  const pathname = usePathname();

  const operatorItems = [
    { href: '/mtaago', icon: '🎛️', label: 'Workspace', match: (p: string) => p === '/mtaago' },
    { href: '/mtaago/orders/new', icon: '➕', label: 'New Order', match: (p: string) => p === '/mtaago/orders/new' },
    { href: '/mtaago/riders', icon: '🛵', label: 'Riders', match: (p: string) => p.startsWith('/mtaago/riders') },
    { href: '/mtaago/billing', icon: '💰', label: 'Billing', match: (p: string) => p === '/mtaago/billing' },
    { href: '/mtaago/settings', icon: '⚙️', label: 'More', match: (p: string) => p.startsWith('/mtaago/settings') || p.startsWith('/mtaago/notifications') || p.startsWith('/mtaago/orders') },
  ];

  const ownerItems = [
    { href: '/mtaago', icon: '👁️', label: 'Overview', match: (p: string) => p === '/mtaago' },
    { href: '/mtaago/riders', icon: '🛵', label: 'Riders', match: (p: string) => p.startsWith('/mtaago/riders') },
    { href: '/mtaago/billing', icon: '💰', label: 'Billing', match: (p: string) => p === '/mtaago/billing' },
    { href: '/mtaago/notifications', icon: '🔔', label: 'Alerts', match: (p: string) => p.startsWith('/mtaago/notifications') },
    { href: '/mtaago/settings', icon: '⚙️', label: 'Settings', match: (p: string) => p.startsWith('/mtaago/settings') || p.startsWith('/mtaago/orders') },
  ];

  const items = subRole === 'OWNER' ? ownerItems : operatorItems;

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
