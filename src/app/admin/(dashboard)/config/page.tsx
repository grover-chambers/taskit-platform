"use client";

import { useState } from 'react';

// Mock data - in production, fetch from /api/zones and /api/config
const INITIAL_ZONES = [
  { id: '1', name: 'Nairobi CBD', price: 150, active: true },
  { id: '2', name: 'Westlands', price: 250, active: true },
  { id: '3', name: 'Eastleigh', price: 300, active: true },
  { id: '4', name: 'Ngara / Kamukunji', price: 300, active: true },
];

const INITIAL_TYPES = [
  { id: '1', name: 'Shopping', icon: '🛍️' },
  { id: '2', name: 'Bills', icon: '📄' },
  { id: '3', name: 'Documents', icon: '📁' },
  { id: '4', name: 'Groceries', icon: '🥑' },
  { id: '5', name: 'Pharmacy', icon: '💊' },
  { id: '6', name: 'Custom', icon: '✨' },
];

export default function PlatformConfig() {
  const [tillNumber, setTillNumber] = useState('123456');
  
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZonePrice, setNewZonePrice] = useState('');

  const [errandTypes, setErrandTypes] = useState(INITIAL_TYPES);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeIcon, setNewTypeIcon] = useState('');

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName || !newZonePrice) return;
    setZones([...zones, { id: Date.now().toString(), name: newZoneName, price: parseInt(newZonePrice), active: true }]);
    setNewZoneName('');
    setNewZonePrice('');
  };

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName || !newTypeIcon) return;
    setErrandTypes([...errandTypes, { id: Date.now().toString(), name: newTypeName, icon: newTypeIcon }]);
    setNewTypeName('');
    setNewTypeIcon('');
  };

  const handleSaveTill = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Till Number updated to: ' + tillNumber + ' (API integration next step)');
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Platform Configuration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* M-Pesa Settings */}
        <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <h2 className="text-xl font-bold text-white mb-4">M-Pesa Settings</h2>
          <form onSubmit={handleSaveTill} className="mb-6 flex space-x-2">
            <input 
              type="text" 
              value={tillNumber}
              onChange={(e) => setTillNumber(e.target.value)}
              placeholder="Till / Paybill Number"
              className="flex-1 bg-midnight-900 border border-midnight-600 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-500"
            />
            <button type="submit" className="bg-brand-500 text-midnight-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-400">Save</button>
          </form>
          <p className="text-xs text-gray-500">This number will be shown to customers at checkout.</p>
        </div>

        {/* Zone Management */}
        <div className="bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <h2 className="text-xl font-bold text-white mb-4">Service Zones & Pricing</h2>
          
          <form onSubmit={handleAddZone} className="mb-6 flex space-x-2">
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
            <button type="submit" className="bg-brand-500 text-midnight-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-400">Add</button>
          </form>

          <div className="space-y-3">
            {zones.map((zone) => (
              <div key={zone.id} className="flex justify-between items-center bg-midnight-900 p-3 rounded-xl border border-midnight-700">
                <div>
                  <p className="text-white font-semibold text-sm">{zone.name}</p>
                  <p className="text-brand-500 text-xs font-bold">Ksh {zone.price}</p>
                </div>
                <button onClick={() => setZones(zones.filter(z => z.id !== zone.id))} className="text-red-400 hover:text-red-300 text-xs font-semibold">Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* Errand Types Management */}
        <div className="md:col-span-2 bg-midnight-800/80 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <h2 className="text-xl font-bold text-white mb-4">Errand Categories</h2>
          
          <form onSubmit={handleAddType} className="mb-6 flex space-x-2">
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
            <button type="submit" className="bg-brand-500 text-midnight-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-400">Add</button>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {errandTypes.map((type) => (
              <div key={type.id} className="flex justify-between items-center bg-midnight-900 p-3 rounded-xl border border-midnight-700">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{type.icon}</span>
                  <p className="text-white font-semibold text-sm">{type.name}</p>
                </div>
                <button onClick={() => setErrandTypes(errandTypes.filter(t => t.id !== type.id))} className="text-red-400 hover:text-red-300 text-xs font-semibold">X</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
