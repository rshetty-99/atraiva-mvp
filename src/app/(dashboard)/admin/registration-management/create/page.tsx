"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useSession } from "@/hooks/useSession";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Save,
  CheckCircle,
  Building,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

// Form validation schema
const formSchema = z.object({
  // Organization Data
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
  subscriptionPlan: z.enum(["free", "basic", "pro", "enterprise"]).optional(),

  // Optional Organization Fields
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),

  // Primary User Data
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
  phoneNumber: z.string().optional(),
  jobTitle: z.string().optional(),
  role: z.string().min(1, "Role is required"),

  // Additional Fields
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
  sendEmail: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Industry options from onboarding
const industries = [
  "Financial services",
  "Health care",
  "Hospitality",
  "Technology",
  "Manufacturing",
  "Retail",
  "Education",
  "Government",
  "Non-profit",
  "Legal",
  "Real Estate",
  "Transportation",
  "Energy",
  "Media",
  "Other",
];

// Step configuration
const steps = [
  {
    id: "organization",
    title: "Organization Information",
    description: "Basic organization details",
    icon: Building,
  },
  {
    id: "address",
    title: "Address Details",
    description: "Organization location information",
    icon: MapPin,
  },
  {
    id: "user",
    title: "Primary User",
    description: "Contact person details",
    icon: Users,
  },
  {
    id: "additional",
    title: "Additional Information",
    description: "Payment and admin notes",
    icon: CheckCircle,
  },
];

export default function CreateRegistrationLinkPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      organizationType: "enterprise",
      industry: "",
      teamSize: "1-10",
      subscriptionPlan: "basic",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      website: "",
      phone: "",
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      phoneNumber: "",
      jobTitle: "",
      role: "org_admin",
      paymentReference: "",
      notes: "",
      sendEmail: true,
    },
  });

  const {
    watch,
    formState: { errors },
  } = form;
  const watchedValues = watch();
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Check permissions
  useEffect(() => {
    if (isLoaded && session) {
      const role = session.currentOrganization?.role;
      if (role !== "super_admin" && role !== "platform_admin") {
        toast.error("Insufficient permissions");
        router.push("/dashboard");
      }
    }
  }, [isLoaded, session, router]);

  // Step navigation functions
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step validation
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Organization
        return (
          watchedValues.organizationName &&
          watchedValues.organizationType &&
          watchedValues.industry &&
          watchedValues.teamSize
        );
      case 1: // Address
        return (
          watchedValues.street &&
          watchedValues.city &&
          watchedValues.state &&
          watchedValues.zipCode &&
          watchedValues.country
        );
      case 2: // User
        return (
          watchedValues.firstName &&
          watchedValues.lastName &&
          watchedValues.email &&
          watchedValues.username &&
          watchedValues.role
        );
      case 3: // Additional
        return true; // All fields optional
      default:
        return false;
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      // Prepare organization data
      const organizationData = {
        name: values.organizationName,
        organizationType: values.organizationType,
        industry: values.industry,
        teamSize: values.teamSize,
        subscriptionPlan: values.subscriptionPlan,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country,
        },
        website: values.website,
        phone: values.phone,
      };

      // Prepare primary user data
      const primaryUserData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        username: values.username,
        phoneNumber: values.phoneNumber,
        jobTitle: values.jobTitle,
        role: values.role,
      };

      // Create registration link
      const response = await fetch("/api/registration-links/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationData,
          primaryUserData,
          paymentReference: values.paymentReference,
          notes: values.notes,
          sendEmail: values.sendEmail,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create registration link");
      }

      const data = await response.json();

      if (data.emailSent) {
        toast.success("Registration link created and email sent successfully!");
      } else {
        toast.success("Registration link created successfully!");
        if (data.emailError) {
          toast.warning(`Email delivery failed: ${data.emailError}`);
        }
      }

      // Redirect back to list
      router.push("/admin/registration-management");
    } catch (error: unknown) {
      console.error("Error creating registration link:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create registration link";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  if (!isLoaded || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
      style={{ marginTop: "140px" }}
    >
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Create Registration Link
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create a new organization registration link
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {steps[currentStep].title}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-lg border-0 bg-card/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
                    {React.createElement(steps[currentStep].icon, {
                      className: "h-8 w-8 text-white",
                    })}
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {steps[currentStep].title}
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground">
                    {steps[currentStep].description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <Form {...form}>
                    <div className="space-y-6">
                      {/* Step 1: Organization Information */}
                      {currentStep === 0 && (
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="organizationName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organization Name *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Acme Corporation"
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
                              name="organizationType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Organization Type *</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="law_firm">
                                        Law Firm
                                      </SelectItem>
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
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="industry"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Industry *</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select industry" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {industries.map((industry) => (
                                        <SelectItem
                                          key={industry}
                                          value={industry}
                                        >
                                          {industry}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="teamSize"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Team Size *</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select size" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="1-10">1-10</SelectItem>
                                      <SelectItem value="11-50">
                                        11-50
                                      </SelectItem>
                                      <SelectItem value="51-200">
                                        51-200
                                      </SelectItem>
                                      <SelectItem value="201-1000">
                                        201-1000
                                      </SelectItem>
                                      <SelectItem value="1000+">
                                        1000+
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="subscriptionPlan"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subscription Plan</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select plan" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="free">Free</SelectItem>
                                      <SelectItem value="basic">
                                        Basic
                                      </SelectItem>
                                      <SelectItem value="pro">Pro</SelectItem>
                                      <SelectItem value="enterprise">
                                        Enterprise
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Optional: For tracking purposes
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="website"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Website</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="https://example.com"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="+1 (555) 123-4567"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 2: Address Details */}
                      {currentStep === 1 && (
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="street"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="123 Main Street"
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
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="San Francisco"
                                      {...field}
                                    />
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
                                  <FormLabel>State/Province *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="CA" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="zipCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP/Postal Code *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="94105" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="United States"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 3: Primary User Information */}
                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                  </FormControl>
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
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Registration link will be sent to this email
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username *</FormLabel>
                                <FormControl>
                                  <Input placeholder="johndoe" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Choose a unique username for the account
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="phoneNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="+1 (555) 123-4567"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="jobTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Job Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="CEO" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Initial Role *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select role" />
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
                                <FormDescription>
                                  Primary user is automatically assigned
                                  Organization Admin role
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {/* Step 4: Additional Information */}
                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="paymentReference"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Payment Reference</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="INV-2024-001"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  External payment receipt or reference number
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Admin Notes</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Internal notes about this registration..."
                                    className="resize-none"
                                    rows={3}
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Internal notes visible only to admins
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="sendEmail"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Send Registration Email</FormLabel>
                                  <FormDescription>
                                    Automatically send registration link to the
                                    user&apos;s email
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={currentStep === 0 ? () => router.back() : handlePrevious}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{currentStep === 0 ? "Cancel" : "Previous"}</span>
            </Button>

            <Button
              onClick={
                currentStep === steps.length - 1
                  ? handleFinalSubmit
                  : handleNext
              }
              disabled={!isStepValid() || loading}
              className="flex items-center space-x-2"
            >
              <span>
                {currentStep === steps.length - 1
                  ? loading
                    ? "Creating..."
                    : "Create Registration Link"
                  : "Next"}
              </span>
              {currentStep === steps.length - 1 ? (
                loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
