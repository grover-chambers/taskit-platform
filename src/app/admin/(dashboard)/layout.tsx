import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-midnight-950 antialiased flex relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-midnight-950/85"></div>
      </div>

      <aside className="relative z-10 w-64 bg-midnight-900/80 backdrop-blur-md border-r border-midnight-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <h1 className="text-3xl font-bold text-brand-500 font-serif">TaskIt</h1>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Admin Console</p>
          
          <nav className="mt-10 space-y-2">
            <Link href="/admin" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <span className="font-semibold">Command Center</span>
            </Link>
            <Link href="/admin/riders" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <span className="font-semibold">Fleet & Riders</span>
            </Link>
            <Link href="/admin/orders" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <span className="font-semibold">Orders & Disputes</span>
            </Link>
            <Link href="/admin/finance" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <span className="font-semibold">Finance</span>
            </Link>
            <Link href="/admin/config" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-midnight-800 hover:text-white transition-colors">
              <span className="font-semibold">Platform Config</span>
            </Link>
          </nav>
        </div>
        
        <div className="border-t border-midnight-700 pt-4 space-y-2">
          <p className="text-white text-sm font-semibold">{session.user?.name || 'Owner'}</p>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-red-400 text-sm hover:text-red-300 transition-colors">Sign Out</button>
          </form>
          <Link href="/" className="block text-gray-500 text-sm hover:text-gold-500 transition-colors">&larr; Back to Platform</Link>
        </div>
      </aside>

      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
