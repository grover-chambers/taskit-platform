"use client";

import { useEffect, useState } from 'react';

export default function RiderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rider/stats')
      .then(r => r.json())
      .then(data => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 pt-4"><p className="text-gray-500 text-sm">Loading...</p></div>;

  const statusStyles: Record<string, string> = {
    DELIVERED: 'bg-green-900/30 text-green-400',
    IN_TRANSIT: 'bg-blue-500/15 text-blue-400',
    PICKED_UP: 'bg-blue-500/15 text-blue-400',
    ASSIGNED: 'bg-orange-500/15 text-orange-400',
    CANCELLED: 'bg-red-900/30 text-red-400',
    RECEIVED: 'bg-midnight-700 text-gray-400',
    ACCEPTED: 'bg-midnight-700 text-gray-400',
  };

  return (
    <div className="p-6 pt-4">
      <h1 className="text-2xl font-serif font-bold text-white mb-6">Delivery History</h1>
      {orders.length === 0 ? (
        <div className="bg-midnight-800 p-8 rounded-2xl border border-midnight-700 text-gray-500 text-sm text-center">
          No delivery history yet
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-sm text-gray-400">#{order.id.slice(-7).toUpperCase()}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusStyles[order.status] || 'bg-midnight-700 text-gray-400'}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-white font-semibold text-sm">{order.errandDescription}</p>
              <div className="flex justify-between mt-1">
                <p className="text-gray-500 text-xs">{order.zone?.name || '—'}</p>
                <p className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
