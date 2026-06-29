"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useEnterprise } from '../EnterpriseContext';

interface Order {
  id: string;
  errandDescription: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  deliveryOtp: string | null;
  paymentMethod: string;
  rider: { name: string; phone: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  PRICED: 'bg-yellow-500/15 text-yellow-400',
  PAID: 'bg-blue-500/15 text-blue-400',
  PACKED: 'bg-teal-500/15 text-teal-400',
  AWAITING_RIDER: 'bg-orange-500/15 text-orange-400',
  RECEIVED: 'bg-gray-500/15 text-gray-400',
  ACCEPTED: 'bg-haraka-500/15 text-haraka-400',
  ASSIGNED: 'bg-purple-500/15 text-purple-400',
  PICKED_UP: 'bg-blue-500/15 text-blue-400',
  IN_TRANSIT: 'bg-haraka-500/15 text-haraka-500',
  DELIVERED: 'bg-green-500/15 text-green-400',
  CANCELLED: 'bg-red-500/15 text-red-400',
};

const STATUS_LABELS: Record<string, string> = {
  PRICED: 'Priced',
  PAID: 'Paid',
  PACKED: 'Packed',
  AWAITING_RIDER: 'Awaiting Rider',
  RECEIVED: 'Received',
  ACCEPTED: 'Accepted',
  ASSIGNED: 'Assigned',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const PRE_DISPATCH = ['PRICED', 'PAID', 'PACKED', 'AWAITING_RIDER'];
const ACTIVE_STATUSES = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'];

type TabKey = 'ALL' | 'QUEUE' | 'ACTIVE' | 'DELIVERED';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MtaagoOrdersPage() {
  const { subRole, loading: roleLoading } = useEnterprise();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('ALL');

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/enterprise/orders?limit=100');
      if (res.ok) {
        const data = await res.json();
        let all = data.orders || [];
        if (tab === 'QUEUE') all = all.filter((o: Order) => PRE_DISPATCH.includes(o.status));
        else if (tab === 'ACTIVE') all = all.filter((o: Order) => ACTIVE_STATUSES.includes(o.status));
        else if (tab === 'DELIVERED') all = all.filter((o: Order) => o.status === 'DELIVERED');
        setOrders(all);
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
    { key: 'QUEUE', label: 'Queue' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  return (
    <div className="px-6 pt-6 pb-24">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-white font-bold text-lg">Orders</h1>
        {subRole === 'OPERATOR' && (
          <Link
            href="/mtaago/orders/new"
            className="bg-haraka-500 text-midnight-950 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors"
          >
            + New
          </Link>
        )}
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${
              tab === t.key
                ? 'bg-haraka-500/15 text-haraka-500 border border-haraka-500/30'
                : 'bg-midnight-800 border border-midnight-700 text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {roleLoading || loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 border-2 border-haraka-500/30 border-t-haraka-500 rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="text-white font-bold text-base mb-1">No Orders</h3>
          <p className="text-gray-400 text-sm">
            {tab === 'QUEUE' ? 'No orders in queue' : tab === 'ACTIVE' ? 'No active orders' : tab === 'DELIVERED' ? 'No delivered orders' : 'Orders will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <Link key={order.id} href={`/mtaago/orders/${order.id}`} className="block bg-midnight-800 border border-midnight-700 rounded-xl p-4 hover:border-haraka-500/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] text-gray-500">#{order.id.slice(-7).toUpperCase()}</span>
                <span className="font-mono text-[10px] text-gray-500">{timeAgo(order.createdAt)}</span>
              </div>
              <p className="text-white text-sm font-semibold mb-1.5">
                {order.errandDescription.length > 45 ? order.errandDescription.slice(0, 45) + '...' : order.errandDescription}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${STATUS_COLORS[order.status] || 'bg-gray-500/15 text-gray-400'}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                <span className="text-haraka-500 font-bold text-sm">KSh {order.totalAmount.toLocaleString()}</span>
              </div>
              {order.rider && (
                <p className="text-gray-400 text-xs mt-2">🛵 {order.rider.name}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
