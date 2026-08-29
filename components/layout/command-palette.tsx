'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Users2,
  Contact as ContactIcon,
  Building2,
  TrendingUp,
  CheckSquare,
  Sparkles,
  ArrowRight,
  X,
  Plus,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { formatCurrency } from '@/lib/utils';

export function CommandPalette() {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    leads,
    contacts,
    companies,
    deals,
    tasks,
    openQuickCreate,
    currency,
    currencySymbol,
  } = useCRM();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  // Filtered multi-entity results
  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        leads: leads.slice(0, 3),
        contacts: contacts.slice(0, 3),
        companies: companies.slice(0, 3),
        deals: deals.slice(0, 3),
        tasks: tasks.slice(0, 3),
      };
    }

    const q = query.toLowerCase();
    return {
      leads: leads.filter(
        (l) =>
          l.first_name.toLowerCase().includes(q) ||
          l.last_name.toLowerCase().includes(q) ||
          l.company_name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      ),
      contacts: contacts.filter(
        (c) =>
          c.first_name.toLowerCase().includes(q) ||
          c.last_name.toLowerCase().includes(q) ||
          (c.company_name && c.company_name.toLowerCase().includes(q)) ||
          c.email.toLowerCase().includes(q)
      ),
      companies: companies.filter(
        (comp) =>
          comp.name.toLowerCase().includes(q) ||
          comp.industry.toLowerCase().includes(q)
      ),
      deals: deals.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.company_name.toLowerCase().includes(q) ||
          d.service_type.toLowerCase().includes(q)
      ),
      tasks: tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      ),
    };
  }, [query, leads, contacts, companies, deals, tasks]);

  if (!isCommandPaletteOpen) return null;

  const navigateTo = (path: string) => {
    setCommandPaletteOpen(false);
    setQuery('');
    router.push(path);
  };

  const hasAnyResults =
    results.leads.length > 0 ||
    results.contacts.length > 0 ||
    results.companies.length > 0 ||
    results.deals.length > 0 ||
    results.tasks.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 backdrop-blur-xs bg-black/60 animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={() => setCommandPaletteOpen(false)}
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95">
        {/* Search Input */}
        <div className="flex items-center border-b border-[var(--border)] px-4 py-3 bg-[var(--card)]">
          <Search className="h-5 w-5 text-amber-500 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search across all records..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-hidden"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="rounded-lg p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Action Shortcuts */}
        {!query && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--muted)]/40 overflow-x-auto text-xs">
            <span className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase">Quick:</span>
            <button
              onClick={() => {
                setCommandPaletteOpen(false);
                openQuickCreate('lead');
              }}
              className="flex items-center gap-1 rounded-md bg-[var(--card)] border border-[var(--border)] px-2 py-1 text-[var(--foreground)] hover:border-amber-500/50 transition-colors shrink-0"
            >
              <Plus className="h-3 w-3 text-amber-500" /> New Lead
            </button>
            <button
              onClick={() => {
                setCommandPaletteOpen(false);
                openQuickCreate('deal');
              }}
              className="flex items-center gap-1 rounded-md bg-[var(--card)] border border-[var(--border)] px-2 py-1 text-[var(--foreground)] hover:border-amber-500/50 transition-colors shrink-0"
            >
              <Plus className="h-3 w-3 text-amber-500" /> New Deal
            </button>
            <button
              onClick={() => {
                setCommandPaletteOpen(false);
                openQuickCreate('task');
              }}
              className="flex items-center gap-1 rounded-md bg-[var(--card)] border border-[var(--border)] px-2 py-1 text-[var(--foreground)] hover:border-amber-500/50 transition-colors shrink-0"
            >
              <Plus className="h-3 w-3 text-amber-500" /> New Task
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-[var(--border)]">
          {!hasAnyResults ? (
            <div className="p-10 text-center text-sm text-[var(--muted-foreground)]">
              No results found for &ldquo;<span className="text-[var(--foreground)]">{query}</span>&rdquo;
            </div>
          ) : (
            <>
              {/* Deals */}
              {results.deals.length > 0 && (
                <div className="py-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                    <TrendingUp className="h-3.5 w-3.5" /> Deals & Opportunities
                  </div>
                  {results.deals.map((deal) => (
                    <div
                      key={deal.id}
                      onClick={() => navigateTo(`/deals`)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-[var(--muted)] cursor-pointer group transition-colors"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                          {deal.title}
                        </span>
                        <span className="text-[11px] text-[var(--muted-foreground)]">
                          {deal.company_name} • {deal.service_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-amber-500">
                          {formatCurrency(deal.amount, currency, currencySymbol)}
                        </span>
                        <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] uppercase font-bold text-amber-400">
                          {deal.stage}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Leads */}
              {results.leads.length > 0 && (
                <div className="py-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                    <Users2 className="h-3.5 w-3.5" /> Leads
                  </div>
                  {results.leads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => navigateTo(`/leads`)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-[var(--muted)] cursor-pointer group transition-colors"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                          {lead.first_name} {lead.last_name}
                        </span>
                        <span className="text-[11px] text-[var(--muted-foreground)]">
                          {lead.company_name} • {lead.job_title || 'Lead'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                          Score: {lead.lead_score}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contacts */}
              {results.contacts.length > 0 && (
                <div className="py-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                    <ContactIcon className="h-3.5 w-3.5" /> Contacts
                  </div>
                  {results.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => navigateTo(`/contacts`)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-[var(--muted)] cursor-pointer group transition-colors"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                          {contact.first_name} {contact.last_name}
                        </span>
                        <span className="text-[11px] text-[var(--muted-foreground)]">
                          {contact.job_title} ({contact.company_name})
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--muted-foreground)]">{contact.email}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Companies */}
              {results.companies.length > 0 && (
                <div className="py-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                    <Building2 className="h-3.5 w-3.5" /> Companies & Accounts
                  </div>
                  {results.companies.map((comp) => (
                    <div
                      key={comp.id}
                      onClick={() => navigateTo(`/companies`)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-[var(--muted)] cursor-pointer group transition-colors"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                          {comp.name}
                        </span>
                        <span className="text-[11px] text-[var(--muted-foreground)]">
                          {comp.industry} • {comp.city}
                        </span>
                      </div>
                      <span className="rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                        {comp.tier}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div className="py-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                    <CheckSquare className="h-3.5 w-3.5" /> Tasks
                  </div>
                  {results.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => navigateTo(`/tasks`)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-[var(--muted)] cursor-pointer group transition-colors"
                    >
                      <span className="font-semibold text-[var(--foreground)] truncate mr-2">
                        {task.title}
                      </span>
                      <span className="text-[10px] text-amber-500 font-mono shrink-0">
                        Due {task.due_date}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2 bg-[var(--muted)]/40 text-[11px] text-[var(--muted-foreground)]">
          <div className="flex items-center gap-3">
            <span>Navigate <kbd className="font-mono bg-[var(--card)] px-1 rounded border border-[var(--border)]">↑</kbd> <kbd className="font-mono bg-[var(--card)] px-1 rounded border border-[var(--border)]">↓</kbd></span>
            <span>Select <kbd className="font-mono bg-[var(--card)] px-1 rounded border border-[var(--border)]">↵</kbd></span>
          </div>
          <span>Close <kbd className="font-mono bg-[var(--card)] px-1 rounded border border-[var(--border)]">ESC</kbd></span>
        </div>
      </div>
    </div>
  );
}
