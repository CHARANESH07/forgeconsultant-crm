-- ForgeConsultant CRM Realistic Demo Seed Data

INSERT INTO organizations (id, name, slug, currency, currency_symbol, timezone)
VALUES 
('a0000000-0000-0000-0000-000000000001', 'ForgeConsultant Advisory Group', 'forge-advisory', 'INR', '₹', 'Asia/Kolkata')
ON CONFLICT (id) DO NOTHING;

-- Seed Companies
INSERT INTO companies (id, organization_id, name, industry, website, phone, city, state, country, employees_count, annual_revenue, tier)
VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Titan Logistics & Supply Chain', 'Logistics & Infrastructure', 'titanlogistics.in', '+91 80 4123 9000', 'Bengaluru', 'Karnataka', 'India', '2,500 - 5,000', 450000000.00, 'Enterprise'),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Apex FinTech Global', 'Banking & Financial Services', 'apexfintech.com', '+91 22 6789 1234', 'Mumbai', 'Maharashtra', 'India', '500 - 1,000', 125000000.00, 'Strategic'),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'GreenPulse Renewable Energy', 'CleanTech & Energy', 'greenpulse.io', '+91 44 2812 5500', 'Chennai', 'Tamil Nadu', 'India', '200 - 500', 85000000.00, 'Growth'),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'NovaBio Pharmaceuticals', 'Healthcare & Life Sciences', 'novabiopharma.in', '+91 40 3344 7788', 'Hyderabad', 'Telangana', 'India', '1,000 - 2,500', 320000000.00, 'Enterprise')
ON CONFLICT (id) DO NOTHING;

-- Seed Contacts
INSERT INTO contacts (id, organization_id, first_name, last_name, email, phone, job_title, company_id, city, country, tags)
VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Vikram', 'Malhotra', 'vikram.malhotra@titanlogistics.in', '+91 98450 12345', 'Chief Information Officer', 'c0000000-0000-0000-0000-000000000001', 'Bengaluru', 'India', ARRAY['Decision Maker', 'High Priority']),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Ananya', 'Deshmukh', 'ananya.d@apexfintech.com', '+91 98200 98765', 'VP of Digital Strategy', 'c0000000-0000-0000-0000-000000000002', 'Mumbai', 'India', ARRAY['Champion', 'Executive']),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Karthik', 'Raman', 'k.raman@greenpulse.io', '+91 97900 45678', 'Chief Operating Officer', 'c0000000-0000-0000-0000-000000000003', 'Chennai', 'India', ARRAY['Technical Lead']),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Dr. Sunita', 'Rao', 'sunita.rao@novabiopharma.in', '+91 94400 11223', 'Director of Enterprise Systems', 'c0000000-0000-0000-0000-000000000004', 'Hyderabad', 'India', ARRAY['Decision Maker', 'Cloud Transformation'])
ON CONFLICT (id) DO NOTHING;

-- Seed Leads
INSERT INTO leads (id, organization_id, first_name, last_name, company_name, job_title, email, phone, lead_source, status, lead_score, estimated_value, notes, ai_summary, ai_recommended_action)
VALUES
('l0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Rajesh', 'Sengupta', 'Zenith Retail Chains', 'Chief Technology Officer', 'r.sengupta@zenithretail.in', '+91 98300 22334', 'LinkedIn', 'qualified', 88, 3500000.00, 'Looking for omnichannel ERP modernization roadmap.', 'High intent lead with approved Q3 consulting budget for ERP architecture overhaul.', 'Schedule a 45-minute technical discovery session with Enterprise Architect.'),
('l0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Meera', 'Kapoor', 'OmniPay Solutions', 'Head of Risk & Compliance', 'meera.k@omnipay.io', '+91 98110 55667', 'Website', 'contacted', 74, 1800000.00, 'Requested case study on cloud security audits.', 'Interested in SOC2 and RBI compliance advisory frameworks.', 'Send financial services compliance whitepaper and follow-up on Wednesday.'),
('l0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Rohan', 'Verma', 'AeroDynamics Aerospace', 'VP of Engineering', 'rohan.v@aerodynamics.in', '+91 99000 88990', 'Referral', 'new', 65, 4500000.00, 'Referred by Vikram Malhotra at Titan.', 'Warm referral exploring supply chain digital twins.', 'Initiate intro call referencing Titan Logistics success.')
ON CONFLICT (id) DO NOTHING;

-- Seed Deals
INSERT INTO deals (id, organization_id, title, company_id, contact_id, amount, stage, probability, expected_close_date, priority, service_type, ai_summary)
VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Titan Global Cloud Modernization', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 6500000.00, 'negotiation', 85, '2026-09-30', 'high', 'Cloud Advisory', 'Final commercial negotiations on milestone milestones. Decision expected end of month.'),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Apex FinTech AI & Fraud Advisory', 'c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 4200000.00, 'proposal', 60, '2026-10-15', 'medium', 'Data & AI', 'Proposal submitted to CTO. Review meeting scheduled next Monday.'),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'NovaBio ERP Transformation Phase 1', 'c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 8500000.00, 'won', 100, '2026-08-15', 'urgent', 'ERP Modernization', 'Contract executed. Initial sprint planning commencing next week.'),
('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'GreenPulse Microgrid Architecture', 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 2800000.00, 'discovery', 40, '2026-11-20', 'medium', 'Digital Transformation', 'Discovery workshops scheduled with engineering team.')
ON CONFLICT (id) DO NOTHING;
