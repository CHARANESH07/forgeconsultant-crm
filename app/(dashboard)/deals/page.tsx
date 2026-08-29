'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  TrendingUp,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Building2,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  MoreVertical,
  Trash2,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { DealStage, Deal } from '@/types/crm';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export default function DealsPage() {
  const {
    deals,
    moveDealStage,
    deleteDeal,
    openQuickCreate,
    currency,
    currencySymbol,
    hasPermission,
    user,
  } = useCRM();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');

  const STAGES: { id: DealStage; label: string; color: string; border: string }[] = [
    { id: 'new', label: 'New Opportunity', color: 'bg-slate-500/10 text-slate-300', border: 'border-slate-500/30' },
    { id: 'discovery', label: 'Discovery Workshop', color: 'bg-sky-500/10 text-sky-400', border: 'border-sky-500/30' },
    { id: 'proposal', label: 'Proposal & SOW', color: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/30' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-500/10 text-orange-400', border: 'border-orange-500/30' },
    { id: 'won', label: 'Closed Won', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/30' },
    { id: 'lost', label: 'Closed Lost', color: 'bg-red-500/10 text-red-400', border: 'border-red-500/30' },
  ];

  const handleStageChange = (dealId: string, targetStage: DealStage) => {
    moveDealStage(dealId, targetStage);
    if (targetStage === 'won') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const filteredDeals = deals.filter((d) => {
    if (serviceFilter !== 'all' && d.service_type !== serviceFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.company_name.toLowerCase().includes(q) ||
      d.contact_name.toLowerCase().includes(q) ||
      d.service_type.toLowerCase().includes(q)
    );
  });

  const totalActivePipeline = deals
    .filter((d) => d.stage !== 'won' && d.stage !== 'lost')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
              Advisory Pipeline & Deals
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Active consulting opportunities: <strong className="text-amber-500 font-mono">{formatCurrency(totalActivePipeline, currency, currencySymbol)}</strong> across stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-[var(--border)] bg-[var(--card)] p-0.5 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'px-3 py-1.5 rounded-md font-medium transition-colors',
                viewMode === 'kanban' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              )}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'px-3 py-1.5 rounded-md font-medium transition-colors',
                viewMode === 'table' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              )}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => openQuickCreate('deal')}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> New Opportunity
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search deals by title, company, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Service Practices</option>
            <option value="AI Development & Testing">AI Development & Testing</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Cloud & Data Analytics">Cloud & Data Analytics</option>
            <option value="Webstack Development">Webstack Development</option>
            <option value="Strategic Consulting">Strategic Consulting</option>
            <option value="Performance Testing">Performance Testing</option>
          </select>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[580px]">
          {STAGES.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0);

            return (
              <div
                key={stage.id}
                className="w-72 sm:w-80 shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col max-h-[75vh] shadow-xs"
              >
                {/* Column Header */}
                <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/40 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', stage.color, stage.border)}>
                      {stage.label}
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                      {stageDeals.length}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-[var(--muted-foreground)]">Total Value:</span>
                    <span className="text-xs font-mono font-bold text-amber-500">
                      {formatCurrency(stageTotal, currency, currencySymbol)}
                    </span>
                  </div>
                </div>

                {/* Column Card List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {stageDeals.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-xs text-[var(--muted-foreground)]">
                      No opportunities in this stage
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs hover:border-amber-500/50 transition-all space-y-3 group"
                      >
                        {/* Title & Priority */}
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/deals/${deal.id}`}
                            className="text-xs font-bold text-[var(--foreground)] group-hover:text-amber-500 transition-colors line-clamp-2"
                          >
                            {deal.title}
                          </Link>

                          <span
                            className={cn(
                              'rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider shrink-0',
                              deal.priority === 'urgent'
                                ? 'bg-red-500/15 text-red-400'
                                : deal.priority === 'high'
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'bg-slate-800 text-slate-400'
                            )}
                          >
                            {deal.priority}
                          </span>
                        </div>

                        {/* Account Name */}
                        <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span className="truncate">{deal.company_name}</span>
                        </div>

                        {/* Amount & Probability */}
                        <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
                          <span className="text-sm font-mono font-extrabold text-amber-500">
                            {formatCurrency(deal.amount, currency, currencySymbol)}
                          </span>

                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                            <span>{deal.probability}%</span>
                          </div>
                        </div>

                        {/* Service practice tag */}
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 font-medium truncate max-w-[140px]">
                            {deal.service_type}
                          </span>

                          <span className="text-[var(--muted-foreground)] font-mono">
                            {formatDate(deal.expected_close_date)}
                          </span>
                        </div>

                        {/* Stage Quick Movement Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[10px]">
                          <select
                            value={deal.stage}
                            onChange={(e) => handleStageChange(deal.id, e.target.value as DealStage)}
                            className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-2 py-1 text-[10px] text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                          >
                            <option value="new">→ New</option>
                            <option value="discovery">→ Discovery</option>
                            <option value="proposal">→ Proposal</option>
                            <option value="negotiation">→ Negotiation</option>
                            <option value="won">✓ Closed WON</option>
                            <option value="lost">✕ Closed LOST</option>
                          </select>

                          <Link
                            href={`/deals/${deal.id}`}
                            className="flex items-center gap-0.5 text-amber-500 hover:text-amber-400 font-semibold"
                          >
                            Details <ChevronRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--muted)]/60 text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3">Opportunity Title</th>
                  <th className="px-4 py-3">Company & Contact</th>
                  <th className="px-4 py-3">Amount ({currencySymbol})</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Probability</th>
                  <th className="px-4 py-3">Expected Close</th>
                  <th className="px-4 py-3">Practice</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-[var(--muted)]/40 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/deals/${deal.id}`} className="font-bold text-[var(--foreground)] hover:text-amber-500">
                        {deal.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--foreground)]">{deal.company_name}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">{deal.contact_name}</p>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-amber-500">
                      {formatCurrency(deal.amount, currency, currencySymbol)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">{deal.probability}%</td>
                    <td className="px-4 py-3 font-mono text-[var(--muted-foreground)]">{formatDate(deal.expected_close_date)}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{deal.service_type}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/deals/${deal.id}`}
                          className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                        {hasPermission('deals', 'delete', deal.owner_id === user.id) && (
                          <button
                            onClick={() => deleteDeal(deal.id)}
                            className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
