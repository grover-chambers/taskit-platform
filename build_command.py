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
            <Link href="/admin/config" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="font-semibold">Platform Config</span>
            </Link>
          </nav>
        </div>
        
        <div className="border-t border-midnight-700 pt-4">
          <Link href="/" className="text-gray-500 text-sm hover:text-gold-500 transition-colors">&larr; Back to Platform</Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-40 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-8 py-4 flex justify-end items-center">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-semibold text-sm">TaskIt Owner</p>
              <p className="text-gray-500 text-xs">Super Admin</p>
            </div>
            <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-midnight-950 font-bold">O</div>
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
""",
    "src/app/admin/orders/[id]/page.tsx": """"use client";

import Link from 'next/link';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = {
    id: params.id,
    customer: { name: 'Grace Njeri', phone: '+254712345678' },
    rider: { name: 'Kamau M.', phone: '+254798765432' },
    zone: 'Nairobi CBD',
    errand: 'Pick up blue envelope from Office 402, Ambank House, and deliver to Moi Avenue.',
    amount: 150,
    status: 'Delivered',
    mpesaReceipt: 'SHK5G4R2VN',
    timeline: [
      { status: 'Received', time: '10:00 AM', done: true },
      { status: 'Paid (M-Pesa)', time: '10:01 AM', done: true },
      { status: 'Rider Assigned', time: '10:05 AM', done: true },
      { status: 'Picked Up', time: '10:25 AM', done: true },
      { status: 'Delivered', time: '10:45 AM', done: true },
    ]
  };

  return (
    <div>
      <Link href="/admin/orders" className="text-gold-500 text-sm font-semibold hover:underline mb-4 inline-block">&larr; Back to Orders</Link>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-white">Order {order.id}</h1>
        <span className="text-sm px-3 py-1 bg-green-900/30 text-green-400 rounded-full font-semibold">{order.status}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details & Timeline */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
            <h2 className="text-white font-bold text-lg mb-4">Errand Details</h2>
            <p className="text-gray-300 mb-4">{order.errand}</p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-midnight-700">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Zone</p>
                <p className="text-white font-semibold mt-1">{order.zone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Amount</p>
                <p className="text-gold-500 font-bold mt-1">Ksh {order.amount}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
            <h2 className="text-white font-bold text-lg mb-6">Order Timeline</h2>
            <div className="relative border-l-2 border-midnight-700 ml-3 space-y-8">
              {order.timeline.map((step, index) => (
                <div key={index} className="relative pl-8 -ml-1">
                  <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 ${step.done ? 'bg-gold-500' : 'bg-midnight-700 border-2 border-midnight-600'}`}></div>
                  <p className="text-white font-semibold">{step.status}</p>
                  <p className="text-gray-500 text-sm">{step.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: People & Payment */}
        <div className="space-y-6">
          <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
            <h2 className="text-white font-bold text-lg mb-4">Payment</h2>
            <div className="bg-green-900/20 p-3 rounded-xl text-green-400 text-sm font-semibold text-center">
              M-Pesa Verified
            </div>
            <p className="text-gray-400 text-xs mt-3">Receipt: <span className="text-white font-mono">{order.mpesaReceipt}</span></p>
          </div>

          <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
            <h2 className="text-white font-bold text-lg mb-4">Customer</h2>
            <p className="text-white font-semibold">{order.customer.name}</p>
            <a href={'tel:' + order.customer.phone} className="text-gold-500 text-sm hover:underline">{order.customer.phone}</a>
          </div>

          <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
            <h2 className="text-white font-bold text-lg mb-4">Rider</h2>
            <p className="text-white font-semibold">{order.rider.name}</p>
            <a href={'tel:' + order.rider.phone} className="text-gold-500 text-sm hover:underline">{order.rider.phone}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
""",
    "src/app/admin/config/page.tsx": """"use client";

import { useState } from 'react';

export default function PlatformConfig() {
  const [zones, setZones] = useState([
    { id: 1, name: 'Nairobi CBD', price: 150, active: true },
    { id: 2, name: 'Westlands', price: 250, active: true },
    { id: 3, name: 'Eastleigh', price: 300, active: true },
    { id: 4, name: 'Ngara / Kamukunji', price: 300, active: true },
  ]);

  const [errandTypes, setErrandTypes] = useState([
    { id: 1, name: 'Shopping', icon: '🛍️' },
    { id: 2, name: 'Bills', icon: '📄' },
    { id: 3, name: 'Documents', icon: '📁' },
    { id: 4, name: 'Groceries', icon: '🥑' },
    { id: 5, name: 'Pharmacy', icon: '💊' },
    { id: 6, name: 'Custom', icon: '✨' },
  ]);

  const [newZoneName, setNewZoneName] = useState('');
  const [newZonePrice, setNewZonePrice] = useState('');
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeIcon, setNewTypeIcon] = useState('');

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName || !newZonePrice) return;
    setZones([...zones, { id: Date.now(), name: newZoneName, price: parseInt(newZonePrice), active: true }]);
    setNewZoneName('');
    setNewZonePrice('');
  };

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName || !newTypeIcon) return;
    setErrandTypes([...errandTypes, { id: Date.now(), name: newTypeName, icon: newTypeIcon }]);
    setNewTypeName('');
    setNewTypeIcon('');
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Platform Configuration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Zone Management */}
        <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <h2 className="text-xl font-bold text-white mb-4">Service Zones & Pricing</h2>
          
          <form onSubmit={handleAddZone} className="mb-6 flex space-x-2">
            <input 
              type="text" 
              placeholder="Zone Name" 
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              className="flex-1 bg-midnight-900 border border-midnight-600 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-gold-500"
            />
            <input 
              type="number" 
              placeholder="Ksh Price" 
              value={newZonePrice}
              onChange={(e) => setNewZonePrice(e.target.value)}
              className="w-24 bg-midnight-900 border border-midnight-600 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-gold-500"
            />
            <button type="submit" className="bg-gold-500 text-midnight-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gold-400">Add</button>
          </form>

          <div className="space-y-3">
            {zones.map((zone) => (
              <div key={zone.id} className="flex justify-between items-center bg-midnight-900 p-3 rounded-xl border border-midnight-700">
                <div>
                  <p className="text-white font-semibold text-sm">{zone.name}</p>
                  <p className="text-gold-500 text-xs font-bold">Ksh {zone.price}</p>
                </div>
                <button onClick={() => setZones(zones.filter(z => z.id !== zone.id))} className="text-red-400 hover:text-red-300 text-xs font-semibold">Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* Errand Types Management */}
        <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <h2 className="text-xl font-bold text-white mb-4">Errand Categories</h2>
          
          <form onSubmit={handleAddType} className="mb-6 flex space-x-2">
            <input 
              type="text" 
              placeholder="Emoji Icon" 
              value={newTypeIcon}
              onChange={(e) => setNewTypeIcon(e.target.value)}
              className="w-20 bg-midnight-900 border border-midnight-600 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-gold-500 text-center"
            />
            <input 
              type="text" 
              placeholder="Category Name" 
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="flex-1 bg-midnight-900 border border-midnight-600 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-gold-500"
            />
            <button type="submit" className="bg-gold-500 text-midnight-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gold-400">Add</button>
            </form>

          <div className="grid grid-cols-2 gap-3">
            {errandTypes.map((type) => (
              <div key={type.id} className="flex justify-between items-center bg-midnight-900 p-3 rounded-xl border border-midnight-700">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{type.icon}</span>
                  <p className="text-white font-semibold text-sm">{type.name}</p>
                </div>
                <button onClick={() => setErrandTypes(errandTypes.filter(t => t.id !== type.id))} className="text-red-400 hover:text-red-300 text-xs font-semibold">X</button>
              </div>
            ))}
          </div>
        </div>
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

  const weekData = [
    { day: 'Mon', amount: 1800 },
    { day: 'Tue', amount: 2400 },
    { day: 'Wed', amount: 1500 },
    { day: 'Thu', amount: 3200 },
    { day: 'Fri', amount: 4100 },
    { day: 'Sat', amount: 2900 },
    { day: 'Sun', amount: 1200 },
  ];

  const maxAmount = Math.max(...weekData.map(d => d.amount));

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Finance & Analytics</h1>

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

      {/* 7-Day Visual Chart */}
      <h2 className="text-xl font-bold text-white mb-4">Last 7 Days Revenue</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 p-6 mb-10">
        <div className="flex items-end justify-between space-x-4 h-48">
          {weekData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full">
              <div className="w-full bg-gold-500/80 rounded-t-lg transition-all" style={{ height: `${(d.amount / maxAmount) * 100}%` }}></div>
              <p className="text-gray-400 text-xs mt-2 font-semibold">{d.day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Breakdown */}
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
      <h2 className="text-xl font-bold text-white mb-4">Recent M-Pesa Webhooks</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden">
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
        </div>
      </div>
    </div>
  );
}
""",
    "src/app/admin/orders/page.tsx": """"use client";

import Link from 'next/link';

export default function OrdersDisputes() {
  const historicalOrders = [
    { id: 'TSK-900', customer: 'Grace N.', zone: 'CBD', amount: 150, status: 'Delivered', dispute: false },
    { id: 'TSK-899', customer: 'John M.', zone: 'Eastleigh', amount: 300, status: 'Cancelled', dispute: true },
    { id: 'TSK-898', customer: 'Sarah K.', zone: 'Ngara', amount: 300, status: 'Delivered', dispute: false },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Orders & Disputes</h1>

      <div className="mb-8 bg-red-900/10 border border-red-500/30 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h3 className="text-red-400 font-bold text-lg">Active Dispute: Order TSK-899</h3>
          <p className="text-gray-400 text-sm mt-1">Customer claims rider never arrived. M-Pesa payment is on hold.</p>
        </div>
        <Link href="/admin/orders/TSK-899" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-500 transition-colors">
          Review & Refund
        </Link>
      </div>

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
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Action</th>
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
                <td className="p-4">
                  <Link href={'/admin/orders/' + order.id} className="text-gold-500 text-sm font-semibold hover:underline">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

print("\nAdmin Command Center built successfully!")
