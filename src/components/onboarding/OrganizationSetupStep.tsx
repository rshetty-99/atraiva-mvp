"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  ArrowLeft,
  Building,
  Users,
  Globe,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Key,
  User,
} from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormFields";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface OrganizationSetupStepProps {
  data: any;
  onDataUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  registrationToken?: string | null;
}

const organizationSchema = z.object({
  // User account fields
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  jobTitle: z.string().min(1, "Job title is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),

  // Organization fields
  organizationName: z.string().min(1, "Organization name is required"),
  organizationType: z.string().min(1, "Organization type is required"),
  industry: z.string().min(1, "Industry is required"),
  teamSize: z.string().min(1, "Team size is required"),
  website: z
    .string()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Please enter a valid ZIP code"),
  country: z.string().min(1, "Country is required"),
  description: z.string().optional(),
});

const organizationTypes = [
  {
    value: "law_firm",
    label: "Law Firm",
    description: "Legal practice specializing in cybersecurity",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Large corporation with compliance needs",
  },
  {
    value: "channel_partner",
    label: "Channel Partner",
    description: "Reseller or consulting partner",
  },
  {
    value: "government",
    label: "Government Agency",
    description: "Federal, state, or local government",
  },
  {
    value: "nonprofit",
    label: "Non-Profit",
    description: "Non-profit organization",
  },
  { value: "other", label: "Other", description: "Other organization type" },
];

const industries = [
  "Financial services",
  "Health care",
  "Hospitality",
  "Technology",
];

const teamSizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
];

const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
];

export default function OrganizationSetupStep({
  data,
  onDataUpdate,
  onNext,
  onPrevious,
  isFirstStep,
}: OrganizationSetupStepProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      // User fields
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      jobTitle: data.jobTitle || "",
      username: data.username || "",
      password: data.password || "",

      // Organization fields
      organizationName: data.organizationName || "",
      organizationType: data.organizationType || "",
      industry: data.industry || "",
      teamSize: data.teamSize || "",
      website: data.website || "",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      zipCode: data.zipCode || "",
      country: data.country || "United States",
      description: data.description || "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    watch,
    control,
    reset,
  } = form;
  const watchedValues = watch();

  // Update form values when data prop changes (e.g., from registration link)
  React.useEffect(() => {
    console.log("OrganizationSetupStep: Updating form with data:", {
      state: data.state,
      city: data.city,
      address: data.address,
    });

    reset({
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      jobTitle: data.jobTitle || "",
      username: data.username || "",
      password: data.password || "",
      organizationName: data.organizationName || "",
      organizationType: data.organizationType || "",
      industry: data.industry || "",
      teamSize: data.teamSize || "",
      website: data.website || "",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      zipCode: data.zipCode || "",
      country: data.country || "United States",
      description: data.description || "",
    });
  }, [data, reset]);

  const steps = [
    {
      title: "Personal Information",
      description: "Tell us about yourself",
      fields: [
        "firstName",
        "lastName",
        "email",
        "jobTitle",
        "username",
        "password",
      ],
    },
    {
      title: "Organization Details",
      description: "Tell us about your organization",
      fields: ["organizationName", "organizationType", "industry", "teamSize"],
    },
    {
      title: "Contact Details",
      description: "Organization contact information",
      fields: [
        "website",
        "phone",
        "address",
        "city",
        "state",
        "zipCode",
        "country",
      ],
    },
    {
      title: "Additional Details",
      description: "Any additional information?",
      fields: ["description"],
    },
  ];

  const onSubmit = (formData: any) => {
    onDataUpdate(formData);
    onNext();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onPrevious();
    }
  };

  const currentStepData = steps[currentStep];

  // Define which fields are actually required for each step
  const requiredFieldsByStep = {
    0: ["firstName", "lastName", "email", "jobTitle"], // Personal Information
    1: ["organizationName", "organizationType", "industry", "teamSize"], // Organization Details
    2: ["address", "city", "state", "zipCode", "country"], // Contact Details (website and phone are optional)
    3: [], // Additional Details (description is optional)
  };

  const requiredFields = requiredFieldsByStep[currentStep] || [];
  const isStepValid = requiredFields.every(
    (field) => watchedValues[field] && watchedValues[field].length > 0
  );

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 ${
                  index < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {currentStepData.title}
        </h3>
        <p className="text-muted-foreground">{currentStepData.description}</p>
      </div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <FormProvider {...form}>
              <div className="space-y-6">
                {/* Personal Information Step */}
                {currentStep === 0 && control && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="firstName"
                        label="First Name"
                        placeholder="Enter your first name"
                        icon={Users}
                        control={control}
                        required
                      />

                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="lastName"
                        label="Last Name"
                        placeholder="Enter your last name"
                        icon={Users}
                        control={control}
                        required
                      />
                    </div>

                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      icon={Mail}
                      control={control}
                      required
                    />

                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="jobTitle"
                      label="Job Title"
                      placeholder="Enter your job title"
                      icon={Building}
                      control={control}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="username"
                        label="Username"
                        placeholder="Enter your username"
                        icon={User}
                        control={control}
                        required
                      />

                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        icon={Key}
                        control={control}
                        inputType="password"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Organization Details Step */}
                {currentStep === 1 && control && (
                  <div className="space-y-6">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="organizationName"
                      label="Organization Name"
                      placeholder="Enter your organization name"
                      icon={Building}
                      control={control}
                      required
                    />

                    <div className="space-y-2">
                      <Label
                        htmlFor="organizationType"
                        className="required-asterisk"
                      >
                        Organization Type
                      </Label>
                      <Select
                        value={watchedValues.organizationType}
                        onValueChange={(value) =>
                          form.setValue("organizationType", value)
                        }
                      >
                        <SelectTrigger className="min-h-[60px] h-auto py-3">
                          <SelectValue placeholder="Select organization type">
                            {watchedValues.organizationType && (
                              <div className="text-left">
                                <div className="font-medium">
                                  {
                                    organizationTypes.find(
                                      (type) =>
                                        type.value ===
                                        watchedValues.organizationType
                                    )?.label
                                  }
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {
                                    organizationTypes.find(
                                      (type) =>
                                        type.value ===
                                        watchedValues.organizationType
                                    )?.description
                                  }
                                </div>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {organizationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="text-foreground">
                                <div className="font-medium">{type.label}</div>
                                <div className="text-sm text-muted-foreground">
                                  {type.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.organizationType && (
                        <p className="text-sm text-red-600">
                          {errors.organizationType.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry" className="required-asterisk">
                        Industry
                      </Label>
                      <Select
                        value={watchedValues.industry}
                        onValueChange={(value) =>
                          form.setValue("industry", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              <span className="text-foreground">
                                {industry}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.industry && (
                        <p className="text-sm text-red-600">
                          {errors.industry.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teamSize" className="required-asterisk">
                        Team Size
                      </Label>
                      <Select
                        value={watchedValues.teamSize}
                        onValueChange={(value) =>
                          form.setValue("teamSize", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamSizes.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              <span className="text-foreground">
                                {size.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.teamSize && (
                        <p className="text-sm text-red-600">
                          {errors.teamSize.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Details Step */}
                {currentStep === 2 && control && (
                  <div className="space-y-6">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="website"
                      label="Website"
                      placeholder="https://your-organization.com"
                      icon={Globe}
                      control={control}
                    />

                    <CustomFormField
                      fieldType={FormFieldType.PHONE_INPUT}
                      name="phone"
                      label="Phone Number"
                      placeholder="+1 (555) 123-4567"
                      icon={Phone}
                      control={control}
                    />

                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="address"
                      label="Street Address"
                      placeholder="123 Main Street"
                      icon={MapPin}
                      control={control}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="city"
                        label="City"
                        placeholder="New York"
                        control={control}
                        required
                      />

                      <div className="space-y-2">
                        <Label htmlFor="state" className="required-asterisk">
                          State
                        </Label>
                        <Select
                          value={watchedValues.state || undefined}
                          onValueChange={(value) => {
                            form.setValue("state", value);
                            onDataUpdate({ state: value });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state">
                              {watchedValues.state || "Select state"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {usStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                <span className="text-foreground">{state}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.state && (
                          <p className="text-sm text-red-600">
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="zipCode"
                        label="ZIP Code"
                        placeholder="10001"
                        control={control}
                        required
                      />

                      <div className="space-y-2">
                        <Label htmlFor="country" className="required-asterisk">
                          Country
                        </Label>
                        <Select
                          value={watchedValues.country}
                          onValueChange={(value) =>
                            form.setValue("country", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country">
                              {watchedValues.country && (
                                <span className="text-foreground">
                                  {watchedValues.country}
                                </span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">
                              <span className="text-foreground">
                                United States
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.country && (
                          <p className="text-sm text-red-600">
                            {errors.country.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Details Step */}
                {currentStep === 3 && control && (
                  <div className="space-y-6">
                    <CustomFormField
                      fieldType={FormFieldType.TEXTAREA}
                      name="description"
                      label="Organization Description"
                      placeholder="Tell us about your organization's mission, focus areas, or any specific compliance needs..."
                      control={control}
                    />

                    <div className="bg-muted/50 border border-border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium text-foreground">
                            Almost Done!
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your organization information will be used to
                            customize your dashboard and ensure you have access
                            to the right compliance tools for your industry.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FormProvider>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{currentStep === 0 ? "Previous" : "Back"}</span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isStepValid}
          className="flex items-center space-x-2"
        >
          <span>{currentStep === steps.length - 1 ? "Continue" : "Next"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
