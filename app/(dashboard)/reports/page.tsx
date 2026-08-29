'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  DollarSign,
  Download,
  Calendar,
  Users2,
  PieChart as PieIcon,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useCRM } from '@/lib/store/crm-context';
import { formatCurrency } from '@/lib/utils';

export default function ReportsPage() {
  const { deals, employees, currency, currencySymbol } = useCRM();

  const [reportPeriod, setReportPeriod] = useState<'q1' | 'q2' | 'q3' | 'ytd'>('q3');

  // Metrics
  const wonDeals = deals.filter((d) => d.stage === 'won');
  const wonAmount = wonDeals.reduce((sum, d) => sum + d.amount, 0);
  const openDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
  const openAmount = openDeals.reduce((sum, d) => sum + d.amount, 0);
  const lostDeals = deals.filter((d) => d.stage === 'lost');
  const lostAmount = lostDeals.reduce((sum, d) => sum + d.amount, 0);

  const totalClosed = wonDeals.length + lostDeals.length;
  const winRate = totalClosed > 0 ? Math.round((wonDeals.length / totalClosed) * 100) : 0;
  const avgDealSize = deals.length > 0 ? Math.round(deals.reduce((sum, d) => sum + d.amount, 0) / deals.length) : 0;

  // Practice breakdown derived from live pipeline + won revenue per service type
  const practiceColors: Record<string, string> = {
    'AI Development & Testing': '#38bdf8',
    'Performance Testing': '#10b981',
    'Cybersecurity': '#f59e0b',
    'Webstack Development': '#8b5cf6',
    'Strategic Consulting': '#ec4899',
    'Cloud & Data Analytics': '#14b8a6',
  };
  const practiceMap = new Map<string, { name: string; value: number; color: string }>();
  deals
    .filter((d) => d.stage !== 'lost')
    .forEach((d) => {
      const key = d.service_type || 'Other';
      const entry = practiceMap.get(key) ?? {
        name: key.replace(' Development', ' Dev').replace(' & Testing', ''),
        value: 0,
        color: practiceColors[key] ?? '#94a3b8',
      };
      entry.value += d.amount;
      practiceMap.set(key, entry);
    });
  const practiceBreakdown = Array.from(practiceMap.values()).sort((a, b) => b.value - a.value);

  // Consultant leaderboard derived from live deal outcomes per owner
  const ownerMap = new Map<string, { name: string; title: string; deals: number; revenue: number; won: number; lost: number }>();
  deals.forEach((d) => {
    if (!d.owner_name || d.owner_name === 'Unassigned') return;
    const entry = ownerMap.get(d.owner_name) ?? {
      name: d.owner_name,
      title: employees.find((e) => e.full_name === d.owner_name)?.designation ?? 'Consultant',
      deals: 0,
      revenue: 0,
      won: 0,
      lost: 0,
    };
    entry.deals += 1;
    if (d.stage === 'won') {
      entry.revenue += d.amount;
      entry.won += 1;
    }
    if (d.stage === 'lost') entry.lost += 1;
    ownerMap.set(d.owner_name, entry);
  });
  const leaderboard = Array.from(ownerMap.values())
    .map((rep) => ({
      ...rep,
      winRate: rep.won + rep.lost > 0 ? `${Math.round((rep.won / (rep.won + rep.lost)) * 100)}%` : '—',
    }))
    .sort((a, b) => b.revenue - a.revenue || b.deals - a.deals)
    .slice(0, 4);

  const handleExportCSV = () => {
    const csvRows = [
      ['Title', 'Company', 'Amount', 'Stage', 'Probability', 'Expected Close'],
      ...deals.map((d) => [d.title, d.company_name, d.amount, d.stage, d.probability, d.expected_close_date]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `forgeconsultant-sales-report-${reportPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
              Executive Analytics & Reports
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Performance metrics, revenue yields by consulting practice, and advisory team leaderboards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] shadow-xs transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-amber-500" /> Export CSV
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Closed Won Revenue</span>
          <p className="text-2xl font-extrabold font-mono text-emerald-400 mt-2">
            {formatCurrency(wonAmount, currency, currencySymbol)}
          </p>
          <span className="text-[11px] text-[var(--muted-foreground)] mt-1 block">Contracts finalized</span>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Active Pipeline Yield</span>
          <p className="text-2xl font-extrabold font-mono text-amber-500 mt-2">
            {formatCurrency(openAmount, currency, currencySymbol)}
          </p>
          <span className="text-[11px] text-[var(--muted-foreground)] mt-1 block">{openDeals.length} active opportunities</span>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Opportunity Win Rate</span>
          <p className="text-2xl font-extrabold text-[var(--foreground)] mt-2">
            {winRate}%
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">+8% above industry target</span>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase">Avg Deal Size</span>
          <p className="text-2xl font-extrabold font-mono text-blue-400 mt-2">
            {formatCurrency(avgDealSize, currency, currencySymbol)}
          </p>
          <span className="text-[11px] text-[var(--muted-foreground)] mt-1 block">Enterprise consulting tier</span>
        </div>
      </div>

      {/* Practice Area Distribution & Funnel Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Practice Revenue Bar Chart */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                Revenue by Consulting Practice
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">Pipeline and closed yield per specialty</p>
            </div>
            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              Q3 2026
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={practiceBreakdown} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Practice Value']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {practiceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Advisory Team Leaderboard */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                Practice Consultant Leaderboard
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">Top performers by closed revenue and client delivery score</p>
            </div>
            <Award className="h-5 w-5 text-amber-500" />
          </div>

          <div className="space-y-3 pt-2">
            {leaderboard.map((rep, idx) => (
              <div
                key={rep.name}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4 transition-colors hover:border-amber-500/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-xs font-bold text-slate-950 shadow-2xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[var(--foreground)]">{rep.name}</h3>
                    <p className="text-[11px] text-[var(--muted-foreground)]">{rep.title}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-500 block">
                    {formatCurrency(rep.revenue, currency, currencySymbol)}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {rep.winRate} Win Rate • {rep.deals} Deals
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
