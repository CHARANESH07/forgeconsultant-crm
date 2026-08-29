'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Contact as ContactIcon,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  MapPin,
  Tag,
  Trash2,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { getInitials, formatDate } from '@/lib/utils';

export default function ContactsPage() {
  const {
    contacts,
    deleteContact,
    openQuickCreate,
    hasPermission,
    user,
  } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const q = searchQuery.toLowerCase();
    return contacts.filter(
      (c) =>
        c.first_name.toLowerCase().includes(q) ||
        c.last_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company_name && c.company_name.toLowerCase().includes(q)) ||
        (c.job_title && c.job_title.toLowerCase().includes(q))
    );
  }, [contacts, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ContactIcon className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
              Client & Stakeholder Contacts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Manage executive relationships, champions, and decision makers across client organizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openQuickCreate('contact')}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> Add Contact
          </button>
        </div>
      </div>

      {/* Search & View Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search by name, email, company, or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] focus:border-amber-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted-foreground)]">{filteredContacts.length} Contacts</span>
          <div className="flex rounded-lg border border-[var(--border)] bg-[var(--muted)] p-0.5 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-[var(--card)] text-amber-500 font-bold shadow-2xs' : 'text-[var(--muted-foreground)]'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-[var(--card)] text-amber-500 font-bold shadow-2xs' : 'text-[var(--muted-foreground)]'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--muted)]/60 text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Company & Title</th>
                  <th className="px-4 py-3">Email & Phone</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-[var(--muted-foreground)]">
                      No contacts found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-[var(--muted)]/40 transition-colors">
                      {/* Name with Avatar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-xs font-bold text-slate-950 shadow-2xs">
                            {getInitials(`${contact.first_name} ${contact.last_name}`)}
                          </div>
                          <div>
                            <span className="font-bold text-[var(--foreground)]">
                              {contact.first_name} {contact.last_name}
                            </span>
                            <span className="block text-[11px] text-[var(--muted-foreground)]">
                              Owner: {contact.owner_name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Company & Title */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-[var(--foreground)] flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-amber-500" />
                          <span>{contact.company_name || 'Individual'}</span>
                        </div>
                        <span className="text-[11px] text-[var(--muted-foreground)]">{contact.job_title}</span>
                      </td>

                      {/* Contact coordinates */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col text-[11px] text-[var(--muted-foreground)]">
                          <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-amber-500">
                            <Mail className="h-3 w-3" /> {contact.email}
                          </a>
                          <a href={`tel:${contact.phone}`} className="mt-0.5 flex items-center gap-1 hover:text-amber-500">
                            <Phone className="h-3 w-3" /> {contact.phone}
                          </a>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-[var(--foreground)]">{contact.city || 'India'}</span>
                      </td>

                      {/* Tags */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag, i) => (
                            <span key={i} className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`mailto:${contact.email}`}
                            className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-amber-500"
                            title="Send Email"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </a>
                          {hasPermission('contacts', 'delete', contact.owner_id === user.id) && (
                            <button
                              onClick={() => deleteContact(contact.id)}
                              className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-red-500/10 hover:text-red-400"
                              title="Delete Contact"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs transition-all hover:border-amber-500/40 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-sm font-bold text-slate-950 shadow-2xs">
                    {getInitials(`${contact.first_name} ${contact.last_name}`)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--foreground)]">{contact.first_name} {contact.last_name}</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">{contact.job_title}</p>
                  </div>
                </div>

                {hasPermission('contacts', 'delete', contact.owner_id === user.id) && (
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="text-[var(--muted-foreground)] hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-amber-500" />
                  <span className="font-medium text-[var(--foreground)]">{contact.company_name || 'Individual'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <a href={`mailto:${contact.email}`} className="hover:text-amber-500 truncate">{contact.email}</a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  <a href={`tel:${contact.phone}`} className="hover:text-amber-500">{contact.phone}</a>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-2">
                {contact.tags.map((tag, i) => (
                  <span key={i} className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
