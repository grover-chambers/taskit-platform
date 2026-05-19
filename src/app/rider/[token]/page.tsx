"use client";
export default function RiderJobView({ params }: { params: { token: string } }) {
  const orderDetails = {
    id: 'TSK-901',
    pickup: 'Pickup: Blue envelope from Office 402, Ambank House, CBD',
    dropoff: 'Dropoff: Customer Wanjiku, Moi Avenue',
    customerPhone: '+254712345678',
    status: 'assigned'
  };

  const handleStatusUpdate = (newStatus: string) => {
    alert('Order ' + orderDetails.id + ' marked as ' + newStatus);
  };

  return (
    <div className="min-h-screen bg-surface-100 flex flex-col items-center justify-center p-6 antialiased">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-xl font-bold text-brand-500">TaskIt Rider</h1>
          <p className="text-surface-500 text-sm mt-1">Order #{orderDetails.id}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-4 shadow-soft border border-surface-200 text-left">
          <div>
            <p className="text-xs text-brand-600 uppercase tracking-wider font-bold">Pickup</p>
            <p className="text-surface-900 mt-1 font-medium">{orderDetails.pickup}</p>
          </div>
          <div className="border-t border-surface-200"></div>
          <div>
            <p className="text-xs text-brand-600 uppercase tracking-wider font-bold">Drop-off</p>
            <p className="text-surface-900 mt-1 font-medium">{orderDetails.dropoff}</p>
          </div>
          <a href={'tel:' + orderDetails.customerPhone} className="block w-full text-center bg-surface-100 border border-surface-200 text-brand-600 py-3 rounded-xl font-semibold hover:bg-surface-200 transition-colors mt-2">
            Call Customer
          </a>
        </div>

        <div className="space-y-3">
          {orderDetails.status === 'assigned' && (
            <button 
              onClick={() => handleStatusUpdate('Picked Up')}
              className="w-full bg-brand-500 text-white py-5 rounded-2xl font-bold text-lg shadow-premium active:scale-95 transition-transform"
            >
              Mark as Picked Up
            </button>
          )}
          
          {orderDetails.status === 'picked_up' && (
            <button 
              onClick={() => handleStatusUpdate('Delivered')}
              className="w-full bg-brand-500 text-white py-5 rounded-2xl font-bold text-lg shadow-premium active:scale-95 transition-transform"
            >
              Mark as Delivered
            </button>
          )}

          {orderDetails.status === 'delivered' && (
            <div className="text-center p-6 bg-white rounded-2xl border border-surface-200 shadow-soft">
              <p className="text-brand-500 text-4xl mb-2">&#10003;</p>
              <p className="text-lg font-bold text-surface-900">Order Complete</p>
              <p className="text-surface-500 text-sm mt-1">Wait for the next assignment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
