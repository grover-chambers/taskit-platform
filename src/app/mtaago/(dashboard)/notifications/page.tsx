"use client";

import { useEffect, useState, useCallback } from 'react';
import { useEnterprise } from '../EnterpriseContext';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_ICONS: Record<string, string> = {
  ORDER: '📦',
  PAYMENT: '💰',
  SYSTEM: '⚙️',
  INFO: 'ℹ️',
};

export default function MtaaGoAlertsPage() {
  const { subRole, loading: roleLoading } = useEnterprise();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/vendor/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnread(data.unread || 0);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      await fetch('/api/vendor/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnread(0);
    } catch {}
  };

  const markRead = async (id: string) => {
    try {
      await fetch('/api/vendor/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const isOwner = subRole === 'OWNER';

  if (roleLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-haraka-500/30 border-t-haraka-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-xs">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isOwner ? 'space-y-4' : 'px-6 pt-6 pb-24'}>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-white font-bold text-xl">{isOwner ? 'Alerts' : 'Notifications'}</h1>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-haraka-500 text-xs font-bold hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {unread > 0 && (
        <div className="bg-haraka-500/10 border border-haraka-500/30 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-haraka-500 text-xs font-bold">{unread} unread</span>
          <button
            onClick={markAllRead}
            className="bg-haraka-500/15 text-haraka-500 px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-haraka-500/25 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔔</div>
          <h3 className="text-white font-bold text-base mb-1">No Notifications</h3>
          <p className="text-gray-400 text-sm">Dispatch alerts and updates will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <button
              key={n.id}
              onClick={() => !n.read && markRead(n.id)}
              className={`w-full text-left bg-midnight-800 border rounded-xl p-4 transition-colors ${
                n.read ? 'border-midnight-700 opacity-60' : 'border-haraka-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{TYPE_ICONS[n.type] || 'ℹ️'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-sm font-semibold ${n.read ? 'text-gray-400' : 'text-white'}`}>{n.title}</p>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-haraka-500 flex-shrink-0 ml-2" />}
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-2">{n.body}</p>
                  <p className="text-gray-600 text-[10px] mt-1">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
