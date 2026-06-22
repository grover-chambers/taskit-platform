"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RiderBottomNav from '@/components/RiderBottomNav';

export default function RiderLayout({ children }: { children: React.ReactNode }) {
  const [riderName, setRiderName] = useState('Rider');
  const [isOnline, setIsOnline] = useState(false);
  const [kycStatus, setKycStatus] = useState('PENDING');
  const [pendingDocCount, setPendingDocCount] = useState(0);

  useEffect(() => {
    fetch('/api/rider/stats')
      .then(r => r.json())
      .then(data => {
        if (data.riderDetail) {
          setRiderName(data.riderDetail.user?.name?.split(' ')[0] || 'Rider');
          setIsOnline(data.riderDetail.isOnline);
          setKycStatus(data.riderDetail.kycStatus || 'PENDING');
        }
      })
      .catch(() => {});

    fetch('/api/rider/documents')
      .then(r => r.json())
      .then(data => {
        const docs = data.documents || [];
        setPendingDocCount(docs.filter((d: any) => d.status === 'PENDING' || d.status === 'REJECTED').length);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex flex-col relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      <div className="sticky top-0 z-40 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-6 py-3 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-[10px]">Rider Mode</p>
          <h1 className="text-lg font-serif font-bold text-gold-500">TaskIt Pro</h1>
        </div>
        <div className="flex items-center gap-3">
          {isOnline && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-gold-500">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
              Online
            </div>
          )}
          {kycStatus !== 'VERIFIED' && pendingDocCount > 0 && (
            <Link href="/rider/documents" className="relative">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[7px] text-white flex items-center justify-center font-bold">{pendingDocCount}</span>
            </Link>
          )}
          <Link href="/rider/account" className="w-8 h-8 bg-midnight-800 border border-midnight-700 rounded-full flex items-center justify-center">
            <span className="text-gold-500 font-bold text-xs">{riderName.charAt(0).toUpperCase()}</span>
          </Link>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 relative z-10">
        {children}
      </main>

      <RiderBottomNav />
    </div>
  );
}
