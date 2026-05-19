"use client";

import Link from 'next/link';

export default function OrdersDisputes() {
  const historicalOrders = [
    { id: 'TSK-900', customer: 'Grace N.', zone: 'CBD', amount: 150, status: 'Delivered', dispute: false },
    { id: 'TSK-899', customer: 'John M.', zone: 'Eastleigh', amount: 300, status: 'Cancelled', dispute: true },
    { id: 'TSK-898', customer: 'Sarah K.', zone: 'Ngara', amount: 300, status: 'Delivered', dispute: false },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Orders & Disputes</h1>

      <div className="mb-8 bg-red-900/10 border border-red-500/30 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h3 className="text-red-400 font-bold text-lg">Active Dispute: Order TSK-899</h3>
          <p className="text-gray-400 text-sm mt-1">Customer claims rider never arrived. M-Pesa payment is on hold.</p>
        </div>
        <Link href="/admin/orders/TSK-899" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-500 transition-colors">
          Review & Refund
        </Link>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Order History</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-midnight-900/50 border-b border-midnight-700">
            <tr>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Order ID</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Customer</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Zone</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Amount</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Status</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-midnight-700">
            {historicalOrders.map((order) => (
              <tr key={order.id} className={`hover:bg-midnight-800/50 transition-colors ${order.dispute ? 'bg-red-900/5' : ''}`}>
                <td className="p-4 text-white font-mono text-sm">{order.id}</td>
                <td className="p-4 text-white text-sm">{order.customer}</td>
                <td className="p-4 text-gray-300 text-sm">{order.zone}</td>
                <td className="p-4 text-white font-semibold text-sm">Ksh {order.amount}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold
                    ${order.status === 'Delivered' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <Link href={'/admin/orders/' + order.id} className="text-gold-500 text-sm font-semibold hover:underline">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
