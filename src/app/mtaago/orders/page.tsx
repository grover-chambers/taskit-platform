"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  shortId: string;
  errandDescription: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  deliveryOtp: string | null;
  rider: { name: string; phone: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  RECEIVED: 'bg-gray-500/15 text-gray-400',
  ACCEPTED: 'bg-haraka-500/15 text-haraka-400',
  ASSIGNED: 'bg-purple-500/15 text-purple-400',
  PICKED_UP: 'bg-blue-500/15 text-blue-400',
  IN_TRANSIT: 'bg-haraka-500/15 text-haraka-500',
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

type TabKey = 'ALL' | 'ACTIVE' | 'DELIVERED';

export default function MtaagoOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('ALL');

  const fetchOrders = useCallback(async () => {
    try {
      let url = '/api/vendor/orders';
      if (tab === 'ACTIVE') url += '?status=ASSIGNED';
      if (tab === 'DELIVERED') url += '?status=DELIVERED';
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
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  return (
    <div className="px-6 pt-6 pb-24">
      <h1 className="text-white font-bold text-lg mb-5">Orders</h1>

      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              tab === t.key
                ? 'bg-haraka-500/15 text-haraka-500 border border-haraka-500/30'
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
          <p className="text-gray-400 text-sm">
            {tab === 'ACTIVE' ? 'No active orders right now' : tab === 'DELIVERED' ? 'No delivered orders yet' : 'Orders will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] text-gray-500">#{order.shortId || order.id.slice(-7).toUpperCase()}</span>
                <span className="font-mono text-[10px] text-gray-500">{timeAgo(order.createdAt)}</span>
              </div>
              <p className="text-white text-sm font-semibold mb-1.5">
                {order.errandDescription.length > 45 ? order.errandDescription.slice(0, 45) + '...' : order.errandDescription}
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${STATUS_COLORS[order.status] || 'bg-gray-500/15 text-gray-400'}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                <span className="text-haraka-500 font-bold text-sm">KSh {order.totalAmount.toLocaleString()}</span>
              </div>
              {order.rider && (
                <p className="text-gray-400 text-xs mb-2">🛵 {order.rider.name}</p>
              )}
              {order.status === 'IN_TRANSIT' && order.deliveryOtp && (
                <div className="bg-haraka-500/10 border border-haraka-500/20 rounded-lg px-3 py-1.5 flex items-center justify-between mb-2">
                  <span className="text-[9px] text-gray-400">OTP:</span>
                  <span className="text-haraka-500 font-mono font-bold text-sm tracking-widest">{order.deliveryOtp}</span>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <a
                  href={`https://wa.me/${order.rider?.phone ? '254' + order.rider.phone.replace(/^0/, '') : ''}?text=${encodeURIComponent(`Hi, checking on order #${order.shortId || order.id.slice(-7).toUpperCase()} - Status: ${STATUS_LABELS[order.status] || order.status}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600/15 border border-green-600/30 text-green-400 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-green-600/25 transition-colors"
                >
                  WhatsApp
                </a>
                <Link
                  href={`/track/${order.id}`}
                  className="bg-haraka-500/15 border border-haraka-500/30 text-haraka-500 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-haraka-500/25 transition-colors"
                >
                  Track Live
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
