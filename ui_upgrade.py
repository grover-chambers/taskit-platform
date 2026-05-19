import os

files = {
    "tailwind.config.ts": """import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE699',
          300: '#FFDB66',
          400: '#FFD233',
          500: '#D4AF37', // Metallic Gold
          600: '#B8960B', // Darker Gold
          700: '#8B7200',
          800: '#5C4C00',
          900: '#3A3000',
        },
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'premium': '0 10px 40px -10px rgba(212, 175, 55, 0.3)',
      }
    },
  },
  plugins: [],
}
export default config
""",
    "src/app/layout.tsx": """import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "TaskIt - Premium Errands for Nairobi",
  description: "Nairobi's premier errand and delivery platform. Black & Gold luxury service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans bg-surface-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
""",
    "src/app/(customer)/book/page.tsx": """"use client";

import { useState } from 'react';
import Link from 'next/link';

const ZONES = [
  { id: 'cbd', name: 'Nairobi CBD', price: 150 },
  { id: 'westlands', name: 'Westlands', price: 250 },
  { id: 'eastleigh', name: 'Eastleigh', price: 300 },
  { id: 'ngara', name: 'Ngara / Kamukunji', price: 300 },
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
    <div className="min-h-screen bg-surface-950 flex flex-col items-center p-4 pb-24 antialiased">
      <header className="w-full max-w-md flex justify-between items-center py-6">
        <h1 className="text-xl font-serif font-bold text-brand-500 tracking-tight">TaskIt</h1>
        <Link href="/dashboard" className="h-8 w-8 bg-surface-800 rounded-full flex items-center justify-center text-brand-500 hover:bg-surface-700 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
        </Link>
      </header>

      <main className="w-full max-w-md space-y-8 text-center">
        <div className="flex space-x-2 justify-center">
          <div className={`h-1 w-1/3 rounded-full ${step >= 1 ? 'bg-brand-500' : 'bg-surface-800'}`} />
          <div className={`h-1 w-1/3 rounded-full ${step >= 2 ? 'bg-brand-500' : 'bg-surface-800'}`} />
          <div className={`h-1 w-1/3 rounded-full ${step >= 3 ? 'bg-brand-500' : 'bg-surface-800'}`} />
        </div>

        {step === 1 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-white">Where to?</h2>
              <p className="text-surface-400 text-sm mt-2">Select delivery zone for flat-rate pricing.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => { setSelectedZone(zone); setStep(2); }}
                  className={`p-5 rounded-2xl border-2 transition-all text-center
                    ${selectedZone?.id === zone.id ? 'border-brand-500 bg-brand-500/10' : 'border-surface-800 bg-surface-900 hover:border-surface-600'}`}
                >
                  <p className="font-semibold text-white">{zone.name}</p>
                  <p className="text-brand-500 font-bold mt-2">Ksh {zone.price}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && selectedZone && (
          <section className="space-y-6">
            <button onClick={() => setStep(1)} className="text-brand-500 text-sm font-medium hover:underline">&larr; Change Zone</button>
            <div>
              <h2 className="text-3xl font-serif font-bold text-white">Errand Details</h2>
              <p className="text-surface-400 text-sm mt-2">Tell us exactly what you need.</p>
            </div>
            <div className="bg-surface-900 p-6 rounded-2xl border border-surface-800 shadow-soft space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Description</label>
                <textarea 
                  value={errandDesc}
                  onChange={(e) => setErrandDesc(e.target.value)}
                  placeholder="e.g., Pick up blue envelope from Office 402..."
                  className="w-full mt-2 text-white bg-surface-800 p-3 rounded-xl outline-none resize-none h-24 placeholder:text-surface-500 border border-surface-700 focus:border-brand-500 transition-colors"
                />
              </div>
              <div className="border-t border-surface-700 pt-4">
                <label className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Attachments (Optional)</label>
                <div className="mt-2 flex justify-center items-center h-20 border-2 border-dashed border-surface-700 rounded-xl text-surface-500 text-sm cursor-pointer hover:border-brand-500 hover:text-brand-500 transition-colors">
                  + Upload Photo
                </div>
              </div>
            </div>
            <button 
              onClick={() => setStep(3)} 
              disabled={!errandDesc}
              className="w-full bg-brand-500 text-surface-950 py-4 rounded-2xl font-bold mt-4 disabled:opacity-30 transition-all hover:bg-brand-600 active:scale-[0.98]"
            >
              Continue to Pay
            </button>
          </section>
        )}

        {step === 3 && selectedZone && (
          <section className="space-y-6">
            <button onClick={() => setStep(2)} className="text-brand-500 text-sm font-medium hover:underline">&larr; Edit Details</button>
            <h2 className="text-3xl font-serif font-bold text-white">Confirm & Pay</h2>
            
            <div className="bg-surface-900 p-6 rounded-2xl border border-surface-800 shadow-soft space-y-3 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Zone</span>
                <span className="font-medium text-white">{selectedZone.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Errand</span>
                <span className="font-medium text-white text-right max-w-[60%] truncate">{errandDesc}</span>
              </div>
              <div className="border-t border-surface-700 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Total</span>
                <span className="font-bold text-brand-500 text-2xl font-serif">Ksh {selectedZone.price}</span>
              </div>
            </div>

            <button 
              onClick={handleMpesaPay}
              disabled={isPaying}
              className="w-full bg-brand-500 text-surface-950 py-5 rounded-2xl font-bold text-lg shadow-premium disabled:opacity-80 transition-all hover:bg-brand-600 active:scale-[0.98] flex justify-center items-center space-x-2"
            >
              {isPaying ? (
                <div className="w-5 h-5 border-2 border-surface-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Pay with M-Pesa</span>
              )}
            </button>
            <p className="text-center text-xs text-surface-500">STK Push will be sent to your registered phone</p>
          </section>
        )}
      </main>
    </div>
  );
}
""",
    "src/app/(dashboard)/page.tsx": """"use client";

import Link from 'next/link';

const MOCK_ORDERS = [
  { id: 'TSK-901', customer: 'Wanjiku K.', zone: 'CBD', status: 'Rider Assigned', amount: 150, time: '2m ago' },
  { id: 'TSK-902', customer: 'Brian M.', zone: 'Westlands', status: 'Pending', amount: 250, time: '5m ago' },
  { id: 'TSK-903', customer: 'Amina J.', zone: 'Eastleigh', status: 'Delivered', amount: 300, time: '1h ago' },
];

export default function OwnerDashboard() {
  return (
    <div className="min-h-screen bg-surface-950 antialiased flex">
      <aside className="hidden md:flex w-64 bg-black text-white p-6 flex-col justify-between border-r border-surface-800">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-500">TaskIt</h1>
          <p className="text-surface-500 text-sm mt-1">Owner Dashboard</p>
          <nav className="mt-10 space-y-2">
            <Link href="/dashboard" className="block py-2 px-4 bg-brand-500/10 border border-brand-500/20 rounded-lg text-brand-500 font-medium text-center">
              Live Orders
            </Link>
            <Link href="/dashboard" className="block py-2 px-4 text-surface-400 hover:text-white transition-colors text-center">
              Riders
            </Link>
            <Link href="/dashboard" className="block py-2 px-4 text-surface-400 hover:text-white transition-colors text-center">
              Revenue
            </Link>
          </nav>
        </div>
        <div className="space-y-3">
           <Link href="/book" className="block w-full text-center bg-brand-500 text-surface-950 py-3 rounded-xl font-bold hover:bg-brand-600 transition-colors">
              New Booking
           </Link>
           <div className="text-xs text-surface-600 text-center">&copy; Squareroot INC</div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold text-white">Good Morning, Owner</h2>
            <p className="text-surface-400 text-sm mt-1">Here is what is happening across Nairobi today.</p>
          </div>
          <Link href="/book" className="md:hidden bg-brand-500 text-surface-950 px-4 py-2 rounded-lg text-sm font-bold">+</Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-black p-6 rounded-2xl shadow-soft border border-surface-800 text-center">
            <p className="text-sm text-surface-400 font-medium">Today Revenue</p>
            <p className="text-3xl font-serif font-bold text-brand-500 mt-1">Ksh 4,500</p>
            <p className="text-xs text-brand-500 mt-2">+12% vs yesterday</p>
          </div>
          <div className="bg-black p-6 rounded-2xl shadow-soft border border-surface-800 text-center">
            <p className="text-sm text-surface-400 font-medium">Active Orders</p>
            <p className="text-3xl font-serif font-bold text-white mt-1">8</p>
            <p className="text-xs text-surface-500 mt-2">3 pending assignment</p>
          </div>
          <div className="bg-black p-6 rounded-2xl shadow-soft border border-surface-800 text-center">
            <p className="text-sm text-surface-400 font-medium">Active Riders</p>
            <p className="text-3xl font-serif font-bold text-white mt-1">5 / 7</p>
            <p className="text-xs text-surface-500 mt-2">2 offline</p>
          </div>
        </div>

        <div className="bg-black rounded-2xl shadow-soft border border-surface-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-800 flex justify-between items-center">
            <h3 className="font-serif font-bold text-white text-center w-full">Live Order Feed</h3>
            <span className="text-xs bg-brand-500 text-surface-950 px-2 py-1 rounded-full font-bold absolute right-6">Live</span>
          </div>
          <div className="divide-y divide-surface-800">
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-900 transition-colors">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center space-x-3 justify-center md:justify-start">
                    <span className="font-mono text-sm text-surface-500">{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${order.status === 'Pending' ? 'bg-yellow-900/20 text-yellow-500' : 
                        order.status === 'Rider Assigned' ? 'bg-blue-900/20 text-blue-500' : 
                        'bg-green-900/20 text-green-500'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-white font-medium mt-1">{order.customer} — {order.zone}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-brand-500">Ksh {order.amount}</p>
                  <p className="text-xs text-surface-500">{order.time}</p>
                </div>
                {order.status === 'Pending' && (
                  <button className="ml-4 bg-brand-500 text-surface-950 text-xs px-3 py-2 rounded-lg hover:bg-brand-600 transition-colors font-bold">
                    Assign
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
""",
    "src/app/rider/[token]/page.tsx": """export default function RiderJobView({ params }: { params: { token: string } }) {
  // In a real app, decode the JWT token to get order details securely
  const orderDetails = {
    id: 'TSK-901',
    pickup: 'Pickup: Blue envelope from Office 402, Ambank House, CBD',
    dropoff: 'Dropoff: Customer Wanjiku, Moi Avenue',
    customerPhone: '+254712345678',
    status: 'assigned' // assigned -> picked_up -> delivered
  };

  const handleStatusUpdate = (newStatus: string) => {
    alert('Order ' + orderDetails.id + ' marked as ' + newStatus);
  };

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-6 text-white antialiased">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-xl font-serif font-bold text-brand-500">TaskIt Rider</h1>
          <p className="text-surface-400 text-sm mt-1">Order #{orderDetails.id}</p>
        </div>

        <div className="bg-black rounded-2xl p-5 space-y-4 shadow-premium border border-surface-800 text-left">
          <div>
            <p className="text-xs text-brand-500 uppercase tracking-wider font-semibold">Pickup</p>
            <p className="text-white mt-1">{orderDetails.pickup}</p>
          </div>
          <div className="border-t border-surface-800"></div>
          <div>
            <p className="text-xs text-brand-500 uppercase tracking-wider font-semibold">Drop-off</p>
            <p className="text-white mt-1">{orderDetails.dropoff}</p>
          </div>
          <a href={'tel:' + orderDetails.customerPhone} className="block w-full text-center bg-surface-900 border border-surface-700 text-brand-500 py-3 rounded-xl font-medium hover:bg-surface-800 transition-colors">
            Call Customer
          </a>
        </div>

        <div className="space-y-3">
          {orderDetails.status === 'assigned' && (
            <button 
              onClick={() => handleStatusUpdate('Picked Up')}
              className="w-full bg-brand-500 text-surface-950 py-5 rounded-2xl font-bold text-lg shadow-premium active:scale-95 transition-transform"
            >
              Mark as Picked Up
            </button>
          )}
          
          {orderDetails.status === 'picked_up' && (
            <button 
              onClick={() => handleStatusUpdate('Delivered')}
              className="w-full bg-brand-500 text-surface-950 py-5 rounded-2xl font-bold text-lg shadow-premium active:scale-95 transition-transform"
            >
              Mark as Delivered
            </button>
          )}

          {orderDetails.status === 'delivered' && (
            <div className="text-center p-6 bg-black rounded-2xl border border-surface-800">
              <p className="text-brand-500 text-4xl mb-2">&#10003;</p>
              <p className="text-lg font-serif font-bold text-white">Order Complete</p>
              <p className="text-surface-400 text-sm mt-1">Wait for the next assignment.</p>
            </div>
          )}
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

print("\nPremium Black & Gold UI upgraded successfully!")
