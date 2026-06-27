"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useEnterprise } from '../EnterpriseContext';

interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
}

export default function MtaagoSettingsPage() {
  const { subRole, enterprise, loading: roleLoading } = useEnterprise();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApi, setShowApi] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/enterprise/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchAuditLogs(); }, [fetchAuditLogs]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (roleLoading || loading) {
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

  const isOwner = subRole === 'OWNER';

  return (
    <div className="px-6 pt-6 pb-24 space-y-4">
      <h1 className="text-white font-bold text-lg mb-1">Settings</h1>
      <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Enterprise Profile</p>

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-haraka-500/15 border border-haraka-500/30 flex items-center justify-center">
            <span className="text-haraka-500 font-bold text-xl">
              {enterprise?.name?.charAt(0)?.toUpperCase() || 'K'}
            </span>
          </div>
          <div>
            <p className="text-white font-bold text-base">{enterprise?.name || 'Kanini Haraka'}</p>
            <p className="text-gray-500 text-xs">Enterprise Account · {subRole}</p>
          </div>
        </div>
      </div>

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b border-midnight-700">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Rate per Delivery</p>
            <p className="text-haraka-500 font-bold text-base">KSh {enterprise?.rate || 120}</p>
          </div>
          <button
            onClick={() => copyToClipboard(`KSh ${enterprise?.rate || 120}`, 'rate')}
            className="text-gray-500 text-[10px] font-bold hover:text-white transition-colors"
          >
            {copied === 'rate' ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="flex justify-between items-center px-4 py-3 border-b border-midnight-700">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Account Status</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${enterprise?.active ? 'bg-green-400' : 'bg-red-400'}`} />
              <p className={`font-bold text-sm ${enterprise?.active ? 'text-green-400' : 'text-red-400'}`}>
                {enterprise?.active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-3 border-b border-midnight-700">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Your Role</p>
            <p className={`font-bold text-sm ${isOwner ? 'text-amber-400' : 'text-haraka-500'}`}>
              {subRole === 'OWNER' ? 'Owner (Watch + Intervene)' : 'Operator (Full Control)'}
            </p>
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

      {/* Audit Log — visible to both roles */}
      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5 space-y-3">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Recent Activity</p>
        {auditLogs.length === 0 ? (
          <p className="text-gray-600 text-xs">No activity logged yet</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-haraka-500/50 mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-[11px] font-semibold">{log.action.replace(/_/g, ' ')}</p>
                  {log.details && <p className="text-gray-500 text-[10px] truncate">{log.details}</p>}
                  <p className="text-gray-600 text-[9px]">{log.user?.name || log.user?.email} · {new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5 space-y-3">
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Quick Links</p>
        <div className="space-y-2">
          <Link
            href="/mtaago/orders/new"
            className="flex items-center justify-between bg-midnight-900 border border-midnight-700 rounded-lg p-3 hover:border-haraka-500/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">📦</span>
              <span className="text-white text-sm font-semibold">Create New Order</span>
            </div>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
          <Link
            href="/mtaago/orders"
            className="flex items-center justify-between bg-midnight-900 border border-midnight-700 rounded-lg p-3 hover:border-haraka-500/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">📋</span>
              <span className="text-white text-sm font-semibold">All Orders</span>
            </div>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
          <Link
            href="/mtaago/riders"
            className="flex items-center justify-between bg-midnight-900 border border-midnight-700 rounded-lg p-3 hover:border-haraka-500/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">🛵</span>
              <span className="text-white text-sm font-semibold">Rider Board</span>
            </div>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
          <Link
            href="/mtaago/billing"
            className="flex items-center justify-between bg-midnight-900 border border-midnight-700 rounded-lg p-3 hover:border-haraka-500/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">💰</span>
              <span className="text-white text-sm font-semibold">Billing & Invoices</span>
            </div>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">ℹ️</span>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">About Mtaago</p>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed">
          Mtaago by TaskIt is the Haraka dispatch system for enterprise clients.
          {subRole === 'OPERATOR'
            ? ' Create orders, confirm payments, pack items, dispatch riders — all from your workspace.'
            : ' Monitor all operations, intervene on delays, and keep things moving.'}
        </p>
      </div>
    </div>
  );
}
