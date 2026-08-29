'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users2,
  Contact,
  Building2,
  TrendingUp,
  Activity as ActivityIcon,
  CheckSquare,
  Calendar,
  BarChart3,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCRM } from '@/lib/store/crm-context';

export function Sidebar() {
  const pathname = usePathname();
  const { leads, deals, tasks, user, organization } = useCRM();
  const [collapsed, setCollapsed] = useState(false);

  // Load sidebar preference
  useEffect(() => {
    const saved = localStorage.getItem('forge_sidebar_collapsed');
    if (saved !== null) {
      setCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('forge_sidebar_collapsed', String(next));
  };

  const pendingLeadsCount = leads.filter((l) => l.status === 'new' || l.status === 'qualified').length;
  const activeDealsCount = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost').length;
  const openTasksCount = tasks.filter((t) => t.status !== 'completed').length;

  const navItems = [
    {
      title: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Leads',
      href: '/leads',
      icon: Users2,
      badge: pendingLeadsCount > 0 ? pendingLeadsCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-500 border border-amber-500/30',
    },
    {
      title: 'Contacts',
      href: '/contacts',
      icon: Contact,
    },
    {
      title: 'Companies',
      href: '/companies',
      icon: Building2,
    },
    {
      title: 'Deals',
      href: '/deals',
      icon: TrendingUp,
      badge: activeDealsCount > 0 ? activeDealsCount : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    },
    {
      title: 'Activities',
      href: '/activities',
      icon: ActivityIcon,
    },
    {
      title: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
      badge: openTasksCount > 0 ? openTasksCount : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      title: 'Calendar',
      href: '/calendar',
      icon: Calendar,
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: BarChart3,
    },
    {
      title: 'AI Hub',
      href: '/ai',
      icon: Sparkles,
      highlight: true,
    },
    {
      title: 'Organization',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r transition-all duration-300 z-30 select-none bg-[var(--sidebar-bg)] border-[var(--sidebar-border)] text-slate-200',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Brand Header with Official Company Logo */}
      <div className="flex h-20 items-center justify-between px-3 border-b border-[var(--sidebar-border)]">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden group">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-400/20 to-amber-600/10 p-0.5 border border-amber-500/40 shadow-lg">
              <img
                src="/brand/forgeconsultant-logo.png"
                alt="Forge Consultancy"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm tracking-wide text-amber-400 font-serif leading-tight">
                FORGE
              </span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-slate-300 uppercase">
                CONSULTANCY
              </span>
              <span className="text-[8px] font-mono text-amber-500/80 uppercase tracking-widest">
                EST. {organization.established}
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto flex items-center justify-center">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-400/20 to-amber-600/10 p-0.5 border border-amber-500/40 shadow-md">
              <img
                src="/brand/forgeconsultant-logo.png"
                alt="Forge Consultancy"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </Link>
        )}
      </div>

      {/* Collapse Toggle — aligned to header center (h-20 → top-10) */}
      <button
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow-md hover:bg-slate-800 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />}
      </button>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative',
                isActive
                  ? 'bg-amber-500/15 text-amber-400 font-semibold shadow-inner'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.title : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-amber-500" />
              )}
              
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-transform group-hover:scale-105',
                  isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200',
                  item.highlight && !isActive && 'text-amber-500'
                )}
              />

              {!collapsed && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="truncate">{item.title}</span>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide',
                        item.badgeColor
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="ml-2 rounded bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-300 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 border border-amber-500/40">
                      AI
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* User profile consolidated to topbar on desktop — keep only collapsed avatar to avoid duplication */}
      <div className="border-t border-[var(--sidebar-border)] p-3 hidden lg:block" aria-hidden="true">
        {collapsed && (
          <div className="flex justify-center">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-xs font-bold text-slate-950 shadow-sm"
              title={`${user.name} (${user.crm_role})`}
            >
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
