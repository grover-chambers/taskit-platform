"use client";

import { useState } from 'react';
import { signOut } from 'next-auth/react';

export default function RiderSettings() {
  const [showSignOut, setShowSignOut] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess(false);
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
        setPasswordSuccess(true);
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

  return (
    <div className="p-6 pt-4">
      <h1 className="text-2xl font-serif font-bold text-white mb-6">Settings</h1>

      {passwordSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3 mb-4">
          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <p className="text-green-400 text-sm font-semibold">Password updated successfully</p>
        </div>
      )}

      <div className="space-y-2">
        <div
          onClick={() => setShowPasswordModal(true)}
          className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div>
              <span className="text-white font-semibold block">Change Password</span>
              <span className="text-gray-500 text-[10px]">Update your account password</span>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>

        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <span className="text-white font-semibold block">Location Access</span>
              <span className="text-gray-500 text-[10px]">Required for delivery tracking</span>
            </div>
          </div>
          <div className="w-12 h-7 rounded-full bg-gold-500 relative flex-shrink-0">
            <div className="w-6 h-6 bg-white rounded-full absolute top-0.5 right-0.5 shadow" />
          </div>
        </div>

        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <div>
              <span className="text-white font-semibold block">Notifications</span>
              <span className="text-gray-500 text-[10px]">Push & in-app alerts</span>
            </div>
          </div>
          <div className="w-12 h-7 rounded-full bg-gold-500 relative flex-shrink-0">
            <div className="w-6 h-6 bg-white rounded-full absolute top-0.5 right-0.5 shadow" />
          </div>
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
