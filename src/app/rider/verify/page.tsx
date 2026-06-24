"use client";

import { useEffect, useState, useRef } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface DocConfig {
  key: string;
  label: string;
  icon: string;
  desc: string;
  needsNumber: boolean;
  numberLabel: string;
  numberPlaceholder: string;
  hasExpiry: boolean;
  required: boolean;
  alternativeTo?: string;
}

const DOC_GROUPS: { title: string; desc: string; required: boolean; docs: DocConfig[] }[] = [
  {
    title: 'National ID',
    desc: 'Required — no alternative. Upload front and back.',
    required: true,
    docs: [
      { key: 'ID_FRONT', label: 'ID Front', icon: '🪪', desc: 'Front of your National ID', needsNumber: true, numberLabel: 'ID Number', numberPlaceholder: 'e.g. 12345678', hasExpiry: false, required: true },
      { key: 'ID_BACK', label: 'ID Back', icon: '🪪', desc: 'Back of your National ID', needsNumber: false, numberLabel: '', numberPlaceholder: '', hasExpiry: false, required: true },
    ],
  },
  {
    title: 'Driving License',
    desc: 'Upload your DL, or a Guarantor\'s ID as alternative.',
    required: true,
    docs: [
      { key: 'DRIVING_LICENSE', label: 'Driving License', icon: '🚗', desc: 'Valid driving license', needsNumber: true, numberLabel: 'DL Number', numberPlaceholder: 'e.g. DL-123456', hasExpiry: true, required: false },
      { key: 'GUARANTOR_ID_FRONT', label: 'Guarantor ID Front', icon: '📄', desc: 'Front of guarantor\'s National ID', needsNumber: true, numberLabel: 'Guarantor ID Number', numberPlaceholder: 'e.g. 87654321', hasExpiry: false, required: false, alternativeTo: 'DRIVING_LICENSE' },
      { key: 'GUARANTOR_ID_BACK', label: 'Guarantor ID Back', icon: '📄', desc: 'Back of guarantor\'s National ID', needsNumber: false, numberLabel: '', numberPlaceholder: '', hasExpiry: false, required: false, alternativeTo: 'DRIVING_LICENSE' },
    ],
  },
  {
    title: 'Good Conduct',
    desc: 'Certificate of Good Conduct, or Insurance Policy as alternative.',
    required: true,
    docs: [
      { key: 'GOOD_CONDUCT', label: 'Good Conduct', icon: '📋', desc: 'Certificate of good conduct', needsNumber: true, numberLabel: 'Certificate Number', numberPlaceholder: 'e.g. GCP-123456', hasExpiry: true, required: false },
      { key: 'INSURANCE_POLICY', label: 'Insurance Policy', icon: '🛡️', desc: 'Valid insurance policy document', needsNumber: true, numberLabel: 'Policy Number', numberPlaceholder: 'e.g. INS-987654', hasExpiry: true, required: false, alternativeTo: 'GOOD_CONDUCT' },
    ],
  },
  {
    title: 'Passport Photo',
    desc: 'Required — no alternative.',
    required: true,
    docs: [
      { key: 'PASSPORT_PHOTO', label: 'Passport Photo', icon: '📷', desc: 'Recent passport-size photo', needsNumber: false, numberLabel: '', numberPlaceholder: '', hasExpiry: false, required: true },
    ],
  },
];

const ALL_DOC_CONFIGS = DOC_GROUPS.flatMap(g => g.docs);

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', label: 'Under Review' },
  APPROVED: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'Approved' },
  REJECTED: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Rejected' },
};

export default function RiderVerify() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState('PENDING');
  const [plateNumber, setPlateNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [docNumbers, setDocNumbers] = useState<Record<string, string>>({});
  const [docExpiry, setDocExpiry] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    Promise.all([
      fetch('/api/rider/documents').then(r => r.json()),
      fetch('/api/rider/stats').then(r => r.json()),
    ]).then(([docsData, statsData]) => {
      const docs = docsData.documents || [];
      setDocuments(docs);
      setKycStatus(statsData.riderDetail?.kycStatus || 'PENDING');
      setPlateNumber(statsData.riderDetail?.plateNumber || '');
      setLicenseNumber(statsData.riderDetail?.licenseNumber || '');
      setVehicleType(statsData.riderDetail?.vehicleType || '');

      const nums: Record<string, string> = {};
      const exps: Record<string, string> = {};
      docs.forEach((d: any) => {
        if (d.documentNumber) nums[d.docType] = d.documentNumber;
        if (d.expiryDate) exps[d.docType] = new Date(d.expiryDate).toISOString().split('T')[0];
      });
      setDocNumbers(nums);
      setDocExpiry(exps);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const getDoc = (docType: string) => documents.find(d => d.docType === docType) || null;

  const handleUpload = async (config: DocConfig) => {
    const fileInput = fileRefs.current[config.key];
    const file = fileInput?.files?.[0];
    if (!file) return;

    if (config.needsNumber && !docNumbers[config.key]?.trim()) {
      alert(`Please enter your ${config.numberLabel} before uploading`);
      return;
    }

    setUploading(config.key);
    try {
      const result = await uploadToCloudinary(file);
      const payload: any = { docType: config.key, url: result.secure_url };
      if (config.needsNumber && docNumbers[config.key]) payload.documentNumber = docNumbers[config.key];
      if (config.hasExpiry && docExpiry[config.key]) payload.expiryDate = docExpiry[config.key];

      const res = await fetch('/api/rider/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(prev => [...prev.filter(d => d.docType !== config.key), data.document]);
        const refreshed = await fetch('/api/rider/stats').then(r => r.json());
        setKycStatus(refreshed.riderDetail?.kycStatus || 'PENDING');
      }
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    }
    setUploading(null);
    if (fileInput) fileInput.value = '';
  };

  const isGroupSatisfied = (group: typeof DOC_GROUPS[0]) => {
    const primary = group.docs.find(d => !d.alternativeTo);
    const alternatives = group.docs.filter(d => d.alternativeTo);

    if (primary?.required) {
      return documents.some(d => d.docType === primary.key && d.status === 'APPROVED');
    }

    const primaryApproved = primary ? documents.some(d => d.docType === primary.key && d.status === 'APPROVED') : false;
    if (primaryApproved) return true;

    for (const alt of alternatives) {
      if (!alt.alternativeTo) continue;
      const altDocs = group.docs.filter(d => d.alternativeTo === alt.alternativeTo);
      if (altDocs.every(ad => documents.some(d => d.docType === ad.key && d.status === 'APPROVED'))) {
        return true;
      }
    }

    return false;
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

  if (loading) return <div className="p-6 pt-4"><p className="text-gray-500 text-sm">Loading...</p></div>;

  return (
    <div className="p-6 pt-4">
      <h1 className="text-2xl font-serif font-bold text-white mb-2">Verification</h1>
      <p className="text-gray-500 text-sm mb-5">Documents & vehicle info</p>

      {kycBanner()}

      <div className="bg-midnight-800 border border-midnight-700 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <span className="text-white font-semibold">Vehicle Details</span>
        </div>
        <div className="space-y-2 ml-13">
          <div className="flex justify-between">
            <span className="text-gray-500 text-xs">Plate Number</span>
            <span className="text-white text-sm font-medium">{plateNumber || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-xs">License Number</span>
            <span className="text-white text-sm font-medium">{licenseNumber || '—'}</span>
          </div>
          {vehicleType && (
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">Vehicle Type</span>
              <span className="text-white text-sm font-medium">{vehicleType}</span>
            </div>
          )}
        </div>
      </div>

      {DOC_GROUPS.map(group => {
        const satisfied = isGroupSatisfied(group);

        return (
          <div key={group.title} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{group.title}</p>
              {satisfied && <span className="text-[9px] bg-green-500/15 text-green-400 px-1.5 py-0.5 rounded-full font-bold">Complete</span>}
              {!satisfied && group.required && <span className="text-[9px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded-full font-bold">Required</span>}
            </div>
            <p className="text-gray-600 text-[10px] mb-3">{group.desc}</p>

            <div className="space-y-3">
              {group.docs.map(config => {
                const doc = getDoc(config.key);
                const status = doc?.status || null;
                const style = status ? STATUS_STYLES[status] : null;
                const isUploading = uploading === config.key;

                const isAlternative = !!config.alternativeTo;
                const primaryApproved = group.docs.find(d => !d.alternativeTo)
                  ? documents.some(d => d.docType === group.docs.find(d2 => !d2.alternativeTo)!.key && d.status === 'APPROVED')
                  : false;

                const showAsDimmed = isAlternative && primaryApproved;

                return (
                  <div key={config.key} className={`bg-midnight-800 border border-midnight-700 rounded-2xl p-4 ${showAsDimmed ? 'opacity-40' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-white font-semibold text-sm">
                            {config.label}
                            {isAlternative && <span className="text-gray-500 text-[10px] ml-1.5">(Alternative)</span>}
                          </h3>
                          {style && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${style.bg} ${style.text}`}>
                              {style.label}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mb-2">{config.desc}</p>

                        {doc?.documentNumber && (
                          <p className="text-gold-500/80 text-[11px] font-mono mb-1">#{doc.documentNumber}</p>
                        )}
                        {doc?.expiryDate && (
                          <p className={`text-[11px] mb-1 ${new Date(doc.expiryDate) < new Date() ? 'text-red-400' : 'text-gray-500'}`}>
                            Exp: {new Date(doc.expiryDate).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })}
                            {new Date(doc.expiryDate) < new Date() && ' (EXPIRED)'}
                          </p>
                        )}

                        {doc?.url && status === 'REJECTED' && (
                          <p className="text-red-400 text-[10px] mb-2">Previous upload was rejected. Please re-upload a clearer image.</p>
                        )}
                        {doc?.url && status === 'APPROVED' && (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-gold-500 text-[10px] hover:underline">View document</a>
                        )}
                      </div>
                    </div>

                    {config.needsNumber && !showAsDimmed && (
                      <input
                        type="text"
                        value={docNumbers[config.key] || ''}
                        onChange={e => setDocNumbers(prev => ({ ...prev, [config.key]: e.target.value }))}
                        placeholder={config.numberPlaceholder}
                        disabled={status === 'APPROVED'}
                        className="w-full bg-midnight-900 border border-midnight-700 text-white text-sm px-3 py-2.5 rounded-xl mt-3 mb-2 focus:outline-none focus:border-gold-500/50 placeholder:text-midnight-600 disabled:opacity-50"
                      />
                    )}

                    {config.hasExpiry && !showAsDimmed && (
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-gray-500 text-[10px] flex-shrink-0">Expiry:</label>
                        <input
                          type="date"
                          value={docExpiry[config.key] || ''}
                          onChange={e => setDocExpiry(prev => ({ ...prev, [config.key]: e.target.value }))}
                          disabled={status === 'APPROVED'}
                          className="flex-1 bg-midnight-900 border border-midnight-700 text-white text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50 disabled:opacity-50"
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*,.pdf"
                      ref={el => { fileRefs.current[config.key] = el; }}
                      className="hidden"
                      onChange={() => handleUpload(config)}
                    />

                    {!showAsDimmed && (
                      <button
                        onClick={() => fileRefs.current[config.key]?.click()}
                        disabled={isUploading}
                        className={`w-full mt-2 py-2.5 rounded-xl text-sm font-bold transition-colors active:scale-[0.98] disabled:opacity-50 ${
                          status === 'APPROVED'
                            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                            : 'bg-gold-500/10 border border-gold-500/30 text-gold-500 hover:bg-gold-500/20'
                        }`}
                      >
                        {isUploading ? 'Uploading...' :
                         status === 'APPROVED' ? 'Re-upload' :
                         'Upload'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
