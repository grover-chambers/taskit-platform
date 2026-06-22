"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RiderBottomNav from '@/components/RiderBottomNav';

export default function RiderLayout({ children }: { children: React.ReactNode }) {
  const [riderName, setRiderName] = useState('Rider');
  const [isOnline, setIsOnline] = useState(false);
  const [kycStatus, setKycStatus] = useState('PENDING');
  const [pendingDocCount, setPendingDocCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

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

    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => {
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => {});

    const interval = setInterval(() => {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(data => setUnreadCount(data.unreadCount || 0))
        .catch(() => {});

      fetch('/api/rider/stats')
        .then(r => r.json())
        .then(data => {
          if (data.riderDetail) setIsOnline(data.riderDetail.isOnline);
        })
        .catch(() => {});
    }, 15000);

    return () => clearInterval(interval);
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
          <div className={`flex items-center gap-1 text-[10px] font-bold ${isOnline ? 'text-gold-500' : 'text-gray-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-gold-500' : 'bg-gray-500'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </div>
          {kycStatus !== 'VERIFIED' && pendingDocCount > 0 && (
            <Link href="/rider/verify" className="relative">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[7px] text-white flex items-center justify-center font-bold">{pendingDocCount}</span>
            </Link>
          )}
          <Link href="/rider/notifications" className="relative">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[7px] text-white flex items-center justify-center font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </Link>
          <Link href="/rider/profile" className="w-8 h-8 bg-midnight-800 border border-midnight-700 rounded-full flex items-center justify-center">
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
