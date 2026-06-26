"use client";

import { useEffect, useState, useCallback } from 'react';
import { getServerSession } from 'next-auth';

interface EnterpriseProfile {
  name: string;
  contact: string | null;
  rate: number;
  active: boolean;
  apiKey: string;
  createdAt: string;
}

export default function MtaagoSettingsPage() {
  const [profile, setProfile] = useState<EnterpriseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/vendor/stats');
      if (res.ok) {
        const data = await res.json();
        const clientRes = await fetch('/api/vendor/billing');
        if (clientRes.ok) {
          const billingData = await clientRes.json();
          setProfile({
            name: data.clientName,
            contact: null,
            rate: billingData.rate,
            active: true,
            apiKey: '',
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="px-6 pt-6 pb-24">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-haraka-500/30 border-t-haraka-500 rounded-full animate-spin" />
            <p className="text-gray-500 text-xs">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-24 space-y-4">
      <h1 className="text-white font-bold text-lg mb-1">Settings</h1>
      <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Enterprise Profile</p>

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-haraka-500/15 border border-haraka-500/30 flex items-center justify-center">
            <span className="text-haraka-500 font-bold text-xl">
              {profile?.name?.charAt(0)?.toUpperCase() || 'M'}
            </span>
          </div>
          <div>
            <p className="text-white font-bold text-base">{profile?.name || 'Mtaago Client'}</p>
            <p className="text-gray-500 text-xs">Enterprise Account</p>
          </div>
        </div>
      </div>

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b border-midnight-700">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Rate per Delivery</p>
            <p className="text-haraka-500 font-bold text-base">KSh {profile?.rate || 120}</p>
          </div>
          <button
            onClick={() => copyToClipboard(`KSh ${profile?.rate || 120}`, 'rate')}
            className="text-gray-500 text-[10px] font-bold hover:text-white transition-colors"
          >
            {copied === 'rate' ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="flex justify-between items-center px-4 py-3 border-b border-midnight-700">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Account Status</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${profile?.active ? 'bg-green-400' : 'bg-red-400'}`} />
              <p className={`font-bold text-sm ${profile?.active ? 'text-green-400' : 'text-red-400'}`}>
                {profile?.active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-3">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Dashboard URL</p>
            <p className="text-gray-300 text-sm font-mono">/mtaago</p>
          </div>
          <button
            onClick={() => copyToClipboard(`${window.location.origin}/mtaago`, 'url')}
            className="text-gray-500 text-[10px] font-bold hover:text-white transition-colors"
          >
            {copied === 'url' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5 space-y-3">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Quick Links</p>
        <div className="space-y-2">
          <a
            href="/mtaago/orders/new"
            className="flex items-center justify-between bg-midnight-900 border border-midnight-700 rounded-lg p-3 hover:border-haraka-500/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">📦</span>
              <span className="text-white text-sm font-semibold">Create New Order</span>
            </div>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
          <a
            href="/mtaago/orders"
            className="flex items-center justify-between bg-midnight-900 border border-midnight-700 rounded-lg p-3 hover:border-haraka-500/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">📋</span>
              <span className="text-white text-sm font-semibold">All Orders</span>
            </div>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
          <a
            href="/mtaago/riders"
            className="flex items-center justify-between bg-midnight-900 border border-midnight-700 rounded-lg p-3 hover:border-haraka-500/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">🛵</span>
              <span className="text-white text-sm font-semibold">Rider Board</span>
            </div>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
          <a
            href="/mtaago/billing"
            className="flex items-center justify-between bg-midnight-900 border border-midnight-700 rounded-lg p-3 hover:border-haraka-500/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">💰</span>
              <span className="text-white text-sm font-semibold">Billing & Invoices</span>
            </div>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">ℹ️</span>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">About Mtaago</p>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed">
          Mtaago by TaskIt is the Haraka dispatch system for enterprise clients.
          Manage deliveries, track riders in real-time, and handle postpaid billing — all from one dashboard.
        </p>
      </div>
    </div>
  );
}
