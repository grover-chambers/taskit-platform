import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative flex flex-col">

      {/* Background — hero image fades into solid dark */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/70 via-midnight-950/90 to-midnight-950" />
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div className="relative z-10 flex-1 max-w-lg mx-auto w-full px-5 pt-14 pb-36">

        {/* ── HERO ── */}
        <div className="text-center mb-14">
          {/* Logo mark */}
          <div className="w-20 h-20 bg-gold-500 rounded-2xl flex items-center justify-center shadow-gold mb-6 mx-auto">
            <svg className="w-10 h-10 text-midnight-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Live pill */}
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/25 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-gold-500 text-xs font-bold tracking-widest uppercase">Now Live in Nairobi</span>
          </div>

          <h1 className="text-6xl font-serif font-bold text-white tracking-tight leading-none">TaskIt</h1>
          <p className="text-gold-500 mt-2 text-sm font-bold uppercase tracking-[0.25em]">Nairobi Errands &amp; Delivery</p>
          <p className="text-gray-300 mt-5 text-base leading-relaxed max-w-xs mx-auto">
            We run your errands so you don't have to. Book in seconds, pay via M-Pesa, track in real time.
          </p>

          {/* Stats strip */}
          <div className="mt-8 grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {[
              { num: '500+', label: 'Errands Done' },
              { num: '8', label: 'Nairobi Zones' },
              { num: 'Ksh 150', label: 'Starting From' },
            ].map(({ num, label }) => (
              <div key={label} className="bg-midnight-900/80 py-4 px-2 text-center">
                <div className="text-gold-500 font-serif text-2xl font-bold">{num}</div>
                <div className="text-gray-400 text-xs mt-0.5 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section className="mb-14">
          <p className="text-gold-500 text-xs font-bold uppercase tracking-widest text-center mb-2">Simple Process</p>
          <h2 className="text-2xl font-serif font-bold text-white text-center mb-8">How TaskIt Works</h2>

          <div className="space-y-3">
            {[
              {
                step: '01',
                title: 'Book Your Errand',
                desc: 'Choose your zone, describe what you need done, and see the flat-rate price upfront — no surprises.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                ),
              },
              {
                step: '02',
                title: 'Pay via M-Pesa',
                desc: 'Tap to pay with your M-Pesa PIN — no card, no bank app. Instant confirmation sent to your phone.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
              {
                step: '03',
                title: 'Rider Picks Up & Delivers',
                desc: 'A verified TaskIt rider is assigned instantly. Track your order status from Received to Delivered.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M10 12v4m4-4v4" />
                ),
              },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="flex gap-4 items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/25 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold-500/50 text-xs font-bold font-mono">{step}</span>
                    <h3 className="text-white font-bold text-base">{title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ZONE PRICING ── */}
        <section className="mb-14">
          <p className="text-gold-500 text-xs font-bold uppercase tracking-widest text-center mb-2">Flat-Rate Pricing</p>
          <h2 className="text-2xl font-serif font-bold text-white text-center mb-2">Know Before You Book</h2>
          <p className="text-gray-400 text-sm text-center mb-7">No meters, no guesswork. One price per zone, always.</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { zone: 'CBD', areas: 'City Centre, Kencom, GPO', price: 150 },
              { zone: 'Ngara / Gikomba', areas: 'Kamukunji, Ngara, River Road', price: 300 },
              { zone: 'Westlands / Kilimani', areas: 'Upperhill, Riverside, Lavington', price: 400 },
              { zone: 'Eastleigh / Thika Rd', areas: 'Ngong Rd, Buruburu, Embakasi', price: 500 },
            ].map(({ zone, areas, price }, i) => (
              <div
                key={zone}
                className={`rounded-2xl border p-4 ${i === 0 ? 'bg-gold-500/10 border-gold-500/40' : 'bg-white/5 border-white/10'}`}
              >
                <div className="text-xs font-bold text-gold-500/70 uppercase tracking-wider mb-1">{zone}</div>
                <div className="text-white font-serif text-3xl font-bold mb-1">
                  {price}<span className="text-sm font-sans font-normal text-gray-400"> Ksh</span>
                </div>
                <div className="text-gray-400 text-xs leading-relaxed">{areas}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <div className="text-white text-sm font-semibold">Outside these zones?</div>
              <div className="text-gray-400 text-xs">Call us on <a href="tel:0707075630" className="text-gold-500 font-semibold">0707 075 630</a> for a custom quote.</div>
            </div>
          </div>
        </section>

        {/* ── WHAT WE DO ── */}
        <section className="mb-14">
          <p className="text-gold-500 text-xs font-bold uppercase tracking-widest text-center mb-2">Our Services</p>
          <h2 className="text-2xl font-serif font-bold text-white text-center mb-7">What Can We Run For You?</h2>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'Bill Payments',
                desc: 'KPLC, water, rent — we queue so you don\'t.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
              },
              {
                label: 'Shopping & Pickup',
                desc: 'Market runs, supermarket, hardware.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
              },
              {
                label: 'Document Delivery',
                desc: 'Contracts, letters, ID — handled with care.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />,
              },
              {
                label: 'Parcel & Delivery',
                desc: 'Same-day drop-off across Nairobi.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12" />,
              },
              {
                label: 'Office Errands',
                desc: 'Printing, stationery, courier runs.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
              },
              {
                label: 'Custom Errand',
                desc: 'Anything else — just describe it.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />,
              },
            ].map(({ label, desc, icon }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
                <div className="w-9 h-9 rounded-xl bg-gold-500/15 flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                </div>
                <div className="text-white font-bold text-sm">{label}</div>
                <div className="text-gray-400 text-xs leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY TASKIT ── */}
        <section className="mb-14">
          <p className="text-gold-500 text-xs font-bold uppercase tracking-widest text-center mb-2">Built for Nairobi</p>
          <h2 className="text-2xl font-serif font-bold text-white text-center mb-7">Why TaskIt?</h2>

          <div className="space-y-3">
            {[
              {
                title: 'M-Pesa First, Always',
                desc: 'Pay with your phone PIN — no card, no bank app required. The way Nairobi actually pays.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
              },
              {
                title: 'No Hidden Costs',
                desc: 'Zone-based flat rates mean you see the full price before you commit. What you see is what you pay.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
              },
              {
                title: 'Works on 3G',
                desc: 'Built as a PWA — fast and reliable even on slow connections. Gikomba to Westlands, same experience.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />,
              },
              {
                title: 'Verified Riders',
                desc: 'Every TaskIt rider is vetted, trained, and accountable. Your errand — and your items — are in safe hands.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
              },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="flex gap-4 items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/25 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── RIDE WITH US CTA ── */}
        <section className="mb-14">
          <div className="relative rounded-2xl border border-gold-500/25 bg-gold-500/8 overflow-hidden p-6">
            {/* Subtle glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white font-serif font-bold text-xl mb-2">Earn with TaskIt</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Got a bike or a courier bag? Join our rider network and earn flexible income across Nairobi. Set your own hours.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-gold-500 text-midnight-950 px-5 py-3 rounded-xl font-bold text-sm shadow-gold hover:bg-gold-400 transition-colors"
              >
                Apply as a Rider
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="mb-10 text-center">
          <h2 className="text-xl font-serif font-bold text-white mb-2">Get in Touch</h2>
          <p className="text-gray-400 text-sm mb-4">Questions? Corporate bookings? We're one call away.</p>
          <a
            href="tel:0707075630"
            className="inline-flex items-center gap-2 text-gold-500 font-bold text-lg hover:text-gold-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            0707 075 630
          </a>

          {/* Hidden admin link disguised as copyright */}
          <p className="text-gray-700 text-xs mt-8">
            &copy; <Link href="/admin/login" className="hover:text-gray-500 transition-colors">{new Date().getFullYear()}</Link> TaskIt by Squareroot INC. All rights reserved.
          </p>
        </section>

      </div>

      {/* ── STICKY BOTTOM BAR — unchanged ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-md border-t border-midnight-700 p-4 z-50">
        <div className="max-w-lg mx-auto flex space-x-3">
          <Link
            href="/auth/login"
            className="flex-1 bg-midnight-800 text-white border border-midnight-700 py-4 rounded-2xl font-bold text-center text-lg hover:bg-midnight-700 transition-colors active:scale-[0.98]"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="flex-1 bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold text-center text-lg shadow-gold hover:bg-gold-400 transition-colors active:scale-[0.98]"
          >
            Join Us
          </Link>
        </div>
      </div>

    </div>
  );
}
