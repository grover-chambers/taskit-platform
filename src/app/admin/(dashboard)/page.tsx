"use client";

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const LiveMap = dynamic(() => import('@/components/LiveMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-midnight-800 rounded-2xl flex items-center justify-center text-gray-500">Loading Map...</div>,
});

export default function AdminCommandCenter() {
  const [stats, setStats] = useState<any>(null);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, dispatchRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/dispatch'),
      ]);
      const statsData = await statsRes.json();
      const dispatchData = await dispatchRes.json();
      setStats(statsData);
      setPendingPayments(dispatchData.awaitingPayment || []);
      setLiveOrders(dispatchData.activeOrders || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 30000); return () => clearInterval(i); }, [fetchData]);

  const handleVerify = async (orderId: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'PAID' }),
      });
      setPendingPayments(pendingPayments.filter(o => o.id !== orderId));
    } catch {}
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-gray-500">Loading...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Admin Console</h1>
          <p className="text-gray-500 text-xs mt-0.5">Nairobi · All Zones</p>
        </div>
        <span className="text-[9.5px] font-bold bg-purple-500/15 text-purple-300 px-2 py-1 rounded-md">Super Admin</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-midnight-700 rounded-2xl overflow-hidden border border-midnight-700 mb-6">
        <div className="bg-midnight-800 p-3 md:p-4 border-r border-b border-midnight-700">
          <div className="font-bold text-lg md:text-xl text-gold-500">KSh {(stats?.revenue || 0).toLocaleString()}</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Revenue today</div>
          <div className="text-[9.5px] text-green-400 mt-1">▲ {stats?.revenueDelta || 0}% vs yesterday</div>
        </div>
        <div className="bg-midnight-800 p-3 md:p-4 border-b border-midnight-700 lg:border-r">
          <div className="font-bold text-lg md:text-xl text-white">{stats?.ordersToday || 0}</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Orders today</div>
          <div className="text-[9.5px] text-green-400 mt-1">▲ {liveOrders.length} active live</div>
        </div>
        <div className="bg-midnight-800 p-3 md:p-4 border-r border-midnight-700">
          <div className="font-bold text-lg md:text-xl text-white">{stats?.ridersOnline || 0}</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Riders online</div>
          <div className="text-[9.5px] text-yellow-400 mt-1">⚠ {stats?.zonesLow || 0} zones low</div>
        </div>
        <div className="bg-midnight-800 p-3 md:p-4">
          <div className="font-bold text-lg md:text-xl text-white">{stats?.completionRate || 96}%</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Completion rate</div>
          <div className="text-[9.5px] text-green-400 mt-1">▲ {stats?.completionDelta || 2}pts this week</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <Link href="/admin/riders" className="bg-midnight-800/80 border border-midnight-700 rounded-xl p-3 md:p-4 hover:border-gold-500/30 transition-colors">
          <div className="font-bold text-lg text-white">{stats?.totalRiders || 0}</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Total Riders</div>
          {stats?.unverifiedRiders > 0 && (
            <div className="text-[9.5px] text-yellow-400 mt-1">⚠ {stats.unverifiedRiders} unverified</div>
          )}
        </Link>
        <Link href="/admin/dispatch" className="bg-midnight-800/80 border border-midnight-700 rounded-xl p-3 md:p-4 hover:border-gold-500/30 transition-colors">
          <div className="font-bold text-lg text-gold-500">{pendingPayments.length}</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Pending M-Pesa Verification</div>
        </Link>
      </div>

      {pendingPayments.length > 0 && (
        <div className="mb-6 bg-yellow-900/20 border border-yellow-500/30 p-4 md:p-5 rounded-2xl">
          <h2 className="text-yellow-400 font-bold text-sm mb-3 flex items-center gap-2">
            Pending M-Pesa Verification
            <span className="bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold">{pendingPayments.length}</span>
          </h2>
          <div className="space-y-2">
            {pendingPayments.map((order) => (
              <div key={order.id} className="bg-midnight-900 p-3 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border border-midnight-700">
                <div>
                  <p className="text-white text-sm font-semibold">{order.customer?.name || 'Customer'} — #{order.id.slice(-7).toUpperCase()}</p>
                  <p className="text-yellow-300 font-mono text-xs mt-0.5">{order.paymentStatus}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-sm">Ksh {order.totalAmount || '—'}</span>
                  <button onClick={() => handleVerify(order.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-green-500 transition-colors">
                    Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 bg-midnight-800/50 border border-midnight-700 rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Live Orders ({liveOrders.length})</h2>
          <Link href="/admin/dispatch" className="text-gold-500 text-[10px] font-bold hover:underline">Dispatch Queue →</Link>
        </div>
        <div className="space-y-1">
          {liveOrders.length === 0 && <p className="text-gray-500 text-xs py-2">No active orders</p>}
          {liveOrders.slice(0, 5).map((order: any) => (
            <div key={order.id} className="flex items-center gap-2.5 py-2 border-b border-midnight-700 last:border-b-0">
              <span className="font-mono text-[9.5px] text-gray-500 w-14 flex-shrink-0">#{order.id.slice(-7).toUpperCase()}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-semibold truncate">{order.errandDescription}</div>
                <div className="text-gray-500 text-[9.5px]">
                  🛵 {order.rider?.name} · {order.rider?.riderDetail?.plateNumber}
                  {order.deliveryOtp && <span className="ml-2 text-gold-500 font-mono">OTP: {order.deliveryOtp}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {order.orderType === 'MARKETPLACE' && (
                  <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-purple-500/15 text-purple-300">MKT</span>
                )}
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  order.status === 'ASSIGNED' ? 'bg-orange-500/15 text-orange-400' :
                  order.status === 'PICKED_UP' ? 'bg-blue-500/15 text-blue-400' :
                  'bg-gold-500/15 text-gold-500'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-midnight-800/50 rounded-2xl border border-midnight-700 overflow-hidden" style={{ height: '280px' }}>
        <LiveMap />
      </div>
    </div>
  );
}
