"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "Command Center", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/dispatch", label: "Dispatch Queue", icon: "M13 10V3L4 14h7v7l9-11h-7z", live: true },
  { href: "/admin/riders", label: "Fleet & Riders", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { href: "/admin/orders", label: "Orders & Disputes", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { href: "/admin/support", label: "Support", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", badge: true },
  { href: "/admin/finance", label: "Finance", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/admin/enterprise", label: "Enterprise", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { href: "/admin/config", label: "Platform Config", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function AdminShell({ children, adminName }: { children: React.ReactNode; adminName: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch('/api/admin/support')
      .then(r => r.json())
      .then(d => setSupportCount(d.openCount || 0))
      .catch(() => {});
  }, [pathname]);

  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setDrawerOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-midnight-900/95 backdrop-blur-md border-r border-midnight-800 p-6 flex flex-col justify-between transform transition-transform duration-300 md:relative md:transform-none md:z-10 ${drawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-brand-500 font-serif">TaskIt</h1>
            <button onClick={() => setDrawerOpen(false)} className="md:hidden text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Admin Console</p>

          <nav className="mt-8 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-colors ${isActive ? 'bg-midnight-800 text-gold-500' : 'text-gray-400 hover:bg-midnight-800 hover:text-white'}`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  <span className="text-sm font-semibold">{item.label}</span>
                  {item.live && (
                    <span className="text-[9px] bg-gold-500 text-black px-1.5 py-0.5 rounded-full font-bold ml-auto">LIVE</span>
                  )}
                  {item.badge && supportCount > 0 && (
                    <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold ml-auto">{supportCount}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-midnight-700 pt-4 space-y-2">
          <p className="text-white text-sm font-semibold">{adminName}</p>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-red-400 text-sm hover:text-red-300 transition-colors">Sign Out</button>
          </form>
          <Link href="/" className="block text-gray-500 text-sm hover:text-gold-500 transition-colors">&larr; Back to Platform</Link>
        </div>
      </aside>

      <main className="relative z-10 flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-4 py-3 flex items-center justify-between md:hidden">
          <button onClick={() => setDrawerOpen(true)} className="text-gray-300 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="text-lg font-bold text-brand-500 font-serif">TaskIt</h1>
          <div className="w-8 h-8 bg-midnight-700 rounded-full flex items-center justify-center text-gold-500 text-xs font-bold">
            {adminName.charAt(0).toUpperCase()}
          </div>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
