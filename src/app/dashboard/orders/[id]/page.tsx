import Link from 'next/link';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  // In a real app, fetch order details from Supabase using params.id
  const order = {
    id: params.id,
    status: 'In Transit',
    zone: 'Nairobi CBD',
    errand: 'Pick up blue envelope from Office 402, Ambank House',
    price: 150,
    rider: 'Kamau M.',
    riderPhone: '+254712345678',
  };

  return (
    <div className="pb-24">
      <div className="bg-midnight-900 border-b border-midnight-700 p-6 pt-8 flex justify-between items-center sticky top-0 z-10">
        <Link href="/dashboard/orders" className="text-gray-400 hover:text-gold-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h1 className="text-lg font-bold text-white">Order Details</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-midnight-800 p-6 rounded-2xl border border-gold-500/50 shadow-gold text-center">
          <p className="text-gold-500 font-bold text-lg uppercase tracking-wider">{order.status}</p>
          <p className="text-gray-400 text-sm mt-1">Estimated arrival: 15 mins</p>
        </div>

        <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark space-y-4">
          <div>
            <p className="text-xs text-gold-500 uppercase tracking-wider font-semibold mb-1">Errand</p>
            <p className="text-white font-medium">{order.errand}</p>
          </div>
          <div className="border-t border-midnight-700 pt-4">
            <p className="text-xs text-gold-500 uppercase tracking-wider font-semibold mb-1">Zone</p>
            <p className="text-white font-medium">{order.zone}</p>
          </div>
          <div className="border-t border-midnight-700 pt-4">
            <p className="text-xs text-gold-500 uppercase tracking-wider font-semibold mb-1">Payment</p>
            <p className="text-white font-medium">M-Pesa - Ksh {order.price}</p>
          </div>
        </div>

        <div className="bg-midnight-800 p-6 rounded-2xl border border-midnight-700 shadow-soft-dark flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-midnight-700 rounded-full flex items-center justify-center text-gold-500 font-bold text-xl">
              K
            </div>
            <div>
              <p className="text-white font-semibold">{order.rider}</p>
              <p className="text-gray-400 text-sm">Your Rider</p>
            </div>
          </div>
          <a href={'tel:' + order.riderPhone} className="bg-gold-500/20 text-gold-500 p-3 rounded-full hover:bg-gold-500 hover:text-midnight-950 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
