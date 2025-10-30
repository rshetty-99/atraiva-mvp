# Claude Code Rules for Atraiva Breach Notification SaaS Platform

## Project Overview

**Atraiva** is a multi-tenant SaaS platform enabling cybersecurity law firms to manage breach notification compliance for multiple enterprise clients using Microsoft Purview metadata snapshots, automated regulatory mapping, and incident response workflows.

### Core Value Propositions
- **For Law Firms**: Streamline breach notification across multiple clients with automated compliance assessment
- **For Enterprises**: Ensure timely, accurate breach notifications meeting all regulatory requirements
- **For Channel Partners**: White-label compliance management platform for their clients

---

## Technology Stack Standards

### Primary Stack
```yaml
Frontend:
  Framework: Next.js 15.3+ (stable production version)
  Language: TypeScript (strict mode)
  UI Library: Tailwind CSS + shadcn/ui
  State Management: Context API / Zustand
  Forms: CustomFormField components (MANDATORY)
  Testing: Playwright MCP integration

Backend:
  Database: 
    - Firestore (NoSQL) - Primary
    - Firebase Realtime DB - Live updates
    - PostgreSQL (via Firebase Connect) - Reporting
  
  Authentication: Clerk (Multi-tenant RBAC)
  Hosting: Firebase (Google Cloud Platform)
  
  APIs:
    - RESTful API (primary)
    - GraphQL (complex queries)
    - WebSockets (real-time updates)

Integrations:
  - Microsoft Purview (REST API) - REQUIRED MCP
  - Clerk (Authentication) - REQUIRED MCP
  - shadcn/ui components - REQUIRED MCP
  - Twilio (Notifications - opt-in required)
  - Google Analytics (Analytics)
  - Grafana (Monitoring)

DevOps:
  CI/CD: GitHub Actions
  Monitoring: Grafana + Google Cloud Monitoring
  Error Tracking: Sentry
  Logging: Google Cloud Logging
```

---

## Hybrid Architecture: Foundation → Services → Personas

### Layer 1: Foundation Features

These are prerequisite features that must be completed before building persona-specific features.

#### **F001: Platform Foundation**
**Branch**: `feature/F001-platform-foundation`
**Dependencies**: None (Base requirement)
**Agent Assignment**: full-stack-engineer, devops-engineer, security-engineer
**Description**: Core platform infrastructure and multi-tenant architecture

**Sub-features**:
- F001.1: Next.js 15.3+ project setup with TypeScript strict mode
- F001.2: Firebase/Firestore configuration with multi-tenant isolation
- F001.3: Multi-tenant data architecture and security rules
- F001.4: CI/CD pipeline with GitHub Actions (staging/production)
- F001.5: Security middleware and encryption setup
- F001.6: Monitoring and logging infrastructure (Grafana + Google Cloud)
- F001.7: Base API structure and error handling
- F001.8: Environment configuration and secrets management

**Acceptance Criteria**:
- [ ] Next.js project with TypeScript strict mode operational
- [ ] Firebase project configured with Firestore security rules
- [ ] Multi-tenant data isolation verified and tested
- [ ] CI/CD pipeline deploying to staging and production
- [ ] Security audit passing with encryption at rest/transit
- [ ] Monitoring dashboards functional with alerting
- [ ] Base API responding with proper error handling
- [ ] Environment configurations secure and documented

---

#### **F002: User Management, RBAC & Unified Dashboard Framework**
**Branch**: `feature/F002-user-management-rbac-dashboard`
**Dependencies**: F001
**Agent Assignment**: full-stack-engineer, ui-designer, security-engineer, compliance-officer
**Description**: Complete user management system with role-based dashboard generation and unified navigation framework

**Sub-features**:
- F002.1: Clerk authentication integration with multi-tenancy
- F002.2: Organization management (Law Firms, Enterprises, Partners)
- F002.3: User CRUD operations with role assignments
- F002.4: Role hierarchy implementation with permission matrix
- F002.5: Multi-factor authentication for admin roles
- F002.6: Parent-subsidiary organization relationships
- F002.7: User onboarding workflows with email verification
- F002.8: Session management and security controls
- F002.9: Role-based dashboard generator and routing system
- F002.10: Dynamic navigation menu builder with permission-based visibility
- F002.11: Permission-based feature toggling and access control
- F002.12: Unified dashboard layout system with responsive templates
- F002.13: User preference management and personalization
- F002.14: Quick role switching for multi-role users
- F002.15: Personalized widget system and dashboard customization

**Role Definitions**:
```yaml
Platform Level:
  Super Admin: Full platform access, manage all tenants
  Platform Admin: Platform operations, support management

Organization Level:
  Law Firm Admin: Manage law firm users, onboard clients, configure integrations
  Law Firm Manager: Manage assigned clients, create incidents, generate notifications
  Law Firm Analyst: View client data, create drafts, upload evidence
  
  Enterprise Admin: Manage enterprise users, approve incidents, configure integrations
  Enterprise Manager: View dashboards, initiate incidents, review notifications
  Enterprise Viewer: View compliance status, access reports (read-only)

Special Roles:
  Channel Partner Admin: White-label configuration, partner billing
  Individual Auditor: Time-limited access, client-specific permissions
```

**Dashboard Framework Models**:
```typescript
interface Dashboard {
  id: string;
  userId: string;
  role: UserRole;
  layout: DashboardLayout;
  menuItems: MenuItem[];
  widgets: Widget[];
  theme: DashboardTheme;
  preferences: UserPreferences;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  requiredPermission: string;
  badge?: string;
  children?: MenuItem[];
  isActive?: boolean;
}

interface Widget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'list' | 'custom';
  title: string;
  position: { x: number; y: number; width: number; height: number; };
  data: any;
  config: WidgetConfig;
  requiredPermission?: string;
}

interface DashboardLayout {
  template: 'sidebar' | 'top-nav' | 'hybrid';
  gridColumns: number;
  theme: 'light' | 'dark' | 'auto';
  compactMode: boolean;
}
```

**API Endpoints**:
```typescript
// User Management
POST   /api/auth/users
GET    /api/auth/users
PUT    /api/auth/users/:id
DELETE /api/auth/users/:id

// Organization Management
POST   /api/organizations
GET    /api/organizations
PUT    /api/organizations/:id
DELETE /api/organizations/:id

// Role Management
POST   /api/roles/assign
GET    /api/roles/permissions
PUT    /api/roles/:id/permissions

// Dashboard Framework
GET    /api/dashboard/layout/:role
GET    /api/dashboard/menu/:userId
GET    /api/dashboard/widgets/:role
PUT    /api/dashboard/preferences/:userId
POST   /api/dashboard/register-feature
POST   /api/dashboard/register-widget
DELETE /api/dashboard/widget/:id

// Feature Module Registration (for Persona Features)
POST   /api/dashboard/features/register
GET    /api/dashboard/features/available
PUT    /api/dashboard/features/:id/toggle
GET    /api/dashboard/routes/user/:userId
```

**Role-to-Dashboard Mapping**:
```yaml
Law Firm Admin Dashboard:
  Layout: sidebar
  Widgets: [client-portfolio, team-activity, compliance-scorecard, revenue-metrics]
  Menu: [clients, team, compliance, billing, reports, settings]
  Theme: professional-blue

Law Firm Manager Dashboard:
  Layout: hybrid
  Widgets: [active-incidents, upcoming-deadlines, task-queue, team-assignments]
  Menu: [incidents, compliance, notifications, tasks, reports]
  Theme: operational-green

Law Firm Analyst Dashboard:
  Layout: sidebar
  Widgets: [assigned-tasks, evidence-queue, draft-status, recent-activity]
  Menu: [tasks, evidence, drafts, documents, help]
  Theme: analyst-purple

Enterprise Admin Dashboard:
  Layout: top-nav
  Widgets: [company-compliance, incident-overview, subsidiary-summary, audit-activity]
  Menu: [overview, incidents, compliance, users, subsidiaries, audit]
  Theme: enterprise-navy

Enterprise Manager Dashboard:
  Layout: sidebar
  Widgets: [department-status, my-incidents, compliance-alerts, team-metrics]
  Menu: [dashboard, incidents, compliance, team, reports]
  Theme: manager-teal

Enterprise Viewer Dashboard:
  Layout: simple
  Widgets: [compliance-status, recent-reports, notifications]
  Menu: [dashboard, reports, help]
  Theme: viewer-gray
```

**Acceptance Criteria**:
- [ ] Clerk multi-tenant authentication fully operational
- [ ] All role types implemented with proper permissions
- [ ] Permission matrix enforced across all API endpoints
- [ ] MFA required and functional for admin roles
- [ ] Parent-subsidiary relationships working correctly
- [ ] User onboarding workflow complete with email verification
- [ ] API endpoints responding correctly with proper authorization
- [ ] Session timeout and security controls functional
- [ ] Role-based dashboard generation working for all user types
- [ ] Dynamic menu system showing only permitted features
- [ ] Widget system operational with drag-and-drop customization
- [ ] User preferences saved and applied correctly
- [ ] Multi-role user switching functional
- [ ] Feature module registration system operational
- [ ] Dashboard responsive across all device sizes
- [ ] Theme customization working per role defaults

---

### Layer 2: Shared Service Features

These are backend services with APIs that persona features consume. Each service is independent and scalable.

#### **F003: Purview Integration Service**
**Branch**: `feature/F003-purview-integration-service`
**Dependencies**: F001, F002
**Agent Assignment**: backend-architect, security-engineer, full-stack-engineer
**Description**: Standalone Microsoft Purview integration service with comprehensive API

**Sub-features**:
- F003.1: OAuth 2.0 Azure AD authentication and token management
- F003.2: Service Principal management per client organization
- F003.3: Connection health monitoring and status reporting
- F003.4: 19 PII element category detection and classification
- F003.5: Snapshot management (Full, Delta, On-demand scheduling)
- F003.6: Custom classifier support and configuration
- F003.7: Sensitivity label mapping and lineage tracking
- F003.8: Rate limiting and API quota management

**PII Elements Coverage**:
```yaml
Core Identifiers: Full legal name, Alias/Preferred name, Maiden name
Government IDs: SSN, Driver's License, TIN/EIN, Passport
Financial Data: Bank Account, Credit Card, Routing Number
Health Information: Medical Record, Diagnoses, Insurance ID
Biometric Data: Fingerprint, Face Recognition, Palm Geometry
Digital Identifiers: IP Address, MAC Address, IMEI
Credentials: Username, Password, PIN
Location Data: GPS Coordinates, Physical Address, VIN
Demographics: Date of Birth, Gender/Sex, Age
Additional: Political Affiliation, Union Membership, Education Records, Email, Phone
```

**API Endpoints**:
```typescript
// Connection Management
POST   /api/purview/connections
GET    /api/purview/connections
PUT    /api/purview/connections/:id
DELETE /api/purview/connections/:id
POST   /api/purview/connections/:id/test

// Snapshot Operations
POST   /api/purview/snapshots/trigger
GET    /api/purview/snapshots
GET    /api/purview/snapshots/:id
DELETE /api/purview/snapshots/:id

// Data Discovery
GET    /api/purview/pii-elements
GET    /api/purview/classifications
GET    /api/purview/lineage/:assetId
POST   /api/purview/scan/:dataSourceId

// Health Monitoring
GET    /api/purview/health
GET    /api/purview/status/:connectionId
```

**Acceptance Criteria**:
- [ ] Azure AD OAuth integration fully functional
- [ ] Service Principal per client working with proper isolation
- [ ] All 19 PII categories detected accurately
- [ ] Snapshot scheduling and processing operational
- [ ] Connection health monitoring active with alerts
- [ ] Rate limiting implemented (4 catalog, 2 scan req/sec)
- [ ] 90-day snapshot retention policy enforced
- [ ] API endpoints responding with proper error handling
- [ ] Custom classifiers supported and configurable

---

#### **F004: Incident Management Service**
**Branch**: `feature/F004-incident-management-service`
**Dependencies**: F001, F002, F003
**Agent Assignment**: backend-architect, full-stack-engineer, security-engineer
**Description**: Core incident lifecycle management service with comprehensive API

**Sub-features**:
- F004.1: Incident CRUD operations with validation
- F004.2: Status workflow management (Detected → Investigating → Confirmed → Contained → Eradicated → Recovered → Closed)
- F004.3: Evidence management with chain of custody and SHA-256 hashing
- F004.4: Timeline tracking and event logging
- F004.5: Impact assessment automation with affected individual counting
- F004.6: Incident assignment and collaboration features
- F004.7: Affected individual categorization by jurisdiction
- F004.8: Integration with Purview service for data context

**Incident Model**:
```typescript
interface Incident {
  id: string;
  clientId: string;
  organizationId: string;
  status: IncidentStatus;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timeline: {
    detected: Date;
    investigated?: Date;
    confirmed?: Date;
    contained?: Date;
    eradicated?: Date;
    recovered?: Date;
    closed?: Date;
  };
  scope: {
    affectedAssets: string[];
    dataTypes: PIIElement[];
    timeWindow: { start: Date; end: Date; };
    affectedIndividuals: {
      total: number;
      byState: Record<string, number>;
    };
  };
  evidence: Evidence[];
  assessments: ComplianceAssessment[];
  assignedTo: string[];
  metadata: {
    createdBy: string;
    tags: string[];
    customFields: Record<string, any>;
  };
}
```

**API Endpoints**:
```typescript
// Incident Management
POST   /api/incidents
GET    /api/incidents
GET    /api/incidents/:id
PUT    /api/incidents/:id
PATCH  /api/incidents/:id/status
DELETE /api/incidents/:id

// Evidence Management
POST   /api/incidents/:id/evidence
GET    /api/incidents/:id/evidence
DELETE /api/incidents/:id/evidence/:evidenceId

// Timeline and Collaboration
GET    /api/incidents/:id/timeline
POST   /api/incidents/:id/timeline/events
POST   /api/incidents/:id/assignments
GET    /api/incidents/:id/assignments

// Impact Assessment
POST   /api/incidents/:id/assess-impact
GET    /api/incidents/:id/affected-individuals
POST   /api/incidents/:id/scope
```

**Acceptance Criteria**:
- [ ] Complete incident workflow implemented and tested
- [ ] Evidence upload with SHA-256 hashing functional
- [ ] Timeline tracking automatic and accurate
- [ ] Impact assessment automation working correctly
- [ ] Affected individual counting accurate by jurisdiction
- [ ] Incident collaboration features operational
- [ ] API endpoints responding with proper validation
- [ ] Integration with F003 (Purview) service working

---

#### **F005: Compliance Engine Service**
**Branch**: `feature/F005-compliance-engine-service`
**Dependencies**: F001, F002, F004
**Agent Assignment**: backend-architect, compliance-officer, product-strategist
**Description**: Automated regulatory compliance assessment service covering all US jurisdictions

**Sub-features**:
- F005.1: Regulatory database (50 states + DC + federal regulations)
- F005.2: Compliance assessment logic and rule engine
- F005.3: Jurisdiction determination based on affected individuals
- F005.4: Threshold evaluation (1 to 1000+ individuals per jurisdiction)
- F005.5: Exemption evaluation (encryption safe harbor, risk assessment, etc.)
- F005.6: Deadline calculation engine with business days
- F005.7: Holiday and weekend adjustment by jurisdiction
- F005.8: Regulatory requirement mapping and documentation

**Regulatory Coverage**:
```yaml
Federal Regulations:
  - HIPAA: 60-day notification, 500+ threshold for media
  - GLBA: Financial institutions, customer notification requirements
  - FERPA: Educational records, parent/student notification
  - FTC Act, FCRA, COPPA, CAN-SPAM: Industry-specific requirements

State Regulations:
  - Coverage: All 50 states + DC + US territories
  - Timeline variations: 24 hours to 90 days notification windows
  - Threshold requirements: 1 to 1000+ individuals depending on state
  - Safe harbors: Encryption, risk assessment exemptions
  - Authority notification: Attorney General, Consumer protection agencies
  - Media notification: Thresholds typically 500+ state residents
```

**API Endpoints**:
```typescript
// Compliance Assessment
POST   /api/compliance/assess
GET    /api/compliance/assessments/:id
POST   /api/compliance/assess/:incidentId

// Regulatory Information
GET    /api/compliance/regulations
GET    /api/compliance/jurisdictions
GET    /api/compliance/jurisdictions/:state

// Deadlines and Requirements
GET    /api/compliance/deadlines/:assessmentId
POST   /api/compliance/deadlines/calculate
GET    /api/compliance/requirements/:jurisdiction

// Exemptions
POST   /api/compliance/exemptions/evaluate
GET    /api/compliance/exemptions/types
POST   /api/compliance/exemptions/:incidentId/apply
```

**Acceptance Criteria**:
- [ ] All 50 states + federal regulations implemented
- [ ] Automated jurisdiction determination working accurately
- [ ] Threshold evaluation correct for all jurisdictions
- [ ] Exemption logic implemented and tested thoroughly
- [ ] Deadline calculation with business days accurate
- [ ] Holiday adjustments working by jurisdiction
- [ ] Compliance assessment reports generated correctly
- [ ] API endpoints responding with validated data

---

#### **F006: Notification Service**
**Branch**: `feature/F006-notification-service`
**Dependencies**: F001, F002, F004, F005
**Agent Assignment**: backend-architect, content-creator, compliance-officer
**Description**: Notification template management and generation service (MVP: dry run only)

**Sub-features**:
- F006.1: Notification template management with versioning
- F006.2: Variable replacement system with validation
- F006.3: Authority notification templates (federal, state)
- F006.4: Individual notification templates (multiple methods)
- F006.5: Media notification templates with outlet targeting
- F006.6: Credit bureau notification templates
- F006.7: Compliance validation for notification content
- F006.8: Draft generation and preview system (dry run)

**Notification Types**:
```yaml
Authority Notifications:
  Federal: 
    - HHS (HIPAA breaches): 60-day notification requirement
    - FTC: Consumer protection violations
    - Department of Education (FERPA): Educational record breaches
  State:
    - Attorney General: Most states require AG notification
    - Consumer Protection Agencies: State-specific requirements

Individual Notifications:
  Methods: 
    - Written letter (default/preferred method)
    - Email (with valid consent)
    - Substitute notice (for large breaches)
    - Telephone (some states allow)
  Content Requirements:
    - Nature and scope of breach
    - Types of information involved
    - Steps organization has taken
    - Steps individuals should take
    - Contact information for questions

Media Notifications:
  - Triggers: Usually 500+ state residents affected
  - Outlets: Major media in affected geographic areas
  - Timing: Same timeline as individual notice
  
Credit Bureau Notifications:
  - Triggers: Usually 1000+ individuals affected
  - Agencies: Equifax, Experian, TransUnion
  - Content: Basic breach details and affected count
```

**API Endpoints**:
```typescript
// Template Management
GET    /api/notifications/templates
POST   /api/notifications/templates
PUT    /api/notifications/templates/:id
DELETE /api/notifications/templates/:id

// Draft Generation (Dry Run)
POST   /api/notifications/generate
GET    /api/notifications/drafts
GET    /api/notifications/drafts/:id
PUT    /api/notifications/drafts/:id

// Validation and Preview
POST   /api/notifications/validate
POST   /api/notifications/preview
GET    /api/notifications/variables/:templateId

// Compliance Checking
POST   /api/notifications/compliance-check
GET    /api/notifications/requirements/:jurisdiction
```

**Acceptance Criteria**:
- [ ] Template management system fully functional
- [ ] Variable replacement working accurately
- [ ] All notification types supported (authority, individual, media, credit bureau)
- [ ] Compliance validation implemented and tested
- [ ] Draft generation and preview working correctly
- [ ] Content approval workflow implemented
- [ ] API endpoints responding with proper validation
- [ ] Template versioning system operational

---

### Layer 3: Persona-Based Feature Modules

These are specialized feature modules that register with F002's unified dashboard framework. Each module provides role-specific functionality that integrates seamlessly with the centralized navigation and dashboard system.

#### **P001: Law Firm Admin Portal Module**
**Branch**: `feature/P001-law-firm-admin-portal-module`
**Dependencies**: F001, F002 (Dashboard Framework), F003, F004, F005, F006
**Agent Assignment**: ui-designer, ux-researcher, full-stack-engineer, frontend-specialist
**Description**: Feature module providing administrative capabilities for law firm administrators, integrated through F002's unified dashboard framework

**Module Components**:
- P001.1: Multi-client overview widget (registers with F002 dashboard framework)
- P001.2: Client onboarding wizard component
- P001.3: Purview configuration interface (consumes F003 API)
- P001.4: Team management component with role assignments
- P001.5: Portfolio compliance widget (consumes F005 API)
- P001.6: Executive reporting widget with custom reports
- P001.7: Billing management component
- P001.8: System administration interface

**Dashboard Registration**:
```typescript
// Registers with F002 Dashboard Framework
export const LawFirmAdminModule: FeatureModule = {
  id: 'law-firm-admin',
  name: 'Law Firm Admin Portal',
  requiredRoles: ['LAW_FIRM_ADMIN'],
  widgets: [
    { id: 'multi-client-overview', component: MultiClientOverviewWidget, size: 'large' },
    { id: 'portfolio-compliance', component: PortfolioComplianceWidget, size: 'medium' },
    { id: 'executive-reports', component: ExecutiveReportsWidget, size: 'medium' }
  ],
  menuItems: [
    { id: 'clients', label: 'Client Management', icon: 'users', route: '/clients' },
    { id: 'team', label: 'Team Management', icon: 'team', route: '/team' },
    { id: 'reports', label: 'Executive Reports', icon: 'reports', route: '/reports' },
    { id: 'billing', label: 'Billing', icon: 'billing', route: '/billing' },
    { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings' }
  ]
};
```

**Key Capabilities**:
```yaml
Client Management:
  - Onboard new enterprise clients (<2 hours target)
  - Configure Microsoft Purview connections per client
  - Monitor client compliance status across portfolio
  - Manage client relationships and contracts

Team Management:
  - Add/remove law firm team members
  - Assign roles and permissions
  - Manage user access to specific clients
  - Track team productivity and workload

Compliance Oversight:
  - Portfolio-wide compliance dashboard
  - Upcoming deadline monitoring
  - Risk assessment across all clients
  - Regulatory change impact analysis

Executive Reporting:
  - Custom report generation
  - Scheduled report delivery
  - Executive summary dashboards
  - Performance metrics and KPIs
```

**API Integration**:
```typescript
Consumes:
  - F002: /api/dashboard/* (Dashboard framework and module registration)
  - F003: /api/purview/* (Purview configuration and monitoring)
  - F004: /api/incidents/* (Incident overview and management)
  - F005: /api/compliance/* (Compliance assessment and deadlines)
  - F006: /api/notifications/* (Notification template management)

Exposes:
  - /api/modules/law-firm-admin/clients
  - /api/modules/law-firm-admin/team
  - /api/modules/law-firm-admin/reports
  - /api/modules/law-firm-admin/billing

Registers with F002:
  - Widget endpoints for dashboard integration
  - Menu item configurations
  - Role-based access permissions
  - Module metadata and dependencies
```

**Acceptance Criteria**:
- [ ] Module successfully registers with F002 dashboard framework
- [ ] Multi-client overview widget displaying real-time compliance status
- [ ] Client onboarding wizard functional with <2 hour completion
- [ ] Purview configuration interface working with F003 service
- [ ] Team management component operational
- [ ] Portfolio compliance widget showing aggregate data
- [ ] Executive reporting widget generating accurate reports
- [ ] Billing management component functional
- [ ] All API integrations working correctly
- [ ] Module routes properly integrated with F002 navigation system
- [ ] Role-based access control enforced through F002
- [ ] Mobile-responsive design across all components

---

#### **P002: Law Firm Operations Portal Module**
**Branch**: `feature/P002-law-firm-operations-portal-module`
**Dependencies**: F001, F002 (Dashboard Framework), F003, F004, F005, F006
**Agent Assignment**: ui-designer, ux-researcher, full-stack-engineer
**Description**: Feature module providing day-to-day operations capabilities for managers and analysts, integrated through F002's unified dashboard framework

**Module Components**:

**Manager Components**:
- P002.1: Incident management widget (consumes F004 API)
- P002.2: Compliance assessment tools component (consumes F005 API)
- P002.3: Notification generation interface (consumes F006 API)
- P002.4: Client-specific operational widgets
- P002.5: Task management and assignment component
- P002.6: Evidence coordination interface
- P002.7: Deadline tracking widget
- P002.8: Team collaboration tools

**Analyst Components**:
- P002.9: Evidence upload interface with chain of custody
- P002.10: Draft creation and editing tools
- P002.11: Limited data viewing component (assignment-based)
- P002.12: Document management interface
- P002.13: Time tracking widget
- P002.14: Quality assurance checklists

**Dashboard Registration**:
```typescript
// Registers with F002 Dashboard Framework
export const LawFirmOperationsModule: FeatureModule = {
  id: 'law-firm-operations',
  name: 'Law Firm Operations Portal',
  requiredRoles: ['LAW_FIRM_MANAGER', 'LAW_FIRM_ANALYST'],
  widgets: [
    { id: 'incident-management', component: IncidentManagementWidget, size: 'large', roles: ['LAW_FIRM_MANAGER'] },
    { id: 'compliance-tools', component: ComplianceToolsWidget, size: 'medium', roles: ['LAW_FIRM_MANAGER'] },
    { id: 'task-dashboard', component: TaskDashboardWidget, size: 'medium' },
    { id: 'deadline-tracker', component: DeadlineTrackerWidget, size: 'small' },
    { id: 'evidence-upload', component: EvidenceUploadWidget, size: 'small', roles: ['LAW_FIRM_ANALYST'] }
  ],
  menuItems: [
    { id: 'incidents', label: 'Incident Management', icon: 'incidents', route: '/incidents', roles: ['LAW_FIRM_MANAGER'] },
    { id: 'compliance', label: 'Compliance Tools', icon: 'compliance', route: '/compliance', roles: ['LAW_FIRM_MANAGER'] },
    { id: 'tasks', label: 'Task Management', icon: 'tasks', route: '/tasks' },
    { id: 'evidence', label: 'Evidence', icon: 'evidence', route: '/evidence' },
    { id: 'documents', label: 'Documents', icon: 'documents', route: '/documents' }
  ]
};
```

**Key Workflows**:
```yaml
Incident Response Workflow:
  1. Incident detection notification
  2. Initial assessment and triage
  3. Evidence collection coordination
  4. Compliance analysis and jurisdiction determination
  5. Notification draft generation
  6. Review and approval process
  7. Client communication and updates

Daily Operations:
  - Morning dashboard review
  - Task assignment and prioritization
  - Progress tracking and updates
  - Deadline monitoring and alerts
  - Team collaboration and communication
```

**API Integration**:
```typescript
Consumes:
  - F002: /api/dashboard/* (Dashboard framework and module registration)
  - F003: /api/purview/* (Data discovery and PII analysis)
  - F004: /api/incidents/* (Complete incident management)
  - F005: /api/compliance/* (Regulatory assessment)
  - F006: /api/notifications/* (Draft generation and validation)

Exposes:
  - /api/modules/law-firm-ops/tasks
  - /api/modules/law-firm-ops/assignments
  - /api/modules/law-firm-ops/evidence
  - /api/modules/law-firm-ops/documents

Registers with F002:
  - Role-specific widget configurations
  - Menu item definitions with role restrictions
  - Component route mappings
  - Module permissions and access controls
```

**Acceptance Criteria**:
- [ ] Module successfully registers with F002 dashboard framework
- [ ] Incident management widget operational with F004 integration
- [ ] Compliance assessment tools working with F005 service
- [ ] Notification generation interface functional with F006
- [ ] Client-specific operational widgets displaying relevant data
- [ ] Task management component operational
- [ ] Evidence upload interface working with chain of custody
- [ ] Role-based widget display working (Manager vs Analyst)
- [ ] All API integrations functional and tested
- [ ] Module routes properly integrated with F002 navigation system
- [ ] Role-based menu restrictions enforced through F002
- [ ] Mobile-optimized components for field work

---

#### **P003: Enterprise Command Center Module**
**Branch**: `feature/P003-enterprise-command-center-module`
**Dependencies**: F001, F002 (Dashboard Framework), F004, F005
**Agent Assignment**: ui-designer, ux-researcher, full-stack-engineer
**Description**: Feature module providing self-service capabilities for enterprise clients with role-based access, integrated through F002's unified dashboard framework

**Module Components**:

**Admin Components**:
- P003.1: Company-wide compliance widget
- P003.2: Incident approval and escalation interface (F004 API)
- P003.3: Enterprise user management component
- P003.4: Subsidiary and division management interface
- P003.5: Comprehensive audit trail viewer
- P003.6: Policy and configuration management component
- P003.7: Integration settings interface
- P003.8: Data retention and privacy controls

**Manager Components**:
- P003.9: Department-specific compliance widgets
- P003.10: Incident initiation interface (F004 API)
- P003.11: Compliance monitoring widget (F005 API)
- P003.12: Team communication component
- P003.13: Document and evidence access interface
- P003.14: Training and awareness tracking widget

**Viewer Components**:
- P003.15: Read-only compliance status widget
- P003.16: Report access component
- P003.17: Incident status tracking widget
- P003.18: Educational resources interface
- P003.19: Contact and support component

**Dashboard Registration**:
```typescript
// Registers with F002 Dashboard Framework
export const EnterpriseCommandCenterModule: FeatureModule = {
  id: 'enterprise-command-center',
  name: 'Enterprise Command Center',
  requiredRoles: ['ENTERPRISE_ADMIN', 'ENTERPRISE_MANAGER', 'ENTERPRISE_VIEWER'],
  widgets: [
    { id: 'company-compliance', component: CompanyComplianceWidget, size: 'large', roles: ['ENTERPRISE_ADMIN', 'ENTERPRISE_MANAGER'] },
    { id: 'incident-approval', component: IncidentApprovalWidget, size: 'medium', roles: ['ENTERPRISE_ADMIN'] },
    { id: 'department-compliance', component: DepartmentComplianceWidget, size: 'medium', roles: ['ENTERPRISE_MANAGER'] },
    { id: 'compliance-status', component: ComplianceStatusWidget, size: 'small', roles: ['ENTERPRISE_VIEWER'] }
  ],
  menuItems: [
    { id: 'compliance', label: 'Compliance', icon: 'compliance', route: '/compliance' },
    { id: 'incidents', label: 'Incidents', icon: 'incidents', route: '/incidents' },
    { id: 'users', label: 'User Management', icon: 'users', route: '/users', roles: ['ENTERPRISE_ADMIN'] },
    { id: 'reports', label: 'Reports', icon: 'reports', route: '/reports' },
    { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings', roles: ['ENTERPRISE_ADMIN'] }
  ]
};
```

**Enterprise Workflows**:
```yaml
Self-Service Incident Reporting:
  1. Manager identifies potential incident
  2. Initial incident creation via portal
  3. Automatic routing to law firm for assessment
  4. Real-time status updates and communication
  5. Access to final reports and documentation

Compliance Monitoring:
  - Real-time compliance status dashboard
  - Upcoming deadline notifications
  - Risk level indicators
  - Compliance score tracking
  - Historical trend analysis
```

**API Integration**:
```typescript
Consumes:
  - F002: /api/dashboard/* (Dashboard framework and module registration)
  - F004: /api/incidents/* (Incident management and status)
  - F005: /api/compliance/* (Compliance monitoring)

Exposes:
  - /api/modules/enterprise/incidents
  - /api/modules/enterprise/compliance
  - /api/modules/enterprise/users
  - /api/modules/enterprise/reports

Registers with F002:
  - Role-specific widget configurations (Admin/Manager/Viewer)
  - Hierarchical menu structure with role restrictions
  - Component routing and access controls
  - Module integration metadata
```

**Acceptance Criteria**:
- [ ] Module successfully registers with F002 dashboard framework
- [ ] Company-wide compliance widget operational
- [ ] Incident approval workflow functional with F004 integration
- [ ] Enterprise user management component working
- [ ] Subsidiary management capabilities functional
- [ ] Audit trail viewer displaying complete history
- [ ] Role-based widget access enforced (Admin/Manager/Viewer)
- [ ] Self-service incident creation working
- [ ] Real-time status updates functional
- [ ] Module routes properly integrated with F002 navigation system
- [ ] Role-based menu restrictions enforced through F002
- [ ] Mobile-responsive design for executives

---

#### **P004: Channel Partner Platform Module**
**Branch**: `feature/P004-channel-partner-platform-module`
**Dependencies**: F001, F002 (Dashboard Framework), F005
**Agent Assignment**: ui-designer, full-stack-engineer, marketing-specialist
**Description**: Feature module providing white-label platform management for channel partners, integrated through F002's unified dashboard framework

**Module Components**:
- P004.1: Partner-specific branding widget
- P004.2: Multi-client management interface for partner's clients
- P004.3: White-label configuration component
- P004.4: Partner compliance overview widget (F005 API)
- P004.5: Custom branding and theme management interface
- P004.6: Partner billing and commission tracking widget
- P004.7: Reseller tools and resources component
- P004.8: Partner support and training portal interface

**Dashboard Registration**:
```typescript
// Registers with F002 Dashboard Framework
export const ChannelPartnerModule: FeatureModule = {
  id: 'channel-partner',
  name: 'Channel Partner Platform',
  requiredRoles: ['CHANNEL_PARTNER'],
  widgets: [
    { id: 'partner-overview', component: PartnerOverviewWidget, size: 'large' },
    { id: 'client-management', component: ClientManagementWidget, size: 'medium' },
    { id: 'compliance-overview', component: ComplianceOverviewWidget, size: 'medium' },
    { id: 'billing-tracker', component: BillingTrackerWidget, size: 'small' }
  ],
  menuItems: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { id: 'clients', label: 'Client Management', icon: 'clients', route: '/clients' },
    { id: 'branding', label: 'Branding', icon: 'branding', route: '/branding' },
    { id: 'billing', label: 'Billing', icon: 'billing', route: '/billing' },
    { id: 'resources', label: 'Resources', icon: 'resources', route: '/resources' },
    { id: 'support', label: 'Support', icon: 'support', route: '/support' }
  ],
  branding: {
    customizable: true,
    whiteLabel: true
  }
};
```

**White-Label Capabilities**:
```yaml
Branding Customization:
  - Custom logo and color scheme
  - Partner-specific domain and URLs
  - Customized email templates
  - Partner contact information
  - Terms of service and privacy policy

Client Management:
  - Partner client onboarding
  - Compliance monitoring for all partner clients
  - Consolidated reporting across clients
  - Partner-specific pricing and billing
```

**API Integration**:
```typescript
Consumes:
  - F002: /api/dashboard/* (Dashboard framework and module registration)
  - F005: /api/compliance/* (Compliance data for partner clients)

Exposes:
  - /api/modules/partner/clients
  - /api/modules/partner/branding
  - /api/modules/partner/billing
  - /api/modules/partner/resources

Registers with F002:
  - White-label widget configurations
  - Customizable branding and theme settings
  - Partner-specific menu structures
  - Multi-client access control patterns
```

**Acceptance Criteria**:
- [ ] Module successfully registers with F002 dashboard framework
- [ ] Partner branding widget with custom themes functional
- [ ] Multi-client management interface operational
- [ ] White-label configuration component working
- [ ] Compliance overview widget displaying partner client data
- [ ] Custom branding system functional with F002 integration
- [ ] Partner billing widget operational
- [ ] API integration with F005 service working
- [ ] Module routes properly integrated with F002 navigation system
- [ ] Partner-specific access controls enforced through F002
- [ ] White-label branding applied to dashboard framework

---

#### **P005: Platform Administration Console Module**
**Branch**: `feature/P005-platform-administration-console-module`
**Dependencies**: F001, F002 (Dashboard Framework), All shared services (F003, F004, F005, F006)
**Agent Assignment**: security-engineer, devops-engineer, full-stack-engineer
**Description**: Feature module providing comprehensive system administration for platform super admins, integrated through F002's unified dashboard framework

**Module Components**:
- P005.1: Multi-tenant management widget
- P005.2: System configuration interface
- P005.3: Service health monitoring widget across all components
- P005.4: Security dashboard widget with threat monitoring
- P005.5: Comprehensive audit log analysis interface
- P005.6: Emergency access and break-glass procedures component
- P005.7: Performance monitoring widget
- P005.8: Backup and disaster recovery management interface

**Dashboard Registration**:
```typescript
// Registers with F002 Dashboard Framework
export const PlatformAdminModule: FeatureModule = {
  id: 'platform-administration',
  name: 'Platform Administration Console',
  requiredRoles: ['PLATFORM_SUPER_ADMIN'],
  widgets: [
    { id: 'tenant-management', component: TenantManagementWidget, size: 'large' },
    { id: 'service-health', component: ServiceHealthWidget, size: 'medium' },
    { id: 'security-monitoring', component: SecurityMonitoringWidget, size: 'medium' },
    { id: 'performance-metrics', component: PerformanceMetricsWidget, size: 'small' },
    { id: 'audit-logs', component: AuditLogsWidget, size: 'small' }
  ],
  menuItems: [
    { id: 'tenants', label: 'Tenant Management', icon: 'tenants', route: '/tenants' },
    { id: 'system', label: 'System Configuration', icon: 'system', route: '/system' },
    { id: 'monitoring', label: 'Service Monitoring', icon: 'monitoring', route: '/monitoring' },
    { id: 'security', label: 'Security Dashboard', icon: 'security', route: '/security' },
    { id: 'audit', label: 'Audit Logs', icon: 'audit', route: '/audit' },
    { id: 'emergency', label: 'Emergency Access', icon: 'emergency', route: '/emergency' }
  ]
};
```

**System Administration**:
```yaml
Tenant Management:
  - Organization creation and configuration
  - Resource allocation and limits
  - Feature flag management
  - License and subscription management

Service Monitoring:
  - Real-time health status of all services
  - Performance metrics and alerts
  - Error rate monitoring and analysis
  - Capacity planning and scaling

Security Operations:
  - Security event monitoring
  - Threat detection and response
  - Access pattern analysis
  - Vulnerability management
```

**API Integration**:
```typescript
Consumes:
  - F002: /api/dashboard/* (Dashboard framework and module registration)
  - All service APIs for monitoring and administration
  - F003: /api/purview/* (Service health monitoring)
  - F004: /api/incidents/* (Platform-wide incident overview)
  - F005: /api/compliance/* (Compliance system monitoring)
  - F006: /api/notifications/* (Notification system status)

Exposes:
  - /api/modules/admin/tenants
  - /api/modules/admin/system
  - /api/modules/admin/security
  - /api/modules/admin/monitoring
  - /api/modules/admin/audit

Registers with F002:
  - High-privilege administrative widgets
  - System-level monitoring components
  - Emergency access controls
  - Platform-wide audit and security interfaces
```

**Acceptance Criteria**:
- [ ] Module successfully registers with F002 dashboard framework
- [ ] Multi-tenant management widget showing all organizations
- [ ] System configuration interface functional
- [ ] Service health monitoring widget operational for all components
- [ ] Security dashboard widget displaying real-time threats
- [ ] Audit log analysis interface working
- [ ] Emergency access procedures component tested and functional
- [ ] Performance monitoring widget showing accurate metrics
- [ ] Module routes properly integrated with F002 navigation system
- [ ] Super admin role restrictions enforced through F002
- [ ] Integration with all shared services operational

---

## Development Workflow & Architecture

### Hybrid Architecture Benefits

1. **Foundation First**: Solid authentication and multi-tenancy before feature development
2. **Service-Oriented**: Each backend service has clear API boundaries and can scale independently
3. **Persona-Focused**: User interfaces are tailored to specific user needs and workflows
4. **Parallel Development**: Services and personas can be developed simultaneously once foundation is complete
5. **API-First**: Clean contracts enable different teams to work independently
6. **Flexible Deployment**: Services can be deployed and updated independently

### Branching Strategy

```yaml
Foundation Features:
  - feature/F001-platform-foundation
  - feature/F002-user-management-rbac-dashboard-framework

Service Features:
  - feature/F003-purview-integration-service
  - feature/F004-incident-management-service
  - feature/F005-compliance-engine-service
  - feature/F006-notification-service

Persona Feature Modules (depend on F002 Dashboard Framework):
  - feature/P001-law-firm-admin-portal-module
  - feature/P002-law-firm-operations-portal-module
  - feature/P003-enterprise-command-center-module
  - feature/P004-channel-partner-platform-module
  - feature/P005-platform-administration-console-module

Release Branches:
  - release/R001-foundation-with-dashboard-framework
  - release/R002-services
  - release/R003-persona-modules
```

### Development Sequence

```yaml
Phase 1: Foundation with Dashboard Framework (Weeks 1-4)
├── F001: Platform Foundation
└── F002: User Management & RBAC with Unified Dashboard Framework

Phase 2: Core Services (Weeks 5-10) [Parallel Development]
├── F003: Purview Integration Service
├── F004: Incident Management Service
├── F005: Compliance Engine Service
└── F006: Notification Service

Phase 3: Primary Persona Module (Weeks 11-12) [After F002 Complete]
└── P001: Law Firm Admin Portal Module (registers with F002)

Phase 4: Operations Module (Weeks 13-14) [Parallel with P001 if desired]
└── P002: Law Firm Operations Portal Module (registers with F002)

Phase 5: Client Access Module (Weeks 15-16) [Parallel development possible]
└── P003: Enterprise Command Center Module (registers with F002)

Phase 6: Extended Platform Modules (Post-MVP)
├── P004: Channel Partner Platform Module (registers with F002)
└── P005: Platform Administration Console Module (registers with F002)

Note: All persona modules depend on F002's dashboard framework completion.
Service features (F003-F006) can develop in parallel with foundation but 
persona modules must wait for F002 dashboard framework to be functional.
```

### Agent Specialization by Architecture Layer

#### **Foundation Layer Agents**
- **full-stack-engineer**: Platform setup, authentication, core APIs
- **devops-engineer**: CI/CD, infrastructure, deployment
- **security-engineer**: Security middleware, encryption, audit

#### **Service Layer Agents**
- **backend-architect**: API design, data models, service architecture
- **security-engineer**: Service security, data protection
- **compliance-officer**: Regulatory requirements, compliance logic

#### **Persona Layer Agents**
- **ui-designer**: Persona-specific interface design
- **ux-researcher**: User workflow optimization
- **frontend-specialist**: React optimization, performance tuning
- **full-stack-engineer**: Feature integration with services

### API-First Development Approach

Each service exposes well-defined APIs that persona features consume:

```yaml
Service APIs:
  F003: /api/purview/* - Data discovery and PII classification
  F004: /api/incidents/* - Incident lifecycle management
  F005: /api/compliance/* - Regulatory assessment and deadlines
  F006: /api/notifications/* - Template management and draft generation

Persona APIs:
  P001: /api/law-firm-admin/* - Administrative operations
  P002: /api/law-firm-ops/* - Operational workflows
  P003: /api/enterprise/* - Client self-service
  P004: /api/partner/* - Partner management
  P005: /api/admin/* - Platform administration
```

### Workflow Commands for Hybrid Architecture

```bash
# Foundation development
/sprint-plan foundation

# Service development
/sprint-plan services

# Persona development with design focus
/ui-design-workflow [persona-requirements]

# Full testing across all layers
/full-test [feature-branch]

# Pre-deployment validation
/deploy-check [release-branch]

# Compliance audit across all features
/healthcare-compliance-audit [release-branch]
```

---

## Form Development Standards

### Custom Form Fields Usage
**MANDATORY**: All forms in this project MUST use the CustomFormField component located at `@/components/CustomFormFields`.

#### Form Implementation Rules:

1. **Import Requirements**:
   ```typescript
   import CustomFormField, { FormFieldType } from "@/components/CustomFormFields";
   import { Form } from "@/components/ui/form";
   import { useForm } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";
   ```

2. **Required shadcn Components**:
   - Always install and use shadcn `form` components: `npx shadcn@latest add form`
   - Install additional UI components as needed: `input`, `textarea`, `select`, `checkbox`

3. **Field Types Available**:
   - `FormFieldType.INPUT` - Standard text input with optional icon
   - `FormFieldType.TEXTAREA` - Multi-line text input
   - `FormFieldType.PHONE_INPUT` - International phone number input
   - `FormFieldType.CHECKBOX` - Checkbox with label
   - `FormFieldType.DATE_PICKER` - Date/time picker with optional time selection
   - `FormFieldType.SELECT` - Dropdown selection with options
   - `FormFieldType.SKELETON` - Custom render function for special cases

4. **Form Validation Examples**:
   ```typescript
   // Incident form schema
   const incidentSchema = z.object({
     title: z.string().min(1, "Title is required"),
     severity: z.enum(['critical', 'high', 'medium', 'low']),
     description: z.string().min(10, "Description must be at least 10 characters"),
     affectedCount: z.number().min(1, "Must affect at least 1 individual"),
     clientId: z.string().min(1, "Client selection is required"),
   });

   // User management form schema
   const userSchema = z.object({
     email: z.string().email("Valid email required"),
     firstName: z.string().min(1, "First name required"),
     lastName: z.string().min(1, "Last name required"),
     role: z.enum(['admin', 'manager', 'analyst', 'viewer']),
     organizationId: z.string().min(1, "Organization required"),
   });

   // Client onboarding schema
   const clientSchema = z.object({
     companyName: z.string().min(1, "Company name required"),
     industry: z.string().min(1, "Industry selection required"),
     size: z.enum(['small', 'medium', 'large', 'enterprise']),
     contactEmail: z.string().email("Valid contact email required"),
     purviewAccountName: z.string().min(1, "Purview account name required"),
   });
   ```

---

## Quality Standards & Enforcement

### Mandatory Requirements

#### **MCP Integration Requirements**:
- **REQUIRED**: Shadcn MCP for all UI components
- **REQUIRED**: Clerk MCP for all authentication components and processes
- **REQUIRED**: Microsoft Purview MCP for all data classification features
- **REQUIRED**: Playwright MCP testing for all components

#### **Accessibility Standards**:
- **100%** WCAG 2.1 AA accessibility compliance (mandatory)
- **REQUIRED** keyboard navigation support for all interactive elements
- **REQUIRED** screen reader compatibility with proper ARIA labels
- **REQUIRED** color contrast ratio minimum 4.5:1
- **REQUIRED** touch targets minimum 44x44px

#### **Performance Standards**:
- **REQUIRED** Lighthouse score 90+ for all pages
- **REQUIRED** Mobile-first responsive implementation
- **REQUIRED** Core Web Vitals compliance
- **REQUIRED** Bundle size optimization
- **REQUIRED** Image optimization (WebP, lazy loading)

#### **Security Standards**:
- **REQUIRED** Multi-tenant data isolation verification
- **REQUIRED** RBAC enforcement at all API endpoints
- **REQUIRED** Input validation and sanitization
- **REQUIRED** Encryption at rest and in transit
- **REQUIRED** Comprehensive audit logging

#### **API Standards**:
- **REQUIRED** OpenAPI 3.0 specification for all services
- **REQUIRED** Rate limiting on all external endpoints
- **REQUIRED** Proper error handling and status codes
- **REQUIRED** Request/response validation with schemas
- **REQUIRED** API versioning strategy

#### **Documentation Standards**:
- **MANDATORY** All documentation generated must be written to documentation folder
- **REQUIRED** API documentation with OpenAPI 3.0 specification
- **REQUIRED** Component documentation with usage examples
- **REQUIRED** Feature documentation with user stories and acceptance criteria
- **REQUIRED** Service integration guides

### Enforcement Process

1. **Automated Validation**:
   - Pre-commit hooks validate code quality
   - CI/CD pipeline enforces testing requirements
   - Automated security scanning on every commit
   - Performance regression testing in staging
   - API contract validation for all services

2. **Manual Review Process**:
   - Code review required for all pull requests
   - Design review using `/design-review` workflow
   - Security review for all user-facing features
   - Compliance review for all data handling features
   - API design review for all service endpoints

3. **Quality Gates**:
   - No merge without passing tests (unit, integration, e2e)
   - No deployment without security scan passing
   - No production deployment without accessibility compliance
   - No feature completion without documentation
   - No API deployment without OpenAPI specification

### Success Metrics

#### **MVP Success Criteria**:
```yaml
Foundation Requirements:
  ✓ Multi-tenant platform operational
  ✓ User management with RBAC functional
  ✓ CI/CD pipeline deploying successfully
  ✓ Security audit passing

Service Requirements:
  ✓ All shared services operational with APIs
  ✓ Microsoft Purview integration functional
  ✓ Incident management workflow complete
  ✓ Compliance engine covering 50 states

Persona Requirements:
  ✓ Law Firm Admin Portal operational
  ✓ Law Firm Operations Portal functional
  ✓ Enterprise Command Center accessible

Business Metrics:
  ✓ 5 pilot law firms onboarded
  ✓ 10 enterprise clients connected
  ✓ All 19 PII categories detected
  ✓ 50-state compliance coverage
  ✓ < 5 minute snapshot processing

Technical Requirements:
  ✓ 99.9% uptime
  ✓ < 300ms API response time
  ✓ Zero data isolation incidents
  ✓ Complete audit trail
  ✓ Successful security audit

User Experience:
  ✓ < 2 hour client onboarding
  ✓ < 30 min incident assessment
  ✓ 100% compliance accuracy
  ✓ User satisfaction > 4.0/5
```

This hybrid architecture ensures systematic development with a solid foundation, reusable services with clean APIs, and persona-focused user experiences that deliver complete workflows tailored to each user role's needs.