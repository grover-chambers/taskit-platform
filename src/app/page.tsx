import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased relative flex flex-col">
      
      {/* Hero Background Image (15% visible at top, fading to solid) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/80 via-midnight-950/85 to-midnight-950"></div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 max-w-lg mx-auto w-full px-6 pt-16 pb-32">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gold-500 rounded-2xl flex items-center justify-center shadow-gold mb-6 mx-auto">
            <svg className="w-10 h-10 text-midnight-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-serif font-bold text-white tracking-tight">TaskIt</h1>
          <p className="text-gold-500 mt-2 text-lg font-semibold uppercase tracking-widest">Nairobi Errands</p>
          <p className="text-gray-300 mt-6 text-lg leading-relaxed max-w-xs mx-auto">
            We run your errands, so you don't have to. Fast, reliable, and seamless.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-white text-center mb-6">Why Choose TaskIt?</h2>
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Flat-Rate Zone Pricing</h3>
                <p className="text-gray-300 text-sm mt-1">No hidden fees. Know exactly what you pay before you book.</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">One-Tap M-Pesa</h3>
                <p className="text-gray-300 text-sm mt-1">Seamless STK Push checkout. Pay securely from your phone.</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Real-Time Tracking</h3>
                <p className="text-gray-300 text-sm mt-1">From rider assignment to delivery, you are always in the loop.</p>
              </div>
            </div>
          </div>
        </div>

        {/* For Riders Section */}
        <div className="mb-12 bg-gold-500/10 border border-gold-500/30 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full -mr-10 -mt-10"></div>
          <h2 className="text-gold-500 font-bold text-2xl mb-2 font-serif">For Riders</h2>
          <p className="text-gray-200 text-sm mb-4">Turn your smartphone into a money-making machine. Flexible hours, reliable payouts.</p>
          <Link href="/auth/signup" className="inline-block bg-gold-500 text-midnight-950 px-6 py-2 rounded-xl font-bold text-sm shadow-gold hover:bg-gold-400 transition-colors">
            Join as a Rider
          </Link>
        </div>

        {/* Contact / About */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-300 text-sm mb-2">Have questions or a corporate inquiry?</p>
          <a href="tel:0707075630" className="text-gold-500 font-semibold hover:underline text-lg">0707 075 630</a>
          <p className="text-gray-500 text-xs mt-6">&copy; {new Date().getFullYear()} TaskIt by Squareroot INC. All rights reserved.</p>
        </div>

      </div>

      {/* Sticky Bottom Action Bar */}
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
