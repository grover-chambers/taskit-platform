"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useEnterprise } from './EnterpriseContext';

interface PendingOrder {
  id: string;
  errandDescription: string;
  contactPhone: string | null;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  pickupLocation: string | null;
  dropoffLocation: string | null;
  zone: { name: string; price: number } | null;
  createdAt: string;
}

interface ActiveOrder {
  id: string;
  errandDescription: string;
  status: string;
  contactPhone: string | null;
  deliveryOtp: string;
  rider: { name: string; phone: string; riderDetail: { plateNumber: string; rating: number } } | null;
  zone: { name: string } | null;
}

interface AvailableRider {
  id: string;
  plateNumber: string;
  rating: number;
  totalTrips: number;
  user: { name: string; phone: string };
}

interface DispatchData {
  pendingOrders: PendingOrder[];
  activeOrders: ActiveOrder[];
  availableRiders: AvailableRider[];
  busyRiders: any[];
  offlineRiders: any[];
  todayDelivered: number;
  todayRevenue: number;
}

const STATUS_COLORS: Record<string, string> = {
  PRICED: 'bg-yellow-500/15 text-yellow-400',
  PAID: 'bg-blue-500/15 text-blue-400',
  PACKED: 'bg-teal-500/15 text-teal-400',
  AWAITING_RIDER: 'bg-orange-500/15 text-orange-400',
  RECEIVED: 'bg-gray-500/15 text-gray-400',
  ACCEPTED: 'bg-haraka-500/15 text-haraka-400',
  ASSIGNED: 'bg-purple-500/15 text-purple-400',
  PICKED_UP: 'bg-blue-500/15 text-blue-400',
  IN_TRANSIT: 'bg-haraka-500/15 text-haraka-500',
  DELIVERED: 'bg-green-500/15 text-green-400',
  CANCELLED: 'bg-red-500/15 text-red-400',
};

const STATUS_LABELS: Record<string, string> = {
  PRICED: 'Priced',
  PAID: 'Paid',
  PACKED: 'Packed',
  AWAITING_RIDER: 'Awaiting Rider',
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
  const { subRole, enterprise, loading: roleLoading } = useEnterprise();
  const [data, setData] = useState<DispatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderingOrderId, setOrderingOrderId] = useState<string | null>(null);
  const [pickingOrderId, setPickingOrderId] = useState<string | null>(null);
  const [actionOrderId, setActionOrderId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [interveneOrderId, setInterveneOrderId] = useState<string | null>(null);
  const [interveneAction, setInterveneAction] = useState('');
  const [interveneDetails, setInterveneDetails] = useState('');

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
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleConfirmPayment = async (orderId: string, method: string) => {
    setActionOrderId(orderId);
    setError('');
    try {
      const res = await fetch('/api/enterprise/orders/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, method }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        const d = await res.json();
        setError(d.error);
      }
    } catch {
      setError('Network error');
    }
    setActionOrderId(null);
  };

  const handlePacked = async (orderId: string) => {
    setActionOrderId(orderId);
    setError('');
    try {
      const res = await fetch('/api/enterprise/orders/packed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        const d = await res.json();
        setError(d.error);
      }
    } catch {
      setError('Network error');
    }
    setActionOrderId(null);
  };

  const handleAwaitRider = async (orderId: string) => {
    setActionOrderId(orderId);
    setError('');
    try {
      const res = await fetch('/api/enterprise/orders/await-rider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        const d = await res.json();
        setError(d.error);
      }
    } catch {
      setError('Network error');
    }
    setActionOrderId(null);
  };

  const handleDispatch = async (orderId: string, riderId: string) => {
    setOrderingOrderId(orderId);
    setError('');
    try {
      const res = await fetch('/api/vendor/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, riderId }),
      });
      if (res.ok) {
        setPickingOrderId(null);
        await fetchData();
      } else {
        const d = await res.json();
        setError(d.error);
      }
    } catch {
      setError('Network error');
    }
    setOrderingOrderId(null);
  };

  const handleIntervene = async (orderId: string, action: string) => {
    setActionOrderId(orderId);
    setError('');
    try {
      const res = await fetch('/api/enterprise/intervene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action, details: interveneDetails }),
      });
      if (res.ok) {
        setInterveneOrderId(null);
        setInterveneAction('');
        setInterveneDetails('');
        await fetchData();
      } else {
        const d = await res.json();
        setError(d.error);
      }
    } catch {
      setError('Network error');
    }
    setActionOrderId(null);
  };

  if (roleLoading || loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-haraka-500/30 border-t-haraka-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-xs">Connecting...</p>
        </div>
      </div>
    );
  }

  if (!subRole) {
    return (
      <div className="px-6 pt-6 pb-24 text-center">
        <p className="text-gray-500 text-sm">Unable to verify enterprise membership</p>
      </div>
    );
  }

  const { pendingOrders, activeOrders, availableRiders, todayDelivered, todayRevenue } = data;
  const isOperator = subRole === 'OPERATOR';

  const pricedOrders = pendingOrders.filter(o => o.status === 'PRICED');
  const paidOrders = pendingOrders.filter(o => o.status === 'PAID');
  const packedOrders = pendingOrders.filter(o => o.status === 'PACKED');
  const awaitingRiderOrders = pendingOrders.filter(o => o.status === 'AWAITING_RIDER');

  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      <div className="flex items-end gap-2">
        <h1 className="text-white font-bold text-lg leading-tight">
          {isOperator ? 'Workspace' : 'Overview'}
        </h1>
        <span className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">
          {isOperator ? 'Haraka Dispatch' : 'Watch Mode'}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-3 text-center">
          <div className="text-haraka-500 font-bold text-lg leading-none">{activeOrders.length}</div>
          <div className="text-gray-500 text-[8px] mt-1 uppercase tracking-wider">On Road</div>
        </div>
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-3 text-center">
          <div className="text-orange-400 font-bold text-lg leading-none">{awaitingRiderOrders.length + packedOrders.length}</div>
          <div className="text-gray-500 text-[8px] mt-1 uppercase tracking-wider">Queued</div>
        </div>
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-3 text-center">
          <div className="text-green-400 font-bold text-lg leading-none">{todayDelivered}</div>
          <div className="text-gray-500 text-[8px] mt-1 uppercase tracking-wider">Done</div>
        </div>
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-3 text-center">
          <div className="text-haraka-500 font-bold text-lg leading-none">KSh {todayRevenue.toLocaleString()}</div>
          <div className="text-gray-500 text-[8px] mt-1 uppercase tracking-wider">Revenue</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
          <p className="text-red-400 text-xs font-semibold">{error}</p>
        </div>
      )}

      {/* PRICED — awaiting payment confirmation */}
      {pricedOrders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-sm">Awaiting Payment</h2>
            <span className="bg-yellow-500/15 text-yellow-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md">{pricedOrders.length}</span>
          </div>
          {pricedOrders.map(order => (
            <OrderCard key={order.id} order={order} timeAgo={timeAgo}>
              {isOperator && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleConfirmPayment(order.id, 'MANUAL')}
                    disabled={actionOrderId === order.id}
                    className="flex-1 bg-haraka-500 text-midnight-950 py-2 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors disabled:opacity-50"
                  >
                    {actionOrderId === order.id ? '...' : 'Paid at Counter'}
                  </button>
                  <button
                    onClick={() => handleConfirmPayment(order.id, 'MPESA')}
                    disabled={actionOrderId === order.id}
                    className="flex-1 bg-green-600/15 border border-green-600/30 text-green-400 py-2 rounded-lg text-xs font-bold hover:bg-green-600/25 transition-colors disabled:opacity-50"
                  >
                    {actionOrderId === order.id ? '...' : 'M-Pesa Paid'}
                  </button>
                </div>
              )}
              {!isOperator && (
                <OwnerIntervene
                  orderId={order.id}
                  interveneOrderId={interveneOrderId}
                  interveneAction={interveneAction}
                  interveneDetails={interveneDetails}
                  setInterveneOrderId={setInterveneOrderId}
                  setInterveneAction={setInterveneAction}
                  setInterveneDetails={setInterveneDetails}
                  onIntervene={handleIntervene}
                  actionOrderId={actionOrderId}
                  options={[{ value: 'FORCE_PAYMENT', label: 'Force Confirm Payment' }, { value: 'CANCEL', label: 'Cancel Order' }]}
                />
              )}
            </OrderCard>
          ))}
        </div>
      )}

      {/* PAID — mark as packed */}
      {paidOrders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-sm">Paid — Needs Packing</h2>
            <span className="bg-blue-500/15 text-blue-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md">{paidOrders.length}</span>
          </div>
          {paidOrders.map(order => (
            <OrderCard key={order.id} order={order} timeAgo={timeAgo}>
              {isOperator && (
                <button
                  onClick={() => handlePacked(order.id)}
                  disabled={actionOrderId === order.id}
                  className="w-full bg-haraka-500 text-midnight-950 py-2 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors disabled:opacity-50 mt-2"
                >
                  {actionOrderId === order.id ? 'Marking...' : 'Mark as Packed'}
                </button>
              )}
              {!isOperator && (
                <OwnerIntervene
                  orderId={order.id}
                  interveneOrderId={interveneOrderId}
                  interveneAction={interveneAction}
                  interveneDetails={interveneDetails}
                  setInterveneOrderId={setInterveneOrderId}
                  setInterveneAction={setInterveneAction}
                  setInterveneDetails={setInterveneDetails}
                  onIntervene={handleIntervene}
                  actionOrderId={actionOrderId}
                  options={[{ value: 'FORCE_PACKED', label: 'Force Mark Packed' }, { value: 'CANCEL', label: 'Cancel Order' }]}
                />
              )}
            </OrderCard>
          ))}
        </div>
      )}

      {/* PACKED — ready to go to rider queue */}
      {packedOrders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-sm">Packed — Ready for Queue</h2>
            <span className="bg-teal-500/15 text-teal-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md">{packedOrders.length}</span>
          </div>
          {packedOrders.map(order => (
            <OrderCard key={order.id} order={order} timeAgo={timeAgo}>
              {isOperator && (
                <button
                  onClick={() => handleAwaitRider(order.id)}
                  disabled={actionOrderId === order.id}
                  className="w-full bg-haraka-500 text-midnight-950 py-2 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors disabled:opacity-50 mt-2"
                >
                  {actionOrderId === order.id ? 'Moving...' : 'Send to Rider Queue'}
                </button>
              )}
              {!isOperator && (
                <OwnerIntervene
                  orderId={order.id}
                  interveneOrderId={interveneOrderId}
                  interveneAction={interveneAction}
                  interveneDetails={interveneDetails}
                  setInterveneOrderId={setInterveneOrderId}
                  setInterveneAction={setInterveneAction}
                  setInterveneDetails={setInterveneDetails}
                  onIntervene={handleIntervene}
                  actionOrderId={actionOrderId}
                  options={[{ value: 'FORCE_AWAIT_RIDER', label: 'Force to Rider Queue' }, { value: 'CANCEL', label: 'Cancel Order' }]}
                />
              )}
            </OrderCard>
          ))}
        </div>
      )}

      {/* AWAITING_RIDER — dispatch */}
      {awaitingRiderOrders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-sm">Awaiting Rider</h2>
            <span className="bg-orange-500/15 text-orange-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md">{awaitingRiderOrders.length}</span>
          </div>
          {awaitingRiderOrders.map(order => (
            <OrderCard key={order.id} order={order} timeAgo={timeAgo}>
              {isOperator && (
                <>
                  {pickingOrderId === order.id ? (
                    <div className="mt-2 space-y-1.5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Rider</p>
                      {availableRiders.length === 0 ? (
                        <p className="text-gray-500 text-xs">No riders available</p>
                      ) : (
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {availableRiders.map(rider => (
                            <button
                              key={rider.id}
                              onClick={() => handleDispatch(order.id, rider.id)}
                              disabled={!!orderingOrderId}
                              className="w-full bg-midnight-900 border border-midnight-600 p-2 rounded-lg flex justify-between items-center hover:border-haraka-500/50 transition-colors disabled:opacity-50"
                            >
                              <div className="text-left">
                                <div className="text-white text-xs font-semibold">{rider.user.name}</div>
                                <div className="text-gray-500 text-[9px]">{rider.plateNumber} · ⭐ {rider.rating.toFixed(1)} · {rider.totalTrips} trips</div>
                              </div>
                              <span className="text-haraka-500 text-[10px] font-bold">ASSIGN</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <button onClick={() => setPickingOrderId(null)} className="text-gray-500 text-[10px]">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPickingOrderId(order.id)}
                      disabled={!!orderingOrderId}
                      className="w-full bg-haraka-500 text-midnight-950 py-2 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors disabled:opacity-50 mt-2"
                    >
                      {orderingOrderId === order.id ? 'Assigning...' : 'DISPATCH RIDER'}
                    </button>
                  )}
                </>
              )}
              {!isOperator && (
                <OwnerIntervene
                  orderId={order.id}
                  interveneOrderId={interveneOrderId}
                  interveneAction={interveneAction}
                  interveneDetails={interveneDetails}
                  setInterveneOrderId={setInterveneOrderId}
                  setInterveneAction={setInterveneAction}
                  setInterveneDetails={setInterveneDetails}
                  onIntervene={handleIntervene}
                  actionOrderId={actionOrderId}
                  options={[{ value: 'ESCALATE_URGENCY', label: 'Escalate to URGENT' }, { value: 'CANCEL', label: 'Cancel Order' }]}
                />
              )}
            </OrderCard>
          ))}
        </div>
      )}

      {/* On the Road */}
      {activeOrders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-sm">On the Road</h2>
            <span className="bg-haraka-500/15 text-haraka-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md">{activeOrders.length}</span>
          </div>
          {activeOrders.map(order => {
            const statusColor = STATUS_COLORS[order.status] || 'bg-gray-500/15 text-gray-400';
            const showOtp = order.deliveryOtp && ['ASSIGNED', 'IN_TRANSIT', 'PICKED_UP'].includes(order.status);
            const whatsappUrl = order.contactPhone
              ? `https://wa.me/254${order.contactPhone.replace(/^0/, '')}?text=${encodeURIComponent('Haraka: OTP ' + order.deliveryOtp + ' — Track: ' + `${window.location.origin}/track/${order.id}`)}`
              : null;

            return (
              <div key={order.id} className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-xs font-mono">#{order.id.slice(-7).toUpperCase()}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusColor}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <Link href={`/track/${order.id}`} className="text-haraka-500 text-[10px] font-bold hover:underline">Track →</Link>
                </div>
                <p className="text-gray-300 text-xs">{order.errandDescription.length > 50 ? order.errandDescription.slice(0, 50) + '...' : order.errandDescription}</p>
                {order.rider && (
                  <div className="text-gray-500 text-[10px] flex items-center gap-2">
                    <span>🛵 {order.rider.name}</span>
                    <span>·</span>
                    <span>{order.rider.riderDetail.plateNumber}</span>
                  </div>
                )}
                {showOtp && (
                  <div className="bg-haraka-500/10 border border-haraka-500/20 rounded-lg px-3 py-2 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-gray-400">OTP</span>
                      <div className="text-haraka-500 font-mono text-lg tracking-widest font-bold">{order.deliveryOtp}</div>
                    </div>
                    {whatsappUrl && (
                      <a href={whatsappUrl} target="_blank" className="bg-green-600/15 border border-green-600/30 text-green-400 text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-green-600/25 transition-colors">💬</a>
                    )}
                  </div>
                )}
                {!isOperator && (
                  <OwnerIntervene
                    orderId={order.id}
                    interveneOrderId={interveneOrderId}
                    interveneAction={interveneAction}
                    interveneDetails={interveneDetails}
                    setInterveneOrderId={setInterveneOrderId}
                    setInterveneAction={setInterveneAction}
                    setInterveneDetails={setInterveneDetails}
                    onIntervene={handleIntervene}
                    actionOrderId={actionOrderId}
                    options={[{ value: 'ESCALATE_URGENCY', label: 'Escalate to URGENT' }, { value: 'CANCEL', label: 'Cancel Order' }]}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {pricedOrders.length + paidOrders.length + packedOrders.length + awaitingRiderOrders.length + activeOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">{isOperator ? '📋' : '👁️'}</div>
          <h3 className="text-white font-bold text-base mb-1">{isOperator ? 'All Clear' : 'Nothing to Watch'}</h3>
          <p className="text-gray-400 text-sm">{isOperator ? 'No orders in the pipeline' : 'No active orders to monitor'}</p>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, timeAgo, children }: { order: PendingOrder; timeAgo: (d: string) => string; children: React.ReactNode }) {
  const statusColor = STATUS_COLORS[order.status] || 'bg-gray-500/15 text-gray-400';
  const statusLabel = STATUS_LABELS[order.status] || order.status.replace(/_/g, ' ');

  return (
    <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-xs font-mono">#{order.id.slice(-7).toUpperCase()}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${statusColor}`}>{statusLabel}</span>
        </div>
        <span className="text-haraka-500 font-bold text-sm">KSh {order.totalAmount}</span>
      </div>
      <p className="text-gray-300 text-xs">{order.errandDescription.length > 50 ? order.errandDescription.slice(0, 50) + '...' : order.errandDescription}</p>
      <div className="text-gray-500 text-[10px] flex items-center gap-2">
        {order.zone && <span>{order.zone.name}</span>}
        {order.contactPhone && <><span>·</span><span>{order.contactPhone}</span></>}
        <span>·</span><span>{timeAgo(order.createdAt)}</span>
      </div>
      {children}
    </div>
  );
}

function OwnerIntervene({ orderId, interveneOrderId, interveneAction, interveneDetails, setInterveneOrderId, setInterveneAction, setInterveneDetails, onIntervene, actionOrderId, options }: {
  orderId: string;
  interveneOrderId: string | null;
  interveneAction: string;
  interveneDetails: string;
  setInterveneOrderId: (v: string | null) => void;
  setInterveneAction: (v: string) => void;
  setInterveneDetails: (v: string) => void;
  onIntervene: (orderId: string, action: string) => void;
  actionOrderId: string | null;
  options: { value: string; label: string }[];
}) {
  const isOpen = interveneOrderId === orderId;

  if (!isOpen) {
    return (
      <button
        onClick={() => { setInterveneOrderId(orderId); setInterveneAction(''); }}
        className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-400 py-2 rounded-lg text-xs font-bold hover:bg-amber-500/20 transition-colors mt-2"
      >
        Intervene
      </button>
    );
  }

  return (
    <div className="mt-2 space-y-2 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Owner Intervention</p>
      <div className="space-y-1.5">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => setInterveneAction(opt.value)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              interveneAction === opt.value
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                : 'bg-midnight-900 text-gray-400 border border-midnight-700 hover:border-amber-500/30'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {interveneAction && (
        <>
          <textarea
            value={interveneDetails}
            onChange={e => setInterveneDetails(e.target.value)}
            rows={2}
            className="w-full bg-midnight-900 border border-midnight-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-amber-500 transition-colors resize-none"
            placeholder="Reason for intervention (optional)"
          />
          <button
            onClick={() => onIntervene(orderId, interveneAction)}
            disabled={actionOrderId === orderId}
            className="w-full bg-amber-500 text-midnight-950 py-2 rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {actionOrderId === orderId ? 'Executing...' : 'Confirm Intervention'}
          </button>
        </>
      )}
      <button
        onClick={() => { setInterveneOrderId(null); setInterveneAction(''); setInterveneDetails(''); }}
        className="text-gray-500 text-[10px] hover:text-white"
      >
        Cancel
      </button>
    </div>
  );
}
