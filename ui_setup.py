import os

files = {
    "src/middleware.ts": """import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard and booking routes
  if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/book'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/' // Redirect to home/login if not authenticated
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
""",
    "src/app/layout.tsx": """import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskIt - Fast, Reliable Errands for Nairobi",
  description: "Nairobi's premier errand and delivery platform. M-Pesa integrated, zone-based flat rates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
""",
    "src/app/(customer)/book/page.tsx": """"use client";

import { useState } from 'react';

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
    // In real app: Trigger Next.js API route -> Supabase Order Creation -> Daraja STK Push
    setTimeout(() => {
      setIsPaying(false);
      alert('STK Push sent to your phone. Order is pending confirmation.');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center p-4 pb-24 antialiased">
      <header className="w-full max-w-md flex justify-between items-center py-6">
        <h1 className="text-xl font-semibold text-surface-900 tracking-tight">TaskIt</h1>
        <div className="h-8 w-8 bg-surface-900 rounded-full" />
      </header>

      <main className="w-full max-w-md space-y-6">
        <div className="flex space-x-2">
          <div className={`h-1 w-1/3 rounded-full ${step >= 1 ? 'bg-brand-500' : 'bg-surface-100'}`} />
          <div className={`h-1 w-1/3 rounded-full ${step >= 2 ? 'bg-brand-500' : 'bg-surface-100'}`} />
          <div className={`h-1 w-1/3 rounded-full ${step >= 3 ? 'bg-brand-500' : 'bg-surface-100'}`} />
        </div>

        {step === 1 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-surface-900">Where to?</h2>
            <p className="text-surface-800/60 text-sm">Select delivery zone for flat-rate pricing.</p>
            <div className="grid grid-cols-2 gap-3">
              {ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => { setSelectedZone(zone); setStep(2); }}
                  className={`p-4 rounded-2xl border-2 transition-all text-left
                    ${selectedZone?.id === zone.id ? 'border-brand-500 bg-brand-50' : 'border-surface-100 bg-white hover:border-surface-200'}`}
                >
                  <p className="font-semibold text-surface-900">{zone.name}</p>
                  <p className="text-brand-700 font-bold mt-1">Ksh {zone.price}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && selectedZone && (
          <section className="space-y-4">
            <button onClick={() => setStep(1)} className="text-brand-600 text-sm font-medium">&larr; Change Zone</button>
            <h2 className="text-2xl font-bold text-surface-900">Errand Details</h2>
            <div className="bg-white p-4 rounded-2xl border border-surface-100 shadow-soft space-y-4">
              <div>
                <label className="text-xs font-semibold text-surface-800/50 uppercase tracking-wider">What do you need?</label>
                <textarea 
                  value={errandDesc}
                  onChange={(e) => setErrandDesc(e.target.value)}
                  placeholder="e.g., Pick up blue envelope from Office 402..."
                  className="w-full mt-1 text-surface-900 bg-transparent outline-none resize-none h-24 placeholder:text-surface-300"
                />
              </div>
              <div className="border-t border-surface-100 pt-4">
                <label className="text-xs font-semibold text-surface-800/50 uppercase tracking-wider">Attachments (Optional)</label>
                <div className="mt-2 flex justify-center items-center h-20 border-2 border-dashed border-surface-200 rounded-xl text-surface-400 text-sm cursor-pointer hover:border-brand-500 hover:text-brand-500 transition-colors">
                  + Upload Photo
                </div>
              </div>
            </div>
            <button 
              onClick={() => setStep(3)} 
              disabled={!errandDesc}
              className="w-full bg-surface-900 text-white py-4 rounded-2xl font-semibold mt-4 disabled:opacity-30 transition-all hover:bg-surface-800 active:scale-[0.98]"
            >
              Continue to Pay
            </button>
          </section>
        )}

        {step === 3 && selectedZone && (
          <section className="space-y-6">
            <button onClick={() => setStep(2)} className="text-brand-600 text-sm font-medium">&larr; Edit Details</button>
            <h2 className="text-2xl font-bold text-surface-900">Confirm & Pay</h2>
            
            <div className="bg-white p-6 rounded-2xl border border-surface-100 shadow-soft space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-surface-800/60">Zone</span>
                <span className="font-medium text-surface-900">{selectedZone.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-800/60">Errand</span>
                <span className="font-medium text-surface-900 text-right max-w-[60%] truncate">{errandDesc}</span>
              </div>
              <div className="border-t border-surface-100 my-2"></div>
              <div className="flex justify-between">
                <span className="font-bold text-surface-900">Total</span>
                <span className="font-bold text-brand-700 text-lg">Ksh {selectedZone.price}</span>
              </div>
            </div>

            <button 
              onClick={handleMpesaPay}
              disabled={isPaying}
              className="w-full bg-brand-500 text-white py-4 rounded-2xl font-bold text-lg shadow-premium disabled:opacity-80 transition-all hover:bg-brand-600 active:scale-[0.98] flex justify-center items-center space-x-2"
            >
              {isPaying ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Pay with M-Pesa</span>
              )}
            </button>
            <p className="text-center text-xs text-surface-800/40">STK Push will be sent to your registered phone</p>
          </section>
        )}
      </main>
    </div>
  );
}
""",
    "src/app/(dashboard)/page.tsx": """"use client";

import { useState } from 'react';

const MOCK_ORDERS = [
  { id: 'TSK-901', customer: 'Wanjiku K.', zone: 'CBD', status: 'Rider Assigned', amount: 150, time: '2m ago' },
  { id: 'TSK-902', customer: 'Brian M.', zone: 'Westlands', status: 'Pending', amount: 250, time: '5m ago' },
  { id: 'TSK-903', customer: 'Amina J.', zone: 'Eastleigh', status: 'Delivered', amount: 300, time: '1h ago' },
];

export default function OwnerDashboard() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  return (
    <div className="min-h-screen bg-surface-50 antialiased flex">
      <aside className="hidden md:flex w-64 bg-surface-900 text-white p-6 flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-500">TaskIt</h1>
          <p className="text-surface-400 text-sm mt-1">Owner Dashboard</p>
          <nav className="mt-10 space-y-2">
            <a href="#" className="block py-2 px-4 bg-surface-800 rounded-lg text-white font-medium">Live Orders</a>
            <a href="#" className="block py-2 px-4 text-surface-400 hover:text-white transition-colors">Riders</a>
            <a href="#" className="block py-2 px-4 text-surface-400 hover:text-white transition-colors">Revenue</a>
          </nav>
        </div>
        <div className="text-xs text-surface-500">&copy; Squareroot INC</div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-surface-900">Good Morning, Owner</h2>
            <p className="text-surface-800/50 text-sm">Here is what is happening across Nairobi today.</p>
          </div>
          <button className="md:hidden bg-surface-900 text-white px-3 py-2 rounded-lg text-sm">Menu</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-surface-100">
            <p className="text-sm text-surface-800/50 font-medium">Today Revenue</p>
            <p className="text-3xl font-bold text-surface-900 mt-1">Ksh 4,500</p>
            <p className="text-xs text-brand-500 mt-2">+12% vs yesterday</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-surface-100">
            <p className="text-sm text-surface-800/50 font-medium">Active Orders</p>
            <p className="text-3xl font-bold text-surface-900 mt-1">8</p>
            <p className="text-xs text-surface-800/30 mt-2">3 pending assignment</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-surface-100">
            <p className="text-sm text-surface-800/50 font-medium">Active Riders</p>
            <p className="text-3xl font-bold text-surface-900 mt-1">5 / 7</p>
            <p className="text-xs text-surface-800/30 mt-2">2 offline</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-surface-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-100 flex justify-between items-center">
            <h3 className="font-bold text-surface-900">Live Order Feed</h3>
            <span className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-full font-medium">Live</span>
          </div>
          <div className="divide-y divide-surface-100">
            {orders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-surface-800/50">{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${order.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 
                        order.status === 'Rider Assigned' ? 'bg-blue-50 text-blue-700' : 
                        'bg-brand-50 text-brand-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-surface-900 font-medium mt-1">{order.customer} — {order.zone}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-surface-900">Ksh {order.amount}</p>
                  <p className="text-xs text-surface-800/40">{order.time}</p>
                </div>
                {order.status === 'Pending' && (
                  <button className="ml-4 bg-surface-900 text-white text-xs px-3 py-2 rounded-lg hover:bg-surface-800 transition-colors">
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
    "src/app/rider/[token]/page.tsx": """// This page is accessed via a magic link sent to WhatsApp: e.g., taskit.co.ke/rider/eyJhbGciOi...
// The [token] is a JWT that verifies the rider's identity and order assignment.

export default function RiderJobView({ params }: { params: { token: string } }) {
  // In a real app, decode the JWT token to get order details securely
  // const orderDetails = verifyRiderToken(params.token);
  
  const orderDetails = {
    id: 'TSK-901',
    pickup: 'Pickup: Blue envelope from Office 402, Ambank House, CBD',
    dropoff: 'Dropoff: Customer Wanjiku, Moi Avenue',
    customerPhone: '+254712345678',
    status: 'assigned' // assigned -> picked_up -> delivered
  };

  const handleStatusUpdate = (newStatus: string) => {
    // API call to update order status, passing the secure token to authenticate the request
    alert('Order ' + orderDetails.id + ' marked as ' + newStatus);
  };

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center p-6 text-white antialiased">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-brand-500">TaskIt Rider</h1>
          <p className="text-surface-400 text-sm mt-1">Order #{orderDetails.id}</p>
        </div>

        <div className="bg-surface-800 rounded-2xl p-5 space-y-4 shadow-premium">
          <div>
            <p className="text-xs text-surface-400 uppercase tracking-wider font-semibold">Pickup</p>
            <p className="text-white mt-1">{orderDetails.pickup}</p>
          </div>
          <div className="border-t border-surface-700"></div>
          <div>
            <p className="text-xs text-surface-400 uppercase tracking-wider font-semibold">Drop-off</p>
            <p className="text-white mt-1">{orderDetails.dropoff}</p>
          </div>
          <a href={'tel:' + orderDetails.customerPhone} className="block w-full text-center bg-surface-700 text-white py-3 rounded-xl font-medium hover:bg-surface-600 transition-colors">
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
              className="w-full bg-blue-500 text-white py-5 rounded-2xl font-bold text-lg shadow-premium active:scale-95 transition-transform"
            >
              Mark as Delivered
            </button>
          )}

          {orderDetails.status === 'delivered' && (
            <div className="text-center p-6 bg-surface-800 rounded-2xl">
              <p className="text-brand-500 text-4xl mb-2">&#10003;</p>
              <p className="text-lg font-bold text-white">Order Complete</p>
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

print("\nAll Premium UI/UX files scaffolded successfully!")
