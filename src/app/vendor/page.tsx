"use client";

import { useState } from 'react';

interface Order {
  id: string;
  time: string;
  items: string;
  amount: string;
  payment: string;
  accepted: boolean;
}

const INITIAL_ORDERS: Order[] = [
  { id: 'TK-2851', time: '2 min ago', items: 'Pilau × 2, Kachumbari, Soda', amount: 'KSh 680', payment: 'Cash on delivery', accepted: false },
  { id: 'TK-2849', time: '8 min ago', items: 'Ugali, Sukuma wiki, Beef', amount: 'KSh 520', payment: 'M-Pesa paid ✓', accepted: true },
  { id: 'TK-2845', time: '15 min ago', items: 'Chai masala × 3, Mandazi × 6', amount: 'KSh 390', payment: 'M-Pesa paid ✓', accepted: true },
];

export default function VendorDashboard() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const handleAccept = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, accepted: true } : o));
  };

  const handleDecline = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const newCount = orders.filter(o => !o.accepted).length;

  return (
    <div className="pb-24">
      {/* Shop Header */}
      <div className="bg-gradient-to-br from-midnight-900 to-midnight-950 px-6 pt-8 pb-5 border-b border-midnight-800">
        <h1 className="text-white font-bold text-lg">Mama Njeri&apos;s Kitchen</h1>
        <p className="text-gray-500 text-[10px] mt-0.5">Westlands · Food & Grocery</p>
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gold-500 bg-gold-500/15 px-2 py-1 rounded-md mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500" style={{animation: 'blink 1.4s ease-in-out infinite'}}></span>
          Open for orders
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border-b border-midnight-800">
        <div className="py-3 px-4 text-center border-r border-midnight-800">
          <div className="font-bold text-lg text-gold-500">KSh 8.4K</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Today</div>
        </div>
        <div className="py-3 px-4 text-center border-r border-midnight-800">
          <div className="font-bold text-lg text-white">23</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Orders</div>
        </div>
        <div className="py-3 px-4 text-center">
          <div className="font-bold text-lg text-yellow-500">⭐4.8</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Rating</div>
        </div>
      </div>

      {/* Order Queue */}
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white text-sm font-bold">Incoming Orders</h2>
          {newCount > 0 && (
            <span className="text-[9.5px] font-bold bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full">{newCount} new</span>
          )}
        </div>

        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className={`bg-midnight-800 border ${order.accepted ? 'border-midnight-700' : 'border-gold-500/30'} rounded-xl p-4`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] text-gray-500">{order.id}</span>
                <span className="font-mono text-[10px] text-orange-400">{order.time}</span>
              </div>
              <div className="text-white text-xs font-semibold mb-1">{order.items}</div>
              <div className="text-gray-400 text-[10px]">{order.amount} · {order.payment}</div>
              {!order.accepted && (
                <div className="flex gap-1.5 mt-3">
                  <button
                    onClick={() => handleAccept(order.id)}
                    className="flex-1 bg-gold-500 text-midnight-950 py-1.5 rounded-lg text-xs font-bold hover:bg-gold-400 transition-colors active:scale-[0.98]"
                  >
                    Accept Order
                  </button>
                  <button
                    onClick={() => handleDecline(order.id)}
                    className="px-3 py-1.5 rounded-lg bg-midnight-700 text-gray-400 text-xs font-semibold border border-midnight-600 hover:text-white transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}
              {order.accepted && (
                <div className="mt-3">
                  <span className="inline-block bg-blue-500/15 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-md">Preparing</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
