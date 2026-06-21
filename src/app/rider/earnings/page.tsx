"use client";

import { useEffect, useState } from 'react';

export default function RiderEarnings() {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [summary, setSummary] = useState({ weekTotal: 0, pendingPayout: 0, trips: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/rider/earnings').then(r => r.json()),
      fetch('/api/rider/stats').then(r => r.json()),
    ]).then(([earningsData, statsData]) => {
      setEarnings(earningsData.earnings || []);
      const todayEarnings = statsData.riderDetail?.todayEarnings || 0;
      const totalTrips = statsData.riderDetail?.totalTrips || 0;
      setSummary({ weekTotal: todayEarnings * 5, pendingPayout: Math.round(todayEarnings * 0.65), trips: totalTrips });
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 pt-4"><p className="text-gray-500 text-sm">Loading...</p></div>;

  return (
    <div className="p-6 pt-4">
      <h1 className="text-2xl font-serif font-bold text-white mb-6">Earnings</h1>
      <div className="bg-midnight-800 border border-midnight-700 p-6 rounded-2xl shadow-soft-dark text-center mb-6">
        <p className="text-gray-400 text-xs uppercase tracking-wider">This Week</p>
        <p className="text-4xl font-serif font-bold text-gold-500 mt-2">Ksh {summary.weekTotal.toLocaleString()}</p>
        <p className="text-gray-500 text-sm mt-1">Pending payout: Ksh {summary.pendingPayout.toLocaleString()}</p>
      </div>
      <div className="space-y-3">
        {earnings.length === 0 && (
          <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 text-gray-500 text-sm text-center">
            No earnings yet — complete deliveries to earn
          </div>
        )}
        {earnings.map((e: any) => (
          <div key={e.id} className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 flex justify-between items-center">
            <div>
              <p className="text-white font-semibold text-sm">Delivery</p>
              <p className="text-gray-500 text-xs">{new Date(e.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="text-gold-500 font-bold">Ksh {e.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
