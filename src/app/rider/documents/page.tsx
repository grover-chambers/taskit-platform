"use client";

import { useEffect, useState, useRef } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';

const DOC_TYPES = [
  { key: 'ID_CARD', label: 'National ID', icon: '🪪', desc: 'Front & back of your ID card' },
  { key: 'DRIVING_LICENSE', label: 'Driving License', icon: '🚗', desc: 'Valid driving license' },
  { key: 'GOOD_CONDUCT', label: 'Good Conduct', icon: '📋', desc: 'Certificate of good conduct' },
  { key: 'PASSPORT_PHOTO', label: 'Passport Photo', icon: '📷', desc: 'Recent passport-size photo' },
  { key: 'OTHER', label: 'Other ID', icon: '📄', desc: 'Any additional identification' },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', label: 'Under Review' },
  APPROVED: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'Approved' },
  REJECTED: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Rejected' },
};

export default function RiderDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState('PENDING');
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    Promise.all([
      fetch('/api/rider/documents').then(r => r.json()),
      fetch('/api/rider/stats').then(r => r.json()),
    ]).then(([docsData, statsData]) => {
      setDocuments(docsData.documents || []);
      setKycStatus(statsData.riderDetail?.kycStatus || 'PENDING');
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const getDocStatus = (docType: string) => {
    return documents.find(d => d.docType === docType)?.status || null;
  };

  const getDocUrl = (docType: string) => {
    return documents.find(d => d.docType === docType)?.url || null;
  };

  const handleUpload = async (docType: string, file: File) => {
    setUploading(docType);
    try {
      const result = await uploadToCloudinary(file);
      const res = await fetch('/api/rider/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docType, url: result.secure_url }),
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(prev => {
          const filtered = prev.filter(d => d.docType !== docType);
          return [...filtered, data.document];
        });
        const refreshed = await fetch('/api/rider/stats').then(r => r.json());
        setKycStatus(refreshed.riderDetail?.kycStatus || 'PENDING');
      }
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    }
    setUploading(null);
  };

  const kycBanner = () => {
    if (kycStatus === 'VERIFIED') {
      return (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <p className="text-green-400 font-bold text-sm">Fully Verified</p>
            <p className="text-green-400/70 text-xs">All documents approved</p>
          </div>
        </div>
      );
    }
    if (kycStatus === 'REJECTED') {
      return (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          </div>
          <div>
            <p className="text-red-400 font-bold text-sm">Verification Issues</p>
            <p className="text-red-400/70 text-xs">Some documents were rejected. Please re-upload.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p className="text-yellow-400 font-bold text-sm">Verification Pending</p>
          <p className="text-yellow-400/70 text-xs">Upload all required documents for approval</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-6 pt-4"><p className="text-gray-500 text-sm">Loading...</p></div>;
  }

  return (
    <div className="p-6 pt-4">
      <h1 className="text-2xl font-serif font-bold text-white mb-2">Documents</h1>
      <p className="text-gray-500 text-sm mb-5">Upload verification documents to get approved</p>

      {kycBanner()}

      <div className="space-y-3">
        {DOC_TYPES.map(dt => {
          const status = getDocStatus(dt.key);
          const docUrl = getDocUrl(dt.key);
          const style = status ? STATUS_STYLES[status] : null;
          const isUploading = uploading === dt.key;

          return (
            <div key={dt.key} className="bg-midnight-800 border border-midnight-700 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  {dt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold text-sm">{dt.label}</h3>
                    {style && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mb-2">{dt.desc}</p>

                  {docUrl && status === 'REJECTED' && (
                    <p className="text-red-400 text-[10px] mb-2">Previous upload was rejected. Please re-upload a clearer image.</p>
                  )}

                  {docUrl && status === 'APPROVED' && (
                    <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-gold-500 text-[10px] hover:underline">View uploaded document</a>
                  )}
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={el => { fileRefs.current[dt.key] = el; }}
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(dt.key, f);
                }}
              />

              <button
                onClick={() => fileRefs.current[dt.key]?.click()}
                disabled={isUploading}
                className={`w-full mt-3 py-2.5 rounded-xl text-sm font-bold transition-colors active:scale-[0.98] disabled:opacity-50 ${
                  status === 'APPROVED'
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                    : 'bg-gold-500/10 border border-gold-500/30 text-gold-500 hover:bg-gold-500/20'
                }`}
              >
                {isUploading ? 'Uploading...' :
                 status === 'APPROVED' ? 'Re-upload' :
                 'Upload'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
