"use client";

import { useEffect, useState, useCallback } from 'react';

export default function PlatformConfig() {
  const [tillNumber, setTillNumber] = useState('');
  const [zones, setZones] = useState<any[]>([]);
  const [errandTypes, setErrandTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZonePrice, setNewZonePrice] = useState('');
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeIcon, setNewTypeIcon] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [zonesRes, typesRes] = await Promise.all([
        fetch('/api/zones'),
        fetch('/api/errand-types'),
      ]);
      if (zonesRes.ok) {
        const zonesData = await zonesRes.json();
        setZones(zonesData.zones || zonesData || []);
      }
      if (typesRes.ok) {
        const typesData = await typesRes.json();
        setErrandTypes(typesData.errandTypes || typesData || []);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName || !newZonePrice) return;
    setSaving('zone');
    try {
      const res = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newZoneName, price: parseInt(newZonePrice) }),
      });
      if (res.ok) {
        const zone = await res.json();
        setZones(prev => [...prev, zone.zone || zone]);
        setNewZoneName('');
        setNewZonePrice('');
      }
    } catch {}
    setSaving(null);
  };

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName || !newTypeIcon) return;
    setSaving('type');
    try {
      const res = await fetch('/api/errand-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTypeName, icon: newTypeIcon }),
      });
      if (res.ok) {
        const et = await res.json();
        setErrandTypes(prev => [...prev, et.errandType || et]);
        setNewTypeName('');
        setNewTypeIcon('');
      }
    } catch {}
    setSaving(null);
  };

  const handleToggleZone = async (zoneId: string, active: boolean) => {
    setSaving(zoneId);
    try {
      await fetch(`/api/zones/${zoneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      });
      setZones(prev => prev.map(z => z.id === zoneId ? { ...z, active: !active } : z));
    } catch {}
    setSaving(null);
  };

  const handleToggleType = async (typeId: string, active: boolean) => {
    setSaving(typeId);
    try {
      await fetch(`/api/errand-types/${typeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      });
      setErrandTypes(prev => prev.map(t => t.id === typeId ? { ...t, active: !active } : t));
    } catch {}
    setSaving(null);
  };

  const handleSaveTill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving('till');
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'mpesa_till_number', value: tillNumber }),
      });
    } catch {}
    setSaving(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-gray-500">Loading config...</p></div>;
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-white mb-6">Platform Configuration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-midnight-800/80 p-4 md:p-6 rounded-2xl border border-midnight-700">
          <h2 className="text-base font-bold text-white mb-4">M-Pesa Settings</h2>
          <form onSubmit={handleSaveTill} className="mb-4 flex gap-2">
            <input
              type="text"
              value={tillNumber}
              onChange={(e) => setTillNumber(e.target.value)}
              placeholder="Till / Paybill Number"
              className="flex-1 bg-midnight-900 border border-midnight-600 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-500"
            />
            <button type="submit" disabled={saving === 'till'} className="bg-brand-500 text-midnight-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-400 disabled:opacity-50">
              {saving === 'till' ? '...' : 'Save'}
            </button>
          </form>
          <p className="text-xs text-gray-500">This number will be shown to customers at checkout.</p>
        </div>

        <div className="bg-midnight-800/80 p-4 md:p-6 rounded-2xl border border-midnight-700">
          <h2 className="text-base font-bold text-white mb-4">Service Zones & Pricing</h2>

          <form onSubmit={handleAddZone} className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Zone Name"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              className="flex-1 bg-midnight-900 border border-midnight-600 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-500"
            />
            <input
              type="number"
              placeholder="Ksh Price"
              value={newZonePrice}
              onChange={(e) => setNewZonePrice(e.target.value)}
              className="w-24 bg-midnight-900 border border-midnight-600 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-500"
            />
            <button type="submit" disabled={saving === 'zone'} className="bg-brand-500 text-midnight-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-400 disabled:opacity-50">
              {saving === 'zone' ? '...' : 'Add'}
            </button>
          </form>

          <div className="space-y-2">
            {zones.map((zone) => (
              <div key={zone.id} className="flex justify-between items-center bg-midnight-900 p-3 rounded-xl border border-midnight-700">
                <div>
                  <p className="text-white font-semibold text-sm">{zone.name}</p>
                  <p className="text-brand-500 text-xs font-bold">Ksh {zone.price}</p>
                </div>
                <button
                  onClick={() => handleToggleZone(zone.id, zone.active)}
                  disabled={saving === zone.id}
                  className={`text-xs font-semibold px-2 py-1 rounded transition-colors disabled:opacity-50 ${zone.active ? 'text-green-400 hover:text-red-400' : 'text-red-400 hover:text-green-400'}`}
                >
                  {zone.active ? 'Active' : 'Inactive'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-midnight-800/80 p-4 md:p-6 rounded-2xl border border-midnight-700">
          <h2 className="text-base font-bold text-white mb-4">Errand Categories</h2>

          <form onSubmit={handleAddType} className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Emoji Icon"
              value={newTypeIcon}
              onChange={(e) => setNewTypeIcon(e.target.value)}
              className="w-20 bg-midnight-900 border border-midnight-600 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-500 text-center"
            />
            <input
              type="text"
              placeholder="Category Name"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="flex-1 bg-midnight-900 border border-midnight-600 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-500"
            />
            <button type="submit" disabled={saving === 'type'} className="bg-brand-500 text-midnight-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-400 disabled:opacity-50">
              {saving === 'type' ? '...' : 'Add'}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {errandTypes.map((type) => (
              <div key={type.id} className="flex justify-between items-center bg-midnight-900 p-3 rounded-xl border border-midnight-700">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{type.icon}</span>
                  <p className="text-white font-semibold text-sm">{type.name}</p>
                </div>
                <button
                  onClick={() => handleToggleType(type.id, type.active)}
                  disabled={saving === type.id}
                  className={`text-xs font-semibold px-2 py-1 rounded transition-colors disabled:opacity-50 ${type.active ? 'text-green-400 hover:text-red-400' : 'text-red-400 hover:text-green-400'}`}
                >
                  {type.active ? 'Active' : 'Inactive'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
