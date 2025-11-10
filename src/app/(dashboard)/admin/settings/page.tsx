"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationForm } from "@/components/admin/OrganizationForm";
import { MemberForm } from "@/components/admin/MemberForm";
import {
  OrganizationFormValues,
  organizationFormSchema,
} from "@/lib/validators/organization";
import {
  MemberFormValues,
  OrganizationOption,
  RoleOption,
} from "@/lib/validators/member";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AdminOrganization {
  id: string;
  name: string;
}

export default function AdminSettingsPage() {
  const [organizations, setOrganizations] = useState<AdminOrganization[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);
  const [organizationInitialValues, setOrganizationInitialValues] =
    useState<OrganizationFormValues | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [submittingOrg, setSubmittingOrg] = useState(false);
  const [invitingMember, setInvitingMember] = useState(false);

  const roleOptions: RoleOption[] = [
    { value: "org_admin", label: "Organization Admin" },
    { value: "org_manager", label: "Organization Manager" },
    { value: "org_user", label: "Organization User" },
    { value: "org_viewer", label: "Organization Viewer" },
    { value: "auditor", label: "Auditor" },
  ];

  const organizationOptions: OrganizationOption[] = useMemo(
    () =>
      organizations.map((org) => ({
        value: org.id,
        label: org.name,
      })),
    [organizations]
  );

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/admin/organizations");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load organizations");
        }
        const data = await response.json();
        const list: AdminOrganization[] = (data.organizations || []).map(
          (org: any) => ({
            id: org.id,
            name: org.name,
          })
        );
        setOrganizations(list);
        if (list.length > 0) {
          setSelectedOrganizationId(list[0].id);
        }
      } catch (error) {
        console.error("Error loading organizations:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load organizations"
        );
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchOrganizationDetail = async () => {
      if (!selectedOrganizationId) {
        setOrganizationInitialValues(null);
        return;
      }
      try {
        setLoadingOrg(true);
        const response = await fetch(
          `/api/admin/organizations/${selectedOrganizationId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load organization");
        }
        const data = await response.json();
        const org = data.organization;
        const metadataString =
          org.metadata && Object.keys(org.metadata).length > 0
            ? JSON.stringify(org.metadata, null, 2)
            : "";
        const values: OrganizationFormValues = {
          name: org.name,
          slug: org.slug,
          plan: org.plan,
          status: org.status,
          timezone: org.settings?.timezone || "UTC",
          industry: org.industry || "",
          primaryEmail: org.primaryEmail || "",
          phone: org.phone || "",
          description: org.description || "",
          address: org.address || "",
          metadata: metadataString,
          notifyOnIncidents:
            org.settings?.notifications?.email ?? true,
          requireMfa: org.settings?.security?.requireMfa ?? false,
          shareReports: org.settings?.sharing?.shareReports ?? true,
        };

        const parsed = organizationFormSchema.parse(values);
        setOrganizationInitialValues(parsed);
      } catch (error) {
        console.error("Error loading organization details:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load organization details"
        );
      } finally {
        setLoadingOrg(false);
      }
    };

    fetchOrganizationDetail();
  }, [selectedOrganizationId]);

  const handleOrganizationSubmit = async (values: OrganizationFormValues) => {
    if (!selectedOrganizationId) return;
    try {
      setSubmittingOrg(true);
      const response = await fetch(
        `/api/admin/organizations/${selectedOrganizationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update organization");
      }
      toast.success("Organization settings updated");
      setOrganizationInitialValues(values);
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update organization"
      );
    } finally {
      setSubmittingOrg(false);
    }
  };

  const handleInviteMember = async (values: MemberFormValues) => {
    try {
      setInvitingMember(true);
      const response = await fetch("/api/admin/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to invite member");
      }

      toast.success("Member invitation sent");
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to invite member"
      );
    } finally {
      setInvitingMember(false);
    }
  };

  return (
    <div
      className="w-full min-h-[calc(100vh-140px)] p-4 sm:p-6 md:p-8"
      style={{ marginTop: "140px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Platform Settings
        </h1>
        <p className="text-muted-foreground mb-6">
          Configure organization defaults, invite administrators, and manage
          platform-level settings.
        </p>

        <Tabs defaultValue="organization" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="members">Member Invitations</TabsTrigger>
          </TabsList>

          <TabsContent value="organization">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Organization Defaults</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Organization
                  </label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedOrganizationId ?? ""}
                    onChange={(event) =>
                      setSelectedOrganizationId(event.target.value)
                    }
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                {loadingOrg || !organizationInitialValues ? (
                  <div className="flex items-center gap-3 text-muted-foreground py-12">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading organization details…</span>
                  </div>
                ) : (
                  <OrganizationForm
                    defaultValues={organizationInitialValues}
                    onSubmit={handleOrganizationSubmit}
                    isSubmitting={submittingOrg}
                    mode="edit"
                    allowMetadata
                    showPlanField
                    showStatusField
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Quick Member Invitation</CardTitle>
              </CardHeader>
              <CardContent>
                {organizationOptions.length === 0 ? (
                  <div className="flex items-center gap-3 text-muted-foreground py-8">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading organizations…</span>
                  </div>
                ) : (
                  <MemberForm
                    onSubmit={handleInviteMember}
                    isSubmitting={invitingMember}
                    mode="create"
                    roleOptions={roleOptions}
                    organizationOptions={organizationOptions}
                    requireOrganization
                    allowMetadata={false}
                    showStatusField={false}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

