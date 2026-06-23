"use client";

import { useEffect, useState, useCallback, useRef } from 'react';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-blue-500/15 text-blue-400',
  IN_PROGRESS: 'bg-yellow-500/15 text-yellow-400',
  RESOLVED: 'bg-green-500/15 text-green-400',
  CLOSED: 'bg-gray-500/15 text-gray-400',
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-500/15 text-gray-400',
  NORMAL: 'bg-blue-500/15 text-blue-400',
  HIGH: 'bg-orange-500/15 text-orange-400',
  URGENT: 'bg-red-500/15 text-red-400',
};

const CATEGORY_COLORS: Record<string, string> = {
  GENERAL: 'bg-gray-500/15 text-gray-400',
  ORDER: 'bg-purple-500/15 text-purple-400',
  PAYMENT: 'bg-gold-500/15 text-gold-500',
  RIDER: 'bg-cyan-500/15 text-cyan-400',
  VENDOR: 'bg-green-500/15 text-green-400',
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254797100144';

function whatsappUrl(phone: string, text?: string) {
  const clean = phone?.replace(/[^0-9+]/g, '') || '';
  const formatted = clean.startsWith('+') ? clean.slice(1) : clean.startsWith('0') ? '254' + clean.slice(1) : clean;
  const msg = text ? `&text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${formatted}${msg}`;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [openCount, setOpenCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/support');
      const data = await res.json();
      setTickets(data.tickets || []);
      setOpenCount(data.openCount || 0);
      setInProgressCount(data.inProgressCount || 0);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const fetchTicketDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/support/${id}`);
      const data = await res.json();
      setSelectedTicket(data.ticket);
    } catch {}
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchTicketDetail(selectedTicket.id);
    }
  }, [selectedTicket?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages?.length]);

  const handleSendMessage = async () => {
    if (!newMsg.trim() || !selectedTicket) return;
    try {
      const res = await fetch(`/api/admin/support/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMsg, channel: 'WHATSAPP' }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data.ticket);
        setNewMsg('');
      }
    } catch {}
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(`/api/admin/support/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data.ticket);
        fetchTickets();
      }
    } catch {}
  };

  const handleCreateTicket = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      subject: fd.get('subject') as string,
      category: fd.get('category') as string,
      priority: fd.get('priority') as string,
      customerId: fd.get('customerId') as string || undefined,
      riderId: fd.get('riderId') as string || undefined,
      orderId: fd.get('orderId') as string || undefined,
      message: fd.get('message') as string,
      channel: 'WHATSAPP',
    };

    if (!body.message) return;

    try {
      const res = await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowNewTicket(false);
        fetchTickets();
      }
    } catch {}
  };

  const filtered = tickets.filter(t => statusFilter === 'ALL' || t.status === statusFilter);

  const getContactPhone = () => {
    if (selectedTicket?.customer?.phone) return selectedTicket.customer.phone;
    if (selectedTicket?.rider?.phone) return selectedTicket.rider.phone;
    return '';
  };

  const getContactName = () => {
    if (selectedTicket?.customer?.name) return selectedTicket.customer.name;
    if (selectedTicket?.rider?.name) return selectedTicket.rider.name;
    return 'Unknown';
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-gray-500">Loading support...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Support Center</h1>
          <p className="text-gray-500 text-xs mt-0.5">{openCount} open · {inProgressCount} in progress</p>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className="bg-gold-500 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-gold-400 transition-colors"
        >
          + New Ticket
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
              statusFilter === s ? 'bg-gold-500/15 text-gold-500 border border-gold-500/30' : 'bg-midnight-800 text-gray-400 border border-midnight-700'
            }`}
          >
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            {s === 'OPEN' && openCount > 0 && <span className="ml-1 opacity-70">({openCount})</span>}
            {s === 'IN_PROGRESS' && inProgressCount > 0 && <span className="ml-1 opacity-70">({inProgressCount})</span>}
          </button>
        ))}
      </div>

      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setShowNewTicket(false)}>
          <div className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-white font-bold text-lg mb-4">New Support Ticket</h2>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <input name="subject" placeholder="Subject (optional)" className="w-full bg-midnight-800 border border-midnight-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-gold-500/50 placeholder:text-gray-600" />
              <div className="grid grid-cols-2 gap-3">
                <select name="category" className="bg-midnight-800 border border-midnight-700 text-gray-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50">
                  <option value="GENERAL">General</option>
                  <option value="ORDER">Order</option>
                  <option value="PAYMENT">Payment</option>
                  <option value="RIDER">Rider</option>
                  <option value="VENDOR">Vendor</option>
                </select>
                <select name="priority" className="bg-midnight-800 border border-midnight-700 text-gray-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50">
                  <option value="NORMAL">Normal</option>
                  <option value="LOW">Low</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input name="customerId" placeholder="Customer ID" className="bg-midnight-800 border border-midnight-700 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50 placeholder:text-gray-600" />
                <input name="riderId" placeholder="Rider ID" className="bg-midnight-800 border border-midnight-700 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50 placeholder:text-gray-600" />
                <input name="orderId" placeholder="Order ID" className="bg-midnight-800 border border-midnight-700 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50 placeholder:text-gray-600" />
              </div>
              <textarea name="message" required rows={3} placeholder="Write your message..." className="w-full bg-midnight-800 border border-midnight-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-gold-500/50 placeholder:text-gray-600 resize-none" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowNewTicket(false)} className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-gold-500 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-gold-400 transition-colors">Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[60vh]">
        <div className="lg:col-span-4 space-y-2 overflow-y-auto max-h-[75vh] pr-1">
          {filtered.length === 0 && (
            <div className="bg-midnight-800/50 border border-midnight-700 rounded-2xl p-8 text-center text-gray-500">
              No tickets found
            </div>
          )}
          {filtered.map((ticket) => {
            const lastMsg = ticket.messages?.[0];
            const isSelected = selectedTicket?.id === ticket.id;
            const contactName = ticket.customer?.name || ticket.rider?.name || 'Unknown';
            return (
              <button
                key={ticket.id}
                onClick={() => { setSelectedTicket(ticket); fetchTicketDetail(ticket.id); }}
                className={`w-full text-left rounded-2xl p-3 transition-colors border ${
                  isSelected
                    ? 'bg-midnight-800 border-gold-500/40'
                    : 'bg-midnight-800/60 border-midnight-700 hover:border-gold-500/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-bold truncate">{ticket.subject || `Ticket #${ticket.id.slice(-7).toUpperCase()}`}</p>
                    <p className="text-gray-500 text-[10px]">{contactName} · {new Date(ticket.updatedAt).toLocaleString()}</p>
                  </div>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[ticket.status]}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                {lastMsg && (
                  <p className="text-gray-400 text-xs truncate">{lastMsg.direction === 'OUTBOUND' ? '↗ ' : '↙ '}{lastMsg.body}</p>
                )}
                <div className="flex gap-1.5 mt-1.5">
                  <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${CATEGORY_COLORS[ticket.category]}`}>
                    {ticket.category}
                  </span>
                  <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${PRIORITY_COLORS[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8">
          {selectedTicket ? (
            <div className="bg-midnight-800/80 border border-midnight-700 rounded-2xl flex flex-col h-[75vh]">
              <div className="px-4 py-3 border-b border-midnight-700 flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 bg-midnight-700 rounded-full flex items-center justify-center text-gold-500 text-sm font-bold flex-shrink-0">
                  {getContactName().charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{getContactName()}</p>
                  <p className="text-gray-500 text-[10px]">{selectedTicket.subject || `#${selectedTicket.id.slice(-7).toUpperCase()}`}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getContactPhone() && (
                    <a
                      href={whatsappUrl(getContactPhone(), `Hi ${getContactName()}, this is TaskIt support regarding ticket #${selectedTicket.id.slice(-7).toUpperCase()}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-500 transition-colors inline-flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.881 11.881 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  )}
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="bg-midnight-700 border border-midnight-600 text-gray-300 text-[10px] px-2 py-1 rounded-lg focus:outline-none"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              {selectedTicket.order && (
                <div className="px-4 py-2 bg-midnight-900/50 border-b border-midnight-700 flex items-center gap-2 text-[10px]">
                  <span className="text-gray-500">Linked order:</span>
                  <span className="text-purple-400 font-bold">#{selectedTicket.order.id.slice(-7).toUpperCase()}</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-400 truncate max-w-[200px]">{selectedTicket.order.errandDescription}</span>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedTicket.messages?.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      msg.direction === 'OUTBOUND'
                        ? 'bg-gold-500/15 border border-gold-500/20 rounded-br-sm'
                        : 'bg-midnight-700 border border-midnight-600 rounded-bl-sm'
                    }`}>
                      {msg.direction === 'OUTBOUND' && msg.sender && (
                        <p className="text-gold-500 text-[9px] font-bold mb-0.5">{msg.sender.name}</p>
                      )}
                      <p className="text-white text-sm whitespace-pre-wrap">{msg.body}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[9px] ${msg.direction === 'OUTBOUND' ? 'text-gold-500/60' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`text-[8px] px-1 py-0.5 rounded ${msg.channel === 'WHATSAPP' ? 'bg-green-500/15 text-green-400' : 'bg-blue-500/15 text-blue-400'}`}>
                          {msg.channel}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-4 py-3 border-t border-midnight-700 flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                  placeholder="Log a message (opens WhatsApp to send)..."
                  className="flex-1 bg-midnight-700 border border-midnight-600 text-white text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50 placeholder:text-gray-600"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMsg.trim()}
                  className="bg-gold-500 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-gold-400 disabled:opacity-40 transition-colors flex-shrink-0"
                >
                  Log
                </button>
                {getContactPhone() && (
                  <a
                    href={whatsappUrl(getContactPhone(), newMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-green-500 transition-colors flex-shrink-0 inline-flex items-center gap-1 ${!newMsg.trim() ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.881 11.881 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Send
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-midnight-800/50 border border-midnight-700 rounded-2xl flex items-center justify-center h-[75vh]">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500 text-sm">Select a ticket to view conversation</p>
                <p className="text-gray-600 text-xs mt-1">Or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
