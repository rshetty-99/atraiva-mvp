"use client";

import { useUser } from "@clerk/nextjs";
import { useSession, useRole } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type ComponentType,
} from "react";
import {
  getQuickActionsForRole,
  type QuickAction,
} from "@/lib/rbac/dashboard-widgets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Eye,
  UserCheck,
  Loader2,
  Zap,
  Search as SearchIcon,
  Scan,
  AlertTriangle,
  ShieldCheck,
  Circle,
  CheckCircle2,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type DisplayUser = {
  firstName: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  jobTitle?: string;
  department?: string;
};

type OrganizationSummary = {
  name: string;
  plan?: string;
  status?: string;
  industry?: string;
};

type RoleDisplayInfo = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  description: string;
};

type DataExposureRow = {
  category: string;
  operations: string;
  affectedStates: string;
  elements: string;
  classification: string;
  alertLevel: "Low" | "Medium" | "High" | "Critical";
  preventiveActions: string;
  authorities: string;
  notifications: string;
  forms: {
    label: string;
    href: string;
    description: string;
  }[];
};

const ORG_ROLES = [
  "org_admin",
  "org_manager",
  "org_analyst",
  "org_user",
  "org_viewer",
  "auditor",
] as const;

const ALERT_LEVEL_STYLES: Record<DataExposureRow["alertLevel"], string> = {
  Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  Medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200",
  Critical: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
};

const DATA_EXPOSURE_ROWS: DataExposureRow[] = [
  {
    category: "Patient Demographics",
    operations: "NJ, NY",
    affectedStates: "CA, TX, FL, NJ, NY",
    elements:
      "Patient Names, Dates of Birth, Addresses, Social Security Numbers, Phone Numbers, Email Addresses",
    classification: "PHI",
    alertLevel: "Medium",
    preventiveActions:
      "Access controls (role-based), data encryption (at rest and in transit), regular security audits, employee training on phishing and social engineering.",
    authorities:
      "CA Attorney General (CCPA/CPRA): Within 15 business days.\nU.S. Dept. of Health & Human Services (HHS): No later than 60 days.\nNJ Division of State Police, Cyber Crimes Unit: As expediently as possible.",
    notifications:
      "Affected Individuals: Without unreasonable delay, adhering to strictest state requirement (e.g., California).\nProminent Media Outlets (if over 500 residents in one state affected): Without unreasonable delay.",
    forms: [
      {
        label: "1. Internal Incident Report Form",
        href: "#",
        description: "Document details of the breach incident internally.",
      },
      {
        label: "2. Patient Notification Letter Template",
        href: "#",
        description: "Notify affected patients about the breach.",
      },
      {
        label: "3. HHS Breach Report Form",
        href: "#",
        description:
          "Official breach notification to the U.S. Department of Health & Human Services.",
      },
      {
        label: "4. NJ State Police Notification Template",
        href: "#",
        description:
          "Template for notifying the New Jersey State Police Cyber Crimes Unit.",
      },
      {
        label: "5. Media Notification Template",
        href: "#",
        description:
          "Draft press release for notifying media if over 500 residents are affected.",
      },
    ],
  },
  {
    category: "Medical Records",
    operations: "NJ, NY",
    affectedStates: "NJ, NY",
    elements:
      "Medical Record Numbers (MRNs), Diagnoses and Conditions, Treatment and Procedure Information, Medications, Laboratory Results, Imaging Reports, Physician Notes",
    classification: "PHI",
    alertLevel: "High",
    preventiveActions:
      "Strict access controls within EHR systems, multi-factor authentication, audit logs for data access, secure data disposal methods.",
    authorities:
      "U.S. Dept. of Health & Human Services (HHS): Without unreasonable delay and no later than 60 days.\nNJ Division of State Police, Cyber Crimes Unit: As expediently as possible.\nPotentially the FBI.",
    notifications:
      "Affected Individuals: Without unreasonable delay and no later than 60 days.\nProminent Media Outlets (if over 500 NJ residents affected): Without unreasonable delay.",
    forms: [
      {
        label: "1. Internal Incident Report Form",
        href: "#",
        description: "Document details of the high-sensitivity breach.",
      },
      {
        label: "2. Patient Notification Letter (High Sensitivity)",
        href: "#",
        description:
          "Template letter for notifying patients about sensitive health information breaches.",
      },
      {
        label: "3. HHS Breach Report Form",
        href: "#",
        description:
          "Official notification to the U.S. Department of Health & Human Services.",
      },
      {
        label: "4. NJ State Police Notification Template",
        href: "#",
        description:
          "Template for notifying the New Jersey State Police Cyber Crimes Unit.",
      },
      {
        label: "5. Media Notification Template",
        href: "#",
        description: "Draft press release if over 500 residents are affected.",
      },
    ],
  },
  {
    category: "Billing and Financial Information",
    operations: "NJ, NY",
    affectedStates: "All 50 States",
    elements:
      "Health Insurance Policy Numbers, Claims Data, Credit Card Numbers, Bank Account Information",
    classification: "PHI, PCI",
    alertLevel: "Critical",
    preventiveActions:
      "PCI DSS compliance, tokenization of financial data, segmented networks for financial systems, regular vulnerability scanning.",
    authorities:
      "U.S. Dept. of Health & Human Services (HHS): Without unreasonable delay and no later than 60 days.\nPayment Card Brands (if applicable).\nAll relevant state Attorneys General.",
    notifications:
      "Affected Individuals: Without unreasonable delay.\nCredit monitoring services often offered.",
    forms: [
      {
        label: "1. Internal Incident Report Form",
        href: "#",
        description: "Internal documentation of the breach incident.",
      },
      {
        label: "2. Individual Notification Letter (with Credit Monitoring)",
        href: "#",
        description:
          "Template for notifying individuals, including credit monitoring offers.",
      },
      {
        label: "3. Payment Card Brand Notification Form",
        href: "#",
        description:
          "Notification template for payment card brands per PCI DSS requirements.",
      },
    ],
  },
  {
    category: "Identifiers and Authentication Data",
    operations: "NJ, NY",
    affectedStates: "All 50 States",
    elements:
      "Patient Account Usernames and Passwords, IP Addresses of accessing devices",
    classification: "PII",
    alertLevel: "High",
    preventiveActions:
      "Strong password policies, multi-factor authentication, credential vaulting, monitoring for suspicious logins, rate limiting to prevent brute-force attacks.",
    authorities: "All relevant state Attorneys General.",
    notifications:
      "Affected Individuals: Without unreasonable delay.\nAdvise of immediate password reset.",
    forms: [
      {
        label: "1. Internal Incident Report Form",
        href: "#",
        description: "Document the credential breach details internally.",
      },
      {
        label: "2. User Notification & Password Reset Template",
        href: "#",
        description:
          "Template email instructing users to reset credentials after a breach.",
      },
    ],
  },
  {
    category: "Internal Employee Data",
    operations: "NJ, NY",
    affectedStates: "NJ, NY, PA",
    elements:
      "Employee Names, Social Security Numbers, Banking Information, Health Information (for employee health plan)",
    classification: "PHI & PII",
    alertLevel: "Medium",
    preventiveActions:
      "Segregated HR systems with strict access controls, background checks for privileged users, employee training on data privacy and security.",
    authorities:
      "U.S. Dept. of Health & Human Services (HHS) for health plan data: Without unreasonable delay and no later than 60 days.\nNJ, NY, PA Attorneys General.",
    notifications:
      "Affected Employees: Without unreasonable delay and no later than 60 days.",
    forms: [
      {
        label: "1. Internal Incident Report Form",
        href: "#",
        description: "Document the employee data breach internally.",
      },
      {
        label: "2. Employee Notification Letter Template",
        href: "#",
        description:
          "Notify affected employees about exposure of their personal information.",
      },
    ],
  },
];

const ORG_ADMIN_TASKS = [
  {
    id: "firewall-review",
    label: "Review firewall rules for exposed ports.",
    completed: false,
  },
  {
    id: "onboard-analyst",
    label: "Onboard new security analyst.",
    completed: false,
  },
  {
    id: "update-incident-plan",
    label: "Update incident response plan.",
    completed: true,
  },
] as const;

function getRoleDisplay(role: string): RoleDisplayInfo {
  const roleMap: Record<string, RoleDisplayInfo> = {
    org_admin: {
      label: "Organization Admin",
      icon: UserCheck,
      color: "text-blue-600",
      description: "Organization management and compliance oversight",
    },
    org_manager: {
      label: "Manager",
      icon: Users,
      color: "text-green-600",
      description: "Team management and incident response",
    },
    org_analyst: {
      label: "Analyst",
      icon: BarChart3,
      color: "text-yellow-600",
      description: "Data analysis and reporting",
    },
    org_user: {
      label: "User",
      icon: Users,
      color: "text-gray-600",
      description: "Organization member",
    },
    org_viewer: {
      label: "Viewer",
      icon: Eye,
      color: "text-gray-600",
      description: "Read-only access to organization data",
    },
    auditor: {
      label: "Auditor",
      icon: Eye,
      color: "text-orange-600",
      description: "Audit and compliance review",
    },
  };

  return (
    roleMap[role] || {
      label: "User",
      icon: Users,
      color: "text-gray-600",
      description: "Basic access",
    }
  );
}

function QuickActionsPanel({
  actions,
  onNavigate,
}: {
  actions: QuickAction[];
  onNavigate: (path: string) => void;
}) {
  if (!actions.length) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>Common tasks for your role</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const ActionIcon =
              typeof action.icon === "function"
                ? (action.icon as ComponentType<{ className?: string }>)
                : null;

            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto justify-start p-4 text-left"
                onClick={() => {
                  if (action.action) {
                    onNavigate(action.action);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  {ActionIcon && (
                    <ActionIcon
                      className={cn(
                        "mt-0.5 h-5 w-5",
                        action.color === "blue"
                          ? "text-blue-600"
                          : action.color === "green"
                          ? "text-green-600"
                          : action.color === "red"
                          ? "text-red-600"
                          : action.color === "yellow"
                          ? "text-yellow-600"
                          : action.color === "purple"
                          ? "text-purple-600"
                          : "text-muted-foreground"
                      )}
                    />
                  )}
                  <div>
                    <div className="font-medium">{action.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function BreachExposureContent({
  displayUser,
  currentOrganization,
  roleDisplay,
  quickActions,
  onNavigate,
}: {
  displayUser: DisplayUser;
  currentOrganization: OrganizationSummary | null;
  roleDisplay: RoleDisplayInfo;
  quickActions: QuickAction[];
  onNavigate: (path: string) => void;
}) {
  const RoleIcon = roleDisplay.icon;
  const riskPercentage = 0.75;
  const pointerOffset = Math.min(Math.max(riskPercentage * 100, 6), 94);
  const riskLabel =
    riskPercentage >= 0.85
      ? "Critical"
      : riskPercentage >= 0.65
      ? "High"
      : riskPercentage >= 0.35
      ? "Medium"
      : "Low";

  const runScanAction = quickActions.find(
    (action) => action.id === "run-pii-scan"
  );
  const reportIncidentAction = quickActions.find(
    (action) => action.id === "create-breach-report"
  );

  const rowsPerPageOptions = [5, 10, 20];
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(0);
  const totalPages = Math.max(
    Math.ceil(DATA_EXPOSURE_ROWS.length / rowsPerPage),
    1
  );
  const canGoPrevious = page > 0;
  const canGoNext = page < totalPages - 1;
  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(
    startIndex + rowsPerPage,
    DATA_EXPOSURE_ROWS.length
  );
  const paginatedRows = DATA_EXPOSURE_ROWS.slice(startIndex, endIndex);

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setRowsPerPage(value);
    setPage(0);
  };

  const handlePageChange = (direction: "previous" | "next") => {
    if (direction === "previous" && canGoPrevious) {
      setPage((prev) => prev - 1);
    }
    if (direction === "next" && canGoNext) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="space-y-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RoleIcon className="h-4 w-4 text-primary" />
              <span>{roleDisplay.label}</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Breach Exposure Overview
            </h1>
            <p className="text-muted-foreground">
              Monitor exposure, maintain compliance, and keep your organization
              secure.
            </p>
            {displayUser.jobTitle && (
              <p className="text-sm text-muted-foreground">
                {displayUser.jobTitle}
                {displayUser.department && ` • ${displayUser.department}`}
              </p>
            )}
          </div>

          {currentOrganization ? (
            <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Current Organization
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {currentOrganization.name}
                  </p>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <RoleIcon className="h-3.5 w-3.5" />
                  {roleDisplay.label}
                </Badge>
              </div>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                {currentOrganization.plan && (
                  <div>
                    Plan:{" "}
                    <span className="font-medium text-foreground">
                      {currentOrganization.plan}
                    </span>
                  </div>
                )}
                <div>
                  Status:{" "}
                  <span className="font-medium capitalize text-green-600 dark:text-green-400">
                    {currentOrganization.status ?? "active"}
                  </span>
                  {currentOrganization.industry && (
                    <span className="ml-2 text-muted-foreground">
                      • {currentOrganization.industry}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm rounded-2xl border border-yellow-300 bg-yellow-50 p-5 text-yellow-900 shadow-sm dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
              <p className="text-xs uppercase tracking-wide text-yellow-800 dark:text-yellow-300">
                Organization Setup
              </p>
              <p className="mt-2 text-lg font-semibold">
                Complete setup to unlock insights
              </p>
              <p className="mt-2 text-sm">
                Create or join an organization to view real-time compliance and
                exposure data.
              </p>
              <div className="mt-4 flex gap-3">
                <Button onClick={() => onNavigate("/onboarding")} size="sm">
                  Create Organization
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate("/onboarding")}
                  size="sm"
                >
                  Join Organization
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex w-full max-w-xl items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 shadow-sm dark:bg-slate-950/60">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search dashboards, reports, or tasks..."
              aria-label="Search dashboard"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-end">
            <div className="flex flex-1 flex-col justify-between gap-2 rounded-xl border border-border bg-card p-4 shadow-sm sm:max-w-xs">
              <Button
                variant="secondary"
                className="justify-center gap-2"
                onClick={() => onNavigate(runScanAction?.action || "/pii/scan")}
              >
                <Scan className="h-4 w-4" />
                Run a Purview Scan
              </Button>
              <div className="text-xs leading-5 text-muted-foreground">
                <div>Last scan: Jun 15, 2025</div>
                <div>Next scan: Jul 15, 2025</div>
              </div>
            </div>

            <Button
              className="flex-1 justify-center gap-2 sm:max-w-xs"
              onClick={() =>
                onNavigate(reportIncidentAction?.action || "/org/incidents")
              }
            >
              <AlertTriangle className="h-4 w-4" />
              Report an Incident
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-none bg-emerald-50 text-emerald-900 shadow-none dark:bg-emerald-900/20 dark:text-emerald-100">
        <CardContent className="flex items-start gap-3 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              Microsoft Purview integration is active
            </h2>
            <p className="text-sm text-emerald-800 dark:text-emerald-200/80">
              Automated data discovery and exposure insights are current with
              the latest scan.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Risk Spectrum</CardTitle>
          <CardDescription>
            Exposure level derived from recent incident trends and Purview
            results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative mt-4">
            <div className="h-6 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500" />
            <div
              className="pointer-events-none absolute left-0 top-0 flex -translate-y-9 -translate-x-1/2 flex-col items-center gap-1 transition-all duration-500"
              style={{ left: `${pointerOffset}%` }}
            >
              <span className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white dark:bg-slate-100 dark:text-slate-900">
                Current Exposure • {riskLabel}
              </span>
              <div className="h-0 w-0 border-x-6 border-x-transparent border-t-8 border-t-slate-900 dark:border-t-slate-100" />
            </div>
          </div>
          <div className="flex justify-between text-xs font-medium uppercase text-muted-foreground">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Data Exposure Matrix</CardTitle>
          <CardDescription>
            Track sensitive data categories, regulatory obligations, and next
            actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <div className="max-h-[420px] overflow-y-auto rounded-lg border border-border">
              <table className="min-w-[1200px] table-fixed border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-primary text-primary-foreground">
                  <tr>
                    {[
                      "Data Element Category",
                      "States of Operation",
                      "States of Affected Residents",
                      "Specific Data Elements",
                      "Data Classification",
                      "Alert Level",
                      "Preventive Actions",
                      "Authorities to Report & Deadlines",
                      "Notification Requirements",
                      "Forms & Templates",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((row) => (
                    <tr
                      key={row.category}
                      className="border-b border-border bg-card odd:bg-muted/40"
                    >
                      <td className="px-4 py-4 font-semibold text-foreground">
                        {row.category}
                      </td>
                      <td className="px-4 py-4 align-top text-muted-foreground">
                        {row.operations}
                      </td>
                      <td className="px-4 py-4 align-top text-muted-foreground">
                        {row.affectedStates}
                      </td>
                      <td className="px-4 py-4 align-top text-muted-foreground">
                        {row.elements}
                      </td>
                      <td className="px-4 py-4 align-top font-medium">
                        {row.classification}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                            ALERT_LEVEL_STYLES[row.alertLevel]
                          )}
                        >
                          {row.alertLevel}
                        </span>
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-4 align-top text-muted-foreground">
                        {row.preventiveActions}
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-4 align-top text-muted-foreground">
                        {row.authorities}
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-4 align-top text-muted-foreground">
                        {row.notifications}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <ul className="space-y-2">
                          {row.forms.map((form) => (
                            <li key={form.label}>
                              <a
                                href={form.href}
                                className="font-medium text-primary hover:underline"
                              >
                                {form.label}
                              </a>
                              <p className="text-xs text-muted-foreground">
                                {form.description}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {startIndex + 1}
              </span>{" "}
              to <span className="font-medium text-foreground">{endIndex}</span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {DATA_EXPOSURE_ROWS.length}
              </span>{" "}
              data categories
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Rows per page
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                >
                  {rowsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange("previous")}
                  disabled={!canGoPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page{" "}
                  <span className="font-medium text-foreground">
                    {page + 1}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange("next")}
                  disabled={!canGoNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Priority Tasks</CardTitle>
          <CardDescription>
            Stay on top of remediation items for the compliance program
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ORG_ADMIN_TASKS.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-sm",
                  task.completed && "text-muted-foreground line-through"
                )}
              >
                {task.label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <QuickActionsPanel actions={quickActions} onNavigate={onNavigate} />
    </div>
  );
}

export default function BreachExposurePage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { session } = useSession();
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (clerkLoaded && !clerkUser) {
      router.push("/sign-in");
    }
  }, [clerkLoaded, clerkUser, router]);

  if (!clerkLoaded || !role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading breach exposure...</p>
        </div>
      </div>
    );
  }

  if (!ORG_ROLES.includes(role as (typeof ORG_ROLES)[number])) {
    return null;
  }

  const displayUser: DisplayUser = session?.user
    ? {
        firstName: session.user.firstName ?? "",
        lastName: session.user.lastName ?? "",
        displayName: session.user.displayName ?? "",
        email: session.user.email ?? "",
        jobTitle: session.user.jobTitle ?? "",
        department: session.user.department ?? "",
      }
    : {
        firstName: clerkUser?.firstName ?? "",
        lastName: clerkUser?.lastName ?? "",
        displayName:
          clerkUser?.fullName ||
          clerkUser?.emailAddresses[0]?.emailAddress ||
          "",
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
        jobTitle: "",
        department: "",
      };

  const currentOrganization: OrganizationSummary | null =
    session?.currentOrganization
      ? {
          name: session.currentOrganization.name ?? "Organization",
          plan: session.currentOrganization.plan ?? undefined,
          status: session.currentOrganization.status ?? undefined,
          industry: session.currentOrganization.industry ?? undefined,
        }
      : null;

  const currentPermissions = session?.currentOrganization?.permissions ?? [];

  const quickActions = getQuickActionsForRole(role, currentPermissions);
  const roleDisplay = getRoleDisplay(role);

  const handleNavigate = (path: string) => {
    if (!path) return;

    if (path.startsWith("http")) {
      if (typeof window !== "undefined") {
        window.open(path, "_blank", "noreferrer");
      }
      return;
    }

    router.push(path);
  };

  if (role !== "org_admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Shield className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Breach Exposure Overview</h1>
          <p className="text-muted-foreground">
            This exposure dashboard is currently available for organization
            administrators. Reach out to your administrator if you need access
            or return to your role dashboard.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-full overflow-x-hidden px-4 sm:px-6"
      style={{ marginTop: "140px" }}
    >
      <BreachExposureContent
        displayUser={displayUser}
        currentOrganization={currentOrganization}
        roleDisplay={roleDisplay}
        quickActions={quickActions}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
