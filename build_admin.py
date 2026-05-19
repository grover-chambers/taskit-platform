import os

files = {
    "src/app/admin/layout.tsx": """import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex relative">
      {/* Fixed Background (15% Visible) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 bg-midnight-900/80 backdrop-blur-md border-r border-midnight-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <h1 className="text-3xl font-bold text-gold-500 font-serif">TaskIt</h1>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Admin Console</p>
          
          <nav className="mt-10 space-y-2">
            <Link href="/admin" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span className="font-semibold">Command Center</span>
            </Link>
            <Link href="/admin/riders" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="font-semibold">Fleet & Riders</span>
            </Link>
            <Link href="/admin/orders" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              <span className="font-semibold">Orders & Disputes</span>
            </Link>
            <Link href="/admin/finance" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="font-semibold">Finance</span>
            </Link>
          </nav>
        </div>
        
        <div className="border-t border-midnight-700 pt-4">
          <Link href="/" className="text-gray-500 text-sm hover:text-gold-500 transition-colors">&larr; Back to Platform</Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-8 py-4 flex justify-end items-center">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-semibold text-sm">TaskIt Owner</p>
              <p className="text-gray-500 text-xs">Super Admin</p>
            </div>
            <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-midnight-950 font-bold">
              O
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
""",
    "src/app/admin/page.tsx": """"use client";

import { useState } from 'react';

const MOCK_ORDERS = [
  { id: 'TSK-905', customer: 'New Customer', zone: 'Westlands', status: 'Pending', amount: 250, time: 'Just now' },
  { id: 'TSK-904', customer: 'Amina J.', zone: 'Eastleigh', status: 'Pending', amount: 300, time: '2m ago' },
  { id: 'TSK-903', customer: 'Wanjiku K.', zone: 'CBD', status: 'Rider Assigned', amount: 150, time: '10m ago' },
  { id: 'TSK-902', customer: 'Brian M.', zone: 'Ngara', status: 'In Transit', amount: 300, time: '25m ago' },
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const handleAssign = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: 'Rider Assigned' } : order
    ));
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Command Center</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Today Revenue</p>
          <p className="text-3xl font-bold text-gold-500 mt-1">Ksh 12,400</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Active Orders</p>
          <p className="text-3xl font-bold text-white mt-1">14</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Online Riders</p>
          <p className="text-3xl font-bold text-white mt-1">8</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gold-500/50 shadow-gold">
          <p className="text-gold-500 text-sm font-bold">Pending Assign</p>
          <p className="text-3xl font-bold text-gold-500 mt-1">2</p>
        </div>
      </div>

      {/* Live Order Feed */}
      <h2 className="text-xl font-bold text-white mb-4">Live Order Feed</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-midnight-900/50 border-b border-midnight-700">
              <tr>
                <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Order ID</th>
                <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Customer</th>
                <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Zone</th>
                <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Amount</th>
                <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-midnight-800/50 transition-colors">
                  <td className="p-4 text-white font-mono text-sm">{order.id}</td>
                  <td className="p-4 text-white text-sm">{order.customer}</td>
                  <td className="p-4 text-gray-300 text-sm">{order.zone}</td>
                  <td className="p-4 text-white font-semibold text-sm">Ksh {order.amount}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold
                      ${order.status === 'Pending' ? 'bg-yellow-900/30 text-yellow-400' : 
                        order.status === 'Rider Assigned' ? 'bg-blue-900/30 text-blue-400' : 
                        'bg-green-900/30 text-green-400'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {order.status === 'Pending' && (
                      <button 
                        onClick={() => handleAssign(order.id)}
                        className="bg-gold-500 text-midnight-950 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gold-400 transition-colors shadow-gold"
                      >
                        Assign Rider
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
""",
    "src/app/admin/riders/page.tsx": """"use client";

export default function FleetManagement() {
  const riders = [
    { name: 'Kamau M.', plate: 'KBA 123J', status: 'Online', rating: 4.9, verified: true },
    { name: 'Otieno D.', plate: 'KCD 456L', status: 'Offline', rating: 4.7, verified: true },
    { name: 'Mwangi F.', plate: 'KBJ 789P', status: 'Pending KYC', rating: 0, verified: false },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Fleet & Rider Management</h1>

      {/* KYC Approvals */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gold-500 mb-4 flex items-center space-x-2">
          <span>Pending Verifications</span>
          <span className="bg-gold-500 text-midnight-950 text-xs px-2 py-0.5 rounded-full font-bold">1</span>
        </h2>
        <div className="bg-gold-500/5 border border-gold-500/30 p-6 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-white font-bold text-lg">Mwangi F.</p>
            <p className="text-gray-400 text-sm">Plate: KBJ 789P &middot; License: 987654321</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-red-600/20 text-red-400 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-600/40 transition-colors">Reject</button>
            <button className="bg-gold-500 text-midnight-950 px-4 py-2 rounded-lg font-bold text-sm shadow-gold hover:bg-gold-400 transition-colors">Approve</button>
          </div>
        </div>
      </div>

      {/* Rider List */}
      <h2 className="text-xl font-bold text-white mb-4">Active Fleet</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-midnight-900/50 border-b border-midnight-700">
            <tr>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Rider</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Plate</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Status</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-midnight-700">
            {riders.filter(r => r.verified).map((rider) => (
              <tr key={rider.plate} className="hover:bg-midnight-800/50 transition-colors">
                <td className="p-4 text-white font-semibold text-sm">{rider.name}</td>
                <td className="p-4 text-gray-300 font-mono text-sm">{rider.plate}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${rider.status === 'Online' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                    {rider.status}
                  </span>
                </td>
                <td className="p-4 text-gold-500 font-semibold text-sm">★ {rider.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
""",
    "src/app/admin/orders/page.tsx": """"use client";

export default function OrdersDisputes() {
  const historicalOrders = [
    { id: 'TSK-900', customer: 'Grace N.', zone: 'CBD', amount: 150, status: 'Delivered', dispute: false },
    { id: 'TSK-899', customer: 'John M.', zone: 'Eastleigh', amount: 300, status: 'Cancelled', dispute: true },
    { id: 'TSK-898', customer: 'Sarah K.', zone: 'Ngara', amount: 300, status: 'Delivered', dispute: false },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Orders & Disputes</h1>

      {/* Dispute Alert */}
      <div className="mb-8 bg-red-900/10 border border-red-500/30 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h3 className="text-red-400 font-bold text-lg">Active Dispute: Order TSK-899</h3>
          <p className="text-gray-400 text-sm mt-1">Customer claims rider never arrived. M-Pesa payment is on hold.</p>
        </div>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-500 transition-colors">
          Review & Refund
        </button>
      </div>

      {/* Historical Orders */}
      <h2 className="text-xl font-bold text-white mb-4">Order History</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-midnight-900/50 border-b border-midnight-700">
            <tr>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Order ID</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Customer</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Zone</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Amount</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-midnight-700">
            {historicalOrders.map((order) => (
              <tr key={order.id} className={`hover:bg-midnight-800/50 transition-colors ${order.dispute ? 'bg-red-900/5' : ''}`}>
                <td className="p-4 text-white font-mono text-sm">{order.id}</td>
                <td className="p-4 text-white text-sm">{order.customer}</td>
                <td className="p-4 text-gray-300 text-sm">{order.zone}</td>
                <td className="p-4 text-white font-semibold text-sm">Ksh {order.amount}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold
                    ${order.status === 'Delivered' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
""",
    "src/app/admin/finance/page.tsx": """"use client";

export default function FinanceAnalytics() {
  const zones = [
    { name: 'Nairobi CBD', revenue: 15600, percentage: 45 },
    { name: 'Westlands', revenue: 8200, percentage: 24 },
    { name: 'Eastleigh', revenue: 6500, percentage: 19 },
    { name: 'Ngara', revenue: 4100, percentage: 12 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Finance & Analytics</h1>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm">This Month Revenue</p>
          <p className="text-4xl font-serif font-bold text-gold-500 mt-2">Ksh 34,400</p>
          <p className="text-green-400 text-sm mt-2">+18% vs last month</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm">Platform Fee (15%)</p>
          <p className="text-4xl font-serif font-bold text-white mt-2">Ksh 5,160</p>
          <p className="text-gray-500 text-sm mt-2">Net earnings</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm">Rider Payouts</p>
          <p className="text-4xl font-serif font-bold text-white mt-2">Ksh 29,240</p>
          <p className="text-gray-500 text-sm mt-2">Pending to M-Pesa</p>
        </div>
      </div>

      {/* Zone Heatmap / Breakdown */}
      <h2 className="text-xl font-bold text-white mb-4">Revenue by Zone</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 p-6 space-y-4 mb-10">
        {zones.map((zone) => (
          <div key={zone.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white font-semibold text-sm">{zone.name}</span>
              <span className="text-gold-500 font-bold text-sm">Ksh {zone.revenue.toLocaleString()}</span>
            </div>
            <div className="w-full bg-midnight-900 rounded-full h-2.5">
              <div className="bg-gold-500 h-2.5 rounded-full" style={{ width: `${zone.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* M-Pesa Ledger */}
      <h2 className="text-xl font-bold text-white mb-4">Recent M-Pesa Transactions</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden">
        <div className="p-4 border-b border-midnight-700 text-gray-400 text-sm">
          Showing last 3 verified STK Push webhooks
        </div>
        <div className="divide-y divide-midnight-700">
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-white font-semibold text-sm">Order TSK-905 - Westlands</p>
              <p className="text-gray-500 text-xs">Receipt: SHK5G4R2VN</p>
            </div>
            <span className="text-green-400 font-bold">+Ksh 250</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-white font-semibold text-sm">Order TSK-904 - Eastleigh</p>
              <p className="text-gray-500 text-xs">Receipt: PJK8T1X9QM</p>
            </div>
            <span className="text-green-400 font-bold">+Ksh 300</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-white font-semibold text-sm">Order TSK-903 - CBD</p>
              <p className="text-gray-500 text-xs">Receipt: LKD2F7Z4WP</p>
            </div>
            <span className="text-green-400 font-bold">+Ksh 150</span>
          </div>
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

print("\nAdmin Dashboard built successfully!")
