"use client";

import { useEffect, useState } from 'react';

const TYPE_ICONS: Record<string, string> = {
  ORDER: '📦',
  PAYMENT: '💳',
  PROMO: '🎉',
  SYSTEM: '⚙️',
  INFO: 'ℹ️',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => setNotifications(data.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAllRead = async () => {
    setMarkingRead(true);
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
    setMarkingRead(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="px-6 pt-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-gray-400 text-sm mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} disabled={markingRead} className="text-gold-500 text-sm font-semibold hover:underline disabled:opacity-50">
            {markingRead ? 'Marking...' : 'Mark all read'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-8 text-center">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-midnight-800/50 border border-dashed border-midnight-700 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-2">🔔</p>
          <p className="text-gray-500 text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="relative space-y-4">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-midnight-700" />

          {notifications.map((notif) => (
            <div key={notif.id} className="relative flex items-start space-x-4 pl-6">
              <div className={`absolute left-0 top-2 w-6 h-6 rounded-full flex items-center justify-center border-2 ${notif.read ? 'border-midnight-700 bg-midnight-800' : 'border-gold-500 bg-midnight-950 shadow-[0_0_10px_rgba(212,175,55,0.2)]'}`}>
                {!notif.read && <div className="w-2 h-2 bg-gold-500 rounded-full" />}
              </div>

              <div className={`flex-1 p-4 rounded-2xl border shadow-soft-dark ${notif.read ? 'bg-midnight-800 border-midnight-700 opacity-70' : 'bg-midnight-800 border-midnight-600'}`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg">{TYPE_ICONS[notif.type] || 'ℹ️'}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{notif.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{notif.body}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-[10px] mt-2 text-right">
                  {new Date(notif.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })} · {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
