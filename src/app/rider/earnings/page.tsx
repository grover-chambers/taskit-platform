"use client";

import { useEffect, useState } from 'react';

export default function RiderEarnings() {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [weekEarnings, setWeekEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/rider/earnings').then(r => r.json()),
      fetch('/api/rider/stats').then(r => r.json()),
    ]).then(([earningsData, statsData]) => {
      const allEarnings = earningsData.earnings || [];
      setEarnings(allEarnings);
      const today = statsData.riderDetail?.todayEarnings || 0;
      setTodayEarnings(today);
      setTotalEarnings(earningsData.totalEarnings || 0);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekTotal = allEarnings
        .filter((e: any) => new Date(e.createdAt) >= weekAgo)
        .reduce((sum: number, e: any) => sum + e.amount, 0);
      setWeekEarnings(weekTotal);
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 pt-4"><p className="text-gray-500 text-sm">Loading...</p></div>;

  return (
    <div className="p-6 pt-4">
      <h1 className="text-2xl font-serif font-bold text-white mb-6">Earnings</h1>

      <div className="bg-midnight-800 border border-midnight-700 p-6 rounded-2xl shadow-soft-dark mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-wider">This Week</p>
        <p className="text-4xl font-serif font-bold text-gold-500 mt-2">KSh {weekEarnings.toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl shadow-soft-dark text-center">
          <p className="text-gold-500 font-bold text-xl">{todayEarnings.toLocaleString()}</p>
          <p className="text-gray-500 text-[10px] mt-1">Today</p>
        </div>
        <div className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl shadow-soft-dark text-center">
          <p className="text-white font-bold text-xl">{totalEarnings.toLocaleString()}</p>
          <p className="text-gray-500 text-[10px] mt-1">All Time</p>
        </div>
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
              <p className="text-white font-semibold text-sm">
                {e.order?.errandDescription
                  ? e.order.errandDescription.length > 30
                    ? e.order.errandDescription.slice(0, 30) + '...'
                    : e.order.errandDescription
                  : 'Delivery'}
              </p>
              <p className="text-gray-500 text-xs">{new Date(e.createdAt).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            </div>
            <p className="text-gold-500 font-bold">+KSh {e.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
