"use client";

import { useEffect, useState, useCallback } from 'react';

const DOC_LABELS: Record<string, string> = {
  ID_CARD: 'National ID',
  DRIVING_LICENSE: 'Driving License',
  GOOD_CONDUCT: 'Good Conduct',
  PASSPORT_PHOTO: 'Passport Photo',
  OTHER: 'Other ID',
};

const KYC_COLORS: Record<string, string> = {
  VERIFIED: 'bg-green-500/15 text-green-400',
  REJECTED: 'bg-red-500/15 text-red-400',
  PENDING: 'bg-yellow-500/15 text-yellow-400',
};

export default function FleetManagement() {
  const [riders, setRiders] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'kyc'>('all');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [ridersRes, kycRes] = await Promise.all([
        fetch('/api/admin/riders'),
        fetch('/api/admin/kyc'),
      ]);
      const ridersData = await ridersRes.json();
      const kycData = await kycRes.json();
      setRiders(ridersData.riders || []);
      setDocuments(kycData.documents || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleReview = async (docId: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(docId);
    try {
      const res = await fetch(`/api/admin/kyc/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setDocuments(prev =>
          prev.map(d => d.id === docId ? { ...d, status, reviewedAt: new Date() } : d)
        );
      }
    } catch {}
    setProcessingId(null);
  };

  const groupedByRider = documents.reduce((acc: any, doc: any) => {
    const riderId = doc.riderId;
    if (!acc[riderId]) {
      acc[riderId] = { rider: doc.rider, docs: [] };
    }
    acc[riderId].docs.push(doc);
    return acc;
  }, {});

  const filteredRiders = riders.filter((r: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.user?.name?.toLowerCase().includes(q) ||
      r.user?.email?.toLowerCase().includes(q) ||
      r.plateNumber?.toLowerCase().includes(q) ||
      r.licenseNumber?.toLowerCase().includes(q)
    );
  });

  const pendingKycCount = riders.filter((r: any) => r.kycStatus !== 'VERIFIED').length;

  if (loading) {
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-gray-500">Loading fleet...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Fleet & Riders</h1>
          <p className="text-gray-500 text-xs mt-0.5">{riders.length} total riders</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${activeTab === 'all' ? 'bg-gold-500/15 text-gold-500 border border-gold-500/30' : 'bg-midnight-800 text-gray-400 border border-midnight-700'}`}
        >
          All Riders
        </button>
        <button
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${activeTab === 'kyc' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' : 'bg-midnight-800 text-gray-400 border border-midnight-700'}`}
        >
          KYC Review
          {pendingKycCount > 0 && (
            <span className="ml-1.5 text-[9px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-full font-bold">{pendingKycCount}</span>
          )}
        </button>
      </div>

      {activeTab === 'all' && (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, email, plate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gold-500/50 placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-3">
            {filteredRiders.length === 0 && (
              <div className="bg-midnight-800/50 border border-midnight-700 rounded-2xl p-8 text-center text-gray-500">
                {search ? 'No riders match your search' : 'No riders found'}
              </div>
            )}
            {filteredRiders.map((rider: any) => (
              <div key={rider.id} className="bg-midnight-800/80 border border-midnight-700 rounded-2xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-midnight-700 rounded-full flex items-center justify-center text-gold-500 text-sm font-bold flex-shrink-0">
                      {rider.user?.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold text-sm truncate">{rider.user?.name || 'Unknown'}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ${KYC_COLORS[rider.kycStatus] || KYC_COLORS.PENDING}`}>
                          {rider.kycStatus || 'PENDING'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs truncate">{rider.user?.email} · {rider.user?.phone}</p>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${rider.isOnline ? 'bg-green-400' : 'bg-gray-600'}`} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <div>
                      <div className="text-[9px] text-gray-500">Trips</div>
                      <div className="text-white text-sm font-semibold">{rider.totalTrips || 0}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-500">Rating</div>
                      <div className="text-white text-sm font-semibold">⭐ {rider.rating?.toFixed(1) || '5.0'}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-500">Today Earnings</div>
                      <div className="text-gold-500 text-sm font-semibold">KSh {rider.todayEarnings || 0}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-500">Vehicle</div>
                      <div className="text-white text-sm font-semibold truncate">{rider.vehicleType || '—'} · {rider.plateNumber}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[9.5px]">
                    <span className={`px-2 py-0.5 rounded ${rider.locationEnabled ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                      📍 {rider.locationEnabled ? 'Location On' : 'Location Off'}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${rider.notificationsEnabled ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                      🔔 {rider.notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
                    </span>
                    <span className="text-gray-500">License: {rider.licenseNumber}</span>
                  </div>

                  {rider.documents && rider.documents.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-midnight-700">
                      <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1.5">Documents ({rider.documents.length})</div>
                      <div className="flex flex-wrap gap-1.5">
                        {rider.documents.map((doc: any) => (
                          <span key={doc.id} className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${doc.status === 'APPROVED' ? 'bg-green-500/15 text-green-400' : doc.status === 'REJECTED' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                            {DOC_LABELS[doc.docType] || doc.docType}: {doc.status}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'kyc' && (
        <div className="space-y-6">
          {documents.length === 0 ? (
            <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 p-8 text-gray-400 text-center">
              No pending documents to review
            </div>
          ) : (
            Object.entries(groupedByRider).map(([riderId, group]: [string, any]) => (
              <div key={riderId} className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden">
                <div className="bg-midnight-900/50 px-4 py-3 border-b border-midnight-700 flex items-center gap-3">
                  <div className="w-8 h-8 bg-midnight-700 rounded-full flex items-center justify-center text-gold-500 text-sm font-bold">
                    {group.rider?.user?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">{group.rider?.user?.name || 'Unknown'}</p>
                    <p className="text-gray-500 text-xs truncate">{group.rider?.user?.email} · {group.rider?.user?.phone}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold flex-shrink-0 ${KYC_COLORS[group.rider?.kycStatus] || KYC_COLORS.PENDING}`}>
                    {group.rider?.kycStatus || 'PENDING'}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {group.docs.map((doc: any) => (
                    <div key={doc.id} className="bg-midnight-900/40 border border-midnight-700 rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white text-sm font-semibold">{DOC_LABELS[doc.docType] || doc.docType}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${doc.status === 'APPROVED' ? 'bg-green-500/15 text-green-400' : doc.status === 'REJECTED' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                              {doc.status}
                            </span>
                          </div>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-gold-500 text-xs hover:underline">View document</a>
                        </div>
                        {doc.status === 'PENDING' && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleReview(doc.id, 'APPROVED')}
                              disabled={processingId === doc.id}
                              className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-500 disabled:opacity-50 transition-colors"
                            >
                              {processingId === doc.id ? '...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleReview(doc.id, 'REJECTED')}
                              disabled={processingId === doc.id}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500 disabled:opacity-50 transition-colors"
                            >
                              {processingId === doc.id ? '...' : 'Reject'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
