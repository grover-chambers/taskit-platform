"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';

interface Order {
  id: string;
  errandDescription: string;
  status: string;
  totalAmount: number;
  pickupLocation: string;
  dropoffLocation: string;
  weightKg: number | null;
  weightSurcharge: number;
  createdAt: string;
}

interface Customer {
  name: string;
}

interface Rider {
  name: string;
  plateNumber: string;
  rating: number;
}

interface Zone {
  name: string;
}

interface RiderLocation {
  lat: number;
  lng: number;
  updatedAt: string;
  speedKmh: number | null;
}

interface StatusLog {
  status: string;
  timestamp: string;
}

interface TrackingData {
  order: Order;
  customer: Customer;
  rider: Rider | null;
  zone: Zone | null;
  riderLocation: RiderLocation | null;
  statusLogs: StatusLog[];
}

const PIPELINE_STEPS_STANDARD = [
  { key: 'RECEIVED', label: 'Received' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'ASSIGNED', label: 'Assigned' },
  { key: 'PICKED_UP', label: 'Picked Up' },
  { key: 'IN_TRANSIT', label: 'In Transit' },
  { key: 'DELIVERED', label: 'Delivered' },
];

const PIPELINE_STEPS_ENTERPRISE = [
  { key: 'PRICED', label: 'Priced' },
  { key: 'PAID', label: 'Paid' },
  { key: 'PACKED', label: 'Packed' },
  { key: 'AWAITING_RIDER', label: 'Awaiting Rider' },
  { key: 'ASSIGNED', label: 'Assigned' },
  { key: 'PICKED_UP', label: 'Picked Up' },
  { key: 'IN_TRANSIT', label: 'In Transit' },
  { key: 'DELIVERED', label: 'Delivered' },
];

const STATUS_INDEX: Record<string, number> = {
  PRICED: 0,
  PAID: 1,
  PACKED: 2,
  AWAITING_RIDER: 3,
  RECEIVED: 0,
  ACCEPTED: 1,
  ASSIGNED: 2,
  PICKED_UP: 3,
  IN_TRANSIT: 4,
  DELIVERED: 5,
  CANCELLED: -1,
};

const ENTERPRISE_STATUSES = new Set(['PRICED', 'PAID', 'PACKED', 'AWAITING_RIDER']);

function getPipelineSteps(order: Order) {
  if (ENTERPRISE_STATUSES.has(order.status)) return PIPELINE_STEPS_ENTERPRISE;
  return PIPELINE_STEPS_STANDARD;
}

function getStepIndex(status: string, steps: { key: string }[]) {
  if (status === 'CANCELLED') return -1;
  const idx = steps.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function TrackPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/track/${orderId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {}
    setLoading(false);
  }, [orderId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">📦</div>
          <h2 className="text-white font-bold text-base mb-1">Order Not Found</h2>
          <p className="text-gray-500 text-sm">Check the link and try again</p>
        </div>
      </div>
    );
  }

  const { order, rider, zone, riderLocation, statusLogs } = data;
  const pipelineSteps = getPipelineSteps(order);
  const currentIdx = getStepIndex(order.status, pipelineSteps);
  const isCancelled = order.status === 'CANCELLED';
  const isActiveStatus = ['IN_TRANSIT', 'ASSIGNED', 'PICKED_UP'].includes(order.status);
  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="min-h-screen bg-midnight-950 pb-24">
      <div className="px-5 pt-6 pb-24">
        <div className="mb-6">
          <h1 className="text-haraka-500 font-bold text-lg">Haraka Dispatch</h1>
          <p className="text-gray-600 text-[10px] font-semibold">by Kanini Haraka</p>
        </div>

        <div className="mb-5 text-center">
          <p className={`font-bold text-2xl ${
            isDelivered ? 'text-green-400' :
            isActiveStatus ? 'text-haraka-500' :
            isCancelled ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {isCancelled ? 'Cancelled' : order.status.replace(/_/g, ' ')}
          </p>
          {!isCancelled && !isDelivered && (
            <p className="text-gray-500 text-[10px] mt-1">#{order.id.slice(-7).toUpperCase()}</p>
          )}
        </div>

        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            {pipelineSteps.map((step, i) => {
              const isCompleted = !isCancelled && currentIdx >= i;
              const isCurrent = !isCancelled && currentIdx === i;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      isCurrent ? 'bg-haraka-500 animate-pulse' :
                      isCompleted ? 'bg-haraka-500' :
                      'bg-midnight-700'
                    }`} />
                    <span className={`text-[8px] mt-1 font-semibold ${
                      isCompleted || isCurrent ? 'text-haraka-500' : 'text-midnight-700'
                    }`}>{step.label}</span>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <div className={`flex-1 h-[2px] mx-0.5 mb-4 ${
                      isCompleted && currentIdx > i ? 'bg-haraka-500' : 'bg-midnight-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* The customer receives OTP via SMS/WhatsApp notification — not on tracking page */}

        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 mb-4">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-3">Order Details</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Description</span>
              <span className="text-white text-xs font-semibold text-right max-w-[60%]">{order.errandDescription}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Pickup</span>
              <span className="text-white text-xs font-semibold">{order.pickupLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Dropoff</span>
              <span className="text-white text-xs font-semibold">{order.dropoffLocation}</span>
            </div>
            {zone && (
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Zone</span>
                <span className="text-white text-xs font-semibold">{zone.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Amount</span>
              <span className="text-haraka-500 text-xs font-bold">KSh {order.totalAmount.toLocaleString()}</span>
            </div>
            {order.weightKg && (
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Weight</span>
                <span className="text-white text-xs font-semibold">{order.weightKg} kg</span>
              </div>
            )}
          </div>
        </div>

        {rider && (
          <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 mb-4">
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-3">Rider</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-semibold">{rider.name}</p>
                <p className="text-gray-400 text-xs">{rider.plateNumber} · ⭐ {typeof rider.rating === 'number' ? rider.rating.toFixed(1) : '5.0'}</p>
              </div>
            </div>
          </div>
        )}

        {riderLocation && (
          <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-green-400 text-xs font-semibold">Rider is on the way!</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Location</span>
                <span className="text-white text-xs font-mono">{riderLocation.lat.toFixed(4)}, {riderLocation.lng.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Last updated</span>
                <span className="text-gray-300 text-xs">{formatTimeAgo(riderLocation.updatedAt)}</span>
              </div>
              {riderLocation.speedKmh != null && (
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs">Speed</span>
                  <span className="text-gray-300 text-xs">{riderLocation.speedKmh} km/h</span>
                </div>
              )}
            </div>
          </div>
        )}

        <a
          href={`https://wa.me/254797100144?text=${encodeURIComponent(`Hi, I need help with my delivery order #${order.id.slice(-7).toUpperCase()}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-green-600 text-white text-center py-3 rounded-xl font-bold text-sm mb-6 hover:bg-green-500 transition-colors active:scale-[0.98]"
        >
          WhatsApp Support
        </a>

        <p className="text-center text-gray-600 text-[10px]">Powered by TaskIt</p>
      </div>
    </div>
  );
}
