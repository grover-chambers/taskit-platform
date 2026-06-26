"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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

interface RiderLocation {
  lat: number;
  lng: number;
  updatedAt: string;
  rider: {
    user: { name: string };
  } | null;
}

const STATUS_COLORS: Record<string, string> = {
  RECEIVED: 'bg-gray-500/15 text-gray-400',
  ACCEPTED: 'bg-blue-500/15 text-blue-400',
  ASSIGNED: 'bg-purple-500/15 text-purple-400',
  PICKED_UP: 'bg-teal-500/15 text-teal-400',
  IN_TRANSIT: 'bg-gold-500/15 text-gold-500',
  DELIVERED: 'bg-green-500/15 text-green-400',
  CANCELLED: 'bg-red-500/15 text-red-400',
};

const STATUS_FLOW = ['RECEIVED', 'ACCEPTED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [riderLocation, setRiderLocation] = useState<RiderLocation | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } catch {}
    setLoading(false);
  }, [orderId]);

  const fetchRiderLocation = useCallback(async () => {
    if (!order?.rider) return;
    try {
      const res = await fetch(`/api/rider/location?orderId=${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setRiderLocation(data.location);
      }
    } catch {}
  }, [orderId, order?.rider]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  useEffect(() => {
    if (order?.rider) {
      fetchRiderLocation();
      const interval = setInterval(fetchRiderLocation, 10000);
      return () => clearInterval(interval);
    }
  }, [order?.rider, fetchRiderLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-sm">Loading...</p>
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

  const currentStepIdx = STATUS_FLOW.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="px-6 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/vendor/orders" className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <span className="font-mono text-[10px] text-gray-500">#{order.id.slice(-7).toUpperCase()}</span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-white font-bold text-lg">Order Details</h1>
        <span className={`text-[10px] font-bold px-3 py-1 rounded-lg ${STATUS_COLORS[order.status] || 'bg-gray-500/15 text-gray-400'}`}>
          {order.status.replace('_', ' ')}
        </span>
      </div>

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 mb-4">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1.5">Description</p>
        <p className="text-white text-sm">{order.errandDescription}</p>
      </div>

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 mb-4">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-3">Status Timeline</p>
        <div className="space-y-0">
          {order.statusLogs.map((log, i) => {
            const isLast = i === order.statusLogs.length - 1;
            return (
              <div key={log.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isLast ? 'bg-gold-500' : 'bg-midnight-600'}`} />
                  {!isLast && <div className="w-0.5 h-6 bg-midnight-700" />}
                </div>
                <div className="pb-3">
                  <p className={`text-xs font-bold ${isLast ? 'text-gold-500' : 'text-gray-400'}`}>
                    {log.status.replace('_', ' ')}
                  </p>
                  {log.note && <p className="text-[10px] text-gray-500">{log.note}</p>}
                  <p className="text-[10px] text-gray-600">{formatDate(log.createdAt)} {formatTime(log.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isCancelled && currentStepIdx >= 0 && (
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 mb-4">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-3">Progress</p>
          <div className="flex items-center gap-0">
            {STATUS_FLOW.map((step, i) => {
              const completed = i <= currentStepIdx;
              const isLast = i === STATUS_FLOW.length - 1;
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                      completed ? 'bg-gold-500 text-midnight-950' : 'bg-midnight-700 text-gray-500'
                    }`}>
                      {completed ? '✓' : ''}
                    </div>
                    <span className={`text-[7px] mt-1 font-semibold ${completed ? 'text-gold-500' : 'text-gray-500'}`}>
                      {step.replace('_', ' ')}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-0.5 mx-1 mt-[-10px] ${i < currentStepIdx ? 'bg-gold-500' : 'bg-midnight-700'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 mb-4">
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

      {order.rider && (
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 mb-4">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-2">Rider</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-semibold">{order.rider.name}</p>
              {order.rider.riderDetail && (
                <p className="text-gray-500 text-[10px]">{order.rider.riderDetail.plateNumber} · ⭐ {order.rider.riderDetail.rating.toFixed(1)}</p>
              )}
            </div>
            <a
              href={`tel:${order.rider.phone}`}
              className="bg-gold-500/15 text-gold-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gold-500/25 transition-colors"
            >
              Call
            </a>
          </div>
        </div>
      )}

      {order.rider && riderLocation && (
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 mb-4">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">Live Tracking</p>
          <p className="text-white text-sm">
            {Number(riderLocation.lat).toFixed(5)}, {Number(riderLocation.lng).toFixed(5)}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Updated {riderLocation.updatedAt ? timeAgo(riderLocation.updatedAt) : 'recently'}
          </p>
        </div>
      )}

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Amount</p>
          <p className="text-gold-500 font-bold text-base">KSh {order.totalAmount}</p>
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

      {order.deliveryOtp && order.status === 'IN_TRANSIT' && (
        <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-4 text-center">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">Delivery OTP</p>
          <p className="text-gold-500 font-bold text-2xl tracking-[0.3em]">{order.deliveryOtp}</p>
          <p className="text-[10px] text-gray-500 mt-1">Share with rider to confirm delivery</p>
        </div>
      )}
    </div>
  );
}
