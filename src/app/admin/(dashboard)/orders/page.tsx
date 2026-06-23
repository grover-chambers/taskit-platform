"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

function whatsappUrl(phone: string, text?: string) {
  const clean = phone?.replace(/[^0-9+]/g, '') || '';
  const formatted = clean.startsWith('+') ? clean.slice(1) : clean.startsWith('0') ? '254' + clean.slice(1) : clean;
  const msg = text ? `&text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${formatted}${msg}`;
}

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
                {selectedOrder.customer?.phone && (
                  <a
                    href={whatsappUrl(selectedOrder.customer.phone, `Hi ${selectedOrder.customer?.name}, this is TaskIt support regarding order #${selectedOrder.id.slice(-7).toUpperCase()}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 text-green-400 text-xs font-bold hover:text-green-300 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.881 11.881 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                )}
              </div>
              {selectedOrder.rider && (
                <div className="bg-midnight-900/50 rounded-xl p-3 border border-midnight-700">
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Rider</div>
                  <p className="text-white text-sm font-semibold">{selectedOrder.rider.name}</p>
                  <p className="text-gray-500 text-xs">{selectedOrder.rider.phone} · {selectedOrder.rider.riderDetail?.plateNumber}</p>
                  {selectedOrder.rider.phone && (
                    <a
                      href={whatsappUrl(selectedOrder.rider.phone, `Hi ${selectedOrder.rider.name}, this is TaskIt support regarding order #${selectedOrder.id.slice(-7).toUpperCase()}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1.5 text-green-400 text-xs font-bold hover:text-green-300 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.881 11.881 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  )}
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
                <div className="flex items-center gap-2">
                  {order.customer?.phone && (
                    <a
                      href={whatsappUrl(order.customer.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-green-400 hover:text-green-300 transition-colors"
                      title="WhatsApp customer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.881 11.881 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                  )}
                  <span className="text-gold-500 font-semibold">KSh {order.totalAmount?.toLocaleString() || 0}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
