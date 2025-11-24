import React from "react";

export default function Permissions() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Permissions & Roles
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Comprehensive guide to understanding and managing role-based access
          control (RBAC) in Atraiva.
        </p>
      </div>

      {/* On This Page Navigation */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">
          On This Page
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#role-hierarchy" className="text-primary hover:underline">
              Role Hierarchy
            </a>
          </li>
          <li>
            <a
              href="#permission-matrix"
              className="text-primary hover:underline"
            >
              Permission Matrix
            </a>
          </li>
          <li>
            <a href="#detailed-roles" className="text-primary hover:underline">
              Detailed Role Descriptions
            </a>
          </li>
          <li>
            <a
              href="#assigning-permissions"
              className="text-primary hover:underline"
            >
              Assigning Permissions
            </a>
          </li>
          <li>
            <a
              href="#custom-permissions"
              className="text-primary hover:underline"
            >
              Custom Permissions
            </a>
          </li>
          <li>
            <a href="#best-practices" className="text-primary hover:underline">
              Best Practices
            </a>
          </li>
        </ul>
      </div>

      {/* Role Hierarchy */}
      <div className="space-y-6" id="role-hierarchy">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Role Hierarchy
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Atraiva uses a hierarchical role-based access control (RBAC) system.
          Roles are divided into <strong>Platform Roles</strong> (system-wide)
          and <strong>Organization Roles</strong> (organization-specific).
        </p>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Platform Roles
          </h3>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Platform roles have access across all organizations and system-level
            features.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Role
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Description
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Access Level
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👑</span>
                      <span className="font-medium text-foreground">
                        Super Admin
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Complete platform control, system configuration, and all
                    organizations
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      Full Access
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚙️</span>
                      <span className="font-medium text-foreground">
                        Platform Admin
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Platform operations, support documentation, and cross-org
                    analytics
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                      High Access
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Organization Roles
          </h3>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Organization roles are scoped to a specific organization and its
            data.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Role
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Description
                  </th>
                  <th className="border-b border-border p-3 text-left font-semibold text-foreground">
                    Access Level
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <span className="font-medium text-foreground">
                        Organization Admin
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Complete control over organization settings, users, and data
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      Full (Org)
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📊</span>
                      <span className="font-medium text-foreground">
                        Organization Manager
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Operational management, incident handling, and team
                    coordination
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                      High (Org)
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔍</span>
                      <span className="font-medium text-foreground">
                        Organization Analyst
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Data analysis, reporting, and incident support
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      Medium
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👀</span>
                      <span className="font-medium text-foreground">
                        Organization Viewer
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Read-only dashboard and report access
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      Read-Only
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📋</span>
                      <span className="font-medium text-foreground">
                        Auditor
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Time-limited audit access with comprehensive logs
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                      Time-Limited
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r">
            <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 font-semibold mb-2">
              💡 Understanding Role Scope
            </p>
            <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 leading-relaxed">
              <strong>Platform roles</strong> can access all organizations and
              system-wide features. <strong>Organization roles</strong> are
              limited to their assigned organization(s) and cannot access
              platform administration or other organizations&apos; data.
            </p>
          </div>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="space-y-6" id="permission-matrix">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Permission Matrix
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Detailed breakdown of permissions by role. ✅ indicates the role has
          access to the feature.
        </p>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-muted">
                  <tr>
                    <th className="border-b border-border p-2 text-left font-semibold text-foreground sticky left-0 bg-muted z-10">
                      Feature / Permission
                    </th>
                    <th className="border-b border-border p-2 text-center font-semibold text-foreground">
                      Super
                    </th>
                    <th className="border-b border-border p-2 text-center font-semibold text-foreground">
                      Platform
                    </th>
                    <th className="border-b border-border p-2 text-center font-semibold text-foreground">
                      Org Admin
                    </th>
                    <th className="border-b border-border p-2 text-center font-semibold text-foreground">
                      Org Mgr
                    </th>
                    <th className="border-b border-border p-2 text-center font-semibold text-foreground">
                      Analyst
                    </th>
                    <th className="border-b border-border p-2 text-center font-semibold text-foreground">
                      Viewer
                    </th>
                    <th className="border-b border-border p-2 text-center font-semibold text-foreground">
                      Auditor
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Dashboard & Analytics */}
                  <tr className="bg-muted/20">
                    <td
                      colSpan={8}
                      className="p-2 text-xs font-semibold text-foreground"
                    >
                      📊 Dashboard & Analytics
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      View Dashboard
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Export Reports
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">✅</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      View Analytics
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                  </tr>

                  {/* Incident Management */}
                  <tr className="bg-muted/20">
                    <td
                      colSpan={8}
                      className="p-2 text-xs font-semibold text-foreground"
                    >
                      🚨 Incident Management
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      View Incidents
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Create Incidents
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Edit Incidents
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Delete Incidents
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>

                  {/* User Management */}
                  <tr className="bg-muted/20">
                    <td
                      colSpan={8}
                      className="p-2 text-xs font-semibold text-foreground"
                    >
                      👥 User Management
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      View Team Members
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Invite Users
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Manage User Roles
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Remove Users
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>

                  {/* Organization Settings */}
                  <tr className="bg-muted/20">
                    <td
                      colSpan={8}
                      className="p-2 text-xs font-semibold text-foreground"
                    >
                      ⚙️ Organization Settings
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      View Settings
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">✅</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Edit Organization Profile
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Configure Integrations
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Manage Compliance Settings
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>

                  {/* Platform Administration */}
                  <tr className="bg-muted/20">
                    <td
                      colSpan={8}
                      className="p-2 text-xs font-semibold text-foreground"
                    >
                      🔧 Platform Administration
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Access Platform Admin
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Manage All Organizations
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      System Configuration
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      View Support Documentation
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                  </tr>

                  {/* Audit & Compliance */}
                  <tr className="bg-muted/20">
                    <td
                      colSpan={8}
                      className="p-2 text-xs font-semibold text-foreground"
                    >
                      📋 Audit & Compliance
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      View Audit Logs
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">✅</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Export Audit Logs
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">✅</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 text-foreground sticky left-0 bg-background">
                      Generate Compliance Reports
                    </td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">✅</td>
                    <td className="p-2 text-center">❌</td>
                    <td className="p-2 text-center">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            <strong>Note on Permission Updates:</strong> This matrix represents
            current permissions. As Atraiva adds new features, permissions may
            be extended. Check this documentation regularly or review release
            notes for permission changes.
          </p>
        </div>
      </div>

      {/* Detailed Role Descriptions - Continued in next part due to length */}
      <div className="space-y-6" id="detailed-roles">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Detailed Role Descriptions
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          In-depth explanation of each role&apos;s responsibilities and use
          cases.
        </p>

        <div className="space-y-4">
          {/* Super Admin */}
          <div className="border border-border rounded-lg p-4 sm:p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👑</span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Super Admin
                </h3>
                <p className="text-xs text-muted-foreground">
                  Platform Role - Full System Access
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              The Super Admin role has unrestricted access to all platform
              features, organizations, and system configuration. This role
              should be assigned only to trusted platform operators.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Typical Use Cases:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Atraiva platform operators and engineers</li>
                <li>System administrators managing infrastructure</li>
                <li>Senior leadership with cross-org oversight</li>
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-500 rounded p-3">
              <p className="text-xs text-red-700 dark:text-red-300">
                <strong>Security Note:</strong> Limit Super Admin assignments.
                Use Platform Admin for most operational tasks.
              </p>
            </div>
          </div>

          {/* Platform Admin */}
          <div className="border border-border rounded-lg p-4 sm:p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚙️</span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Platform Admin
                </h3>
                <p className="text-xs text-muted-foreground">
                  Platform Role - High-Level Operations
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Platform Admins manage day-to-day operations across all
              organizations, provide customer support, and access platform-wide
              analytics. They cannot modify system configuration.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Typical Use Cases:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Customer success and support teams</li>
                <li>Platform operations managers</li>
                <li>Implementation consultants</li>
              </ul>
            </div>
          </div>

          {/* Organization Admin */}
          <div className="border border-border rounded-lg p-4 sm:p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Organization Admin
                </h3>
                <p className="text-xs text-muted-foreground">
                  Organization Role - Full Org Control
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Organization Admins have complete control over their
              organization&apos;s settings, users, data, and compliance
              configuration. This is the highest role available to customer
              organizations.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Typical Use Cases:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>CISOs and security leadership</li>
                <li>Compliance officers</li>
                <li>IT administrators</li>
              </ul>
            </div>
          </div>

          {/* Organization Manager */}
          <div className="border border-border rounded-lg p-4 sm:p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Organization Manager
                </h3>
                <p className="text-xs text-muted-foreground">
                  Organization Role - Operational Management
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Organization Managers handle incident response, team coordination,
              and user management but cannot modify organization settings or
              compliance frameworks.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Typical Use Cases:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Security operations managers</li>
                <li>Incident response coordinators</li>
                <li>Team leads managing daily operations</li>
              </ul>
            </div>
          </div>

          {/* Organization Analyst */}
          <div className="border border-border rounded-lg p-4 sm:p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔍</span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Organization Analyst
                </h3>
                <p className="text-xs text-muted-foreground">
                  Organization Role - Data Analysis
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Analysts can view incidents, generate reports, and analyze data
              but cannot create incidents, manage users, or modify settings.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Typical Use Cases:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Security analysts and researchers</li>
                <li>Compliance reporting specialists</li>
                <li>Data analysts supporting security teams</li>
              </ul>
            </div>
          </div>

          {/* Organization Viewer */}
          <div className="border border-border rounded-lg p-4 sm:p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👀</span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Organization Viewer
                </h3>
                <p className="text-xs text-muted-foreground">
                  Organization Role - Read-Only Access
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Viewers have read-only access to dashboards and basic reporting.
              They cannot create, edit, or export any data.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Typical Use Cases:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Executive leadership monitoring metrics</li>
                <li>Board members reviewing compliance posture</li>
                <li>Stakeholders requiring visibility only</li>
              </ul>
            </div>
          </div>

          {/* Auditor */}
          <div className="border border-border rounded-lg p-4 sm:p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📋</span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Auditor
                </h3>
                <p className="text-xs text-muted-foreground">
                  Organization Role - Time-Limited Audit Access
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Auditors receive comprehensive read-only access for a specified
              time period. Access automatically expires and can be extended by
              admins.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Typical Use Cases:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>External auditors conducting reviews</li>
                <li>Regulatory examiners</li>
                <li>Third-party assessors</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Access Period:</strong> Auditor access is typically
                granted for 30-90 days and must be manually extended by an Org
                Admin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigning Permissions */}
      <div className="space-y-6" id="assigning-permissions">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Assigning Permissions
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            How to Assign Roles
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Only users with admin privileges can assign or modify roles.
          </p>

          <ol className="space-y-2 list-decimal list-inside text-sm sm:text-base text-foreground ml-4">
            <li>
              Navigate to <strong>Settings</strong> →{" "}
              <strong>Team Members</strong>
            </li>
            <li>Locate the user you want to modify in the members list</li>
            <li>
              Click the <strong>role dropdown</strong> next to their name
            </li>
            <li>Select the appropriate role for their responsibilities</li>
            <li>
              Click <strong>Update Role</strong> or <strong>Save</strong> to
              confirm
            </li>
            <li>Notify the user of the change (optional but recommended)</li>
          </ol>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-r">
            <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300 font-semibold mb-2">
              ⚠️ Important: Immediate Effect
            </p>
            <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300 leading-relaxed">
              Role changes take effect <strong>immediately</strong>. Users will
              need to <strong>refresh their browser</strong> or log out and log
              back in to see updated permissions reflected in the UI. Active
              sessions may retain old permissions for up to 5 minutes.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Role Assignment Restrictions
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">🚫 You Cannot:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Change your own role (security restriction)</li>
                <li>
                  Assign a role higher than your own (e.g., Org Admin cannot
                  create Super Admins)
                </li>
                <li>Modify the last Super Admin (prevents lockout)</li>
                <li>Assign Platform roles without platform-level access</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">✅ You Can:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Assign roles equal to or lower than your own</li>
                <li>Modify multiple users&apos; roles in bulk (CSV import)</li>
                <li>Downgrade users from higher to lower roles</li>
                <li>Set time-limited Auditor access with expiration dates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Permissions */}
      <div className="space-y-6" id="custom-permissions">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Custom Permissions
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Enterprise plans support custom permission sets that allow
          fine-grained control beyond standard roles.
        </p>

        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🎛️</span>
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                Custom Permission Sets
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create specialized roles tailored to your organization&apos;s
                unique workflow:
              </p>
              <ul className="text-sm text-foreground space-y-2 ml-4 list-disc">
                <li>
                  <strong>Incident Responder</strong> - Create/edit incidents
                  but no user management
                </li>
                <li>
                  <strong>Compliance Auditor</strong> - Export reports and logs
                  but no incident access
                </li>
                <li>
                  <strong>Integration Manager</strong> - Configure integrations
                  but no data access
                </li>
                <li>
                  <strong>Report Specialist</strong> - Generate reports without
                  incident creation
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-background/50 border border-border rounded-lg p-4">
            <p className="text-sm text-foreground mb-2">
              <strong>How to Request Custom Permissions:</strong>
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Custom permission sets are configured by Atraiva&apos;s support
              team based on your specific requirements.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="mailto:support@atraiva.ai?subject=Custom Permission Request"
                className="text-sm text-primary hover:underline font-medium"
              >
                Contact Your Account Manager →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6" id="best-practices">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Best Practices
        </h2>

        <div className="grid gap-4">
          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Principle of Least Privilege
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Always assign the minimum role required for users to perform their
              job functions. Start with lower privileges (Viewer or Analyst) and
              elevate only when necessary.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Regular Role Reviews
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Conduct quarterly reviews of all user roles. Verify that each user
              still requires their current access level and adjust based on job
              changes or departures.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Immediate Access Revocation
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Remove or deactivate users immediately when they leave the
              organization or change roles. Don&apos;t wait for
              end-of-pay-period or offboarding completion.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Use Auditor Role for External Access
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When granting access to external auditors, regulators, or
              consultants, always use the time-limited Auditor role. Set clear
              expiration dates and review before extending.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Document Role Assignment Decisions
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Maintain internal documentation explaining why specific users have
              elevated privileges (Admin or Manager roles). This aids compliance
              audits and knowledge transfer.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Limit Super Admin and Platform Admin Roles
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Super Admin and Platform Admin roles should be reserved for
              Atraiva platform operators and senior technical staff only.
              Customer organizations should use Organization Admin as the
              highest role.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">
              ✅ Monitor High-Privilege Actions
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Regularly review audit logs for actions taken by Admin and Manager
              roles. Look for unusual patterns, configuration changes, or policy
              violations.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-muted/50 border border-border rounded-lg p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Additional Resources
        </h2>

        <div className="space-y-3">
          <a
            href="/docs/support/admin-guide/user-management"
            className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-background transition-colors"
          >
            <span className="text-2xl">👥</span>
            <div>
              <p className="text-sm font-medium text-foreground">
                User Management Guide
              </p>
              <p className="text-xs text-muted-foreground">
                Learn how to invite, manage, and remove users
              </p>
            </div>
          </a>

          <a
            href="/docs/support/admin-guide/organization-setup"
            className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-background transition-colors"
          >
            <span className="text-2xl">⚙️</span>
            <div>
              <p className="text-sm font-medium text-foreground">
                Organization Setup
              </p>
              <p className="text-xs text-muted-foreground">
                Configure your organization settings and compliance frameworks
              </p>
            </div>
          </a>

          <a
            href="/docs/support/troubleshooting"
            className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-background transition-colors"
          >
            <span className="text-2xl">🔧</span>
            <div>
              <p className="text-sm font-medium text-foreground">
                Troubleshooting
              </p>
              <p className="text-xs text-muted-foreground">
                Common issues with permissions and access
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Permissions & Roles - Atraiva Support",
  description:
    "Comprehensive guide to understanding and managing role-based access control (RBAC) in Atraiva",
};
