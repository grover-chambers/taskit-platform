"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WalletPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  useEffect(() => {
    fetch('/api/orders?role=customer')
      .then(r => r.json())
      .then(data => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const paidOrders = orders.filter(o => o.paymentStatus === 'PAID');
  const totalSpent = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const thisMonth = paidOrders.filter(o => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthSpent = thisMonth.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const handlePromo = () => {
    if (!promoCode.trim()) return;
    setPromoMsg('Promo codes coming soon!');
    setTimeout(() => setPromoMsg(''), 3000);
  };

  return (
    <div className="px-6 pt-4 pb-28">
      <div className="bg-midnight-800 border border-midnight-700 p-6 rounded-2xl shadow-soft-dark mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full -mr-10 -mt-10" />
        <p className="text-gray-400 text-sm mb-1">Total Spent</p>
        <h2 className="text-4xl font-serif font-bold text-white mb-1">KSh {totalSpent.toLocaleString()}</h2>
        <p className="text-gray-500 text-xs">KSh {monthSpent.toLocaleString()} this month · {paidOrders.length} paid order{paidOrders.length !== 1 ? 's' : ''}</p>

        <div className="bg-midnight-900 border border-midnight-700 rounded-xl p-3 flex items-center space-x-2 mt-4">
          <svg className="w-5 h-5 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
          <input
            type="text"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-midnight-600"
          />
          <button onClick={handlePromo} className="text-gold-500 text-sm font-bold hover:underline">Apply</button>
        </div>
        {promoMsg && <p className="text-gray-500 text-xs mt-2">{promoMsg}</p>}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold text-lg">Payment History</h3>
        <Link href="/dashboard/orders" className="text-gold-500 text-sm font-semibold hover:underline">View Orders</Link>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-8 text-center">Loading...</div>
      ) : paidOrders.length === 0 ? (
        <div className="bg-midnight-800/50 border border-dashed border-midnight-700 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-2">💳</p>
          <p className="text-gray-500 text-sm">No payment history yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paidOrders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl shadow-soft-dark block hover:border-midnight-600 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-sm font-bold text-white">KSh {order.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-white font-semibold text-sm truncate flex-1 mr-2">{order.errandDescription}</p>
                <span className="text-xs px-2 py-1 rounded-full font-semibold bg-green-500/15 text-green-400">Paid</span>
              </div>
              {order.zone && (
                <p className="text-gray-500 text-xs mt-1">{order.zone.name}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
