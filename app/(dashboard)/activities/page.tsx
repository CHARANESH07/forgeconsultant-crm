'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity as ActivityIcon,
  Phone,
  Mail,
  Calendar,
  CheckSquare,
  TrendingUp,
  Building2,
  FileText,
  UserCheck,
  Plus,
  Filter,
  Search,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { formatDateTime, formatRelativeTime, cn } from '@/lib/utils';
import { ActivityType } from '@/types/crm';

export default function ActivitiesPage() {
  const { activities, logActivity, user } = useCRM();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Log new activity form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [actType, setActType] = useState<ActivityType>('call');
  const [actTitle, setActTitle] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actEntity, setActEntity] = useState('');

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (typeFilter !== 'all' && act.type !== typeFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        (act.entity_name && act.entity_name.toLowerCase().includes(q))
      );
    });
  }, [activities, typeFilter, searchQuery]);

  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle) return;

    logActivity({
      type: actType,
      title: actTitle,
      description: actDesc,
      entity_type: 'general',
      entity_name: actEntity || undefined,
      user_id: user.id,
      user_name: user.name,
    });

    setIsFormOpen(false);
    setActTitle('');
    setActDesc('');
    setActEntity('');
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4 text-emerald-400" />;
      case 'email':
        return <Mail className="h-4 w-4 text-sky-400" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-purple-400" />;
      case 'deal_stage_changed':
        return <TrendingUp className="h-4 w-4 text-amber-400" />;
      case 'lead_converted':
        return <UserCheck className="h-4 w-4 text-emerald-400" />;
      default:
        return <ActivityIcon className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ActivityIcon className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
              Unified Activity & Audit Timeline
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Complete chronological record of all stakeholder communications, deal movements, and consultant actions.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 transition-all"
        >
          <Plus className="h-4 w-4" /> Log New Activity
        </button>
      </div>

      {/* Log Activity Form Drawer */}
      {isFormOpen && (
        <form onSubmit={handleLogActivity} className="rounded-2xl border border-amber-500/40 bg-[var(--card)] p-5 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">Log Advisory Activity</h3>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--foreground)]">Activity Type</label>
              <select
                value={actType}
                onChange={(e) => setActType(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
              >
                <option value="call">Phone Call</option>
                <option value="email">Email Sent / Received</option>
                <option value="meeting">Client Meeting</option>
                <option value="note">General Note</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--foreground)]">Activity Subject *</label>
              <input
                type="text"
                required
                placeholder="Follow-up Call regarding SOW"
                value={actTitle}
                onChange={(e) => setActTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--foreground)]">Related Entity / Client</label>
              <input
                type="text"
                placeholder="Titan Logistics"
                value={actEntity}
                onChange={(e) => setActEntity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--foreground)]">Notes & Outcome Description</label>
            <textarea
              rows={2}
              placeholder="Key discussion points, objections, or next steps agreed upon..."
              value={actDesc}
              onChange={(e) => setActDesc(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
            >
              Save to Timeline
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'call', label: 'Calls' },
            { id: 'email', label: 'Emails' },
            { id: 'meeting', label: 'Meetings' },
            { id: 'deal_stage_changed', label: 'Deal Stages' },
            { id: 'lead_converted', label: 'Conversions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={cn(
                'rounded-lg px-3 py-1.5 font-medium transition-colors shrink-0',
                typeFilter === tab.id
                  ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs">
        <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border)]">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">
              No activities found.
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--card)] border-2 border-amber-500/60 shadow-md">
                  {getActivityIcon(act.type)}
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-2xs hover:border-amber-500/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-[var(--foreground)]">{act.title}</h3>
                      {act.entity_name && (
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                          {act.entity_name}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[var(--muted-foreground)] shrink-0">
                      {formatDateTime(act.created_at)} ({formatRelativeTime(act.created_at)})
                    </span>
                  </div>

                  {act.description && (
                    <p className="mt-2 text-xs text-[var(--muted-foreground)] leading-relaxed">
                      {act.description}
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-[var(--border)] text-[10px] text-[var(--muted-foreground)]">
                    <span>Logged by: <strong className="text-[var(--foreground)]">{act.user_name}</strong></span>
                    {act.outcome && <span>Outcome: <strong className="text-amber-500">{act.outcome}</strong></span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
