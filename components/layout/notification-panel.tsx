'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, TrendingUp, CheckSquare, Sparkles, AlertCircle, Info } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { formatRelativeTime } from '@/lib/utils';

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useCRM();

  const getIcon = (type: string) => {
    switch (type) {
      case 'deal':
        return <TrendingUp className="h-4 w-4 text-amber-500" />;
      case 'task':
        return <CheckSquare className="h-4 w-4 text-emerald-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 bg-[var(--muted)]/50">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">Notifications</h3>
          </div>
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1 text-[11px] font-medium text-amber-500 hover:text-amber-400 transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        </div>

        {/* List */}
        <div className="max-h-[380px] divide-y divide-[var(--border)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-[var(--muted)]/60 ${
                  !notif.read ? 'bg-amber-500/5' : ''
                }`}
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)] border border-[var(--border)]">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs ${!notif.read ? 'font-semibold text-[var(--foreground)]' : 'font-medium text-[var(--muted-foreground)]'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-[var(--muted-foreground)] shrink-0">
                      {formatRelativeTime(notif.created_at)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)] line-clamp-2">
                    {notif.message}
                  </p>
                  {notif.link && (
                    <Link
                      href={notif.link}
                      onClick={onClose}
                      className="mt-1.5 inline-block text-[11px] font-medium text-amber-500 hover:underline"
                    >
                      View details →
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
