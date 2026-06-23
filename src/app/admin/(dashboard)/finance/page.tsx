"use client";

import { useEffect, useState, useCallback } from 'react';

export default function FinanceAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'revenue' | 'payouts'>('revenue');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/finance');
      const json = await res.json();
      setData(json);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-gray-500">Loading finance...</p></div>;
  }

  if (!data) {
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-red-400">Failed to load finance data</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Finance & Analytics</h1>
          <p className="text-gray-500 text-xs mt-0.5">Revenue, payouts, and M-Pesa transactions</p>
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
          <div className="text-[9px] text-gray-500">All Time Revenue</div>
          <div className="font-bold text-lg text-white">KSh {(data.total?.revenue || 0).toLocaleString()}</div>
          <div className="text-[9px] text-gray-500">{data.total?.orders || 0} total orders</div>
        </div>
        <div className="bg-midnight-800/80 border border-midnight-700 rounded-xl p-3 md:p-4">
          <div className="text-[9px] text-gray-500">Rider Payouts</div>
          <div className="font-bold text-lg text-blue-400">KSh {(data.totalPayouts || 0).toLocaleString()}</div>
          <div className="text-[9px] text-gray-500">{data.totalPayoutCount || 0} payouts</div>
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
          Rider Payouts
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
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Rider Payouts</h2>
          </div>
          <div className="divide-y divide-midnight-700">
            {data.recentPayouts?.length === 0 && (
              <div className="p-6 text-center text-gray-500 text-xs">No payouts yet</div>
            )}
            {data.recentPayouts?.map((p: any) => (
              <div key={p.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white text-xs font-semibold">{p.riderName}</p>
                  <p className="text-gray-500 text-[9px]">
                    Order #{p.orderId?.slice(-7).toUpperCase()} · {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-blue-400 font-bold text-sm">KSh {(p.amount || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
