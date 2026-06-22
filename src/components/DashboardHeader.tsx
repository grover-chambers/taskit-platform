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
      <div className="flex items-center space-x-4">
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
