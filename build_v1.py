import os

files = {
    "public/manifest.json": """{
  "name": "TaskIt - Nairobi Errands",
  "short_name": "TaskIt",
  "description": "Fast, Reliable Errands & Delivery for Modern Nairobi",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#050505",
  "theme_color": "#FFD700",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
""",
    "src/app/globals.css": """@import "tailwindcss";

@theme {
  /* Midnight & Gold Palette */
  --color-midnight-950: #050505; /* Deepest background */
  --color-midnight-900: #0A0A0A;
  --color-midnight-800: #171717; /* Card backgrounds */
  --color-midnight-700: #262626; /* Borders / Hover */
  --color-midnight-600: #404040;

  --color-gold-500: #FFD700; /* Primary Action */
  --color-gold-600: #EAB308;
  --color-gold-400: #FDE047;
  --color-gold-300: #FEF08A;
  
  --color-gray-400: #A3A3A3;
  --color-gray-500: #737373;

  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-serif: var(--font-playfair), Georgia, serif;

  --shadow-gold: 0 10px 25px -5px rgba(255, 215, 0, 0.3);
  --shadow-soft-dark: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
}

body {
  background-color: var(--color-midnight-950);
  color: #FFFFFF;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--color-midnight-950);
}
::-webkit-scrollbar-thumb {
  background: var(--color-midnight-700);
  border-radius: 9999px;
}
""",
    "src/app/layout.tsx": """import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "TaskIt - Nairobi Errands",
  description: "Fast, Reliable Errands & Delivery for Modern Nairobi",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FFD700",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
""",
    "src/app/page.tsx": """import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight-950 flex flex-col items-center justify-between p-6 antialiased">
      
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md text-center pt-10">
        <div className="w-20 h-20 bg-gold-500 rounded-2xl flex items-center justify-center shadow-gold mb-8">
          <svg className="w-10 h-10 text-midnight-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <h1 className="text-5xl font-serif font-bold text-white tracking-tight">TaskIt</h1>
        <p className="text-gold-500 mt-2 text-lg font-semibold uppercase tracking-widest">Nairobi Errands</p>
        
        <p className="text-gray-400 mt-6 text-base leading-relaxed max-w-xs">
          Fast, reliable errands delivered across Nairobi. Pay seamlessly via M-Pesa.
        </p>

        <div className="mt-10 space-y-3 w-full bg-midnight-800 p-6 rounded-2xl border border-midnight-700 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
            <p className="text-white font-medium">Flat-rate zone pricing</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
            <p className="text-white font-medium">One-tap M-Pesa checkout</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
            <p className="text-white font-medium">Real-time rider tracking</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3 pb-8 pt-6">
        <Link 
          href="/auth/signup" 
          className="block w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold text-center text-lg shadow-gold hover:bg-gold-400 transition-colors active:scale-[0.98]"
        >
          Get Started
        </Link>
        <Link 
          href="/auth/login" 
          className="block w-full bg-midnight-800 text-white border border-midnight-700 py-4 rounded-2xl font-bold text-center text-lg hover:bg-midnight-700 transition-colors active:scale-[0.98]"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
""",
    "src/app/auth/login/page.tsx": """"use client";

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-midnight-950 flex flex-col p-6 antialiased">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h1 className="text-3xl font-serif font-bold text-white">Welcome Back</h1>
        <p className="text-gray-400 mt-2">Sign in to your TaskIt account</p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+254 7XX XXX XXX"
              className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-400 block mb-2">Password / OTP</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
            />
          </div>
        </div>

        <button className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold text-lg shadow-gold mt-8 hover:bg-gold-400 transition-colors active:scale-[0.98]">
          Sign In
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account? <Link href="/auth/signup" className="text-gold-500 font-semibold hover:underline">Sign Up</Link>
        </p>
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
    <div className="min-h-screen bg-midnight-950 flex flex-col p-6 antialiased">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
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
        </div>

        <button className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold text-lg shadow-gold mt-8 hover:bg-gold-400 transition-colors active:scale-[0.98]">
          Create Account
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account? <Link href="/auth/login" className="text-gold-500 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
""",
    "src/app/(customer)/dashboard/page.tsx": """"use client";

import Link from 'next/link';

const ZONES = [
  { name: 'Nairobi CBD', icon: '🏢' },
  { name: 'Westlands', icon: '🍹' },
  { name: 'Eastleigh', icon: '🛍️' },
  { name: 'Ngara', icon: '🏙️' },
];

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-midnight-950 pb-24 antialiased">
      {/* Header */}
      <div className="p-6 pt-8 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">Good morning</p>
          <h1 className="text-2xl font-serif font-bold text-white">Hello, Brayo</h1>
        </div>
        <div className="w-10 h-10 bg-midnight-800 border border-midnight-700 rounded-full flex items-center justify-center">
          <span className="text-gold-500 font-bold">B</span>
        </div>
      </div>

      {/* Search / Promo Card */}
      <div className="px-6 mb-6">
        <div className="bg-midnight-800 border border-midnight-700 p-6 rounded-2xl shadow-soft-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 rounded-full -mr-6 -mt-6"></div>
          <h3 className="text-gold-500 font-bold text-lg mb-2">Earn Ksh 100</h3>
          <p className="text-gray-300 text-sm mb-4">Invite a friend to TaskIt and get Ksh 100 credit.</p>
          <div className="bg-midnight-900 border border-midnight-700 rounded-xl px-4 py-2 text-gray-500 text-sm">
            Where is your errand?
          </div>
        </div>
      </div>

      {/* Quick Options */}
      <div className="px-6 mb-8">
        <h2 className="text-white font-bold text-lg mb-4">Quick Options</h2>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/book" className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-gold-500 transition-colors group">
            <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-gold-500 group-hover:text-midnight-950 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="text-white text-xs font-semibold">Create</span>
          </Link>
          <div className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 transition-colors group">
            <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-gold-500 group-hover:text-midnight-950 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <span className="text-white text-xs font-semibold">Track</span>
          </div>
          <div className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 transition-colors group">
            <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-gold-500 group-hover:text-midnight-950 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-white text-xs font-semibold">Schedule</span>
          </div>
        </div>
      </div>

      {/* Categories (Zones) */}
      <div className="px-6">
        <h2 className="text-white font-bold text-lg mb-4">Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {ZONES.map((zone) => (
            <Link href="/book" key={zone.name} className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex items-center space-x-3 hover:border-gold-500 transition-colors">
              <span className="text-2xl">{zone.icon}</span>
              <span className="text-white font-semibold text-sm">{zone.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 bg-midnight-900 border-t border-midnight-700 p-4 flex justify-around items-center">
        <div className="flex flex-col items-center text-gold-500">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>
          <span className="text-xs mt-1 font-semibold">Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          <span className="text-xs mt-1">Orders</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-xs mt-1">Profile</span>
        </div>
      </div>
    </div>
  );
}
""",
    "src/app/(rider)/dashboard/page.tsx": """export default function RiderDashboard() {
  const activeDelivery = {
    id: 'TSK-901',
    pickup: 'Pickup: Blue envelope from Office 402, Ambank House, CBD',
    dropoff: 'Dropoff: Customer Wanjiku, Moi Avenue',
    customerPhone: '+254712345678',
    status: 'assigned'
  };

  const handleStatusUpdate = (newStatus: string) => {
    alert('Order ' + activeDelivery.id + ' marked as ' + newStatus);
  };

  return (
    <div className="min-h-screen bg-midnight-950 pb-24 antialiased">
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

        {activeDelivery.status === 'assigned' && (
          <button 
            onClick={() => handleStatusUpdate('Picked Up')}
            className="w-full bg-gold-500 text-midnight-950 py-5 rounded-2xl font-bold text-lg shadow-gold active:scale-95 transition-transform"
          >
            Mark as Picked Up
          </button>
        )}
      </div>
    </div>
  );
}
""",
    "src/app/(customer)/book/page.tsx": """"use client";

import { useState } from 'react';
import Link from 'next/link';

const ZONES = [
  { id: 'cbd', name: 'Nairobi CBD', price: 150, icon: '🏢' },
  { id: 'westlands', name: 'Westlands', price: 250, icon: '🍹' },
  { id: 'eastleigh', name: 'Eastleigh', price: 300, icon: '🛍️' },
  { id: 'ngara', name: 'Ngara / Kamukunji', price: 300, icon: '🏙️' },
];

export default function BookErrand() {
  const [step, setStep] = useState(1);
  const [selectedZone, setSelectedZone] = useState<typeof ZONES[0] | null>(null);
  const [errandDesc, setErrandDesc] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const handleMpesaPay = async () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      alert('STK Push sent to your phone. Order is pending confirmation.');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-midnight-950 pb-24 antialiased">
      <div className="bg-midnight-900 border-b border-midnight-700 p-6 pt-8 flex justify-between items-center sticky top-0 z-10">
        <Link href="/dashboard" className="text-gray-400 hover:text-gold-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h1 className="text-lg font-bold text-white">New Errand</h1>
        <div className="w-6"></div>
      </div>

      <main className="max-w-lg mx-auto p-6 space-y-6">
        <div className="flex space-x-2">
          <div className={`h-1 w-1/3 rounded-full ${step >= 1 ? 'bg-gold-500' : 'bg-midnight-700'}`} />
          <div className={`h-1 w-1/3 rounded-full ${step >= 2 ? 'bg-gold-500' : 'bg-midnight-700'}`} />
          <div className={`h-1 w-1/3 rounded-full ${step >= 3 ? 'bg-gold-500' : 'bg-midnight-700'}`} />
        </div>

        {step === 1 && (
          <section className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-white">Select Zone</h2>
              <p className="text-gray-400 text-sm mt-1">Flat-rate pricing upfront</p>
            </div>
            <div className="space-y-3">
              {ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => { setSelectedZone(zone); setStep(2); }}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between bg-midnight-800
                    ${selectedZone?.id === zone.id ? 'border-gold-500 shadow-gold' : 'border-midnight-700 hover:border-midnight-600'}`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{zone.icon}</span>
                    <span className="font-semibold text-white">{zone.name}</span>
                  </div>
                  <span className="font-bold text-gold-500 bg-midnight-900 px-3 py-1 rounded-lg border border-midnight-700">Ksh {zone.price}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && selectedZone && (
          <section className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-white">Errand Details</h2>
              <p className="text-gray-400 text-sm mt-1">Tell us exactly what you need done</p>
            </div>
            
            <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
              <div>
                <label className="text-xs font-bold text-gold-500 uppercase tracking-wider">Description</label>
                <textarea 
                  value={errandDesc}
                  onChange={(e) => setErrandDesc(e.target.value)}
                  placeholder="e.g., Pick up blue envelope from Office 402..."
                  className="w-full mt-2 text-white bg-midnight-900 p-4 rounded-xl outline-none resize-none h-28 placeholder:text-midnight-600 border border-midnight-700 focus:border-gold-500 transition-colors"
                />
              </div>
            </div>
            
            <button 
              onClick={() => setStep(3)} 
              disabled={!errandDesc}
              className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold mt-4 disabled:opacity-30 transition-all hover:bg-gold-400 active:scale-[0.98] shadow-gold"
            >
              Continue
            </button>
            <button onClick={() => setStep(1)} className="w-full text-center text-gold-500 text-sm font-medium py-2 hover:underline">Change Zone</button>
          </section>
        )}

        {step === 3 && selectedZone && (
          <section className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-white">Confirm & Pay</h2>
              <p className="text-gray-400 text-sm mt-1">Review your errand details</p>
            </div>
            
            <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
              <div className="flex justify-between items-center text-sm pb-4 border-b border-midnight-700">
                <span className="text-gray-400">Zone</span>
                <span className="font-semibold text-white">{selectedZone.name}</span>
              </div>
              <div className="flex justify-between items-start text-sm pb-4 border-b border-midnight-700">
                <span className="text-gray-400">Errand</span>
                <span className="font-semibold text-white text-right max-w-[70%]">{errandDesc}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-white text-lg">Total</span>
                <span className="font-bold text-gold-500 text-2xl">Ksh {selectedZone.price}</span>
              </div>
            </div>

            <button 
              onClick={handleMpesaPay}
              disabled={isPaying}
              className="w-full bg-gold-500 text-midnight-950 py-5 rounded-2xl font-bold text-lg shadow-gold disabled:opacity-80 transition-all hover:bg-gold-400 active:scale-[0.98] flex justify-center items-center space-x-2"
            >
              {isPaying ? (
                <div className="w-6 h-6 border-2 border-midnight-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Pay with M-Pesa</span>
              )}
            </button>
            <button onClick={() => setStep(2)} className="w-full text-center text-gold-500 text-sm font-medium py-2 hover:underline">Edit Details</button>
          </section>
        )}
      </main>
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

print("\nV1 Midnight & Gold UI Built Successfully!")
