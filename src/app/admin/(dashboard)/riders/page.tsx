"use client";

import { useEffect, useState, useCallback } from 'react';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254797100144';

function whatsappUrl(phone: string, name?: string) {
  const clean = phone?.replace(/[^0-9+]/g, '') || '';
  const formatted = clean.startsWith('+') ? clean.slice(1) : clean.startsWith('0') ? '254' + clean.slice(1) : clean;
  const text = name ? `&text=${encodeURIComponent(`Hi ${name}, this is TaskIt support.`)}` : '';
  return `https://wa.me/${formatted}${text}`;
}

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
                    {rider.user?.phone && (
                      <a
                        href={whatsappUrl(rider.user.phone, rider.user.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded bg-green-600/15 text-green-400 hover:bg-green-600/25 transition-colors cursor-pointer"
                      >
                        WhatsApp
                      </a>
                    )}
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
                <div className="px-4 py-3 bg-midnight-900/50 border-b border-midnight-700 flex items-center gap-3">
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
                  {group.rider?.user?.phone && (
                    <a
                      href={whatsappUrl(group.rider.user.phone, group.rider.user.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition-colors flex-shrink-0"
                      title="WhatsApp rider"
                    >
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.881 11.881 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                  )}
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
