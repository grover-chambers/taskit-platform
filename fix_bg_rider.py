import os

files = {
    "src/components/RiderBottomNav.tsx": """"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RiderBottomNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-md border-t border-midnight-800 z-50">
      <div className="max-w-lg mx-auto flex justify-between items-center px-6 py-3">
        
        <Link href="/rider" className={`flex flex-col items-center w-1/4 transition-colors ${isActive('/rider') && pathname === '/rider' ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Home</span>
        </Link>

        <Link href="/rider/earnings" className={`flex flex-col items-center w-1/4 transition-colors ${isActive('/rider/earnings') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Earnings</span>
        </Link>

        <Link href="/rider/history" className={`flex flex-col items-center w-1/4 transition-colors ${isActive('/rider/history') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[10px] mt-1 font-semibold">History</span>
        </Link>

        <Link href="/rider/account" className={`flex flex-col items-center w-1/4 transition-colors ${isActive('/rider/account') ? 'text-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] mt-1 font-semibold">Account</span>
        </Link>

      </div>
    </div>
  );
}
""",
    "src/app/rider/layout.tsx": """import RiderBottomNav from '@/components/RiderBottomNav';
import Link from 'next/link';

export default function RiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex flex-col relative">
      {/* Fixed Background (15% Visible) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-xs">Rider Mode</p>
          <h1 className="text-lg font-serif font-bold text-gold-500">TaskIt Pro</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/login" className="text-gray-400 hover:text-gold-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 relative z-10">
        {children}
      </main>

      <RiderBottomNav />
    </div>
  );
}
""",
    "src/app/rider/page.tsx": """"use client";

import { useState } from 'react';

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [status, setStatus] = useState('assigned'); // 'idle', 'assigned', 'picked_up', 'delivered'

  const activeDelivery = {
    id: 'TSK-901',
    pickup: 'Pickup: Blue envelope from Office 402, Ambank House, CBD',
    dropoff: 'Dropoff: Customer Wanjiku, Moi Avenue',
    customerPhone: '+254712345678',
    fee: 250, 
  };

  return (
    <div className="p-6 pt-4">
      {/* Go Online / Offline Massive Toggle */}
      <div className="mb-6">
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
      <div className="mb-6">
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
        <div className="space-y-4">
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
  );
}
""",
    "src/app/dashboard/layout.tsx": """import BottomNav from '@/components/BottomNav';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex flex-col relative">
      {/* Fixed Background (15% Visible) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
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
    "src/app/auth/layout.tsx": """export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative flex flex-col">
      {/* Fixed Background (15% Visible) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
""",
    "src/app/page.tsx": """import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative flex flex-col">
      
      {/* Hero Background Image (15% visible at top, fading to solid) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/80 via-midnight-950/85 to-midnight-950"></div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 max-w-lg mx-auto w-full px-6 pt-16 pb-32">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gold-500 rounded-2xl flex items-center justify-center shadow-gold mb-6 mx-auto">
            <svg className="w-10 h-10 text-midnight-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-serif font-bold text-white tracking-tight">TaskIt</h1>
          <p className="text-gold-500 mt-2 text-lg font-semibold uppercase tracking-widest">Nairobi Errands</p>
          <p className="text-gray-300 mt-6 text-lg leading-relaxed max-w-xs mx-auto">
            We run your errands, so you don't have to. Fast, reliable, and seamless.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-white text-center mb-6">Why Choose TaskIt?</h2>
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Flat-Rate Zone Pricing</h3>
                <p className="text-gray-300 text-sm mt-1">No hidden fees. Know exactly what you pay before you book.</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">One-Tap M-Pesa</h3>
                <p className="text-gray-300 text-sm mt-1">Seamless STK Push checkout. Pay securely from your phone.</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Real-Time Tracking</h3>
                <p className="text-gray-300 text-sm mt-1">From rider assignment to delivery, you are always in the loop.</p>
              </div>
            </div>
          </div>
        </div>

        {/* For Riders Section */}
        <div className="mb-12 bg-gold-500/10 border border-gold-500/30 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full -mr-10 -mt-10"></div>
          <h2 className="text-gold-500 font-bold text-2xl mb-2 font-serif">For Riders</h2>
          <p className="text-gray-200 text-sm mb-4">Turn your smartphone into a money-making machine. Flexible hours, reliable payouts.</p>
          <Link href="/auth/signup" className="inline-block bg-gold-500 text-midnight-950 px-6 py-2 rounded-xl font-bold text-sm shadow-gold hover:bg-gold-400 transition-colors">
            Join as a Rider
          </Link>
        </div>

        {/* Contact / About */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-300 text-sm mb-2">Have questions or a corporate inquiry?</p>
          <a href="tel:0707075630" className="text-gold-500 font-semibold hover:underline text-lg">0707 075 630</a>
          <p className="text-gray-500 text-xs mt-6">&copy; {new Date().getFullYear()} TaskIt by Squareroot INC. All rights reserved.</p>
        </div>

      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-md border-t border-midnight-700 p-4 z-50">
        <div className="max-w-lg mx-auto flex space-x-3">
          <Link 
            href="/auth/login" 
            className="flex-1 bg-midnight-800 text-white border border-midnight-700 py-4 rounded-2xl font-bold text-center text-lg hover:bg-midnight-700 transition-colors active:scale-[0.98]"
          >
            Login
          </Link>
          <Link 
            href="/auth/signup" 
            className="flex-1 bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold text-center text-lg shadow-gold hover:bg-gold-400 transition-colors active:scale-[0.98]"
          >
            Join Us
          </Link>
        </div>
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

print("\nBackgrounds Fixed & Rider Nav Added!")
