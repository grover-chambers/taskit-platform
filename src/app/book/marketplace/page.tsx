"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Zone {
  id: string;
  name: string;
  price: number;
}

export default function MarketplaceForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [shoppingList, setShoppingList] = useState('');
  const [budget, setBudget] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/zones').then(r => r.json()).then(d => setZones(d.zones || [])).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!selectedZone || !shoppingList) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneId: selectedZone.id,
          errandDescription: shoppingList,
          totalAmount: budget ? parseInt(budget) : 0,
          orderType: 'MARKETPLACE',
          dropoffLocation: dropoffAddress || undefined,
          contactPhone: contactPhone || undefined,
          specialInstructions: `Budget: KSh ${budget || 'Not specified'}\nShopping list below:`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error || 'Failed to submit');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-6 pt-16 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-serif font-bold text-white mb-2">Order Received!</h2>
        <p className="text-gray-400 text-sm mb-6">We've sent your shopping list to our vendor network. Sit back — we'll text or WhatsApp you when it's being prepared.</p>
        <div className="bg-midnight-800 border border-midnight-700 rounded-2xl p-5 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Zone</span>
            <span className="text-white font-semibold">{selectedZone?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Items</span>
            <span className="text-white font-semibold text-right max-w-[65%]">{shoppingList}</span>
          </div>
        </div>
        <button
          onClick={() => router.push('/dashboard/orders')}
          className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold hover:bg-gold-400 transition-all active:scale-[0.98]"
        >
          View My Orders
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full text-gray-400 py-4 font-semibold hover:text-white transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 pt-6">
      <div className="flex space-x-2 mb-8">
        {[1, 2].map(s => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-all ${step >= s ? 'bg-orange-500' : 'bg-midnight-700'}`} />
        ))}
      </div>

      {submitError && (
        <div className="bg-red-900/30 text-red-400 text-sm text-center p-3 rounded-xl mb-4">{submitError}</div>
      )}

      {/* STEP 1: Select Zone */}
      {step === 1 && (
        <section>
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🛒</div>
            <h2 className="text-2xl font-serif font-bold text-white">Select Zone</h2>
            <p className="text-gray-400 text-sm mt-1">Where should we shop for you?</p>
          </div>
          <div className="space-y-3">
            {zones.map(zone => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between bg-midnight-800
                  ${selectedZone?.id === zone.id ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'border-midnight-700 hover:border-midnight-600'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${selectedZone?.id === zone.id ? 'bg-orange-500/20' : 'bg-midnight-700'}`}>
                    🏙️
                  </div>
                  <span className="font-semibold text-white">{zone.name}</span>
                </div>
                <span className="font-bold text-orange-500 bg-midnight-900 px-3 py-1 rounded-lg border border-midnight-700">KSh {zone.price}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => selectedZone && setStep(2)}
            disabled={!selectedZone}
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold mt-6 disabled:opacity-30 transition-all hover:bg-orange-400 active:scale-[0.98]"
          >
            Continue
          </button>
        </section>
      )}

      {/* STEP 2: Shopping List + Details */}
      {step === 2 && selectedZone && (
        <section>
          <button onClick={() => setStep(1)} className="text-orange-500 text-sm font-medium hover:underline mb-4 inline-block">← Change Zone</button>
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">📋</div>
            <h2 className="text-2xl font-serif font-bold text-white">What Do You Need?</h2>
            <p className="text-gray-400 text-sm mt-1">List your items — we'll source them from the best vendors</p>
          </div>
          <div className="bg-midnight-800 border border-midnight-700 rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2 block">Shopping List</label>
              <textarea
                value={shoppingList}
                onChange={e => setShoppingList(e.target.value)}
                placeholder="e.g., 2kg sugar, 1 loaf bread, 3 tomatoes, 500g mince, milk 1L..."
                className="w-full bg-midnight-900 border border-midnight-700 text-white p-4 rounded-xl outline-none resize-none h-32 placeholder:text-midnight-600 focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2 block">Your Budget <span className="text-gray-500 normal-case">(approximate)</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">KSh</span>
                <input
                  type="number"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  placeholder="1500"
                  className="w-full bg-midnight-900 border border-midnight-700 text-white pl-14 pr-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder:text-midnight-600"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2 block">Drop-off Address</label>
              <input
                type="text"
                value={dropoffAddress}
                onChange={e => setDropoffAddress(e.target.value)}
                placeholder="e.g., Apartment 4B, Parklands"
                className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder:text-midnight-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2 block">Your Phone Number</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="e.g., 0712 345 678"
                className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 transition-colors placeholder:text-midnight-600"
              />
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl mt-4">
            <p className="text-gray-300 text-xs leading-relaxed">
              <span className="text-orange-500 font-bold">How it works:</span> We'll text or WhatsApp your list to our vendor in {selectedZone.name}. They'll confirm availability and pricing before you pay. No hidden fees.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !shoppingList}
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold mt-6 disabled:opacity-50 transition-all hover:bg-orange-400 active:scale-[0.98] flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Submit to Vendor'
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">We'll reach out via text or WhatsApp with pricing</p>
        </section>
      )}
    </div>
  );
}
