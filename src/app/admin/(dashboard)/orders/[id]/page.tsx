"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderDetail {
  id: string;
  errandDescription: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  mpesaTransactionCode: string | null;
  mpesaReceipt: string | null;
  pickupLocation: string | null;
  dropoffLocation: string | null;
  deliveryOtp: string | null;
  createdAt: string;
  zone: { name: string; price: number } | null;
  customer: { id: string; name: string; phone: string } | null;
  rider: { id: string; name: string; phone: string; riderDetail: { plateNumber: string; rating: number } | null } | null;
  statusLogs: { status: string; note: string | null; createdAt: string }[];
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/orders/${id}?role=admin`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch {}
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <Link href="/admin/orders" className="text-gray-400 text-sm hover:text-gold-500">&larr; Back to Orders</Link>
        <p className="text-gray-500 mt-4 text-center">Order not found</p>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    DELIVERED: 'text-green-400',
    CANCELLED: 'text-red-400',
    IN_TRANSIT: 'text-blue-400',
    ASSIGNED: 'text-purple-400',
    PICKED_UP: 'text-yellow-400',
  };

  return (
    <div>
      <Link href="/admin/orders" className="text-gold-500 text-sm font-semibold hover:underline mb-4 inline-block">&larr; Back to Orders</Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-white">Order {order.id.slice(-7).toUpperCase()}</h1>
        <span className={`text-sm px-3 py-1 rounded-full font-semibold ${statusColor[order.status] || 'text-gray-400'}`}>
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
            <h2 className="text-white font-bold text-lg mb-4">Errand Details</h2>
            <p className="text-gray-300 mb-4">{order.errandDescription}</p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-midnight-700">
              {order.zone && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Zone</p>
                  <p className="text-white font-semibold mt-1">{order.zone.name}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Amount</p>
                <p className="text-gold-500 font-bold mt-1">KSh {order.totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Pickup</p>
                <p className="text-white font-semibold mt-1">{order.pickupLocation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Dropoff</p>
                <p className="text-white font-semibold mt-1">{order.dropoffLocation || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
            <h2 className="text-white font-bold text-lg mb-6">Order Timeline</h2>
            <div className="relative border-l-2 border-midnight-700 ml-3 space-y-8">
              {order.statusLogs.map((step, index) => (
                <div key={index} className="relative pl-8 -ml-1">
                  <div className="absolute w-4 h-4 rounded-full -left-[9px] top-1 bg-gold-500" />
                  <p className="text-white font-semibold">{step.status.replace(/_/g, ' ')}</p>
                  <p className="text-gray-500 text-sm">{new Date(step.createdAt).toLocaleString()}</p>
                  {step.note && <p className="text-gray-600 text-xs mt-0.5">{step.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
            <h2 className="text-white font-bold text-lg mb-4">Payment</h2>
            <div className={`p-3 rounded-xl text-sm font-semibold text-center ${
              order.paymentStatus === 'PAID' ? 'bg-green-900/20 text-green-400' :
              order.paymentStatus === 'PENDING_VERIFICATION' ? 'bg-yellow-900/20 text-yellow-400' :
              order.paymentStatus === 'FAILED' ? 'bg-red-900/20 text-red-400' :
              'bg-gray-900/20 text-gray-400'
            }`}>
              {order.paymentStatus.replace(/_/g, ' ')}
            </div>
            <p className="text-gray-400 text-xs mt-3">Method: <span className="text-white">{order.paymentMethod}</span></p>
            {order.mpesaReceipt && (
              <p className="text-gray-400 text-xs mt-1">Receipt: <span className="text-white font-mono">{order.mpesaReceipt}</span></p>
            )}
            {order.mpesaTransactionCode && (
              <p className="text-gray-400 text-xs mt-1">Tx Code: <span className="text-white font-mono">{order.mpesaTransactionCode}</span></p>
            )}
          </div>

          {order.customer && (
            <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
              <h2 className="text-white font-bold text-lg mb-4">Customer</h2>
              <p className="text-white font-semibold">{order.customer.name}</p>
              <a href={`tel:${order.customer.phone}`} className="text-gold-500 text-sm hover:underline">{order.customer.phone}</a>
            </div>
          )}

          {order.rider && (
            <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
              <h2 className="text-white font-bold text-lg mb-4">Rider</h2>
              <p className="text-white font-semibold">{order.rider.name}</p>
              <a href={`tel:${order.rider.phone}`} className="text-gold-500 text-sm hover:underline">{order.rider.phone}</a>
              {order.rider.riderDetail && (
                <p className="text-gray-400 text-xs mt-1">{order.rider.riderDetail.plateNumber} · ⭐ {order.rider.riderDetail.rating.toFixed(1)}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
