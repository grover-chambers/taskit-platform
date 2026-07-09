"use client";

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  pickupCoords: { lat: number; lng: number } | null;
  dropoffCoords: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lng: number) => void;
}

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FitBounds({ pickupCoords, dropoffCoords }: { pickupCoords: Props['pickupCoords']; dropoffCoords: Props['dropoffCoords'] }) {
  const map = useMap();
  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      const bounds = L.latLngBounds([
        [pickupCoords.lat, pickupCoords.lng],
        [dropoffCoords.lat, dropoffCoords.lng],
      ]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } else if (pickupCoords) {
      map.setView([pickupCoords.lat, pickupCoords.lng], 14);
    }
  }, [pickupCoords, dropoffCoords, map]);
  return null;
}

export default function DistanceMapPicker({ pickupCoords, dropoffCoords, onMapClick }: Props) {
  const polyline: [number, number][] = [];
  if (pickupCoords) polyline.push([pickupCoords.lat, pickupCoords.lng]);
  if (dropoffCoords) polyline.push([dropoffCoords.lat, dropoffCoords.lng]);

  return (
    <div className="w-full h-[250px] rounded-xl overflow-hidden border border-midnight-700">
      <MapContainer
        center={[-1.286389, 36.817223]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <ClickHandler onMapClick={onMapClick} />
        <FitBounds pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />

        {pickupCoords && (
          <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={pickupIcon}>
            <div className="font-sans text-xs font-bold text-green-700">Pickup</div>
          </Marker>
        )}
        {dropoffCoords && (
          <Marker position={[dropoffCoords.lat, dropoffCoords.lng]} icon={dropoffIcon}>
            <div className="font-sans text-xs font-bold text-red-700">Dropoff</div>
          </Marker>
        )}
        {polyline.length === 2 && (
          <Polyline
            positions={polyline}
            pathOptions={{ color: '#f59e0b', weight: 3, dashArray: '8 6' }}
          />
        )}
      </MapContainer>
    </div>
  );
}
