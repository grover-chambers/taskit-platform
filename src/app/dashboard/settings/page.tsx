"use client";

import { useState } from 'react';

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const Toggle = ({ enabled, setEnabled }: { enabled: boolean, setEnabled: (val: boolean) => void }) => (
    <button onClick={() => setEnabled(!enabled)} className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-gold-500' : 'bg-midnight-600'}`}>
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all ${enabled ? 'right-0.5' : 'left-0.5'}`}></div>
    </button>
  );

  return (
    <div className="px-6 pt-4 pb-28">
      <h1 className="text-2xl font-serif font-bold text-white mb-6">Settings</h1>

      <div className="space-y-4">
        {/* App Preferences */}
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold px-1">App Preferences</h3>
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div>
              <span className="text-white font-semibold">Push Notifications</span>
            </div>
            <Toggle enabled={notificationsEnabled} setEnabled={setNotificationsEnabled} />
          </div>
          <div className="border-t border-midnight-700"></div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
              <span className="text-white font-semibold">Biometric Login</span>
            </div>
            <Toggle enabled={biometricEnabled} setEnabled={setBiometricEnabled} />
          </div>
        </div>

        {/* Privacy & Security */}
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold px-1 pt-2">Privacy & Security</h3>
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
              <span className="text-white font-semibold">Location Services</span>
            </div>
            <Toggle enabled={locationEnabled} setEnabled={setLocationEnabled} />
          </div>
          <div className="border-t border-midnight-700"></div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
              <span className="text-white font-semibold">Analytics & Data</span>
            </div>
            <Toggle enabled={analyticsEnabled} setEnabled={setAnalyticsEnabled} />
          </div>
          <div className="border-t border-midnight-700"></div>
          <button className="w-full flex justify-between items-center pt-1 group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-midnight-700 rounded-xl flex items-center justify-center text-gold-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></div>
              <span className="text-white font-semibold">Change Password</span>
            </div>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Legal */}
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold px-1 pt-2">Legal</h3>
        <div className="bg-midnight-800 p-4 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
          <button className="w-full flex justify-between items-center group">
            <span className="text-white font-semibold text-sm">Terms of Service</span>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="border-t border-midnight-700"></div>
          <button className="w-full flex justify-between items-center group">
            <span className="text-white font-semibold text-sm">Privacy Policy</span>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs pt-4">TaskIt v1.0.0 &middot; Made in Nairobi</p>
      </div>
    </div>
  );
}
