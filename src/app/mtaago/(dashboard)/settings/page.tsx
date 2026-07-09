"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
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

interface PricingConfig {
  pricingModel: string;
  fuelPricePerLiter: number | null;
  fuelConsumptionKmpl: number | null;
  markupPercent: number;
  pricePerKm: number | null;
  baseFare: number;
  minimumFare: number;
}

export default function MtaaGoSettingsPage() {
  const { subRole, enterprise, pricing: ctxPricing, loading: roleLoading } = useEnterprise();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const [pricingModel, setPricingModel] = useState('ZONE');
  const [fuelPrice, setFuelPrice] = useState('');
  const [consumption, setConsumption] = useState('');
  const [markup, setMarkup] = useState('30');
  const [baseFare, setBaseFare] = useState('0');
  const [minimumFare, setMinimumFare] = useState('0');
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingSaved, setPricingSaved] = useState(false);
  const [pricingError, setPricingError] = useState('');

  const isOwner = subRole === 'OWNER';

  useEffect(() => {
    if (ctxPricing) {
      setPricingModel(ctxPricing.pricingModel || 'ZONE');
      setFuelPrice(ctxPricing.fuelPricePerLiter?.toString() || '');
      setConsumption(ctxPricing.fuelConsumptionKmpl?.toString() || '');
      setMarkup(ctxPricing.markupPercent?.toString() || '30');
      setBaseFare(ctxPricing.baseFare?.toString() || '0');
      setMinimumFare(ctxPricing.minimumFare?.toString() || '0');
    }
  }, [ctxPricing]);

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

  const fuelNum = fuelPrice ? parseFloat(fuelPrice) : 0;
  const consumptionNum = consumption ? parseFloat(consumption) : 0;
  const markupNum = markup ? parseFloat(markup) : 30;
  const derivedPricePerKm = (fuelNum > 0 && consumptionNum > 0)
    ? Math.ceil((fuelNum / consumptionNum) * (1 + markupNum / 100))
    : null;

  const handleSavePricing = async () => {
    setPricingSaving(true);
    setPricingError('');
    setPricingSaved(false);
    try {
      const res = await fetch('/api/enterprise/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pricingModel,
          fuelPricePerLiter: fuelNum || null,
          fuelConsumptionKmpl: consumptionNum || null,
          markupPercent: markupNum,
          baseFare: parseInt(baseFare) || 0,
          minimumFare: parseInt(minimumFare) || 0,
        }),
      });
      if (res.ok) {
        setPricingSaved(true);
        setTimeout(() => setPricingSaved(false), 3000);
      } else {
        const data = await res.json();
        setPricingError(data.error || 'Failed to save');
      }
    } catch {
      setPricingError('Network error');
    }
    setPricingSaving(false);
  };

  if (roleLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-haraka-500/30 border-t-haraka-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-xs">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isOwner ? 'space-y-6' : 'px-6 pt-6 pb-24 space-y-4'}>
      <div>
        <h1 className="text-white font-bold text-xl">Settings</h1>
        <p className="text-gray-500 text-xs mt-0.5">Enterprise Profile</p>
      </div>

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
              {isOwner ? 'Owner (Watch + Intervene)' : 'Operator (Full Control)'}
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

      {isOwner && (
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Pricing Configuration</p>
              <p className="text-gray-400 text-[10px] mt-0.5">Configure how delivery prices are calculated</p>
            </div>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
              pricingModel === 'DISTANCE'
                ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                : 'bg-green-500/15 text-green-400 border-green-500/30'
            }`}>
              {pricingModel}
            </span>
          </div>

          <div>
            <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Pricing Model</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPricingModel('ZONE')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                  pricingModel === 'ZONE'
                    ? 'bg-midnight-700 border-2 border-green-500 text-green-400'
                    : 'bg-midnight-800 border border-midnight-700 text-gray-400'
                }`}
              >
                Zone-Based
              </button>
              <button
                type="button"
                onClick={() => setPricingModel('DISTANCE')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                  pricingModel === 'DISTANCE'
                    ? 'bg-midnight-700 border-2 border-blue-500 text-blue-400'
                    : 'bg-midnight-800 border border-midnight-700 text-gray-400'
                }`}
              >
                Distance-Based
              </button>
            </div>
          </div>

          {pricingModel === 'DISTANCE' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Fuel Price (KSh/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={fuelPrice}
                    onChange={e => setFuelPrice(e.target.value)}
                    className="w-full bg-midnight-900 border border-midnight-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-haraka-500 transition-colors"
                    placeholder="e.g. 186"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Consumption (km/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={consumption}
                    onChange={e => setConsumption(e.target.value)}
                    className="w-full bg-midnight-900 border border-midnight-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-haraka-500 transition-colors"
                    placeholder="e.g. 15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Markup (%)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={markup}
                    onChange={e => setMarkup(e.target.value)}
                    className="w-full bg-midnight-900 border border-midnight-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-haraka-500 transition-colors"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Base Fare (KSh)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={baseFare}
                    onChange={e => setBaseFare(e.target.value)}
                    className="w-full bg-midnight-900 border border-midnight-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-haraka-500 transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 uppercase tracking-wider font-bold block mb-1.5">Minimum (KSh)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={minimumFare}
                    onChange={e => setMinimumFare(e.target.value)}
                    className="w-full bg-midnight-900 border border-midnight-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-haraka-500 transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              {derivedPricePerKm != null && derivedPricePerKm > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-1">Derived Rate</p>
                  <p className="text-blue-400 font-bold text-xl">KSh {derivedPricePerKm}/km</p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {fuelNum} ÷ {consumptionNum} = KSh {(fuelNum / consumptionNum).toFixed(2)}/km cost → with {markupNum}% markup
                  </p>
                  {baseFare && parseInt(baseFare) > 0 && (
                    <p className="text-[10px] text-gray-500">+ KSh {baseFare} base fare per order</p>
                  )}
                  {minimumFare && parseInt(minimumFare) > 0 && (
                    <p className="text-[10px] text-gray-500">Minimum: KSh {minimumFare}</p>
                  )}
                </div>
              )}

              {fuelNum > 0 && consumptionNum > 0 && (
                <div className="bg-midnight-900 border border-midnight-700 rounded-xl p-4">
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-2">Example Orders</p>
                  <div className="space-y-2">
                    {[
                      { km: 5, label: 'Short (5km)' },
                      { km: 15, label: 'Medium (15km)' },
                      { km: 30, label: 'Long (30km)' },
                    ].map(ex => (
                      <div key={ex.km} className="flex items-center justify-between">
                        <span className="text-gray-400 text-[10px]">{ex.label}</span>
                        <span className="text-white text-xs font-bold">
                          KSh {derivedPricePerKm ? Math.max((parseInt(baseFare) || 0) + Math.ceil(ex.km * derivedPricePerKm), parseInt(minimumFare) || 0) : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {pricingError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-xs font-semibold">{pricingError}</p>
            </div>
          )}

          {pricingSaved && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
              <p className="text-green-400 text-xs font-semibold">Pricing saved successfully</p>
            </div>
          )}

          <button
            onClick={handleSavePricing}
            disabled={pricingSaving}
            className="w-full bg-haraka-500 text-midnight-950 py-3 rounded-xl font-bold text-sm hover:bg-haraka-400 transition-colors active:scale-[0.98] disabled:opacity-50"
          >
            {pricingSaving ? 'Saving...' : 'Save Pricing Config'}
          </button>
        </div>
      )}

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

      {!isOwner && (
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5 space-y-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Quick Links</p>
          <div className="space-y-2">
            <Link href="/mtaago/orders/new" className="flex items-center justify-between bg-midnight-900 border border-midnight-700 rounded-lg p-3 hover:border-haraka-500/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-sm">📦</span>
                <span className="text-white text-sm font-semibold">Create New Order</span>
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/mtaago/orders" className="flex items-center justify-between bg-midnight-900 border border-midnight-700 rounded-lg p-3 hover:border-haraka-500/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-sm">📋</span>
                <span className="text-white text-sm font-semibold">All Orders</span>
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/mtaago/riders" className="flex items-center justify-between bg-midnight-900 border border-midnight-700 rounded-lg p-3 hover:border-haraka-500/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🛵</span>
                <span className="text-white text-sm font-semibold">Rider Board</span>
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/mtaago/billing" className="flex items-center justify-between bg-midnight-900 border border-midnight-700 rounded-lg p-3 hover:border-haraka-500/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-sm">💰</span>
                <span className="text-white text-sm font-semibold">Billing & Invoices</span>
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      )}

      <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">ℹ️</span>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">About mtaaGo</p>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed">
          mtaaGo by TaskIt is the Haraka dispatch system for enterprise clients.
          {isOwner
            ? ' Monitor all operations, intervene on delays, and keep things moving.'
            : ' Create orders, confirm payments, pack items, dispatch riders — all from your workspace.'}
        </p>
      </div>

      {!isOwner && (
        <button
          onClick={() => signOut({ callbackUrl: '/mtaago/login' })}
          className="w-full bg-red-500/10 border border-red-500/30 text-red-400 py-3 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-colors"
        >
          Sign Out
        </button>
      )}
    </div>
  );
}
