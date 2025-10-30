"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Save,
  X,
  Loader2,
  AlertTriangle,
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "sonner";
import { format } from "date-fns";

// Form validation schema
const memberEditSchema = z.object({
  // Basic Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  jobTitle: z.string().optional(),

  // Organization Information
  organizationId: z.string().min(1, "Organization is required"),
  role: z.enum(["org_admin", "org_viewer"], {
    required_error: "Please select a role",
  }),

  // Security Settings
  twoFactorEnabled: z.boolean().optional(),
  isActive: z.boolean(),

  // Profile Settings
  timezone: z.string().optional(),
  locale: z.string().optional(),

  // Notifications
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean().optional(),
});

type MemberEditFormData = z.infer<typeof memberEditSchema>;

interface MemberDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  role: string;
  organizationId: string | null;
  organizationName: string;
  createdAt: Date;
  lastSignInAt: Date | null;
  isActive: boolean;
  twoFactorEnabled: boolean;
  phoneNumber?: string;
  jobTitle?: string;
  timezone?: string;
  locale?: string;
  organizations: Array<{
    id: string;
    name: string;
    role: string;
    status: string;
  }>;
  preferences?: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

interface Organization {
  id: string;
  name: string;
}

export default function MemberEditPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<MemberDetails | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  const form = useForm<MemberEditFormData>({
    resolver: zodResolver(memberEditSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      jobTitle: "",
      organizationId: "",
      role: "org_viewer",
      twoFactorEnabled: false,
      isActive: true,
      timezone: "America/New_York",
      locale: "en-US",
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
  });

  // Watch for form changes to detect unsaved changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        setHasUnsavedChanges(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle beforeunload event
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

  // Fetch member data
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberId = params.id as string;
        const response = await fetch(`/api/admin/members/${memberId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch member data");
        }

        const data = await response.json();
        setMember(data);

        // Populate form with member data
        form.reset({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          jobTitle: data.jobTitle || "",
          organizationId: data.organizationId || "",
          role: data.role || "org_viewer",
          twoFactorEnabled: data.twoFactorEnabled || false,
          isActive: data.isActive !== false,
          timezone: data.timezone || "America/New_York",
          locale: data.locale || "en-US",
          emailNotifications: data.preferences?.notifications?.email !== false,
          smsNotifications: data.preferences?.notifications?.sms || false,
          pushNotifications: data.preferences?.notifications?.push !== false,
        });

        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Error fetching member data:", error);
        toast.error("Failed to load member data");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/admin/organizations");
        if (response.ok) {
          const data = await response.json();
          setOrganizations(data.organizations || []);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    if (params.id) {
      fetchMemberData();
      fetchOrganizations();
    }
  }, [params.id, form]);

  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowExitDialog(true);
    } else {
      router.push(path);
    }
  };

  const handleExitWithoutSaving = () => {
    setHasUnsavedChanges(false);
    setShowExitDialog(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleSaveAndExit = async () => {
    await handleSave();
    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const formData = form.getValues();

      const response = await fetch(`/api/admin/members/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update member");
      }

      setHasUnsavedChanges(false);
      toast.success("Member updated successfully");
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update member"
      );
    } finally {
      setIsSaving(false);
    }
  };

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

  if (!member) {
    return (
      <div
        className="min-h-[calc(100vh-140px)] flex items-center justify-center"
        style={{ marginTop: "140px" }}
      >
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Member not found</h2>
          <p className="text-muted-foreground mb-4">
            The member you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={() => router.push("/admin/members")}>
            Back to Members
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-[calc(100vh-140px)] p-8 pb-24"
      style={{ marginTop: "140px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation("/admin/members")}
            className="flex items-center gap-2 mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Members
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Edit Member</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Update member information and settings
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8"></div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50 mb-8">
              <TabsTrigger
                value="basic"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="organization"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                Organization
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      Basic Information
                    </CardTitle>
                    <CardDescription className="text-base">
                      Update the member&apos;s personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          {...form.register("firstName")}
                          placeholder="Enter first name"
                        />
                        {form.formState.errors.firstName && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          {...form.register("lastName")}
                          placeholder="Enter last name"
                        />
                        {form.formState.errors.lastName && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder="Enter email address"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          {...form.register("phoneNumber")}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          {...form.register("jobTitle")}
                          placeholder="Enter job title"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Organization Tab */}
            <TabsContent value="organization" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="border-border/50 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      Organization Settings
                    </CardTitle>
                    <CardDescription className="text-base">
                      Manage the member&apos;s organization and role
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="organizationId">Organization *</Label>
                      <Select
                        value={form.watch("organizationId")}
                        onValueChange={(value) =>
                          form.setValue("organizationId", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.organizationId && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.organizationId.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role *</Label>
                      <Select
                        value={form.watch("role")}
                        onValueChange={(value) =>
                          form.setValue(
                            "role",
                            value as "org_admin" | "org_viewer"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="org_admin">
                            Organization Admin
                          </SelectItem>
                          <SelectItem value="org_viewer">
                            Organization Viewer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.role && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.role.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="border-border/50 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      Security Settings
                    </CardTitle>
                    <CardDescription className="text-base">
                      Manage the member&apos;s security and access settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={form.watch("isActive")}
                        onCheckedChange={(checked) =>
                          form.setValue("isActive", checked as boolean)
                        }
                      />
                      <Label htmlFor="isActive" className="text-sm font-medium">
                        Account is active
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="twoFactorEnabled"
                        checked={form.watch("twoFactorEnabled")}
                        onCheckedChange={(checked) =>
                          form.setValue("twoFactorEnabled", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="twoFactorEnabled"
                        className="text-sm font-medium"
                      >
                        Two-factor authentication enabled
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="border-border/50 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      Preferences
                    </CardTitle>
                    <CardDescription className="text-base">
                      Configure the member&apos;s preferences and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={form.watch("timezone")}
                          onValueChange={(value) =>
                            form.setValue("timezone", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">
                              Eastern Time
                            </SelectItem>
                            <SelectItem value="America/Chicago">
                              Central Time
                            </SelectItem>
                            <SelectItem value="America/Denver">
                              Mountain Time
                            </SelectItem>
                            <SelectItem value="America/Los_Angeles">
                              Pacific Time
                            </SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="locale">Locale</Label>
                        <Select
                          value={form.watch("locale")}
                          onValueChange={(value) =>
                            form.setValue("locale", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select locale" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en-US">English (US)</SelectItem>
                            <SelectItem value="en-GB">English (UK)</SelectItem>
                            <SelectItem value="es-ES">Spanish</SelectItem>
                            <SelectItem value="fr-FR">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">
                        Notification Preferences
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="emailNotifications"
                            checked={form.watch("emailNotifications")}
                            onCheckedChange={(checked) =>
                              form.setValue(
                                "emailNotifications",
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor="emailNotifications"
                            className="text-sm"
                          >
                            Email notifications
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="smsNotifications"
                            checked={form.watch("smsNotifications")}
                            onCheckedChange={(checked) =>
                              form.setValue(
                                "smsNotifications",
                                checked as boolean
                              )
                            }
                          />
                          <Label htmlFor="smsNotifications" className="text-sm">
                            SMS notifications
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="pushNotifications"
                            checked={form.watch("pushNotifications")}
                            onCheckedChange={(checked) =>
                              form.setValue(
                                "pushNotifications",
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor="pushNotifications"
                            className="text-sm"
                          >
                            Push notifications
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </form>

        {/* Floating Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-card border border-border rounded-xl shadow-2xl p-4 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => handleNavigation("/admin/members")}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </motion.div>

        {/* Unsaved Changes Dialog */}
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Do you want to save them before
                leaving?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleExitWithoutSaving}>
                Leave without saving
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveAndExit}>
                Save and continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
}
