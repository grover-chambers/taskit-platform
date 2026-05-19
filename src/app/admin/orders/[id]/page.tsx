"use client";

import { use } from 'react';
import Link from 'next/link';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const order = {
    id: id,
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
