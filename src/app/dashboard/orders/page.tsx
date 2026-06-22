"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  RECEIVED: 'bg-yellow-500/20 text-yellow-400',
  ACCEPTED: 'bg-blue-500/20 text-blue-400',
  ASSIGNED: 'bg-indigo-500/20 text-indigo-400',
  PICKED_UP: 'bg-cyan-500/20 text-cyan-400',
  IN_TRANSIT: 'bg-gold-500/20 text-gold-500',
  DELIVERED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

const TYPE_ICONS: Record<string, string> = {
  ERRAND: '🏃',
  MARKETPLACE: '🛒',
};

type Tab = 'active' | 'completed';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('active');

  useEffect(() => {
    fetch('/api/orders?role=customer')
      .then(r => r.json())
      .then(data => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status));
  const completedOrders = orders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status));
  const displayed = tab === 'active' ? activeOrders : completedOrders;

  return (
    <div className="pb-24">
      <div className="p-6 pt-4">
        <h1 className="text-2xl font-serif font-bold text-white">My Orders</h1>
        <p className="text-gray-400 text-sm mt-1">Track your active and past errands</p>
      </div>

      <div className="px-6 mb-4 flex gap-2">
        <button
          onClick={() => setTab('active')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'active' ? 'bg-gold-500 text-midnight-950' : 'bg-midnight-800 text-gray-400 border border-midnight-700'}`}
        >
          Active ({activeOrders.length})
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'completed' ? 'bg-gold-500 text-midnight-950' : 'bg-midnight-800 text-gray-400 border border-midnight-700'}`}
        >
          Completed ({completedOrders.length})
        </button>
      </div>

      <div className="px-6 space-y-3">
        {loading ? (
          <div className="text-gray-500 text-sm py-8 text-center">Loading orders...</div>
        ) : displayed.length === 0 ? (
          <div className="bg-midnight-800/50 border border-dashed border-midnight-700 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-2">{tab === 'active' ? '📦' : '✅'}</p>
            <p className="text-gray-500 text-sm">{tab === 'active' ? 'No active orders' : 'No completed orders yet'}</p>
            {tab === 'active' && (
              <Link href="/book/errand" className="text-gold-500 text-sm font-semibold mt-2 inline-block hover:underline">Book an errand</Link>
            )}
          </div>
        ) : (
          displayed.map((order) => {
            const statusColor = STATUS_COLORS[order.status] || 'bg-gray-500/20 text-gray-400';
            const icon = TYPE_ICONS[order.orderType] || '📋';
            const isActive = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(order.status);

            return (
              <Link
                href={`/dashboard/orders/${order.id}`}
                key={order.id}
                className={`block bg-midnight-800 p-4 rounded-2xl border shadow-soft-dark transition-transform active:scale-[0.98] ${isActive ? 'border-gold-500/50' : 'border-midnight-700'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs text-gray-500">#{order.id.slice(-7).toUpperCase()}</span>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${statusColor}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{icon}</span>
                  <span className="text-white font-semibold text-sm truncate flex-1">{order.errandDescription}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400 text-xs">{order.zone?.name || '—'}</span>
                  <span className="text-white font-bold text-sm">KSh {order.totalAmount}</span>
                </div>
                {isActive && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
                    <span className="text-gold-500 text-[10px] font-bold">Live tracking available</span>
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
