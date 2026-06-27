"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEnterprise } from '../../EnterpriseContext';

interface StatusLog {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
}

interface Order {
  id: string;
  errandDescription: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  mpesaReceipt: string | null;
  pickupLocation: string | null;
  dropoffLocation: string | null;
  contactPhone: string | null;
  specialInstructions: string | null;
  urgency: string;
  deliveryOtp: string | null;
  createdAt: string;
  rider: {
    id: string;
    name: string;
    phone: string;
    riderDetail: { plateNumber: string; rating: number } | null;
  } | null;
  zone: { name: string } | null;
  statusLogs: StatusLog[];
}

interface AvailableRider {
  id: string;
  plateNumber: string;
  rating: number;
  totalTrips: number;
  user: { name: string; phone: string };
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

const STATUS_FLOW = ['PRICED', 'PAID', 'PACKED', 'AWAITING_RIDER', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MtaagoOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { subRole, loading: roleLoading } = useEnterprise();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRiders, setShowRiders] = useState(false);
  const [availableRiders, setAvailableRiders] = useState<AvailableRider[]>([]);
  const [interveneOpen, setInterveneOpen] = useState(false);
  const [interveneAction, setInterveneAction] = useState('');
  const [interveneDetails, setInterveneDetails] = useState('');

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/enterprise/orders?limit=100`);
      if (res.ok) {
        const data = await res.json();
        const found = (data.orders || []).find((o: Order) => o.id === orderId);
        if (found) setOrder(found);
        else {
          const fallback = await fetch(`/api/orders/${orderId}`);
          if (fallback.ok) {
            const d = await fallback.json();
            setOrder(d.order);
          }
        }
      }
    } catch {}
    setLoading(false);
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const fetchRiders = async () => {
    try {
      const res = await fetch('/api/vendor/dispatch');
      if (res.ok) {
        const data = await res.json();
        setAvailableRiders(data.availableRiders || []);
      }
    } catch {}
  };

  const handleAction = async (endpoint: string, body: Record<string, string>) => {
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, ...body }),
      });
      if (res.ok) {
        await fetchOrder();
      } else {
        const d = await res.json();
        setError(d.error);
      }
    } catch {
      setError('Network error');
    }
    setActionLoading(false);
  };

  const handleIntervene = async () => {
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch('/api/enterprise/intervene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action: interveneAction, details: interveneDetails }),
      });
      if (res.ok) {
        setInterveneOpen(false);
        setInterveneAction('');
        setInterveneDetails('');
        await fetchOrder();
      } else {
        const d = await res.json();
        setError(d.error);
      }
    } catch {
      setError('Network error');
    }
    setActionLoading(false);
  };

  const handleDispatch = async (riderId: string) => {
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch('/api/vendor/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, riderId }),
      });
      if (res.ok) {
        setShowRiders(false);
        await fetchOrder();
      } else {
        const d = await res.json();
        setError(d.error);
      }
    } catch {
      setError('Network error');
    }
    setActionLoading(false);
  };

  if (roleLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-haraka-500/30 border-t-haraka-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-xs">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-sm">Order not found</p>
      </div>
    );
  }

  const isOperator = subRole === 'OPERATOR';
  const isOwner = subRole === 'OWNER';
  const currentStepIdx = STATUS_FLOW.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';
  const isActive = !isCancelled && !['DELIVERED'].includes(order.status);

  const interveneOptions: { value: string; label: string }[] = [];
  if (order.status === 'PRICED') {
    interveneOptions.push({ value: 'FORCE_PAYMENT', label: 'Force Confirm Payment' });
  }
  if (order.status === 'PAID') {
    interveneOptions.push({ value: 'FORCE_PACKED', label: 'Force Mark Packed' });
  }
  if (order.status === 'PACKED') {
    interveneOptions.push({ value: 'FORCE_AWAIT_RIDER', label: 'Force to Rider Queue' });
  }
  if (['AWAITING_RIDER', 'ASSIGNED', 'IN_TRANSIT', 'PICKED_UP'].includes(order.status)) {
    interveneOptions.push({ value: 'ESCALATE_URGENCY', label: 'Escalate to URGENT' });
  }
  if (order.status !== 'DELIVERED' && order.status !== 'CANCELLED') {
    interveneOptions.push({ value: 'CANCEL', label: 'Cancel Order' });
  }

  return (
    <div className="px-6 pt-4 pb-24 space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/mtaago/orders" className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <span className="font-mono text-[10px] text-gray-500">#{order.id.slice(-7).toUpperCase()}</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-white font-bold text-lg">Order Details</h1>
        <span className={`text-[10px] font-bold px-3 py-1 rounded-lg ${STATUS_COLORS[order.status] || 'bg-gray-500/15 text-gray-400'}`}>
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
          <p className="text-red-400 text-xs font-semibold">{error}</p>
        </div>
      )}

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1.5">Description</p>
        <p className="text-white text-sm">{order.errandDescription}</p>
      </div>

      {/* Operator Actions */}
      {isOperator && isActive && (
        <div className="bg-midnight-800 border border-haraka-500/30 rounded-xl p-4 space-y-2">
          <p className="text-[9px] text-haraka-500 uppercase tracking-wider font-bold mb-2">Actions</p>

          {order.status === 'PRICED' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleAction('/api/enterprise/orders/confirm-payment', { method: 'MANUAL' })}
                disabled={actionLoading}
                className="flex-1 bg-haraka-500 text-midnight-950 py-2.5 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors disabled:opacity-50"
              >
                {actionLoading ? '...' : 'Paid at Counter'}
              </button>
              <button
                onClick={() => handleAction('/api/enterprise/orders/confirm-payment', { method: 'MPESA' })}
                disabled={actionLoading}
                className="flex-1 bg-green-600/15 border border-green-600/30 text-green-400 py-2.5 rounded-lg text-xs font-bold hover:bg-green-600/25 transition-colors disabled:opacity-50"
              >
                {actionLoading ? '...' : 'M-Pesa Paid'}
              </button>
            </div>
          )}

          {order.status === 'PAID' && (
            <button
              onClick={() => handleAction('/api/enterprise/orders/packed', {})}
              disabled={actionLoading}
              className="w-full bg-haraka-500 text-midnight-950 py-2.5 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Marking...' : 'Mark as Packed'}
            </button>
          )}

          {order.status === 'PACKED' && (
            <button
              onClick={() => handleAction('/api/enterprise/orders/await-rider', {})}
              disabled={actionLoading}
              className="w-full bg-haraka-500 text-midnight-950 py-2.5 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Moving...' : 'Send to Rider Queue'}
            </button>
          )}

          {order.status === 'AWAITING_RIDER' && !showRiders && (
            <button
              onClick={() => { setShowRiders(true); fetchRiders(); }}
              className="w-full bg-haraka-500 text-midnight-950 py-2.5 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors disabled:opacity-50"
            >
              DISPATCH RIDER
            </button>
          )}

          {showRiders && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Rider</p>
              {availableRiders.length === 0 ? (
                <p className="text-gray-500 text-xs">No riders available</p>
              ) : (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {availableRiders.map(rider => (
                    <button
                      key={rider.id}
                      onClick={() => handleDispatch(rider.id)}
                      disabled={actionLoading}
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
              <button onClick={() => setShowRiders(false)} className="text-gray-500 text-[10px]">Cancel</button>
            </div>
          )}
        </div>
      )}

      {/* Owner Intervene */}
      {isOwner && interveneOptions.length > 0 && (
        <div className="bg-midnight-800 border border-amber-500/30 rounded-xl p-4 space-y-2">
          <p className="text-[9px] text-amber-400 uppercase tracking-wider font-bold mb-2">Owner Intervention</p>
          {!interveneOpen ? (
            <button
              onClick={() => setInterveneOpen(true)}
              className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-400 py-2.5 rounded-lg text-xs font-bold hover:bg-amber-500/20 transition-colors"
            >
              Intervene
            </button>
          ) : (
            <div className="space-y-2">
              {interveneOptions.map(opt => (
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
                    onClick={handleIntervene}
                    disabled={actionLoading}
                    className="w-full bg-amber-500 text-midnight-950 py-2 rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Executing...' : 'Confirm Intervention'}
                  </button>
                </>
              )}
              <button
                onClick={() => { setInterveneOpen(false); setInterveneAction(''); setInterveneDetails(''); }}
                className="text-gray-500 text-[10px] hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Status Timeline */}
      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-3">Status Timeline</p>
        <div className="space-y-0">
          {order.statusLogs.map((log, i) => {
            const isLast = i === order.statusLogs.length - 1;
            return (
              <div key={log.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isLast ? 'bg-haraka-500' : STATUS_COLORS[log.status]?.includes('green') ? 'bg-green-400' : 'bg-midnight-600'}`} />
                  {!isLast && <div className="w-0.5 h-6 bg-midnight-700" />}
                </div>
                <div className="pb-3">
                  <p className={`text-xs font-bold ${isLast ? 'text-haraka-500' : 'text-gray-400'}`}>
                    {log.status.replace(/_/g, ' ')}
                  </p>
                  {log.note && <p className="text-[10px] text-gray-500">{log.note}</p>}
                  <p className="text-[10px] text-gray-600">{formatDate(log.createdAt)} {formatTime(log.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      {!isCancelled && currentStepIdx >= 0 && (
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-3">Progress</p>
          <div className="flex items-center gap-0">
            {STATUS_FLOW.map((step, i) => {
              const completed = i <= currentStepIdx;
              const isLast = i === STATUS_FLOW.length - 1;
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                      completed ? 'bg-haraka-500 text-midnight-950' : 'bg-midnight-700 text-gray-500'
                    }`}>
                      {completed ? '\u2713' : ''}
                    </div>
                    <span className={`text-[7px] mt-1 font-semibold ${completed ? 'text-haraka-500' : 'text-gray-500'}`}>
                      {step.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-0.5 mx-1 mt-[-10px] ${i < currentStepIdx ? 'bg-haraka-500' : 'bg-midnight-700'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Info */}
      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-2">Payment</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-xs">Status</span>
          <span className={`text-xs font-bold ${order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-yellow-400'}`}>
            {order.paymentStatus}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-xs">Method</span>
          <span className="text-gray-300 text-xs">{order.paymentMethod === 'PENDING' ? 'Not confirmed' : order.paymentMethod}</span>
        </div>
        {order.mpesaReceipt && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">M-Pesa Receipt</span>
            <span className="text-green-400 text-xs font-mono">{order.mpesaReceipt}</span>
          </div>
        )}
      </div>

      {/* Locations */}
      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-2">Locations</p>
        {order.pickupLocation && (
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <span className="text-green-400 text-xs font-bold">P</span>
            <span>{order.pickupLocation}</span>
          </div>
        )}
        {order.dropoffLocation && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="text-red-400 text-xs font-bold">D</span>
            <span>{order.dropoffLocation}</span>
          </div>
        )}
      </div>

      {/* Rider */}
      {order.rider && (
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-2">Rider</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-semibold">{order.rider.name}</p>
              {order.rider.riderDetail && (
                <p className="text-gray-500 text-[10px]">{order.rider.riderDetail.plateNumber} · ⭐ {order.rider.riderDetail.rating.toFixed(1)}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${order.rider.phone}`}
                className="bg-haraka-500/15 text-haraka-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-haraka-500/25 transition-colors"
              >
                Call
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Amount & Details */}
      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Amount</p>
          <p className="text-haraka-500 font-bold text-base">KSh {order.totalAmount}</p>
        </div>
        {order.zone && (
          <div className="flex justify-between items-center mb-2">
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Zone</p>
            <p className="text-gray-300 text-sm">{order.zone.name}</p>
          </div>
        )}
        <div className="flex justify-between items-center mb-2">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Urgency</p>
          <p className={`text-sm font-semibold ${order.urgency === 'URGENT' ? 'text-orange-400' : 'text-gray-300'}`}>
            {order.urgency}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Created</p>
          <p className="text-gray-300 text-sm">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* OTP */}
      {order.deliveryOtp && isActive && (
        <div className="bg-haraka-500/10 border border-haraka-500/30 rounded-xl p-5 text-center">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">Delivery OTP</p>
          <p className="text-haraka-500 font-bold text-3xl tracking-[0.3em]">{order.deliveryOtp}</p>
          <p className="text-[10px] text-gray-500 mt-1.5">Share with rider to confirm delivery</p>
          <button
            onClick={() => navigator.clipboard.writeText(order.deliveryOtp!)}
            className="mt-3 bg-haraka-500 text-midnight-950 py-2 px-6 rounded-lg text-xs font-bold hover:bg-haraka-400 transition-colors"
          >
            Copy OTP
          </button>
        </div>
      )}

      <Link
        href={`/track/${order.id}`}
        className="block bg-haraka-500/15 border border-haraka-500/30 text-haraka-500 text-center py-3 rounded-xl text-sm font-bold hover:bg-haraka-500/25 transition-colors"
      >
        Track Live
      </Link>
    </div>
  );
}
