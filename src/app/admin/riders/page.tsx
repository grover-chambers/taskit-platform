"use client";

export default function FleetManagement() {
  const riders = [
    { name: 'Kamau M.', plate: 'KBA 123J', status: 'Online', rating: 4.9, verified: true },
    { name: 'Otieno D.', plate: 'KCD 456L', status: 'Offline', rating: 4.7, verified: true },
    { name: 'Mwangi F.', plate: 'KBJ 789P', status: 'Pending KYC', rating: 0, verified: false },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Fleet & Rider Management</h1>

      {/* KYC Approvals */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gold-500 mb-4 flex items-center space-x-2">
          <span>Pending Verifications</span>
          <span className="bg-gold-500 text-midnight-950 text-xs px-2 py-0.5 rounded-full font-bold">1</span>
        </h2>
        <div className="bg-gold-500/5 border border-gold-500/30 p-6 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-white font-bold text-lg">Mwangi F.</p>
            <p className="text-gray-400 text-sm">Plate: KBJ 789P &middot; License: 987654321</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-red-600/20 text-red-400 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-600/40 transition-colors">Reject</button>
            <button className="bg-gold-500 text-midnight-950 px-4 py-2 rounded-lg font-bold text-sm shadow-gold hover:bg-gold-400 transition-colors">Approve</button>
          </div>
        </div>
      </div>

      {/* Rider List */}
      <h2 className="text-xl font-bold text-white mb-4">Active Fleet</h2>
      <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl border border-midnight-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-midnight-900/50 border-b border-midnight-700">
            <tr>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Rider</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Plate</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Status</th>
              <th className="p-4 text-gray-400 text-xs uppercase tracking-wider">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-midnight-700">
            {riders.filter(r => r.verified).map((rider) => (
              <tr key={rider.plate} className="hover:bg-midnight-800/50 transition-colors">
                <td className="p-4 text-white font-semibold text-sm">{rider.name}</td>
                <td className="p-4 text-gray-300 font-mono text-sm">{rider.plate}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${rider.status === 'Online' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                    {rider.status}
                  </span>
                </td>
                <td className="p-4 text-gold-500 font-semibold text-sm">★ {rider.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
