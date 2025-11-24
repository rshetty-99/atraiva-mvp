"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

// Form validation schema
const registrationSchema = z
  .object({
    // Organization data (pre-filled, editable)
    organizationName: z.string().min(1, "Organization name is required"),
    organizationType: z.enum([
      "law_firm",
      "enterprise",
      "channel_partner",
      "government",
      "nonprofit",
    ]),
    industry: z.string().min(1, "Industry is required"),
    teamSize: z.enum(["1-10", "11-50", "51-200", "201-1000", "1000+"]),

    // Primary user data (pre-filled, editable)
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens"
      ),
    jobTitle: z.string().optional(),
    role: z.string().min(1, "Role is required"),

    // Password setup
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),

    // Team members (at least 1 required)
    teamMembers: z
      .array(
        z.object({
          firstName: z.string().min(1, "First name required"),
          lastName: z.string().min(1, "Last name required"),
          email: z.string().email("Valid email required"),
          role: z.string().min(1, "Role required"),
        })
      )
      .min(1, "At least one team member is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don&apos;t match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof registrationSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [validating, setValidating] = useState(true);
  const [linkData, setLinkData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"validate" | "form" | "complete">(
    "validate"
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      organizationName: "",
      organizationType: "enterprise",
      industry: "",
      teamSize: "1-10",
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      jobTitle: "",
      role: "org_admin",
      password: "",
      confirmPassword: "",
      teamMembers: [
        {
          firstName: "",
          lastName: "",
          email: "",
          role: "org_manager",
        },
      ],
    },
  });

  const validateToken = useCallback(
    async (tokenParam: string) => {
      try {
        const response = await fetch("/api/registration-links/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok || !data.valid) {
          setError(data.error || "Invalid registration link");
          setValidating(false);
          return;
        }

        // Link is valid, populate form with pre-filled data
        const { link } = data;
        setLinkData(link);

        form.reset({
          organizationName: link.organizationData.name,
          organizationType: link.organizationData.organizationType,
          industry: link.organizationData.industry,
          teamSize: link.organizationData.teamSize,
          firstName: link.primaryUserData.firstName,
          lastName: link.primaryUserData.lastName,
          email: link.primaryUserData.email,
          jobTitle: link.primaryUserData.jobTitle || "",
          role: link.primaryUserData.role,
          password: "",
          confirmPassword: "",
          teamMembers: [
            {
              firstName: "",
              lastName: "",
              email: "",
              role: "org_manager",
            },
          ],
        });

        setValidating(false);
        setStep("form");
      } catch (error) {
        console.error("Error validating token:", error);
        setError("Failed to validate registration link. Please try again.");
        setValidating(false);
      }
    },
    [form]
  );

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setError("No registration token provided");
      setValidating(false);
      return;
    }

    validateToken(token);
  }, [token, validateToken]);

  const addTeamMember = () => {
    const currentMembers = form.getValues("teamMembers");
    form.setValue("teamMembers", [
      ...currentMembers,
      {
        firstName: "",
        lastName: "",
        email: "",
        role: "org_manager",
      },
    ]);
  };

  const removeTeamMember = (index: number) => {
    const currentMembers = form.getValues("teamMembers");
    if (currentMembers.length > 1) {
      form.setValue(
        "teamMembers",
        currentMembers.filter((_, i) => i !== index)
      );
    } else {
      toast.error("At least one team member is required");
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);

      const response = await fetch("/api/registration/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          organizationData: {
            name: values.organizationName,
            organizationType: values.organizationType,
            industry: values.industry,
            teamSize: values.teamSize,
            ...linkData.organizationData.address,
            website: linkData.organizationData.website,
            phone: linkData.organizationData.phone,
          },
          primaryUserData: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            username: values.username,
            jobTitle: values.jobTitle,
            role: values.role,
            password: values.password,
          },
          teamMembers: values.teamMembers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete registration");
      }

      setStep("complete");
      toast.success(
        "Registration completed successfully! You will be redirected to complete your onboarding."
      );

      // Redirect to onboarding after 3 seconds
      setTimeout(() => {
        router.push("/onboarding");
      }, 3000);
    } catch (error: unknown) {
      console.error("Error completing registration:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to complete registration";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Validation loading state
  if (validating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-lg font-medium">
                Validating registration link...
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Please wait while we verify your registration details.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-center">
              Invalid Registration Link
            </CardTitle>
            <CardDescription className="text-center">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center mb-4">
              This registration link may have expired, been used, or is invalid.
              Please contact your administrator for a new registration link.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="w-full"
              variant="outline"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (step === "complete") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">
              Registration Complete!
            </CardTitle>
            <CardDescription className="text-center">
              Your account has been created successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                A welcome email has been sent to your email address with
                additional information about getting started.
              </p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Redirecting you to onboarding...
            </p>
            <Button
              onClick={() => router.push("/onboarding")}
              className="w-full"
            >
              Continue to Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Registration form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Complete Your Registration
          </h1>
          <p className="text-muted-foreground">
            Review your details and set up your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Organization Information */}
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>
                  Review and update your organization details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormDescription>
                        Organization name cannot be changed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="organizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="law_firm">Law Firm</SelectItem>
                            <SelectItem value="enterprise">
                              Enterprise
                            </SelectItem>
                            <SelectItem value="channel_partner">
                              Channel Partner
                            </SelectItem>
                            <SelectItem value="government">
                              Government
                            </SelectItem>
                            <SelectItem value="nonprofit">
                              Non-profit
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Organization type cannot be changed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Industry cannot be changed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="teamSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-10">1-10</SelectItem>
                          <SelectItem value="11-50">11-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="201-1000">201-1000</SelectItem>
                          <SelectItem value="1000+">1000+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Team size cannot be changed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Your Account */}
            <Card>
              <CardHeader>
                <CardTitle>Your Account</CardTitle>
                <CardDescription>
                  Set up your user profile and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          First name cannot be changed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Last name cannot be changed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" disabled />
                      </FormControl>
                      <FormDescription>Email cannot be changed</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="johndoe" disabled />
                      </FormControl>
                      <FormDescription>
                        Username cannot be changed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Chief Compliance Officer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Min 8 chars, include uppercase, lowercase, number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Add Team Members</CardTitle>
                <CardDescription>
                  Add at least one team member to your organization (Required)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {form.watch("teamMembers").map((_, index) => (
                  <div
                    key={index}
                    className="space-y-4 p-4 border rounded-lg relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Team Member {index + 1}</h4>
                      {form.watch("teamMembers").length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTeamMember(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`teamMembers.${index}.firstName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`teamMembers.${index}.lastName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`teamMembers.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`teamMembers.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="org_admin">
                                Organization Admin
                              </SelectItem>
                              <SelectItem value="org_manager">
                                Organization Manager
                              </SelectItem>
                              <SelectItem value="org_analyst">
                                Organization Analyst
                              </SelectItem>
                              <SelectItem value="org_viewer">
                                Organization Viewer
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addTeamMember}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Team Member
                </Button>
              </CardContent>
            </Card>

            {/* Submit */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Your Account...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  By completing registration, you agree to our Terms of Service
                  and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg font-medium">Loading registration...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
