'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building,
  Users,
  ShieldCheck,
  TrendingUp,
  Save,
  Check,
  Search,
  Key,
  Crown,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';

export default function SettingsPage() {
  const {
    organization,
    user,
    employees,
    superiors,
    setCurrencySettings,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'team' | 'general' | 'pipeline' | 'security'>('team');
  const [orgName, setOrgName] = useState(organization.name);
  const [selectedCurrency, setSelectedCurrency] = useState(organization.currency);
  const [timezone, setTimezone] = useState(organization.timezone);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const filteredEmployees = employees.filter((emp) => {
    if (selectedDept !== 'all' && emp.department !== selectedDept) return false;
    if (!searchEmployee.trim()) return true;
    const q = searchEmployee.toLowerCase();
    return (
      emp.full_name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.employee_id.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q) ||
      emp.under_team_lead.toLowerCase().includes(q)
    );
  });

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    let symbol = '₹';
    if (selectedCurrency === 'USD') symbol = '$';
    if (selectedCurrency === 'EUR') symbol = '€';
    if (selectedCurrency === 'GBP') symbol = '£';

    setCurrencySettings(selectedCurrency, symbol);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Employer/Admin':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold';
      case 'Team Lead':
      case 'Lead':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40 font-bold';
      case 'HR':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40 font-semibold';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Official Logo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-400/20 to-amber-600/10 p-0.5 border border-amber-500/40 shadow-md">
            <img
              src="/brand/forgeconsultant-logo.png"
              alt="Forge Consultancy"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)] font-serif">
              {organization.name}
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Established {organization.established} • Official Employee Directory, Hierarchy & CRM Configuration
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] bg-[var(--card)] rounded-xl px-4 shadow-xs">
        {[
          { id: 'team', label: 'Official Employee Roster & Hierarchy', icon: Users },
          { id: 'general', label: 'Organization & Currency', icon: Building },
          { id: 'pipeline', label: 'Pipeline Stages', icon: TrendingUp },
          { id: 'security', label: 'Security & RLS', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-500 font-bold'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Official Employee Directory & Superior Hierarchy */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          {/* Recognized Superiors Overview */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-5 w-5 text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                Recognized Superiors & Leadership Hierarchy
              </h2>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mb-4">
              Founders, Team Leads, Practice Leads, and HR Executives authorized for management workflows:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {superiors.map((sup) => (
                <div
                  key={sup.employee_id}
                  className="rounded-xl border border-amber-500/30 bg-[var(--card)] p-3.5 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--foreground)]">{sup.full_name}</span>
                    <span className="font-mono text-[9px] font-bold text-amber-400 bg-slate-900 px-1.5 py-0.2 rounded">
                      {sup.employee_id}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-500 font-semibold">{sup.designation}</p>
                  <div className="pt-1 border-t border-[var(--border)] text-[10px] text-[var(--muted-foreground)] font-mono flex items-center justify-between">
                    <span>{sup.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    <span>Status: {sup.employment_status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Employee Table from Official Document */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs overflow-hidden">
            {/* Filter Bar */}
            <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search by name, ID, email, designation, or team lead..."
                  value={searchEmployee}
                  onChange={(e) => setSearchEmployee(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                >
                  <option value="all">All Departments</option>
                  <option value="Founder">Founders</option>
                  <option value="IT">IT Department</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR Operations</option>
                  <option value="Management">Management</option>
                </select>
                <span className="text-xs text-[var(--muted-foreground)] font-mono">{filteredEmployees.length} Total</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[var(--border)] bg-[var(--muted)]/60 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-3 py-3">Employee ID</th>
                    <th className="px-4 py-3">Full Name & Official Email</th>
                    <th className="px-3 py-3">Designation & Dept</th>
                    <th className="px-3 py-3">CRM Role</th>
                    <th className="px-4 py-3">Under Team Lead (Superior)</th>
                    <th className="px-4 py-3">Responsible For</th>
                    <th className="px-3 py-3">Joining Date</th>
                    <th className="px-3 py-3">Employment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.employee_id} className="hover:bg-[var(--muted)]/40 transition-colors">
                      <td className="px-3 py-3 font-mono font-bold text-amber-500">{emp.employee_id}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-[var(--foreground)]">{emp.full_name}</span>
                        <span className="block text-[11px] text-[var(--muted-foreground)] font-mono">{emp.email}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-semibold text-[var(--foreground)]">{emp.designation}</span>
                        <span className="block text-[10px] text-amber-400/90 font-medium">{emp.department}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] ${getRoleBadge(emp.crm_role)}`}>
                          {emp.crm_role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-200">{emp.under_team_lead}</span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[var(--muted-foreground)] max-w-xs">
                        {emp.responsible_for}
                      </td>
                      <td className="px-3 py-3 font-mono text-[11px] text-[var(--muted-foreground)]">{emp.joining_date}</td>
                      <td className="px-3 py-3 font-mono text-[11px] text-emerald-400 bg-emerald-500/5">
                        {emp.employment_status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* General Settings */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-6 max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--foreground)]">Practice Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--foreground)]">Default Currency</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                >
                  <option value="INR">Indian Rupee (INR ₹)</option>
                  <option value="USD">US Dollar (USD $)</option>
                  <option value="EUR">Euro (EUR €)</option>
                  <option value="GBP">British Pound (GBP £)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--foreground)]">Established Year</label>
                <input
                  type="text"
                  disabled
                  value={organization.established}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2 text-xs text-[var(--muted-foreground)]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            {savedSuccess ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                <Check className="h-4 w-4" /> Settings updated!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-xs"
            >
              <Save className="h-3.5 w-3.5" /> Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Pipeline Stages */}
      {activeTab === 'pipeline' && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
            Consulting Pipeline Stages & Win Probabilities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { name: '1. New Opportunity', prob: '20%', desc: 'Inbound lead or referral initial qualification' },
              { name: '2. Discovery Workshop', prob: '40%', desc: 'Technical and architectural scoping audit' },
              { name: '3. Proposal & SOW', prob: '60%', desc: 'Commercial statement of work submitted' },
              { name: '4. Negotiation', prob: '85%', desc: 'Legal and procurement review of final milestones' },
              { name: '5. Closed Won', prob: '100%', desc: 'Contract executed and kickoff sprint scheduled' },
            ].map((st) => (
              <div key={st.name} className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--foreground)]">{st.name}</span>
                  <span className="font-mono text-xs font-bold text-amber-500">{st.prob}</span>
                </div>
                <p className="text-[11px] text-[var(--muted-foreground)]">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security & RLS */}
      {activeTab === 'security' && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              PostgreSQL Row Level Security (RLS) & Multi-Tenant Boundaries
            </h2>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs space-y-3">
            <p className="text-[var(--foreground)]">
              All CRM database tables (<code className="text-amber-400">leads</code>, <code className="text-amber-400">deals</code>, <code className="text-amber-400">contacts</code>, <code className="text-amber-400">companies</code>, <code className="text-amber-400">activities</code>) are enforced by Supabase PostgreSQL Row Level Security policies.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <Lock className="h-3.5 w-3.5" /> Multi-tenant organization boundaries strictly isolated via <span className="font-bold">get_user_org_id()</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
