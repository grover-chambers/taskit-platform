"use client";

import { useEffect, useState } from 'react';

interface BillingOrder {
  id: string;
  errandDescription: string;
  totalAmount: number;
  createdAt: string;
  dropoffLocation: string | null;
}

interface BillingData {
  enterpriseName: string;
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

function generateInvoiceHTML(billing: BillingData, monthName: string, year: number, period: 'current' | 'last') {
  const data = period === 'current' ? billing.currentMonth : billing.lastMonth;
  const orders = data.orders;
  const generatedDate = new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' });

  return `<!DOCTYPE html>
<html>
<head>
  <title>Invoice - ${billing.enterpriseName} - ${monthName} ${year}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { border-bottom: 3px solid #c9a227; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
    .header h1 { font-size: 28px; color: #1a1a2e; }
    .header .meta { text-align: right; font-size: 14px; color: #555; }
    .header .meta strong { color: #1a1a2e; }
    .summary { display: flex; gap: 30px; margin-bottom: 30px; }
    .summary-card { flex: 1; background: #f8f8f8; border-radius: 8px; padding: 20px; text-align: center; border: 1px solid #e0e0e0; }
    .summary-card .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px; }
    .summary-card .value { font-size: 24px; font-weight: 700; color: #1a1a2e; }
    .summary-card .value.gold { color: #c9a227; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    thead th { background: #1a1a2e; color: white; padding: 12px 16px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    thead th:last-child { text-align: right; }
    tbody td { padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 14px; }
    tbody td:last-child { text-align: right; font-weight: 600; }
    .total-row { background: #f8f8f8; }
    .total-row td { font-weight: 700; font-size: 16px; border-top: 2px solid #1a1a2e; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${billing.enterpriseName}</h1>
      <p style="color:#888; font-size:14px; margin-top:4px;">Delivery Invoice</p>
    </div>
    <div class="meta">
      <p><strong>Billing Period:</strong> ${monthName} ${year}</p>
      <p><strong>Generated:</strong> ${generatedDate}</p>
    </div>
  </div>

  <div class="summary">
    <div class="summary-card">
      <div class="label">Total Deliveries</div>
      <div class="value">${data.deliveries}</div>
    </div>
    <div class="summary-card">
      <div class="label">Rate</div>
      <div class="value">KSh ${billing.rate}</div>
    </div>
    <div class="summary-card">
      <div class="label">Total Amount</div>
      <div class="value gold">KSh ${data.amount.toLocaleString()}</div>
    </div>
  </div>

  ${orders.length > 0 ? `
  <table>
    <thead>
      <tr><th>Description</th><th>Date</th><th>Amount</th></tr>
    </thead>
    <tbody>
      ${orders.map(o => `<tr><td>${o.errandDescription}</td><td>${formatDate(o.createdAt)}</td><td>KSh ${o.totalAmount.toLocaleString()}</td></tr>`).join('')}
      <tr class="total-row"><td colspan="2">Total</td><td>KSh ${data.amount.toLocaleString()}</td></tr>
    </tbody>
  </table>` : '<p style="color:#888; text-align:center; padding:30px;">No deliveries this period</p>'}

  <div class="footer">
    <p>This is a computer-generated invoice from ${billing.enterpriseName} via Mtaago Delivery Platform.</p>
  </div>

  <div class="no-print" style="text-align:center; margin-top:30px;">
    <button onclick="window.print()" style="background:#1a1a2e; color:white; border:none; padding:12px 32px; border-radius:8px; font-size:14px; cursor:pointer; font-weight:600;">Print / Save as PDF</button>
  </div>
</body>
</html>`;
}

export default function VendorBillingPage() {
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

  const handleDownloadInvoice = (period: 'current' | 'last') => {
    if (!billing) return;
    const now = new Date();
    const year = period === 'current' ? now.getFullYear() : (now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());
    const monthIdx = period === 'current' ? now.getMonth() : (now.getMonth() === 0 ? 11 : now.getMonth() - 1);
    const monthName = MONTHS[monthIdx];

    const html = generateInvoiceHTML(billing, monthName, year, period);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (w) {
      w.onload = () => URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!billing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-sm">Unable to load billing</p>
      </div>
    );
  }

  const now = new Date();
  const currentMonthName = MONTHS[now.getMonth()];
  const lastMonthName = MONTHS[now.getMonth() === 0 ? 11 : now.getMonth() - 1];

  return (
    <div className="px-6 pt-6 pb-24">
      <h1 className="text-white font-bold text-lg mb-5">Monthly Invoice</h1>

      <div className="bg-midnight-800 border border-gold-500/30 rounded-xl p-5 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">{currentMonthName}</p>
            <p className="text-gold-500 font-bold text-2xl">KSh {billing.currentMonth.amount.toLocaleString()}</p>
          </div>
          <button
            onClick={() => handleDownloadInvoice('current')}
            className="text-[10px] font-bold bg-gold-500/15 text-gold-500 px-3 py-1.5 rounded-lg border border-gold-500/30 hover:bg-gold-500/25 transition-colors"
          >
            Download Invoice
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Deliveries</p>
            <p className="text-white font-bold text-base">{billing.currentMonth.deliveries}</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Rate</p>
            <p className="text-white font-bold text-base">KSh {billing.rate}</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Amount</p>
            <p className="text-gold-500 font-bold text-base">KSh {billing.currentMonth.amount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">{lastMonthName}</p>
            <p className="text-gray-300 font-bold text-xl">KSh {billing.lastMonth.amount.toLocaleString()}</p>
          </div>
          <button
            onClick={() => handleDownloadInvoice('last')}
            className="text-[10px] font-bold bg-midnight-700 text-gray-400 px-3 py-1.5 rounded-lg border border-midnight-600 hover:border-gray-500 hover:text-gray-300 transition-colors"
          >
            Download Invoice
          </button>
        </div>
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
                <p className="text-gold-500 font-bold text-sm flex-shrink-0">KSh {order.totalAmount}</p>
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
            <p className="text-gold-500 font-bold text-base">KSh {billing.allTimeAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
