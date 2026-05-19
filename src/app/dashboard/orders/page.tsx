import Link from 'next/link';

const MOCK_ORDERS = [
  { id: 'TSK-901', zone: 'Nairobi CBD', status: 'In Transit', price: 150 },
  { id: 'TSK-902', zone: 'Westlands', status: 'Delivered', price: 250 },
  { id: 'TSK-903', zone: 'Eastleigh', status: 'Delivered', price: 300 },
  { id: 'TSK-904', zone: 'Ngara', status: 'Cancelled', price: 300 },
];

export default function OrdersPage() {
  return (
    <div className="pb-24">
      <div className="p-6 pt-8">
        <h1 className="text-2xl font-serif font-bold text-white">My Orders</h1>
        <p className="text-gray-400 text-sm mt-1">Track your active and past errands</p>
      </div>

      <div className="px-6 space-y-3">
        {MOCK_ORDERS.map((order) => {
          let statusColor = 'bg-gray-500/20 text-gray-400';
          let borderColor = 'border-midnight-700';
          if (order.status === 'In Transit') {
            statusColor = 'bg-gold-500/20 text-gold-500';
            borderColor = 'border-gold-500/50'; // Highlight active orders
          } else if (order.status === 'Delivered') {
            statusColor = 'bg-green-500/20 text-green-400';
          } else if (order.status === 'Cancelled') {
            statusColor = 'bg-red-500/20 text-red-400';
          }

          return (
            <Link href={'/dashboard/orders/' + order.id} key={order.id} className={`block bg-midnight-800 p-4 rounded-2xl border ${borderColor} shadow-soft-dark transition-transform active:scale-[0.98]`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-sm text-gray-400">{order.id}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">{order.zone}</span>
                <span className="text-white font-bold">Ksh {order.price}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
