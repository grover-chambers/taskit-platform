"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = pathname.includes('marketplace') ? 'Marketplace' : 'Run an Errand';

  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex flex-col relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      <div className="sticky top-0 z-10 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-gray-400 hover:text-gold-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h1 className="text-lg font-bold text-white">{title}</h1>
        <div className="w-6" />
      </div>

      <main className="flex-1 relative z-10 overflow-y-auto pb-8">
        {children}
      </main>
    </div>
  );
}
