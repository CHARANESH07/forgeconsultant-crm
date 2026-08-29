'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users2,
  CheckSquare,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
  Sparkles,
  ChevronRight,
  Clock,
  Building2,
  Activity as ActivityIcon,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useCRM } from '@/lib/store/crm-context';
import { formatCurrency, formatRelativeTime, cn } from '@/lib/utils';

export default function DashboardPage() {
  const {
    leads,
    deals,
    tasks,
    activities,
    companies,
    openQuickCreate,
    toggleTaskCompletion,
    currency,
    currencySymbol,
  } = useCRM();

  const [chartRange, setChartRange] = useState<'30d' | '90d' | '12m'>('90d');

  // KPI Calculations
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((l) => l.status === 'qualified').length;
  const leadConversionRate =
    totalLeads > 0 ? Math.round((leads.filter((l) => l.status === 'converted').length / totalLeads) * 100) : 0;

  const openDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
  const totalPipelineValue = openDeals.reduce((sum, d) => sum + d.amount, 0);
  const wonDeals = deals.filter((d) => d.stage === 'won');
  const totalWonRevenue = wonDeals.reduce((sum, d) => sum + d.amount, 0);

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const overdueTasks = tasks.filter((t) => t.status !== 'completed' && new Date(t.due_date) < new Date());
  const weightedPipelineValue = openDeals.reduce((sum, d) => sum + (d.amount * d.probability) / 100, 0);

  // Revenue & Forecast Chart — derived from real deal data (won revenue by closed month,
  // forecast from open pipeline by expected close month)
  const monthCount = chartRange === '30d' ? 3 : chartRange === '90d' ? 4 : 12;
  const now = new Date();
  const revenueChartData = Array.from({ length: monthCount }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (monthCount - 1 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-US', { month: 'short' });
    return {
      month: label,
      revenue: wonDeals
        .filter((deal) => (deal.closed_at ?? '').startsWith(key))
        .reduce((sum, deal) => sum + deal.amount, 0),
      forecast: openDeals
        .filter((deal) => (deal.expected_close_date ?? '').startsWith(key))
        .reduce((sum, deal) => sum + (deal.amount * deal.probability) / 100, 0),
    };
  });

  // Pipeline Stages distribution
  const stageCounts = {
    new: deals.filter((d) => d.stage === 'new'),
    discovery: deals.filter((d) => d.stage === 'discovery'),
    proposal: deals.filter((d) => d.stage === 'proposal'),
    negotiation: deals.filter((d) => d.stage === 'negotiation'),
    won: deals.filter((d) => d.stage === 'won'),
  };

  const pipelineBarData = [
    { stage: 'New', count: stageCounts.new.length, value: stageCounts.new.reduce((a, b) => a + b.amount, 0), color: '#94a3b8' },
    { stage: 'Discovery', count: stageCounts.discovery.length, value: stageCounts.discovery.reduce((a, b) => a + b.amount, 0), color: '#38bdf8' },
    { stage: 'Proposal', count: stageCounts.proposal.length, value: stageCounts.proposal.reduce((a, b) => a + b.amount, 0), color: '#f59e0b' },
    { stage: 'Negotiation', count: stageCounts.negotiation.length, value: stageCounts.negotiation.reduce((a, b) => a + b.amount, 0), color: '#fb923c' },
    { stage: 'Won', count: stageCounts.won.length, value: stageCounts.won.reduce((a, b) => a + b.amount, 0), color: '#10b981' },
  ];

  // Lead Source Breakdown — derived from real leads grouped by lead_source
  const sourceColors: Record<string, string> = {
    LinkedIn: '#0ea5e9',
    Referral: '#f59e0b',
    Website: '#10b981',
    Event: '#8b5cf6',
    'Cold Outreach': '#ec4899',
    Partner: '#14b8a6',
    Other: '#94a3b8',
  };
  const sourceMap = new Map<string, number>();
  leads.forEach((l) => sourceMap.set(l.lead_source, (sourceMap.get(l.lead_source) ?? 0) + 1));
  const leadSourceData = Array.from(sourceMap.entries()).map(([name, count]) => ({
    name,
    value: count,
    color: sourceColors[name] ?? '#94a3b8',
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
            Consulting Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Real-time pipeline health, advisory revenue forecasting, and executive action items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => openQuickCreate('lead')} aria-label="Create new lead" className="btn-primary">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> New Lead
          </button>
          <button onClick={() => openQuickCreate('deal')} aria-label="Create new opportunity" className="btn-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> New Opportunity
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Active Pipeline Value */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs transition-all hover:border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-tight text-[var(--muted-foreground)]">
              Active pipeline
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-[var(--foreground)]">
              {formatCurrency(totalPipelineValue, currency, currencySymbol)}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <span className="flex items-center font-semibold text-emerald-500">
                <ArrowUpRight className="h-3.5 w-3.5" /> {formatCurrency(weightedPipelineValue, currency, currencySymbol)}
              </span>
              <span className="text-[var(--muted-foreground)]">probability-weighted ({openDeals.length} active deals)</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Won Revenue */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs transition-all hover:border-emerald-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-tight text-[var(--muted-foreground)]">
              Won revenue (YTD)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-emerald-500">
              {formatCurrency(totalWonRevenue, currency, currencySymbol)}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <span className="flex items-center font-semibold text-emerald-500">
                <ArrowUpRight className="h-3.5 w-3.5" /> {wonDeals.length} deals closed
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Qualified Leads & Conversion */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs transition-all hover:border-blue-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-tight text-[var(--muted-foreground)]">
              Lead conversion
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Users2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[var(--foreground)]">
              {leadConversionRate}% <span className="text-xs font-normal text-[var(--muted-foreground)]">({qualifiedLeads} qualified)</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <span className="flex items-center font-semibold text-emerald-500">
                <ArrowUpRight className="h-3.5 w-3.5" /> {leads.filter((l) => l.status === 'converted').length} converted
              </span>
              <span className="text-[var(--muted-foreground)]">{totalLeads} total in pipeline</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Pending & Overdue Tasks */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs transition-all hover:border-red-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-tight text-[var(--muted-foreground)]">
              Tasks & follow-ups
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[var(--foreground)]">
              {pendingTasks.length} <span className="text-xs font-semibold text-amber-500">Due</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              {overdueTasks.length > 0 ? (
                <span className="flex items-center font-semibold text-red-400">
                  <AlertTriangle className="h-3.5 w-3.5 mr-0.5" /> {overdueTasks.length} Overdue
                </span>
              ) : (
                <span className="text-emerald-500 font-semibold">All tasks on schedule</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Stage Funnel Bar */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[var(--foreground)]">
              Sales pipeline stage distribution
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Real-time balance of consulting deals from discovery through final close.
            </p>
          </div>
          <Link
            href="/deals"
            aria-label="Open Kanban board"
            className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-500 shadow-2xs hover:bg-amber-500/20 transition-colors"
          >
            Open Kanban Board <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Progress Bar Segments */}
        <div className="h-3.5 w-full rounded-full bg-[var(--muted)] flex overflow-hidden p-0.5 gap-1">
          {pipelineBarData.map((stage) => {
            const pct = totalPipelineValue > 0 ? (stage.value / (totalPipelineValue + totalWonRevenue)) * 100 : 20;
            return (
              <div
                key={stage.stage}
                style={{ width: `${Math.max(pct, 8)}%`, backgroundColor: stage.color }}
                className="h-full rounded-xs transition-all"
                title={`${stage.stage}: ${formatCurrency(stage.value, currency, currencySymbol)} (${stage.count} deals)`}
              />
            );
          })}
        </div>

        {/* Stage Legend — tight to bar, value inline with status for proximity */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-[var(--border)]">
          {pipelineBarData.map((stage) => (
            <div
              key={stage.stage}
              className="flex items-center justify-between gap-2 rounded-lg bg-[var(--muted)]/40 px-2.5 py-1.5"
              title={`${stage.count} deals • ${formatCurrency(stage.value, currency, currencySymbol)}`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" aria-hidden="true" style={{ backgroundColor: stage.color }} />
                <span className="truncate text-xs font-semibold text-[var(--foreground)]">{stage.stage}</span>
              </div>
              <span className="shrink-0 text-xs font-mono font-bold text-amber-500">
                {formatCurrency(stage.value, currency, currencySymbol)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Charts & High Priority Workspaces */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Revenue & Forecast Chart */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-[var(--foreground)]">
                Revenue & advisory forecast
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">Actual closed revenue versus weighted opportunity forecast</p>
            </div>

            <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--muted)] p-1 text-xs" role="group" aria-label="Select time range">
              <button
                onClick={() => setChartRange('30d')}
                aria-pressed={chartRange === '30d'}
                className={cn('px-3 py-1 rounded-full border transition-colors', chartRange === '30d' ? 'border-amber-500/30 bg-[var(--card)] text-amber-500 font-bold shadow-2xs' : 'border-transparent bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--card)] hover:border-[var(--border)]')}
              >
                30 Days
              </button>
              <button
                onClick={() => setChartRange('90d')}
                aria-pressed={chartRange === '90d'}
                className={cn('px-3 py-1 rounded-full border transition-colors', chartRange === '90d' ? 'border-amber-500/30 bg-[var(--card)] text-amber-500 font-bold shadow-2xs' : 'border-transparent bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--card)] hover:border-[var(--border)]')}
              >
                90 Days
              </button>
              <button
                onClick={() => setChartRange('12m')}
                aria-pressed={chartRange === '12m'}
                className={cn('px-3 py-1 rounded-full border transition-colors', chartRange === '12m' ? 'border-amber-500/30 bg-[var(--card)] text-amber-500 font-bold shadow-2xs' : 'border-transparent bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--card)] hover:border-[var(--border)]')}
              >
                12 Months
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="forecast" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorForecast)" name="Forecast" />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Closed Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Lead Channels & AI Insights */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                Lead Acquisition Sources
              </h2>
              <span className="rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                Q3 Performance
              </span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">LinkedIn and Client Referrals drive 75% of high-intent consulting leads.</p>
          </div>

          <div className="my-2 h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border)]">
            {leadSourceData.map((src) => (
              <div key={src.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: src.color }} />
                <span className="text-[var(--foreground)] font-medium">{src.name}:</span>
                <span className="text-[var(--muted-foreground)] font-mono">{src.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Action Items (My Tasks) & Live CRM Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: My Actionable Tasks */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                Priority Action Items & Follow-ups
              </h2>
            </div>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              View All ({tasks.length}) →
            </Link>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 4).map((task) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border border-[var(--border)] p-3 transition-colors',
                    isDone ? 'bg-[var(--muted)]/40 opacity-70' : 'bg-[var(--card)] hover:border-amber-500/40'
                  )}
                >
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    role="checkbox"
                    aria-checked={isDone}
                    aria-label={isDone ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-[var(--border)] bg-[var(--card)] text-amber-500 hover:border-amber-500 hover:bg-amber-500/10 transition-colors"
                  >
                    {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn('text-xs font-semibold text-[var(--foreground)]', isDone && 'line-through text-[var(--muted-foreground)]')}>
                        {task.title}
                      </span>
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shrink-0',
                          task.priority === 'urgent'
                            ? 'bg-red-500/15 text-red-400'
                            : task.priority === 'high'
                            ? 'bg-amber-500/15 text-amber-500'
                            : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                        )}
                      >
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="mt-0.5 text-xs text-[var(--muted-foreground)] line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <Clock className="h-3 w-3 text-amber-500" aria-hidden="true" />
                      <span>Due {task.due_date} {task.due_time}</span>
                      {task.related_to_name && (
                        <span>• {task.related_to_name}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Real-time Activity Timeline */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ActivityIcon className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                Live Advisory Activity Stream
              </h2>
            </div>
            <Link
              href="/activities"
              className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              Full Stream →
            </Link>
          </div>

          <div className="space-y-3.5">
            {activities.slice(0, 4).map((act) => (
              <div key={act.id} className="flex items-start gap-3 relative">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] border border-[var(--border)] text-amber-500 shadow-2xs">
                  {act.type === 'meeting' ? (
                    <Calendar className="h-3.5 w-3.5" />
                  ) : act.type === 'deal_stage_changed' ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <Building2 className="h-3.5 w-3.5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-[var(--foreground)]">{act.title}</p>
                    <span className="text-[10px] text-[var(--muted-foreground)] shrink-0">
                      {formatRelativeTime(act.created_at)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                    {act.description}
                  </p>
                  {act.entity_name && (
                    <span className="mt-1 inline-block rounded bg-[var(--muted)] px-2 py-0.5 text-xs font-medium text-[var(--muted-foreground)]">
                      {act.entity_name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
