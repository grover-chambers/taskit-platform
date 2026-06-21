"use client";

import { useEffect, useState, useRef, useCallback } from 'react';

const LOCATION_PING_INTERVAL = 8000;

export default function RiderDashboard() {
  const [riderName, setRiderName] = useState('Rider');
  const [riderDetail, setRiderDetail] = useState<any>(null);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const pingRef = useRef<NodeJS.Timeout | null>(null);
  const watchRef = useRef<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/rider/stats');
      const data = await res.json();
      setRiderDetail(data.riderDetail);
      setActiveOrder(data.activeOrder);
      setAvailableOrders(data.availableOrders || []);
      setCompletedOrders(data.orders || []);
      if (data.riderDetail) {
        setIsOnline(data.riderDetail.isOnline);
      }
      if (data.riderDetail?.user?.name) {
        setRiderName(data.riderDetail.user.name);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const startLocationPing = useCallback((orderId: string | null) => {
    if (pingRef.current) clearInterval(pingRef.current);
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);

    if (!navigator.geolocation) return;

    const sendPing = async (lat: number, lng: number, heading?: number, speed?: number, accuracy?: number) => {
      try {
        await fetch('/api/rider/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lng, heading, speedKmh: speed, accuracyM: accuracy, orderId }),
        });
      } catch {}
    };

    navigator.geolocation.getCurrentPosition((pos) => {
      sendPing(pos.coords.latitude, pos.coords.longitude, pos.coords.heading ?? undefined, pos.coords.speed ? pos.coords.speed * 3.6 : undefined, pos.coords.accuracy);
    });

    watchRef.current = navigator.geolocation.watchPosition((pos) => {
      sendPing(pos.coords.latitude, pos.coords.longitude, pos.coords.heading ?? undefined, pos.coords.speed ? pos.coords.speed * 3.6 : undefined, pos.coords.accuracy);
    });

    if (orderId) {
      pingRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          sendPing(pos.coords.latitude, pos.coords.longitude, pos.coords.heading ?? undefined, pos.coords.speed ? pos.coords.speed * 3.6 : undefined, pos.coords.accuracy);
        });
      }, LOCATION_PING_INTERVAL);
    }
  }, []);

  useEffect(() => {
    if (activeOrder && isOnline) {
      startLocationPing(activeOrder.id);
    } else {
      if (pingRef.current) clearInterval(pingRef.current);
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    }
    return () => {
      if (pingRef.current) clearInterval(pingRef.current);
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    };
  }, [activeOrder, isOnline, startLocationPing]);

  const toggleOnline = async () => {
    const newOnline = !isOnline;
    setIsOnline(newOnline);
    try {
      await fetch('/api/rider/stats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline: newOnline }),
      });
    } catch {}
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/rider/stats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch {}
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  const riderId = riderDetail?.id?.slice(-4).toUpperCase() || '0000';
  const totalTrips = riderDetail?.totalTrips || 0;
  const todayEarnings = riderDetail?.todayEarnings || 0;
  const rating = riderDetail?.rating?.toFixed(1) || '5.0';

  return (
    <div className="px-6 pt-4 pb-24">
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">{riderName}</h2>
            <p className="text-gray-500 text-[9.5px]">Rider ID: #R-{riderId}</p>
          </div>
          {isOnline && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gold-500">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" style={{ animation: 'blink 1.4s ease-in-out infinite' }} />
              Online
            </div>
          )}
        </div>
      </div>

      <button
        onClick={toggleOnline}
        className={`w-full p-5 rounded-2xl border-2 flex justify-between items-center transition-all mb-5 ${
          isOnline ? 'bg-gold-500/10 border-gold-500' : 'bg-midnight-800 border-midnight-700'
        }`}
      >
        <div>
          <h3 className={`font-bold text-base ${isOnline ? 'text-gold-500' : 'text-white'}`}>
            {isOnline ? 'You are Online' : 'You are Offline'}
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">
            {isOnline ? 'Waiting for nearby errands...' : 'Go online to receive tasks'}
          </p>
        </div>
        <div className={`w-12 h-7 rounded-full relative transition-colors flex-shrink-0 ${isOnline ? 'bg-gold-500' : 'bg-midnight-600'}`}>
          <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 shadow transition-all ${isOnline ? 'right-0.5' : 'left-0.5'}`} />
        </div>
      </button>

      {isOnline && (
        <div className="bg-gradient-to-r from-midnight-900/80 to-midnight-950/80 border border-midnight-700 rounded-2xl p-4 flex justify-around mb-5">
          <div className="text-center">
            <div className="font-bold text-lg text-gold-500">KSh {todayEarnings.toLocaleString()}</div>
            <div className="text-[9px] text-gray-500 mt-0.5">Today's earnings</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-white">{totalTrips}</div>
            <div className="text-[9px] text-gray-500 mt-0.5">Trips done</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-yellow-500">⭐ {rating}</div>
            <div className="text-[9px] text-gray-500 mt-0.5">Rating</div>
          </div>
        </div>
      )}

      {isOnline && activeOrder && (
        <div className="mb-5">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-3">Active Job</p>
          <div className="bg-midnight-800 border border-blue-500/30 rounded-2xl overflow-hidden">
            <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2.5 flex justify-between items-center">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                #{activeOrder.id.slice(-7).toUpperCase()}
              </span>
              <span className="font-bold text-base text-blue-400">
                KSh {activeOrder.totalAmount || activeOrder.zone?.price || '—'}
              </span>
            </div>
            <div className="px-4 py-3">
              <p className="text-white text-sm mb-3">{activeOrder.errandDescription}</p>
              {activeOrder.customer && (
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <span>👤 {activeOrder.customer.name}</span>
                  {activeOrder.customer.phone && (
                    <a href={`tel:${activeOrder.customer.phone}`} className="text-gold-500 hover:underline">Call</a>
                  )}
                </div>
              )}
              {activeOrder.shop && (
                <div className="text-xs text-gray-400 mb-3">🏪 Pickup: {activeOrder.shop.name} {activeOrder.shop.location ? `— ${activeOrder.shop.location}` : ''}</div>
              )}
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full font-bold ${
                  activeOrder.status === 'ASSIGNED' ? 'bg-orange-500/15 text-orange-400' :
                  activeOrder.status === 'PICKED_UP' ? 'bg-blue-500/15 text-blue-400' :
                  'bg-gold-500/15 text-gold-500'
                }`}>
                  {activeOrder.status === 'ASSIGNED' ? '→ Go to Pickup' :
                   activeOrder.status === 'PICKED_UP' ? '→ Heading to Customer' :
                   activeOrder.status === 'IN_TRANSIT' ? '→ Almost There' :
                   activeOrder.status}
                </span>
              </div>
            </div>
            <div className="px-4 pb-4">
              {activeOrder.status === 'ASSIGNED' && (
                <button
                  onClick={() => updateOrderStatus(activeOrder.id, 'PICKED_UP')}
                  disabled={updating}
                  className="w-full bg-gold-500 text-midnight-950 py-3 rounded-xl text-sm font-bold hover:bg-gold-400 transition-colors active:scale-[0.98] disabled:opacity-50"
                >
                  {updating ? 'Updating...' : '✓ Mark as Picked Up'}
                </button>
              )}
              {activeOrder.status === 'PICKED_UP' && (
                <button
                  onClick={() => updateOrderStatus(activeOrder.id, 'IN_TRANSIT')}
                  disabled={updating}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors active:scale-[0.98] disabled:opacity-50"
                >
                  {updating ? 'Updating...' : '🛵 Mark as On the Way'}
                </button>
              )}
              {activeOrder.status === 'IN_TRANSIT' && (
                <button
                  onClick={() => updateOrderStatus(activeOrder.id, 'DELIVERED')}
                  disabled={updating}
                  className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-500 transition-colors active:scale-[0.98] disabled:opacity-50"
                >
                  {updating ? 'Updating...' : '📦 Mark as Delivered'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isOnline && !activeOrder && availableOrders.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-3">
            Available Jobs ({availableOrders.length})
          </p>
          <div className="space-y-3">
            {availableOrders.map((order) => (
              <div key={order.id} className="bg-midnight-800 border border-midnight-700 rounded-2xl overflow-hidden">
                <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-2.5 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Errand</span>
                  <span className="font-bold text-base text-orange-400">KSh {order.totalAmount || order.zone?.price || '—'}</span>
                </div>
                <div className="px-4 py-3">
                  <p className="text-white text-sm">{order.errandDescription}</p>
                  {order.zone && (
                    <p className="text-gray-500 text-[9.5px] mt-1">📍 {order.zone.name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOnline && !activeOrder && availableOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🛵</div>
          <h3 className="text-white font-bold text-lg mb-1">Waiting for Jobs</h3>
          <p className="text-gray-400 text-sm">New errands will appear here when assigned</p>
        </div>
      )}

      {!isOnline && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">💤</div>
          <h3 className="text-white font-bold text-lg mb-1">You're Offline</h3>
          <p className="text-gray-400 text-sm">Go online to start receiving delivery jobs</p>
        </div>
      )}

      <style>{`
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
