'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  Building,
  User,
  LogOut,
  Settings as SettingsIcon,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { cn } from '@/lib/utils';
import { NotificationPanel } from './notification-panel';

export function Topbar() {
  const router = useRouter();
  const {
    organization,
    user,
    logout,
    theme,
    toggleTheme,
    openQuickCreate,
    setCommandPaletteOpen,
    unreadNotificationCount,
  } = useCRM();

  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4 md:px-6 shadow-xs">
      {/* Left: Global Search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex h-10 w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--muted-foreground)] hover:border-amber-500/50 hover:bg-[var(--card)] transition-colors focus:outline-hidden focus:ring-1 focus:ring-amber-500"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
            <span className="truncate">Search leads, contacts, deals, tasks...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--muted-foreground)] shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Create Menu */}
        <div className="relative">
          <button
            onClick={() => openQuickCreate('lead')}
            aria-label="Quick create new record"
            className="btn-primary"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">Quick Create</span>
          </button>
        </div>

        {/* Currency & Org Badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-bold text-[var(--foreground)]">{organization.name}</span>
          <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-mono font-bold text-amber-400">
            {organization.currency_symbol} {organization.currency}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" /> : <Moon className="h-4 w-4 text-slate-700" aria-hidden="true" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!isNotifOpen)}
            aria-label="Open notifications"
            className="btn-icon relative"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-slate-950 shadow-xs animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <NotificationPanel onClose={() => setNotifOpen(false)} />
          )}
        </div>

        {/* User Profile Menu & Superior Switcher */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-[var(--card)] p-1.5 hover:border-amber-500 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-xs font-bold text-slate-950 shadow-sm">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden xl:flex flex-col text-left text-xs leading-tight">
              <span className="font-bold text-[var(--foreground)]">{user.name}</span>
              <span className="text-[10px] text-amber-500 font-semibold">{user.crm_role}</span>
            </div>
            <ChevronDown className="hidden xl:block h-3.5 w-3.5 text-[var(--muted-foreground)]" />
          </button>

          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2.5 border-b border-[var(--border)] bg-[var(--muted)]/40 rounded-xl">
                  <p className="text-xs font-bold text-[var(--foreground)]">{user.name}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)] truncate">{user.email}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="inline-block rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                      {user.crm_role}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]">ID: {user.employee_id}</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                  >
                    <SettingsIcon className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                    Organization & Employee Roster
                  </Link>
                  <Link
                    href="/ai"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-amber-500 hover:bg-amber-500/10 transition-colors font-medium"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    AI Assistant Hub
                  </Link>
                </div>

                <div className="border-t border-[var(--border)] pt-1">
                  <button
                    onClick={handleSignOut}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors'
                    )}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
