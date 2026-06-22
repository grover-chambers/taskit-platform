"use client";

import { useEffect, useState } from 'react';

export default function FleetManagement() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/kyc')
      .then(r => r.json())
      .then(data => setDocuments(data.documents || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
      acc[riderId] = {
        rider: doc.rider,
        docs: [],
      };
    }
    acc[riderId].docs.push(doc);
    return acc;
  }, {});

  const DOC_LABELS: Record<string, string> = {
    ID_CARD: 'National ID',
    DRIVING_LICENSE: 'Driving License',
    GOOD_CONDUCT: 'Good Conduct',
    PASSPORT_PHOTO: 'Passport Photo',
    OTHER: 'Other ID',
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-8">Fleet & Rider Management</h1>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-2">Fleet & Rider Management</h1>
      <p className="text-gray-400 text-sm mb-6">Review and verify rider documents</p>

      {documents.length === 0 ? (
        <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 p-8 text-gray-400 text-center">
          No pending documents to review
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByRider).map(([riderId, group]: [string, any]) => (
            <div key={riderId} className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden">
              <div className="bg-midnight-900/50 px-5 py-3 border-b border-midnight-700 flex items-center gap-3">
                <div className="w-8 h-8 bg-midnight-700 rounded-full flex items-center justify-center text-gold-500 text-sm font-bold">
                  {group.rider?.user?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{group.rider?.user?.name || 'Unknown'}</p>
                  <p className="text-gray-500 text-xs">{group.rider?.user?.email} · {group.rider?.user?.phone}</p>
                </div>
                <span className={`ml-auto text-[10px] px-2 py-1 rounded-full font-bold ${
                  group.rider?.kycStatus === 'VERIFIED' ? 'bg-green-500/15 text-green-400' :
                  group.rider?.kycStatus === 'REJECTED' ? 'bg-red-500/15 text-red-400' :
                  'bg-yellow-500/15 text-yellow-400'
                }`}>
                  {group.rider?.kycStatus || 'PENDING'}
                </span>
              </div>
              <div className="p-4 space-y-3">
                {group.docs.map((doc: any) => (
                  <div key={doc.id} className="bg-midnight-900/40 border border-midnight-700 rounded-xl p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-semibold">{DOC_LABELS[doc.docType] || doc.docType}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          doc.status === 'APPROVED' ? 'bg-green-500/15 text-green-400' :
                          doc.status === 'REJECTED' ? 'bg-red-500/15 text-red-400' :
                          'bg-yellow-500/15 text-yellow-400'
                        }`}>
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
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
