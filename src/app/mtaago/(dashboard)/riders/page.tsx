"use client";

import { useEffect, useState, useCallback } from 'react';
import { useEnterprise } from '../EnterpriseContext';

interface Rider {
  id: string;
  name: string;
  plateNumber: string;
  rating: number;
  totalTrips: number;
  todayEarnings: number;
  currentOrder: {
    errandDescription: string;
    status: string;
  } | null;
  kycStatus: string;
}

interface RidersData {
  online: Rider[];
  offline: Rider[];
}

const STATUS_COLORS: Record<string, string> = {
  PRICED: 'bg-yellow-500/15 text-yellow-400',
  PAID: 'bg-blue-500/15 text-blue-400',
  PACKED: 'bg-teal-500/15 text-teal-400',
  AWAITING_RIDER: 'bg-orange-500/15 text-orange-400',
  RECEIVED: 'bg-gray-500/15 text-gray-400',
  ACCEPTED: 'bg-haraka-500/15 text-haraka-400',
  ASSIGNED: 'bg-purple-500/15 text-purple-400',
  PICKED_UP: 'bg-blue-500/15 text-blue-400',
  IN_TRANSIT: 'bg-haraka-500/15 text-haraka-500',
  DELIVERED: 'bg-green-500/15 text-green-400',
  CANCELLED: 'bg-red-500/15 text-red-400',
};

const KYC_COLORS: Record<string, string> = {
  VERIFIED: 'bg-green-500/15 text-green-400',
  PENDING: 'bg-amber-500/15 text-amber-400',
  REJECTED: 'bg-red-500/15 text-red-400',
  NOT_SUBMITTED: 'bg-gray-500/15 text-gray-400',
};

export default function MtaagoRidersPage() {
  const { subRole } = useEnterprise();
  const [riders, setRiders] = useState<RidersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOffline, setShowOffline] = useState(false);

  const fetchRiders = useCallback(async () => {
    try {
      const res = await fetch('/api/vendor/riders');
      if (res.ok) {
        const data = await res.json();
        setRiders(data);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRiders();
    const interval = setInterval(fetchRiders, 15000);
    return () => clearInterval(interval);
  }, [fetchRiders]);

  if (loading) {
    return (
      <div className="px-6 pt-6 pb-24">
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 border-2 border-haraka-500/30 border-t-haraka-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!riders) {
    return (
      <div className="px-6 pt-6 pb-24">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500 text-sm">Unable to load riders</p>
        </div>
      </div>
    );
  }

  const isOperator = subRole === 'OPERATOR';
  const availableOnline = riders.online.filter(r => !r.currentOrder);

  return (
    <div className="px-6 pt-6 pb-24">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-white font-bold text-lg">Rider Board</h1>
        <div className="flex items-center gap-2">
          <span className="bg-green-500/15 text-green-400 text-[9px] font-bold px-2 py-0.5 rounded-md">{availableOnline.length} available</span>
          <span className="bg-midnight-800 text-gray-400 text-[9px] font-bold px-2 py-0.5 rounded-md">{riders.online.length} online</span>
        </div>
      </div>

      {riders.online.length === 0 && riders.offline.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🛵</div>
          <h3 className="text-white font-bold text-base mb-1">No Riders</h3>
          <p className="text-gray-400 text-sm">Riders will appear here when they join</p>
        </div>
      )}

      {riders.online.length > 0 && (
        <div className="mb-6">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-3">Online ({riders.online.length})</p>
          <div className="space-y-3">
            {riders.online.map(rider => {
              const isBusy = !!rider.currentOrder;
              return (
                <div key={rider.id} className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${isBusy ? 'bg-amber-400' : 'bg-green-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold">{rider.name}</p>
                      <p className="text-gray-400 text-xs">{rider.plateNumber} · ⭐ {rider.rating.toFixed(1)} · {rider.totalTrips} trips · KSh {rider.todayEarnings} today</p>
                      {isBusy ? (
                        <div className="mt-2 flex items-center gap-2">
                          <p className="text-gray-300 text-xs truncate flex-1">{rider.currentOrder!.errandDescription}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${STATUS_COLORS[rider.currentOrder!.status] || 'bg-gray-500/15 text-gray-400'}`}>
                            {rider.currentOrder!.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-500/15 text-green-400">Available</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {riders.offline.length > 0 && (
        <div>
          <button
            onClick={() => setShowOffline(!showOffline)}
            className="text-gray-400 text-xs font-semibold mb-3 hover:text-gray-300 transition-colors"
          >
            {showOffline ? 'Hide' : 'Show'} offline riders ({riders.offline.length})
          </button>
          {showOffline && (
            <div className="space-y-3">
              {riders.offline.map(rider => (
                <div key={rider.id} className="bg-midnight-800 border border-midnight-700 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300 text-sm font-semibold">{rider.name}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${KYC_COLORS[rider.kycStatus] || 'bg-gray-500/15 text-gray-400'}`}>
                          {rider.kycStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">{rider.plateNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
