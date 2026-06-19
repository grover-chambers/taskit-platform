import Link from 'next/link';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 relative z-10">
        {children}
      </main>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-md border-t border-midnight-800 z-50">
        <div className="max-w-lg mx-auto flex justify-between items-center px-6 py-3">
          <Link href="/vendor" className="flex flex-col items-center w-1/4 text-gold-500">
            <span className="text-lg">📋</span>
            <span className="text-[9px] mt-0.5 font-semibold text-gold-500">Orders</span>
          </Link>
          <Link href="/vendor" className="flex flex-col items-center w-1/4 text-gray-500 hover:text-gray-300">
            <span className="text-lg">🛍️</span>
            <span className="text-[9px] mt-0.5 font-semibold">Menu</span>
          </Link>
          <Link href="/vendor" className="flex flex-col items-center w-1/4 text-gray-500 hover:text-gray-300">
            <span className="text-lg">📊</span>
            <span className="text-[9px] mt-0.5 font-semibold">Earnings</span>
          </Link>
          <Link href="/vendor" className="flex flex-col items-center w-1/4 text-gray-500 hover:text-gray-300">
            <span className="text-lg">⚙️</span>
            <span className="text-[9px] mt-0.5 font-semibold">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
