"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface PendingOrder {
  id: string;
  errandDescription: string;
  customer: { name: string; phone: string };
  zone: { name: string; price: number };
}

interface ActiveOrder {
  id: string;
  errandDescription: string;
  status: string;
  contactPhone: string;
  deliveryOtp: string;
  customer: { name: string; phone: string };
  rider: { name: string; phone: string; riderDetail: { plateNumber: string; rating: number } };
  zone: { name: string };
}

interface AvailableRider {
  id: string;
  plateNumber: string;
  rating: number;
  totalTrips: number;
  user: { name: string; phone: string };
}

interface BusyRider {
  id: string;
  plateNumber: string;
  rating: number;
  user: { name: string };
  currentOrder: { id: string; errandDescription: string; status: string };
}

interface DispatchData {
  pendingOrders: PendingOrder[];
  activeOrders: ActiveOrder[];
  availableRiders: AvailableRider[];
  busyRiders: BusyRider[];
  offlineRiders: BusyRider[];
  todayDelivered: number;
  todayRevenue: number;
}

interface DispatchResult {
  otp: string;
  whatsappLink: string;
  trackingUrl: string;
}

const STATUS_COLORS: Record<string, string> = {
  RECEIVED: 'bg-gray-500/15 text-gray-400',
  ACCEPTED: 'bg-haraka-500/15 text-haraka-400',
  ASSIGNED: 'bg-purple-500/15 text-purple-400',
  PICKED_UP: 'bg-blue-500/15 text-blue-400',
  IN_TRANSIT: 'bg-haraka-500/15 text-haraka-500',
  DELIVERED: 'bg-green-500/15 text-green-400',
  CANCELLED: 'bg-red-500/15 text-red-400',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MtaagoCommandCenter() {
  const [data, setData] = useState<DispatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dispatchingOrderId, setDispatchingOrderId] = useState<string | null>(null);
  const [pickingOrderId, setPickingOrderId] = useState<string | null>(null);
  const [dispatchResults, setDispatchResults] = useState<Record<string, DispatchResult>>({});

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/vendor/dispatch');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleDispatch = async (orderId: string, riderId: string) => {
    setDispatchingOrderId(orderId);
    try {
      const res = await fetch('/api/vendor/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, riderId }),
      });
      if (res.ok) {
        const result = await res.json();
        setDispatchResults(prev => ({ ...prev, [orderId]: result }));
        setPickingOrderId(null);
        setTimeout(() => {
          setDispatchResults(prev => {
            const next = { ...prev };
            delete next[orderId];
            return next;
          });
        }, 10000);
        await fetchData();
      }
    } catch {}
    setDispatchingOrderId(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-haraka-500/30 border-t-haraka-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-xs">Connecting to dispatch...</p>
        </div>
      </div>
    );
  }

  const { pendingOrders, activeOrders, availableRiders, busyRiders, offlineRiders, todayDelivered, todayRevenue } = data;

  const allRiders = [
    ...availableRiders.map(r => ({ ...r, status: 'online' as const })),
    ...busyRiders.map(r => ({ ...r, totalTrips: 0, user: r.user, status: 'busy' as const })),
    ...offlineRiders.map(r => ({ ...r, totalTrips: 0, user: r.user, status: 'offline' as const })),
  ];

  return (
    <div className="px-4 pt-4 pb-24 space-y-5">
      <div className="flex items-end gap-2">
        <h1 className="text-white font-bold text-lg leading-tight">Mtaago</h1>
        <span className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Haraka Dispatch</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-3 text-center">
          <div className="text-haraka-500 font-bold text-lg leading-none">{activeOrders.length}</div>
          <div className="text-gray-500 text-[8px] mt-1 uppercase tracking-wider">Active Now</div>
        </div>
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-3 text-center">
          <div className="text-white font-bold text-lg leading-none">{availableRiders.length + busyRiders.length}</div>
          <div className="text-gray-500 text-[8px] mt-1 uppercase tracking-wider">Riders On</div>
        </div>
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-3 text-center">
          <div className="text-green-400 font-bold text-lg leading-none">{todayDelivered}</div>
          <div className="text-gray-500 text-[8px] mt-1 uppercase tracking-wider">Delivered</div>
        </div>
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-3 text-center">
          <div className="text-haraka-500 font-bold text-lg leading-none">KSh {todayRevenue.toLocaleString()}</div>
          <div className="text-gray-500 text-[8px] mt-1 uppercase tracking-wider">Revenue</div>
        </div>
      </div>

      {pendingOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-sm">Ready to Dispatch</h2>
            <span className="bg-haraka-500/15 text-haraka-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
              {pendingOrders.length}
            </span>
          </div>

          {pendingOrders.map(order => (
            <div key={order.id} className="bg-midnight-800 border border-midnight-700 rounded-xl overflow-hidden relative">
              {dispatchResults[order.id] && (
                <div className="absolute inset-0 bg-midnight-950/95 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center p-4 gap-3">
                  <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Delivery OTP</div>
                  <div className="text-haraka-500 text-3xl font-mono tracking-widest font-bold">
                    {dispatchResults[order.id].otp}
                  </div>
                  <div className="flex gap-2 w-full">
                    <a
                      href={dispatchResults[order.id].whatsappLink}
                      target="_blank"
                      className="flex-1 bg-green-600 text-white text-xs font-bold py-2 rounded-lg text-center"
                    >
                      WhatsApp OTP
                    </a>
                    <button
                      onClick={() => copyToClipboard(dispatchResults[order.id].trackingUrl)}
                      className="flex-1 bg-midnight-700 border border-midnight-600 text-gray-300 text-xs font-bold py-2 rounded-lg"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              )}

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-xs font-mono">
                    #{order.id.slice(-7).toUpperCase()}
                  </span>
                  <span className="text-haraka-500 font-bold text-sm">KSh {order.zone.price}</span>
                </div>
                <p className="text-gray-300 text-xs">
                  {order.errandDescription.length > 50
                    ? order.errandDescription.slice(0, 50) + '...'
                    : order.errandDescription}
                </p>
                <div className="flex items-center gap-2 text-gray-500 text-[10px]">
                  <span>{order.zone.name}</span>
                  <span>·</span>
                  <span>{order.customer.name}</span>
                </div>

                {pickingOrderId === order.id ? (
                  <div className="mt-2 space-y-2">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Rider</div>
                    {availableRiders.length === 0 ? (
                      <p className="text-gray-500 text-xs">No riders available</p>
                    ) : (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {availableRiders.map(rider => (
                          <button
                            key={rider.id}
                            onClick={() => handleDispatch(order.id, rider.id)}
                            disabled={!!dispatchingOrderId}
                            className="w-full bg-midnight-900 border border-midnight-600 p-2.5 rounded-lg flex justify-between items-center hover:border-haraka-500/50 transition-colors disabled:opacity-50"
                          >
                            <div className="text-left">
                              <div className="text-white text-xs font-semibold">{rider.user.name}</div>
                              <div className="text-gray-500 text-[9px]">
                                {rider.plateNumber} · ⭐ {rider.rating.toFixed(1)} · {rider.totalTrips} trips
                              </div>
                            </div>
                            <span className="text-haraka-500 text-[10px] font-bold">SELECT</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => setPickingOrderId(null)}
                      className="text-gray-500 text-[10px] hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setPickingOrderId(order.id)}
                    disabled={!!dispatchingOrderId}
                    className="w-full bg-haraka-500 text-midnight-950 py-2.5 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors disabled:opacity-50"
                  >
                    {dispatchingOrderId === order.id ? 'Dispatching...' : 'DISPATCH'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-sm">On the Road</h2>
            <span className="bg-haraka-500/15 text-haraka-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
              {activeOrders.length}
            </span>
          </div>

          {activeOrders.map(order => {
            const statusColor = STATUS_COLORS[order.status] || 'bg-gray-500/15 text-gray-400';
            const showOtp = order.deliveryOtp && (order.status === 'IN_TRANSIT' || order.status === 'ASSIGNED');
            const whatsappUrl = order.contactPhone
              ? `https://wa.me/${order.contactPhone}?text=${encodeURIComponent(
                  'Haraka Dispatch: Your delivery OTP is ' + order.deliveryOtp + '. Track: ' + `${window.location.origin}/track/${order.id}`
                )}`
              : null;

            return (
              <div key={order.id} className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-xs font-mono">
                      #{order.id.slice(-7).toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusColor}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <Link
                    href={`/track/${order.id}`}
                    className="text-haraka-500 text-[10px] font-bold hover:underline"
                  >
                    Track →
                  </Link>
                </div>

                <p className="text-gray-300 text-xs">
                  {order.errandDescription.length > 50
                    ? order.errandDescription.slice(0, 50) + '...'
                    : order.errandDescription}
                </p>

                <div className="text-gray-500 text-[10px] flex items-center gap-2">
                  <span>🛵 {order.rider.name}</span>
                  <span>·</span>
                  <span>{order.rider.riderDetail.plateNumber}</span>
                </div>

                {showOtp && (
                  <div className="bg-haraka-500/10 border border-haraka-500/20 rounded-lg px-3 py-2 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-gray-400">OTP</span>
                      <div className="text-haraka-500 font-mono text-lg tracking-widest font-bold">
                        {order.deliveryOtp}
                      </div>
                    </div>
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        className="bg-green-600/15 border border-green-600/30 text-green-400 text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-green-600/25 transition-colors"
                      >
                        💬
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {allRiders.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-white font-bold text-sm">Riders</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {allRiders.map(rider => (
              <div
                key={rider.id}
                className="bg-midnight-800 border border-midnight-700 rounded-lg p-2.5 w-28 flex-shrink-0 text-center"
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    rider.status === 'online'
                      ? 'bg-green-500'
                      : rider.status === 'busy'
                      ? 'bg-amber-500'
                      : 'bg-gray-500'
                  }`} />
                  <span className="text-white text-[10px] font-semibold truncate">
                    {rider.user.name}
                  </span>
                </div>
                <div className="text-gray-500 text-[9px]">{rider.plateNumber}</div>
                {'rating' in rider && rider.rating > 0 && (
                  <div className="text-gray-600 text-[8px] mt-0.5">⭐ {rider.rating.toFixed(1)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
