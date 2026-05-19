"use client";

export default function FinanceAnalytics() {
  const zones = [
    { name: 'Nairobi CBD', revenue: 15600, percentage: 45 },
    { name: 'Westlands', revenue: 8200, percentage: 24 },
    { name: 'Eastleigh', revenue: 6500, percentage: 19 },
    { name: 'Ngara', revenue: 4100, percentage: 12 },
  ];

  const weekData = [
    { day: 'Mon', amount: 1800 },
    { day: 'Tue', amount: 2400 },
    { day: 'Wed', amount: 1500 },
    { day: 'Thu', amount: 3200 },
    { day: 'Fri', amount: 4100 },
    { day: 'Sat', amount: 2900 },
    { day: 'Sun', amount: 1200 },
  ];

  const maxAmount = Math.max(...weekData.map(d => d.amount));

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Finance & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm">This Month Revenue</p>
          <p className="text-4xl font-serif font-bold text-gold-500 mt-2">Ksh 34,400</p>
          <p className="text-green-400 text-sm mt-2">+18% vs last month</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm">Platform Fee (15%)</p>
          <p className="text-4xl font-serif font-bold text-white mt-2">Ksh 5,160</p>
          <p className="text-gray-500 text-sm mt-2">Net earnings</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm">Rider Payouts</p>
          <p className="text-4xl font-serif font-bold text-white mt-2">Ksh 29,240</p>
          <p className="text-gray-500 text-sm mt-2">Pending to M-Pesa</p>
        </div>
      </div>

      {/* 7-Day Visual Chart */}
      <h2 className="text-xl font-bold text-white mb-4">Last 7 Days Revenue</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 p-6 mb-10">
        <div className="flex items-end justify-between space-x-4 h-48">
          {weekData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full">
              <div className="w-full bg-gold-500/80 rounded-t-lg transition-all" style={{ height: `${(d.amount / maxAmount) * 100}%` }}></div>
              <p className="text-gray-400 text-xs mt-2 font-semibold">{d.day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Breakdown */}
      <h2 className="text-xl font-bold text-white mb-4">Revenue by Zone</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 p-6 space-y-4 mb-10">
        {zones.map((zone) => (
          <div key={zone.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white font-semibold text-sm">{zone.name}</span>
              <span className="text-gold-500 font-bold text-sm">Ksh {zone.revenue.toLocaleString()}</span>
            </div>
            <div className="w-full bg-midnight-900 rounded-full h-2.5">
              <div className="bg-gold-500 h-2.5 rounded-full" style={{ width: `${zone.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* M-Pesa Ledger */}
      <h2 className="text-xl font-bold text-white mb-4">Recent M-Pesa Webhooks</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden">
        <div className="divide-y divide-midnight-700">
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-white font-semibold text-sm">Order TSK-905 - Westlands</p>
              <p className="text-gray-500 text-xs">Receipt: SHK5G4R2VN</p>
            </div>
            <span className="text-green-400 font-bold">+Ksh 250</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-white font-semibold text-sm">Order TSK-904 - Eastleigh</p>
              <p className="text-gray-500 text-xs">Receipt: PJK8T1X9QM</p>
            </div>
            <span className="text-green-400 font-bold">+Ksh 300</span>
          </div>
        </div>
      </div>
    </div>
  );
}
