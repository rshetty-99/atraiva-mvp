import React from "react";

export default function AdminGuide() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Admin Guide
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Comprehensive guides for administrators managing the Atraiva platform.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Getting Started
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          As an administrator, you have access to powerful tools for managing your organization&apos;s
          breach determination and compliance workflow. This guide will help you configure and
          optimize the platform for your team.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Admin Resources
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <a
            href="/docs/support/admin-guide/user-management"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              User Management
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Add, edit, and manage team members
            </p>
          </a>

          <a
            href="/docs/support/admin-guide/organization-setup"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Organization Setup
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Configure organization settings
            </p>
          </a>

          <a
            href="/docs/support/admin-guide/permissions"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Permissions &amp; Roles
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage access control
            </p>
          </a>

          <a
            href="/docs/support/admin-guide/integrations"
            className="block p-4 sm:p-6 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
              Integrations
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Connect external systems
            </p>
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Key Responsibilities
        </h2>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Platform Admins
        </h3>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>Manage platform-wide settings and configurations</li>
          <li>Oversee multiple organizations</li>
          <li>Monitor system health and performance</li>
          <li>Manage regulatory frameworks and breach triggers</li>
          <li>Access support documentation and tools</li>
        </ul>

        <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
          Organization Admins
        </h3>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>Manage team members and roles</li>
          <li>Configure organization-specific settings</li>
          <li>Set up integrations (Purview, SIEM)</li>
          <li>Customize notification templates</li>
          <li>Review and approve breach determinations</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Quick Start Checklist
        </h2>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>✅ Complete organization profile</li>
          <li>✅ Invite team members</li>
          <li>✅ Assign appropriate roles and permissions</li>
          <li>✅ Configure compliance settings</li>
          <li>✅ Set up integrations (Microsoft Purview, SIEM)</li>
          <li>✅ Customize notification templates</li>
          <li>✅ Review breach determination settings</li>
          <li>✅ Test incident reporting workflow</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground border-b pb-2">
          Best Practices
        </h2>

        <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground">
          <li>✅ Review user access quarterly</li>
          <li>✅ Keep organization information up to date</li>
          <li>✅ Enable MFA for all admin accounts</li>
          <li>✅ Monitor integration sync status regularly</li>
          <li>✅ Document custom configurations</li>
          <li>✅ Train team members on platform features</li>
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r">
        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
          <strong className="text-base">💡 Need Help?</strong> Contact your account manager or reach out to
          support at{" "}
          <a
            href="mailto:support@atraiva.ai"
            className="underline font-medium"
          >
            support@atraiva.ai
          </a>
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Admin Guide - Atraiva Support",
  description: "Administrator guides for managing Atraiva",
};

