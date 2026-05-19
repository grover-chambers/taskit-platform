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
  const [isPaying, setIsPaying] = useState(false);

  const handleMpesaPay = async () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      alert('STK Push sent to your phone. Order is pending confirmation.');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-midnight-950 pb-24 antialiased">
      <div className="bg-midnight-900 border-b border-midnight-700 p-6 pt-8 flex justify-between items-center sticky top-0 z-10">
        <Link href="/dashboard" className="text-gray-400 hover:text-gold-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h1 className="text-lg font-bold text-white">New Errand</h1>
        <div className="w-6"></div>
      </div>

      <main className="max-w-lg mx-auto p-6 space-y-6">
        <div className="flex space-x-2">
          <div className={`h-1 w-1/3 rounded-full ${step >= 1 ? 'bg-gold-500' : 'bg-midnight-700'}`} />
          <div className={`h-1 w-1/3 rounded-full ${step >= 2 ? 'bg-gold-500' : 'bg-midnight-700'}`} />
          <div className={`h-1 w-1/3 rounded-full ${step >= 3 ? 'bg-gold-500' : 'bg-midnight-700'}`} />
        </div>

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
                    ${selectedZone?.id === zone.id ? 'border-gold-500 shadow-gold' : 'border-midnight-700 hover:border-midnight-600'}`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{zone.icon}</span>
                    <span className="font-semibold text-white">{zone.name}</span>
                  </div>
                  <span className="font-bold text-gold-500 bg-midnight-900 px-3 py-1 rounded-lg border border-midnight-700">Ksh {zone.price}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && selectedZone && (
          <section className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-white">Errand Details</h2>
              <p className="text-gray-400 text-sm mt-1">Tell us exactly what you need done</p>
            </div>
            
            <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
              <div>
                <label className="text-xs font-bold text-gold-500 uppercase tracking-wider">Description</label>
                <textarea 
                  value={errandDesc}
                  onChange={(e) => setErrandDesc(e.target.value)}
                  placeholder="e.g., Pick up blue envelope from Office 402..."
                  className="w-full mt-2 text-white bg-midnight-900 p-4 rounded-xl outline-none resize-none h-28 placeholder:text-midnight-600 border border-midnight-700 focus:border-gold-500 transition-colors"
                />
              </div>
            </div>
            
            <button 
              onClick={() => setStep(3)} 
              disabled={!errandDesc}
              className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold mt-4 disabled:opacity-30 transition-all hover:bg-gold-400 active:scale-[0.98] shadow-gold"
            >
              Continue
            </button>
            <button onClick={() => setStep(1)} className="w-full text-center text-gold-500 text-sm font-medium py-2 hover:underline">Change Zone</button>
          </section>
        )}

        {step === 3 && selectedZone && (
          <section className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-white">Confirm & Pay</h2>
              <p className="text-gray-400 text-sm mt-1">Review your errand details</p>
            </div>
            
            <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
              <div className="flex justify-between items-center text-sm pb-4 border-b border-midnight-700">
                <span className="text-gray-400">Zone</span>
                <span className="font-semibold text-white">{selectedZone.name}</span>
              </div>
              <div className="flex justify-between items-start text-sm pb-4 border-b border-midnight-700">
                <span className="text-gray-400">Errand</span>
                <span className="font-semibold text-white text-right max-w-[70%]">{errandDesc}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-white text-lg">Total</span>
                <span className="font-bold text-gold-500 text-2xl">Ksh {selectedZone.price}</span>
              </div>
            </div>

            <button 
              onClick={handleMpesaPay}
              disabled={isPaying}
              className="w-full bg-gold-500 text-midnight-950 py-5 rounded-2xl font-bold text-lg shadow-gold disabled:opacity-80 transition-all hover:bg-gold-400 active:scale-[0.98] flex justify-center items-center space-x-2"
            >
              {isPaying ? (
                <div className="w-6 h-6 border-2 border-midnight-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Pay with M-Pesa</span>
              )}
            </button>
            <button onClick={() => setStep(2)} className="w-full text-center text-gold-500 text-sm font-medium py-2 hover:underline">Edit Details</button>
          </section>
        )}
      </main>
    </div>
  );
}
