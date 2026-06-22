"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const URGENCY_OPTIONS = [
  { value: 'NORMAL', label: 'Normal', desc: 'Within 2 hours', icon: '🕐', multiplier: 1 },
  { value: 'URGENT', label: 'Urgent', desc: 'Within 1 hour', icon: '⚡', multiplier: 1.5 },
  { value: 'EXPRESS', label: 'Express', desc: 'Within 30 min', icon: '🔥', multiplier: 2 },
];

interface Zone {
  id: string;
  name: string;
  price: number;
}

interface ErrandType {
  id: string;
  name: string;
  icon: string;
}

export default function ErrandForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [zones, setZones] = useState<Zone[]>([]);
  const [errandTypes, setErrandTypes] = useState<ErrandType[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedType, setSelectedType] = useState('');
  const [customType, setCustomType] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('NORMAL');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [instructions, setInstructions] = useState('');
  const [transactionCode, setTransactionCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetch('/api/zones').then(r => r.json()).then(d => setZones(d.zones || [])).catch(() => {});
    fetch('/api/errand-types').then(r => r.json()).then(d => setErrandTypes(d.types || [])).catch(() => {});
  }, []);

  const typeLabel = selectedType === 'Custom' ? customType : errandTypes.find(t => t.name === selectedType)?.icon + ' ' + selectedType;
  const totalPrice = selectedZone ? Math.round(selectedZone.price * (URGENCY_OPTIONS.find(u => u.value === urgency)?.multiplier || 1)) : 0;

  const handleSubmit = async () => {
    if (!transactionCode || !selectedZone) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneId: selectedZone.id,
          errandDescription: `[${typeLabel}] ${description}`,
          totalAmount: totalPrice,
          orderType: 'ERRAND',
          pickupLocation: pickup || undefined,
          dropoffLocation: dropoff || undefined,
          contactPhone: contactPhone || undefined,
          specialInstructions: instructions || undefined,
          urgency,
          mpesaTransactionCode: transactionCode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard/orders');
      } else {
        setSubmitError(data.error || 'Failed to place order');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex space-x-2 mb-8">
      {[1, 2, 3, 4].map(s => (
        <div key={s} className={`h-1 flex-1 rounded-full transition-all ${step >= s ? 'bg-gold-500' : 'bg-midnight-700'}`} />
      ))}
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-6 pt-6">
      <StepIndicator />

      {/* STEP 1: Select Zone */}
      {step === 1 && (
        <section>
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">📍</div>
            <h2 className="text-2xl font-serif font-bold text-white">Select Zone</h2>
            <p className="text-gray-400 text-sm mt-1">Flat-rate pricing upfront</p>
          </div>
          <div className="space-y-3">
            {zones.map(zone => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between bg-midnight-800
                  ${selectedZone?.id === zone.id ? 'border-gold-500 shadow-[0_0_15px_rgba(255,215,0,0.15)]' : 'border-midnight-700 hover:border-midnight-600'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${selectedZone?.id === zone.id ? 'bg-gold-500/20' : 'bg-midnight-700'}`}>
                    🏙️
                  </div>
                  <span className="font-semibold text-white">{zone.name}</span>
                </div>
                <span className="font-bold text-gold-500 bg-midnight-900 px-3 py-1 rounded-lg border border-midnight-700">KSh {zone.price}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => selectedZone && setStep(2)}
            disabled={!selectedZone}
            className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold mt-6 disabled:opacity-30 transition-all hover:bg-gold-400 active:scale-[0.98]"
          >
            Continue
          </button>
        </section>
      )}

      {/* STEP 2: Describe Errand */}
      {step === 2 && (
        <section>
          <button onClick={() => setStep(1)} className="text-gold-500 text-sm font-medium hover:underline mb-4 inline-block">← Change Zone</button>
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">📝</div>
            <h2 className="text-2xl font-serif font-bold text-white">Describe Errand</h2>
            <p className="text-gray-400 text-sm mt-1">What do you need done?</p>
          </div>
          <div className="bg-midnight-800 border border-midnight-700 rounded-2xl p-5 space-y-5">
            <div>
              <label className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2 block">Errand Type</label>
              <div className="grid grid-cols-3 gap-2">
                {errandTypes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedType(t.name); setCustomType(''); }}
                    className={`p-3 rounded-xl border text-center transition-all ${selectedType === t.name ? 'border-gold-500 bg-gold-500/10' : 'border-midnight-700 bg-midnight-900 hover:border-midnight-600'}`}
                  >
                    <div className="text-xl mb-1">{t.icon}</div>
                    <div className="text-xs text-white font-medium">{t.name}</div>
                  </button>
                ))}
              </div>
            </div>
            {selectedType === 'Custom' && (
              <div>
                <label className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2 block">Custom Errand Name</label>
                <input
                  type="text"
                  value={customType}
                  onChange={e => setCustomType(e.target.value)}
                  placeholder="e.g., Return a rented item"
                  className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2 block">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g., Pick up blue envelope from Office 402, Kenyatta Avenue. The receptionist has it under my name..."
                className="w-full bg-midnight-900 border border-midnight-700 text-white p-4 rounded-xl outline-none resize-none h-28 placeholder:text-midnight-600 focus:border-gold-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2 block">Urgency</label>
              <div className="space-y-2">
                {URGENCY_OPTIONS.map(u => (
                  <button
                    key={u.value}
                    onClick={() => setUrgency(u.value)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${urgency === u.value ? 'border-gold-500 bg-gold-500/10' : 'border-midnight-700 bg-midnight-900 hover:border-midnight-600'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{u.icon}</span>
                      <div className="text-left">
                        <div className="text-white text-sm font-semibold">{u.label}</div>
                        <div className="text-gray-500 text-xs">{u.desc}</div>
                      </div>
                    </div>
                    {u.multiplier > 1 && (
                      <span className="text-gold-500 text-xs font-bold bg-midnight-800 px-2 py-1 rounded border border-midnight-700">x{u.multiplier}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => setStep(3)}
            disabled={!selectedType || !description || (selectedType === 'Custom' && !customType)}
            className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold mt-6 disabled:opacity-30 transition-all hover:bg-gold-400 active:scale-[0.98]"
          >
            Continue
          </button>
        </section>
      )}

      {/* STEP 3: Insert Particulars */}
      {step === 3 && (
        <section>
          <button onClick={() => setStep(2)} className="text-gold-500 text-sm font-medium hover:underline mb-4 inline-block">← Edit Description</button>
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">📍</div>
            <h2 className="text-2xl font-serif font-bold text-white">Insert Particulars</h2>
            <p className="text-gray-400 text-sm mt-1">Where should we go and who to contact?</p>
          </div>
          <div className="bg-midnight-800 border border-midnight-700 rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2 block">Pickup Location</label>
              <input
                type="text"
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                placeholder="e.g., Tuskys Supermarket, Kenyatta Ave"
                className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2 block">Drop-off Location</label>
              <input
                type="text"
                value={dropoff}
                onChange={e => setDropoff(e.target.value)}
                placeholder="e.g., I&M Tower, 14th Floor, Room 4B"
                className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2 block">Your Phone Number</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="e.g., 0712 345 678"
                className="w-full bg-midnight-900 border border-midnight-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2 block">Special Instructions <span className="text-gray-500 normal-case">(optional)</span></label>
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g., Ask for Jane at the counter, fragile contents..."
                className="w-full bg-midnight-900 border border-midnight-700 text-white p-4 rounded-xl outline-none resize-none h-20 placeholder:text-midnight-600 focus:border-gold-500 transition-colors"
              />
            </div>
          </div>
          <button
            onClick={() => setStep(4)}
            disabled={!dropoff}
            className="w-full bg-gold-500 text-midnight-950 py-4 rounded-2xl font-bold mt-6 disabled:opacity-30 transition-all hover:bg-gold-400 active:scale-[0.98]"
          >
            Confirm & Pay
          </button>
        </section>
      )}

      {/* STEP 4: Confirm & Pay */}
      {step === 4 && selectedZone && (
        <section>
          <button onClick={() => setStep(3)} className="text-gold-500 text-sm font-medium hover:underline mb-4 inline-block">← Edit Particulars</button>
          <div className="text-center mb-4">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-2xl font-serif font-bold text-white">Confirm & Pay</h2>
            <p className="text-gray-400 text-sm mt-1">Review your errand before paying</p>
          </div>

          {submitError && (
            <div className="bg-red-900/30 text-red-400 text-sm text-center p-3 rounded-xl mb-4">{submitError}</div>
          )}

          <div className="bg-midnight-800 border border-midnight-700 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center text-sm pb-3 border-b border-midnight-700">
              <span className="text-gray-400">Zone</span>
              <span className="font-semibold text-white">{selectedZone.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-3 border-b border-midnight-700">
              <span className="text-gray-400">Errand</span>
              <span className="font-semibold text-white">{typeLabel}</span>
            </div>
            <div className="flex justify-between items-start text-sm pb-3 border-b border-midnight-700">
              <span className="text-gray-400">Description</span>
              <span className="font-semibold text-white text-right max-w-[65%]">{description}</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-3 border-b border-midnight-700">
              <span className="text-gray-400">Urgency</span>
              <span className="font-semibold text-white">{URGENCY_OPTIONS.find(u => u.value === urgency)?.icon} {URGENCY_OPTIONS.find(u => u.value === urgency)?.label}</span>
            </div>
            {pickup && (
              <div className="flex justify-between items-center text-sm pb-3 border-b border-midnight-700">
                <span className="text-gray-400">Pickup</span>
                <span className="font-semibold text-white text-right max-w-[65%]">{pickup}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm pb-3 border-b border-midnight-700">
              <span className="text-gray-400">Drop-off</span>
              <span className="font-semibold text-white text-right max-w-[65%]">{dropoff}</span>
            </div>
            {contactPhone && (
              <div className="flex justify-between items-center text-sm pb-3 border-b border-midnight-700">
                <span className="text-gray-400">Phone</span>
                <span className="font-semibold text-white">{contactPhone}</span>
              </div>
            )}
            {instructions && (
              <div className="flex justify-between items-start text-sm pb-3 border-b border-midnight-700">
                <span className="text-gray-400">Instructions</span>
                <span className="font-semibold text-white text-right max-w-[65%]">{instructions}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-white text-lg">Total</span>
              <span className="font-bold text-gold-500 text-2xl">KSh {totalPrice}</span>
            </div>
          </div>

          <div className="bg-gold-500/10 border border-gold-500/30 p-5 rounded-2xl space-y-3 mt-5">
            <h3 className="text-gold-500 font-bold text-lg">Pay via M-Pesa</h3>
            <div className="space-y-1.5 text-white text-sm">
              <p>1. Go to M-Pesa on your phone</p>
              <p>2. Select <span className="font-bold">Lipa na M-Pesa</span></p>
              <p>3. Enter Till Number: <span className="font-bold text-gold-500">123456</span></p>
              <p>4. Enter Amount: <span className="font-bold text-gold-500">KSh {totalPrice}</span></p>
              <p>5. Complete payment and get your Transaction Code</p>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold text-gray-400 block mb-2">M-Pesa Transaction Code</label>
            <input
              type="text"
              value={transactionCode}
              onChange={e => setTransactionCode(e.target.value.toUpperCase())}
              placeholder="e.g., SHK5G4R2VN"
              required
              className="w-full bg-midnight-800 border border-midnight-700 text-white px-4 py-4 rounded-2xl focus:outline-none focus:border-gold-500 transition-colors placeholder:text-midnight-600 text-center text-lg font-mono tracking-widest"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !transactionCode}
            className="w-full bg-gold-500 text-midnight-950 py-5 rounded-2xl font-bold text-lg mt-5 disabled:opacity-50 transition-all hover:bg-gold-400 active:scale-[0.98] flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-midnight-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Submit Order'
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">Payment will be verified by our team shortly</p>
        </section>
      )}
    </div>
  );
}
