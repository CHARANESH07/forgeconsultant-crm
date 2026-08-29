import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  console.log('🌱 Starting database seed...');

  // Create organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'forge-consultancy' },
    update: {},
    create: {
      name: 'Forge Consultancy',
      slug: 'forge-consultancy',
      established: '2024',
      currency: 'INR',
      currencySymbol: '₹',
      timezone: 'Asia/Kolkata',
    },
  });
  console.log('✅ Organization created:', organization.name);

  // Create departments
  const departments = ['IT', 'Marketing', 'Sales', 'HR', 'Management', 'Founder'];
  const deptMap = new Map<string, string>();

  for (const deptName of departments) {
    const dept = await prisma.department.upsert({
      where: { id: `dept-${deptName.toLowerCase()}` },
      update: {},
      create: {
        id: `dept-${deptName.toLowerCase()}`,
        organization_id: organization.id,
        name: deptName,
        description: `${deptName} Department`,
      },
    });
    deptMap.set(deptName, dept.id);
    console.log(`✅ Department created: ${deptName}`);
  }

  // Team definitions (created after employees to resolve lead IDs)
  const teamDefinitions = [
    { name: 'AI Dev & Testing', department: 'IT', leadEmail: 'venu@forgeconsultant.in' },
    { name: 'QA & Performance', department: 'IT', leadEmail: 'arunekambaram@forgeconsultant.in' },
    { name: 'Webstack', department: 'IT', leadEmail: 'snehapal@forgeconsultant.in' },
    { name: 'Marketing', department: 'Marketing', leadEmail: 'madhuvidya@forgeconsultant.in' },
    { name: 'HR Ops', department: 'HR', leadEmail: 'priyanka@forgeconsultant.in' },
  ];

  // We will create teams after employees are created to ensure lead IDs exist
  const teamMap = new Map<string, string>();
  const placeholderTeamMap = new Map<string, string>(); // name -> id (pre-employee)

  // Official employee data with password hashing
  const employees = [
    // Superiors / Founders
    {
      employee_id: 'FC-01',
      full_name: 'Sarvesh Jeevan',
      email: 'ceo@forgeconsultant.in',
      designation: 'CEO',
      department: 'Founder',
      crm_role: 'Employer/Admin',
      under_team_lead: '— (Board / Founder)',
      responsible_for: 'Executive Strategy & Global Operations',
      joining_date: '28/07/2024',
      employment_status: 'Active',
      is_superior: true,
      password: 'Forge#ceo2024',
    },
    {
      employee_id: 'FC-02',
      full_name: 'Aman Rashid',
      email: 'md@forgeconsultant.in',
      designation: 'MD',
      department: 'Founder',
      crm_role: 'Employer/Admin',
      under_team_lead: '— (Board / Founder)',
      responsible_for: 'Managing Director & Enterprise Growth',
      joining_date: '28/07/2024',
      employment_status: 'Active',
      is_superior: true,
      password: 'Forge#md2024',
    },

    // Team Leads & Leads (Superiors)
    {
      employee_id: 'FC-24',
      full_name: 'Venugopal Naidu K R',
      email: 'venu@forgeconsultant.in',
      designation: 'IT Team Lead',
      department: 'IT',
      crm_role: 'Team Lead',
      under_team_lead: 'Sarvesh Jeevan',
      responsible_for: 'AI Development & Testing Practice',
      joining_date: '04/08/2026',
      employment_status: 'Active',
      is_superior: true,
      password: 'Forge#venu2026',
    },
    {
      employee_id: 'FC-21',
      full_name: 'Sneha Pal',
      email: 'snehapal@forgeconsultant.in',
      designation: 'IT Team and Support Lead',
      department: 'IT',
      crm_role: 'Team Lead',
      under_team_lead: 'Sarvesh Jeevan',
      responsible_for: 'Web Development & other Technical Practice',
      joining_date: '12/06/2026',
      employment_status: 'Active',
      is_superior: true,
      password: 'Forge#sneha2026',
    },
    {
      employee_id: 'FC-34',
      full_name: 'Arun Ekambaram',
      email: 'arunekambaram@forgeconsultant.in',
      designation: 'Performance Test Lead',
      department: 'IT',
      crm_role: 'Team Lead',
      under_team_lead: 'Sarvesh Jeevan',
      responsible_for: 'Performance Test Lead & QA Architecture',
      joining_date: '31/07/2026',
      employment_status: 'Active',
      is_superior: true,
      password: 'Forge#arun2026',
    },
    {
      employee_id: 'FC-47',
      full_name: 'Ambati Madhuvidya Raj',
      email: 'madhuvidya@forgeconsultant.in',
      designation: 'Marketing Lead',
      department: 'Marketing',
      crm_role: 'Lead',
      under_team_lead: 'Aman Rashid',
      responsible_for: 'Marketing Strategy & Brand Growth',
      joining_date: '03/08/2026',
      employment_status: 'Active',
      is_superior: true,
      password: 'Forge#madhuvidya2026',
    },
    {
      employee_id: 'FC-48',
      full_name: 'Kaushik Raj',
      email: 'kaushik@forgeconsultant.in',
      designation: 'Business Management Lead',
      department: 'Management',
      crm_role: 'Lead',
      under_team_lead: 'Sarvesh Jeevan',
      responsible_for: 'Business Development & Enterprise Accounts',
      joining_date: '11/08/2026',
      employment_status: 'Active',
      is_superior: true,
      password: 'Forge#kaushik2026',
    },
    {
      employee_id: 'FC-33',
      full_name: 'Priyanka',
      email: 'priyanka@forgeconsultant.in',
      designation: 'HR Team Documentation',
      department: 'HR',
      crm_role: 'HR',
      under_team_lead: 'Aman Rashid',
      responsible_for: 'HR Operations & Talent Documentation',
      joining_date: '07/08/2026',
      employment_status: 'Active',
      is_superior: true,
      password: 'Forge#priyanka2026',
    },

    // Team Members / Employees
    {
      employee_id: 'FC-15',
      full_name: 'Darshan K',
      email: 'darshan@forgeconsultant.in',
      designation: 'AI Developer',
      department: 'IT',
      crm_role: 'employee',
      under_team_lead: 'Venugopal Naidu K R',
      responsible_for: 'AI Development & Testing',
      joining_date: '04/08/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#darshan2026',
    },
    {
      employee_id: 'FC-25',
      full_name: 'Anushree B C',
      email: 'anushree@forgeconsultant.in',
      designation: 'AI Developer',
      department: 'IT',
      crm_role: 'employee',
      under_team_lead: 'Venugopal Naidu K R',
      responsible_for: 'AI Development & Testing',
      joining_date: '31/07/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#anushree2026',
    },
    {
      employee_id: 'FC-31',
      full_name: 'Pradeep A',
      email: 'pradeep@forgeconsultant.in',
      designation: 'Backend Developer',
      department: 'IT',
      crm_role: 'employee',
      under_team_lead: 'Arun Ekambaram',
      responsible_for: 'AI Development & Training',
      joining_date: '07/08/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#pradeep2026',
    },
    {
      employee_id: 'FC-39',
      full_name: 'Eric Nepolean T',
      email: 'eric@forgeconsultant.in',
      designation: 'Backend Developer',
      department: 'IT',
      crm_role: 'employee',
      under_team_lead: 'Venugopal Naidu K R',
      responsible_for: 'AI Development & Testing',
      joining_date: '04/08/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#eric2026',
    },
    {
      employee_id: 'FC-28',
      full_name: 'Pragath R',
      email: 'pragath@forgeconsultant.in',
      designation: 'Cloud Data Analyst',
      department: 'IT',
      crm_role: 'employee',
      under_team_lead: 'Arun Ekambaram',
      responsible_for: 'Deployment & Analysing Data',
      joining_date: '03/08/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#pragath2026',
    },
    {
      employee_id: 'FC-37',
      full_name: 'Ayushi Katiyar',
      email: 'ayushi@forgeconsultant.in',
      designation: 'Cyber Security Consultant',
      department: 'IT',
      crm_role: 'employee',
      under_team_lead: 'Arun Ekambaram',
      responsible_for: 'Cybersecurity & Project Security',
      joining_date: '31/07/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#ayushi2026',
    },
    {
      employee_id: 'FC-40',
      full_name: 'Charanesh S',
      email: 'charans@forgeconsultant.in',
      designation: 'Data Analyst',
      department: 'IT',
      crm_role: 'employee',
      under_team_lead: 'Venugopal Naidu K R',
      responsible_for: 'AI Development & Testing',
      joining_date: '04/08/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#charans2026',
    },
    {
      employee_id: 'FC-42',
      full_name: 'Yash Singh',
      email: 'yashsingh@forgeconsultant.in',
      designation: 'Support Engineer',
      department: 'IT',
      crm_role: 'employee',
      under_team_lead: 'Sneha Pal',
      responsible_for: 'Web Development & other Technical',
      joining_date: '01/08/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#yash2026',
    },
    {
      employee_id: 'FC-14',
      full_name: 'Aryan Kumar',
      email: 'aryan@forgeconsultant.in',
      designation: 'Webstack Developer',
      department: 'IT',
      crm_role: 'employee',
      under_team_lead: 'Sneha Pal',
      responsible_for: 'Web Development and other Technical',
      joining_date: '16/06/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#aryan2026',
    },
    {
      employee_id: 'FC-43',
      full_name: 'Unnati Singh',
      email: 'unnati@forgeconsultant.in',
      designation: 'Sales Executive',
      department: 'Sales',
      crm_role: 'employee',
      under_team_lead: 'Kaushik Raj',
      responsible_for: 'Client Outreach & Lead Qualification',
      joining_date: '10/08/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#unnati2026',
    },
    {
      employee_id: 'FC-32',
      full_name: 'Swapna Sirigiri',
      email: 'swapnamouli@forgeconsultant.in',
      designation: 'HR TEAM Ops',
      department: 'HR',
      crm_role: 'employee',
      under_team_lead: 'Priyanka',
      responsible_for: 'Employee Onboarding & HR Operations',
      joining_date: '07/08/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#swapna2026',
    },
    {
      employee_id: 'FC-26',
      full_name: 'Sinchana M R',
      email: 'sinchana@forgeconsultant.in',
      designation: 'AI Database Engineer',
      department: 'IT',
      crm_role: 'employee',
      under_team_lead: 'Venugopal Naidu K R',
      responsible_for: 'AI Development & Testing',
      joining_date: '31/07/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#sinchana2026',
    },
    {
      employee_id: 'FC-30',
      full_name: 'Mohammad Ali',
      email: 'ali@forgeconsultant.in',
      designation: 'Marketing Specialist',
      department: 'Marketing',
      crm_role: 'employee',
      under_team_lead: 'Ambati Madhuvidya Raj',
      responsible_for: 'Digital Marketing & Content Campaigns',
      joining_date: '04/08/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#ali2026',
    },
    {
      employee_id: 'FC-38',
      full_name: 'Sujay Jain',
      email: 'sujay@forgeconsultant.in',
      designation: 'Backend Developer',
      department: 'IT',
      crm_role: 'employee',
      under_team_lead: 'Arun Ekambaram',
      responsible_for: 'AI Development & Training & Backend',
      joining_date: '04/08/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#sujay2026',
    },
    {
      employee_id: 'FC-27',
      full_name: 'Lekhana R',
      email: 'lekhana@forgeconsultant.in',
      designation: 'AI Developer',
      department: 'IT',
      crm_role: 'employee',
      under_team_lead: 'Venugopal Naidu K R',
      responsible_for: 'AI Development & Testing',
      joining_date: '31/07/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#lekhana2026',
    },
    {
      employee_id: 'FC-45',
      full_name: 'Mohammad Farman',
      email: 'farman@forgeconsultant.in',
      designation: 'Marketing',
      department: 'Marketing',
      crm_role: 'employee',
      under_team_lead: 'Ambati Madhuvidya Raj',
      responsible_for: 'Lead Generation & Brand Campaigns',
      joining_date: '14/08/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#farman2026',
    },
    {
      employee_id: 'FC-39-P',
      full_name: 'Pallavi P',
      email: 'pallavi@forgeconsultant.in',
      designation: 'Marketing Specialist',
      department: 'Marketing',
      crm_role: 'employee',
      under_team_lead: 'Ambati Madhuvidya Raj',
      responsible_for: 'Marketing Strategy & Outreach',
      joining_date: '07/08/2026',
      employment_status: 'Active',
      is_superior: false,
      password: 'Forge#pallavi2026',
    },
  ];

  // Hash passwords and create employees WITHOUT team assignment initially (team_id = null)
  // This ensures employees exist before teams can reference their IDs
  for (const emp of employees) {
    const passwordHash = await bcrypt.hash(emp.password, 12);
    const deptId = deptMap.get(emp.department);

    const created = await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        organization_id: organization.id,
        department_id: deptId,
        team_id: null,
        employee_id: emp.employee_id,
        full_name: emp.full_name,
        email: emp.email,
        designation: emp.designation,
        crm_role: emp.crm_role,
        under_team_lead: emp.under_team_lead,
        responsible_for: emp.responsible_for,
        joining_date: emp.joining_date,
        employment_status: emp.employment_status,
        is_superior: emp.is_superior,
        password_hash: passwordHash,
      },
    });
    console.log(`✅ Employee created: ${created.full_name} (${created.employee_id})`);
  }

  // Now create teams with correct lead IDs (employees now exist)
  for (const team of teamDefinitions) {
    const lead = await prisma.employee.findUnique({ where: { email: team.leadEmail } });
    const teamRecord = await prisma.team.upsert({
      where: { id: `team-${team.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` },
      update: { team_lead_id: lead?.id, department_id: deptMap.get(team.department)! },
      create: {
        id: `team-${team.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        organization_id: organization.id,
        department_id: deptMap.get(team.department)!,
        name: team.name,
        team_lead_id: lead?.id,
      },
    });
    teamMap.set(team.name, teamRecord.id);
    console.log(`✅ Team created: ${team.name} (lead: ${lead?.full_name ?? 'none'})`);
  }

  // Build mapping: lead full_name -> team_id and lead email -> team_id
  const leadNameToTeamId = new Map<string, string>();
  const leadEmailToTeamId = new Map<string, string>();
  for (const team of teamDefinitions) {
    const lead = await prisma.employee.findUnique({ where: { email: team.leadEmail } });
    if (lead) {
      leadNameToTeamId.set(lead.full_name, teamMap.get(team.name)!);
      leadEmailToTeamId.set(lead.email, teamMap.get(team.name)!);
    }
  }
  // Also map team leads to their own team (they should belong to team they lead)
  for (const [name, tid] of leadNameToTeamId.entries()) {
    // nothing else, just ensuring mapping exists
  }

  // Update employees with correct team_id based on under_team_lead
  // Logic:
  // - If employee is a team lead (their full_name is in leadNameToTeamId), assign them to their own team
  // - Else if under_team_lead matches a lead full_name, assign to that lead's team
  // - Else if under_team_lead is "— (Board / Founder)" or unknown, leave null (founder/no team)
  for (const emp of employees) {
    let targetTeamId: string | null = null;
    if (leadNameToTeamId.has(emp.full_name)) {
      targetTeamId = leadNameToTeamId.get(emp.full_name)!;
    } else if (emp.under_team_lead && leadNameToTeamId.has(emp.under_team_lead)) {
      targetTeamId = leadNameToTeamId.get(emp.under_team_lead)!;
    } else {
      // No team (founder, or reports to non-team-lead like Kaushik Raj who has no team)
      // Try to resolve via department fallback: if employee reports to Kaushik (Management) who has no team, keep null
      targetTeamId = null;
    }

    if (targetTeamId) {
      await prisma.employee.update({
        where: { email: emp.email },
        data: { team_id: targetTeamId },
      });
      console.log(`  ↳ Assigned ${emp.full_name} → team ${[...teamMap.entries()].find(([k,v])=>v===targetTeamId)?.[0]}`);
    }
  }
  console.log('✅ Employee team assignments corrected');

  // Create sample companies
  const companies = [
    {
      name: 'Titan Logistics & Supply Chain',
      industry: 'Logistics & Infrastructure',
      website: 'https://titanlogistics.in',
      phone: '+91 80 4123 9000',
      email: 'corp@titanlogistics.in',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      employees_count: '2,500 - 5,000',
      annual_revenue: 450000000,
      tier: 'Enterprise',
      description: 'National freight and automated fulfillment network.',
    },
    {
      name: 'Apex FinTech Global',
      industry: 'Banking & Financial Services',
      website: 'https://apexfintech.com',
      phone: '+91 22 6789 1234',
      email: 'contact@apexfintech.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      employees_count: '500 - 1,000',
      annual_revenue: 125000000,
      tier: 'Strategic',
      description: 'High-frequency digital payments processor and neo-banking platform.',
    },
    {
      name: 'GreenPulse Renewable Energy',
      industry: 'CleanTech & Energy',
      website: 'https://greenpulse.io',
      phone: '+91 44 2812 5500',
      email: 'info@greenpulse.io',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      employees_count: '200 - 500',
      annual_revenue: 85000000,
      tier: 'Growth',
      description: 'Commercial solar microgrid operator and IoT energy telemetry.',
    },
    {
      name: 'NovaBio Pharmaceuticals',
      industry: 'Healthcare & Life Sciences',
      website: 'https://novabiopharma.in',
      phone: '+91 40 3344 7788',
      email: 'inquiries@novabiopharma.in',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      employees_count: '1,000 - 2,500',
      annual_revenue: 320000000,
      tier: 'Enterprise',
      description: 'Specialty biosimilars manufacturer with WHO-GMP compliant labs.',
    },
  ];

  for (const comp of companies) {
    const owner = await prisma.employee.findFirst({ where: { crm_role: 'Employer/Admin' } });
    await prisma.company.upsert({
      where: { id: `comp-${comp.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` },
      update: {},
      create: {
        organization_id: organization.id,
        ...comp,
        owner_id: owner?.id,
      },
    });
    console.log(`✅ Company created: ${comp.name}`);
  }

  // Fetch companies for relations
  const titanCompany = await prisma.company.findFirst({ where: { name: 'Titan Logistics & Supply Chain' } });
  const apexCompany = await prisma.company.findFirst({ where: { name: 'Apex FinTech Global' } });
  const greenCompany = await prisma.company.findFirst({ where: { name: 'GreenPulse Renewable Energy' } });
  const novaCompany = await prisma.company.findFirst({ where: { name: 'NovaBio Pharmaceuticals' } });

  // Owners for seed data
  const ceoOwner = await prisma.employee.findUnique({ where: { email: 'ceo@forgeconsultant.in' } });
  const venuOwner = await prisma.employee.findUnique({ where: { email: 'venu@forgeconsultant.in' } });
  const kaushikOwner = await prisma.employee.findUnique({ where: { email: 'kaushik@forgeconsultant.in' } });
  const snehaOwner = await prisma.employee.findUnique({ where: { email: 'snehapal@forgeconsultant.in' } });

  // Create Contacts (4) - using relation connects for Prisma 7
  const contactsData = [
    {
      id: 'contact-vikram-malhotra',
      email: 'vikram.malhotra@titanlogistics.in',
      first_name: 'Vikram',
      last_name: 'Malhotra',
      phone: '+91 98450 12345',
      alternate_phone: '+91 80 4123 9011',
      job_title: 'Chief Information Officer',
      companyId: titanCompany?.id,
      city: 'Bengaluru',
      country: 'India',
      ownerId: ceoOwner?.id,
      tags: ['Decision Maker', 'AI Development', 'VIP'],
      notes: 'Key client executive leading the enterprise AI testing and cloud modernization.',
    },
    {
      id: 'contact-ananya-deshmukh',
      email: 'ananya.d@apexfintech.com',
      phone: '+91 98200 98765',
      first_name: 'Ananya',
      last_name: 'Deshmukh',
      job_title: 'VP of Digital Strategy',
      companyId: apexCompany?.id,
      city: 'Mumbai',
      country: 'India',
      ownerId: ceoOwner?.id,
      tags: ['Champion', 'Cybersecurity', 'Executive'],
      notes: 'Spearheading fraud detection ML algorithms and ISO 27001 compliance.',
    },
    {
      id: 'contact-karthik-raman',
      email: 'k.raman@greenpulse.io',
      first_name: 'Karthik',
      last_name: 'Raman',
      phone: '+91 97900 45678',
      job_title: 'Chief Operating Officer',
      companyId: greenCompany?.id,
      city: 'Chennai',
      country: 'India',
      ownerId: venuOwner?.id,
      tags: ['Technical Lead', 'Web Development'],
      notes: 'Assessing Forge Consultancy for telemetry web portal development.',
    },
    {
      id: 'contact-sunita-rao',
      email: 'sunita.rao@novabiopharma.in',
      first_name: 'Dr. Sunita',
      last_name: 'Rao',
      phone: '+91 94400 11223',
      job_title: 'Director of Enterprise Systems',
      companyId: novaCompany?.id,
      city: 'Hyderabad',
      country: 'India',
      ownerId: ceoOwner?.id,
      tags: ['Decision Maker', 'Performance Testing'],
      notes: 'Signed off on automated performance testing and load verification.',
    },
  ];

  for (const c of contactsData) {
    await prisma.contact.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        first_name: c.first_name,
        last_name: c.last_name,
        email: c.email,
        phone: c.phone,
        alternate_phone: c.alternate_phone,
        job_title: c.job_title,
        city: c.city,
        country: c.country,
        tags: c.tags,
        notes: c.notes,
        ...(c.companyId ? { company: { connect: { id: c.companyId } } } : {}),
        ...(c.ownerId ? { owner: { connect: { id: c.ownerId } } } : {}),
      },
    });
    console.log(`✅ Contact created: ${c.first_name} ${c.last_name} (${c.email})`);
  }

  // Fetch contacts for deal relations
  const vikramContact = await prisma.contact.findUnique({ where: { id: 'contact-vikram-malhotra' } });
  const ananyaContact = await prisma.contact.findUnique({ where: { id: 'contact-ananya-deshmukh' } });
  const karthikContact = await prisma.contact.findUnique({ where: { id: 'contact-karthik-raman' } });
  const sunitaContact = await prisma.contact.findUnique({ where: { id: 'contact-sunita-rao' } });

  // Create Leads (3) - realistic demo (using relation connect for owner)
  const leadsRaw = [
    {
      id: 'lead-zenith-retail',
      first_name: 'Rajesh',
      last_name: 'Sengupta',
      company_name: 'Zenith Retail Chains',
      job_title: 'Chief Technology Officer',
      email: 'r.sengupta@zenithretail.in',
      phone: '+91 98300 22334',
      website: 'https://zenithretail.in',
      location: 'Kolkata, West Bengal',
      industry: 'Retail & E-Commerce',
      lead_source: 'LinkedIn',
      status: 'qualified',
      lead_score: 92,
      estimated_value: 4500000,
      ownerId: kaushikOwner?.id ?? ceoOwner?.id,
      notes: 'Inbound inquiry for full-stack AI development and POS performance testing.',
      ai_summary: 'High-intent enterprise lead with approved Q3 budget for AI & Performance testing.',
      ai_recommended_action: 'Conduct technical scoping session with Venugopal Naidu and Arun Ekambaram.',
    },
    {
      id: 'lead-omnipay',
      first_name: 'Meera',
      last_name: 'Kapoor',
      company_name: 'OmniPay Solutions',
      job_title: 'Head of Risk & Compliance',
      email: 'meera.k@omnipay.io',
      phone: '+91 98110 55667',
      website: 'https://omnipay.io',
      location: 'Gurugram, Haryana',
      industry: 'Banking & Financial Services',
      lead_source: 'Website',
      status: 'contacted',
      lead_score: 78,
      estimated_value: 2800000,
      ownerId: ceoOwner?.id,
      notes: 'Requested consultation on cloud data analysis and cybersecurity audit.',
      ai_summary: 'Fintech compliance deadline in Q4. High demand for security consulting.',
      ai_recommended_action: 'Assign Ayushi Katiyar for cybersecurity posture review.',
    },
    {
      id: 'lead-aerodynamics',
      first_name: 'Rohan',
      last_name: 'Verma',
      company_name: 'AeroDynamics Aerospace',
      job_title: 'VP of Engineering',
      email: 'rohan.v@aerodynamics.in',
      phone: '+91 99000 88990',
      website: 'https://aerodynamics.in',
      location: 'Bengaluru, Karnataka',
      industry: 'Aerospace & Defense',
      lead_source: 'Referral',
      status: 'new',
      lead_score: 95,
      estimated_value: 6500000,
      ownerId: ceoOwner?.id,
      notes: 'Direct referral from Titan Logistics. Exploring telemetry data and AI modeling.',
      ai_summary: 'Executive referral with verified budget from board level.',
      ai_recommended_action: 'Direct briefing by Sarvesh Jeevan (CEO) with IT Lead Venugopal Naidu.',
    },
  ];

  for (const l of leadsRaw) {
    const { ownerId, ...rest } = l;
    await prisma.lead.upsert({
      where: { id: l.id },
      update: {},
      create: {
        ...rest,
        ...(ownerId ? { owner: { connect: { id: ownerId } } } : {}),
      },
    });
    console.log(`✅ Lead created: ${l.first_name} ${l.last_name} (${l.company_name}) - ${l.status}`);
  }

  // Create Deals (4) - pipeline stages (using relation connects)
  const dealsRaw = [
    {
      id: 'deal-titan-ai',
      title: 'Titan Global AI Testing & Cloud Modernization',
      companyId: titanCompany?.id,
      contactId: vikramContact?.id,
      amount: 6500000,
      stage: 'negotiation',
      probability: 85,
      expected_close_date: '2026-09-30',
      ownerId: ceoOwner?.id,
      priority: 'urgent',
      risk_level: 'low',
      service_type: 'AI Development & Testing',
      ai_summary: 'Commercial terms in final review. Scope led by Venugopal Naidu and Arun Ekambaram.',
      notes: 'Final SOW ready for countersigning.',
    },
    {
      id: 'deal-apex-cyber',
      title: 'Apex FinTech Cybersecurity & ML Advisory',
      companyId: apexCompany?.id,
      contactId: ananyaContact?.id,
      amount: 4800000,
      stage: 'proposal',
      probability: 60,
      expected_close_date: '2026-10-15',
      ownerId: kaushikOwner?.id ?? ceoOwner?.id,
      priority: 'high',
      risk_level: 'medium',
      service_type: 'Cybersecurity',
      ai_summary: 'Proposal submitted to VP of Strategy. Key focus on real-time neural network fraud audit.',
      notes: 'Awaiting client feedback on proposal.',
    },
    {
      id: 'deal-novabio-perf',
      title: 'NovaBio Performance Testing Suite',
      companyId: novaCompany?.id,
      contactId: sunitaContact?.id,
      amount: 8500000,
      stage: 'won',
      probability: 100,
      expected_close_date: '2026-08-15',
      ownerId: ceoOwner?.id,
      priority: 'urgent',
      risk_level: 'low',
      service_type: 'Performance Testing',
      ai_summary: 'Closed enterprise contract. Arun Ekambaram leading sprint execution with QA team.',
      notes: 'Closed as WON.',
      closed_at: new Date('2026-08-15T18:00:00Z'),
    },
    {
      id: 'deal-greenpulse-web',
      title: 'GreenPulse Telemetry Webstack Architecture',
      companyId: greenCompany?.id,
      contactId: karthikContact?.id,
      amount: 3200000,
      stage: 'discovery',
      probability: 40,
      expected_close_date: '2026-11-20',
      ownerId: snehaOwner?.id ?? ceoOwner?.id,
      priority: 'medium',
      risk_level: 'low',
      service_type: 'Webstack Development',
      ai_summary: 'Discovery workshops led by Sneha Pal with Aryan Kumar.',
      notes: 'In discovery phase.',
    },
  ];

  for (const d of dealsRaw) {
    const { companyId, contactId, ownerId, ...rest } = d;
    await prisma.deal.upsert({
      where: { id: d.id },
      update: {},
      create: {
        ...rest,
        ...(companyId ? { company: { connect: { id: companyId } } } : {}),
        ...(contactId ? { contact: { connect: { id: contactId } } } : {}),
        ...(ownerId ? { owner: { connect: { id: ownerId } } } : {}),
      },
    });
    console.log(`✅ Deal created: ${d.title} (${d.stage})`);
  }

  // Create sample Tasks (3) for dashboard verification - only if not already exists
  const existingTasks = await prisma.task.count();
  if (existingTasks === 0 || existingTasks < 3) {
    const taskSamples = [
      {
        id: 'task-sample-1',
        title: 'Finalize Commercial SOW for Titan Logistics',
        description: 'Review SLA clauses with Sarvesh Jeevan before final client executive signing.',
        due_date: '2026-08-30',
        due_time: '14:00',
        priority: 'urgent',
        status: 'in_progress',
        assignedToId: venuOwner?.id,
        createdById: ceoOwner?.id,
      },
      {
        id: 'task-sample-2',
        title: 'Technical Discovery Call with Rajesh Sengupta',
        description: 'Scoping meeting on AI model architecture with Darshan K and Anushree B C.',
        due_date: '2026-08-31',
        due_time: '11:00',
        priority: 'high',
        status: 'not_started',
        assignedToId: venuOwner?.id,
        createdById: ceoOwner?.id,
      },
      {
        id: 'task-sample-3',
        title: 'Cybersecurity Posture Audit for OmniPay Lead',
        description: 'Send compliance frameworks and ISO checklists prepared by Ayushi Katiyar.',
        due_date: '2026-08-29',
        due_time: '17:00',
        priority: 'medium',
        status: 'completed',
        assignedToId: kaushikOwner?.id,
        createdById: ceoOwner?.id,
        completed_at: new Date(),
      },
    ];
    for (const t of taskSamples) {
      const { assignedToId, createdById, ...rest } = t;
      await prisma.task.upsert({
        where: { id: t.id },
        update: {},
        create: {
          ...rest,
          ...(assignedToId ? { assigned_to: { connect: { id: assignedToId } } } : {}),
          ...(createdById ? { created_by: { connect: { id: createdById } } } : {}),
        },
      });
      console.log(`✅ Task created: ${t.title} (${t.status})`);
    }
  } else {
    console.log(`ℹ️ Tasks already seeded (${existingTasks} found), skipping sample tasks`);
  }

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });