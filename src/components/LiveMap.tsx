"use client";

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type RiderLocation = {
  riderId: string;
  lat: number;
  lng: number;
  heading: number | null;
  speedKmh: number | null;
  orderId: string | null;
  updatedAt: string;
  rider: {
    user: { id: string; name: string; phone: string };
    plateNumber: string;
  };
};

function MapUpdater({ locations }: { locations: RiderLocation[] }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(l => [Number(l.lat), Number(l.lng)]));
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
    }
  }, [locations, map]);
  return null;
}

export default function LiveMap() {
  const [locations, setLocations] = useState<RiderLocation[]>([]);
  const [pendingOrders] = useState([
    { id: 'TSK-905', zone: 'Eastleigh', position: [-1.278, 36.860] as [number, number] },
    { id: 'TSK-906', zone: 'CBD', position: [-1.290, 36.820] as [number, number] },
  ]);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch('/api/rider/location');
      const data = await res.json();
      if (data.locations) {
        setLocations(data.locations);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchLocations();
    const interval = setInterval(fetchLocations, 10000);
    return () => clearInterval(interval);
  }, [fetchLocations]);

  const fallbackRiders = [
    { riderId: 'fallback-1', lat: -1.286389, lng: 36.817223, heading: null, speedKmh: null, orderId: null, updatedAt: new Date().toISOString(), rider: { user: { id: 'f1', name: 'Kamau M.', phone: '' }, plateNumber: 'KBA 123J' } },
    { riderId: 'fallback-2', lat: -1.263, lng: 36.803, heading: null, speedKmh: null, orderId: 'demo', updatedAt: new Date().toISOString(), rider: { user: { id: 'f2', name: 'Otieno D.', phone: '' }, plateNumber: 'KCD 456L' } },
  ];

  const displayLocations = locations.length > 0 ? locations : fallbackRiders;

  return (
    <MapContainer
      center={[-1.286389, 36.817223]}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

      <MapUpdater locations={displayLocations} />

      {displayLocations.map((loc) => {
        const lat = Number(loc.lat);
        const lng = Number(loc.lng);
        const isOnJob = loc.orderId != null;
        return (
          <Marker key={loc.riderId} position={[lat, lng]} icon={isOnJob ? goldIcon : blueIcon}>
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-black">{loc.rider.user.name}</h3>
                <p className="text-gray-600 text-xs">Plate: {loc.rider.plateNumber}</p>
                <p className={`${isOnJob ? 'text-green-700' : 'text-blue-700'} font-semibold text-xs`}>
                  {isOnJob ? 'On Delivery' : 'Available'}
                </p>
                {loc.speedKmh != null && (
                  <p className="text-gray-500 text-xs">Speed: {Number(loc.speedKmh).toFixed(0)} km/h</p>
                )}
                <p className="text-gray-400 text-[10px]">
                  Updated: {Math.round((Date.now() - new Date(loc.updatedAt).getTime()) / 1000)}s ago
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}

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
