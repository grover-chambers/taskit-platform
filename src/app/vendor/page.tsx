"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface Stats {
  activeOrders: number;
  completedOrders: number;
  totalSpent: number;
  currentMonthSpend: number;
  rate: number;
  clientName: string;
  lastOrder: {
    id: string;
    errandDescription: string;
    status: string;
    createdAt: string;
  } | null;
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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function VendorOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/vendor/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-sm">Unable to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-24">
      <div className="mb-5">
        <h1 className="text-white font-bold text-lg">
          Welcome back, <span className="text-gold-500">{stats.clientName}</span>
        </h1>
        <p className="text-gray-500 text-[10px] mt-0.5 font-semibold uppercase tracking-wider">Enterprise Dashboard</p>
      </div>

      <div className="grid grid-cols-3 mb-4">
        <div className="py-3 px-4 text-center border-r border-midnight-800">
          <div className="font-bold text-lg text-gold-500">{stats.activeOrders}</div>
          <div className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-wider">Today's Orders</div>
        </div>
        <div className="py-3 px-4 text-center border-r border-midnight-800">
          <div className="font-bold text-lg text-white">{stats.completedOrders}</div>
          <div className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-wider">Completed</div>
        </div>
        <div className="py-3 px-4 text-center">
          <div className="font-bold text-lg text-gold-500">KSh {stats.totalSpent.toLocaleString()}</div>
          <div className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-wider">Total Spent</div>
        </div>
      </div>

      <div className="bg-midnight-800 border border-gold-500/30 rounded-xl p-4 mb-4">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">Current Rate</p>
        <p className="text-gold-500 font-bold text-base">KSh {stats.rate} <span className="text-gray-400 text-sm font-normal">per delivery</span></p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link
          href="/vendor/orders/new"
          className="bg-gold-500 text-midnight-950 py-3 rounded-xl font-bold text-sm text-center hover:bg-gold-400 transition-colors active:scale-[0.98]"
        >
          New Order
        </Link>
        <Link
          href="/vendor/orders"
          className="bg-midnight-800 border border-midnight-700 text-white py-3 rounded-xl font-bold text-sm text-center hover:border-midnight-600 transition-colors"
        >
          View All Orders
        </Link>
      </div>

      {stats.lastOrder && (
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 mb-4">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-2">Last Order</p>
          <p className="text-white text-sm font-semibold mb-1">
            {stats.lastOrder.errandDescription.length > 50
              ? stats.lastOrder.errandDescription.slice(0, 50) + '...'
              : stats.lastOrder.errandDescription}
          </p>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${STATUS_COLORS[stats.lastOrder.status] || 'bg-gray-500/15 text-gray-400'}`}>
              {stats.lastOrder.status.replace('_', ' ')}
            </span>
            <span className="text-[10px] text-gray-500">{timeAgo(stats.lastOrder.createdAt)}</span>
          </div>
        </div>
      )}

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">Monthly Spend</p>
        <p className="text-gold-500 font-bold text-base">KSh {stats.currentMonthSpend.toLocaleString()} <span className="text-gray-400 text-sm font-normal">this month</span></p>
      </div>
    </div>
  );
}
