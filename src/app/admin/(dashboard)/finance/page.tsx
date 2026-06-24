"use client";

import { useEffect, useState, useCallback } from 'react';

const PAYOUT_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/15 text-yellow-400',
  APPROVED: 'bg-blue-500/15 text-blue-400',
  PAID: 'bg-green-500/15 text-green-400',
  REJECTED: 'bg-red-500/15 text-red-400',
};

export default function FinanceAnalytics() {
  const [data, setData] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [payoutSummary, setPayoutSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'revenue' | 'payouts' | 'manage'>('revenue');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [payoutFilter, setPayoutFilter] = useState('ALL');
  const [payRefModal, setPayRefModal] = useState<{ id: string; riderName: string } | null>(null);
  const [payReference, setPayReference] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [financeRes, payoutsRes] = await Promise.all([
        fetch('/api/admin/finance'),
        fetch('/api/admin/payouts'),
      ]);
      const financeJson = await financeRes.json();
      const payoutsJson = await payoutsRes.json();
      setData(financeJson);
      setPayouts(payoutsJson.payouts || []);
      setPayoutSummary(payoutsJson.summary || null);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePayoutAction = async (id: string, action: string, reference?: string) => {
    setProcessingId(id);
    try {
      const body: any = { action };
      if (reference) body.reference = reference;
      const res = await fetch(`/api/admin/payouts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Action failed');
      }
    } catch {}
    setProcessingId(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-gray-500">Loading finance...</p></div>;
  }

  if (!data) {
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-red-400">Failed to load finance data</p></div>;
  }

  const filteredPayouts = payouts.filter(p => payoutFilter === 'ALL' || p.status === payoutFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Finance & Payouts</h1>
          <p className="text-gray-500 text-xs mt-0.5">Revenue, payouts, and rider payments</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-midnight-800/80 border border-midnight-700 rounded-xl p-3 md:p-4">
          <div className="text-[9px] text-gray-500">Today</div>
          <div className="font-bold text-lg text-gold-500">KSh {(data.today?.revenue || 0).toLocaleString()}</div>
          <div className="text-[9px] text-gray-500">{data.today?.orders || 0} paid orders</div>
        </div>
        <div className="bg-midnight-800/80 border border-midnight-700 rounded-xl p-3 md:p-4">
          <div className="text-[9px] text-gray-500">This Month</div>
          <div className="font-bold text-lg text-white">KSh {(data.thisMonth?.revenue || 0).toLocaleString()}</div>
          <div className={`text-[9px] ${data.monthlyGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.monthlyGrowth >= 0 ? '▲' : '▼'} {Math.abs(data.monthlyGrowth)}% vs last month
          </div>
        </div>
        <div className="bg-midnight-800/80 border border-midnight-700 rounded-xl p-3 md:p-4">
          <div className="text-[9px] text-gray-500">Pending Payouts</div>
          <div className="font-bold text-lg text-yellow-400">KSh {(payoutSummary?.pending?.total || 0).toLocaleString()}</div>
          <div className="text-[9px] text-gray-500">{payoutSummary?.pending?.count || 0} riders</div>
        </div>
        <div className="bg-midnight-800/80 border border-midnight-700 rounded-xl p-3 md:p-4">
          <div className="text-[9px] text-gray-500">Total Paid Out</div>
          <div className="font-bold text-lg text-green-400">KSh {(payoutSummary?.paid?.total || 0).toLocaleString()}</div>
          <div className="text-[9px] text-gray-500">{payoutSummary?.paid?.count || 0} payouts</div>
        </div>
      </div>

      {data.orderByType && data.orderByType.length > 0 && (
        <div className="bg-midnight-800/50 border border-midnight-700 rounded-2xl p-4 md:p-5 mb-6">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Revenue by Order Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.orderByType.map((t: any) => (
              <div key={t.type} className="bg-midnight-900/50 rounded-xl p-3 border border-midnight-700">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${t.type === 'MARKETPLACE' ? 'bg-purple-500/15 text-purple-300' : 'bg-green-500/15 text-green-300'}`}>
                    {t.type}
                  </span>
                  <span className="text-gray-500 text-[9px]">{t.count} orders</span>
                </div>
                <div className="text-white font-bold text-lg">KSh {(t.revenue || 0).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('revenue')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${activeTab === 'revenue' ? 'bg-gold-500/15 text-gold-500 border border-gold-500/30' : 'bg-midnight-800 text-gray-400 border border-midnight-700'}`}
        >
          M-Pesa Transactions
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${activeTab === 'payouts' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'bg-midnight-800 text-gray-400 border border-midnight-700'}`}
        >
          Payout History
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors relative ${activeTab === 'manage' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' : 'bg-midnight-800 text-gray-400 border border-midnight-700'}`}
        >
          Manage
          {payoutSummary?.pending?.count > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-black text-[8px] rounded-full flex items-center justify-center font-bold">
              {payoutSummary.pending.count}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'revenue' && (
        <div className="bg-midnight-800/50 border border-midnight-700 rounded-2xl overflow-hidden">
          <div className="bg-midnight-900/50 px-4 py-3 border-b border-midnight-700">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent M-Pesa Transactions</h2>
          </div>
          <div className="divide-y divide-midnight-700">
            {data.recentTransactions?.length === 0 && (
              <div className="p-6 text-center text-gray-500 text-xs">No transactions yet</div>
            )}
            {data.recentTransactions?.map((tx: any) => (
              <div key={tx.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white text-xs font-semibold">{tx.customer?.name || 'Customer'} — #{tx.id.slice(-7).toUpperCase()}</p>
                  <p className="text-gray-500 text-[9px]">
                    {tx.mpesaReceipt || 'Manual'} · {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-gold-500 font-bold text-sm">KSh {(tx.totalAmount || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="bg-midnight-800/50 border border-midnight-700 rounded-2xl overflow-hidden">
          <div className="bg-midnight-900/50 px-4 py-3 border-b border-midnight-700">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payout History</h2>
          </div>
          <div className="divide-y divide-midnight-700">
            {payouts.filter(p => p.status === 'PAID').length === 0 && (
              <div className="p-6 text-center text-gray-500 text-xs">No paid payouts yet</div>
            )}
            {payouts.filter(p => p.status === 'PAID').map((p: any) => (
              <div key={p.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white text-xs font-semibold">{p.rider?.user?.name || 'Rider'}</p>
                  <p className="text-gray-500 text-[9px]">
                    {p.reference || 'No ref'} · {p.method} · {new Date(p.paidAt || p.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-bold text-sm">KSh {p.amount.toLocaleString()}</span>
                  <span className="block text-[9px] text-green-400/60">PAID</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div>
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {['ALL', 'PENDING', 'APPROVED', 'PAID', 'REJECTED'].map((s) => (
              <button
                key={s}
                onClick={() => setPayoutFilter(s)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  payoutFilter === s ? 'bg-gold-500/15 text-gold-500 border border-gold-500/30' : 'bg-midnight-800 text-gray-400 border border-midnight-700'
                }`}
              >
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                {s === 'PENDING' && payoutSummary?.pending?.count > 0 && (
                  <span className="ml-1 text-[8px]">({payoutSummary.pending.count})</span>
                )}
              </button>
            ))}
          </div>

          {payRefModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setPayRefModal(null)}>
              <div className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
                <h2 className="text-white font-bold text-base mb-1">Mark as Paid</h2>
                <p className="text-gray-500 text-xs mb-4">Payout for {payRefModal.riderName}</p>
                <input
                  type="text"
                  value={payReference}
                  onChange={(e) => setPayReference(e.target.value)}
                  placeholder="M-Pesa reference (optional)"
                  className="w-full bg-midnight-800 border border-midnight-700 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gold-500/50 placeholder:text-gray-600 mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setPayRefModal(null)}
                    className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handlePayoutAction(payRefModal.id, 'pay', payReference || undefined);
                      setPayRefModal(null);
                      setPayReference('');
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-500 transition-colors"
                  >
                    Confirm Paid
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {filteredPayouts.length === 0 && (
              <div className="bg-midnight-800/50 border border-midnight-700 rounded-2xl p-8 text-center text-gray-500 text-xs">
                No payouts found
              </div>
            )}
            {filteredPayouts.map((p: any) => (
              <div key={p.id} className="bg-midnight-800/80 border border-midnight-700 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-sm">{p.rider?.user?.name || 'Rider'}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${PAYOUT_STATUS_COLORS[p.status]}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[10px]">{p.rider?.user?.phone || ''} · {p.method}</p>
                  </div>
                  <p className="text-gold-500 font-bold text-lg flex-shrink-0">KSh {p.amount.toLocaleString()}</p>
                </div>
                <div className="text-[10px] text-gray-500 mb-3">
                  Created: {new Date(p.createdAt).toLocaleString()}
                  {p.approvedAt && ` · Approved: ${new Date(p.approvedAt).toLocaleString()}`}
                  {p.paidAt && ` · Paid: ${new Date(p.paidAt).toLocaleString()}`}
                  {p.reference && ` · Ref: ${p.reference}`}
                </div>
                {p.earnings?.length > 0 && (
                  <div className="space-y-1 mb-3">
                    {p.earnings.map((e: any) => (
                      <div key={e.id} className="flex items-center justify-between text-[10px] pl-2 border-l-2 border-midnight-600">
                        <span className="text-gray-400 truncate">{e.order?.errandDescription?.slice(0, 40) || 'Delivery'}</span>
                        <span className="text-gray-500">KSh {e.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  {p.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handlePayoutAction(p.id, 'approve')}
                        disabled={processingId === p.id}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500 disabled:opacity-50 transition-colors"
                      >
                        {processingId === p.id ? '...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handlePayoutAction(p.id, 'reject')}
                        disabled={processingId === p.id}
                        className="bg-red-600/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600/30 disabled:opacity-50 transition-colors"
                      >
                        {processingId === p.id ? '...' : 'Reject'}
                      </button>
                    </>
                  )}
                  {p.status === 'APPROVED' && (
                    <button
                      onClick={() => setPayRefModal({ id: p.id, riderName: p.rider?.user?.name || 'Rider' })}
                      disabled={processingId === p.id}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-500 disabled:opacity-50 transition-colors"
                    >
                      {processingId === p.id ? '...' : 'Mark as Paid'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
