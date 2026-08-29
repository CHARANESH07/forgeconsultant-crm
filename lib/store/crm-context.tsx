'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Lead,
  Contact,
  Company,
  Deal,
  DealStage,
  Activity,
  Task,
  Meeting,
  Notification,
  AuditLog,
  Organization,
  UserProfile,
  Employee,
} from '@/types/crm';
import {
  initialOrganization,
  initialUser,
  officialEmployees,
  initialCompanies,
  initialContacts,
  initialLeads,
  initialDeals,
  initialTasks,
  initialActivities,
  initialMeetings,
  initialNotifications,
  initialAuditLogs,
} from '@/lib/mock-data';
import { api, ApiError, authApi, AuthUserPayload } from '@/lib/api-client';

interface CRMContextType {
  organization: Organization;
  user: UserProfile;
  employees: Employee[];
  superiors: Employee[];
  leads: Lead[];
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
  meetings: Meeting[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  unreadNotificationCount: number;
  
  // Modals & UI state
  isQuickCreateOpen: boolean;
  setQuickCreateOpen: (open: boolean) => void;
  quickCreateType: 'lead' | 'contact' | 'company' | 'deal' | 'task' | 'meeting' | null;
  openQuickCreate: (type?: 'lead' | 'contact' | 'company' | 'deal' | 'task' | 'meeting') => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  
  // Theme & Currency
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  currency: string;
  currencySymbol: string;
  setCurrencySettings: (currency: string, symbol: string) => void;

  // Switch Active User / Login
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (payload: { fullName: string; email: string; password: string; employeeId: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthReady: boolean;
  isAuthenticated: boolean;
  dataError: string | null;
  refreshData: () => Promise<void>;
  hasPermission: (resource: string, action: 'create' | 'read' | 'update' | 'delete', isOwner?: boolean) => boolean;

  // Leads CRUD & Workflow
  addLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => Promise<Lead>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  convertLead: (leadId: string, options: { createDeal: boolean; dealAmount?: number; dealTitle?: string }) => Promise<{ contact: Contact; company: Company; deal?: Deal }>;

  // Contacts CRUD
  addContact: (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => Promise<Contact>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;

  // Companies CRUD
  addCompany: (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;

  // Deals CRUD
  addDeal: (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>) => Promise<Deal>;
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  moveDealStage: (dealId: string, newStage: DealStage) => Promise<void>;

  // Tasks CRUD
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Activities
  logActivity: (activity: Omit<Activity, 'id' | 'created_at'>) => Promise<Activity>;

  // Meetings
  addMeeting: (meeting: Omit<Meeting, 'id' | 'created_at'>) => Promise<Meeting>;
  cancelMeeting: (id: string) => Promise<void>;

  // Notifications
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [organization, setOrganization] = useState<Organization>(initialOrganization);
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [employees] = useState<Employee[]>(officialEmployees);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Superiors filtered strictly from employee roster
  const superiors = employees.filter((e) => e.is_superior);

  // UI state
  const [isQuickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreateType, setQuickCreateType] = useState<'lead' | 'contact' | 'company' | 'deal' | 'task' | 'meeting' | null>('lead');
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  type ApiRow = Record<string, unknown> & {
    owner?: { full_name?: string } | null;
    company?: { name?: string } | null;
    contact?: { first_name?: string; last_name?: string } | null;
    assigned_to?: { full_name?: string } | null;
    created_by?: { full_name?: string } | null;
  };

  const str = (row: ApiRow, key: string): string => (row[key] as string | undefined) ?? '';
  const optStr = (row: ApiRow, key: string): string | undefined => (row[key] as string | undefined) ?? undefined;
  const num = (row: ApiRow, key: string): number | undefined => (row[key] as number | undefined) ?? undefined;

  const mapApiUser = (u: AuthUserPayload): UserProfile => {
    let mappedRole: 'admin' | 'manager' | 'sales_rep' | 'viewer' = 'sales_rep';
    if (u.crmRole === 'Employer/Admin') mappedRole = 'admin';
    else if (u.crmRole === 'Team Lead' || u.crmRole === 'Lead' || u.crmRole === 'HR') mappedRole = 'manager';

    return {
      id: u.userId,
      name: u.full_name,
      email: u.email,
      role: mappedRole,
      crm_role: u.crmRole,
      organization_id: u.organizationId,
      employee_id: u.employeeId,
      is_superior: u.isSuperior,
    };
  };

  const ownerName = (row: ApiRow): string => row.owner?.full_name ?? 'Unassigned';

  const mapLead = (row: ApiRow): Lead =>
    ({
      ...row,
      owner_id: str(row, 'owner_id'),
      owner_name: ownerName(row),
    }) as Lead;

  const mapCompany = (row: ApiRow): Company =>
    ({
      ...row,
      owner_id: str(row, 'owner_id'),
      owner_name: ownerName(row),
    }) as Company;

  const mapContact = (row: ApiRow): Contact =>
    ({
      ...row,
      company_name: (row.company?.name as string | undefined) ?? undefined,
      owner_id: str(row, 'owner_id'),
      owner_name: ownerName(row),
      tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    }) as Contact;

  const mapDeal = (row: ApiRow): Deal =>
    ({
      ...row,
      company_name: (row.company?.name as string | undefined) ?? '',
      contact_name: row.contact ? `${row.contact.first_name ?? ''} ${row.contact.last_name ?? ''}`.trim() : '',
      owner_id: str(row, 'owner_id'),
      owner_name: ownerName(row),
    }) as Deal;

  const mapTask = (row: ApiRow): Task =>
    ({
      ...row,
      owner_id: str(row, 'assigned_to_id') || str(row, 'created_by_id'),
      owner_name: row.assigned_to?.full_name ?? row.created_by?.full_name ?? 'Unassigned',
      completed_at: optStr(row, 'completed_at'),
    }) as Task;

  const isUUID = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const hasPermission = React.useCallback(
    (resource: string, action: 'create' | 'read' | 'update' | 'delete', isOwner = false): boolean => {
      const PERMISSIONS: Record<string, { create?: string[]; read?: string[]; update?: string[]; delete?: string[]; ownOnly?: boolean }> = {
        leads: { create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'], read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'], update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'], delete: ['SUPER_ADMIN', 'ADMIN'], ownOnly: true },
        contacts: { create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'], read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'], update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'], delete: ['SUPER_ADMIN', 'ADMIN'], ownOnly: true },
        companies: { create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'], read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'], update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'], delete: ['SUPER_ADMIN', 'ADMIN'], ownOnly: true },
        deals: { create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'], read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'], update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'], delete: ['SUPER_ADMIN', 'ADMIN'], ownOnly: true },
        tasks: { create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'], read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'], update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'], delete: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'], ownOnly: true },
      };
      const perm = PERMISSIONS[resource];
      if (!perm) return false;
      const allowed = perm[action as keyof typeof perm] as string[] | undefined;
      if (!allowed) return false;
      const aliases: Record<string, string> = { 'Employer/Admin': 'SUPER_ADMIN', 'Team Lead': 'TEAM_LEAD', Lead: 'EMPLOYEE', HR: 'HR', employee: 'EMPLOYEE' };
      const role = aliases[user.crm_role] ?? user.crm_role;
      if (action !== 'read' && action !== 'create' && perm.ownOnly && !isOwner && !['SUPER_ADMIN', 'ADMIN'].includes(role)) return false;
      return allowed.includes(role);
    },
    [user.crm_role]
  );

  const loadAllData = React.useCallback(async () => {
    try {
      setDataError(null);
      const results = await Promise.allSettled([
        api.get<ApiRow[]>('/leads?limit=100&sortBy=date'),
        api.get<ApiRow[]>('/companies?limit=100'),
        api.get<ApiRow[]>('/contacts?limit=100'),
        api.get<ApiRow[]>('/deals?limit=100'),
        api.get<ApiRow[]>('/tasks?limit=100'),
        api.get<ApiRow[]>('/activities?limit=100'),
        api.get<ApiRow[]>('/notifications?limit=50'),
        api.get<ApiRow[]>('/meetings?limit=100'),
      ]);
      const [leadsRes, companiesRes, contactsRes, dealsRes, tasksRes, activitiesRes, notificationsRes, meetingsRes] = results;
      const toArray = (v: unknown): ApiRow[] => (Array.isArray(v) ? (v as ApiRow[]) : Array.isArray((v as { data?: unknown })?.data) ? ((v as { data: ApiRow[] }).data) : []);
      if (leadsRes.status === 'fulfilled') setLeads(toArray(leadsRes.value).map(mapLead));
      if (companiesRes.status === 'fulfilled') setCompanies(toArray(companiesRes.value).map(mapCompany));
      if (contactsRes.status === 'fulfilled') setContacts(toArray(contactsRes.value).map(mapContact));
      if (dealsRes.status === 'fulfilled') setDeals(toArray(dealsRes.value).map(mapDeal));
      if (tasksRes.status === 'fulfilled') setTasks(toArray(tasksRes.value).map(mapTask));
      if (activitiesRes.status === 'fulfilled') setActivities(toArray(activitiesRes.value).map((row) => ({ ...row })) as unknown as Activity[]);
      if (notificationsRes.status === 'fulfilled') setNotifications(toArray(notificationsRes.value).map((row) => ({ ...row })) as unknown as Notification[]);
      if (meetingsRes.status === 'fulfilled')
        setMeetings(
          toArray(meetingsRes.value).map((row) => ({
            ...row,
            attendees: Array.isArray(row.attendees) ? row.attendees : [],
          })) as unknown as Meeting[]
        );
      const firstError = results.find((r) => r.status === 'rejected') as PromiseRejectedResult | undefined;
      if (firstError) {
        const err = firstError.reason;
        if (err instanceof ApiError && err.code !== 'UNAUTHORIZED' && err.code !== 'TOKEN_EXPIRED') {
          setDataError(err.message);
        } else if (!(err instanceof ApiError)) {
          setDataError(String(err?.message ?? err));
        }
      }
    } catch (error) {
      if (error instanceof ApiError && error.code !== 'UNAUTHORIZED' && error.code !== 'TOKEN_EXPIRED') {
        setDataError(error.message);
      }
    }
  }, []);

  const loadNotifications = React.useCallback(async () => {
    try {
      const res = await api.get<ApiRow[] | { data: ApiRow[] }>('/notifications?limit=50');
      const arr: ApiRow[] = Array.isArray(res) ? res : Array.isArray((res as { data: ApiRow[] }).data) ? (res as { data: ApiRow[] }).data : [];
      setNotifications(arr.map((row) => ({ ...row })) as unknown as Notification[]);
    } catch (error) {
      if (error instanceof ApiError && error.code !== 'UNAUTHORIZED' && error.code !== 'TOKEN_EXPIRED') {
        setDataError(error.message);
      }
    }
  }, []);

  // Load theme & restore authenticated session on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('forge_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
    if ((savedTheme ?? 'dark') === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    authApi
      .me()
      .then((apiUser) => {
        setUser(mapApiUser(apiUser));
        setIsAuthenticated(true);
      })
      .catch(() => {})
      .finally(() => setIsAuthReady(true));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated, loadAllData]);

  const refreshData = async (): Promise<void> => {
    await loadAllData();
  };

  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const apiUser = await authApi.login(email.trim(), password);
      setUser(mapApiUser(apiUser));
      setIsAuthenticated(true);
      return { ok: true };
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as Error).message)
          : 'Unable to sign in. Please try again.';
      return { ok: false, error: message };
    }
  };

  const register = async (payload: {
    fullName: string;
    email: string;
    password: string;
    employeeId: string;
  }): Promise<{ ok: boolean; error?: string }> => {
    try {
      const apiUser = await authApi.register({
        email: payload.email.trim(),
        password: payload.password,
        fullName: payload.fullName,
        employeeId: payload.employeeId,
        designation: 'Consultant',
        department: 'IT',
        joiningDate: new Date().toISOString().split('T')[0],
      });
      setUser(mapApiUser(apiUser));
      setIsAuthenticated(true);
      return { ok: true };
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as Error).message)
          : 'Unable to register. Please try again.';
      return { ok: false, error: message };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // Clear local state even if the API call fails
    }
    setUser(initialUser);
    setIsAuthenticated(false);
    setLeads(initialLeads);
    setCompanies(initialCompanies);
    setContacts(initialContacts);
    setDeals(initialDeals);
    setTasks(initialTasks);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('forge_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const setCurrencySettings = (newCurrency: string, newSymbol: string) => {
    setOrganization((prev) => ({
      ...prev,
      currency: newCurrency,
      currency_symbol: newSymbol,
    }));
  };

  const openQuickCreate = (type: 'lead' | 'contact' | 'company' | 'deal' | 'task' | 'meeting' = 'lead') => {
    setQuickCreateType(type);
    setQuickCreateOpen(true);
  };

  const logAudit = (action: string, entity_type: string, entity_id: string, entity_title: string, details: string) => {
    const log: AuditLog = {
      id: `audit-${Date.now()}`,
      action,
      entity_type,
      entity_id,
      entity_title,
      user_name: user.name,
      details,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Leads CRUD (API-backed)
  const addLead = async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> => {
    const created = await api.post<ApiRow>('/leads', {
      firstName: leadData.first_name,
      lastName: leadData.last_name,
      companyName: leadData.company_name,
      jobTitle: leadData.job_title,
      email: leadData.email,
      phone: leadData.phone,
      website: leadData.website,
      location: leadData.location,
      industry: leadData.industry,
      leadSource: leadData.lead_source,
      estimatedValue: leadData.estimated_value,
      notes: leadData.notes,
    });
    const mapped = mapLead(created);
    setLeads((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const payload: Record<string, unknown> = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.lead_score !== undefined) payload.leadScore = updates.lead_score;
    if (updates.estimated_value !== undefined) payload.estimatedValue = updates.estimated_value;
    if (updates.notes !== undefined) payload.notes = updates.notes;
    if (updates.job_title !== undefined) payload.jobTitle = updates.job_title;
    if (updates.industry !== undefined) payload.industry = updates.industry;
    if (updates.website !== undefined) payload.website = updates.website;
    if (updates.location !== undefined) payload.location = updates.location;

    try {
      const updated = await api.put<ApiRow>(`/leads/${id}`, payload);
      const mapped = mapLead(updated);
      setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, ...mapped } : lead)));
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to update lead');
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await api.delete(`/leads/${id}`);
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to delete lead');
    }
  };

  // Convert Lead workflow (API-backed, transactional server-side)
  const convertLead = async (
    leadId: string,
    options: { createDeal: boolean; dealAmount?: number; dealTitle?: string }
  ) => {
    const result = await api.post<{ contact: ApiRow; company: ApiRow; deal: ApiRow | null }>(
      `/leads/${leadId}/convert`,
      options
    );
    await loadAllData();
    return {
      contact: mapContact(result.contact),
      company: mapCompany(result.company),
      deal: result.deal ? mapDeal(result.deal) : undefined,
    };
  };

  // Contacts CRUD (API-backed)
  const addContact = async (contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> => {
    const created = await api.post<ApiRow>('/contacts', {
      firstName: contactData.first_name,
      lastName: contactData.last_name,
      email: contactData.email,
      phone: contactData.phone,
      alternatePhone: contactData.alternate_phone,
      jobTitle: contactData.job_title || 'Executive',
      companyId: contactData.company_id || undefined,
      city: contactData.city,
      country: contactData.country,
      tags: contactData.tags,
      notes: contactData.notes,
    });
    const mapped = mapContact(created);
    setContacts((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    const payload: Record<string, unknown> = {};
    if (updates.first_name !== undefined) payload.firstName = updates.first_name;
    if (updates.last_name !== undefined) payload.lastName = updates.last_name;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.alternate_phone !== undefined) payload.alternatePhone = updates.alternate_phone;
    if (updates.job_title !== undefined) payload.jobTitle = updates.job_title;
    if (updates.company_id !== undefined) payload.companyId = updates.company_id;
    if (updates.city !== undefined) payload.city = updates.city;
    if (updates.country !== undefined) payload.country = updates.country;
    if (updates.tags !== undefined) payload.tags = updates.tags;
    if (updates.notes !== undefined) payload.notes = updates.notes;

    try {
      const updated = await api.put<ApiRow>(`/contacts/${id}`, payload);
      const mapped = mapContact(updated);
      setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, ...mapped } : contact)));
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to update contact');
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await api.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to delete contact');
    }
  };

  // Companies CRUD (API-backed)
  const addCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> => {
    const created = await api.post<ApiRow>('/companies', {
      name: companyData.name,
      industry: companyData.industry,
      website: companyData.website,
      phone: companyData.phone,
      email: companyData.email,
      city: companyData.city,
      state: companyData.state,
      country: companyData.country,
      employeesCount: companyData.employees_count,
      annualRevenue: companyData.annual_revenue,
      tier: companyData.tier,
      description: companyData.description,
    });
    const mapped = mapCompany(created);
    setCompanies((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    const payload: Record<string, unknown> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.industry !== undefined) payload.industry = updates.industry;
    if (updates.website !== undefined) payload.website = updates.website;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.city !== undefined) payload.city = updates.city;
    if (updates.state !== undefined) payload.state = updates.state;
    if (updates.country !== undefined) payload.country = updates.country;
    if (updates.employees_count !== undefined) payload.employeesCount = updates.employees_count;
    if (updates.annual_revenue !== undefined) payload.annualRevenue = updates.annual_revenue;
    if (updates.tier !== undefined) payload.tier = updates.tier;
    if (updates.description !== undefined) payload.description = updates.description;

    try {
      const updated = await api.put<ApiRow>(`/companies/${id}`, payload);
      const mapped = mapCompany(updated);
      setCompanies((prev) => prev.map((comp) => (comp.id === id ? { ...comp, ...mapped } : comp)));
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to update company');
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      await api.delete(`/companies/${id}`);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to delete company');
    }
  };

  // Deals CRUD & Stage Movement (API-backed)
  const addDeal = async (dealData: Omit<Deal, 'id' | 'created_at' | 'updated_at'>): Promise<Deal> => {
    const linkedCompany = companies.find((c) => c.name.toLowerCase() === (dealData.company_name || '').toLowerCase());
    const created = await api.post<ApiRow>('/deals', {
      title: dealData.title,
      companyId: dealData.company_id || linkedCompany?.id || undefined,
      contactId: dealData.contact_id || undefined,
      amount: dealData.amount,
      stage: dealData.stage,
      probability: dealData.probability,
      expectedCloseDate: dealData.expected_close_date,
      priority: dealData.priority,
      serviceType: dealData.service_type || 'AI Development & Testing',
      notes: dealData.notes,
    });
    const mapped = mapDeal(created);
    setDeals((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateDeal = async (id: string, updates: Partial<Deal>) => {
    const payload: Record<string, unknown> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.company_id !== undefined) payload.companyId = updates.company_id;
    if (updates.contact_id !== undefined) payload.contactId = updates.contact_id;
    if (updates.amount !== undefined) payload.amount = updates.amount;
    if (updates.probability !== undefined) payload.probability = updates.probability;
    if (updates.expected_close_date !== undefined) payload.expectedCloseDate = updates.expected_close_date;
    if (updates.priority !== undefined) payload.priority = updates.priority;
    if (updates.risk_level !== undefined) payload.riskLevel = updates.risk_level;
    if (updates.service_type !== undefined) payload.serviceType = updates.service_type;
    if (updates.notes !== undefined) payload.notes = updates.notes;
    if (updates.lost_reason !== undefined) payload.lostReason = updates.lost_reason;

    try {
      const updated = await api.put<ApiRow>(`/deals/${id}`, payload);
      const mapped = mapDeal(updated);
      setDeals((prev) => prev.map((deal) => (deal.id === id ? { ...deal, ...mapped } : deal)));
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to update deal');
    }
  };

  const deleteDeal = async (id: string) => {
    try {
      await api.delete(`/deals/${id}`);
      setDeals((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to delete deal');
    }
  };

  // Optimistic stage move; server response is authoritative, rollback on failure
  const moveDealStage = async (dealId: string, newStage: DealStage) => {
    const targetDeal = deals.find((d) => d.id === dealId);
    if (!targetDeal || targetDeal.stage === newStage) return;

    let defaultProb = 20;
    if (newStage === 'discovery') defaultProb = 40;
    if (newStage === 'proposal') defaultProb = 60;
    if (newStage === 'negotiation') defaultProb = 85;
    if (newStage === 'won') defaultProb = 100;
    if (newStage === 'lost') defaultProb = 0;

    const previousStage = targetDeal.stage;
    const now = new Date().toISOString();
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === dealId
          ? {
              ...deal,
              stage: newStage,
              probability: defaultProb,
              closed_at: newStage === 'won' || newStage === 'lost' ? now : deal.closed_at,
              updated_at: now,
            }
          : deal
      )
    );

    try {
      const updated = await api.post<ApiRow>(`/deals/${dealId}/stage`, { stage: newStage });
      const mapped = mapDeal(updated);
      setDeals((prev) => prev.map((deal) => (deal.id === dealId ? { ...deal, ...mapped } : deal)));
      if (newStage === 'won') {
        await loadNotifications();
      }
    } catch (error) {
      setDeals((prev) =>
        prev.map((deal) => (deal.id === dealId ? { ...deal, stage: previousStage } : deal))
      );
      setDataError(error instanceof ApiError ? error.message : 'Failed to move deal');
    }
  };

  // Tasks CRUD (API-backed)
  const addTask = async (taskData: Omit<Task, 'id' | 'created_at'>): Promise<Task> => {
    try {
      const created = await api.post<ApiRow>('/tasks', {
        title: taskData.title,
        description: taskData.description,
        projectId: taskData.related_to_id || undefined,
        assignedToId: taskData.owner_id || undefined,
        dueDate: taskData.due_date,
        dueTime: taskData.due_time,
        priority: taskData.priority,
      });
      const mapped = mapTask(created);
      setTasks((prev) => [mapped, ...prev]);
      return mapped;
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : 'Failed to create task';
      setDataError(msg);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const payload: Record<string, unknown> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.due_date !== undefined) payload.dueDate = updates.due_date;
    if (updates.due_time !== undefined) payload.dueTime = updates.due_time;
    if (updates.priority !== undefined) payload.priority = updates.priority;
    if (updates.status !== undefined) payload.status = updates.status;

    try {
      const updated = await api.put<ApiRow>(`/tasks/${id}`, payload);
      const mapped = mapTask(updated);
      setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...mapped } : task)));
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to update task');
    }
  };

  // Optimistic toggle; server response authoritative, rollback on failure
  const toggleTaskCompletion = async (id: string) => {
    if (!isUUID(id)) {
      setDataError('This task is not yet synced with the server. Please refresh the page and try again.');
      return;
    }
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const isNowCompleted = task.status !== 'completed';
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: isNowCompleted ? 'completed' : 'in_progress', completed_at: isNowCompleted ? new Date().toISOString() : undefined }
          : t
      )
    );

    try {
      const updated = await api.post<ApiRow>(`/tasks/${id}/toggle`);
      const mapped = mapTask(updated);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...mapped } : t)));
    } catch (error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: task.status, completed_at: task.completed_at } : t))
      );
      setDataError(error instanceof ApiError ? error.message : 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to delete task');
    }
  };

  // Activity Log (API-backed)
  const logActivity = async (actData: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> => {
    try {
      const created = await api.post<ApiRow>('/activities', {
        type: actData.type,
        title: actData.title,
        description: actData.description,
        entityType: actData.entity_type || 'general',
        entityId: actData.entity_id || undefined,
        entityName: actData.entity_name || undefined,
      });
      const newAct = { ...actData, ...created } as unknown as Activity;
      setActivities((prev) => [newAct, ...prev]);
      return newAct;
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to log activity');
      const fallback: Activity = { ...actData, id: `act-${Date.now()}`, created_at: new Date().toISOString() };
      return fallback;
    }
  };

  // Meetings (API-backed)
  const addMeeting = async (meetingData: Omit<Meeting, 'id' | 'created_at'>): Promise<Meeting> => {
    try {
      const created = await api.post<ApiRow>('/meetings', {
        title: meetingData.title,
        description: meetingData.description,
        startTime: meetingData.start_time,
        endTime: meetingData.end_time,
        location: meetingData.location,
        meetingUrl: meetingData.meeting_url,
        companyName: meetingData.company_name,
        attendees: meetingData.attendees,
        status: meetingData.status,
      });
      const mapped = {
        ...created,
        attendees: Array.isArray(created.attendees) ? created.attendees : [],
      } as unknown as Meeting;
      setMeetings((prev) => [mapped, ...prev]);
      return mapped;
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to create meeting');
      throw error;
    }
  };

  const cancelMeeting = async (id: string) => {
    if (!isUUID(id)) {
      setDataError('This meeting is not yet synced with the server. Please refresh.');
      return;
    }
    try {
      const updated = await api.put<ApiRow>(`/meetings/${id}`, { status: 'cancelled' });
      const mapped = {
        ...updated,
        attendees: Array.isArray(updated.attendees) ? updated.attendees : [],
      } as unknown as Meeting;
      setMeetings((prev) => prev.map((m) => (m.id === id ? mapped : m)));
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to cancel meeting');
    }
  };

  // Notifications (API-backed)
  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await api.post(`/notifications/${id}/read`);
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to update notification');
      await loadNotifications();
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.post('/notifications/read-all');
    } catch (error) {
      setDataError(error instanceof ApiError ? error.message : 'Failed to update notifications');
      await loadNotifications();
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <CRMContext.Provider
      value={{
        organization,
        user,
        employees,
        superiors,
        leads,
        contacts,
        companies,
        deals,
        tasks,
        activities,
        meetings,
        notifications,
        auditLogs,
        unreadNotificationCount,

        isQuickCreateOpen,
        setQuickCreateOpen,
        quickCreateType,
        openQuickCreate,
        isCommandPaletteOpen,
        setCommandPaletteOpen,

        theme,
        setTheme,
        toggleTheme,
        currency: organization.currency,
        currencySymbol: organization.currency_symbol,
        setCurrencySettings,

        login,
        register,
        logout,
        isAuthReady,
        isAuthenticated,
        dataError,
        refreshData,

        addLead,
        updateLead,
        deleteLead,
        convertLead,

        addContact,
        updateContact,
        deleteContact,

        addCompany,
        updateCompany,
        deleteCompany,

        addDeal,
        updateDeal,
        deleteDeal,
        moveDealStage,

        addTask,
        updateTask,
        toggleTaskCompletion,
        deleteTask,

        logActivity,

        addMeeting,
        cancelMeeting,

        markNotificationAsRead,
        markAllNotificationsAsRead,

        hasPermission,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}
