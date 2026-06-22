"use client";

import { useEffect, useState, useRef, useCallback } from 'react';

const LOCATION_PING_INTERVAL = 8000;

const STEP_FLOW = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
const STEP_LABELS: Record<string, string> = {
  ASSIGNED: 'Go to Pickup',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'On the Way',
  DELIVERED: 'Delivered',
};
const STEP_ICONS: Record<string, string> = {
  ASSIGNED: '🏪',
  PICKED_UP: '✓',
  IN_TRANSIT: '🛵',
  DELIVERED: '📦',
};

export default function RiderDashboard() {
  const [riderName, setRiderName] = useState('Rider');
  const [riderDetail, setRiderDetail] = useState<any>(null);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
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

  const updateOrderStatus = async (orderId: string, status: string, deliveryOtp?: string) => {
    setUpdating(true);
    try {
      const body: any = { orderId, status };
      if (deliveryOtp) body.deliveryOtp = deliveryOtp;
      const res = await fetch('/api/rider/stats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        await fetchData();
        setShowOtpModal(false);
        setOtpDigits(['', '', '', '']);
        setOtpError('');
      } else {
        const data = await res.json();
        if (data.error === 'Invalid OTP') {
          setOtpError('Wrong OTP. Please check with the customer.');
        }
      }
    } catch {}
    setUpdating(false);
  };

  const handleOtpSubmit = () => {
    const otp = otpDigits.join('');
    if (otp.length !== 4) return;
    if (!activeOrder) return;
    updateOrderStatus(activeOrder.id, 'DELIVERED', otp);
  };

  const setOtpDigit = (index: number, value: string) => {
    if (value.length > 1) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    setOtpError('');
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const openNavigate = (location: string) => {
    const encoded = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  const totalTrips = riderDetail?.totalTrips || 0;
  const todayEarnings = riderDetail?.todayEarnings || 0;
  const rating = riderDetail?.rating?.toFixed(1) || '5.0';
  const currentStepIdx = activeOrder ? STEP_FLOW.indexOf(activeOrder.status) : -1;

  return (
    <div className="px-6 pt-4 pb-24">
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">{riderName}</h2>
            <p className="text-gray-500 text-[9.5px]">Rider ID: #R-{riderDetail?.id?.slice(-4).toUpperCase() || '0000'}</p>
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
            <div className="text-[9px] text-gray-500 mt-0.5">Today</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-white">{totalTrips}</div>
            <div className="text-[9px] text-gray-500 mt-0.5">Trips</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-yellow-500">{rating}</div>
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
              <p className="text-white text-sm mb-2">{activeOrder.errandDescription}</p>

              {activeOrder.pickupLocation && (
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <span className="text-green-400">P</span>
                  <span className="flex-1">{activeOrder.pickupLocation}</span>
                  <button onClick={() => openNavigate(activeOrder.pickupLocation)} className="text-gold-500 font-semibold hover:underline text-[10px]">Navigate</button>
                </div>
              )}
              {activeOrder.dropoffLocation && (
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <span className="text-red-400">D</span>
                  <span className="flex-1">{activeOrder.dropoffLocation}</span>
                  <button onClick={() => openNavigate(activeOrder.dropoffLocation)} className="text-gold-500 font-semibold hover:underline text-[10px]">Navigate</button>
                </div>
              )}

              {activeOrder.customer && (
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <span>{activeOrder.customer.name}</span>
                  {activeOrder.customer.phone && (
                    <a href={`tel:${activeOrder.customer.phone}`} className="text-gold-500 hover:underline font-semibold">Call</a>
                  )}
                </div>
              )}

              {activeOrder.specialInstructions && (
                <div className="bg-midnight-900/50 rounded-lg px-3 py-2 text-xs text-gray-400 mb-2">
                  {activeOrder.specialInstructions}
                </div>
              )}

              <div className="flex items-center gap-1 my-3">
                {STEP_FLOW.map((step, i) => {
                  const isCompleted = i < currentStepIdx;
                  const isCurrent = i === currentStepIdx;
                  const isLast = i === STEP_FLOW.length - 1;
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          isCompleted ? 'bg-gold-500 text-midnight-950' :
                          isCurrent ? 'bg-midnight-900 border-2 border-gold-500 text-gold-500' :
                          'bg-midnight-700 text-gray-500'
                        }`}>
                          {isCompleted ? STEP_ICONS[step] : STEP_ICONS[step]}
                        </div>
                        <span className={`text-[8px] mt-1 font-semibold ${isCurrent ? 'text-gold-500' : isCompleted ? 'text-white' : 'text-gray-500'}`}>
                          {STEP_LABELS[step]}
                        </span>
                      </div>
                      {!isLast && (
                        <div className={`flex-1 h-0.5 mx-1 mt-[-12px] ${i < currentStepIdx ? 'bg-gold-500' : 'bg-midnight-700'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-4 pb-4">
              {activeOrder.status === 'ASSIGNED' && (
                <button
                  onClick={() => updateOrderStatus(activeOrder.id, 'PICKED_UP')}
                  disabled={updating}
                  className="w-full bg-gold-500 text-midnight-950 py-3 rounded-xl text-sm font-bold hover:bg-gold-400 transition-colors active:scale-[0.98] disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Mark as Picked Up'}
                </button>
              )}
              {activeOrder.status === 'PICKED_UP' && (
                <button
                  onClick={() => updateOrderStatus(activeOrder.id, 'IN_TRANSIT')}
                  disabled={updating}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors active:scale-[0.98] disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Mark as On the Way'}
                </button>
              )}
              {activeOrder.status === 'IN_TRANSIT' && (
                <button
                  onClick={() => { setShowOtpModal(true); setOtpDigits(['', '', '', '']); setOtpError(''); }}
                  disabled={updating}
                  className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-500 transition-colors active:scale-[0.98] disabled:opacity-50"
                >
                  Mark as Delivered
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
                    <p className="text-gray-500 text-[9.5px] mt-1">{order.zone.name}</p>
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

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowOtpModal(false)}>
          <div className="bg-midnight-900 border-t border-midnight-700 rounded-t-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-lg mb-1">Enter Delivery OTP</h3>
            <p className="text-gray-400 text-sm mb-5">Ask the customer for the 4-digit OTP sent to their phone</p>

            {otpError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                <p className="text-red-400 text-sm font-semibold">{otpError}</p>
              </div>
            )}

            <div className="flex justify-center gap-3 mb-6">
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => setOtpDigit(i, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className="w-14 h-16 bg-midnight-800 border-2 border-midnight-700 rounded-xl text-center text-white text-2xl font-bold outline-none focus:border-gold-500 transition-colors"
                />
              ))}
            </div>

            <button
              onClick={handleOtpSubmit}
              disabled={updating || otpDigits.join('').length !== 4}
              className="w-full bg-gold-500 text-midnight-950 py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-colors mb-2"
            >
              {updating ? 'Verifying...' : 'Confirm Delivery'}
            </button>
            <button
              onClick={() => { setShowOtpModal(false); setOtpDigits(['', '', '', '']); setOtpError(''); }}
              className="w-full bg-midnight-800 text-gray-300 py-3 rounded-xl font-bold text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
