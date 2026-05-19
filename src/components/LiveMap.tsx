"use client";

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
