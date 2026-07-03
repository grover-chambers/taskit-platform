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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MtaaGoDashboard() {
  const { subRole, enterprise, loading: roleLoading } = useEnterprise();
  const [data, setData] = useState<DispatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [interveneOrderId, setInterveneOrderId] = useState<string | null>(null);
  const [interveneAction, setInterveneAction] = useState('');
  const [interveneDetails, setInterveneDetails] = useState('');
  const [actionOrderId, setActionOrderId] = useState<string | null>(null);
  const [dispatchingOrderId, setDispatchingOrderId] = useState<string | null>(null);
  const [showRiderPicker, setShowRiderPicker] = useState<string | null>(null);
  const [error, setError] = useState('');

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
    setDispatchingOrderId(orderId);
    setError('');
    try {
      const res = await fetch('/api/enterprise/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, riderId }),
      });
      if (res.ok) {
        setShowRiderPicker(null);
        await fetchData();
      } else {
        const d = await res.json();
        setError(d.error);
      }
    } catch {
      setError('Network error');
    }
    setDispatchingOrderId(null);
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
          <div className="w-6 h-6 border-2 border-haraka-500/30 border-t-haraka-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-xs">Connecting to dispatch...</p>
        </div>
      </div>
    );
  }

  if (!subRole) {
    return <div className="text-center py-12"><p className="text-gray-500 text-sm">Unable to verify enterprise membership</p></div>;
  }

  const isOwner = subRole === 'OWNER';
  const { pendingOrders, activeOrders, availableRiders, todayDelivered, todayRevenue } = data;

  const pricedOrders = pendingOrders.filter(o => o.status === 'PRICED');
  const paidOrders = pendingOrders.filter(o => o.status === 'PAID');
  const packedOrders = pendingOrders.filter(o => o.status === 'PACKED');
  const awaitingRiderOrders = pendingOrders.filter(o => o.status === 'AWAITING_RIDER');
  const pipelineTotal = pricedOrders.length + paidOrders.length + packedOrders.length + awaitingRiderOrders.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-bold text-xl">{isOwner ? 'Dashboard' : 'Workspace'}</h1>
        <p className="text-gray-500 text-xs mt-0.5">{isOwner ? 'Real-time overview' : 'Live dispatch control'} · {enterprise?.name}</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          <p className="text-red-400 text-xs font-semibold">{error}</p>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="On Road" value={activeOrders.length} color="text-haraka-500" />
        <MetricCard label="In Pipeline" value={pipelineTotal} color="text-orange-400" />
        <MetricCard label="Delivered Today" value={todayDelivered} color="text-green-400" />
        <MetricCard label="Today Revenue" value={`KSh ${todayRevenue.toLocaleString()}`} color="text-haraka-500" />
      </div>

      {/* Operator Action Panels */}
      {!isOwner && (
        <>
          {pricedOrders.length > 0 && (
            <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-sm">Awaiting Payment</h2>
                <span className="bg-yellow-500/15 text-yellow-400 text-[9px] font-bold px-2 py-0.5 rounded-md">{pricedOrders.length}</span>
              </div>
              <div className="space-y-3">
                {pricedOrders.map(order => (
                  <div key={order.id} className="bg-midnight-900 border border-midnight-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white text-xs font-semibold">#{order.id.slice(-7).toUpperCase()}</p>
                        <p className="text-gray-400 text-xs truncate max-w-[200px]">{order.errandDescription}</p>
                      </div>
                      <span className="text-haraka-500 font-bold text-sm">KSh {order.totalAmount}</span>
                    </div>
                    <div className="flex gap-2">
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {paidOrders.length > 0 && (
            <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-sm">Paid — Needs Packing</h2>
                <span className="bg-blue-500/15 text-blue-400 text-[9px] font-bold px-2 py-0.5 rounded-md">{paidOrders.length}</span>
              </div>
              <div className="space-y-3">
                {paidOrders.map(order => (
                  <div key={order.id} className="bg-midnight-900 border border-midnight-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white text-xs font-semibold">#{order.id.slice(-7).toUpperCase()}</p>
                        <p className="text-gray-400 text-xs truncate max-w-[200px]">{order.errandDescription}</p>
                      </div>
                      <span className="text-haraka-500 font-bold text-sm">KSh {order.totalAmount}</span>
                    </div>
                    <button
                      onClick={() => handlePacked(order.id)}
                      disabled={actionOrderId === order.id}
                      className="w-full bg-haraka-500 text-midnight-950 py-2 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors disabled:opacity-50"
                    >
                      {actionOrderId === order.id ? 'Marking...' : 'Mark as Packed'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {packedOrders.length > 0 && (
            <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-sm">Packed — Ready for Queue</h2>
                <span className="bg-teal-500/15 text-teal-400 text-[9px] font-bold px-2 py-0.5 rounded-md">{packedOrders.length}</span>
              </div>
              <div className="space-y-3">
                {packedOrders.map(order => (
                  <div key={order.id} className="bg-midnight-900 border border-midnight-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white text-xs font-semibold">#{order.id.slice(-7).toUpperCase()}</p>
                        <p className="text-gray-400 text-xs truncate max-w-[200px]">{order.errandDescription}</p>
                      </div>
                      <span className="text-haraka-500 font-bold text-sm">KSh {order.totalAmount}</span>
                    </div>
                    <button
                      onClick={() => handleAwaitRider(order.id)}
                      disabled={actionOrderId === order.id}
                      className="w-full bg-haraka-500 text-midnight-950 py-2 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors disabled:opacity-50"
                    >
                      {actionOrderId === order.id ? 'Moving...' : 'Send to Rider Queue'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {awaitingRiderOrders.length > 0 && (
            <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-sm">Awaiting Rider</h2>
                <span className="bg-orange-500/15 text-orange-400 text-[9px] font-bold px-2 py-0.5 rounded-md">{awaitingRiderOrders.length}</span>
              </div>
              <div className="space-y-3">
                {awaitingRiderOrders.map(order => (
                  <div key={order.id} className="bg-midnight-900 border border-midnight-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white text-xs font-semibold">#{order.id.slice(-7).toUpperCase()}</p>
                        <p className="text-gray-400 text-xs truncate max-w-[200px]">{order.errandDescription}</p>
                      </div>
                      <span className="text-haraka-500 font-bold text-sm">KSh {order.totalAmount}</span>
                    </div>
                    {showRiderPicker === order.id ? (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Rider</p>
                        {availableRiders.length === 0 ? (
                          <p className="text-gray-500 text-xs">No riders available</p>
                        ) : (
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {availableRiders.map(rider => (
                              <button
                                key={rider.id}
                                onClick={() => handleDispatch(order.id, rider.id)}
                                disabled={!!dispatchingOrderId}
                                className="w-full bg-midnight-800 border border-midnight-600 p-2 rounded-lg flex justify-between items-center hover:border-haraka-500/50 transition-colors disabled:opacity-50"
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
                        <button onClick={() => setShowRiderPicker(null)} className="text-gray-500 text-[10px]">Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowRiderPicker(order.id)}
                        disabled={!!dispatchingOrderId}
                        className="w-full bg-haraka-500 text-midnight-950 py-2 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors disabled:opacity-50"
                      >
                        {dispatchingOrderId === order.id ? 'Assigning...' : 'DISPATCH RIDER'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Owner Overview */}
      {isOwner && (
        <>
          <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-sm">Pipeline</h2>
              <span className="text-gray-500 text-[10px] font-bold">{pipelineTotal} orders</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <PipelineStat label="Awaiting Payment" count={pricedOrders.length} color="bg-yellow-500/15 text-yellow-400" />
              <PipelineStat label="Paid — Packing" count={paidOrders.length} color="bg-blue-500/15 text-blue-400" />
              <PipelineStat label="Packed — Queuing" count={packedOrders.length} color="bg-teal-500/15 text-teal-400" />
              <PipelineStat label="Awaiting Rider" count={awaitingRiderOrders.length} color="bg-orange-500/15 text-orange-400" />
            </div>
            {pipelineTotal === 0 && (
              <p className="text-gray-600 text-xs text-center py-6">No orders in pipeline</p>
            )}
          </div>

          {activeOrders.length > 0 && (
            <div className="bg-midnight-800 border border-midnight-700 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-midnight-700 flex items-center justify-between">
                <h2 className="text-white font-bold text-sm">On the Road</h2>
                <span className="bg-haraka-500/15 text-haraka-500 text-[9px] font-bold px-2 py-0.5 rounded-md">{activeOrders.length}</span>
              </div>
              <div className="divide-y divide-midnight-700 max-h-80 overflow-y-auto">
                {activeOrders.map(order => {
                  const statusColor = STATUS_COLORS[order.status] || 'bg-gray-500/15 text-gray-400';
                  const showOtp = order.deliveryOtp && ['ASSIGNED', 'IN_TRANSIT', 'PICKED_UP'].includes(order.status);
                  return (
                    <div key={order.id} className="px-5 py-3 flex items-center gap-4 hover:bg-midnight-800/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white font-bold text-xs font-mono">#{order.id.slice(-7).toUpperCase()}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusColor}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs truncate">{order.errandDescription}</p>
                        {order.rider && (
                          <p className="text-gray-500 text-[10px] mt-0.5">🛵 {order.rider.name} · {order.rider.riderDetail?.plateNumber}</p>
                        )}
                      </div>
                      {showOtp && (
                        <div className="bg-haraka-500/10 border border-haraka-500/20 rounded-lg px-3 py-1.5 text-center flex-shrink-0">
                          <p className="text-[8px] text-gray-400 uppercase tracking-wider">OTP</p>
                          <p className="text-haraka-500 font-mono text-sm font-bold tracking-widest">{order.deliveryOtp}</p>
                        </div>
                      )}
                      <Link href={`/mtaago/orders/${order.id}`} className="text-haraka-500 text-[10px] font-bold hover:underline flex-shrink-0">View</Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pipelineTotal > 0 && (
            <div className="bg-midnight-800 border border-midnight-700 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-midnight-700">
                <h2 className="text-white font-bold text-sm">Pending Orders</h2>
              </div>
              <div className="divide-y divide-midnight-700 max-h-64 overflow-y-auto">
                {[...pricedOrders, ...paidOrders, ...packedOrders, ...awaitingRiderOrders].map(order => {
                  const statusColor = STATUS_COLORS[order.status] || 'bg-gray-500/15 text-gray-400';
                  return (
                    <div key={order.id} className="px-5 py-3 flex items-center gap-4 hover:bg-midnight-800/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white font-bold text-xs font-mono">#{order.id.slice(-7).toUpperCase()}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusColor}`}>{order.status.replace(/_/g, ' ')}</span>
                        </div>
                        <p className="text-gray-400 text-xs truncate">{order.errandDescription}</p>
                      </div>
                      <span className="text-haraka-500 font-bold text-sm">KSh {order.totalAmount}</span>
                      <div className="flex-shrink-0">
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
                          options={getInterveneOptions(order.status)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Fleet Status (both roles) */}
      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5">
        <h2 className="text-white font-bold text-sm mb-3">Fleet Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">Available</span>
            <span className="text-green-400 font-bold text-sm">{availableRiders.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">Dispatched</span>
            <span className="text-amber-400 font-bold text-sm">{data.busyRiders?.length || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">Offline</span>
            <span className="text-gray-500 font-bold text-sm">{data.offlineRiders?.length || 0}</span>
          </div>
        </div>
        <Link href="/mtaago/riders" className="block mt-4 text-haraka-500 text-[10px] font-bold hover:underline">View Fleet →</Link>
      </div>

      {activeOrders.length === 0 && pipelineTotal === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">{isOwner ? '👁️' : '📋'}</div>
          <h3 className="text-white font-bold text-lg mb-1">{isOwner ? 'Nothing to Watch' : 'All Clear'}</h3>
          <p className="text-gray-400 text-sm">{isOwner ? 'No active orders to monitor' : 'No orders in the pipeline'}</p>
        </div>
      )}
    </div>
  );
}

function getInterveneOptions(status: string): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  if (status === 'PRICED') options.push({ value: 'FORCE_PAYMENT', label: 'Force Confirm Payment' });
  if (status === 'PAID') options.push({ value: 'FORCE_PACKED', label: 'Force Mark Packed' });
  if (status === 'PACKED') options.push({ value: 'FORCE_AWAIT_RIDER', label: 'Force to Rider Queue' });
  if (['AWAITING_RIDER', 'ASSIGNED', 'IN_TRANSIT', 'PICKED_UP'].includes(status)) options.push({ value: 'ESCALATE_URGENCY', label: 'Escalate to URGENT' });
  if (status !== 'DELIVERED' && status !== 'CANCELLED') options.push({ value: 'CANCEL', label: 'Cancel Order' });
  return options;
}

function MetricCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
      <p className="text-gray-500 text-[9px] uppercase tracking-wider font-bold mb-1">{label}</p>
      <p className={`${color} font-bold text-xl leading-none`}>{value}</p>
    </div>
  );
}

function PipelineStat({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className={`rounded-lg p-3 ${color.split(' ')[0]} border border-current/10`}>
      <p className={`font-bold text-lg ${color.split(' ')[1]}`}>{count}</p>
      <p className="text-[8px] text-gray-500 uppercase tracking-wider font-semibold mt-0.5">{label}</p>
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
        className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-amber-500/20 transition-colors"
      >
        Intervene
      </button>
    );
  }

  return (
    <div className="absolute right-0 top-full mt-1 z-50 bg-midnight-900 border border-amber-500/30 rounded-xl p-4 shadow-2xl w-64 space-y-2">
      <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Owner Intervention</p>
      <div className="space-y-1">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => setInterveneAction(opt.value)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              interveneAction === opt.value
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                : 'bg-midnight-800 text-gray-400 border border-midnight-700 hover:border-amber-500/30'
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
            className="w-full bg-midnight-800 border border-midnight-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-amber-500 transition-colors resize-none"
            placeholder="Reason (optional)"
          />
          <button
            onClick={() => onIntervene(orderId, interveneAction)}
            disabled={actionOrderId === orderId}
            className="w-full bg-amber-500 text-midnight-950 py-2 rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {actionOrderId === orderId ? 'Executing...' : 'Confirm'}
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