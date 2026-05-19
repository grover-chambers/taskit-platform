"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map to prevent Next.js SSR errors (Leaflet needs 'window')
const LiveMap = dynamic(() => import('@/components/LiveMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-midnight-800 rounded-2xl flex items-center justify-center text-gray-500">Loading Map...</div>
});

const MOCK_ORDERS = [
  { id: 'TSK-905', customer: 'New Customer', zone: 'Westlands', status: 'Pending', amount: 250, time: 'Just now' },
  { id: 'TSK-904', customer: 'Amina J.', zone: 'Eastleigh', status: 'Pending', amount: 300, time: '2m ago' },
  { id: 'TSK-903', customer: 'Wanjiku K.', zone: 'CBD', status: 'Rider Assigned', amount: 150, time: '10m ago' },
  { id: 'TSK-902', customer: 'Brian M.', zone: 'Ngara', status: 'In Transit', amount: 300, time: '25m ago' },
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const handleAssign = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: 'Rider Assigned' } : order
    ));
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Command Center</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Today Revenue</p>
          <p className="text-3xl font-bold text-gold-500 mt-1">Ksh 12,400</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Active Orders</p>
          <p className="text-3xl font-bold text-white mt-1">14</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Online Riders</p>
          <p className="text-3xl font-bold text-white mt-1">8</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gold-500/50 shadow-gold">
          <p className="text-gold-500 text-sm font-bold">Pending Assign</p>
          <p className="text-3xl font-bold text-gold-500 mt-1">2</p>
        </div>
      </div>

      {/* Live Map Section */}
      <div className="mb-8 bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden" style={{ height: '400px' }}>
        <LiveMap />
      </div>

      {/* Live Order Feed */}
      <h2 className="text-xl font-bold text-white mb-4">Live Order Feed</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden">
        <div className="overflow-x-auto">
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
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-midnight-800/50 transition-colors">
                  <td className="p-4 text-white font-mono text-sm">{order.id}</td>
                  <td className="p-4 text-white text-sm">{order.customer}</td>
                  <td className="p-4 text-gray-300 text-sm">{order.zone}</td>
                  <td className="p-4 text-white font-semibold text-sm">Ksh {order.amount}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold
                      ${order.status === 'Pending' ? 'bg-yellow-900/30 text-yellow-400' : 
                        order.status === 'Rider Assigned' ? 'bg-blue-900/30 text-blue-400' : 
                        'bg-green-900/30 text-green-400'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {order.status === 'Pending' && (
                      <button 
                        onClick={() => handleAssign(order.id)}
                        className="bg-gold-500 text-midnight-950 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gold-400 transition-colors shadow-gold"
                      >
                        Assign Rider
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
