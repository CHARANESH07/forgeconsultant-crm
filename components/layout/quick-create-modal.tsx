'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Users2,
  Contact as ContactIcon,
  TrendingUp,
  Building2,
  CheckSquare,
  Sparkles,
  Save,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { DealStage, TaskPriority, LeadStatus } from '@/types/crm';
import { api } from '@/lib/api-client';

export function QuickCreateModal() {
  const {
    isQuickCreateOpen,
    setQuickCreateOpen,
    quickCreateType,
    openQuickCreate,
    addLead,
    addContact,
    addCompany,
    addDeal,
    addTask,
    user,
    companies,
    contacts,
    currencySymbol,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'lead' | 'contact' | 'deal' | 'company' | 'task'>(
    quickCreateType === 'meeting' ? 'task' : quickCreateType || 'lead'
  );

  // Form states
  // Lead
  const [leadFirstName, setLeadFirstName] = useState('');
  const [leadLastName, setLeadLastName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSource, setLeadSource] = useState<'Website' | 'LinkedIn' | 'Referral' | 'Event' | 'Cold Outreach' | 'Partner' | 'Other'>('LinkedIn');
  const [leadEstValue, setLeadEstValue] = useState('2500000');
  const [leadNotes, setLeadNotes] = useState('');

  // Deal
  const [dealTitle, setDealTitle] = useState('');
  const [dealCompany, setDealCompany] = useState('');
  const [dealContact, setDealContact] = useState('');
  const [dealAmount, setDealAmount] = useState('5000000');
  const [dealStage, setDealStage] = useState<DealStage>('new');
  const [dealService, setDealService] = useState<'AI Development & Testing' | 'Cybersecurity' | 'Cloud & Data Analytics' | 'Webstack Development' | 'Strategic Consulting' | 'Performance Testing'>('AI Development & Testing');
  const [dealPriority, setDealPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');

  // Contact
  const [contactFirst, setContactFirst] = useState('');
  const [contactLast, setContactLast] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactJob, setContactJob] = useState('');
  const [contactCompany, setContactCompany] = useState('');

  // Company
  const [compName, setCompName] = useState('');
  const [compIndustry, setCompIndustry] = useState('Banking & Financial Services');
  const [compCity, setCompCity] = useState('Bengaluru');
  const [compTier, setCompTier] = useState<'Enterprise' | 'Mid-Market' | 'Growth' | 'Strategic'>('Enterprise');

  // Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('high');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [availableAssignees, setAvailableAssignees] = useState<{ id: string; full_name: string; team_id?: string | null; department_id?: string | null }[]>([]);

  useEffect(() => {
    if (!isQuickCreateOpen || activeTab !== 'task') return;
    setTaskAssigneeId(user.id);
    api
      .get<{ id: string; full_name: string; team_id?: string | null; department_id?: string | null }[] | { data: { id: string; full_name: string; team_id?: string | null; department_id?: string | null }[] }>(
        '/employees?limit=100'
      )
      .then((res) => {
        const list: { id: string; full_name: string; team_id?: string | null; department_id?: string | null }[] = Array.isArray(res)
          ? res
          : Array.isArray((res as { data: unknown[] }).data)
            ? (res as { data: { id: string; full_name: string; team_id?: string | null; department_id?: string | null }[] }).data
            : [];
        const isAdmin = user.crm_role === 'Employer/Admin';
        if (isAdmin) {
          setAvailableAssignees(list);
        } else {
          const me = list.find((e) => e.id === user.id);
          if (!me) {
            setAvailableAssignees(list.filter((e) => e.id === user.id));
            return;
          }
          const filtered = list.filter(
            (e) => e.id === user.id || (me.team_id && e.team_id && e.team_id === me.team_id) || (me.department_id && e.department_id && e.department_id === me.department_id)
          );
          setAvailableAssignees(filtered.length ? filtered : [me]);
        }
      })
      .catch(() => setAvailableAssignees([]));
  }, [isQuickCreateOpen, activeTab, user.id, user.crm_role]);

  if (!isQuickCreateOpen) return null;

  const handleClose = () => {
    setQuickCreateOpen(false);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadFirstName || !leadCompany || !leadEmail) return;

    addLead({
      first_name: leadFirstName,
      last_name: leadLastName,
      company_name: leadCompany,
      email: leadEmail,
      phone: leadPhone || '+91 98000 00000',
      lead_source: leadSource,
      status: 'new',
      lead_score: 75,
      estimated_value: Number(leadEstValue) || 2500000,
      owner_id: user.id,
      owner_name: user.name,
      notes: leadNotes,
      ai_summary: `Newly registered consulting lead from ${leadCompany}. High priority review recommended.`,
      ai_recommended_action: 'Perform background research on account and schedule introductory call.',
    });

    handleClose();
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle || !dealCompany) return;

    addDeal({
      title: dealTitle,
      company_name: dealCompany,
      contact_name: dealContact || 'Key Stakeholder',
      amount: Number(dealAmount) || 5000000,
      stage: dealStage,
      probability: dealStage === 'new' ? 20 : dealStage === 'proposal' ? 60 : 80,
      expected_close_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner_id: user.id,
      owner_name: user.name,
      priority: dealPriority,
      service_type: dealService,
      ai_summary: `Strategic ${dealService} engagement with ${dealCompany}.`,
    });

    handleClose();
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactFirst || !contactEmail) return;

    addContact({
      first_name: contactFirst,
      last_name: contactLast,
      email: contactEmail,
      phone: contactPhone || '+91 98000 00000',
      job_title: contactJob || 'Executive',
      company_name: contactCompany,
      owner_id: user.id,
      owner_name: user.name,
      tags: ['New Contact'],
    });

    handleClose();
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName) return;

    addCompany({
      name: compName,
      industry: compIndustry,
      city: compCity,
      tier: compTier,
      owner_id: user.id,
      owner_name: user.name,
    });

    handleClose();
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    addTask({
      title: taskTitle,
      due_date: taskDueDate,
      priority: taskPriority,
      status: 'not_started',
      description: taskDesc,
      owner_id: taskAssigneeId || user.id,
      owner_name: user.name,
    });

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs bg-black/60 animate-in fade-in">
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="relative w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-[var(--muted)]/40">
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)]">Quick Create</h2>
            <p className="text-xs text-[var(--muted-foreground)]">Instantly add records into Forge Consultancy CRM</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Entity Tabs */}
        <div className="flex border-b border-[var(--border)] bg-[var(--card)] px-4">
          <button
            onClick={() => setActiveTab('lead')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'lead'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <Users2 className="h-3.5 w-3.5" /> Lead
          </button>
          <button
            onClick={() => setActiveTab('deal')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'deal'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" /> Deal
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'contact'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <ContactIcon className="h-3.5 w-3.5" /> Contact
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'company'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" /> Company
          </button>
          <button
            onClick={() => setActiveTab('task')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'task'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" /> Task
          </button>
        </div>

        {/* Tab Content Form */}
        <div className="p-6">
          {/* LEAD FORM */}
          {activeTab === 'lead' && (
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Rajesh"
                    value={leadFirstName}
                    onChange={(e) => setLeadFirstName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Last Name</label>
                  <input
                    type="text"
                    placeholder="Sengupta"
                    value={leadLastName}
                    onChange={(e) => setLeadLastName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="Zenith Retail Chains"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="r.sengupta@zenithretail.in"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Lead Source</label>
                  <select
                    value={leadSource}
                    onChange={(e) => setLeadSource(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Event">Event</option>
                    <option value="Cold Outreach">Cold Outreach</option>
                    <option value="Partner">Partner</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Estimated Value ({currencySymbol})</label>
                  <input
                    type="number"
                    value={leadEstValue}
                    onChange={(e) => setLeadEstValue(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                >
                  <Save className="h-3.5 w-3.5" /> Save Lead
                </button>
              </div>
            </form>
          )}

          {/* DEAL FORM */}
          {activeTab === 'deal' && (
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--foreground)]">Deal Opportunity Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enterprise AI Development & Testing Suite"
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Account / Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="Titan Logistics"
                    value={dealCompany}
                    onChange={(e) => setDealCompany(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Deal Value ({currencySymbol}) *</label>
                  <input
                    type="number"
                    required
                    value={dealAmount}
                    onChange={(e) => setDealAmount(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Pipeline Stage</label>
                  <select
                    value={dealStage}
                    onChange={(e) => setDealStage(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="new">New Opportunity</option>
                    <option value="discovery">Discovery Workshop</option>
                    <option value="proposal">Proposal SOW</option>
                    <option value="negotiation">Negotiation</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Practice</label>
                  <select
                    value={dealService}
                    onChange={(e) => setDealService(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="AI Development & Testing">AI Development & Testing</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Cloud & Data Analytics">Cloud & Data Analytics</option>
                    <option value="Webstack Development">Webstack Development</option>
                    <option value="Strategic Consulting">Strategic Consulting</option>
                    <option value="Performance Testing">Performance Testing</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                >
                  <Save className="h-3.5 w-3.5" /> Save Opportunity
                </button>
              </div>
            </form>
          )}

          {/* CONTACT FORM */}
          {activeTab === 'contact' && (
            <form onSubmit={handleCreateContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Vikram"
                    value={contactFirst}
                    onChange={(e) => setContactFirst(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Last Name</label>
                  <input
                    type="text"
                    placeholder="Malhotra"
                    value={contactLast}
                    onChange={(e) => setContactLast(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="vikram@company.in"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Job Title</label>
                  <input
                    type="text"
                    placeholder="Chief Information Officer"
                    value={contactJob}
                    onChange={(e) => setContactJob(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                >
                  <Save className="h-3.5 w-3.5" /> Save Contact
                </button>
              </div>
            </form>
          )}

          {/* COMPANY FORM */}
          {activeTab === 'company' && (
            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--foreground)]">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Apex FinTech Global"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Industry</label>
                  <input
                    type="text"
                    value={compIndustry}
                    onChange={(e) => setCompIndustry(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Tier</label>
                  <select
                    value={compTier}
                    onChange={(e) => setCompTier(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Strategic">Strategic</option>
                    <option value="Growth">Growth</option>
                    <option value="Mid-Market">Mid-Market</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                >
                  <Save className="h-3.5 w-3.5" /> Save Company
                </button>
              </div>
            </form>
          )}

          {/* TASK FORM */}
          {activeTab === 'task' && (
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--foreground)]">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Review AI Model Performance Architecture"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)]">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--foreground)]">Assignee</label>
                <select
                  value={taskAssigneeId}
                  onChange={(e) => setTaskAssigneeId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                >
                  {availableAssignees.length ? (
                    availableAssignees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name} {emp.id === user.id ? '(You)' : ''}
                      </option>
                    ))
                  ) : (
                    <option value={user.id}>{user.name} (You)</option>
                  )}
                </select>
                <p className="text-[10px] text-[var(--muted-foreground)] mt-1">Only team members are listed for non-admin users.</p>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--foreground)]">Description</label>
                <textarea
                  rows={2}
                  placeholder="Task details and action items..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                >
                  <Save className="h-3.5 w-3.5" /> Save Task
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
