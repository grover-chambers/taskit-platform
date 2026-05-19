import os

files = {
    "src/app/auth/layout.tsx": """export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative flex flex-col">
      {/* 12% Visible Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        {/* 88% overlay to make it 12% visible and ensure text readability */}
        <div className="absolute inset-0 bg-midnight-950/88"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
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
      {/* 12% Visible Background Watermark */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12]" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/88"></div>
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
    "src/app/auth/signup/page.tsx": """"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [role, setRole] = useState('customer');

  return (
    <div className="flex-1 flex flex-col justify-center p-6 max-w-md mx-auto w-full">
      <h1 className="text-3xl font-serif font-bold text-white">Create Account</h1>
      <p className="text-gray-400 mt-2">Join Nairobi's fastest errand platform</p>

      <div className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-400 block mb-2">Full Name</label>
          <input 
            type="text" 
            placeholder="e.g., Brayo Otieno"
            className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-400 block mb-2">Phone Number</label>
          <input 
            type="tel" 
            placeholder="+254 7XX XXX XXX"
            className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="text-sm font-semibold text-gray-400 block mb-2">I am a...</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setRole('customer')}
              className={`p-4 rounded-xl border-2 transition-all text-center font-semibold
                ${role === 'customer' ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-midnight-700 bg-midnight-800 text-gray-400 hover:border-midnight-600'}`}
            >
              Customer
            </button>
            <button 
              onClick={() => setRole('rider')}
              className={`p-4 rounded-xl border-2 transition-all text-center font-semibold
                ${role === 'rider' ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-midnight-700 bg-midnight-800 text-gray-400 hover:border-midnight-600'}`}
            >
              Rider
            </button>
          </div>
        </div>

        {/* Conditional Rider Fields */}
        {role === 'rider' && (
          <div className="space-y-4 pt-2 animate-fade-in">
            <div className="bg-gold-500/10 border border-gold-500/30 p-3 rounded-xl text-gold-500 text-sm">
              To join as a rider, please provide your vehicle details for verification.
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400 block mb-2">Bike Plate Number</label>
              <input 
                type="text" 
                placeholder="e.g., KBA 123J"
                className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400 block mb-2">Driving License Number</label>
              <input 
                type="text" 
                placeholder="e.g., 123456789"
                className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
              />
            </div>
          </div>
        )}
      </div>

      <button className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold text-lg shadow-gold mt-8 hover:bg-gold-400 transition-colors active:scale-[0.98]">
        Create Account
      </button>

      <p className="text-center text-gray-500 text-sm mt-6">
        Already have an account? <Link href="/auth/login" className="text-gold-500 font-semibold hover:underline">Sign In</Link>
      </p>
    </div>
  );
}
""",
    "src/app/rider/page.tsx": """"use client";

import { useState } from 'react';

export default function RiderDashboard() {
  const [status, setStatus] = useState('assigned');

  const activeDelivery = {
    id: 'TSK-901',
    pickup: 'Pickup: Blue envelope from Office 402, Ambank House, CBD',
    dropoff: 'Dropoff: Customer Wanjiku, Moi Avenue',
    customerPhone: '+254712345678',
  };

  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative flex flex-col">
      {/* 12% Visible Background Watermark */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12]" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/88"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pb-24 flex-1">
        <div className="p-6 pt-8">
          <p className="text-gray-400 text-sm">Active Duty</p>
          <h1 className="text-2xl font-serif font-bold text-white">Rider Dashboard</h1>
        </div>

        <div className="px-6 space-y-4">
          <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark text-left space-y-4">
            <div className="flex justify-between items-center border-b border-midnight-700 pb-3">
              <span className="font-mono text-sm text-gold-500 font-bold">{activeDelivery.id}</span>
              <span className="text-xs px-2 py-1 bg-gold-500/10 text-gold-500 rounded-full font-semibold">Active</span>
            </div>
            <div>
              <p className="text-xs text-gold-500 uppercase tracking-wider font-semibold mb-1">Pickup</p>
              <p className="text-white font-medium">{activeDelivery.pickup}</p>
            </div>
            <div>
              <p className="text-xs text-gold-500 uppercase tracking-wider font-semibold mb-1">Drop-off</p>
              <p className="text-white font-medium">{activeDelivery.dropoff}</p>
            </div>
            <a href={'tel:' + activeDelivery.customerPhone} className="block w-full text-center bg-midnight-700 border border-midnight-600 text-white py-3 rounded-xl font-semibold hover:bg-midnight-600 transition-colors mt-2">
              Call Customer
            </a>
          </div>

          {status === 'assigned' && (
            <button 
              onClick={() => setStatus('picked_up')}
              className="w-full bg-gold-500 text-midnight-950 py-5 rounded-2xl font-bold text-lg shadow-gold active:scale-95 transition-transform"
            >
              Mark as Picked Up
            </button>
          )}

          {status === 'picked_up' && (
            <button 
              onClick={() => setStatus('delivered')}
              className="w-full bg-gold-500 text-midnight-950 py-5 rounded-2xl font-bold text-lg shadow-gold active:scale-95 transition-transform"
            >
              Mark as Delivered
            </button>
          )}

          {status === 'delivered' && (
            <div className="text-center p-6 bg-midnight-800 rounded-2xl border border-midnight-700 shadow-soft-dark">
              <p className="text-gold-500 text-4xl mb-2">&#10003;</p>
              <p className="text-lg font-bold text-white">Order Complete</p>
              <p className="text-gray-400 text-sm mt-1">Wait for the next assignment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
""",
    "src/app/page.tsx": """import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative flex flex-col">
      
      {/* Hero Background Image - Adjusted for 12% consistency */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        {/* Gradient Overlay allowing more image visibility at the top */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/85 via-midnight-950/80 to-midnight-950"></div>
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

print("\nBackground consistency & Rider Auth built successfully!")
