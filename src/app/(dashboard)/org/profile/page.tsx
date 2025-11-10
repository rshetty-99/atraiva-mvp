"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationForm } from "@/components/admin/OrganizationForm";
import {
  OrganizationFormValues,
  organizationFormSchema,
} from "@/lib/validators/organization";
import { toast } from "sonner";

type OrganizationResponse = {
  organization: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    status: string;
    timezone: string;
    industry?: string;
    primaryEmail?: string;
    phone?: string;
    description?: string;
    address?: string;
    metadata?: Record<string, unknown>;
  };
};

export default function OrganizationProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] =
    useState<OrganizationFormValues | null>(null);
  const [organizationName, setOrganizationName] = useState<string>("");

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/org/organization");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load organization");
        }
        const data: OrganizationResponse = await response.json();
        const organization = data.organization;

        const metadataString =
          organization.metadata && Object.keys(organization.metadata).length > 0
            ? JSON.stringify(organization.metadata, null, 2)
            : "";

        const values: OrganizationFormValues = {
          name: organization.name,
          slug: organization.slug,
          plan: organization.plan,
          status: organization.status,
          timezone: organization.timezone,
          industry: organization.industry || "",
          primaryEmail: organization.primaryEmail || "",
          phone: organization.phone || "",
          description: organization.description || "",
          address: organization.address || "",
          metadata: metadataString,
          notifyOnIncidents: true,
          requireMfa: false,
          shareReports: true,
        };

        const parsed = organizationFormSchema.parse(values);
        setInitialValues(parsed);
        setOrganizationName(organization.name);
      } catch (error) {
        console.error("Error loading organization:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load organization"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, []);

  const handleSubmit = async (values: OrganizationFormValues) => {
    try {
      setIsSubmitting(true);
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

      const data: OrganizationResponse = await response.json();
      const updated = data.organization;
      setOrganizationName(updated.name);
      toast.success("Organization profile updated");
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update organization"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = useMemo(() => {
    if (isLoading || !initialValues) {
      return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Organization Profile
            </h1>
            <p className="text-muted-foreground">
              Maintain organization details, compliance contacts, and metadata.
            </p>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Organization Details
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Update name, contact information, and subscription metadata.
              </p>
            </div>
            <div className="hidden md:block p-3 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <OrganizationForm
              defaultValues={initialValues}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              showPlanField
              showStatusField
              allowMetadata
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }, [initialValues, isLoading, isSubmitting]);

  return (
    <div
      className="w-full min-h-[calc(100vh-140px)] p-4 sm:p-6 md:p-8"
      style={{ marginTop: "140px" }}
    >
      {renderContent}
    </div>
  );
}

