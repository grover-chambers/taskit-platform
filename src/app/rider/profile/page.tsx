"use client";

import { useEffect, useState } from 'react';

export default function RiderProfile() {
  const [riderName, setRiderName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [kycStatus, setKycStatus] = useState('PENDING');
  const [totalTrips, setTotalTrips] = useState(0);
  const [rating, setRating] = useState(5.0);
  const [riderId, setRiderId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/rider/stats')
      .then(r => r.json())
      .then(data => {
        const rd = data.riderDetail;
        if (rd) {
          setRiderName(rd.user?.name || '');
          setPhone(rd.user?.phone || '');
          setEmail(rd.user?.email || '');
          setKycStatus(rd.kycStatus || 'PENDING');
          setTotalTrips(rd.totalTrips || 0);
          setRating(rd.rating || 5.0);
          setRiderId(rd.id?.slice(-4).toUpperCase() || '0000');
          setEditName(rd.user?.name || '');
          setEditPhone(rd.user?.phone || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, phone: editPhone }),
      });
      if (res.ok) {
        setRiderName(editName);
        setPhone(editPhone);
        setIsEditing(false);
      }
    } catch {}
    setSaving(false);
  };

  const kycBadge = () => {
    if (kycStatus === 'VERIFIED') return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-500/15 text-green-400">Verified</span>;
    if (kycStatus === 'REJECTED') return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-500/15 text-red-400">Rejected</span>;
    return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-yellow-500/15 text-yellow-400">Pending</span>;
  };

  if (loading) return <div className="p-6 pt-4"><p className="text-gray-500 text-sm">Loading...</p></div>;

  const initial = riderName ? riderName.charAt(0).toUpperCase() : '?';

  return (
    <div className="p-6 pt-4">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-20 h-20 bg-midnight-800 border-2 border-gold-500 rounded-full flex items-center justify-center mb-3 shadow-gold">
          <span className="text-gold-500 font-bold text-3xl font-serif">{initial}</span>
        </div>
        <h2 className="text-xl font-bold text-white">{riderName}</h2>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-gray-400 text-sm">Rider #R-{riderId}</p>
          {kycBadge()}
        </div>
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{totalTrips}</p>
            <p className="text-gray-500 text-[10px]">Trips</p>
          </div>
          <div className="text-center">
            <p className="text-yellow-500 font-bold text-xl">{rating.toFixed(1)}</p>
            <p className="text-gray-500 text-[10px]">Rating</p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="bg-midnight-800 border border-gold-500/30 rounded-2xl p-5 mb-4 space-y-4">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Full Name</label>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="w-full bg-midnight-900 border border-midnight-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Phone</label>
            <input
              value={editPhone}
              onChange={e => setEditPhone(e.target.value)}
              className="w-full bg-midnight-900 border border-midnight-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex-1 bg-gold-500 text-midnight-950 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setIsEditing(false); setEditName(riderName); setEditPhone(phone); }}
              className="flex-1 bg-midnight-700 text-gray-300 py-2.5 rounded-xl font-bold text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div
          onClick={() => setIsEditing(true)}
          className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <span className="text-white font-semibold">Edit Profile</span>
          </div>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>

        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">Email</span>
              <span className="text-gray-400 text-sm">{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">Phone</span>
              <span className="text-white text-sm font-medium">{phone || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
