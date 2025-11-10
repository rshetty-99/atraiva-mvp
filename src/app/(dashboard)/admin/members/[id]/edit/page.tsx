"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberForm } from "@/components/admin/MemberForm";
import {
  MemberFormValues,
  OrganizationOption,
  RoleOption,
} from "@/lib/validators/member";
import { toast } from "sonner";

const roleOptions: RoleOption[] = [
  { value: "org_admin", label: "Organization Admin" },
  { value: "org_manager", label: "Organization Manager" },
  { value: "org_user", label: "Organization User" },
  { value: "org_viewer", label: "Organization Viewer" },
  { value: "auditor", label: "Auditor" },
];

interface MemberResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  organizationId?: string | null;
  organizationName?: string | null;
  phone?: string;
  phoneNumber?: string;
  department?: string;
  jobTitle?: string;
  allowDashboardAccess?: boolean;
  requireMfa?: boolean;
  metadata?: Record<string, unknown>;
}

export default function EditMemberPage() {
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  const memberIdRaw = routeParams?.id;
  const memberId = Array.isArray(memberIdRaw) ? memberIdRaw[0] : memberIdRaw;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<MemberFormValues | null>(
    null
  );
  const [organizationOptions, setOrganizationOptions] = useState<
    OrganizationOption[]
  >([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/admin/organizations");
        if (!response.ok) return;
        const data = await response.json();
        const options: OrganizationOption[] = (data.organizations || []).map(
          (org: { id: string; name: string }) => ({
            value: org.id,
            label: org.name,
          })
        );
        setOrganizationOptions(options);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchMember = async () => {
      if (!memberId) {
        setIsLoading(false);
        toast.error("Missing member identifier.");
        router.push("/admin/members");
        return;
      }
      try {
        const response = await fetch(`/api/admin/members/${memberId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load member");
        }
        const data: MemberResponse = await response.json();

        const metadataString =
          data.metadata && Object.keys(data.metadata).length > 0
            ? JSON.stringify(data.metadata, null, 2)
            : "";

        const mappedValues: MemberFormValues = {
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          role: data.role || "org_viewer",
          status: data.status || "active",
          organizationId: data.organizationId || "",
          department: data.department || "",
          jobTitle: data.jobTitle || "",
          phone: data.phone || data.phoneNumber || "",
          metadata: metadataString,
          sendInvite: false,
          requireMfa: data.requireMfa ?? false,
          allowDashboardAccess: data.allowDashboardAccess ?? true,
        };

        setInitialValues(mappedValues);
      } catch (error) {
        console.error("Error fetching member:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load member"
        );
        router.push("/admin/members");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [memberId, router]);

  const handleSubmit = async (values: MemberFormValues) => {
    try {
      setIsSubmitting(true);
      if (!memberId) {
        throw new Error("Missing member identifier.");
      }
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update member");
      }

      toast.success("Member updated");
      router.push(`/admin/members/${memberId}`);
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update member"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = useMemo(
    () => () => {
      router.back();
    },
    [router]
  );

  if (isLoading || !initialValues) {
    return (
      <div
        className="min-h-[calc(100vh-140px)] flex items-center justify-center"
        style={{ marginTop: "140px" }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-[calc(100vh-140px)] p-4 sm:p-6 md:p-8"
      style={{ marginTop: "140px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Edit Member
            </h1>
            <p className="text-muted-foreground">
              Update member details, roles, and access preferences.
            </p>
          </div>
          <Button variant="ghost" onClick={() => router.push("/admin/members")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
        </div>

        <MemberForm
          defaultValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          mode="edit"
          roleOptions={roleOptions}
          organizationOptions={organizationOptions}
          showStatusField
          allowMetadata
        />
      </motion.div>
    </div>
  );
}

