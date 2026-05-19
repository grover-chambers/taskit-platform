"use client";

import Link from 'next/link';

const MOCK_TRANSACTIONS = [
  { id: 'TXN-101', order: 'TSK-901', desc: 'Errand - Nairobi CBD', amount: -150, status: 'Paid', date: 'Today, 10:30 AM' },
  { id: 'TXN-102', order: 'TSK-899', desc: 'Errand - Westlands', amount: -250, status: 'Paid', date: 'Yesterday, 02:15 PM' },
  { id: 'TXN-103', order: 'REF-001', desc: 'Referral Bonus', amount: 100, status: 'Credited', date: 'Apr 20, 09:00 AM' },
];

export default function WalletPage() {
  return (
    <div className="px-6 pt-4">
      <div className="bg-midnight-800 border border-midnight-700 p-6 rounded-2xl shadow-soft-dark mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full -mr-10 -mt-10"></div>
        <p className="text-gray-400 text-sm mb-1">Total Spent this Month</p>
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Ksh 4,500</h2>
        <div className="bg-midnight-900 border border-midnight-700 rounded-xl p-3 flex items-center space-x-2">
          <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
          <span className="text-white text-sm font-semibold">Apply Promo Code</span>
        </div>
      </div>

      <h3 className="text-white font-bold text-lg mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {MOCK_TRANSACTIONS.map((txn) => (
          <div key={txn.id} className="bg-midnight-800 border border-midnight-700 p-4 rounded-2xl shadow-soft-dark">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">{txn.date}</span>
              <span className={`text-sm font-bold ${txn.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                {txn.amount > 0 ? '+' : ''} Ksh {Math.abs(txn.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-white font-semibold">{txn.desc}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${txn.amount > 0 ? 'bg-green-900/30 text-green-400' : 'bg-midnight-700 text-gray-300'}`}>
                {txn.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
