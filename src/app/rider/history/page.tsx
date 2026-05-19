"use client";

export default function RiderHistory() {
  return (
    <div className="p-6 pt-4">
      <h1 className="text-2xl font-serif font-bold text-white mb-6">Delivery History</h1>
      <div className="space-y-3">
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-sm text-gray-400">TSK-901</span>
            <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded-full font-semibold">Delivered</span>
          </div>
          <p className="text-white font-semibold text-sm">CBD to Westlands</p>
          <p className="text-gray-500 text-xs mt-1">Today, 10:30 AM</p>
        </div>
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-sm text-gray-400">TSK-899</span>
            <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded-full font-semibold">Delivered</span>
          </div>
          <p className="text-white font-semibold text-sm">Eastleigh to Ngara</p>
          <p className="text-gray-500 text-xs mt-1">Yesterday, 02:15 PM</p>
        </div>
      </div>
    </div>
  );
}
