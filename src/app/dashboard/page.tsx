"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CustomerDashboard() {
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comingSoon, setComingSoon] = useState<string | null>(null);
  const [otpBanner, setOtpBanner] = useState<{ otp: string; orderId: string; description: string } | null>(null);

  useEffect(() => {
    const load = () => {
      fetch('/api/orders?role=customer')
        .then(r => r.json())
        .then(data => {
          const active = data.orders?.filter(
            (o: any) => !['DELIVERED', 'CANCELLED'].includes(o.status)
          ) || [];
          setActiveOrders(active);
          const inTransitWithOtp = active.find((o: any) => o.status === 'IN_TRANSIT' && o.deliveryOtp);
          if (inTransitWithOtp) {
            setOtpBanner({ otp: inTransitWithOtp.deliveryOtp, orderId: inTransitWithOtp.id, description: inTransitWithOtp.errandDescription });
          } else {
            setOtpBanner(null);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-6 pt-4 pb-24">
      {comingSoon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setComingSoon(null)}>
          <div className="bg-midnight-800 border border-midnight-700 rounded-2xl p-8 text-center max-w-xs mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-5xl mb-4">🚧</div>
            <h3 className="text-white font-bold text-lg mb-2">Coming Soon</h3>
            <p className="text-gray-400 text-sm mb-4">{comingSoon} is under development. Stay tuned!</p>
            <button onClick={() => setComingSoon(null)} className="bg-gold-500 text-midnight-950 px-6 py-2 rounded-xl font-bold text-sm hover:bg-gold-400 transition-colors">Got it</button>
          </div>
        </div>
      )}

      {/* Delivery OTP Banner */}
      {otpBanner && (
        <Link href={`/dashboard/orders/${otpBanner.orderId}`} className="block bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-gold-500/20 border border-gold-500/40 rounded-2xl p-4 mb-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gold-500 animate-pulse" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gold-500 text-[10px] font-bold uppercase tracking-wider">Delivery OTP</p>
              <p className="text-gray-300 text-xs mt-0.5 truncate max-w-[55%]">{otpBanner.description}</p>
              <p className="text-gray-500 text-[9px] mt-0.5">Rider is on the way — share this code to confirm delivery</p>
            </div>
            <div className="bg-midnight-950/60 border border-gold-500/50 rounded-xl px-4 py-2 text-center">
              <p className="text-gold-500 text-2xl font-bold font-mono tracking-[0.4em]">{otpBanner.otp}</p>
            </div>
          </div>
        </Link>
      )}

      {/* Search Bar */}
      <div className="bg-midnight-800 border border-midnight-700 rounded-xl px-4 py-3 flex items-center gap-2 mb-5">
        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-gray-500 text-sm">Search services, vendors, errands...</span>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/book/errand" className="relative bg-midnight-800 border border-midnight-700 rounded-2xl p-4 hover:border-gold-500/50 transition-all active:scale-[0.98] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold-500" />
          <div className="text-2xl mb-2">🏃</div>
          <div className="text-white text-sm font-bold mb-0.5">Run an Errand</div>
          <div className="text-gray-400 text-xs">From KSh 150 flat rate</div>
        </Link>
        <Link href="/book/marketplace" className="relative bg-midnight-800 border border-midnight-700 rounded-2xl p-4 hover:border-orange-500/50 transition-all active:scale-[0.98] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-500" />
          <div className="text-2xl mb-2">🛒</div>
          <div className="text-white text-sm font-bold mb-0.5">Marketplace</div>
          <div className="text-gray-400 text-xs">Order & get delivered</div>
        </Link>
        <button onClick={() => setComingSoon('Hire a Pro')} className="relative bg-midnight-800 border border-midnight-700 rounded-2xl p-4 hover:border-blue-500/50 transition-all active:scale-[0.98] overflow-hidden text-left">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />
          <div className="text-2xl mb-2">🔧</div>
          <div className="text-white text-sm font-bold mb-0.5">Hire a Pro</div>
          <div className="text-gray-400 text-xs">Plumber, cleaner, fundi</div>
          <span className="absolute top-2 right-2 text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">SOON</span>
        </button>
        <button onClick={() => setComingSoon('Big Delivery')} className="relative bg-midnight-800 border border-midnight-700 rounded-2xl p-4 hover:border-purple-500/50 transition-all active:scale-[0.98] overflow-hidden text-left">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-purple-500" />
          <div className="text-2xl mb-2">🚛</div>
          <div className="text-white text-sm font-bold mb-0.5">Big Delivery</div>
          <div className="text-gray-400 text-xs">Powered by KaniniOS</div>
          <span className="absolute top-2 right-2 text-[9px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-bold">SOON</span>
        </button>
      </div>

      {/* Active Orders */}
      <div className="mb-6">
        <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Active Orders</div>
        {loading ? (
          <div className="text-gray-500 text-sm py-4 text-center">Loading orders...</div>
        ) : activeOrders.length === 0 ? (
          <div className="bg-midnight-800/50 border border-dashed border-midnight-700 rounded-2xl p-6 text-center">
            <p className="text-gray-500 text-sm">No active orders</p>
            <Link href="/book/errand" className="text-gold-500 text-sm font-semibold mt-1 inline-block hover:underline">Book your first errand</Link>
          </div>
        ) : (
          activeOrders.map((order: any) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="bg-midnight-800 border border-midnight-700 rounded-2xl p-4 flex items-center gap-3 hover:border-gold-500/50 transition-all mb-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center text-lg flex-shrink-0">
                {order.shop ? '🛒' : '🏃'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-semibold truncate">{order.errandDescription}</div>
                <div className="text-gray-400 text-xs mt-0.5">
                  {order.rider ? `Rider: ${order.rider.name}` : order.zone?.name || ''}
                  {order.totalAmount > 0 ? ` · KSh ${order.totalAmount}` : ''}
                </div>
              </div>
              <span className="text-[10px] font-bold bg-gold-500/15 text-gold-500 px-2 py-1 rounded-md">
                {order.status === 'IN_TRANSIT' ? 'Live ›' : order.status === 'ACCEPTED' ? 'Accepted' : order.status}
              </span>
            </Link>
          ))
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/book/errand" className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex items-center gap-3 hover:border-gold-500 transition-colors">
          <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-xl flex items-center justify-center text-lg">📋</div>
          <div>
            <div className="text-white text-sm font-semibold">Book Errand</div>
            <div className="text-gray-400 text-[10px]">Flat rate, instant dispatch</div>
          </div>
        </Link>
        <Link href="/dashboard/orders" className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex items-center gap-3 hover:border-gold-500 transition-colors">
          <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-xl flex items-center justify-center text-lg">📦</div>
          <div>
            <div className="text-white text-sm font-semibold">My Orders</div>
            <div className="text-gray-400 text-[10px]">Track all your errands</div>
          </div>
        </Link>
      </div>

      {/* Support + WhatsApp */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link
          href="/dashboard/support"
          className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl flex items-center gap-3 hover:border-gold-500 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center text-lg">📧</div>
          <div>
            <div className="text-white text-sm font-semibold">Email Support</div>
            <div className="text-gray-400 text-[10px]">Create & track tickets</div>
          </div>
        </Link>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254797100144'}?text=${encodeURIComponent('Hi TaskIt Support, I need help')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-midnight-800 border border-[#25D366]/30 p-4 rounded-2xl flex items-center gap-3 hover:border-[#25D366]/60 transition-colors"
        >
          <div className="w-10 h-10 bg-[#25D366]/20 text-[#25D366] rounded-xl flex items-center justify-center text-lg">💬</div>
          <div>
            <div className="text-[#25D366] text-sm font-semibold">WhatsApp</div>
            <div className="text-gray-400 text-[10px]">Chat with us live</div>
          </div>
        </a>
      </div>

      {/* Referral Card */}
      <div className="bg-midnight-800 border border-midnight-700 p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full -mr-10 -mt-10" />
        <h3 className="text-gold-500 font-bold text-base mb-1">Earn KSh 100</h3>
        <p className="text-gray-400 text-sm">Invite a friend and get KSh 100 credit for your next errand.</p>
      </div>
    </div>
  );
}
