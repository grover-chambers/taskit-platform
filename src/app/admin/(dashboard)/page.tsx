"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('@/components/LiveMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-midnight-800 rounded-2xl flex items-center justify-center text-gray-500">Loading Map...</div>
});

// Mock data representing what we will fetch from Neon
const MOCK_PENDING_PAYMENTS = [
  { id: 'TSK-901', customer: 'Grace Njeri', code: 'SHK5G4R2VN', amount: 150 },
  { id: 'TSK-902', customer: 'Brian Otieno', code: 'PJK8T1X9QM', amount: 300 },
];

export default function AdminCommandCenter() {
  const [pendingOrders, setPendingOrders] = useState(MOCK_PENDING_PAYMENTS);

  const handleVerify = (id: string) => {
    // In production, this calls an API route to update Neon DB: paymentStatus -> 'PAID'
    setPendingOrders(pendingOrders.filter(o => o.id !== id));
    alert('Payment Verified! Order moved to Rider Assignment.');
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Command Center</h1>

      {/* PENDING VERIFICATION ALERT */}
      {pendingOrders.length > 0 && (
        <div className="mb-8 bg-yellow-900/20 border border-yellow-500/30 p-6 rounded-2xl">
          <h2 className="text-yellow-400 font-bold text-lg mb-4 flex items-center space-x-2">
            <span>Pending M-Pesa Verification</span>
            <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">{pendingOrders.length}</span>
          </h2>
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <div key={order.id} className="bg-midnight-900 p-4 rounded-xl flex justify-between items-center border border-midnight-700">
                <div>
                  <p className="text-white font-semibold">{order.customer} — {order.id}</p>
                  <p className="text-yellow-300 font-mono text-sm mt-1">Code: {order.code}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-white font-bold">Ksh {order.amount}</span>
                  <button 
                    onClick={() => handleVerify(order.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-500 transition-colors"
                  >
                    Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Today Revenue</p>
          <p className="text-3xl font-bold text-brand-500 mt-1">Ksh 12,400</p>
        </div>
        <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Active Orders</p>
          <p className="text-3xl font-bold text-white mt-1">14</p>
        </div>
        <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Online Riders</p>
          <p className="text-3xl font-bold text-white mt-1">8</p>
        </div>
        <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Till Number</p>
          <p className="text-3xl font-bold text-white mt-1">123456</p>
        </div>
      </div>

      {/* MAP */}
      <div className="mb-8 bg-midnight-800/50 rounded-2xl border border-midnight-700 overflow-hidden" style={{ height: '400px' }}>
        <LiveMap />
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Live Order Feed</h2>
      <div className="bg-midnight-800/50 rounded-2xl border border-midnight-700 p-6 text-center text-gray-400">
        Real-time order feed will populate here from Neon database.
      </div>
    </div>
  );
}
