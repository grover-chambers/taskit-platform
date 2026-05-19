"use client";

export default function RiderEarnings() {
  return (
    <div className="p-6 pt-4">
      <h1 className="text-2xl font-serif font-bold text-white mb-6">Earnings</h1>
      <div className="bg-midnight-800 border border-midnight-700 p-6 rounded-2xl shadow-soft-dark text-center mb-6">
        <p className="text-gray-400 text-xs uppercase tracking-wider">This Week</p>
        <p className="text-4xl font-serif font-bold text-gold-500 mt-2">Ksh 6,400</p>
        <p className="text-gray-500 text-sm mt-1">Pending payout: Ksh 1,200</p>
      </div>
      <div className="space-y-3">
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 flex justify-between items-center">
          <div>
            <p className="text-white font-semibold">Friday</p>
            <p className="text-gray-500 text-xs">5 deliveries</p>
          </div>
          <p className="text-white font-bold">Ksh 1,200</p>
        </div>
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 flex justify-between items-center">
          <div>
            <p className="text-white font-semibold">Thursday</p>
            <p className="text-gray-500 text-xs">3 deliveries</p>
          </div>
          <p className="text-white font-bold">Ksh 750</p>
        </div>
      </div>
    </div>
  );
}
