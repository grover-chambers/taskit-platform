"use client";

import { useState } from 'react';

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [hasJob, setHasJob] = useState(false);

  return (
    <div className="px-6 pt-4 pb-24">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Grace Kamau</h2>
            <p className="text-gray-500 text-[9.5px]">Rider ID: #R-0442</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gold-500">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" style={{animation: 'blink 1.4s ease-in-out infinite'}}></span>
            Online
          </div>
        </div>
      </div>

      {/* Online Toggle */}
      <button
        onClick={() => setIsOnline(!isOnline)}
        className={`w-full p-5 rounded-2xl border-2 flex justify-between items-center transition-all mb-5 ${
          isOnline ? 'bg-gold-500/10 border-gold-500' : 'bg-midnight-800 border-midnight-700'
        }`}
      >
        <div>
          <h3 className={`font-bold text-base ${isOnline ? 'text-gold-500' : 'text-white'}`}>
            {isOnline ? 'You are Online' : 'You are Offline'}
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">
            {isOnline ? 'Waiting for nearby errands...' : 'Go online to receive tasks'}
          </p>
        </div>
        <div className={`w-12 h-7 rounded-full relative transition-colors flex-shrink-0 ${isOnline ? 'bg-gold-500' : 'bg-midnight-600'}`}>
          <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 shadow transition-all ${isOnline ? 'right-0.5' : 'left-0.5'}`} />
        </div>
      </button>

      {/* Earnings Strip */}
      {isOnline && (
        <div className="bg-gradient-to-r from-midnight-900/80 to-midnight-950/80 border border-midnight-700 rounded-2xl p-4 flex justify-around mb-5">
          <div className="text-center">
            <div className="font-bold text-lg text-gold-500">KSh 1,840</div>
            <div className="text-[9px] text-gray-500 mt-0.5">Today&apos;s earnings</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-white">14</div>
            <div className="text-[9px] text-gray-500 mt-0.5">Trips done</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-yellow-500">⭐ 4.8</div>
            <div className="text-[9px] text-gray-500 mt-0.5">Rating</div>
          </div>
        </div>
      )}

      {/* Job Section */}
      {isOnline && !hasJob && (
        <div>
          <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-3">New Job Request</p>
          
          <div className="bg-midnight-800 border border-midnight-700 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-2.5 flex justify-between items-center">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Errand</span>
              <span className="font-bold text-base text-orange-400">KSh 180</span>
            </div>
            
            {/* Body */}
            <div className="px-4 py-3">
              <div className="flex gap-2.5 items-start mb-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white text-xs leading-relaxed">Tuskys Supermarket, Westlands</div>
                  <div className="text-gray-500 text-[9.5px] mt-0.5">Pickup — 0.4km away</div>
                </div>
              </div>
              <div className="border-l border-dashed border-midnight-600 h-2.5 ml-1 mb-2" />
              <div className="flex gap-2.5 items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white text-xs leading-relaxed">Parklands Road, Apt 4B</div>
                  <div className="text-gray-500 text-[9.5px] mt-0.5">Drop-off · Customer: Wanjiru N.</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => setHasJob(true)}
                className="flex-1 bg-gold-500 text-midnight-950 py-2.5 rounded-xl text-xs font-bold hover:bg-gold-400 transition-colors active:scale-[0.98]"
              >
                Accept — KSh 180
              </button>
              <button className="px-4 py-2.5 rounded-xl bg-midnight-700 text-gray-400 text-xs font-semibold border border-midnight-600 hover:text-white transition-colors">
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Job State */}
      {isOnline && hasJob && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🛵</div>
          <h3 className="text-white font-bold text-lg mb-1">Heading to Pickup</h3>
          <p className="text-gray-400 text-sm">Navigate to Tuskys, Westlands</p>
          <button
            onClick={() => setHasJob(false)}
            className="mt-6 bg-midnight-800 border border-midnight-700 text-gray-300 px-6 py-3 rounded-xl text-sm font-semibold hover:border-midnight-600 transition-colors"
          >
            Complete Delivery
          </button>
        </div>
      )}

      <style>{`
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
