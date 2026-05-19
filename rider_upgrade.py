import os

files = {
    "src/app/dashboard/layout.tsx": """import BottomNav from '@/components/BottomNav';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex flex-col relative">
      {/* 12% Visible Background Watermark (Consistent Overlay Fix) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12]" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/[0.88]"></div>
      </div>

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-xs">Good morning</p>
          <h1 className="text-lg font-serif font-bold text-white">Hello, Brayo</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/notifications" className="relative text-gray-400 hover:text-gold-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-gold-500 rounded-full"></span>
          </Link>
          <div className="w-9 h-9 bg-midnight-800 border border-midnight-700 rounded-full flex items-center justify-center">
            <span className="text-gold-500 font-bold text-sm">B</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-28 relative z-10">
        {children}
      </main>

      <div className="relative z-50">
        <BottomNav />
      </div>
    </div>
  );
}
""",
    "src/app/rider/page.tsx": """"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [status, setStatus] = useState('assigned'); // 'idle', 'assigned', 'picked_up', 'delivered'

  const activeDelivery = {
    id: 'TSK-901',
    pickup: 'Pickup: Blue envelope from Office 402, Ambank House, CBD',
    dropoff: 'Dropoff: Customer Wanjiku, Moi Avenue',
    customerPhone: '+254712345678',
    fee: 250, // Rider's cut
  };

  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative flex flex-col">
      {/* 12% Visible Background Watermark */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12]" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/[0.88]"></div>
      </div>

      <div className="relative z-10 pb-8 flex-1">
        {/* Header & Online Toggle */}
        <div className="p-6 pt-8 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Welcome back</p>
            <h1 className="text-2xl font-serif font-bold text-white">Kamau M.</h1>
          </div>
          <Link href="/auth/login" className="text-gray-400 hover:text-gold-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </Link>
        </div>

        {/* Go Online / Offline Massive Toggle */}
        <div className="px-6 mb-6">
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-full p-6 rounded-2xl border-2 shadow-soft-dark flex justify-between items-center transition-all ${isOnline ? 'bg-gold-500/10 border-gold-500' : 'bg-midnight-800 border-midnight-700'}`}
          >
            <div>
              <h2 className={`text-xl font-bold ${isOnline ? 'text-gold-500' : 'text-white'}`}>
                {isOnline ? 'You are Online' : 'You are Offline'}
              </h2>
              <p className="text-gray-400 text-sm mt-1">{isOnline ? 'Waiting for nearby errands...' : 'Go online to receive tasks'}</p>
            </div>
            <div className={`w-14 h-8 rounded-full relative transition-colors flex-shrink-0 ${isOnline ? 'bg-gold-500' : 'bg-midnight-600'}`}>
              <div className={`w-7 h-7 bg-white rounded-full absolute top-0.5 shadow transition-all ${isOnline ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
          </button>
        </div>

        {/* Earnings Strip */}
        <div className="px-6 mb-6">
          <div className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl shadow-soft-dark flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Today's Earnings</p>
              <p className="text-3xl font-serif font-bold text-white mt-1">Ksh 1,200</p>
            </div>
            <div className="bg-gold-500/20 text-gold-500 px-3 py-2 rounded-xl font-bold text-sm">
              ★ 4.9
            </div>
          </div>
        </div>

        {/* Active Order Section */}
        {isOnline && (
          <div className="px-6 space-y-4">
            <h3 className="text-white font-bold text-lg">Active Task</h3>
            
            {status === 'assigned' && (
              <div className="bg-midnight-800 p-6 rounded-2xl border border-gold-500/50 shadow-gold text-left space-y-4">
                <div className="flex justify-between items-center border-b border-midnight-700 pb-3">
                  <span className="font-mono text-sm text-gold-500 font-bold">{activeDelivery.id}</span>
                  <span className="text-xs px-2 py-1 bg-gold-500/10 text-gold-500 rounded-full font-semibold">New Task</span>
                </div>
                <div>
                  <p className="text-xs text-gold-500 uppercase tracking-wider font-semibold mb-1">Pickup</p>
                  <p className="text-white font-medium">{activeDelivery.pickup}</p>
                </div>
                <div>
                  <p className="text-xs text-gold-500 uppercase tracking-wider font-semibold mb-1">Drop-off</p>
                  <p className="text-white font-medium">{activeDelivery.dropoff}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-midnight-700">
                  <span className="text-white font-bold text-lg">Fee: Ksh {activeDelivery.fee}</span>
                  <a href={'tel:' + activeDelivery.customerPhone} className="bg-midnight-700 border border-midnight-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-midnight-600 transition-colors flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span>Call</span>
                  </a>
                </div>
                <button 
                  onClick={() => setStatus('picked_up')}
                  className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold text-lg shadow-gold active:scale-95 transition-transform mt-2"
                >
                  Mark as Picked Up
                </button>
              </div>
            )}

            {status === 'picked_up' && (
               <div className="bg-midnight-800 p-6 rounded-2xl border border-blue-500/50 shadow-soft-dark text-left space-y-4">
                 <div className="flex justify-between items-center border-b border-midnight-700 pb-3">
                   <span className="font-mono text-sm text-blue-400 font-bold">{activeDelivery.id}</span>
                   <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full font-semibold">In Transit</span>
                 </div>
                 <div>
                   <p className="text-xs text-blue-400 uppercase tracking-wider font-semibold mb-1">Delivering to</p>
                   <p className="text-white font-medium">{activeDelivery.dropoff}</p>
                 </div>
                 <a href={'tel:' + activeDelivery.customerPhone} className="block w-full text-center bg-midnight-700 border border-midnight-600 text-white py-3 rounded-xl font-semibold hover:bg-midnight-600 transition-colors">
                   Call Customer
                 </a>
                 <button 
                   onClick={() => setStatus('delivered')}
                   className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold text-lg shadow-gold active:scale-95 transition-transform"
                 >
                   Mark as Delivered
                 </button>
               </div>
            )}

            {status === 'delivered' && (
              <div className="text-center p-6 bg-midnight-800 rounded-2xl border border-midnight-700 shadow-soft-dark">
                <p className="text-gold-500 text-4xl mb-2">&#10003;</p>
                <p className="text-lg font-bold text-white">Order Complete!</p>
                <p className="text-gray-400 text-sm mt-1">+Ksh {activeDelivery.fee} added to balance.</p>
                <button onClick={() => setStatus('assigned')} className="mt-4 text-gold-500 font-semibold hover:underline">Wait for next task</button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
"""
}

for filepath, content in files.items():
    dirpath = os.path.dirname(filepath)
    if dirpath:
        os.makedirs(dirpath, exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content.strip() + "\n")
    print(f"Created: {filepath}")

print("\nRider Dashboard & Backgrounds Upgraded!")
