'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Video,
  MapPin,
  Users,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { formatDate, cn } from '@/lib/utils';
import { Meeting } from '@/types/crm';

export default function CalendarPage() {
  const { meetings, tasks, addMeeting, user, contacts, deals } = useCRM();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 22)); // August 2026
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Schedule modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-08-25');
  const [eventTime, setEventTime] = useState('14:00');
  const [eventCompany, setEventCompany] = useState('');
  const [eventUrl, setEventUrl] = useState('https://meet.google.com/abc-xyz');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrev = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;

    addMeeting({
      title: eventTitle,
      start_time: `${eventDate}T${eventTime}:00Z`,
      end_time: `${eventDate}T15:00:00Z`,
      location: 'Google Meet',
      meeting_url: eventUrl,
      company_name: eventCompany || 'Enterprise Client',
      attendees: [user.email],
      host_id: user.id,
      host_name: user.name,
      status: 'scheduled',
    });

    setIsModalOpen(false);
    setEventTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
              Advisory Schedule & Meetings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Schedule executive workshops, discovery sessions, and milestone reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> Schedule Meeting
          </button>
        </div>
      </div>

      {/* Calendar Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-[var(--foreground)]">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--muted)] p-0.5">
            <button
              onClick={handlePrev}
              className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2 py-0.5 text-xs font-semibold text-[var(--foreground)]"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex rounded-lg border border-[var(--border)] bg-[var(--muted)] p-0.5 text-xs">
          <button
            onClick={() => setViewMode('month')}
            className={cn('px-3 py-1 rounded-md transition-colors', viewMode === 'month' ? 'bg-[var(--card)] text-amber-500 font-bold shadow-2xs' : 'text-[var(--muted-foreground)]')}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={cn('px-3 py-1 rounded-md transition-colors', viewMode === 'week' ? 'bg-[var(--card)] text-amber-500 font-bold shadow-2xs' : 'text-[var(--muted-foreground)]')}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={cn('px-3 py-1 rounded-md transition-colors', viewMode === 'day' ? 'bg-[var(--card)] text-amber-500 font-bold shadow-2xs' : 'text-[var(--muted-foreground)]')}
          >
            Day
          </button>
        </div>
      </div>

      {/* Month Calendar Grid */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--muted)]/50 text-center text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] py-2.5">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[var(--border)] min-h-[500px]">
          {/* Empty prefix cells */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-[var(--muted)]/20 p-2 min-h-[100px]" />
          ))}

          {/* Month Day Cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `2026-08-${String(dayNum).padStart(2, '0')}`;
            const dayMeetings = meetings.filter((m) => m.start_time.startsWith(dateStr));
            const dayTasks = tasks.filter((t) => t.due_date === dateStr);
            const isToday = dayNum === 22;

            return (
              <div
                key={`day-${dayNum}`}
                className={cn(
                  'p-2 min-h-[100px] flex flex-col justify-between hover:bg-[var(--muted)]/30 transition-colors',
                  isToday && 'bg-amber-500/5'
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                      isToday ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-[var(--foreground)]'
                    )}
                  >
                    {dayNum}
                  </span>
                </div>

                <div className="space-y-1 mt-1 flex-1 overflow-y-auto">
                  {dayMeetings.map((m) => (
                    <div
                      key={m.id}
                      className="rounded bg-purple-500/15 border border-purple-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300 truncate"
                      title={m.title}
                    >
                      📅 {m.title}
                    </div>
                  ))}

                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      className="rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 truncate"
                      title={t.title}
                    >
                      ✓ {t.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs bg-black/70 animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />
          <form
            onSubmit={handleCreateMeeting}
            className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl z-10 space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-sm font-bold text-[var(--foreground)]">Schedule Advisory Session</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--foreground)]">Meeting Title *</label>
              <input
                type="text"
                required
                placeholder="Enterprise Cloud Architecture Review"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--foreground)]">Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--foreground)]">Time</label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--foreground)]">Client / Account</label>
              <input
                type="text"
                placeholder="Titan Logistics"
                value={eventCompany}
                onChange={(e) => setEventCompany(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--foreground)]">Video Conference URL</label>
              <input
                type="url"
                value={eventUrl}
                onChange={(e) => setEventUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
              >
                Book Meeting
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
