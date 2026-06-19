"use client";

import { useEffect, useState } from 'react';
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

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setOrder(data.order);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-midnight-950">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <Link href="/dashboard/orders" className="text-gray-400 text-sm hover:text-gold-500">← Back to orders</Link>
        <p className="text-gray-500 mt-4">Order not found</p>
      </div>
    );
  }

  const currentStepIdx = STEPS.indexOf(order.status);
  const rider = order.rider;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-midnight-900 to-midnight-950 px-6 pt-8 pb-0">
        <Link href="/dashboard/orders" className="text-gray-400 text-sm hover:text-gold-500 transition-colors inline-flex items-center gap-1 mb-3">
          ← Back to orders
        </Link>
        <h1 className="text-white font-bold text-lg truncate">{order.errandDescription}</h1>
        <p className="font-mono text-xs text-gold-500 mt-0.5">#{order.id.slice(-7).toUpperCase()}</p>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-48 bg-midnight-900 overflow-hidden border-y border-midnight-800">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(30,50,80,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,50,80,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px'
        }} />
        <div className="absolute top-[40%] left-0 right-0 h-3 bg-midnight-800/60 rounded" />
        <div className="absolute top-[68%] left-0 right-0 h-2 bg-midnight-800/60 rounded" />
        <div className="absolute left-[30%] top-0 bottom-0 w-2.5 bg-midnight-800/60 rounded" />
        <div className="absolute left-[65%] top-0 bottom-0 w-1.5 bg-midnight-800/60 rounded" />
        <span className="absolute top-[18%] left-[8%] text-[10px] text-gray-500 bg-midnight-950/80 border border-midnight-700 px-1.5 py-0.5 rounded">{order.zone?.name || 'Zone'}</span>
        <span className="absolute top-[65%] right-[8%] text-[10px] text-gray-500 bg-midnight-950/80 border border-midnight-700 px-1.5 py-0.5 rounded">Drop</span>
        <div className="absolute top-[36%] left-[26%] w-2.5 h-2.5 bg-gray-400 rounded-full border-2 border-midnight-950" />
        <div className="absolute bottom-[20%] right-[14%] w-3 h-3 bg-blue-500 rounded-full border-2 border-midnight-950" />
        {['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(order.status) && (
          <div className="absolute top-[42%] left-[52%] w-5 h-5 bg-gold-500 rounded-full border-[3px] border-midnight-950 flex items-center justify-center text-[8px] z-10" style={{
            animation: 'pulse-rider 2s ease-in-out infinite'
          }}>
            🛵
          </div>
        )}
        <style>{`
          @keyframes pulse-rider {
            0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.5); }
            50% { box-shadow: 0 0 0 8px rgba(212,175,55,0); }
          }
        `}</style>
      </div>

      {/* Status / ETA */}
      <div className="px-6 py-4">
        <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${
          order.status === 'DELIVERED'
            ? 'bg-green-500/10 border border-green-500/25'
            : 'bg-gold-500/10 border border-gold-500/25'
        }`}>
          <div>
            <div className="text-[10px] font-semibold" style={{color: order.status === 'DELIVERED' ? '#22c55e' : '#D4AF37'}}>
              {order.status === 'DELIVERED' ? 'Delivered' : 'Arriving in'}
            </div>
            <div className="text-[9px] text-gray-400">
              {order.status === 'DELIVERED' ? 'Completed successfully' : 'Rider en route'}
            </div>
          </div>
          <div className="font-bold text-xl" style={{color: order.status === 'DELIVERED' ? '#22c55e' : '#D4AF37'}}>
            {order.status === 'DELIVERED' ? '✓' : order.totalAmount > 0 ? `KSh ${order.totalAmount}` : order.zone?.price ? `KSh ${order.zone.price}` : '—'}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
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
              </div>
            </div>
            {rider.phone && (
              <a href={`tel:${rider.phone}`} className="text-gold-500 text-sm font-bold hover:underline">Call</a>
            )}
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className="px-6">
        <div className="bg-midnight-800/50 border border-midnight-700 rounded-xl p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500 text-xs">Zone</span>
            <span className="text-white text-xs font-semibold">{order.zone?.name || '—'}</span>
          </div>
          <div className="flex justify-between border-t border-midnight-700 pt-2">
            <span className="text-gray-500 text-xs">Payment</span>
            <span className="text-white text-xs font-semibold">{order.paymentStatus === 'PAID' ? 'M-Pesa Paid ✓' : order.paymentStatus}</span>
          </div>
          {order.totalAmount > 0 && (
            <div className="flex justify-between border-t border-midnight-700 pt-2">
              <span className="text-gray-500 text-xs">Amount</span>
              <span className="text-gold-500 text-xs font-bold">KSh {order.totalAmount}</span>
            </div>
          )}
          {order.shop && (
            <div className="flex justify-between border-t border-midnight-700 pt-2">
              <span className="text-gray-500 text-xs">Vendor</span>
              <span className="text-white text-xs font-semibold">{order.shop.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-md border-t border-midnight-800 z-50 px-4 py-3">
        <div className="max-w-lg mx-auto flex justify-around">
          {[
            { icon: '📞', label: 'Call rider', active: false },
            { icon: '🗺️', label: 'Tracking', active: true },
            { icon: '💬', label: 'Chat', active: false },
            { icon: '❌', label: 'Cancel', active: false },
          ].map(({ icon, label, active }) => (
            <div key={label} className={`flex flex-col items-center gap-0.5 cursor-pointer ${active ? 'text-gold-500' : 'text-gray-500 hover:text-gray-400'}`}>
              <span className="text-lg">{icon}</span>
              <span className="text-[9px] font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
