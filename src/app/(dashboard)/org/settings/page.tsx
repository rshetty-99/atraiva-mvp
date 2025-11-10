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
  RoleOption,
  OrganizationOption,
} from "@/lib/validators/member";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function OrgSettingsPage() {
  const [organizationValues, setOrganizationValues] =
    useState<OrganizationFormValues | null>(null);
  const [organizationOption, setOrganizationOption] =
    useState<OrganizationOption | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [savingOrg, setSavingOrg] = useState(false);
  const [invitingMember, setInvitingMember] = useState(false);

  const roleOptions: RoleOption[] = [
    { value: "org_admin", label: "Organization Admin" },
    { value: "org_manager", label: "Organization Manager" },
    { value: "org_user", label: "Organization User" },
    { value: "org_viewer", label: "Organization Viewer" },
  ];

  const organizationOptions = useMemo(
    () => (organizationOption ? [organizationOption] : []),
    [organizationOption]
  );

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoadingOrg(true);
        const response = await fetch("/api/org/organization");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load organization");
        }
        const data = await response.json();
        const org = data.organization;
        setOrganizationOption({ value: org.id, label: org.name });

        const metadataString =
          org.metadata && Object.keys(org.metadata).length > 0
            ? JSON.stringify(org.metadata, null, 2)
            : "";

        const values: OrganizationFormValues = {
          name: org.name,
          slug: org.slug,
          plan: org.plan,
          status: org.status,
          timezone: org.timezone,
          industry: org.industry || "",
          primaryEmail: org.primaryEmail || "",
          phone: org.phone || "",
          description: org.description || "",
          address: org.address || "",
          metadata: metadataString,
          notifyOnIncidents: true,
          requireMfa: false,
          shareReports: true,
        };

        const parsed = organizationFormSchema.parse(values);
        setOrganizationValues(parsed);
      } catch (error) {
        console.error("Error loading organization:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load organization"
        );
      } finally {
        setLoadingOrg(false);
      }
    };

    fetchOrganization();
  }, []);

  const handleOrganizationSubmit = async (values: OrganizationFormValues) => {
    try {
      setSavingOrg(true);
      const response = await fetch("/api/org/organization", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update organization");
      }
      toast.success("Organization settings updated");
      setOrganizationValues(values);
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update organization"
      );
    } finally {
      setSavingOrg(false);
    }
  };

  const handleInviteMember = async (values: MemberFormValues) => {
    try {
      setInvitingMember(true);
      const response = await fetch("/api/org/members", {
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
          Settings
        </h1>
        <p className="text-muted-foreground mb-6">
          Update organization profile and quickly invite new team members.
        </p>

        <Tabs defaultValue="organization" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="members">Invite Members</TabsTrigger>
          </TabsList>

          <TabsContent value="organization">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOrg || !organizationValues ? (
                  <div className="flex items-center gap-3 text-muted-foreground py-12">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading organization…</span>
                  </div>
                ) : (
                  <OrganizationForm
                    defaultValues={organizationValues}
                    onSubmit={handleOrganizationSubmit}
                    isSubmitting={savingOrg}
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
                <CardTitle>Invite a Member</CardTitle>
              </CardHeader>
              <CardContent>
                {organizationOptions.length === 0 ? (
                  <div className="flex items-center gap-3 text-muted-foreground py-8">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading organization…</span>
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

