export function mapKeys<T = Record<string, unknown>>(input: Record<string, unknown>, fieldMap: Record<string, string>): T {
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    const mapped = fieldMap[key];
    if (mapped) {
      output[mapped] = value;
    }
  }
  return output as T;
}

export const leadFieldMap: Record<string, string> = {
  firstName: 'first_name',
  lastName: 'last_name',
  companyName: 'company_name',
  jobTitle: 'job_title',
  email: 'email',
  phone: 'phone',
  website: 'website',
  location: 'location',
  industry: 'industry',
  leadSource: 'lead_source',
  status: 'status',
  leadScore: 'lead_score',
  estimatedValue: 'estimated_value',
  notes: 'notes',
};

export const contactFieldMap: Record<string, string> = {
  firstName: 'first_name',
  lastName: 'last_name',
  email: 'email',
  phone: 'phone',
  alternatePhone: 'alternate_phone',
  jobTitle: 'job_title',
  companyId: 'company_id',
  city: 'city',
  country: 'country',
  tags: 'tags',
  notes: 'notes',
};

export const companyFieldMap: Record<string, string> = {
  name: 'name',
  industry: 'industry',
  website: 'website',
  phone: 'phone',
  email: 'email',
  city: 'city',
  state: 'state',
  country: 'country',
  employeesCount: 'employees_count',
  annualRevenue: 'annual_revenue',
  tier: 'tier',
  description: 'description',
};

export const dealFieldMap: Record<string, string> = {
  title: 'title',
  companyId: 'company_id',
  contactId: 'contact_id',
  amount: 'amount',
  stage: 'stage',
  probability: 'probability',
  expectedCloseDate: 'expected_close_date',
  priority: 'priority',
  riskLevel: 'risk_level',
  serviceType: 'service_type',
  notes: 'notes',
  lostReason: 'lost_reason',
};

export const taskFieldMap: Record<string, string> = {
  title: 'title',
  description: 'description',
  projectId: 'project_id',
  assignedToId: 'assigned_to_id',
  dueDate: 'due_date',
  dueTime: 'due_time',
  priority: 'priority',
  status: 'status',
  progressPercent: 'progress_percent',
};

export const activityFieldMap: Record<string, string> = {
  type: 'type',
  title: 'title',
  description: 'description',
  entityType: 'entity_type',
  entityId: 'entity_id',
  entityName: 'entity_name',
};

export const meetingFieldMap: Record<string, string> = {
  title: 'title',
  description: 'description',
  startTime: 'start_time',
  endTime: 'end_time',
  location: 'location',
  meetingUrl: 'meeting_url',
  contactId: 'contact_id',
  contactName: 'contact_name',
  companyName: 'company_name',
  dealId: 'deal_id',
  dealName: 'deal_name',
  attendees: 'attendees',
  hostId: 'host_id',
  hostName: 'host_name',
  status: 'status',
};
