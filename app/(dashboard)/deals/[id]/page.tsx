'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  TrendingUp,
  ArrowLeft,
  Building2,
  User,
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Send,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { DealStage } from '@/types/crm';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export default function DealDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    deals,
    updateDeal,
    moveDealStage,
    deleteDeal,
    currency,
    currencySymbol,
    user,
    hasPermission,
  } = useCRM();

  const deal = deals.find((d) => d.id === id);

  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'ai'>('overview');
  const [newNote, setNewNote] = useState('');
  const [dealNotes, setDealNotes] = useState<string[]>([
    'Legal team reviewed master consulting agreement clauses.',
    'Confirmed milestone delivery schedule: Phase 1 starts in 2 weeks.',
  ]);

  if (!deal) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Deal not found</h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">The requested opportunity ID does not exist.</p>
        <Link
          href="/deals"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Deals
        </Link>
      </div>
    );
  }

  const STAGES: { id: DealStage; label: string }[] = [
    { id: 'new', label: 'New' },
    { id: 'discovery', label: 'Discovery' },
    { id: 'proposal', label: 'Proposal' },
    { id: 'negotiation', label: 'Negotiation' },
    { id: 'won', label: 'Won' },
  ];

  const handleStageAdvance = (targetStage: DealStage) => {
    moveDealStage(deal.id, targetStage);
    if (targetStage === 'won') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setDealNotes([newNote.trim(), ...dealNotes]);
    setNewNote('');
  };

  const weightedForecast = (deal.amount * deal.probability) / 100;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
        <Link href="/deals" className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Deals
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-semibold">{deal.title}</span>
      </div>

      {/* Header Workspace */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-[var(--foreground)]">{deal.title}</h1>
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                {deal.stage}
              </span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-semibold text-[var(--foreground)]">{deal.company_name}</span>
              <span>•</span>
              <span>Primary Contact: {deal.contact_name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {deal.stage !== 'won' && (
              <button
                onClick={() => handleStageAdvance('won')}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4" /> Mark as WON
              </button>
            )}
            {hasPermission('deals', 'delete', deal.owner_id === user.id) && (
              <button
                onClick={() => {
                  deleteDeal(deal.id);
                  router.push('/deals');
                }}
                className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-red-500/10 hover:text-red-400"
                title="Delete deal"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Visual Pipeline Stage Stepper */}
        <div className="pt-4 border-t border-[var(--border)]">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2 block">
            Pipeline Stage Progression
          </label>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            {STAGES.map((st, i) => {
              const isActive = deal.stage === st.id;
              const isPast = STAGES.findIndex((s) => s.id === deal.stage) >= i;

              return (
                <button
                  key={st.id}
                  onClick={() => handleStageAdvance(st.id)}
                  className={cn(
                    'flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center',
                    isActive
                      ? 'border-amber-500 bg-amber-500/20 text-amber-400 shadow-inner'
                      : isPast
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-[var(--border)] bg-[var(--muted)]/40 text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                  )}
                >
                  <span className="block text-[10px] opacity-75">Step {i + 1}</span>
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial Metrics Summary Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase">Contract Amount</span>
          <p className="text-xl font-mono font-extrabold text-amber-500 mt-1">
            {formatCurrency(deal.amount, currency, currencySymbol)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase">Win Probability</span>
          <p className="text-xl font-bold text-[var(--foreground)] mt-1">{deal.probability}%</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase">Weighted Value</span>
          <p className="text-xl font-mono font-bold text-blue-400 mt-1">
            {formatCurrency(weightedForecast, currency, currencySymbol)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase">Expected Close</span>
          <p className="text-xl font-mono font-bold text-[var(--foreground)] mt-1">
            {formatDate(deal.expected_close_date)}
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-[var(--border)] bg-[var(--card)] rounded-xl px-4 shadow-xs">
            {[
              { id: 'overview', label: 'Opportunity Overview' },
              { id: 'ai', label: 'AI Risk & Opportunity Summary' },
              { id: 'notes', label: 'Notes & Milestones' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'py-3 px-4 text-xs font-semibold border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-500 font-bold'
                    : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-3">
                  Scope & Service Practice
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[var(--muted-foreground)]">Service Practice</span>
                    <p className="font-semibold text-[var(--foreground)] mt-0.5">{deal.service_type}</p>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Deal Priority</span>
                    <p className="font-semibold uppercase text-amber-500 mt-0.5">{deal.priority}</p>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Advisory Owner</span>
                    <p className="font-semibold text-[var(--foreground)] mt-0.5">{deal.owner_name}</p>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Created On</span>
                    <p className="font-semibold text-[var(--foreground)] mt-0.5">{formatDate(deal.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-amber-500">
                <Sparkles className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  AI Deal Intelligence & Risk Assessment
                </h3>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs space-y-3">
                <p className="text-[var(--foreground)]">
                  {deal.ai_summary || 'Engagement is progressing on schedule. Commercial terms align with typical enterprise tier benchmarks.'}
                </p>

                <div className="pt-2 border-t border-[var(--border)] flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> Recommended Action: Proceed with final SOW execution.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                Deal Notes Log
              </h3>

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  placeholder="Record call outcome, proposal feedback..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
                  >
                    <Send className="h-3.5 w-3.5" /> Save Note
                  </button>
                </div>
              </form>

              <div className="space-y-2 pt-3 border-t border-[var(--border)]">
                {dealNotes.map((note, idx) => (
                  <div key={idx} className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 p-3 text-xs">
                    <p className="text-[var(--foreground)]">{note}</p>
                    <span className="text-[10px] text-[var(--muted-foreground)] mt-1 block">Added by {user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 col: Key Stakeholders */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Client Stakeholders
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-xs font-bold text-slate-950">
                {deal.contact_name[0]}
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--foreground)]">{deal.contact_name}</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">{deal.company_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
