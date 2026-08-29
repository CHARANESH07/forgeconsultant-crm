"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meetingFieldMap = exports.activityFieldMap = exports.taskFieldMap = exports.dealFieldMap = exports.companyFieldMap = exports.contactFieldMap = exports.leadFieldMap = void 0;
exports.mapKeys = mapKeys;
function mapKeys(input, fieldMap) {
    const output = {};
    for (const [key, value] of Object.entries(input)) {
        const mapped = fieldMap[key];
        if (mapped) {
            output[mapped] = value;
        }
    }
    return output;
}
exports.leadFieldMap = {
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
exports.contactFieldMap = {
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
exports.companyFieldMap = {
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
exports.dealFieldMap = {
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
exports.taskFieldMap = {
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
exports.activityFieldMap = {
    type: 'type',
    title: 'title',
    description: 'description',
    entityType: 'entity_type',
    entityId: 'entity_id',
    entityName: 'entity_name',
};
exports.meetingFieldMap = {
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
//# sourceMappingURL=mappers.js.map