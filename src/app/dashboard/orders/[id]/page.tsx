"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

const STEPS = ["RECEIVED", "ACCEPTED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];
const STEP_LABELS: Record<string, string> = {
  RECEIVED: "Placed", ACCEPTED: "Accepted", ASSIGNED: "Assigned",
  PICKED_UP: "Picked up", IN_TRANSIT: "On way", DELIVERED: "Delivered",
};
const STEP_ICONS: Record<string, string> = {
  RECEIVED: "📱", ACCEPTED: "✓", ASSIGNED: "🛵",
  PICKED_UP: "✓", IN_TRANSIT: "🛵", DELIVERED: "📦",
};
const TYPE_ICONS: Record<string, string> = {
  ERRAND: '🏃',
  MARKETPLACE: '🛒',
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [riderLocation, setRiderLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      setOrder(data.order);
    } catch {}
    setLoading(false);
  }, [params.id]);

  const fetchRiderLocation = useCallback(async () => {
    try {
      const res = await fetch(`/api/rider/location?orderId=${params.id}`);
      const data = await res.json();
      if (data.location) {
        setRiderLocation({
          lat: Number(data.location.lat),
          lng: Number(data.location.lng),
          heading: data.location.heading ? Number(data.location.heading) : null,
          updatedAt: data.location.updatedAt,
          rider: data.location.rider,
        });
      }
    } catch {}
  }, [params.id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  useEffect(() => {
    if (!order) return;
    const isActive = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(order.status);
    if (isActive) {
      fetchRiderLocation();
      const interval = setInterval(fetchRiderLocation, 10000);
      return () => clearInterval(interval);
    }
  }, [order, fetchRiderLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <Link href="/dashboard/orders" className="text-gray-400 text-sm hover:text-gold-500">← Back to orders</Link>
        <p className="text-gray-500 mt-4 text-center">Order not found</p>
      </div>
    );
  }

  const currentStepIdx = STEPS.indexOf(order.status);
  const rider = order.rider;
  const isActive = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(order.status);
  const isDone = ['DELIVERED', 'CANCELLED'].includes(order.status);
  const locationAge = riderLocation?.updatedAt
    ? Math.round((Date.now() - new Date(riderLocation.updatedAt).getTime()) / 1000)
    : null;

  return (
    <div className="pb-28">
      <div className="px-6 pt-4">
        <Link href="/dashboard/orders" className="text-gray-400 text-sm hover:text-gold-500 transition-colors inline-flex items-center gap-1 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to orders
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xl">{TYPE_ICONS[order.orderType] || '📋'}</span>
          <h1 className="text-white font-bold text-lg truncate flex-1">{order.errandDescription}</h1>
        </div>
        <p className="font-mono text-xs text-gold-500 mt-0.5">#{order.id.slice(-7).toUpperCase()}</p>
      </div>

      {/* Map / Tracking Visual */}
      <div className="relative h-44 bg-midnight-900 overflow-hidden border-y border-midnight-800 mt-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(30,50,80,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,50,80,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px'
        }} />

        {isActive && riderLocation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-1" style={{
                transform: riderLocation.heading ? `rotate(${riderLocation.heading}deg)` : 'none',
                transition: 'transform 0.5s ease-out',
              }}>🛵</div>
              <div className="bg-midnight-950/90 border border-gold-500/30 px-2 py-1 rounded-md">
                <p className="text-gold-500 text-[10px] font-bold">Live</p>
                <p className="text-gray-400 text-[8px]">
                  {riderLocation.lat.toFixed(4)}, {riderLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        )}

        {isActive && !riderLocation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-5 h-5 bg-gold-500 rounded-full border-[3px] border-midnight-950 mx-auto mb-2 animate-pulse" />
              <p className="text-gray-400 text-[10px]">Locating rider...</p>
            </div>
          </div>
        )}

        {isDone && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500 text-sm">
              {order.status === 'DELIVERED' ? '✓ Delivered' : '✕ Cancelled'}
            </div>
          </div>
        )}

        {!isActive && !isDone && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500 text-sm">Awaiting rider</div>
          </div>
        )}

        <span className="absolute top-[18%] left-[8%] text-[10px] text-gray-500 bg-midnight-950/80 border border-midnight-700 px-1.5 py-0.5 rounded">{order.zone?.name || 'Zone'}</span>

        <style>{`
          @keyframes pulse-rider {
            0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.5); }
            50% { box-shadow: 0 0 0 8px rgba(212,175,55,0); }
          }
        `}</style>
      </div>

      {/* Status Bar */}
      <div className="px-6 py-4">
        <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${
          order.status === 'DELIVERED' ? 'bg-green-500/10 border border-green-500/25' :
          isActive ? 'bg-gold-500/10 border border-gold-500/25' :
          order.status === 'CANCELLED' ? 'bg-red-500/10 border border-red-500/25' :
          'bg-midnight-800 border border-midnight-700'
        }`}>
          <div>
            <div className="text-[10px] font-semibold" style={{ color: order.status === 'DELIVERED' ? '#22c55e' : order.status === 'CANCELLED' ? '#ef4444' : isActive ? '#D4AF37' : '#6b7280' }}>
              {order.status === 'DELIVERED' ? 'Delivered' : order.status === 'CANCELLED' ? 'Cancelled' : isActive ? 'Live Tracking' : order.status.replace('_', ' ')}
            </div>
            <div className="text-[9px] text-gray-400">
              {isDone ? (order.status === 'DELIVERED' ? 'Completed successfully' : 'Order was cancelled') :
               isActive && locationAge !== null ? `Last ping ${locationAge}s ago` :
               'Waiting for update'}
            </div>
          </div>
          <div className="font-bold text-xl" style={{ color: order.status === 'DELIVERED' ? '#22c55e' : '#D4AF37' }}>
            {order.totalAmount > 0 ? `KSh ${order.totalAmount}` : '—'}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      {!order.status.includes('CANCELLED') && (
        <div className="px-6 mb-5">
          <div className="flex items-center">
            {STEPS.map((step, i) => (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {i < STEPS.length - 1 && (
                  <div className={`absolute top-2.5 left-[50%] w-full h-0.5 ${i < currentStepIdx ? 'bg-gold-500' : 'bg-midnight-700'}`} />
                )}
                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center text-[9px] z-10 mb-1
                  ${i < currentStepIdx ? 'bg-gold-500 text-midnight-950 font-bold' :
                    i === currentStepIdx ? 'bg-midnight-800 border-2 border-gold-500 text-gold-500' :
                    'bg-midnight-700 text-gray-500'}
                  ${i === currentStepIdx && order.status !== 'DELIVERED' ? 'animate-pulse' : ''}
                `}>
                  {STEP_ICONS[step] || '○'}
                </div>
                <span className={`text-[8px] text-center ${i <= currentStepIdx ? 'text-gray-400' : 'text-gray-600'}`}>
                  {STEP_LABELS[step] || step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rider Info */}
      {rider && (
        <div className="px-6 mb-4">
          <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500/15 border-2 border-gold-500 flex items-center justify-center text-xs font-bold text-gold-500 flex-shrink-0">
              {rider.name?.split(' ').map((n: string) => n[0]).join('') || 'R'}
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-bold">{rider.name}</div>
              <div className="text-gray-400 text-[10px]">
                🛵 {rider.riderDetail?.plateNumber || 'Vehicle'} · ⭐ {rider.riderDetail?.rating?.toFixed(1) || '—'}
                {riderLocation && <span className="text-green-400 ml-2">● Live</span>}
              </div>
            </div>
            {rider.phone && (
              <a href={`tel:${rider.phone}`} className="bg-gold-500/15 border border-gold-500/30 px-3 py-1.5 rounded-lg text-gold-500 text-xs font-bold hover:bg-gold-500/25 transition-colors">
                Call
              </a>
            )}
          </div>
        </div>
      )}

      {/* Delivery OTP */}
      {order.deliveryOtp && ['IN_TRANSIT', 'DELIVERED'].includes(order.status) && (
        <div className="px-6 mb-4">
          <div className={`border rounded-xl p-4 text-center ${order.status === 'IN_TRANSIT' ? 'bg-gold-500/10 border-gold-500/30' : 'bg-midnight-800 border-midnight-700'}`}>
            <p className={`${order.status === 'IN_TRANSIT' ? 'text-gold-500' : 'text-gray-500'} text-[10px] font-bold uppercase tracking-wider mb-1`}>
              {order.status === 'IN_TRANSIT' ? 'Delivery OTP' : 'Delivery OTP (completed)'}
            </p>
            <p className={`${order.status === 'IN_TRANSIT' ? 'text-gold-500' : 'text-gray-400'} text-3xl font-bold font-mono tracking-[0.5em]`}>{order.deliveryOtp}</p>
            <p className="text-gray-400 text-[9px] mt-1">
              {order.status === 'IN_TRANSIT' ? 'Share this code with your rider to confirm delivery' : 'OTP used to confirm delivery'}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isActive && (
        <div className="px-6 mb-4 flex gap-3">
          {rider?.phone && (
            <a href={`tel:${rider.phone}`} className="flex-1 bg-midnight-800 border border-midnight-700 rounded-xl py-3 flex items-center justify-center gap-2 text-white text-sm font-semibold hover:border-gold-500 transition-colors">
              📞 Call Rider
            </a>
          )}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254797100144'}?text=${encodeURIComponent(`Hi TaskIt Support, I need help with order #${order.id.slice(-7).toUpperCase()}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366]/15 border border-[#25D366]/30 rounded-xl py-3 flex items-center justify-center gap-2 text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/25 transition-colors"
          >
            💬 WhatsApp
          </a>
        </div>
      )}

      {/* Order Details */}
      <div className="px-6">
        <div className="bg-midnight-800/50 border border-midnight-700 rounded-xl p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500 text-xs">Type</span>
            <span className="text-white text-xs font-semibold">{order.orderType || 'ERRAND'}</span>
          </div>
          {order.pickupLocation && (
            <div className="flex justify-between border-t border-midnight-700 pt-2">
              <span className="text-gray-500 text-xs">Pickup</span>
              <span className="text-white text-xs font-semibold text-right max-w-[65%]">{order.pickupLocation}</span>
            </div>
          )}
          {order.dropoffLocation && (
            <div className="flex justify-between border-t border-midnight-700 pt-2">
              <span className="text-gray-500 text-xs">Drop-off</span>
              <span className="text-white text-xs font-semibold text-right max-w-[65%]">{order.dropoffLocation}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-midnight-700 pt-2">
            <span className="text-gray-500 text-xs">Zone</span>
            <span className="text-white text-xs font-semibold">{order.zone?.name || '—'}</span>
          </div>
          <div className="flex justify-between border-t border-midnight-700 pt-2">
            <span className="text-gray-500 text-xs">Payment</span>
            <span className="text-white text-xs font-semibold">
              {order.paymentStatus === 'PAID' ? 'M-Pesa ✓' : order.paymentStatus === 'PENDING_VERIFICATION' ? 'Verifying...' : order.paymentStatus}
            </span>
          </div>
          {order.totalAmount > 0 && (
            <div className="flex justify-between border-t border-midnight-700 pt-2">
              <span className="text-gray-500 text-xs">Amount</span>
              <span className="text-gold-500 text-xs font-bold">KSh {order.totalAmount}</span>
            </div>
          )}
          {order.specialInstructions && (
            <div className="border-t border-midnight-700 pt-2">
              <span className="text-gray-500 text-xs block mb-1">Instructions</span>
              <p className="text-gray-300 text-xs">{order.specialInstructions}</p>
            </div>
          )}
          <div className="flex justify-between border-t border-midnight-700 pt-2">
            <span className="text-gray-500 text-xs">Placed</span>
            <span className="text-white text-xs font-semibold">{new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {order.statusLogs?.length > 0 && (
            <div className="border-t border-midnight-700 pt-3 mt-2">
              <p className="text-gray-500 text-[9px] uppercase tracking-wider font-bold mb-2">Timeline</p>
              <div className="space-y-1.5">
                {order.statusLogs.map((log: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === order.statusLogs.length - 1 ? 'bg-gold-500' : 'bg-midnight-600'}`} />
                    <span className="text-gray-400 text-[10px] flex-1">{log.status.replace('_', ' ')}{log.note ? ` — ${log.note}` : ''}</span>
                    <span className="text-gray-600 text-[9px]">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
