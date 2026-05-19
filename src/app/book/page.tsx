"use client";

import { useState } from 'react';
import Link from 'next/link';

const ZONES = [
  { id: 'cbd', name: 'Nairobi CBD', price: 150, icon: '🏢' },
  { id: 'westlands', name: 'Westlands', price: 250, icon: '🍹' },
  { id: 'eastleigh', name: 'Eastleigh', price: 300, icon: '🛍️' },
  { id: 'ngara', name: 'Ngara / Kamukunji', price: 300, icon: '🏙️' },
];

export default function BookErrand() {
  const [step, setStep] = useState(1);
  const [selectedZone, setSelectedZone] = useState<typeof ZONES[0] | null>(null);
  const [errandDesc, setErrandDesc] = useState('');
  const [transactionCode, setTransactionCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionCode) return;
    setIsSubmitting(true);
    
    // In a real app, this calls our Next.js API to create the order in Neon
    console.log("Creating order with code:", transactionCode);
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Order submitted! We are verifying your M-Pesa payment.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-midnight-950 pb-24 antialiased">
      <div className="bg-midnight-900 border-b border-midnight-800 p-6 pt-8 flex justify-between items-center sticky top-0 z-10">
        <Link href="/dashboard" className="text-gray-400 hover:text-brand-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h1 className="text-lg font-bold text-white">New Errand</h1>
        <div className="w-6"></div>
      </div>

      <main className="max-w-lg mx-auto p-6 space-y-6">
        <div className="flex space-x-2">
          <div className={`h-1 w-1/3 rounded-full ${step >= 1 ? 'bg-brand-500' : 'bg-midnight-700'}`} />
          <div className={`h-1 w-1/3 rounded-full ${step >= 2 ? 'bg-brand-500' : 'bg-midnight-700'}`} />
          <div className={`h-1 w-1/3 rounded-full ${step >= 3 ? 'bg-brand-500' : 'bg-midnight-700'}`} />
        </div>

        {/* STEP 1 & 2 remain the same (Zone and Errand Description) */}
        {step === 1 && (
          <section className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-white">Select Zone</h2>
              <p className="text-gray-400 text-sm mt-1">Flat-rate pricing upfront</p>
            </div>
            <div className="space-y-3">
              {ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => { setSelectedZone(zone); setStep(2); }}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between bg-midnight-800
                    ${selectedZone?.id === zone.id ? 'border-brand-500 shadow-gold' : 'border-midnight-700 hover:border-midnight-600'}`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{zone.icon}</span>
                    <span className="font-semibold text-white">{zone.name}</span>
                  </div>
                  <span className="font-bold text-brand-500 bg-midnight-900 px-3 py-1 rounded-lg border border-midnight-700">Ksh {zone.price}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && selectedZone && (
          <section className="space-y-4">
            <button onClick={() => setStep(1)} className="text-brand-500 text-sm font-medium hover:underline">Change Zone</button>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-white">Errand Details</h2>
              <p className="text-gray-400 text-sm mt-1">Tell us exactly what you need done</p>
            </div>
            
            <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
              <div>
                <label className="text-xs font-bold text-brand-500 uppercase tracking-wider">Description</label>
                <textarea 
                  value={errandDesc}
                  onChange={(e) => setErrandDesc(e.target.value)}
                  placeholder="e.g., Pick up blue envelope from Office 402..."
                  className="w-full mt-2 text-white bg-midnight-900 p-4 rounded-xl outline-none resize-none h-28 placeholder:text-midnight-600 border border-midnight-700 focus:border-brand-500 transition-colors"
                />
              </div>
            </div>
            
            <button 
              onClick={() => setStep(3)} 
              disabled={!errandDesc}
              className="w-full bg-brand-500 text-midnight-950 py-4 rounded-2xl font-bold mt-4 disabled:opacity-30 transition-all hover:bg-brand-400 active:scale-[0.98] shadow-gold"
            >
              Continue to Pay
            </button>
          </section>
        )}

        {/* STEP 3: M-PESA MANUAL FLOW */}
        {step === 3 && selectedZone && (
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <button onClick={() => setStep(2)} type="button" className="text-brand-500 text-sm font-medium hover:underline">Edit Details</button>
            <div className="text-center mb-4">
              <h2 className="text-2xl font-serif font-bold text-white">Confirm & Pay</h2>
            </div>
            
            {/* Order Summary */}
            <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
              <div className="flex justify-between items-center text-sm pb-4 border-b border-midnight-700">
                <span className="text-gray-400">Zone</span>
                <span className="font-semibold text-white">{selectedZone.name}</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-4 border-b border-midnight-700">
                <span className="text-gray-400">Errand</span>
                <span className="font-semibold text-white text-right max-w-[70%] truncate">{errandDesc}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-white text-lg">Total</span>
                <span className="font-bold text-brand-500 text-2xl">Ksh {selectedZone.price}</span>
              </div>
            </div>

            {/* M-Pesa Instructions */}
            <div className="bg-brand-500/10 border border-brand-500/30 p-6 rounded-2xl space-y-4">
              <h3 className="text-brand-500 font-bold text-lg">Pay via M-Pesa</h3>
              <div className="space-y-2 text-white text-sm">
                <p>1. Go to M-Pesa on your phone</p>
                <p>2. Select <span className="font-bold">Lipa na M-Pesa</span></p>
                <p>3. Enter Till Number: <span className="font-bold text-brand-500">123456</span></p>
                <p>4. Enter Amount: <span className="font-bold text-brand-500">Ksh {selectedZone.price}</span></p>
                <p>5. Complete payment and get your Transaction Code</p>
              </div>
            </div>

            {/* Transaction Code Input */}
            <div>
              <label className="text-sm font-semibold text-gray-400 block mb-2">M-Pesa Transaction Code</label>
              <input 
                type="text" 
                value={transactionCode}
                onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                placeholder="e.g., SHK5G4R2VN"
                required
                className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-4 rounded-2xl focus:outline-none focus:border-brand-500 transition-colors placeholder:text-midnight-600 text-center text-lg font-mono tracking-widest"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !transactionCode}
              className="w-full bg-brand-500 text-midnight-950 py-5 rounded-2xl font-bold text-lg shadow-gold disabled:opacity-50 transition-all hover:bg-brand-400 active:scale-[0.98] flex justify-center items-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-midnight-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Submit Order</span>
              )}
            </button>
            <p className="text-center text-xs text-gray-500">Payment will be verified by our team shortly</p>
          </form>
        )}
      </main>
    </div>
  );
}
