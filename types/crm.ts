export type UserRole = 'admin' | 'manager' | 'sales_rep' | 'viewer';

export interface Employee {
  employee_id: string;
  full_name: string;
  email: string;
  designation: string;
  department: 'IT' | 'Marketing' | 'Sales' | 'HR' | 'Management' | 'Founder';
  crm_role: 'Employer/Admin' | 'Team Lead' | 'Lead' | 'HR' | 'employee';
  under_team_lead: string;
  responsible_for: string;
  joining_date: string;
  employment_status: 'Active';
  is_superior: boolean;
  password_hint: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  crm_role: string;
  organization_id: string;
  phone?: string;
  title?: string;
  department?: string;
  employee_id?: string;
  is_superior?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  established: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  created_at: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'nurturing' | 'unqualified' | 'converted';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  job_title?: string;
  email: string;
  phone: string;
  website?: string;
  location?: string;
  industry?: string;
  lead_source: 'Website' | 'LinkedIn' | 'Referral' | 'Event' | 'Cold Outreach' | 'Partner' | 'Other';
  status: LeadStatus;
  lead_score: number;
  estimated_value?: number;
  owner_id: string;
  owner_name: string;
  notes?: string;
  ai_summary?: string;
  ai_recommended_action?: string;
  created_at: string;
  updated_at: string;
  converted_contact_id?: string;
  converted_company_id?: string;
  converted_deal_id?: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  alternate_phone?: string;
  job_title: string;
  company_id?: string;
  company_name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  owner_id: string;
  owner_name: string;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  employees_count?: string;
  annual_revenue?: number;
  tier: 'Enterprise' | 'Mid-Market' | 'Growth' | 'Strategic';
  owner_id: string;
  owner_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type DealStage = 'new' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Deal {
  id: string;
  title: string;
  company_id?: string;
  company_name: string;
  contact_id?: string;
  contact_name: string;
  amount: number;
  stage: DealStage;
  probability: number;
  expected_close_date: string;
  owner_id: string;
  owner_name: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  risk_level?: 'low' | 'medium' | 'high';
  risk_reason?: string;
  ai_summary?: string;
  service_type: 'AI Development & Testing' | 'Cybersecurity' | 'Cloud & Data Analytics' | 'Webstack Development' | 'Strategic Consulting' | 'Performance Testing';
  notes?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  lost_reason?: string;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note' | 'deal_stage_changed' | 'lead_converted' | 'system';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  entity_type: 'lead' | 'contact' | 'company' | 'deal' | 'general';
  entity_id?: string;
  entity_name?: string;
  user_id: string;
  user_name: string;
  created_at: string;
  duration_minutes?: number;
  outcome?: string;
}

export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  due_time?: string;
  priority: TaskPriority;
  status: TaskStatus;
  owner_id: string;
  owner_name: string;
  related_to_type?: 'lead' | 'contact' | 'company' | 'deal';
  related_to_id?: string;
  related_to_name?: string;
  created_at: string;
  completed_at?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  meeting_url?: string;
  contact_id?: string;
  contact_name?: string;
  company_name?: string;
  deal_id?: string;
  deal_name?: string;
  attendees: string[];
  host_id: string;
  host_name: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  entity_type: 'lead' | 'contact' | 'company' | 'deal';
  entity_id: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert' | 'deal' | 'task';
  read: boolean;
  link?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  entity_title: string;
  user_name: string;
  details: string;
  created_at: string;
}
