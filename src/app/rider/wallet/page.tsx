"use client";

import { useEffect, useState } from 'react';

const TYPE_ICONS: Record<string, string> = {
  ERRAND: '🏃',
  MARKETPLACE: '🛒',
};

const statusStyles: Record<string, string> = {
  DELIVERED: 'bg-green-900/30 text-green-400',
  IN_TRANSIT: 'bg-blue-500/15 text-blue-400',
  PICKED_UP: 'bg-blue-500/15 text-blue-400',
  ASSIGNED: 'bg-orange-500/15 text-orange-400',
  CANCELLED: 'bg-red-900/30 text-red-400',
  RECEIVED: 'bg-midnight-700 text-gray-400',
  ACCEPTED: 'bg-midnight-700 text-gray-400',
};

const PAYOUT_COLORS: Record<string, string> = {
  UNPAID: 'text-yellow-400',
  PAID: 'text-green-400',
};

type Tab = 'earnings' | 'history';

export default function RiderWallet() {
  const [tab, setTab] = useState<Tab>('earnings');
  const [earnings, setEarnings] = useState<any[]>([]);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unpaidEarnings, setUnpaidEarnings] = useState<any[]>([]);
  const [requestingPayout, setRequestingPayout] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/rider/earnings').then(r => r.json()),
      fetch('/api/rider/stats').then(r => r.json()),
    ]).then(([earningsData, statsData]) => {
      const allEarnings = earningsData.earnings || [];
      setEarnings(allEarnings);
      const today = statsData.riderDetail?.todayEarnings || 0;
      setTodayEarnings(today);
      setTotalEarnings(earningsData.totalEarnings || 0);
      setAvailableBalance(earningsData.availableBalance || 0);
      setPendingBalance(earningsData.pendingBalance || 0);
      setOrders(statsData.orders || []);
      const unpaid = (earningsData.earnings || []).filter((e: any) => e.payoutStatus === 'UNPAID' && !e.payoutId);
      setUnpaidEarnings(unpaid);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 pt-4"><p className="text-gray-500 text-sm">Loading...</p></div>;

  const handlePayoutRequest = async () => {
    setRequestingPayout(true);
    try {
      const res = await fetch('/api/rider/payout-request', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUnpaidEarnings([]);
        setAvailableBalance(0);
      }
    } catch {}
    setRequestingPayout(false);
  };

  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status));
  const completedOrders = orders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status));

  return (
    <div className="p-6 pt-4">
      <h1 className="text-2xl font-serif font-bold text-white mb-4">Wallet</h1>

      <div className="bg-midnight-800 border border-midnight-700 p-6 rounded-2xl shadow-soft-dark mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-wider">Total Earnings</p>
        <p className="text-4xl font-serif font-bold text-gold-500 mt-2">KSh {availableBalance.toLocaleString()}</p>
        {pendingBalance > 0 && (
          <p className="text-yellow-400/80 text-xs mt-2">KSh {pendingBalance.toLocaleString()} pending payout</p>
        )}
      </div>

      {unpaidEarnings.length > 0 && (
        <button
          onClick={handlePayoutRequest}
          disabled={requestingPayout}
          className="w-full bg-gold-500 text-midnight-950 py-3.5 rounded-2xl font-bold mb-4 disabled:opacity-50 transition-all hover:bg-gold-400 active:scale-[0.98] flex justify-center items-center gap-2"
        >
          {requestingPayout ? (
            <div className="w-5 h-5 border-2 border-midnight-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            'Request Payout'
          )}
        </button>
      )}

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-midnight-800 border border-midnight-700 p-3 rounded-2xl shadow-soft-dark text-center">
          <p className="text-gold-500 font-bold text-lg">KSh {todayEarnings.toLocaleString()}</p>
          <p className="text-gray-500 text-[9px] mt-0.5">Today</p>
        </div>
        <div className="bg-midnight-800 border border-midnight-700 p-3 rounded-2xl shadow-soft-dark text-center">
          <p className="text-yellow-400 font-bold text-lg">KSh {pendingBalance.toLocaleString()}</p>
          <p className="text-gray-500 text-[9px] mt-0.5">Pending</p>
        </div>
        <div className="bg-midnight-800 border border-midnight-700 p-3 rounded-2xl shadow-soft-dark text-center">
          <p className="text-white font-bold text-lg">KSh {totalEarnings.toLocaleString()}</p>
          <p className="text-gray-500 text-[9px] mt-0.5">All Time</p>
        </div>
      </div>

      <div className="flex bg-midnight-800 border border-midnight-700 rounded-xl p-1 mb-5">
        <button
          onClick={() => setTab('earnings')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
            tab === 'earnings' ? 'bg-gold-500 text-midnight-950' : 'text-gray-400'
          }`}
        >
          Earnings
        </button>
        <button
          onClick={() => setTab('history')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
            tab === 'history' ? 'bg-gold-500 text-midnight-950' : 'text-gray-400'
          }`}
        >
          History
        </button>
      </div>

      {tab === 'earnings' && (
        <div className="space-y-3">
          {earnings.length === 0 && (
            <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 text-gray-500 text-sm text-center">
              No earnings yet — complete deliveries to earn
            </div>
          )}
          {earnings.map((e: any) => (
            <div key={e.id} className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 flex justify-between items-center">
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-sm truncate">
                  {e.order?.errandDescription
                    ? e.order.errandDescription.length > 30
                      ? e.order.errandDescription.slice(0, 30) + '...'
                      : e.order.errandDescription
                    : 'Delivery'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-gray-500 text-xs">{new Date(e.createdAt).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <span className={`text-[9px] font-bold ${PAYOUT_COLORS[e.payoutStatus] || 'text-gray-500'}`}>
                    {e.payoutStatus === 'PAID' ? '✓ Paid' : '⏳ Pending'}
                  </span>
                </div>
              </div>
              <p className="text-gold-500 font-bold flex-shrink-0 ml-3">+KSh {e.amount}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'history' && (
        <>
          {orders.length === 0 ? (
            <div className="bg-midnight-800 p-8 rounded-2xl border border-midnight-700 text-gray-500 text-sm text-center">
              No delivery history yet
            </div>
          ) : (
            <>
              {activeOrders.length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-3">In Progress</p>
                  <div className="space-y-3">
                    {activeOrders.map((order) => (
                      <div key={order.id} className="bg-midnight-800 p-4 rounded-2xl border border-blue-500/30">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{TYPE_ICONS[order.orderType] || '📦'}</span>
                            <span className="font-mono text-sm text-gray-400">#{order.id.slice(-7).toUpperCase()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusStyles[order.status] || 'bg-midnight-700 text-gray-400'}`}>
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                        <p className="text-white font-semibold text-sm">{order.errandDescription}</p>
                        {order.pickupLocation && <p className="text-gray-500 text-xs mt-1">P: {order.pickupLocation}</p>}
                        {order.dropoffLocation && <p className="text-gray-500 text-xs">D: {order.dropoffLocation}</p>}
                        <div className="flex justify-between mt-2">
                          <p className="text-gray-500 text-xs">{order.zone?.name || '—'}</p>
                          <p className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Completed</p>
                <div className="space-y-3">
                  {completedOrders.map((order) => (
                    <div key={order.id} className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{TYPE_ICONS[order.orderType] || '📦'}</span>
                          <span className="font-mono text-sm text-gray-400">#{order.id.slice(-7).toUpperCase()}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusStyles[order.status] || 'bg-midnight-700 text-gray-400'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-white font-semibold text-sm">{order.errandDescription}</p>
                      {order.dropoffLocation && <p className="text-gray-500 text-xs mt-1">D: {order.dropoffLocation}</p>}
                      <div className="flex justify-between mt-2">
                        <p className="text-gray-500 text-xs">{order.zone?.name || '—'}</p>
                        <p className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
