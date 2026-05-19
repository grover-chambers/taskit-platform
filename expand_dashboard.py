import os

files = {
    "src/components/BottomNav.tsx": """"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  const baseClass = "flex flex-col items-center justify-center transition-colors";
  const activeClass = "text-gold-500";
  const inactiveClass = "text-gray-500 hover:text-gray-300";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-midnight-900 border-t border-midnight-700 p-4 flex justify-around items-center z-50">
      <Link href="/dashboard" className={`${baseClass} ${isActive('/dashboard') ? activeClass : inactiveClass}`}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>
        <span className="text-xs mt-1 font-semibold">Home</span>
      </Link>
      <Link href="/dashboard/orders" className={`${baseClass} ${isActive('/dashboard/orders') ? activeClass : inactiveClass}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        <span className="text-xs mt-1 font-semibold">Orders</span>
      </Link>
      <Link href="/dashboard/profile" className={`${baseClass} ${isActive('/dashboard/profile') ? activeClass : inactiveClass}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <span className="text-xs mt-1 font-semibold">Profile</span>
      </Link>
    </div>
  );
}
""",
    "src/app/dashboard/layout.tsx": """import BottomNav from '@/components/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased">
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}
""",
    "src/app/dashboard/page.tsx": """import Link from 'next/link';

const ZONES = [
  { name: 'Nairobi CBD', icon: '🏢' },
  { name: 'Westlands', icon: '🍹' },
  { name: 'Eastleigh', icon: '🛍️' },
  { name: 'Ngara', icon: '🏙️' },
];

export default function CustomerDashboard() {
  return (
    <div className="pb-24">
      <div className="p-6 pt-8 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">Good morning</p>
          <h1 className="text-2xl font-serif font-bold text-white">Hello, Brayo</h1>
        </div>
        <div className="w-10 h-10 bg-midnight-800 border border-midnight-700 rounded-full flex items-center justify-center">
          <span className="text-gold-500 font-bold">B</span>
        </div>
      </div>

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

      <div className="px-6 mb-8">
        <h2 className="text-white font-bold text-lg mb-4">Quick Options</h2>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/book" className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-gold-500 transition-colors group">
            <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-gold-500 group-hover:text-midnight-950 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="text-white text-xs font-semibold">Create</span>
          </Link>
          <Link href="/dashboard/orders" className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-gold-500 transition-colors group">
            <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-gold-500 group-hover:text-midnight-950 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <span className="text-white text-xs font-semibold">Track</span>
          </Link>
          <Link href="/book" className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-gold-500 transition-colors group">
            <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-gold-500 group-hover:text-midnight-950 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-white text-xs font-semibold">Schedule</span>
          </Link>
        </div>
      </div>

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
    </div>
  );
}
""",
    "src/app/dashboard/orders/page.tsx": """import Link from 'next/link';

const MOCK_ORDERS = [
  { id: 'TSK-901', zone: 'Nairobi CBD', status: 'In Transit', price: 150 },
  { id: 'TSK-902', zone: 'Westlands', status: 'Delivered', price: 250 },
  { id: 'TSK-903', zone: 'Eastleigh', status: 'Delivered', price: 300 },
  { id: 'TSK-904', zone: 'Ngara', status: 'Cancelled', price: 300 },
];

export default function OrdersPage() {
  return (
    <div className="pb-24">
      <div className="p-6 pt-8">
        <h1 className="text-2xl font-serif font-bold text-white">My Orders</h1>
        <p className="text-gray-400 text-sm mt-1">Track your active and past errands</p>
      </div>

      <div className="px-6 space-y-3">
        {MOCK_ORDERS.map((order) => {
          let statusColor = 'bg-gray-500/20 text-gray-400';
          let borderColor = 'border-midnight-700';
          if (order.status === 'In Transit') {
            statusColor = 'bg-gold-500/20 text-gold-500';
            borderColor = 'border-gold-500/50'; // Highlight active orders
          } else if (order.status === 'Delivered') {
            statusColor = 'bg-green-500/20 text-green-400';
          } else if (order.status === 'Cancelled') {
            statusColor = 'bg-red-500/20 text-red-400';
          }

          return (
            <Link href={'/dashboard/orders/' + order.id} key={order.id} className={`block bg-midnight-800 p-4 rounded-2xl border ${borderColor} shadow-soft-dark transition-transform active:scale-[0.98]`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-sm text-gray-400">{order.id}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">{order.zone}</span>
                <span className="text-white font-bold">Ksh {order.price}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
""",
    "src/app/dashboard/orders/[id]/page.tsx": """import Link from 'next/link';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  // In a real app, fetch order details from Supabase using params.id
  const order = {
    id: params.id,
    status: 'In Transit',
    zone: 'Nairobi CBD',
    errand: 'Pick up blue envelope from Office 402, Ambank House',
    price: 150,
    rider: 'Kamau M.',
    riderPhone: '+254712345678',
  };

  return (
    <div className="pb-24">
      <div className="bg-midnight-900 border-b border-midnight-700 p-6 pt-8 flex justify-between items-center sticky top-0 z-10">
        <Link href="/dashboard/orders" className="text-gray-400 hover:text-gold-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h1 className="text-lg font-bold text-white">Order Details</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-midnight-800 p-6 rounded-2xl border border-gold-500/50 shadow-gold text-center">
          <p className="text-gold-500 font-bold text-lg uppercase tracking-wider">{order.status}</p>
          <p className="text-gray-400 text-sm mt-1">Estimated arrival: 15 mins</p>
        </div>

        <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
          <div>
            <p className="text-xs text-gold-500 uppercase tracking-wider font-semibold mb-1">Errand</p>
            <p className="text-white font-medium">{order.errand}</p>
          </div>
          <div className="border-t border-midnight-700 pt-4">
            <p className="text-xs text-gold-500 uppercase tracking-wider font-semibold mb-1">Zone</p>
            <p className="text-white font-medium">{order.zone}</p>
          </div>
          <div className="border-t border-midnight-700 pt-4">
            <p className="text-xs text-gold-500 uppercase tracking-wider font-semibold mb-1">Payment</p>
            <p className="text-white font-medium">M-Pesa - Ksh {order.price}</p>
          </div>
        </div>

        <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-midnight-700 rounded-full flex items-center justify-center text-gold-500 font-bold text-xl">
              K
            </div>
            <div>
              <p className="text-white font-semibold">{order.rider}</p>
              <p className="text-gray-400 text-sm">Your Rider</p>
            </div>
          </div>
          <a href={'tel:' + order.riderPhone} className="bg-gold-500/20 text-gold-500 p-3 rounded-full hover:bg-gold-500 hover:text-midnight-950 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
""",
    "src/app/dashboard/profile/page.tsx": """"use client";

import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="pb-24">
      <div className="p-6 pt-8 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-midnight-800 border-2 border-gold-500 rounded-full flex items-center justify-center mb-4 shadow-gold">
          <span className="text-gold-500 font-bold text-4xl font-serif">B</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-white">Brayo Otieno</h1>
        <p className="text-gray-400 text-sm mt-1">+254 7XX XXX XXX</p>
      </div>

      <div className="px-6 space-y-3 mt-6">
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <span className="text-white font-semibold">Account Details</span>
          </div>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>

        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <span className="text-white font-semibold">Payment Methods</span>
          </div>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>

        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="text-white font-semibold">Help & Support</span>
          </div>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>

        <Link href="/" className="bg-midnight-800 p-4 rounded-2xl border border-red-900/50 shadow-soft-dark flex justify-between items-center hover:border-red-500 transition-colors cursor-pointer mt-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-900/20 rounded-xl flex items-center justify-center text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
            <span className="text-red-400 font-semibold">Log Out</span>
          </div>
        </Link>
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

print("\nDashboard ecosystem built successfully!")
