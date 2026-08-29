'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Plus,
  Globe,
  MapPin,
  TrendingUp,
  Users,
  Trash2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { formatCurrency, cn } from '@/lib/utils';

export default function CompaniesPage() {
  const {
    companies,
    deals,
    deleteCompany,
    openQuickCreate,
    currency,
    currencySymbol,
    hasPermission,
    user,
  } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  const filteredCompanies = useMemo(() => {
    return companies.filter((comp) => {
      if (tierFilter !== 'all' && comp.tier !== tierFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        comp.name.toLowerCase().includes(q) ||
        comp.industry.toLowerCase().includes(q) ||
        (comp.city && comp.city.toLowerCase().includes(q))
      );
    });
  }, [companies, searchQuery, tierFilter]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Enterprise':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Strategic':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Growth':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
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
            <Building2 className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
              Enterprise Accounts & Companies
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Track corporate accounts, enterprise revenue tiers, and consulting engagement histories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openQuickCreate('company')}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> Add Company
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search accounts by name, industry, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Account Tiers</option>
            <option value="Enterprise">Enterprise Tier</option>
            <option value="Strategic">Strategic Tier</option>
            <option value="Growth">Growth Tier</option>
            <option value="Mid-Market">Mid-Market</option>
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {filteredCompanies.map((company) => {
          const companyDeals = deals.filter((d) => d.company_id === company.id || d.company_name === company.name);
          const totalDealValue = companyDeals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <div
              key={company.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-amber-500 shadow-sm">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--foreground)]">{company.name}</h3>
                      <p className="text-xs text-[var(--muted-foreground)]">{company.industry}</p>
                    </div>
                  </div>

                  <span className={cn('rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', getTierColor(company.tier))}>
                    {company.tier}
                  </span>
                </div>

                {company.description && (
                  <p className="mt-3 text-xs text-[var(--muted-foreground)] line-clamp-2">
                    {company.description}
                  </p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border)] text-xs">
                  <div>
                    <span className="text-[var(--muted-foreground)]">Location</span>
                    <p className="font-semibold text-[var(--foreground)] mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-500" /> {company.city || 'India'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Headcount</span>
                    <p className="font-semibold text-[var(--foreground)] mt-0.5 flex items-center gap-1">
                      <Users className="h-3 w-3 text-blue-400" /> {company.employees_count || '100+'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Annual Revenue</span>
                    <p className="font-mono font-bold text-amber-500 mt-0.5">
                      {formatCurrency(company.annual_revenue || 100000000, currency, currencySymbol)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Active Advisory Deals</span>
                    <p className="font-bold text-[var(--foreground)] mt-0.5 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-emerald-400" /> {companyDeals.length} Deals ({formatCurrency(totalDealValue, currency, currencySymbol)})
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--muted-foreground)]">
                  Account Lead: {company.owner_name}
                </span>

                <div className="flex items-center gap-2">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-amber-500 hover:underline"
                    >
                      <Globe className="h-3.5 w-3.5" /> Website
                    </a>
                  )}
                  {hasPermission('companies', 'delete', company.owner_id === user.id) && (
                    <button
                      onClick={() => deleteCompany(company.id)}
                      className="p-1.5 text-[var(--muted-foreground)] hover:text-red-400"
                      title="Delete company"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
