import BottomNav from '@/components/BottomNav';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex flex-col relative">
      {/* Fixed Background (15% Visible) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-xs">Good morning</p>
          <h1 className="text-lg font-serif font-bold text-white">Hello, Brayo</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/notifications" className="relative text-gray-400 hover:text-gold-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-gold-500 rounded-full"></span>
          </Link>
          <div className="w-9 h-9 bg-midnight-800 border border-midnight-700 rounded-full flex items-center justify-center">
            <span className="text-gold-500 font-bold text-sm">B</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-28 relative z-10">
        {children}
      </main>

      <div className="relative z-50">
        <BottomNav />
      </div>
    </div>
  );
}
