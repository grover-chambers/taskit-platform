"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { EnterpriseContext } from './EnterpriseContext';

export default function MtaaGoDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [subRole, setSubRole] = useState<'OWNER' | 'OPERATOR' | null>(null);
  const [enterprise, setEnterprise] = useState<{ id: string; name: string; rate: number; active: boolean } | null>(null);
  const [pricing, setPricing] = useState<{
    pricingModel: string;
    fuelPricePerLiter: number | null;
    fuelConsumptionKmpl: number | null;
    markupPercent: number;
    pricePerKm: number | null;
    baseFare: number;
    minimumFare: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/api/enterprise/me');
      if (res.ok) {
        const data = await res.json();
        setSubRole(data.subRole);
        setEnterprise(data.enterprise);
        setPricing(data.pricing || null);
        setAuthorized(true);
      } else {
        router.replace('/mtaago/login');
      }
    } catch {
      router.replace('/mtaago/login');
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

  const isOwner = subRole === 'OWNER';

  return (
    <EnterpriseContext.Provider value={{ subRole, enterprise, pricing, loading }}>
      {isOwner ? (
        <OwnerShell sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} subRole={subRole} enterprise={enterprise}>
          {children}
        </OwnerShell>
      ) : (
        <OperatorShell subRole={subRole} enterprise={enterprise}>
          {children}
        </OperatorShell>
      )}
    </EnterpriseContext.Provider>
  );
}

function OwnerShell({ sidebarCollapsed, setSidebarCollapsed, subRole, enterprise, children }: {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  subRole: string | null;
  enterprise: { id: string; name: string; rate: number; active: boolean } | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex relative">
      <aside className={`fixed top-0 left-0 h-full z-50 bg-midnight-900 border-r border-midnight-800 flex flex-col transition-all duration-200 ${sidebarCollapsed ? 'w-16' : 'w-56'}`}>
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-4 py-4 border-b border-midnight-800`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <span className="text-haraka-500 font-bold text-lg">mtaa</span>
              <span className="text-amber-400 font-bold text-lg">Go</span>
              <span className="text-gray-600 text-[9px] font-semibold ml-1">by TaskIt</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-midnight-800"
          >
            <svg className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {!sidebarCollapsed && enterprise && (
          <div className="px-4 py-3 border-b border-midnight-800">
            <p className="text-white text-sm font-bold truncate">{enterprise.name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="bg-amber-500/15 text-amber-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">OWNER</span>
              <div className={`w-1.5 h-1.5 rounded-full ${enterprise.active ? 'bg-green-400' : 'bg-red-400'}`} />
            </div>
          </div>
        )}

        <nav className="flex-1 py-3 px-2 space-y-1">
          <OwnerSidebarItem href="/mtaago" icon="dashboard" label="Dashboard" collapsed={sidebarCollapsed} />
          <OwnerSidebarItem href="/mtaago/orders" icon="orders" label="Orders" collapsed={sidebarCollapsed} />
          <OwnerSidebarItem href="/mtaago/riders" icon="fleet" label="Fleet" collapsed={sidebarCollapsed} />
          <OwnerSidebarItem href="/mtaago/billing" icon="invoices" label="Invoices" collapsed={sidebarCollapsed} />
          <OwnerSidebarItem href="/mtaago/notifications" icon="alerts" label="Alerts" collapsed={sidebarCollapsed} />
          <OwnerSidebarItem href="/mtaago/settings" icon="settings" label="Settings" collapsed={sidebarCollapsed} />
        </nav>

        <div className="px-2 pb-4 space-y-1">
          <button
            onClick={() => signOut({ callbackUrl: '/mtaago/login' })}
            className={`w-full flex items-center gap-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors ${sidebarCollapsed ? 'justify-center p-3' : 'px-4 py-2.5'}`}
          >
            <SignOutIcon />
            {!sidebarCollapsed && <span className="text-sm font-semibold">Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-200 ${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}>
        <div className="sticky top-0 z-40 bg-midnight-950/80 backdrop-blur-md border-b border-midnight-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-haraka-500 font-bold text-lg">mtaa</span>
            <span className="text-amber-400 font-bold text-lg">Go</span>
            <span className="text-gray-600 text-[9px] font-semibold">Enterprise</span>
          </div>
          {enterprise && (
            <span className="text-gray-500 text-[10px] font-semibold">{enterprise.name}</span>
          )}
        </div>
        <div className="p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}

function OperatorShell({ subRole, enterprise, children }: {
  subRole: string | null;
  enterprise: { id: string; name: string; rate: number; active: boolean } | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex flex-col relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      <div className="sticky top-0 z-40 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-haraka-500 font-bold text-lg">mtaa</span>
          <span className="text-amber-400 font-bold text-lg">Go</span>
          <span className="text-gray-600 text-[10px] font-semibold">by TaskIt</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-haraka-500/15 text-haraka-500 border border-haraka-500/30 text-[9px] font-bold px-2 py-0.5 rounded-md">
            OPERATOR
          </span>
          {enterprise && (
            <span className="text-gray-500 text-[9px] font-semibold hidden sm:inline">{enterprise.name}</span>
          )}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 relative z-10">
        {children}
      </main>

      <OperatorNav />
    </div>
  );
}

function OperatorNav() {
  const pathname = usePathname();

  const items = [
    { href: '/mtaago', icon: '🎛️', label: 'Workspace', match: (p: string) => p === '/mtaago' },
    { href: '/mtaago/orders/new', icon: '➕', label: 'New Order', match: (p: string) => p === '/mtaago/orders/new' },
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

function OwnerSidebarItem({ href, icon, label, collapsed }: { href: string; icon: string; label: string; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = href === '/mtaago' ? pathname === '/mtaago' : pathname.startsWith(href) && href !== '/mtaago';

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl transition-colors ${collapsed ? 'justify-center p-3' : 'px-4 py-2.5'} ${isActive ? 'bg-haraka-500/10 text-haraka-500' : 'text-gray-400 hover:bg-midnight-800 hover:text-white'}`}
      title={collapsed ? label : undefined}
    >
      <SidebarIcon type={icon} active={isActive} />
      {!collapsed && <span className="text-sm font-semibold">{label}</span>}
    </Link>
  );
}

function SidebarIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? 'text-haraka-500' : 'text-gray-500';
  switch (type) {
    case 'dashboard':
      return <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
    case 'orders':
      return <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
    case 'fleet':
      return <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    case 'invoices':
      return <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>;
    case 'alerts':
      return <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
    case 'settings':
      return <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    default:
      return <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
  }
}

function SignOutIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
}
