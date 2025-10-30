"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Building2,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";

// Form validation schema
const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  industry: z.string().min(1, "Industry is required"),
  size: z.enum(["1-10", "11-50", "51-200", "201-1000", "1000+"]),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  description: z.string().optional(),
  subscriptionPlan: z.enum([
    "free",
    "starter",
    "professional",
    "enterprise",
    "custom",
  ]),
  subscriptionStatus: z.enum(["trial", "active", "suspended", "cancelled"]),
  applicableRegulations: z.array(z.string()).optional(),
  settings: z
    .object({
      timezone: z.string().optional(),
      locale: z.string().optional(),
      notifications: z
        .object({
          email: z.boolean().optional(),
          sms: z.boolean().optional(),
          push: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface Organization {
  id: string;
  name: string;
  industry: string;
  size: string;
  country: string;
  state?: string;
  city?: string;
  address?: string;
  zipCode?: string;
  website?: string;
  phone?: string;
  description?: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  applicableRegulations?: string[];
  settings?: {
    timezone?: string;
    locale?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
  membersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const INDUSTRY_OPTIONS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Education",
  "Government",
  "Non-profit",
  "Legal",
  "Consulting",
  "Real Estate",
  "Media",
  "Transportation",
  "Energy",
  "Other",
];

const REGULATION_OPTIONS = [
  "GDPR",
  "CCPA",
  "HIPAA",
  "SOX",
  "PCI-DSS",
  "FERPA",
  "COPPA",
  "PIPEDA",
  "LGPD",
  "PDPA",
  "Other",
];

const TIMEZONE_OPTIONS = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Australia/Sydney",
];

const LOCALE_OPTIONS = [
  "en-US",
  "en-GB",
  "en-CA",
  "en-AU",
  "es-ES",
  "es-MX",
  "fr-FR",
  "fr-CA",
  "de-DE",
  "it-IT",
  "pt-BR",
  "ja-JP",
  "zh-CN",
  "ko-KR",
];

export default function EditOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      industry: "",
      size: "1-10",
      country: "",
      state: "",
      city: "",
      address: "",
      zipCode: "",
      website: "",
      phone: "",
      description: "",
      subscriptionPlan: "free",
      subscriptionStatus: "active",
      applicableRegulations: [],
      settings: {
        timezone: "UTC",
        locale: "en-US",
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
      },
    },
  });

  useEffect(() => {
    const getOrganizationId = async () => {
      const resolvedParams = await params;
      setOrganizationId(resolvedParams.id as string);
    };
    getOrganizationId();
  }, [params]);

  useEffect(() => {
    if (organizationId) {
      fetchOrganization();
    }
  }, [organizationId]);

  const fetchOrganization = async () => {
    if (!organizationId) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/admin/organizations/${organizationId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch organization");
      }

      const data = await response.json();
      setOrganization(data.organization);

      // Populate form with organization data
      const formData = {
        name: data.organization.name || "",
        industry: data.organization.industry || "",
        size: data.organization.size || "1-10",
        country: data.organization.country || "",
        state: data.organization.state || "",
        city: data.organization.city || "",
        address: data.organization.address || "",
        zipCode: data.organization.zipCode || "",
        website: data.organization.website || "",
        phone: data.organization.phone || "",
        description: data.organization.description || "",
        subscriptionPlan: data.organization.subscriptionPlan || "free",
        subscriptionStatus: data.organization.subscriptionStatus || "active",
        applicableRegulations: data.organization.applicableRegulations || [],
        settings: {
          timezone: data.organization.settings?.timezone || "UTC",
          locale: data.organization.settings?.locale || "en-US",
          notifications: {
            email: data.organization.settings?.notifications?.email ?? true,
            sms: data.organization.settings?.notifications?.sms ?? false,
            push: data.organization.settings?.notifications?.push ?? true,
          },
        },
      };

      form.reset(formData);
      setHasUnsavedChanges(false);
    } catch (error: any) {
      console.error("Error fetching organization:", error);
      toast.error(error.message || "Failed to load organization details");
    } finally {
      setIsLoading(false);
    }
  };

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle navigation with unsaved changes
  const handleNavigation = useCallback(
    (path: string) => {
      if (hasUnsavedChanges) {
        setPendingNavigation(path);
        setShowExitDialog(true);
      } else {
        router.push(path);
      }
    },
    [hasUnsavedChanges, router]
  );

  // Handle exit without saving
  const handleExitWithoutSaving = useCallback(() => {
    setHasUnsavedChanges(false);
    setShowExitDialog(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  }, [pendingNavigation, router]);

  // Handle save and exit
  const handleSaveAndExit = useCallback(async () => {
    setShowExitDialog(false);
    const formData = form.getValues();
    await onSubmit(formData);
  }, [form]);

  const onSubmit = async (data: OrganizationFormData) => {
    if (!organizationId) return;

    try {
      setIsSaving(true);
      const response = await fetch(
        `/api/admin/organizations/${organizationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update organization");
      }

      toast.success("Organization updated successfully");
      setHasUnsavedChanges(false);
      router.push("/admin/organization");
    } catch (error: any) {
      console.error("Error updating organization:", error);
      toast.error(error.message || "Failed to update organization");
    } finally {
      setIsSaving(false);
    }
  };

  // Warn on browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (isLoading) {
    return (
      <div
        className="min-h-[calc(100vh-140px)] flex items-center justify-center"
        style={{ marginTop: "140px" }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div
        className="min-h-[calc(100vh-140px)] flex items-center justify-center"
        style={{ marginTop: "140px" }}
      >
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">Organization not found</p>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/organization")}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organizations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-[calc(100vh-140px)] p-8"
      style={{ marginTop: "140px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => handleNavigation("/admin/organization")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organizations
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-100">
                  Edit Organization
                </h1>
                <p className="text-gray-400 mt-1">
                  Update organization details and settings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {organization.membersCount} members
              </Badge>
              <Badge
                variant="outline"
                className={
                  organization.subscriptionStatus === "active"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                }
              >
                {organization.subscriptionStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Core organization details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter organization name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {INDUSTRY_OPTIONS.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Size *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">
                                1-10 employees
                              </SelectItem>
                              <SelectItem value="11-50">
                                11-50 employees
                              </SelectItem>
                              <SelectItem value="51-200">
                                51-200 employees
                              </SelectItem>
                              <SelectItem value="201-1000">
                                201-1000 employees
                              </SelectItem>
                              <SelectItem value="1000+">
                                1000+ employees
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Include the full URL with https://
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the organization"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>
                    Physical location and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP/Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Subscription & Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription & Compliance</CardTitle>
                  <CardDescription>
                    Billing and regulatory compliance settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="subscriptionPlan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subscription Plan</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select plan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="starter">Starter</SelectItem>
                              <SelectItem value="professional">
                                Professional
                              </SelectItem>
                              <SelectItem value="enterprise">
                                Enterprise
                              </SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subscriptionStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="trial">Trial</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="suspended">
                                Suspended
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="applicableRegulations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Applicable Regulations</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-3">
                            {REGULATION_OPTIONS.map((regulation) => (
                              <div
                                key={regulation}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={regulation}
                                  checked={
                                    field.value?.includes(regulation) || false
                                  }
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([
                                        ...currentValue,
                                        regulation,
                                      ]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (item) => item !== regulation
                                        )
                                      );
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={regulation}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {regulation}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Organization preferences and configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="settings.timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIMEZONE_OPTIONS.map((timezone) => (
                                <SelectItem key={timezone} value={timezone}>
                                  {timezone}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="settings.locale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Locale</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select locale" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LOCALE_OPTIONS.map((locale) => (
                                <SelectItem key={locale} value={locale}>
                                  {locale}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium">
                      Notification Preferences
                    </Label>

                    <FormField
                      control={form.control}
                      name="settings.notifications.email"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Email Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="settings.notifications.sms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              SMS Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive notifications via SMS
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="settings.notifications.push"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Push Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive push notifications
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleNavigation("/admin/organization")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save them before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleExitWithoutSaving}>
              Don&apos;t Save
            </AlertDialogCancel>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Continue Editing
            </Button>
            <AlertDialogAction onClick={handleSaveAndExit} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Exit"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
