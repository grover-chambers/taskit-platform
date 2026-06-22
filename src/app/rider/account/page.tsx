"use client";

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RiderAccount() {
  const [riderName, setRiderName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [kycStatus, setKycStatus] = useState('PENDING');
  const [totalTrips, setTotalTrips] = useState(0);
  const [rating, setRating] = useState(5.0);
  const [loading, setLoading] = useState(true);
  const [showSignOut, setShowSignOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/rider/stats')
      .then(r => r.json())
      .then(data => {
        const rd = data.riderDetail;
        if (rd) {
          setRiderName(rd.user?.name || '');
          setEmail(rd.user?.email || '');
          setPhone(rd.user?.phone || '');
          setPlateNumber(rd.plateNumber || '');
          setLicenseNumber(rd.licenseNumber || '');
          setKycStatus(rd.kycStatus || 'PENDING');
          setTotalTrips(rd.totalTrips || 0);
          setRating(rd.rating || 5.0);
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

  const handleChangePassword = async () => {
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch {
      setPasswordError('Something went wrong');
    }
    setPasswordLoading(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  const kycBadge = () => {
    if (kycStatus === 'VERIFIED') return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-500/15 text-green-400">Verified</span>;
    if (kycStatus === 'REJECTED') return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-500/15 text-red-400">Rejected</span>;
    return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-yellow-500/15 text-yellow-400">Pending</span>;
  };

  if (loading) {
    return <div className="p-6 pt-4"><p className="text-gray-500 text-sm">Loading...</p></div>;
  }

  const initial = riderName ? riderName.charAt(0).toUpperCase() : '?';

  return (
    <div className="p-6 pt-4">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-20 h-20 bg-midnight-800 border-2 border-gold-500 rounded-full flex items-center justify-center mb-3 shadow-gold">
          <span className="text-gold-500 font-bold text-3xl font-serif">{initial}</span>
        </div>
        <h2 className="text-xl font-bold text-white">{riderName}</h2>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-gray-400 text-sm">{plateNumber}</p>
          {kycBadge()}
        </div>
        <div className="flex justify-center gap-6 mt-3">
          <div className="text-center">
            <p className="text-white font-bold text-lg">{totalTrips}</p>
            <p className="text-gray-500 text-[10px]">Trips</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">{rating.toFixed(1)}</p>
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
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <span className="text-white font-semibold">Vehicle Details</span>
          </div>
          <div className="space-y-2 ml-13">
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">Plate Number</span>
              <span className="text-white text-sm font-medium">{plateNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">License Number</span>
              <span className="text-white text-sm font-medium">{licenseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">Email</span>
              <span className="text-gray-400 text-xs">{email}</span>
            </div>
          </div>
        </div>

        <Link
          href="/rider/documents"
          className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <span className="text-white font-semibold block">Verification Documents</span>
              <span className={`text-[10px] ${kycStatus === 'VERIFIED' ? 'text-green-400' : kycStatus === 'REJECTED' ? 'text-red-400' : 'text-yellow-400'}`}>
                {kycStatus === 'VERIFIED' ? 'All approved' : kycStatus === 'REJECTED' ? 'Action needed' : 'Upload pending'}
              </span>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>

        <div
          onClick={() => setShowPasswordModal(true)}
          className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <span className="text-white font-semibold">Change Password</span>
          </div>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>

        <button
          onClick={() => setShowSignOut(true)}
          className="w-full bg-midnight-800 p-4 rounded-2xl border border-red-900/50 shadow-soft-dark flex justify-between items-center hover:border-red-500 transition-colors cursor-pointer mt-2"
        >
          <span className="text-red-400 font-semibold">Sign Out</span>
          <svg className="w-5 h-5 text-red-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>

      {showSignOut && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowSignOut(false)}>
          <div className="bg-midnight-900 border-t border-midnight-700 rounded-t-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-lg mb-2">Sign Out?</h3>
            <p className="text-gray-400 text-sm mb-5">You will need to log in again to access your rider dashboard.</p>
            <button onClick={handleSignOut} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-500 transition-colors mb-2">
              Sign Out
            </button>
            <button onClick={() => setShowSignOut(false)} className="w-full bg-midnight-800 text-gray-300 py-3 rounded-xl font-bold text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-midnight-900 border-t border-midnight-700 rounded-t-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-lg mb-4">Change Password</h3>
            {passwordError && <p className="text-red-400 text-sm mb-3">{passwordError}</p>}
            <div className="space-y-3 mb-5">
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
              className="w-full bg-gold-500 text-midnight-950 py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-colors mb-2"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
            <button onClick={() => { setShowPasswordModal(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setPasswordError(''); }} className="w-full bg-midnight-800 text-gray-300 py-3 rounded-xl font-bold text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
