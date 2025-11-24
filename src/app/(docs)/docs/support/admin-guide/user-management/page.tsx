import React from "react";

export default function UserManagement() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          User Management
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Complete guide to managing users, roles, and permissions in your
          Atraiva organization.
        </p>
      </div>

      {/* On This Page Navigation */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">
          On This Page
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#adding-users" className="text-primary hover:underline">
              Adding Users
            </a>
          </li>
          <li>
            <a href="#managing-roles" className="text-primary hover:underline">
              Managing Roles
            </a>
          </li>
          <li>
            <a href="#removing-users" className="text-primary hover:underline">
              Removing Users
            </a>
          </li>
          <li>
            <a href="#bulk-operations" className="text-primary hover:underline">
              Bulk Operations
            </a>
          </li>
          <li>
            <a
              href="#activity-monitoring"
              className="text-primary hover:underline"
            >
              User Activity Monitoring
            </a>
          </li>
          <li>
            <a href="#best-practices" className="text-primary hover:underline">
              Best Practices
            </a>
          </li>
          <li>
            <a href="#troubleshooting" className="text-primary hover:underline">
              Troubleshooting
            </a>
          </li>
        </ul>
      </div>

      {/* Adding Users */}
      <div className="space-y-6" id="adding-users">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Adding Users
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Via Email Invitation
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            The most common way to add users is through email invitations. This
            ensures secure onboarding and allows users to create their own
            credentials.
          </p>

          <div className="space-y-3">
            <p className="text-sm sm:text-base font-medium text-foreground">
              Steps:
            </p>
            <ol className="space-y-2 list-decimal list-inside text-sm sm:text-base text-foreground ml-4">
              <li>
                Navigate to <strong>Settings</strong> →{" "}
                <strong>Team Members</strong>
              </li>
              <li>
                Click the <strong>Invite Member</strong> button
              </li>
              <li>Enter the user&apos;s email address</li>
              <li>
                Select the appropriate role (Admin, Platform Admin, Member,
                etc.)
              </li>
              <li>Optionally add a personal message</li>
              <li>
                Click <strong>Send Invitation</strong>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r">
            <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 font-semibold mb-3">
              📧 Invitation Process
            </p>
            <ol className="space-y-2 text-sm sm:text-base text-blue-700 dark:text-blue-300">
              <li>
                <strong>1. Enter member email</strong> - Type the email address
                of the person you want to invite.
              </li>
              <li>
                <strong>2. Select role</strong> - Choose the appropriate role
                based on their responsibilities.
              </li>
              <li>
                <strong>3. Send invitation</strong> - The user will receive an
                email with an invitation link valid for 7 days.
              </li>
              <li>
                <strong>4. User accepts</strong> - They&apos;ll create their
                account and automatically join your organization.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Managing Roles */}
      <div className="space-y-6" id="managing-roles">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Managing Roles
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Available Roles
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Atraiva uses a role-based access control (RBAC) system. Each role
            has specific permissions and access levels.
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
                    Key Permissions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    Super Admin
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Full system access and control
                  </td>
                  <td className="p-3 text-foreground">
                    <ul className="text-xs space-y-1">
                      <li>• All platform permissions</li>
                      <li>• Manage all organizations</li>
                      <li>• System configuration</li>
                      <li>• User management</li>
                    </ul>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    Platform Admin
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Platform-level management
                  </td>
                  <td className="p-3 text-foreground">
                    <ul className="text-xs space-y-1">
                      <li>• Manage platform settings</li>
                      <li>• Access all features</li>
                      <li>• View analytics</li>
                      <li>• Support documentation</li>
                    </ul>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    Organization Admin
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Organization-level control
                  </td>
                  <td className="p-3 text-foreground">
                    <ul className="text-xs space-y-1">
                      <li>• Manage org members</li>
                      <li>• Configure org settings</li>
                      <li>• View org data</li>
                      <li>• Incident management</li>
                    </ul>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">Member</td>
                  <td className="p-3 text-muted-foreground">
                    Standard user access
                  </td>
                  <td className="p-3 text-foreground">
                    <ul className="text-xs space-y-1">
                      <li>• View incidents</li>
                      <li>• Create reports</li>
                      <li>• Read documentation</li>
                      <li>• Basic features</li>
                    </ul>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">Viewer</td>
                  <td className="p-3 text-muted-foreground">
                    Read-only access
                  </td>
                  <td className="p-3 text-foreground">
                    <ul className="text-xs space-y-1">
                      <li>• View-only permissions</li>
                      <li>• No data modification</li>
                      <li>• Read reports</li>
                      <li>• View dashboards</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Changing User Roles
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            You can update a user&apos;s role at any time. Changes take effect
            immediately.
          </p>

          <ol className="space-y-2 list-decimal list-inside text-sm sm:text-base text-foreground ml-4">
            <li>
              Navigate to <strong>Settings</strong> →{" "}
              <strong>Team Members</strong>
            </li>
            <li>Locate the user in the members list</li>
            <li>Click the role dropdown next to their name</li>
            <li>Select the new role from the dropdown menu</li>
            <li>
              Click <strong>Update Role</strong> to confirm
            </li>
          </ol>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-r">
            <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300 font-semibold mb-2">
              ⚠️ Important
            </p>
            <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300 leading-relaxed">
              Role changes take effect immediately and affect the user&apos;s
              access permissions across the entire platform. Always verify the
              user is logged out or ask them to refresh their session after role
              changes.
            </p>
          </div>
        </div>
      </div>

      {/* Removing Users */}
      <div className="space-y-6" id="removing-users">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Removing Users
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Deactivate vs Remove
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Understanding the difference between deactivating and removing
            users:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">
                🔒 Deactivate User
              </h4>
              <p className="text-sm text-muted-foreground">
                User loses access but their data, history, and contributions are
                preserved.
              </p>
              <ul className="text-xs text-foreground space-y-1 ml-4 list-disc">
                <li>Can be reactivated later</li>
                <li>Audit trail maintained</li>
                <li>Historical data intact</li>
              </ul>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                ✅ Recommended for temporary removal
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">🗑️ Remove User</h4>
              <p className="text-sm text-muted-foreground">
                Permanently deletes the user and all their associated data.
              </p>
              <ul className="text-xs text-foreground space-y-1 ml-4 list-disc">
                <li>Cannot be undone</li>
                <li>Removes all contributions</li>
                <li>Breaks historical references</li>
              </ul>
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                ⚠️ Use only when necessary
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            How to Remove a User
          </h3>

          <ol className="space-y-2 list-decimal list-inside text-sm sm:text-base text-foreground ml-4">
            <li>
              Go to <strong>Settings</strong> → <strong>Team Members</strong>
            </li>
            <li>Find the user you want to remove</li>
            <li>Click the three-dot menu (⋮) next to their name</li>
            <li>
              Select <strong>Remove User</strong> or{" "}
              <strong>Deactivate User</strong>
            </li>
            <li>Confirm the action in the dialog box</li>
            <li>Enter your password if prompted for security verification</li>
          </ol>

          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 sm:p-6 rounded-r">
            <p className="text-sm sm:text-base text-red-700 dark:text-red-300 font-semibold mb-2">
              🚨 Critical Warning
            </p>
            <p className="text-sm sm:text-base text-red-700 dark:text-red-300 leading-relaxed">
              Removing a user is <strong>permanent and cannot be undone</strong>
              . All their data, incident reports, and audit trail entries will
              be permanently deleted. We strongly recommend using{" "}
              <strong>Deactivate</strong> instead unless you have a specific
              compliance requirement to purge user data.
            </p>
          </div>
        </div>
      </div>

      {/* Bulk Operations */}
      <div className="space-y-6" id="bulk-operations">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Bulk Operations
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Import Multiple Users (CSV)
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            For larger teams or during initial setup, use the CSV bulk import
            feature to add multiple users at once.
          </p>

          <div className="space-y-3">
            <p className="text-sm sm:text-base font-medium text-foreground">
              Process:
            </p>
            <ol className="space-y-2 list-decimal list-inside text-sm sm:text-base text-foreground ml-4">
              <li>
                Navigate to <strong>Settings</strong> →{" "}
                <strong>Team Members</strong> → <strong>Import Users</strong>
              </li>
              <li>Download the CSV template file</li>
              <li>Fill in user details (email, role, first name, last name)</li>
              <li>Upload the completed CSV file</li>
              <li>Review the import preview to verify data</li>
              <li>
                Click <strong>Confirm Import</strong> to send invitations
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <p className="text-sm sm:text-base font-medium text-foreground">
              CSV Format Example:
            </p>
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs sm:text-sm font-mono text-foreground">
                {`email,role,firstName,lastName
john.doe@company.com,member,John,Doe
jane.smith@company.com,platform_admin,Jane,Smith
bob.jones@company.com,organization_admin,Bob,Jones
alice.williams@company.com,viewer,Alice,Williams`}
              </pre>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-4 sm:p-6">
            <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 font-semibold mb-2">
              💡 CSV Import Tips
            </p>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300 ml-4 list-disc">
              <li>Maximum 500 users per import</li>
              <li>File must be UTF-8 encoded</li>
              <li>Email addresses must be unique</li>
              <li>
                Valid roles: super_admin, platform_admin, organization_admin,
                member, viewer
              </li>
              <li>Invalid rows will be flagged during preview</li>
            </ul>
          </div>
        </div>
      </div>

      {/* User Activity Monitoring */}
      <div className="space-y-6" id="activity-monitoring">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          User Activity Monitoring
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Track and audit user activity to maintain security and compliance.
          Access detailed logs of all user actions within your organization.
        </p>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
            Available Audit Logs
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                🔐 Authentication Events
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Login attempts (successful/failed)</li>
                <li>Logout events</li>
                <li>Session expiry</li>
                <li>MFA verification</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                👥 Permission Changes
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Role assignments</li>
                <li>Role modifications</li>
                <li>Permission grants/revokes</li>
                <li>Access level changes</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                📊 Data Access Logs
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Incident views</li>
                <li>Report generation</li>
                <li>Data exports</li>
                <li>API calls</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                ⚙️ Configuration Changes
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Settings modifications</li>
                <li>Integration updates</li>
                <li>Notification preferences</li>
                <li>System configuration</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
            <p className="text-sm sm:text-base text-foreground mb-2">
              <strong>Access Audit Logs:</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Navigate to <strong>Settings</strong> →{" "}
              <strong>Audit Logs</strong> to view detailed activity reports,
              filter by user, date range, or event type, and export logs for
              compliance purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6" id="best-practices">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Best Practices
        </h2>

        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">
                ✅ Principle of Least Privilege
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Grant users only the minimum permissions necessary to perform
                their job functions. Start with lower privileges and elevate as
                needed.
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">
                ✅ Regular Access Reviews
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Conduct quarterly reviews of user permissions. Verify that each
                user still requires their current access level and adjust
                accordingly.
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">
                ✅ Prompt User Removal
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deactivate or remove users immediately when they leave the
                organization or change roles. Don&apos;t wait for the end of the
                pay period.
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">
                ✅ Document Role Assignments
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Maintain documentation explaining why specific users have
                elevated privileges. This helps during audits and handoffs.
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">
                ✅ Enable Multi-Factor Authentication
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Require MFA for all users, especially those with admin
                privileges. This significantly reduces the risk of account
                compromise.
              </p>
            </div>

            <div className="border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-foreground">
                ✅ Monitor User Activity
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Regularly review audit logs for suspicious activity, unusual
                access patterns, or policy violations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="space-y-6" id="troubleshooting">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Troubleshooting
        </h2>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
              User Can&apos;t Accept Invitation
            </h3>

            <p className="text-sm sm:text-base text-muted-foreground">
              <strong>Symptoms:</strong> User reports not receiving invitation
              email or unable to access invitation link.
            </p>

            <p className="text-sm sm:text-base text-foreground font-medium">
              Solutions:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
              <li>Ask user to check their spam/junk folder</li>
              <li>Verify the email address was entered correctly</li>
              <li>Check if invitation has expired (valid for 7 days)</li>
              <li>Resend invitation from the Team Members page</li>
              <li>
                Try using a different email address if corporate email is
                blocked
              </li>
              <li>Contact support if issue persists after resending</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
              User Has Wrong Permissions
            </h3>

            <p className="text-sm sm:text-base text-muted-foreground">
              <strong>Symptoms:</strong> User cannot access features they should
              have access to, or has access to restricted areas.
            </p>

            <p className="text-sm sm:text-base text-foreground font-medium">
              Solutions:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
              <li>Verify the user&apos;s role assignment is correct</li>
              <li>Confirm user is a member of the correct organization</li>
              <li>Check if custom permission overrides are configured</li>
              <li>
                Ask user to log out and log back in to refresh permissions
              </li>
              <li>
                Review the role permission matrix to ensure expected access
              </li>
              <li>
                Contact support if permissions don&apos;t match role definition
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">
              Cannot Change User Role
            </h3>

            <p className="text-sm sm:text-base text-muted-foreground">
              <strong>Symptoms:</strong> Role dropdown is disabled or changes
              don&apos;t save.
            </p>

            <p className="text-sm sm:text-base text-foreground font-medium">
              Solutions:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
              <li>Verify you have admin permissions to modify roles</li>
              <li>You cannot change your own role (security restriction)</li>
              <li>Super admins can only be modified by other super admins</li>
              <li>Check if organization has reached its admin user limit</li>
              <li>Ensure user is not protected (last super admin)</li>
            </ul>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
            <p className="text-sm sm:text-base text-foreground font-semibold mb-2">
              💬 Need More Help?
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you encounter issues not covered here, contact our support team
              at{" "}
              <a
                href="mailto:support@atraiva.ai"
                className="text-primary hover:underline font-medium"
              >
                support@atraiva.ai
              </a>{" "}
              or visit our{" "}
              <a
                href="/docs/support/troubleshooting"
                className="text-primary hover:underline font-medium"
              >
                Troubleshooting guide
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "User Management - Atraiva Support",
  description:
    "Complete guide to managing users, roles, and permissions in your Atraiva organization",
};
