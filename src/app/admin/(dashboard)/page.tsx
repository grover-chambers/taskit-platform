"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('@/components/LiveMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-midnight-800 rounded-2xl flex items-center justify-center text-gray-500">Loading Map...</div>
});

const MOCK_PENDING_PAYMENTS = [
  { id: 'TSK-901', customer: 'Grace Njeri', code: 'SHK5G4R2VN', amount: 150 },
  { id: 'TSK-902', customer: 'Brian Otieno', code: 'PJK8T1X9QM', amount: 300 },
];

const LIVE_ORDERS = [
  { id: 'TK-2851', name: 'Errand — Westlands', type: 'Rider: Peter M.', status: 'live' as const },
  { id: 'TK-2849', name: 'Marketplace — Mama Njeri\'s', type: 'Rider: Grace K.', status: 'transit' as const },
  { id: 'TK-2847', name: 'LaaS — KaniniOS Delivery', type: 'Rider: James O.', status: 'pending' as const },
];

const STATUS_STYLES: Record<string, string> = {
  live: 'bg-gold-500/15 text-gold-500',
  transit: 'bg-blue-500/15 text-blue-400',
  pending: 'bg-orange-500/15 text-orange-400',
};

export default function AdminCommandCenter() {
  const [pendingOrders, setPendingOrders] = useState(MOCK_PENDING_PAYMENTS);

  const handleVerify = (id: string) => {
    setPendingOrders(pendingOrders.filter(o => o.id !== id));
    alert('Payment Verified! Order moved to Rider Assignment.');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Console</h1>
          <p className="text-gray-500 text-xs mt-0.5">Nairobi · All Zones</p>
        </div>
        <span className="text-[9.5px] font-bold bg-purple-500/15 text-purple-300 px-2 py-1 rounded-md">Super Admin</span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-px bg-midnight-700 rounded-2xl overflow-hidden border border-midnight-700 mb-6">
        <div className="bg-midnight-800 p-4 border-r border-b border-midnight-700">
          <div className="font-bold text-xl text-gold-500">KSh 42K</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Revenue today</div>
          <div className="text-[9.5px] text-green-400 mt-1">▲ 18% vs yesterday</div>
        </div>
        <div className="bg-midnight-800 p-4 border-b border-midnight-700">
          <div className="font-bold text-xl text-white">187</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Orders today</div>
          <div className="text-[9.5px] text-green-400 mt-1">▲ 23 active live</div>
        </div>
        <div className="bg-midnight-800 p-4 border-r border-midnight-700">
          <div className="font-bold text-xl text-white">34</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Riders online</div>
          <div className="text-[9.5px] text-yellow-400 mt-1">⚠ 6 zones low</div>
        </div>
        <div className="bg-midnight-800 p-4">
          <div className="font-bold text-xl text-white">96%</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Completion rate</div>
          <div className="text-[9.5px] text-green-400 mt-1">▲ 2pts this week</div>
        </div>
      </div>

      {/* Pending M-Pesa Verification */}
      {pendingOrders.length > 0 && (
        <div className="mb-6 bg-yellow-900/20 border border-yellow-500/30 p-5 rounded-2xl">
          <h2 className="text-yellow-400 font-bold text-sm mb-3 flex items-center gap-2">
            Pending M-Pesa Verification
            <span className="bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold">{pendingOrders.length}</span>
          </h2>
          <div className="space-y-2">
            {pendingOrders.map((order) => (
              <div key={order.id} className="bg-midnight-900 p-3 rounded-xl flex justify-between items-center border border-midnight-700">
                <div>
                  <p className="text-white text-sm font-semibold">{order.customer} — {order.id}</p>
                  <p className="text-yellow-300 font-mono text-xs mt-0.5">Code: {order.code}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-sm">Ksh {order.amount}</span>
                  <button
                    onClick={() => handleVerify(order.id)}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-green-500 transition-colors"
                  >
                    Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Orders */}
      <div className="mb-6 bg-midnight-800/50 border border-midnight-700 rounded-2xl p-5">
        <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">Live Orders</h2>
        <div className="space-y-1">
          {LIVE_ORDERS.map((order) => (
            <div key={order.id} className="flex items-center gap-2.5 py-2 border-b border-midnight-700 last:border-b-0">
              <span className="font-mono text-[9.5px] text-gray-500 w-14 flex-shrink-0">{order.id}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-semibold">{order.name}</div>
                <div className="text-gray-500 text-[9.5px]">{order.type}</div>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${STATUS_STYLES[order.status]}`}>
                {order.status === 'live' ? 'Live' : order.status === 'transit' ? 'Transit' : 'Assigned'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MAP */}
      <div className="bg-midnight-800/50 rounded-2xl border border-midnight-700 overflow-hidden" style={{ height: '320px' }}>
        <LiveMap />
      </div>
    </div>
  );
}
