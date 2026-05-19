"use client";

import { useState, useEffect } from 'react';

export default function PlatformConfig() {
  const [zones, setZones] = useState([]);
  const [tillNumber, setTillNumber] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current config (Mock for now, will connect to Prisma)
    setTillNumber('123456'); 
    setZones([
      { id: '1', name: 'Nairobi CBD', price: 150 },
      { id: '2', name: 'Westlands', price: 250 },
    ]);
    setLoading(false);
  }, []);

  const handleSaveTill = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Till Number updated to: ' + tillNumber);
  };

  if (loading) return <div className="text-gray-400">Loading config...</div>;

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Platform Configuration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* M-Pesa Config */}
        <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <h2 className="text-xl font-bold text-white mb-4">M-Pesa Settings</h2>
          <form onSubmit={handleSaveTill} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-400 block mb-2">Paybill / Till Number</label>
              <input 
                type="text" 
                value={tillNumber}
                onChange={(e) => setTillNumber(e.target.value)}
                className="w-full bg-midnight-900 border border-midnight-600 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-500"
              />
            </div>
            <button type="submit" className="bg-brand-500 text-midnight-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-400">Save</button>
          </form>
        </div>

        {/* Zones Config */}
        <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <h2 className="text-xl font-bold text-white mb-4">Zones & Pricing</h2>
          <div className="space-y-3">
            {zones.map((zone: any) => (
              <div key={zone.id} className="flex justify-between items-center bg-midnight-900 p-3 rounded-xl border border-midnight-700">
                <p className="text-white font-semibold text-sm">{zone.name}</p>
                <p className="text-brand-500 text-xs font-bold">Ksh {zone.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
