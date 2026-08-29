'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  Calendar,
  Building2,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { formatDate, cn } from '@/lib/utils';
import { TaskPriority } from '@/types/crm';

export default function TasksPage() {
  const {
    tasks,
    toggleTaskCompletion,
    deleteTask,
    openQuickCreate,
    hasPermission,
    user,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const isDone = task.status === 'completed';
      const isOverdue = !isDone && task.due_date < todayStr;
      const isToday = !isDone && task.due_date === todayStr;

      if (activeTab === 'pending' && isDone) return false;
      if (activeTab === 'today' && !isToday) return false;
      if (activeTab === 'overdue' && !isOverdue) return false;
      if (activeTab === 'completed' && !isDone) return false;

      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(q) ||
          (task.description && task.description.toLowerCase().includes(q)) ||
          (task.related_to_name && task.related_to_name.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [tasks, activeTab, priorityFilter, searchQuery, todayStr]);

  const pendingCount = tasks.filter((t) => t.status !== 'completed').length;
  const overdueCount = tasks.filter((t) => t.status !== 'completed' && t.due_date < todayStr).length;
  const todayCount = tasks.filter((t) => t.status !== 'completed' && t.due_date === todayStr).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
              Consulting Tasks & Action Items
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Track consultant deliverables, client follow-up reminders, and SOW execution tasks.
          </p>
        </div>

        <button
          onClick={() => openQuickCreate('task')}
          className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'pending', label: 'All Pending', count: pendingCount },
            { id: 'today', label: 'Due Today', count: todayCount },
            { id: 'overdue', label: 'Overdue', count: overdueCount, alert: overdueCount > 0 },
            { id: 'completed', label: 'Completed', count: tasks.filter((t) => t.status === 'completed').length },
            { id: 'all', label: 'All Tasks', count: tasks.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors shrink-0',
                activeTab === tab.id
                  ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                  tab.alert ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Priority Filter & Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-xs text-[var(--muted-foreground)]">
            <CheckSquare className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <p className="font-semibold text-[var(--foreground)]">No tasks found</p>
            <p className="mt-1">All action items in this filter have been completed!</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            const isOverdue = !isDone && task.due_date < todayStr;

            return (
              <div
                key={task.id}
                className={cn(
                  'flex items-start gap-4 rounded-xl border border-[var(--border)] p-4 transition-all',
                  isDone ? 'bg-[var(--muted)]/40 opacity-70' : 'bg-[var(--card)] hover:border-amber-500/40'
                )}
              >
                {/* Completion Checkbox Button */}
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                    isDone
                      ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                      : 'border-slate-600 hover:border-amber-500'
                  )}
                  title={isDone ? 'Mark as Incomplete' : 'Mark as Done'}
                >
                  {isDone && <CheckCircle2 className="h-4 w-4" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h3
                      className={cn(
                        'text-xs font-bold text-[var(--foreground)]',
                        isDone && 'line-through text-[var(--muted-foreground)]'
                      )}
                    >
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={cn(
                          'rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                          task.priority === 'urgent'
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : task.priority === 'high'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        )}
                      >
                        {task.priority}
                      </span>

                      {isOverdue && (
                        <span className="flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-400">
                          <AlertTriangle className="h-3 w-3" /> Overdue
                        </span>
                      )}
                    </div>
                  </div>

                  {task.description && (
                    <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-500" />
                      Due: <strong className="text-[var(--foreground)]">{formatDate(task.due_date)} {task.due_time}</strong>
                    </span>

                    {task.related_to_name && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Tag className="h-3 w-3" />
                        {task.related_to_name}
                      </span>
                    )}

                    <span>Owner: {task.owner_name}</span>
                  </div>
                </div>

                {/* Delete button — hidden if not permitted (server still enforces 403) */}
                {hasPermission('tasks', 'delete', (task as any).created_by_id === user.id) && (
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-[var(--muted-foreground)] hover:text-red-400 p-1 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
