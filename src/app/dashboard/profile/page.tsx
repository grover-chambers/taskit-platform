"use client";

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [initial, setInitial] = useState('T');
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSignOut, setShowSignOut] = useState(false);

  useEffect(() => {
    fetch('/api/user')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setName(data.user.name || '');
          setPhone(data.user.phone || '');
          setEmail(data.user.email || '');
          setInitial(data.user.name?.charAt(0).toUpperCase() || 'T');
        }
      })
      .catch(() => {});

    fetch('/api/orders?role=customer')
      .then(r => r.json())
      .then(data => setOrderCount(data.orders?.length || 0))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg('Profile updated');
        setIsEditing(false);
        setInitial(name.charAt(0).toUpperCase());
      } else {
        setSaveMsg(data.error || 'Failed to update');
      }
    } catch {
      setSaveMsg('Network error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  return (
    <div className="px-6 pt-4 pb-28">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 bg-midnight-800 border-2 border-gold-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <span className="text-gold-500 font-bold text-4xl font-serif">{initial}</span>
        </div>
        {loading ? (
          <div className="w-32 h-5 bg-midnight-800 rounded animate-pulse" />
        ) : (
          <>
            <h1 className="text-2xl font-serif font-bold text-white">{name || 'Set your name'}</h1>
            <p className="text-gray-400 text-sm mt-1">{phone || 'Add phone number'}</p>
            <p className="text-gray-500 text-xs mt-0.5">{orderCount} order{orderCount !== 1 ? 's' : ''} placed</p>
          </>
        )}
      </div>

      {saveMsg && (
        <div className={`text-sm text-center p-3 rounded-xl mb-4 ${saveMsg.includes('error') || saveMsg.includes('Failed') ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
          {saveMsg}
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark relative">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="absolute top-4 right-4 text-sm font-semibold px-3 py-1 rounded-lg bg-gold-500 text-midnight-950 disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 text-sm font-semibold px-3 py-1 rounded-lg text-gold-500 hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
            >
              Edit
            </button>
          )}

          <h3 className="text-white font-bold text-lg mb-4">Account Details</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={!isEditing}
                className={`w-full bg-midnight-900 border rounded-xl px-4 py-2.5 text-white outline-none transition-all ${isEditing ? 'border-gold-500 ring-1 ring-gold-500/50' : 'border-midnight-700 cursor-default'}`}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={!isEditing}
                className={`w-full bg-midnight-900 border rounded-xl px-4 py-2.5 text-white outline-none transition-all ${isEditing ? 'border-gold-500 ring-1 ring-gold-500/50' : 'border-midnight-700 cursor-default'}`}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-midnight-900 border border-midnight-700 rounded-xl px-4 py-2.5 text-gray-400 cursor-default"
              />
              <p className="text-[10px] text-gray-600 mt-1">Email cannot be changed</p>
            </div>
          </div>
          {isEditing && (
            <button onClick={() => setIsEditing(false)} className="text-gray-500 text-sm font-medium hover:text-gray-400 mt-3 block">Cancel</button>
          )}
        </div>

        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <span className="text-white font-semibold block">Saved Addresses</span>
              <span className="text-gray-500 text-[10px]">Coming soon</span>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>

        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark flex justify-between items-center hover:border-gold-500 transition-colors cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <span className="text-white font-semibold">Settings</span>
          </div>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>

        <button onClick={() => setShowSignOut(true)} className="w-full bg-midnight-800 p-4 rounded-2xl border border-red-900/50 shadow-soft-dark flex justify-between items-center hover:border-red-500 transition-colors mt-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-900/20 rounded-xl flex items-center justify-center text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
            <span className="text-red-400 font-semibold">Sign Out</span>
          </div>
        </button>
      </div>

      {showSignOut && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSignOut(false)}>
          <div className="bg-midnight-800 border border-midnight-700 rounded-2xl p-6 text-center max-w-xs mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-4xl mb-3">👋</div>
            <h3 className="text-white font-bold text-lg mb-2">Sign Out?</h3>
            <p className="text-gray-400 text-sm mb-5">You'll need to sign in again to access your account.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowSignOut(false)} className="flex-1 bg-midnight-700 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-midnight-600 transition-colors">Cancel</button>
              <button onClick={handleSignOut} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-red-500 transition-colors">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
