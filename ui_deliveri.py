import os

files = {
    "postcss.config.mjs": """const config = {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};
export default config;
""",
    "src/app/globals.css": """@import "tailwindcss";

@theme {
  /* Brand: Vibrant Delivery Orange */
  --color-brand-50: #FFF7ED;
  --color-brand-100: #FFEDD5;
  --color-brand-200: #FED7AA;
  --color-brand-300: #FDBA74;
  --color-brand-400: #FB923C;
  --color-brand-500: #FF5C00; /* Core Deliveri Orange */
  --color-brand-600: #EA580C;
  --color-brand-700: #C2410C;
  --color-brand-800: #9A3412;
  --color-brand-900: #7C2D12;

  /* Surface: Clean Light Mode */
  --color-surface-50: #FFFFFF;
  --color-surface-100: #F9FAFB; /* Very light gray bg */
  --color-surface-200: #F3F4F6;
  --color-surface-300: #E5E7EB;
  --color-surface-800: #1F2937; /* Dark text */
  --color-surface-900: #111827; /* Deep black text */
  --color-surface-950: #030712;

  /* Fonts */
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-serif: var(--font-playfair), Georgia, serif;

  /* Shadows */
  --shadow-soft: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-premium: 0 10px 15px -3px rgba(255, 92, 0, 0.15);
}

body {
  @apply bg-surface-100 text-surface-900 antialiased;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--color-surface-100);
}
::-webkit-scrollbar-thumb {
  background: var(--color-surface-300);
  border-radius: 9999px;
}
""",
    "src/middleware.ts": """import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/book'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
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
    <div className="min-h-screen bg-surface-100 pb-24 antialiased">
      {/* Top Navigation Bar */}
      <div className="bg-white p-6 pt-8 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <Link href="/dashboard" className="text-surface-800 hover:text-brand-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h1 className="text-lg font-bold text-surface-900">New Errand</h1>
        <div className="w-6"></div>
      </div>

      <main className="max-w-lg mx-auto p-6 space-y-6">
        {/* Progress Indicator */}
        <div className="flex space-x-2">
          <div className={`h-1 w-1/3 rounded-full ${step >= 1 ? 'bg-brand-500' : 'bg-surface-200'}`} />
          <div className={`h-1 w-1/3 rounded-full ${step >= 2 ? 'bg-brand-500' : 'bg-surface-200'}`} />
          <div className={`h-1 w-1/3 rounded-full ${step >= 3 ? 'bg-brand-500' : 'bg-surface-200'}`} />
        </div>

        {step === 1 && (
          <section className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-surface-900">Where are we going?</h2>
              <p className="text-surface-800/60 text-sm mt-1">Select zone for flat-rate pricing</p>
            </div>
            <div className="space-y-3">
              {ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => { setSelectedZone(zone); setStep(2); }}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between bg-white
                    ${selectedZone?.id === zone.id ? 'border-brand-500 shadow-premium' : 'border-surface-200 hover:border-surface-300'}`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{zone.icon}</span>
                    <span className="font-semibold text-surface-900">{zone.name}</span>
                  </div>
                  <span className="font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg">Ksh {zone.price}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && selectedZone && (
          <section className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-surface-900">Errand Details</h2>
              <p className="text-surface-800/60 text-sm mt-1">Tell us exactly what you need done</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-soft space-y-4">
              <div>
                <label className="text-xs font-bold text-surface-800 uppercase tracking-wider">Description</label>
                <textarea 
                  value={errandDesc}
                  onChange={(e) => setErrandDesc(e.target.value)}
                  placeholder="e.g., Pick up blue envelope from Office 402..."
                  className="w-full mt-2 text-surface-900 bg-surface-50 p-4 rounded-xl outline-none resize-none h-28 placeholder:text-surface-400 border border-surface-200 focus:border-brand-500 transition-colors"
                />
              </div>
              <div className="border-t border-surface-200 pt-4">
                <label className="text-xs font-bold text-surface-800 uppercase tracking-wider">Attachments</label>
                <div className="mt-2 flex justify-center items-center h-20 border-2 border-dashed border-surface-300 rounded-xl text-surface-400 text-sm cursor-pointer hover:border-brand-500 hover:text-brand-500 transition-colors bg-surface-50">
                  + Upload Photo
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setStep(3)} 
              disabled={!errandDesc}
              className="w-full bg-brand-500 text-white py-4 rounded-2xl font-bold mt-4 disabled:opacity-40 transition-all hover:bg-brand-600 active:scale-[0.98] shadow-premium"
            >
              Continue
            </button>
            <button onClick={() => setStep(1)} className="w-full text-center text-brand-600 text-sm font-medium py-2 hover:underline">Change Zone</button>
          </section>
        )}

        {step === 3 && selectedZone && (
          <section className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-surface-900">Confirm & Pay</h2>
              <p className="text-surface-800/60 text-sm mt-1">Review your errand details</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-soft space-y-4">
              <div className="flex justify-between items-center text-sm pb-4 border-b border-surface-200">
                <span className="text-surface-800/60">Zone</span>
                <span className="font-semibold text-surface-900">{selectedZone.name}</span>
              </div>
              <div className="flex justify-between items-start text-sm pb-4 border-b border-surface-200">
                <span className="text-surface-800/60">Errand</span>
                <span className="font-semibold text-surface-900 text-right max-w-[70%]">{errandDesc}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-surface-900 text-lg">Total</span>
                <span className="font-bold text-brand-600 text-2xl">Ksh {selectedZone.price}</span>
              </div>
            </div>

            <button 
              onClick={handleMpesaPay}
              disabled={isPaying}
              className="w-full bg-brand-500 text-white py-5 rounded-2xl font-bold text-lg shadow-premium disabled:opacity-80 transition-all hover:bg-brand-600 active:scale-[0.98] flex justify-center items-center space-x-2"
            >
              {isPaying ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Pay with M-Pesa</span>
              )}
            </button>
            <button onClick={() => setStep(2)} className="w-full text-center text-brand-600 text-sm font-medium py-2 hover:underline">Edit Details</button>
            <p className="text-center text-xs text-surface-400">STK Push will be sent to your phone</p>
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
    <div className="min-h-screen bg-surface-100 antialiased flex flex-col md:flex-row">
      {/* Mobile Top Bar / Desktop Sidebar */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-brand-500">TaskIt</h1>
        <Link href="/book" className="bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-premium">+ New</Link>
      </div>

      <aside className="hidden md:flex w-72 bg-white border-r border-surface-200 p-8 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-500">TaskIt</h1>
          <p className="text-surface-400 text-sm mt-1">Owner Dashboard</p>
          <nav className="mt-12 space-y-2">
            <Link href="/dashboard" className="block py-3 px-4 bg-brand-50 text-brand-600 rounded-xl font-semibold text-center border border-brand-100">
              Live Orders
            </Link>
            <Link href="/dashboard" className="block py-3 px-4 text-surface-500 hover:bg-surface-100 rounded-xl transition-colors text-center">
              Riders
            </Link>
            <Link href="/dashboard" className="block py-3 px-4 text-surface-500 hover:bg-surface-100 rounded-xl transition-colors text-center">
              Revenue
            </Link>
          </nav>
        </div>
        <div className="space-y-3">
           <Link href="/book" className="block w-full text-center bg-brand-500 text-white py-3 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-premium">
              New Booking
           </Link>
           <div className="text-xs text-surface-400 text-center">&copy; Squareroot INC</div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-surface-900">Good Morning, Owner</h2>
          <p className="text-surface-500 text-sm mt-1">Here is what is happening across Nairobi today.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-surface-200 text-center">
            <p className="text-sm text-surface-500 font-medium">Today Revenue</p>
            <p className="text-3xl font-bold text-brand-600 mt-1">Ksh 4,500</p>
            <p className="text-xs text-green-600 mt-2 bg-green-50 inline-block px-2 py-1 rounded-full">+12% vs yesterday</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-surface-200 text-center">
            <p className="text-sm text-surface-500 font-medium">Active Orders</p>
            <p className="text-3xl font-bold text-surface-900 mt-1">8</p>
            <p className="text-xs text-surface-400 mt-2">3 pending assignment</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-surface-200 text-center">
            <p className="text-sm text-surface-500 font-medium">Active Riders</p>
            <p className="text-3xl font-bold text-surface-900 mt-1">5 / 7</p>
            <p className="text-xs text-surface-400 mt-2">2 offline</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-surface-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
            <h3 className="font-bold text-surface-900">Live Order Feed</h3>
            <span className="text-xs bg-brand-500 text-white px-2 py-1 rounded-full font-bold">Live</span>
          </div>
          <div className="divide-y divide-surface-200">
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-surface-400">{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'Rider Assigned' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-surface-900 font-medium mt-1">{order.customer} — {order.zone}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-surface-900">Ksh {order.amount}</p>
                  <p className="text-xs text-surface-400">{order.time}</p>
                </div>
                {order.status === 'Pending' && (
                  <button className="ml-4 bg-brand-500 text-white text-xs px-4 py-2 rounded-xl hover:bg-brand-600 transition-colors font-bold shadow-premium">
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
  const orderDetails = {
    id: 'TSK-901',
    pickup: 'Pickup: Blue envelope from Office 402, Ambank House, CBD',
    dropoff: 'Dropoff: Customer Wanjiku, Moi Avenue',
    customerPhone: '+254712345678',
    status: 'assigned'
  };

  const handleStatusUpdate = (newStatus: string) => {
    alert('Order ' + orderDetails.id + ' marked as ' + newStatus);
  };

  return (
    <div className="min-h-screen bg-surface-100 flex flex-col items-center justify-center p-6 antialiased">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-xl font-bold text-brand-500">TaskIt Rider</h1>
          <p className="text-surface-500 text-sm mt-1">Order #{orderDetails.id}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-4 shadow-soft border border-surface-200 text-left">
          <div>
            <p className="text-xs text-brand-600 uppercase tracking-wider font-bold">Pickup</p>
            <p className="text-surface-900 mt-1 font-medium">{orderDetails.pickup}</p>
          </div>
          <div className="border-t border-surface-200"></div>
          <div>
            <p className="text-xs text-brand-600 uppercase tracking-wider font-bold">Drop-off</p>
            <p className="text-surface-900 mt-1 font-medium">{orderDetails.dropoff}</p>
          </div>
          <a href={'tel:' + orderDetails.customerPhone} className="block w-full text-center bg-surface-100 border border-surface-200 text-brand-600 py-3 rounded-xl font-semibold hover:bg-surface-200 transition-colors mt-2">
            Call Customer
          </a>
        </div>

        <div className="space-y-3">
          {orderDetails.status === 'assigned' && (
            <button 
              onClick={() => handleStatusUpdate('Picked Up')}
              className="w-full bg-brand-500 text-white py-5 rounded-2xl font-bold text-lg shadow-premium active:scale-95 transition-transform"
            >
              Mark as Picked Up
            </button>
          )}
          
          {orderDetails.status === 'picked_up' && (
            <button 
              onClick={() => handleStatusUpdate('Delivered')}
              className="w-full bg-brand-500 text-white py-5 rounded-2xl font-bold text-lg shadow-premium active:scale-95 transition-transform"
            >
              Mark as Delivered
            </button>
          )}

          {orderDetails.status === 'delivered' && (
            <div className="text-center p-6 bg-white rounded-2xl border border-surface-200 shadow-soft">
              <p className="text-brand-500 text-4xl mb-2">&#10003;</p>
              <p className="text-lg font-bold text-surface-900">Order Complete</p>
              <p className="text-surface-500 text-sm mt-1">Wait for the next assignment.</p>
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

print("\nDELIVERI Orange/White UI applied successfully!")
