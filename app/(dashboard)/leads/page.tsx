'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users2,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  Mail,
  Phone,
  Building,
  MoreVertical,
  Trash2,
  Edit,
  UserCheck,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { LeadStatus, Lead } from '@/types/crm';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export default function LeadsPage() {
  const {
    leads,
    deleteLead,
    convertLead,
    openQuickCreate,
    currency,
    currencySymbol,
    hasPermission,
    user,
  } = useCRM();

  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'value' | 'date'>('score');

  // Convert Lead Modal state
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [convertCreateDeal, setConvertCreateDeal] = useState(true);
  const [convertDealAmount, setConvertDealAmount] = useState('3500000');
  const [convertDealTitle, setConvertDealTitle] = useState('');

  // Filtering & Sorting
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        if (activeStatusTab !== 'all' && lead.status !== activeStatusTab) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            lead.first_name.toLowerCase().includes(q) ||
            lead.last_name.toLowerCase().includes(q) ||
            lead.company_name.toLowerCase().includes(q) ||
            lead.email.toLowerCase().includes(q) ||
            (lead.industry && lead.industry.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.lead_score - a.lead_score;
        if (sortBy === 'value') return (b.estimated_value || 0) - (a.estimated_value || 0);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [leads, activeStatusTab, searchQuery, sortBy]);

  const handleStartConversion = (lead: Lead) => {
    setConvertingLead(lead);
    setConvertDealTitle(`${lead.company_name} Advisory Engagement`);
    setConvertDealAmount(String(lead.estimated_value || 3500000));
  };

  const handleConfirmConversion = () => {
    if (!convertingLead) return;
    convertLead(convertingLead.id, {
      createDeal: convertCreateDeal,
      dealAmount: Number(convertDealAmount) || 3500000,
      dealTitle: convertDealTitle,
    });
    setConvertingLead(null);
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'qualified':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'contacted':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'converted':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'nurturing':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'unqualified':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users2 className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
              Leads & Inbound Inquiries
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Capture, qualify with AI insights, and seamlessly convert leads into active consulting accounts and deals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openQuickCreate('lead')}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> Create Lead
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'All Leads', count: leads.length },
            { id: 'new', label: 'New', count: leads.filter((l) => l.status === 'new').length },
            { id: 'contacted', label: 'Contacted', count: leads.filter((l) => l.status === 'contacted').length },
            { id: 'qualified', label: 'Qualified', count: leads.filter((l) => l.status === 'qualified').length },
            { id: 'nurturing', label: 'Nurturing', count: leads.filter((l) => l.status === 'nurturing').length },
            { id: 'converted', label: 'Converted', count: leads.filter((l) => l.status === 'converted').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatusTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors shrink-0',
                activeStatusTab === tab.id
                  ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              )}
            >
              <span>{tab.label}</span>
              <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
          >
            <option value="score">Sort: Highest Score</option>
            <option value="value">Sort: Highest Value</option>
            <option value="date">Sort: Most Recent</option>
          </select>
        </div>
      </div>

      {/* Leads Table View */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border)] bg-[var(--muted)]/60 text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3">Lead Name & Title</th>
                <th className="px-4 py-3">Company & Industry</th>
                <th className="px-4 py-3">AI Score & Fit</th>
                <th className="px-4 py-3">Estimated Value</th>
                <th className="px-4 py-3">Source & Status</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[var(--muted-foreground)]">
                    <Users2 className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                    <p className="font-semibold text-[var(--foreground)]">No leads found</p>
                    <p className="text-xs mt-1">Try adjusting your filters or create a new lead.</p>
                    <button
                      onClick={() => openQuickCreate('lead')}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
                    >
                      <Plus className="h-3.5 w-3.5" /> Create Lead
                    </button>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isConverted = lead.status === 'converted';
                  return (
                    <tr key={lead.id} className="hover:bg-[var(--muted)]/40 transition-colors group">
                      {/* Name & Job */}
                      <td className="px-4 py-3">
                        <Link href={`/leads/${lead.id}`} className="font-bold text-[var(--foreground)] hover:text-amber-500 transition-colors">
                          {lead.first_name} {lead.last_name}
                        </Link>
                        <p className="text-[11px] text-[var(--muted-foreground)]">
                          {lead.job_title || 'Executive Stakeholder'}
                        </p>
                      </td>

                      {/* Company & Industry */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                          <Building className="h-3.5 w-3.5 text-slate-400" />
                          <span>{lead.company_name}</span>
                        </div>
                        <p className="text-[11px] text-[var(--muted-foreground)]">{lead.industry || 'Consulting Services'}</p>
                      </td>

                      {/* AI Lead Score */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-400 font-bold font-mono text-xs">
                            {lead.lead_score}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-0.5">
                              <Sparkles className="h-3 w-3" /> {lead.lead_score >= 80 ? 'High Intent' : lead.lead_score >= 65 ? 'Qualified' : 'Nurture'}
                            </span>
                            <span className="text-[10px] text-[var(--muted-foreground)]">BANT Match</span>
                          </div>
                        </div>
                      </td>

                      {/* Estimated Value */}
                      <td className="px-4 py-3 font-mono font-bold text-amber-500">
                        {formatCurrency(lead.estimated_value || 2500000, currency, currencySymbol)}
                      </td>

                      {/* Status & Source */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-start gap-1">
                          <span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', getStatusBadge(lead.status))}>
                            {lead.status}
                          </span>
                          <span className="text-[10px] text-[var(--muted-foreground)]">Source: {lead.lead_source}</span>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col text-[11px] text-[var(--muted-foreground)]">
                          <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-amber-500">
                            <Mail className="h-3 w-3" /> {lead.email}
                          </a>
                          <a href={`tel:${lead.phone}`} className="mt-0.5 flex items-center gap-1 hover:text-amber-500">
                            <Phone className="h-3 w-3" /> {lead.phone}
                          </a>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!isConverted ? (
                            <button
                              onClick={() => handleStartConversion(lead)}
                              className="flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                              title="Convert to Contact, Account & Opportunity"
                            >
                              <UserCheck className="h-3.5 w-3.5" /> Convert
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-purple-400">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Converted
                            </span>
                          )}

                          <Link
                            href={`/leads/${lead.id}`}
                            className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                            title="View Lead Profile"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>

                          {hasPermission('leads', 'delete', lead.owner_id === user.id) && (
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONVERT LEAD MODAL */}
      {convertingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs bg-black/70 animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setConvertingLead(null)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl z-10 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-500" />
                <h2 className="text-base font-bold text-[var(--foreground)]">
                  Convert Lead: {convertingLead.first_name} {convertingLead.last_name}
                </h2>
              </div>
              <button
                onClick={() => setConvertingLead(null)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[var(--muted-foreground)]">
              This workflow will automatically create a new <strong className="text-[var(--foreground)]">Contact ({convertingLead.first_name})</strong>, link it to <strong className="text-[var(--foreground)]">Company ({convertingLead.company_name})</strong>, and optionally generate an active sales opportunity.
            </p>

            <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={convertCreateDeal}
                  onChange={(e) => setConvertCreateDeal(e.target.checked)}
                  className="rounded border-[var(--border)] text-amber-500 focus:ring-amber-500"
                />
                <span>Create Opportunity / Deal in Sales Pipeline</span>
              </label>

              {convertCreateDeal && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] font-medium text-[var(--muted-foreground)]">Deal Opportunity Name</label>
                    <input
                      type="text"
                      value={convertDealTitle}
                      onChange={(e) => setConvertDealTitle(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[var(--muted-foreground)]">Deal Value ({currencySymbol})</label>
                    <input
                      type="number"
                      value={convertDealAmount}
                      onChange={(e) => setConvertDealAmount(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConvertingLead(null)}
                className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmConversion}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4" /> Confirm & Convert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
