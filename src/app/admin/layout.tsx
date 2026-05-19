import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex relative">
      {/* Fixed Background (15% Visible) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 bg-midnight-900/80 backdrop-blur-md border-r border-midnight-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <h1 className="text-3xl font-bold text-gold-500 font-serif">TaskIt</h1>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Admin Console</p>
          
          <nav className="mt-10 space-y-2">
            <Link href="/admin" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span className="font-semibold">Command Center</span>
            </Link>
            <Link href="/admin/riders" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="font-semibold">Fleet & Riders</span>
            </Link>
            <Link href="/admin/orders" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              <span className="font-semibold">Orders & Disputes</span>
            </Link>
            <Link href="/admin/finance" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="font-semibold">Finance</span>
            </Link>
            <Link href="/admin/config" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="font-semibold">Platform Config</span>
            </Link>
          </nav>
        </div>
        
        <div className="border-t border-midnight-700 pt-4">
          <Link href="/" className="text-gray-500 text-sm hover:text-gold-500 transition-colors">&larr; Back to Platform</Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-40 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800 px-8 py-4 flex justify-end items-center">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-semibold text-sm">TaskIt Owner</p>
              <p className="text-gray-500 text-xs">Super Admin</p>
            </div>
            <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-midnight-950 font-bold">O</div>
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
