"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHeader() {
  const [userName, setUserName] = useState("there");
  const [initial, setInitial] = useState("T");

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(s => {
        if (s?.user?.name) {
          setUserName(s.user.name.split(' ')[0]);
          setInitial(s.user.name.charAt(0).toUpperCase());
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="sticky top-0 z-40 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-6 py-4 flex justify-between items-center">
      <div>
        <p className="text-gray-400 text-xs">{getGreeting()}</p>
        <h1 className="text-lg font-serif font-bold text-white">Hello, {userName} 👋</h1>
      </div>
      <div className="flex items-center space-x-3">
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254797100144'}?text=${encodeURIComponent('Hi TaskIt Support')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative text-[#25D366] hover:text-[#25D366]/80 transition-colors"
          title="Chat with Support"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
        <Link href="/dashboard/notifications" className="relative text-gray-400 hover:text-gold-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute top-0 right-0 w-2 h-2 bg-gold-500 rounded-full"></span>
        </Link>
        <div className="w-9 h-9 bg-midnight-800 border border-midnight-700 rounded-full flex items-center justify-center">
          <span className="text-gold-500 font-bold text-sm">{initial}</span>
        </div>
      </div>
    </div>
  );
}
