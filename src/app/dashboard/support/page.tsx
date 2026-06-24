"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-blue-500/15 text-blue-400',
  IN_PROGRESS: 'bg-yellow-500/15 text-yellow-400',
  RESOLVED: 'bg-green-500/15 text-green-400',
  CLOSED: 'bg-gray-500/15 text-gray-400',
};

const CATEGORIES = [
  { value: 'GENERAL', label: 'General' },
  { value: 'ORDER', label: 'Order Issue' },
  { value: 'PAYMENT', label: 'Payment' },
  { value: 'RIDER', label: 'Rider Complaint' },
  { value: 'VENDOR', label: 'Vendor Issue' },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254797100144';

export default function CustomerSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch('/api/support');
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTickets();
    fetch('/api/orders?role=customer')
      .then(r => r.json())
      .then(data => setOrders(data.orders || []))
      .catch(() => {});
  }, [fetchTickets]);

  const fetchTicketDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/support/${id}`);
      const data = await res.json();
      setSelectedTicket(data.ticket);
    } catch {}
  }, []);

  useEffect(() => {
    if (selectedTicket) fetchTicketDetail(selectedTicket.id);
  }, [selectedTicket?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages?.length]);

  const handleReply = async () => {
    if (!newMsg.trim() || !selectedTicket) return;
    try {
      const res = await fetch(`/api/support/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMsg.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data.ticket);
        setNewMsg('');
        fetchTickets();
      }
    } catch {}
  };

  const handleCreateTicket = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      subject: (fd.get('subject') as string) || 'Support Request',
      category: fd.get('category') as string,
      priority: fd.get('priority') as string,
      orderId: fd.get('orderId') as string || undefined,
      message: fd.get('message') as string,
    };

    if (!body.message?.trim()) return;

    try {
      const res = await fetch('/api/support', {
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-gray-500">Loading support...</p></div>;
  }

  return (
    <div className="px-6 pt-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-white">Support</h1>
          <p className="text-gray-500 text-[10px]">{tickets.length} tickets</p>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className="bg-gold-500 text-black px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-gold-400 transition-colors"
        >
          + New
        </button>
      </div>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi TaskIt Support, I need help')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/30 p-3 rounded-2xl mb-4 hover:bg-[#25D366]/15 transition-colors"
      >
        <div className="w-9 h-9 bg-[#25D366]/20 text-[#25D366] rounded-xl flex items-center justify-center text-base flex-shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.881 11.881 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </div>
        <div className="flex-1">
          <div className="text-[#25D366] text-sm font-semibold">WhatsApp Support</div>
          <div className="text-gray-400 text-[10px]">Quick replies via WhatsApp</div>
        </div>
        <svg className="w-4 h-4 text-[#25D366]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </a>

      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70" onClick={() => setShowNewTicket(false)}>
          <div className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-md p-5" onClick={e => e.stopPropagation()}>
            <h2 className="text-white font-bold text-base mb-3">New Support Ticket</h2>
            <form onSubmit={handleCreateTicket} className="space-y-2.5">
              <input name="subject" placeholder="Subject (optional)" className="w-full bg-midnight-800 border border-midnight-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-gold-500/50 placeholder:text-gray-600" />
              <div className="grid grid-cols-2 gap-2.5">
                <select name="category" className="bg-midnight-800 border border-midnight-700 text-gray-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <select name="priority" className="bg-midnight-800 border border-midnight-700 text-gray-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50">
                  <option value="NORMAL">Normal</option>
                  <option value="LOW">Low</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              {orders.length > 0 && (
                <select name="orderId" className="w-full bg-midnight-800 border border-midnight-700 text-gray-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50">
                  <option value="">No linked order</option>
                  {orders.map((o: any) => (
                    <option key={o.id} value={o.id}>{o.errandDescription?.slice(0, 40)}... — {o.status}</option>
                  ))}
                </select>
              )}
              <textarea name="message" required rows={3} placeholder="Describe your issue..." className="w-full bg-midnight-800 border border-midnight-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-gold-500/50 placeholder:text-gray-600 resize-none" />
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowNewTicket(false)} className="px-3 py-1.5 rounded-xl text-xs text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-gold-500 text-black px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-gold-400 transition-colors">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTicket ? (
        <div className="bg-midnight-800/80 border border-midnight-700 rounded-2xl flex flex-col h-[65vh]">
          <div className="px-4 py-3 border-b border-midnight-700 flex items-center gap-3 flex-shrink-0">
            <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{selectedTicket.subject || `#${selectedTicket.id.slice(-7).toUpperCase()}`}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[selectedTicket.status]}`}>
                  {selectedTicket.status.replace('_', ' ')}
                </span>
                <span className="text-gray-500 text-[9px]">{selectedTicket.category}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedTicket.messages?.map((msg: any) => (
              <div key={msg.id} className={`flex ${msg.direction === 'OUTBOUND' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                  msg.direction === 'OUTBOUND'
                    ? 'bg-midnight-700 border border-midnight-600 rounded-bl-sm'
                    : 'bg-gold-500/15 border border-gold-500/20 rounded-br-sm'
                }`}>
                  {msg.direction === 'OUTBOUND' && msg.sender && (
                    <p className="text-gold-500 text-[9px] font-bold mb-0.5">{msg.sender.name || 'Support'}</p>
                  )}
                  <p className="text-white text-sm whitespace-pre-wrap">{msg.body}</p>
                  <span className={`text-[9px] mt-1 block ${msg.direction === 'OUTBOUND' ? 'text-gray-500' : 'text-gold-500/60'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {selectedTicket.status !== 'CLOSED' && (
            <div className="px-4 py-3 border-t border-midnight-700 flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); }}}
                placeholder="Type a reply..."
                className="flex-1 bg-midnight-700 border border-midnight-600 text-white text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50 placeholder:text-gray-600"
              />
              <button
                onClick={handleReply}
                disabled={!newMsg.trim()}
                className="bg-gold-500 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-gold-400 disabled:opacity-40 transition-colors flex-shrink-0"
              >
                Send
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.length === 0 && (
            <div className="bg-midnight-800/50 border border-dashed border-midnight-700 rounded-2xl p-8 text-center">
              <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500 text-sm mb-1">No support tickets yet</p>
              <p className="text-gray-600 text-xs">Need help? Create a ticket or WhatsApp us</p>
            </div>
          )}
          {tickets.map((ticket) => {
            const lastMsg = ticket.messages?.[0];
            return (
              <button
                key={ticket.id}
                onClick={() => { setSelectedTicket(ticket); fetchTicketDetail(ticket.id); }}
                className="w-full text-left bg-midnight-800 border border-midnight-700 rounded-2xl p-3.5 hover:border-gold-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-bold truncate">{ticket.subject || `Ticket #${ticket.id.slice(-7).toUpperCase()}`}</p>
                    <p className="text-gray-500 text-[10px]">{new Date(ticket.updatedAt).toLocaleString()}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[ticket.status]}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                {lastMsg && (
                  <p className="text-gray-400 text-xs truncate">{lastMsg.direction === 'OUTBOUND' ? '↙ ' : '↗ '}{lastMsg.body}</p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
