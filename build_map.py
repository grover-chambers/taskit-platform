import os

files = {
    "src/components/LiveMap.tsx": """"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js/Leaflet
const goldIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const riders = [
  { name: 'Kamau M.', plate: 'KBA 123J', status: 'Active', position: [-1.286389, 36.817223] }, // CBD
  { name: 'Otieno D.', plate: 'KCD 456L', status: 'Active', position: [-1.263, 36.803] }, // Westlands
  { name: 'Wanjiru A.', plate: 'KBJ 789P', status: 'Active', position: [-1.250, 36.830] }, // Near Ngara
];

const pendingOrders = [
  { id: 'TSK-905', zone: 'Eastleigh', position: [-1.278, 36.860] },
  { id: 'TSK-906', zone: 'CBD', position: [-1.290, 36.820] },
];

export default function LiveMap() {
  return (
    <MapContainer 
      center={[-1.286389, 36.817223]} // Nairobi CBD
      zoom={13} 
      style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
      attributionControl={false}
    >
      {/* CartoDB Dark Matter Tiles - Matches our Midnight theme perfectly */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {/* Active Riders */}
      {riders.map((rider) => (
        <Marker key={rider.plate} position={rider.position} icon={goldIcon}>
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-black">{rider.name}</h3>
              <p className="text-gray-600 text-xs">Plate: {rider.plate}</p>
              <p className="text-green-700 font-semibold text-xs">{rider.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Pending Orders */}
      {pendingOrders.map((order) => (
        <Marker key={order.id} position={order.position} icon={redIcon}>
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-black">Pending: {order.id}</h3>
              <p className="text-gray-600 text-xs">Zone: {order.zone}</p>
              <p className="text-red-600 font-semibold text-xs">Needs Assignment</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
""",
    "src/app/admin/page.tsx": """"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map to prevent Next.js SSR errors (Leaflet needs 'window')
const LiveMap = dynamic(() => import('@/components/LiveMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-midnight-800 rounded-2xl flex items-center justify-center text-gray-500">Loading Map...</div>
});

const MOCK_ORDERS = [
  { id: 'TSK-905', customer: 'New Customer', zone: 'Westlands', status: 'Pending', amount: 250, time: 'Just now' },
  { id: 'TSK-904', customer: 'Amina J.', zone: 'Eastleigh', status: 'Pending', amount: 300, time: '2m ago' },
  { id: 'TSK-903', customer: 'Wanjiku K.', zone: 'CBD', status: 'Rider Assigned', amount: 150, time: '10m ago' },
  { id: 'TSK-902', customer: 'Brian M.', zone: 'Ngara', status: 'In Transit', amount: 300, time: '25m ago' },
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const handleAssign = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: 'Rider Assigned' } : order
    ));
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Command Center</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Today Revenue</p>
          <p className="text-3xl font-bold text-gold-500 mt-1">Ksh 12,400</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Active Orders</p>
          <p className="text-3xl font-bold text-white mt-1">14</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <p className="text-gray-400 text-sm font-medium">Online Riders</p>
          <p className="text-3xl font-bold text-white mt-1">8</p>
        </div>
        <div className="bg-midnight-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gold-500/50 shadow-gold">
          <p className="text-gold-500 text-sm font-bold">Pending Assign</p>
          <p className="text-3xl font-bold text-gold-500 mt-1">2</p>
        </div>
      </div>

      {/* Live Map Section */}
      <div className="mb-8 bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden" style={{ height: '400px' }}>
        <LiveMap />
      </div>

      {/* Live Order Feed */}
      <h2 className="text-xl font-bold text-white mb-4">Live Order Feed</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-midnight-900/50 border-b border-midnight-700">
              <tr>
                <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Order ID</th>
                <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Customer</th>
                <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Zone</th>
                <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Amount</th>
                <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-midnight-800/50 transition-colors">
                  <td className="p-4 text-white font-mono text-sm">{order.id}</td>
                  <td className="p-4 text-white text-sm">{order.customer}</td>
                  <td className="p-4 text-gray-300 text-sm">{order.zone}</td>
                  <td className="p-4 text-white font-semibold text-sm">Ksh {order.amount}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold
                      ${order.status === 'Pending' ? 'bg-yellow-900/30 text-yellow-400' : 
                        order.status === 'Rider Assigned' ? 'bg-blue-900/30 text-blue-400' : 
                        'bg-green-900/30 text-green-400'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {order.status === 'Pending' && (
                      <button 
                        onClick={() => handleAssign(order.id)}
                        className="bg-gold-500 text-midnight-950 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gold-400 transition-colors shadow-gold"
                      >
                        Assign Rider
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"""
}

for filepath, content in files.items():
    dirpath = os.path.dirname(filepath)
    if dirpath:
        os.makedirs(dirpath, exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content.strip() + "\n")
    print(f"Created: {filepath}")

print("\nLive Map integrated into Admin Command Center!")
