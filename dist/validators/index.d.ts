import { z } from 'zod';
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const authSchemas: {
    login: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    register: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
            fullName: z.ZodString;
            employeeId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    forgotPassword: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    resetPassword: z.ZodObject<{
        body: z.ZodObject<{
            token: z.ZodString;
            password: z.ZodString;
            confirmPassword: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    changePassword: z.ZodObject<{
        body: z.ZodObject<{
            currentPassword: z.ZodString;
            newPassword: z.ZodString;
            confirmPassword: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    refreshToken: z.ZodObject<{
        body: z.ZodObject<{
            refreshToken: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const leadSchemas: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            firstName: z.ZodString;
            lastName: z.ZodString;
            companyName: z.ZodString;
            jobTitle: z.ZodOptional<z.ZodString>;
            email: z.ZodString;
            phone: z.ZodString;
            website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            location: z.ZodOptional<z.ZodString>;
            industry: z.ZodOptional<z.ZodString>;
            leadSource: z.ZodDefault<z.ZodEnum<{
                Website: "Website";
                LinkedIn: "LinkedIn";
                Referral: "Referral";
                Event: "Event";
                "Cold Outreach": "Cold Outreach";
                Partner: "Partner";
                Other: "Other";
            }>>;
            estimatedValue: z.ZodOptional<z.ZodNumber>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            firstName: z.ZodOptional<z.ZodString>;
            lastName: z.ZodOptional<z.ZodString>;
            companyName: z.ZodOptional<z.ZodString>;
            jobTitle: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            location: z.ZodOptional<z.ZodString>;
            industry: z.ZodOptional<z.ZodString>;
            leadSource: z.ZodOptional<z.ZodEnum<{
                Website: "Website";
                LinkedIn: "LinkedIn";
                Referral: "Referral";
                Event: "Event";
                "Cold Outreach": "Cold Outreach";
                Partner: "Partner";
                Other: "Other";
            }>>;
            status: z.ZodOptional<z.ZodEnum<{
                new: "new";
                contacted: "contacted";
                qualified: "qualified";
                nurturing: "nurturing";
                unqualified: "unqualified";
                converted: "converted";
            }>>;
            leadScore: z.ZodOptional<z.ZodNumber>;
            estimatedValue: z.ZodOptional<z.ZodNumber>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    convert: z.ZodObject<{
        body: z.ZodObject<{
            createDeal: z.ZodDefault<z.ZodBoolean>;
            dealAmount: z.ZodOptional<z.ZodNumber>;
            dealTitle: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortOrder: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
            status: z.ZodOptional<z.ZodEnum<{
                new: "new";
                contacted: "contacted";
                qualified: "qualified";
                nurturing: "nurturing";
                unqualified: "unqualified";
                converted: "converted";
                all: "all";
            }>>;
            search: z.ZodOptional<z.ZodString>;
            sortBy: z.ZodOptional<z.ZodEnum<{
                date: "date";
                value: "value";
                score: "score";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const contactSchemas: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            firstName: z.ZodString;
            lastName: z.ZodString;
            email: z.ZodString;
            phone: z.ZodString;
            alternatePhone: z.ZodOptional<z.ZodString>;
            jobTitle: z.ZodString;
            companyId: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            country: z.ZodDefault<z.ZodString>;
            tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            firstName: z.ZodOptional<z.ZodString>;
            lastName: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            alternatePhone: z.ZodOptional<z.ZodString>;
            jobTitle: z.ZodOptional<z.ZodString>;
            companyId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            city: z.ZodOptional<z.ZodString>;
            country: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortBy: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
            search: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const companySchemas: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            industry: z.ZodString;
            website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            phone: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            state: z.ZodOptional<z.ZodString>;
            country: z.ZodDefault<z.ZodString>;
            employeesCount: z.ZodOptional<z.ZodString>;
            annualRevenue: z.ZodOptional<z.ZodNumber>;
            tier: z.ZodDefault<z.ZodEnum<{
                Enterprise: "Enterprise";
                Strategic: "Strategic";
                Growth: "Growth";
                "Mid-Market": "Mid-Market";
            }>>;
            description: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            industry: z.ZodOptional<z.ZodString>;
            website: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
            phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            city: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            state: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            country: z.ZodOptional<z.ZodString>;
            employeesCount: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            annualRevenue: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            tier: z.ZodOptional<z.ZodEnum<{
                Enterprise: "Enterprise";
                Strategic: "Strategic";
                Growth: "Growth";
                "Mid-Market": "Mid-Market";
            }>>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortBy: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
            search: z.ZodOptional<z.ZodString>;
            tier: z.ZodOptional<z.ZodEnum<{
                all: "all";
                Enterprise: "Enterprise";
                Strategic: "Strategic";
                Growth: "Growth";
                "Mid-Market": "Mid-Market";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const dealSchemas: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            companyId: z.ZodOptional<z.ZodString>;
            contactId: z.ZodOptional<z.ZodString>;
            amount: z.ZodNumber;
            stage: z.ZodDefault<z.ZodEnum<{
                proposal: "proposal";
                new: "new";
                discovery: "discovery";
                negotiation: "negotiation";
                won: "won";
                lost: "lost";
            }>>;
            probability: z.ZodDefault<z.ZodNumber>;
            expectedCloseDate: z.ZodString;
            priority: z.ZodDefault<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                urgent: "urgent";
            }>>;
            serviceType: z.ZodEnum<{
                "AI Development & Testing": "AI Development & Testing";
                Cybersecurity: "Cybersecurity";
                "Cloud & Data Analytics": "Cloud & Data Analytics";
                "Webstack Development": "Webstack Development";
                "Strategic Consulting": "Strategic Consulting";
                "Performance Testing": "Performance Testing";
            }>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            companyId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            contactId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            amount: z.ZodOptional<z.ZodNumber>;
            stage: z.ZodOptional<z.ZodEnum<{
                proposal: "proposal";
                new: "new";
                discovery: "discovery";
                negotiation: "negotiation";
                won: "won";
                lost: "lost";
            }>>;
            probability: z.ZodOptional<z.ZodNumber>;
            expectedCloseDate: z.ZodOptional<z.ZodString>;
            priority: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                urgent: "urgent";
            }>>;
            riskLevel: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            serviceType: z.ZodOptional<z.ZodEnum<{
                "AI Development & Testing": "AI Development & Testing";
                Cybersecurity: "Cybersecurity";
                "Cloud & Data Analytics": "Cloud & Data Analytics";
                "Webstack Development": "Webstack Development";
                "Strategic Consulting": "Strategic Consulting";
                "Performance Testing": "Performance Testing";
            }>>;
            notes: z.ZodOptional<z.ZodString>;
            lostReason: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    moveStage: z.ZodObject<{
        body: z.ZodObject<{
            stage: z.ZodEnum<{
                proposal: "proposal";
                new: "new";
                discovery: "discovery";
                negotiation: "negotiation";
                won: "won";
                lost: "lost";
            }>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortBy: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
            search: z.ZodOptional<z.ZodString>;
            stage: z.ZodOptional<z.ZodEnum<{
                proposal: "proposal";
                new: "new";
                all: "all";
                discovery: "discovery";
                negotiation: "negotiation";
                won: "won";
                lost: "lost";
            }>>;
            serviceType: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const taskSchemas: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            projectId: z.ZodOptional<z.ZodString>;
            assignedToId: z.ZodOptional<z.ZodString>;
            dueDate: z.ZodString;
            dueTime: z.ZodOptional<z.ZodString>;
            priority: z.ZodDefault<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                urgent: "urgent";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            projectId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            assignedToId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            dueDate: z.ZodOptional<z.ZodString>;
            dueTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            priority: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                urgent: "urgent";
            }>>;
            status: z.ZodOptional<z.ZodEnum<{
                not_started: "not_started";
                in_progress: "in_progress";
                completed: "completed";
                cancelled: "cancelled";
            }>>;
            progressPercent: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortBy: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
            status: z.ZodOptional<z.ZodEnum<{
                all: "all";
                not_started: "not_started";
                in_progress: "in_progress";
                completed: "completed";
                cancelled: "cancelled";
            }>>;
            priority: z.ZodOptional<z.ZodEnum<{
                all: "all";
                low: "low";
                medium: "medium";
                high: "high";
                urgent: "urgent";
            }>>;
            search: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const employeeSchemas: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            employeeId: z.ZodString;
            fullName: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
            designation: z.ZodString;
            department: z.ZodEnum<{
                HR: "HR";
                IT: "IT";
                Marketing: "Marketing";
                Sales: "Sales";
                Management: "Management";
                Founder: "Founder";
            }>;
            crmRole: z.ZodDefault<z.ZodEnum<{
                employee: "employee";
                Lead: "Lead";
                HR: "HR";
                "Employer/Admin": "Employer/Admin";
                "Team Lead": "Team Lead";
            }>>;
            underTeamLead: z.ZodOptional<z.ZodString>;
            responsibleFor: z.ZodOptional<z.ZodString>;
            joiningDate: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            fullName: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            designation: z.ZodOptional<z.ZodString>;
            department: z.ZodOptional<z.ZodEnum<{
                HR: "HR";
                IT: "IT";
                Marketing: "Marketing";
                Sales: "Sales";
                Management: "Management";
                Founder: "Founder";
            }>>;
            crmRole: z.ZodOptional<z.ZodEnum<{
                employee: "employee";
                Lead: "Lead";
                HR: "HR";
                "Employer/Admin": "Employer/Admin";
                "Team Lead": "Team Lead";
            }>>;
            underTeamLead: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            responsibleFor: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            employmentStatus: z.ZodOptional<z.ZodEnum<{
                Active: "Active";
                Inactive: "Inactive";
                "On Leave": "On Leave";
            }>>;
            isSuperior: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortBy: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
            search: z.ZodOptional<z.ZodString>;
            department: z.ZodOptional<z.ZodEnum<{
                HR: "HR";
                all: "all";
                IT: "IT";
                Marketing: "Marketing";
                Sales: "Sales";
                Management: "Management";
                Founder: "Founder";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const attendanceSchemas: {
    checkIn: z.ZodObject<{
        body: z.ZodObject<{
            date: z.ZodOptional<z.ZodString>;
            ipAddress: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    checkOut: z.ZodObject<{
        body: z.ZodObject<{
            ipAddress: z.ZodOptional<z.ZodString>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortBy: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
            employeeId: z.ZodOptional<z.ZodString>;
            startDate: z.ZodOptional<z.ZodString>;
            endDate: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                all: "all";
                Present: "Present";
                Absent: "Absent";
                HalfDay: "HalfDay";
                Leave: "Leave";
                Holiday: "Holiday";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const leaveSchemas: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            leaveType: z.ZodEnum<{
                Casual: "Casual";
                Sick: "Sick";
                Emergency: "Emergency";
                WFH: "WFH";
            }>;
            startDate: z.ZodString;
            endDate: z.ZodString;
            reason: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            status: z.ZodEnum<{
                Pending: "Pending";
                Approved: "Approved";
                Rejected: "Rejected";
            }>;
            comments: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortBy: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
            employeeId: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                all: "all";
                Pending: "Pending";
                Approved: "Approved";
                Rejected: "Rejected";
            }>>;
            leaveType: z.ZodOptional<z.ZodEnum<{
                all: "all";
                Casual: "Casual";
                Sick: "Sick";
                Emergency: "Emergency";
                WFH: "WFH";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const projectSchemas: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            clientId: z.ZodOptional<z.ZodString>;
            originatingDealId: z.ZodOptional<z.ZodString>;
            projectManagerId: z.ZodOptional<z.ZodString>;
            status: z.ZodDefault<z.ZodEnum<{
                Planning: "Planning";
                InProgress: "InProgress";
                Review: "Review";
                Completed: "Completed";
                OnHold: "OnHold";
            }>>;
            priority: z.ZodDefault<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                urgent: "urgent";
            }>>;
            startDate: z.ZodString;
            endDate: z.ZodString;
            budget: z.ZodOptional<z.ZodNumber>;
            description: z.ZodOptional<z.ZodString>;
            serviceType: z.ZodDefault<z.ZodEnum<{
                "AI Development & Testing": "AI Development & Testing";
                Cybersecurity: "Cybersecurity";
                "Cloud & Data Analytics": "Cloud & Data Analytics";
                "Webstack Development": "Webstack Development";
                "Strategic Consulting": "Strategic Consulting";
                "Performance Testing": "Performance Testing";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            clientId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            originatingDealId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            projectManagerId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            status: z.ZodOptional<z.ZodEnum<{
                Planning: "Planning";
                InProgress: "InProgress";
                Review: "Review";
                Completed: "Completed";
                OnHold: "OnHold";
            }>>;
            priority: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                urgent: "urgent";
            }>>;
            startDate: z.ZodOptional<z.ZodString>;
            endDate: z.ZodOptional<z.ZodString>;
            budget: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            progressPercent: z.ZodOptional<z.ZodNumber>;
            description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            serviceType: z.ZodOptional<z.ZodEnum<{
                "AI Development & Testing": "AI Development & Testing";
                Cybersecurity: "Cybersecurity";
                "Cloud & Data Analytics": "Cloud & Data Analytics";
                "Webstack Development": "Webstack Development";
                "Strategic Consulting": "Strategic Consulting";
                "Performance Testing": "Performance Testing";
            }>>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortBy: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
            search: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                all: "all";
                Planning: "Planning";
                InProgress: "InProgress";
                Review: "Review";
                Completed: "Completed";
                OnHold: "OnHold";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const activitySchemas: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            type: z.ZodEnum<{
                email: "email";
                task: "task";
                meeting: "meeting";
                call: "call";
                note: "note";
                deal_stage_changed: "deal_stage_changed";
                lead_converted: "lead_converted";
                system: "system";
            }>;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            entityType: z.ZodEnum<{
                company: "company";
                project: "project";
                contact: "contact";
                lead: "lead";
                deal: "deal";
                general: "general";
            }>;
            entityId: z.ZodOptional<z.ZodString>;
            entityName: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortBy: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
            type: z.ZodOptional<z.ZodString>;
            entityType: z.ZodOptional<z.ZodString>;
            search: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const documentSchemas: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            fileUrl: z.ZodString;
            fileType: z.ZodString;
            fileSize: z.ZodNumber;
            category: z.ZodEnum<{
                Other: "Other";
                SOW: "SOW";
                Contract: "Contract";
                Architecture: "Architecture";
                TestReport: "TestReport";
                Compliance: "Compliance";
            }>;
            relatedEntityType: z.ZodOptional<z.ZodString>;
            relatedEntityId: z.ZodOptional<z.ZodString>;
            version: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodEnum<{
                Other: "Other";
                SOW: "SOW";
                Contract: "Contract";
                Architecture: "Architecture";
                TestReport: "TestReport";
                Compliance: "Compliance";
            }>>;
            version: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortBy: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
            category: z.ZodOptional<z.ZodString>;
            relatedEntityType: z.ZodOptional<z.ZodString>;
            relatedEntityId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const meetingSchemas: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            startTime: z.ZodString;
            endTime: z.ZodString;
            location: z.ZodOptional<z.ZodString>;
            meetingUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            contactId: z.ZodOptional<z.ZodString>;
            contactName: z.ZodOptional<z.ZodString>;
            companyName: z.ZodOptional<z.ZodString>;
            dealId: z.ZodOptional<z.ZodString>;
            dealName: z.ZodOptional<z.ZodString>;
            attendees: z.ZodDefault<z.ZodArray<z.ZodString>>;
            status: z.ZodDefault<z.ZodEnum<{
                completed: "completed";
                cancelled: "cancelled";
                scheduled: "scheduled";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            startTime: z.ZodOptional<z.ZodString>;
            endTime: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
            meetingUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            contactId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            contactName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            companyName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            dealId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            dealName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            attendees: z.ZodOptional<z.ZodArray<z.ZodString>>;
            status: z.ZodOptional<z.ZodEnum<{
                completed: "completed";
                cancelled: "cancelled";
                scheduled: "scheduled";
            }>>;
        }, z.core.$strip>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            sortBy: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodDefault<z.ZodEnum<{
                asc: "asc";
                desc: "desc";
            }>>;
            status: z.ZodOptional<z.ZodEnum<{
                all: "all";
                completed: "completed";
                cancelled: "cancelled";
                scheduled: "scheduled";
            }>>;
            search: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export declare const authRateLimit: () => any;
//# sourceMappingURL=index.d.ts.map