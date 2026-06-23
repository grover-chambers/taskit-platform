"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  RECEIVED: 'bg-gray-500/15 text-gray-400',
  ACCEPTED: 'bg-blue-500/15 text-blue-400',
  ASSIGNED: 'bg-orange-500/15 text-orange-400',
  PICKED_UP: 'bg-cyan-500/15 text-cyan-400',
  IN_TRANSIT: 'bg-gold-500/15 text-gold-500',
  DELIVERED: 'bg-green-500/15 text-green-400',
  CANCELLED: 'bg-red-500/15 text-red-400',
};

const PAYMENT_COLORS: Record<string, string> = {
  PAID: 'bg-green-500/15 text-green-400',
  UNPAID: 'bg-red-500/15 text-red-400',
  PENDING_VERIFICATION: 'bg-yellow-500/15 text-yellow-400',
};

export default function OrdersDisputes() {
  const [orders, setOrders] = useState<any[]>([]);
  const [counts, setCounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [orderTypeFilter, setOrderTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (orderTypeFilter !== 'ALL') params.set('orderType', orderTypeFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setCounts(data.counts || []);
    } catch {}
    setLoading(false);
  }, [statusFilter, orderTypeFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statusCount = (status: string) => {
    const found = counts.find((c: any) => c.status === status);
    return found?._count || 0;
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-gray-500">Loading orders...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Orders & Disputes</h1>
          <p className="text-gray-500 text-xs mt-0.5">{orders.length} orders found</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {['ALL', 'RECEIVED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
              statusFilter === s ? 'bg-gold-500/15 text-gold-500 border border-gold-500/30' : 'bg-midnight-800 text-gray-400 border border-midnight-700'
            }`}
          >
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            {s !== 'ALL' && statusCount(s) > 0 && (
              <span className="ml-1 opacity-60">({statusCount(s)})</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <select
          value={orderTypeFilter}
          onChange={(e) => setOrderTypeFilter(e.target.value)}
          className="bg-midnight-800 border border-midnight-700 text-gray-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-gold-500/50"
        >
          <option value="ALL">All Types</option>
          <option value="ERRAND">Errand</option>
          <option value="MARKETPLACE">Marketplace</option>
        </select>
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-midnight-800 border border-midnight-700 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-gold-500/50 placeholder:text-gray-600"
        />
      </div>

      {selectedOrder ? (
        <div className="mb-6">
          <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white text-sm font-semibold mb-4 inline-flex items-center gap-1">
            ← Back to orders
          </button>
          <div className="bg-midnight-800/80 border border-midnight-700 rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-lg">#{selectedOrder.id.slice(-7).toUpperCase()}</h2>
                <p className="text-gray-500 text-xs">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[selectedOrder.status] || 'bg-gray-500/15 text-gray-400'}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-midnight-900/50 rounded-xl p-3 border border-midnight-700">
                <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Description</div>
                <p className="text-white text-sm">{selectedOrder.errandDescription}</p>
                {selectedOrder.orderType && (
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${selectedOrder.orderType === 'MARKETPLACE' ? 'bg-purple-500/15 text-purple-300' : 'bg-green-500/15 text-green-300'}`}>
                    {selectedOrder.orderType}
                  </span>
                )}
              </div>
              <div className="bg-midnight-900/50 rounded-xl p-3 border border-midnight-700">
                <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Payment</div>
                <p className="text-white text-sm font-bold">KSh {selectedOrder.totalAmount?.toLocaleString() || 0}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${PAYMENT_COLORS[selectedOrder.paymentStatus] || 'bg-gray-500/15 text-gray-400'}`}>
                  {selectedOrder.paymentStatus}
                </span>
                {selectedOrder.mpesaReceipt && (
                  <p className="text-gray-500 text-[9px] mt-1">M-Pesa: {selectedOrder.mpesaReceipt}</p>
                )}
              </div>
            </div>

            {selectedOrder.deliveryOtp && (
              <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-3 mb-4 text-center">
                <span className="text-[9px] text-gray-400">Delivery OTP: </span>
                <span className="text-gold-500 font-mono font-bold text-lg tracking-widest">{selectedOrder.deliveryOtp}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-midnight-900/50 rounded-xl p-3 border border-midnight-700">
                <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Customer</div>
                <p className="text-white text-sm font-semibold">{selectedOrder.customer?.name}</p>
                <p className="text-gray-500 text-xs">{selectedOrder.customer?.phone}</p>
              </div>
              {selectedOrder.rider && (
                <div className="bg-midnight-900/50 rounded-xl p-3 border border-midnight-700">
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Rider</div>
                  <p className="text-white text-sm font-semibold">{selectedOrder.rider.name}</p>
                  <p className="text-gray-500 text-xs">{selectedOrder.rider.phone} · {selectedOrder.rider.riderDetail?.plateNumber}</p>
                </div>
              )}
            </div>

            {selectedOrder.zone && (
              <div className="text-gray-500 text-xs mb-4">
                Zone: {selectedOrder.zone.name} · KSh {selectedOrder.zone.price}
                {selectedOrder.shop && ` · Shop: ${selectedOrder.shop.name}`}
              </div>
            )}

            {selectedOrder.statusLogs && selectedOrder.statusLogs.length > 0 && (
              <div className="border-t border-midnight-700 pt-4">
                <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-2">Status Timeline</div>
                <div className="space-y-2">
                  {selectedOrder.statusLogs.map((log: any, i: number) => (
                    <div key={log.id} className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? 'bg-gold-500' : 'bg-gray-600'}`} />
                      <div>
                        <span className="text-white text-xs font-semibold">{log.status.replace('_', ' ')}</span>
                        {log.note && <span className="text-gray-500 text-[9px] ml-1">— {log.note}</span>}
                        <p className="text-gray-600 text-[9px]">{new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.length === 0 && (
            <div className="bg-midnight-800/50 border border-midnight-700 rounded-2xl p-8 text-center text-gray-500">
              No orders found
            </div>
          )}
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="w-full text-left bg-midnight-800/80 border border-midnight-700 rounded-2xl p-4 hover:border-gold-500/30 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold">#{order.id.slice(-7).toUpperCase()}</span>
                  {order.orderType && (
                    <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${order.orderType === 'MARKETPLACE' ? 'bg-purple-500/15 text-purple-300' : 'bg-green-500/15 text-green-300'}`}>
                      {order.orderType}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${PAYMENT_COLORS[order.paymentStatus] || ''}`}>
                    {order.paymentStatus}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] || ''}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-xs mb-2 line-clamp-1">{order.errandDescription}</p>
              <div className="flex justify-between items-center text-[9.5px] text-gray-500">
                <span>👤 {order.customer?.name || 'Unknown'}{order.rider ? ` · 🛵 ${order.rider.name}` : ''}</span>
                <span className="text-gold-500 font-semibold">KSh {order.totalAmount?.toLocaleString() || 0}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
