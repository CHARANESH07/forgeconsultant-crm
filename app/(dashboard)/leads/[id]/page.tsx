'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users2,
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Sparkles,
  UserCheck,
  Calendar,
  CheckSquare,
  FileText,
  Clock,
  Send,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { formatCurrency, formatDate, formatRelativeTime, cn } from '@/lib/utils';

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    leads,
    updateLead,
    convertLead,
    addTask,
    activities,
    currency,
    currencySymbol,
    user,
  } = useCRM();

  const lead = leads.find((l) => l.id === id);

  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'tasks' | 'ai'>('overview');
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState<string[]>([
    'Initial inbound inquiry regarding ERP modernization architecture.',
    'Expressed requirement for multi-cloud redundancy and SOC2 compliance.',
  ]);

  if (!lead) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Lead not found</h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">The requested lead ID does not exist.</p>
        <Link
          href="/leads"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Leads
        </Link>
      </div>
    );
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotesList([newNote.trim(), ...notesList]);
    setNewNote('');
  };

  const handleStatusChange = (newStatus: any) => {
    updateLead(lead.id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
        <Link href="/leads" className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Leads
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-semibold">{lead.first_name} {lead.last_name}</span>
      </div>

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-lg font-extrabold text-slate-950 shadow-md">
              {lead.first_name[0]}{lead.last_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-extrabold text-[var(--foreground)]">
                  {lead.first_name} {lead.last_name}
                </h1>
                <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                  {lead.status}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center gap-2">
                <span>{lead.job_title || 'Executive Leader'}</span>
                <span>•</span>
                <span className="font-semibold text-[var(--foreground)]">{lead.company_name}</span>
              </p>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--card)] transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-amber-500" /> Send Email
            </a>
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--card)] transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-500" /> Log Call
            </a>
            {lead.status !== 'converted' && (
              <button
                onClick={() => {
                  convertLead(lead.id, { createDeal: true, dealAmount: lead.estimated_value || 3500000 });
                  router.push('/deals');
                }}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-xs"
              >
                <UserCheck className="h-4 w-4" /> Convert to Account & Deal
              </button>
            )}
          </div>
        </div>

        {/* Lead Status Stepper */}
        <div className="mt-6 pt-5 border-t border-[var(--border)]">
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 text-xs">
            {['new', 'contacted', 'qualified', 'nurturing', 'converted'].map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={cn(
                  'flex-1 text-center py-2 px-3 rounded-lg border font-semibold uppercase tracking-wider text-[10px] transition-colors',
                  lead.status === st
                    ? 'border-amber-500 bg-amber-500/15 text-amber-400 font-bold'
                    : 'border-[var(--border)] bg-[var(--muted)]/40 text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Tab Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-[var(--border)] bg-[var(--card)] rounded-xl px-4 shadow-xs">
            {[
              { id: 'overview', label: 'Lead Overview' },
              { id: 'ai', label: 'AI Score & Insights' },
              { id: 'notes', label: 'Notes & Activity' },
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

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-3">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[var(--muted-foreground)]">Email Address</span>
                    <p className="font-semibold text-[var(--foreground)] mt-0.5">{lead.email}</p>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Phone Number</span>
                    <p className="font-semibold text-[var(--foreground)] mt-0.5">{lead.phone}</p>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Location</span>
                    <p className="font-semibold text-[var(--foreground)] mt-0.5">{lead.location || 'India'}</p>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Website</span>
                    <p className="font-semibold text-amber-500 mt-0.5">{lead.website || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-3">
                  Advisory Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[var(--muted-foreground)]">Estimated Advisory Value</span>
                    <p className="font-mono font-bold text-amber-500 text-sm mt-0.5">
                      {formatCurrency(lead.estimated_value || 3500000, currency, currencySymbol)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Lead Source</span>
                    <p className="font-semibold text-[var(--foreground)] mt-0.5">{lead.lead_source}</p>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Practice Lead / Owner</span>
                    <p className="font-semibold text-[var(--foreground)] mt-0.5">{lead.owner_name}</p>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Created Date</span>
                    <p className="font-semibold text-[var(--foreground)] mt-0.5">{formatDate(lead.created_at)}</p>
                  </div>
                </div>
              </div>

              {lead.notes && (
                <div className="pt-4 border-t border-[var(--border)]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-2">
                    Inbound Summary Notes
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/50 p-3 rounded-lg border border-[var(--border)]">
                    {lead.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: AI Insights */}
          {activeTab === 'ai' && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-amber-500">
                <Sparkles className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  AI Lead Qualification & BANT Evaluation
                </h3>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400 uppercase">Fit & Intent Score</span>
                  <span className="text-xl font-extrabold font-mono text-amber-500">{lead.lead_score} / 100</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${lead.lead_score}%` }} />
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-[var(--foreground)]">Executive Summary:</h4>
                  <p className="text-[var(--muted-foreground)] mt-1">{lead.ai_summary || 'Strong candidate for Enterprise Cloud Advisory and digital restructuring.'}</p>
                </div>

                <div className="pt-3 border-t border-[var(--border)]">
                  <h4 className="font-bold text-amber-500">Recommended Next Action:</h4>
                  <p className="text-[var(--foreground)] font-medium mt-1">{lead.ai_recommended_action || 'Schedule discovery session with Managing Principal.'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Notes & Log */}
          {activeTab === 'notes' && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                Lead Notes & Follow-up Log
              </h3>

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  placeholder="Add a new note or call summary..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
                  >
                    <Send className="h-3.5 w-3.5" /> Post Note
                  </button>
                </div>
              </form>

              <div className="space-y-2 pt-3 border-t border-[var(--border)]">
                {notesList.map((note, idx) => (
                  <div key={idx} className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 p-3 text-xs">
                    <p className="text-[var(--foreground)]">{note}</p>
                    <span className="text-[10px] text-[var(--muted-foreground)] mt-1 block">Logged by {user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Meta Card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Lead Score Breakdown
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Budget Authority</span>
                <span className="font-semibold text-emerald-400">Verified High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Decision Maker Access</span>
                <span className="font-semibold text-emerald-400">Direct CTO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Timeline Urgency</span>
                <span className="font-semibold text-amber-400">Q3 / Q4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Industry Fit</span>
                <span className="font-semibold text-emerald-400">Tier 1 Target</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
