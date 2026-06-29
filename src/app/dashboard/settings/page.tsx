"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('settings_notificationsEnabled');
      return v !== null ? v === 'true' : true;
    }
    return true;
  });
  const [locationEnabled, setLocationEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('settings_locationEnabled');
      return v !== null ? v === 'true' : true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('settings_notificationsEnabled', String(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('settings_locationEnabled', String(locationEnabled));
  }, [locationEnabled]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg('');
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordMsg('Password changed successfully');
        setTimeout(() => {
          setShowPasswordModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordMsg('');
        }, 1500);
      } else {
        setPasswordMsg(data.error || 'Failed to change password');
      }
    } catch {
      setPasswordMsg('Network error. Try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const Toggle = ({ enabled, setEnabled }: { enabled: boolean; setEnabled: (val: boolean) => void }) => (
    <button onClick={() => setEnabled(!enabled)} className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-gold-500' : 'bg-midnight-600'}`}>
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all ${enabled ? 'right-0.5' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="px-6 pt-4 pb-28">
      <h1 className="text-2xl font-serif font-bold text-white mb-6">Settings</h1>

      <div className="space-y-4">
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold px-1">App Preferences</h3>
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <span className="text-white font-semibold">Push Notifications</span>
            </div>
            <Toggle enabled={notificationsEnabled} setEnabled={setNotificationsEnabled} />
          </div>
          <div className="border-t border-midnight-700" />
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <span className="text-white font-semibold">Location Services</span>
            </div>
            <Toggle enabled={locationEnabled} setEnabled={setLocationEnabled} />
          </div>
        </div>

        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold px-1 pt-2">Security</h3>
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
          <button onClick={() => setShowPasswordModal(true)} className="w-full flex justify-between items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <span className="text-white font-semibold">Change Password</span>
            </div>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="border-t border-midnight-700" />
          <button onClick={() => router.push('/dashboard/profile')} className="w-full flex justify-between items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <span className="text-white font-semibold">Edit Profile</span>
            </div>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold px-1 pt-2">Legal</h3>
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
          <button className="w-full flex justify-between items-center group">
            <span className="text-white font-semibold text-sm">Terms of Service</span>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="border-t border-midnight-700" />
          <button className="w-full flex justify-between items-center group">
            <span className="text-white font-semibold text-sm">Privacy Policy</span>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs pt-4">TaskIt v1.0.0 · Made in Nairobi</p>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-midnight-800 border border-midnight-700 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-lg mb-4">Change Password</h3>

            {passwordMsg && (
              <div className={`text-sm text-center p-3 rounded-xl mb-4 ${passwordMsg.includes('success') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                {passwordMsg}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowPasswordModal(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setPasswordMsg(''); }} className="flex-1 bg-midnight-700 text-white py-2.5 rounded-xl font-semibold text-sm">Cancel</button>
              <button onClick={handleChangePassword} disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword} className="flex-1 bg-gold-500 text-midnight-950 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 transition-colors">
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
