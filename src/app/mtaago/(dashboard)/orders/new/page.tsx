"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEnterprise } from '../../EnterpriseContext';
import { haversineKm } from '@/lib/distance';

const DistanceMapPicker = dynamic(() => import('../../../../../components/DistanceMapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[250px] bg-midnight-800 border border-midnight-700 rounded-xl flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-haraka-500/30 border-t-haraka-500 rounded-full animate-spin" />
    </div>
  ),
});

interface Zone {
  id: string;
  name: string;
  price: number;
}

interface RecentRecipient {
  name: string;
  phone: string;
  dropoff: string;
}

export default function MtaaGoNewOrderPage() {
  const router = useRouter();
  const { subRole, pricing, loading: roleLoading } = useEnterprise();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [errandDescription, setErrandDescription] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [urgency, setUrgency] = useState('NORMAL');
  const [zoneId, setZoneId] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [recentRecipients, setRecentRecipients] = useState<RecentRecipient[]>([]);

  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapStep, setMapStep] = useState<'pickup' | 'dropoff'>('pickup');

  const isDistanceMode = pricing?.pricingModel === 'DISTANCE';

  useEffect(() => {
    async function fetchInitial() {
      try {
        const [zonesRes, ordersRes] = await Promise.all([
          fetch('/api/zones'),
          fetch('/api/enterprise/orders?status=DELIVERED&limit=10'),
        ]);
        if (zonesRes.ok) {
          const data = await zonesRes.json();
          setZones(data.zones || []);
        }
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          const orders = data.orders || [];
          const seen = new Set<string>();
          const recipients: RecentRecipient[] = [];
          for (const o of orders) {
            const key = o.contactPhone || o.dropoffLocation;
            if (key && !seen.has(key)) {
              seen.add(key);
              recipients.push({
                name: o.customer?.name || '',
                phone: o.contactPhone || '',
                dropoff: o.dropoffLocation || '',
              });
            }
            if (recipients.length >= 5) break;
          }
          setRecentRecipients(recipients);
        }
      } catch {}
      setLoading(false);
    }
    fetchInitial();
  }, []);

  const selectedZone = zones.find(z => z.id === zoneId);

  const getWeightSurcharge = (w: number) => {
    if (w <= 0) return 0;
    if (w > 100) return 0;
    if (w > 50) return 500;
    if (w > 20) return 250;
    if (w > 5) return 100;
    return 0;
  };

  const weightNum = weightKg ? parseFloat(weightKg) : 0;
  const surcharge = getWeightSurcharge(weightNum);

  const distanceKm = (pickupCoords && dropoffCoords)
    ? Math.round(haversineKm(pickupCoords.lat, pickupCoords.lng, dropoffCoords.lat, dropoffCoords.lng) * 100) / 100
    : null;

  const distancePrice = (distanceKm != null && pricing?.pricePerKm)
    ? (pricing.baseFare || 0) + Math.ceil(distanceKm * pricing.pricePerKm) + surcharge
    : null;

  const totalPrice = isDistanceMode
    ? (distancePrice != null ? Math.max(distancePrice, pricing?.minimumFare || 0) : 0)
    : (selectedZone?.price || 0) + surcharge;

  const canSubmit = isDistanceMode
    ? (pickupCoords && dropoffCoords && distanceKm != null && pricing?.pricePerKm)
    : !!zoneId;

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (mapStep === 'pickup') {
      setPickupCoords({ lat, lng });
      setMapStep('dropoff');
    } else {
      setDropoffCoords({ lat, lng });
      setMapStep('pickup');
    }
  }, [mapStep]);

  const clearMapPoints = () => {
    setPickupCoords(null);
    setDropoffCoords(null);
    setMapStep('pickup');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const body: Record<string, unknown> = {
        errandDescription,
        pickupLocation,
        dropoffLocation,
        contactPhone,
        specialInstructions: specialInstructions || undefined,
        urgency,
        weightKg: weightKg || undefined,
      };

      if (isDistanceMode) {
        if (pickupCoords) {
          body.pickupLat = pickupCoords.lat;
          body.pickupLng = pickupCoords.lng;
        }
        if (dropoffCoords) {
          body.dropoffLat = dropoffCoords.lat;
          body.dropoffLng = dropoffCoords.lng;
        }
      } else {
        body.zoneId = zoneId;
      }

      const res = await fetch('/api/enterprise/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/mtaago'), 1500);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create order');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  const fillRecipient = (r: RecentRecipient) => {
    if (r.phone) setContactPhone(r.phone);
    if (r.dropoff) setDropoffLocation(r.dropoff);
  };

  if (roleLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-haraka-500/30 border-t-haraka-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-xs">Loading...</p>
        </div>
      </div>
    );
  }

  if (subRole !== 'OPERATOR') {
    return (
      <div className="px-6 pt-6 pb-24 text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h3 className="text-white font-bold text-base mb-1">Operators Only</h3>
        <p className="text-gray-400 text-sm">Only operators can create new orders</p>
        <Link href="/mtaago" className="text-haraka-500/15 border border-haraka-500/30 text-haraka-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-haraka-500/25 transition-colors">Back to Overview</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-haraka-500 text-4xl mb-3">✓</div>
          <h2 className="text-white font-bold text-lg mb-1">Order Created</h2>
          <p className="text-gray-400 text-sm">Status: PRICED — awaiting payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-4 pb-24">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/mtaago" className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h1 className="text-white font-bold text-lg">New Delivery</h1>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">PRICED</span>
        {isDistanceMode && (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30">DISTANCE</span>
        )}
      </div>

      {recentRecipients.length > 0 && (
        <div className="mb-4">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-2">Quick Fill</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recentRecipients.map((r, i) => (
              <button
                key={i}
                onClick={() => fillRecipient(r)}
                className="bg-midnight-800 border border-midnight-700 rounded-lg px-3 py-2 text-left hover:border-haraka-500/50 transition-colors flex-shrink-0"
              >
                <p className="text-white text-xs font-semibold truncate max-w-[120px]">{r.name || r.phone}</p>
                <p className="text-gray-500 text-[9px] truncate max-w-[120px]">{r.dropoff}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Errand Description</label>
          <textarea
            value={errandDescription}
            onChange={e => setErrandDescription(e.target.value)}
            rows={3}
            required
            className="w-full bg-midnight-800 border border-midnight-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-haraka-500 transition-colors resize-none"
            placeholder="e.g. Deliver documents to Westlands office"
          />
        </div>

        <div>
          <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Pickup Location</label>
          <input
            type="text"
            value={pickupLocation}
            onChange={e => setPickupLocation(e.target.value)}
            required
            className="w-full bg-midnight-800 border border-midnight-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-haraka-500 transition-colors"
            placeholder="e.g. CBD, Kencom House"
          />
        </div>

        <div>
          <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Dropoff Location</label>
          <input
            type="text"
            value={dropoffLocation}
            onChange={e => setDropoffLocation(e.target.value)}
            required
            className="w-full bg-midnight-800 border border-midnight-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-haraka-500 transition-colors"
            placeholder="e.g. Westlands, Waiyaki Way"
          />
        </div>

        <div>
          <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Contact Phone</label>
          <input
            type="tel"
            value={contactPhone}
            onChange={e => setContactPhone(e.target.value)}
            required
            className="w-full bg-midnight-800 border border-midnight-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-haraka-500 transition-colors"
            placeholder="e.g. 0712345678"
          />
        </div>

        <div>
          <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Special Instructions (optional)</label>
          <textarea
            value={specialInstructions}
            onChange={e => setSpecialInstructions(e.target.value)}
            rows={2}
            className="w-full bg-midnight-800 border border-midnight-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-haraka-500 transition-colors resize-none"
            placeholder="e.g. Call recipient before delivery"
          />
        </div>

        <div>
          <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Urgency</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setUrgency('NORMAL')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                urgency === 'NORMAL'
                  ? 'bg-midnight-700 border-2 border-haraka-500 text-haraka-500'
                  : 'bg-midnight-800 border border-midnight-700 text-gray-400'
              }`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setUrgency('URGENT')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                urgency === 'URGENT'
                  ? 'bg-orange-500/15 border-2 border-orange-400 text-orange-400'
                  : 'bg-midnight-800 border border-midnight-700 text-gray-400'
              }`}
            >
              Urgent
            </button>
          </div>
        </div>

        {isDistanceMode ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Set Route on Map</label>
              {(pickupCoords || dropoffCoords) && (
                <button type="button" onClick={clearMapPoints} className="text-red-400 text-[9px] font-bold hover:text-red-300">Clear</button>
              )}
            </div>
            <p className="text-gray-400 text-[10px]">
              {mapStep === 'pickup' && !pickupCoords && 'Tap map to set PICKUP point'}
              {mapStep === 'pickup' && pickupCoords && !dropoffCoords && 'Tap map to set DROPOFF point'}
              {dropoffCoords && 'Both points set — tap to reset'}
            </p>
            <DistanceMapPicker
              pickupCoords={pickupCoords}
              dropoffCoords={dropoffCoords}
              onMapClick={handleMapClick}
            />
            {pickupCoords && (
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-gray-400">Pickup: {pickupCoords.lat.toFixed(5)}, {pickupCoords.lng.toFixed(5)}</span>
              </div>
            )}
            {dropoffCoords && (
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-gray-400">Dropoff: {dropoffCoords.lat.toFixed(5)}, {dropoffCoords.lng.toFixed(5)}</span>
              </div>
            )}
            {distanceKm != null && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-400 text-xs font-bold">Distance: {distanceKm} km</p>
                {pricing?.pricePerKm && (
                  <p className="text-gray-500 text-[10px] mt-0.5">
                    KSh {pricing.pricePerKm}/km × {distanceKm} km = KSh {Math.ceil(distanceKm * pricing.pricePerKm)}
                    {pricing.baseFare ? ` + KSh ${pricing.baseFare} base` : ''}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Zone</label>
            <select
              value={zoneId}
              onChange={e => setZoneId(e.target.value)}
              required
              className="w-full bg-midnight-800 border border-midnight-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-haraka-500 transition-colors appearance-none"
            >
              <option value="" disabled>Select a zone</option>
              {zones.map(z => (
                <option key={z.id} value={z.id} className="bg-midnight-900">
                  {z.name} — KSh {z.price}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Weight (kg) — optional</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={weightKg}
            onChange={e => setWeightKg(e.target.value)}
            className="w-full bg-midnight-800 border border-midnight-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-haraka-500 transition-colors"
            placeholder="e.g. 25"
          />
          {weightNum > 5 && (
            <p className="text-yellow-400 text-[10px] mt-1">+KSh {surcharge} weight surcharge ({weightNum > 100 ? 'custom quote' : `${weightNum}kg`})</p>
          )}
        </div>

        {((isDistanceMode && distanceKm != null) || (!isDistanceMode && selectedZone)) && (
          <div className="bg-midnight-800 border border-haraka-500/30 rounded-xl p-4 text-center">
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">Delivery Price</p>
            <p className="text-haraka-500 font-bold text-xl">KSh {totalPrice}</p>
            {isDistanceMode && distanceKm != null && pricing?.pricePerKm && (
              <p className="text-[10px] text-gray-500 mt-1">
                Base KSh {pricing.baseFare || 0} + ({distanceKm}km × KSh {pricing.pricePerKm}/km) {surcharge > 0 ? `+ Weight KSh ${surcharge}` : ''}
              </p>
            )}
            {!isDistanceMode && selectedZone && (
              <p className="text-[10px] text-gray-500 mt-1">
                Zone KSh {selectedZone.price} {surcharge > 0 ? `+ Weight KSh ${surcharge}` : ''}
              </p>
            )}
            <p className="text-[10px] text-gray-500 mt-1">Order created at PRICED — confirm payment next</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-red-400 text-sm font-semibold">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !canSubmit}
          className="w-full bg-haraka-500 text-midnight-950 py-3.5 rounded-xl font-bold text-sm hover:bg-haraka-400 transition-colors active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Order (PRICED)'}
        </button>

        <p className="text-center text-gray-500 text-[10px]">
          Order created as PRICED — confirm payment on dashboard
        </p>
      </form>
    </div>
  );
}
