"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  errandDescription: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  rider: { name: string; phone: string } | null;
  zone: { name: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  RECEIVED: 'bg-gray-500/15 text-gray-400',
  ACCEPTED: 'bg-blue-500/15 text-blue-400',
  ASSIGNED: 'bg-purple-500/15 text-purple-400',
  PICKED_UP: 'bg-teal-500/15 text-teal-400',
  IN_TRANSIT: 'bg-gold-500/15 text-gold-500',
  DELIVERED: 'bg-green-500/15 text-green-400',
  CANCELLED: 'bg-red-500/15 text-red-400',
};

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: 'Received',
  ACCEPTED: 'Accepted',
  ASSIGNED: 'Assigned',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const ACTIVE_STATUSES = ['RECEIVED', 'ACCEPTED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

type TabKey = 'ALL' | 'ACTIVE' | 'COMPLETED';

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('ALL');

  const fetchOrders = useCallback(async () => {
    try {
      let url = '/api/vendor/orders';
      if (tab === 'ACTIVE') url += '?status=ACTIVE';
      if (tab === 'COMPLETED') url += '?status=DELIVERED';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let filtered = data.orders || [];
        if (tab === 'ACTIVE') {
          filtered = filtered.filter((o: Order) => ACTIVE_STATUSES.includes(o.status));
        }
        setOrders(filtered);
      }
    } catch {}
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    setLoading(true);
    fetchOrders();
  }, [fetchOrders]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <div className="px-6 pt-6 pb-24">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-white font-bold text-lg">Orders</h1>
        <Link
          href="/vendor/orders/new"
          className="bg-gold-500 text-midnight-950 px-4 py-2 rounded-xl font-bold text-xs hover:bg-gold-400 transition-colors active:scale-[0.98]"
        >
          + New
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              tab === t.key
                ? 'bg-gold-500/15 text-gold-500 border border-gold-500/30'
                : 'bg-midnight-800 border border-midnight-700 text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="text-white font-bold text-base mb-1">No Orders</h3>
          <p className="text-gray-400 text-sm">Orders you create will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <Link
              key={order.id}
              href={`/vendor/orders/${order.id}`}
              className="block bg-midnight-800 border border-midnight-700 rounded-xl p-4 hover:border-midnight-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] text-gray-500">#{order.id.slice(-7).toUpperCase()}</span>
                <span className="font-mono text-[10px] text-gray-500">{timeAgo(order.createdAt)}</span>
              </div>
              <p className="text-white text-sm font-semibold mb-1.5">
                {order.errandDescription.length > 45
                  ? order.errandDescription.slice(0, 45) + '...'
                  : order.errandDescription}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${STATUS_COLORS[order.status] || 'bg-gray-500/15 text-gray-400'}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                <div className="flex items-center gap-2">
                  {order.rider && (
                    <span className="text-[10px] text-gray-400">{order.rider.name}</span>
                  )}
                  <span className="text-gold-500 font-bold text-sm">KSh {order.totalAmount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
