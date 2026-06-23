"use client";

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('@/components/LiveMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-midnight-800 rounded-2xl flex items-center justify-center text-gray-500">Loading Map...</div>,
});

export default function AdminDispatchPage() {
  const [assignable, setAssignable] = useState<any[]>([]);
  const [awaitingPayment, setAwaitingPayment] = useState<any[]>([]);
  const [availableRiders, setAvailableRiders] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'queue' | 'active' | 'unpaid'>('queue');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dispatch');
      const data = await res.json();
      setAssignable(data.assignable || []);
      setAwaitingPayment(data.awaitingPayment || []);
      setAvailableRiders(data.availableRiders || []);
      setActiveOrders(data.activeOrders || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); const interval = setInterval(fetchData, 15000); return () => clearInterval(interval); }, [fetchData]);

  const handleAssign = async (orderId: string, riderId: string) => {
    setAssigning(orderId);
    try {
      const res = await fetch('/api/admin/dispatch/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, riderId }),
      });
      if (res.ok) {
        setSelectedOrder(null);
        await fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Assignment failed');
      }
    } catch {}
    setAssigning(null);
  };

  const assignablesCount = assignable.length;
  const unpaidCount = awaitingPayment.length;
  const activeCount = activeOrders.length;

  if (loading) {
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-gray-500">Loading dispatch...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Dispatch Queue</h1>
          <p className="text-gray-500 text-xs mt-0.5">Assign riders to paid orders</p>
        </div>
        <span className="text-[9.5px] font-bold bg-gold-500/15 text-gold-500 px-2 py-1 rounded-md">{availableRiders.length} riders online</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <button onClick={() => setActiveTab('queue')} className={`p-2 md:p-3 rounded-xl text-center transition-colors ${activeTab === 'queue' ? 'bg-gold-500/15 border border-gold-500/30' : 'bg-midnight-800 border border-midnight-700'}`}>
          <div className="font-bold text-base md:text-lg text-gold-500">{assignablesCount}</div>
          <div className="text-[8px] md:text-[9px] text-gray-500">Ready to Assign</div>
        </button>
        <button onClick={() => setActiveTab('active')} className={`p-2 md:p-3 rounded-xl text-center transition-colors ${activeTab === 'active' ? 'bg-blue-500/15 border border-blue-500/30' : 'bg-midnight-800 border border-midnight-700'}`}>
          <div className="font-bold text-base md:text-lg text-blue-400">{activeCount}</div>
          <div className="text-[8px] md:text-[9px] text-gray-500">In Progress</div>
        </button>
        <button onClick={() => setActiveTab('unpaid')} className={`p-2 md:p-3 rounded-xl text-center transition-colors ${activeTab === 'unpaid' ? 'bg-orange-500/15 border border-orange-500/30' : 'bg-midnight-800 border border-midnight-700'}`}>
          <div className="font-bold text-base md:text-lg text-orange-400">{unpaidCount}</div>
          <div className="text-[8px] md:text-[9px] text-gray-500">Awaiting Payment</div>
        </button>
      </div>

      {activeTab === 'queue' && (
        <div className="space-y-3 mb-6">
          {assignable.length === 0 && (
            <div className="bg-midnight-800/50 border border-midnight-700 rounded-2xl p-8 text-center text-gray-500">
              No orders ready for assignment
            </div>
          )}
          {assignable.map((order) => (
            <div key={order.id} className="bg-midnight-800/80 border border-midnight-700 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 flex justify-between items-center border-b border-midnight-700">
                <div>
                  <div className="text-white text-sm font-semibold">#{order.id.slice(-7).toUpperCase()}</div>
                  <div className="text-gray-500 text-[9.5px] flex items-center gap-1.5 flex-wrap">
                    <span>{order.zone?.name}</span>
                    <span>· {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {order.orderType && (
                      <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${order.orderType === 'MARKETPLACE' ? 'bg-purple-500/15 text-purple-300' : 'bg-green-500/15 text-green-300'}`}>
                        {order.orderType}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-gold-500 font-bold text-sm">KSh {order.totalAmount || order.zone?.price || '—'}</div>
              </div>
              <div className="px-4 py-3">
                <p className="text-gray-300 text-xs mb-2">{order.errandDescription}</p>
                <div className="text-gray-500 text-[9.5px] mb-3">
                  👤 {order.customer?.name || 'Customer'}
                  {order.shop && ` · 🏪 ${order.shop.name}`}
                </div>
                {selectedOrder === order.id ? (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Select Rider</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availableRiders.length === 0 && (
                        <p className="text-gray-500 text-xs">No riders available</p>
                      )}
                      {availableRiders.map((rider) => (
                        <button
                          key={rider.id}
                          onClick={() => handleAssign(order.id, rider.id)}
                          disabled={!!assigning}
                          className="w-full bg-midnight-900 border border-midnight-600 p-2.5 rounded-xl flex justify-between items-center hover:border-gold-500/50 transition-colors disabled:opacity-50"
                        >
                          <div className="text-left">
                            <div className="text-white text-xs font-semibold">{rider.user.name}</div>
                            <div className="text-gray-500 text-[9px]">{rider.plateNumber} · ⭐ {rider.rating.toFixed(1)} · {rider.totalTrips} trips</div>
                          </div>
                          <span className="text-gold-500 text-[10px] font-bold">Assign →</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-500 text-[10px] mt-2 hover:text-white transition-colors">Cancel</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedOrder(order.id)}
                    disabled={!!assigning}
                    className="w-full bg-gold-500/10 border border-gold-500/30 text-gold-500 py-2 rounded-xl text-xs font-bold hover:bg-gold-500/20 transition-colors disabled:opacity-50"
                  >
                    {assigning === order.id ? 'Assigning...' : 'Assign Rider →'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'active' && (
        <div className="space-y-3 mb-6">
          {activeOrders.length === 0 && (
            <div className="bg-midnight-800/50 border border-midnight-700 rounded-2xl p-8 text-center text-gray-500">
              No active deliveries
            </div>
          )}
          {activeOrders.map((order: any) => (
            <div key={order.id} className="bg-midnight-800/80 border border-midnight-700 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-white text-sm font-semibold">#{order.id.slice(-7).toUpperCase()}</div>
                  {order.orderType && (
                    <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${order.orderType === 'MARKETPLACE' ? 'bg-purple-500/15 text-purple-300' : 'bg-green-500/15 text-green-300'}`}>
                      {order.orderType}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  order.status === 'ASSIGNED' ? 'bg-orange-500/15 text-orange-400' :
                  order.status === 'PICKED_UP' ? 'bg-blue-500/15 text-blue-400' :
                  'bg-gold-500/15 text-gold-500'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-400 text-xs mb-2">{order.errandDescription}</p>
              <div className="flex flex-col sm:flex-row sm:justify-between text-[9.5px] text-gray-500 gap-1">
                <span>🛵 {order.rider?.name} · {order.rider?.riderDetail?.plateNumber}</span>
                <span>👤 {order.customer?.name}</span>
              </div>
              {order.deliveryOtp && (
                <div className="mt-2 bg-gold-500/10 border border-gold-500/20 rounded-lg px-3 py-1.5 text-center">
                  <span className="text-[9px] text-gray-400">Delivery OTP: </span>
                  <span className="text-gold-500 font-mono font-bold text-sm tracking-widest">{order.deliveryOtp}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'unpaid' && (
        <div className="space-y-3 mb-6">
          {awaitingPayment.length === 0 && (
            <div className="bg-midnight-800/50 border border-midnight-700 rounded-2xl p-8 text-center text-gray-500">
              No orders awaiting payment
            </div>
          )}
          {awaitingPayment.map((order: any) => (
            <div key={order.id} className="bg-midnight-800/80 border border-orange-500/20 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-white text-sm font-semibold">#{order.id.slice(-7).toUpperCase()}</div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400">
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-gray-400 text-xs">{order.errandDescription}</p>
              <p className="text-gray-500 text-[9.5px] mt-1">👤 {order.customer?.name} · {order.zone?.name}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-midnight-800/50 rounded-2xl border border-midnight-700 overflow-hidden" style={{ height: '280px' }}>
        <LiveMap />
      </div>
    </div>
  );
}
