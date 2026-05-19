import Link from 'next/link';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'order', text: 'Rider Kamau has picked up your errand TSK-901.', time: '2m ago', read: false },
  { id: 2, type: 'promo', text: 'Get 10% off deliveries to Westlands this weekend!', time: '1h ago', read: false },
  { id: 3, type: 'payment', text: 'M-Pesa payment of Ksh 150 confirmed for TSK-901.', time: '3h ago', read: true },
  { id: 4, type: 'system', text: 'Welcome to TaskIt! Your account is set up.', time: '1d ago', read: true },
];

export default function NotificationsPage() {
  return (
    <div className="px-6 pt-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-white">Notifications</h1>
        <button className="text-gold-500 text-sm font-semibold hover:underline">Mark all read</button>
      </div>

      <div className="relative space-y-4">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-midnight-700"></div>

        {MOCK_NOTIFICATIONS.map((notif) => (
          <div key={notif.id} className="relative flex items-start space-x-4 pl-6">
            {/* Dot */}
            <div className={`absolute left-0 top-2 w-6 h-6 rounded-full flex items-center justify-center border-2 ${notif.read ? 'border-midnight-700 bg-midnight-800' : 'border-gold-500 bg-midnight-950 shadow-gold'}`}>
              {!notif.read && <div className="w-2 h-2 bg-gold-500 rounded-full"></div>}
            </div>
            
            {/* Card */}
            <div className={`flex-1 p-4 rounded-2xl border shadow-soft-dark ${notif.read ? 'bg-midnight-800 border-midnight-700 opacity-70' : 'bg-midnight-800 border-midnight-600'}`}>
              <p className="text-white text-sm font-medium">{notif.text}</p>
              <p className="text-gray-500 text-xs mt-2">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
