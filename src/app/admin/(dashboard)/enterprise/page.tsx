"use client";

import { useState, useEffect, useCallback } from 'react';

interface Member {
  id: string;
  role: string;
  active: boolean;
  user: { id: string; name: string; email: string };
}

interface Enterprise {
  id: string;
  name: string;
  apiKey: string;
  contact: string | null;
  rate: number;
  active: boolean;
  owner: { id: string; name: string; email: string };
  members: Member[];
  _count: { orders: number; deliveries: number };
}

export default function AdminEnterprisePage() {
  const [clients, setClients] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [vendors, setVendors] = useState<{ id: string; name: string; email: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState<Enterprise | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/enterprise');
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const fetchVendors = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/riders?role=VENDOR');
      if (res.ok) {
        const data = await res.json();
        setVendors((data.riders || data.users || []).map((u: any) => ({ id: u.id, name: u.name, email: u.email })));
      }
    } catch {}
  }, []);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Enterprise Clients</h1>
          <p className="text-gray-400 text-sm mt-1">Manage Mtaago enterprise accounts & members</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-haraka-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-haraka-600 transition-colors">
          + New Enterprise
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-midnight-800/80 rounded-xl p-4 border border-midnight-700">
          <p className="text-gray-400 text-xs font-semibold">Total Enterprises</p>
          <p className="text-2xl font-bold text-white mt-1">{clients.length}</p>
        </div>
        <div className="bg-midnight-800/80 rounded-xl p-4 border border-midnight-700">
          <p className="text-gray-400 text-xs font-semibold">Active</p>
          <p className="text-2xl font-bold text-haraka-500 mt-1">{clients.filter(c => c.active).length}</p>
        </div>
        <div className="bg-midnight-800/80 rounded-xl p-4 border border-midnight-700">
          <p className="text-gray-400 text-xs font-semibold">Total Members</p>
          <p className="text-2xl font-bold text-gold-500 mt-1">{clients.reduce((acc, c) => acc + c.members.filter(m => m.active).length, 0)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {clients.map(client => (
          <div key={client.id} className="bg-midnight-800/80 rounded-xl border border-midnight-700 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold">{client.name}</h3>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${client.active ? 'bg-haraka-500/15 text-haraka-500 border border-haraka-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}>
                    {client.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-1">Owner: {client.owner.name} ({client.owner.email})</p>
                <p className="text-gray-500 text-xs">API Key: <code className="text-midnight-400 bg-midnight-900 px-1 rounded text-[10px]">{client.apiKey}</code></p>
                <p className="text-gray-500 text-xs">Rate: KES {client.rate}/delivery | Orders: {client._count.orders} | Deliveries: {client._count.deliveries}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {client.members.filter(m => m.active).map(m => (
                    <span key={m.id} className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${m.role === 'OWNER' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-haraka-500/15 text-haraka-500 border border-haraka-500/30'}`}>
                      {m.user.name} ({m.role})
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => setSelectedClient(selectedClient?.id === client.id ? null : client)} className="text-gold-500 text-xs font-semibold hover:underline">
                {selectedClient?.id === client.id ? 'Close' : 'Manage'}
              </button>
            </div>

            {selectedClient?.id === client.id && (
              <div className="mt-4 pt-4 border-t border-midnight-700 space-y-4">
                <div className="flex gap-2">
                  <ToggleActiveButton clientId={client.id} active={client.active} onDone={fetchClients} />
                  <UpdateRateButton clientId={client.id} currentRate={client.rate} onDone={fetchClients} />
                </div>
                <div>
                  <h4 className="text-gray-300 text-sm font-bold mb-2">Members ({client.members.filter(m => m.active).length})</h4>
                  <AddMemberForm clientId={client.id} vendors={vendors} onDone={fetchClients} />
                  <div className="space-y-1 mt-2">
                    {client.members.filter(m => m.active).map(m => (
                      <div key={m.id} className="flex items-center justify-between bg-midnight-900/50 p-2 rounded-lg">
                        <div>
                          <span className="text-white text-sm">{m.user.name}</span>
                          <span className="text-gray-500 text-xs ml-2">{m.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-midnight-700 text-gray-400">{m.role}</span>
                          {m.role !== 'OWNER' && (
                            <RemoveMemberButton clientId={client.id} userId={m.user.id} onDone={fetchClients} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No enterprise clients yet.</p>
          <button onClick={() => setShowCreate(true)} className="mt-4 text-haraka-500 font-semibold text-sm hover:underline">Create the first one</button>
        </div>
      )}

      {showCreate && (
        <CreateEnterpriseModal vendors={vendors} onClose={() => setShowCreate(false)} onCreated={fetchClients} />
      )}
    </div>
  );
}

function ToggleActiveButton({ clientId, active, onDone }: { clientId: string; active: boolean; onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const toggle = async () => {
    setLoading(true);
    await fetch(`/api/admin/enterprise/${clientId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !active }) });
    setLoading(false);
    onDone();
  };
  return (
    <button onClick={toggle} disabled={loading} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors disabled:opacity-50 ${active ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-haraka-500/15 text-haraka-500 hover:bg-haraka-500/25'}`}>
      {loading ? '...' : active ? 'Deactivate' : 'Activate'}
    </button>
  );
}

function UpdateRateButton({ clientId, currentRate, onDone }: { clientId: string; currentRate: number; onDone: () => void }) {
  const [editing, setEditing] = useState(false);
  const [rate, setRate] = useState(currentRate);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await fetch(`/api/admin/enterprise/${clientId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rate }) });
    setLoading(false);
    setEditing(false);
    onDone();
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-16 bg-midnight-900 border border-midnight-700 text-white text-xs px-2 py-1 rounded" />
        <button onClick={save} disabled={loading} className="text-haraka-500 text-xs font-bold hover:underline">{loading ? '...' : 'Save'}</button>
        <button onClick={() => setEditing(false)} className="text-gray-500 text-xs hover:underline">Cancel</button>
      </div>
    );
  }

  return (
    <button onClick={() => setEditing(true)} className="text-gold-500 text-xs px-3 py-1.5 rounded-lg font-bold bg-gold-500/15 hover:bg-gold-500/25 transition-colors">
      Edit Rate
    </button>
  );
}

function RemoveMemberButton({ clientId, userId, onDone }: { clientId: string; userId: string; onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const remove = async () => {
    if (!confirm('Remove this member?')) return;
    setLoading(true);
    await fetch(`/api/admin/enterprise/${clientId}/members`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
    setLoading(false);
    onDone();
  };
  return (
    <button onClick={remove} disabled={loading} className="text-red-400 text-[9px] font-bold hover:underline disabled:opacity-50">
      {loading ? '...' : 'Remove'}
    </button>
  );
}

function AddMemberForm({ clientId, vendors, onDone }: { clientId: string; vendors: { id: string; name: string; email: string }[]; onDone: () => void }) {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('OPERATOR');
  const [loading, setLoading] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    await fetch(`/api/admin/enterprise/${clientId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    });
    setLoading(false);
    setUserId('');
    onDone();
  };

  return (
    <form onSubmit={add} className="flex items-end gap-2">
      <div className="flex-1">
        <select value={userId} onChange={e => setUserId(e.target.value)} className="w-full bg-midnight-900 border border-midnight-700 text-white text-xs px-2 py-1.5 rounded">
          <option value="">Select vendor...</option>
          {vendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.email})</option>)}
        </select>
      </div>
      <select value={role} onChange={e => setRole(e.target.value)} className="bg-midnight-900 border border-midnight-700 text-white text-xs px-2 py-1.5 rounded">
        <option value="OWNER">Owner</option>
        <option value="OPERATOR">Operator</option>
      </select>
      <button type="submit" disabled={loading || !userId} className="bg-haraka-500 text-white text-xs px-3 py-1.5 rounded font-bold hover:bg-haraka-600 disabled:opacity-50">
        {loading ? '...' : 'Add'}
      </button>
    </form>
  );
}

function CreateEnterpriseModal({ vendors, onClose, onCreated }: { vendors: { id: string; name: string; email: string }[]; onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [contact, setContact] = useState('');
  const [rate, setRate] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ownerId) { setError('Name and owner required'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/enterprise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ownerId, contact, rate }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed'); setLoading(false); return; }
      setLoading(false);
      onCreated();
      onClose();
    } catch {
      setError('Failed to create');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-midnight-800 rounded-2xl border border-midnight-700 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-serif font-bold text-white mb-4">New Enterprise Client</h2>
        {error && <div className="bg-red-900/30 text-red-400 text-sm p-2 rounded-lg mb-3">{error}</div>}
        <form onSubmit={create} className="space-y-3">
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Enterprise Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required className="w-full bg-midnight-900 border border-midnight-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-haraka-500" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Owner (Vendor User)</label>
            <select value={ownerId} onChange={e => setOwnerId(e.target.value)} required className="w-full bg-midnight-900 border border-midnight-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-haraka-500">
              <option value="">Select vendor...</option>
              {vendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.email})</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Contact</label>
            <input value={contact} onChange={e => setContact(e.target.value)} className="w-full bg-midnight-900 border border-midnight-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-haraka-500" placeholder="phone or email" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">Rate (KES/delivery)</label>
            <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-midnight-900 border border-midnight-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-haraka-500" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-midnight-700 text-white py-2 rounded-xl font-bold text-sm hover:bg-midnight-600 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-haraka-500 text-white py-2 rounded-xl font-bold text-sm hover:bg-haraka-600 transition-colors disabled:opacity-50">{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
