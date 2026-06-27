"use client";

import { useEffect, useState } from 'react';
import { useEnterprise } from '../EnterpriseContext';

interface BillingOrder {
  id: string;
  errandDescription: string;
  totalAmount: number;
  createdAt: string;
  dropoffLocation: string | null;
}

interface BillingData {
  rate: number;
  currentMonth: {
    deliveries: number;
    amount: number;
    orders: BillingOrder[];
  };
  lastMonth: {
    deliveries: number;
    amount: number;
    orders: BillingOrder[];
  };
  allTimeDeliveries: number;
  allTimeAmount: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString([], { day: 'numeric', month: 'short' });
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MtaagoBillingPage() {
  const { enterprise, subRole, loading: roleLoading } = useEnterprise();
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBilling() {
      try {
        const res = await fetch('/api/vendor/billing');
        if (res.ok) {
          const data = await res.json();
          setBilling(data);
        }
      } catch {}
      setLoading(false);
    }
    fetchBilling();
  }, []);

  if (roleLoading || loading) {
    return (
      <div className="px-6 pt-6 pb-24">
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 border-2 border-haraka-500/30 border-t-haraka-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!billing) {
    return (
      <div className="px-6 pt-6 pb-24">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500 text-sm">Unable to load billing</p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const currentMonthName = MONTHS[now.getMonth()];
  const lastMonthName = MONTHS[now.getMonth() === 0 ? 11 : now.getMonth() - 1];

  return (
    <div className="px-6 pt-6 pb-24">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-white font-bold text-lg">Monthly Invoice</h1>
        {enterprise && (
          <span className="text-gray-500 text-[9px] font-semibold">{enterprise.name}</span>
        )}
      </div>

      <div className="bg-midnight-800 border border-haraka-500/30 rounded-xl p-5 mb-4">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">{currentMonthName}</p>
        <p className="text-haraka-500 font-bold text-2xl mb-3">KSh {billing.currentMonth.amount.toLocaleString()}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Deliveries</p>
            <p className="text-haraka-500 font-bold text-base">{billing.currentMonth.deliveries}</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Rate</p>
            <p className="text-haraka-500 font-bold text-base">KSh {billing.rate}</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Amount</p>
            <p className="text-haraka-500 font-bold text-base">KSh {billing.currentMonth.amount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5 mb-4">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">{lastMonthName}</p>
        <p className="text-gray-300 font-bold text-xl mb-3">KSh {billing.lastMonth.amount.toLocaleString()}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Deliveries</p>
            <p className="text-gray-400 font-bold text-base">{billing.lastMonth.deliveries}</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Rate</p>
            <p className="text-gray-400 font-bold text-base">KSh {billing.rate}</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Amount</p>
            <p className="text-gray-400 font-bold text-base">KSh {billing.lastMonth.amount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {billing.currentMonth.orders.length > 0 && (
        <div className="mb-4">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-3">{currentMonthName} Breakdown</p>
          <div className="bg-midnight-800 border border-midnight-700 rounded-xl overflow-hidden">
            {billing.currentMonth.orders.map((order, i) => (
              <div
                key={order.id}
                className={`flex justify-between items-center px-4 py-3 ${
                  i < billing.currentMonth.orders.length - 1 ? 'border-b border-midnight-700' : ''
                }`}
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-white text-xs font-semibold truncate">{order.errandDescription}</p>
                  <p className="text-[10px] text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <p className="text-haraka-500 font-bold text-sm flex-shrink-0">KSh {order.totalAmount}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">All-Time Deliveries</p>
            <p className="text-white font-bold text-base">{billing.allTimeDeliveries}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">All-Time Amount</p>
            <p className="text-haraka-500 font-bold text-base">KSh {billing.allTimeAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
