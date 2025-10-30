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
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building,
  Handshake,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  BarChart3,
  Settings,
  Eye,
} from "lucide-react";

interface RoleSelectionStepProps {
  data: any;
  onDataUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  registrationToken?: string | null;
}

const userTypes = [
  {
    id: "law_firm",
    title: "Law Firm",
    description:
      "Manage multiple enterprise clients with automated compliance workflows",
    icon: Users,
    color: "blue",
    features: [
      "Multi-client portfolio management",
      "Automated breach notification workflows",
      "Regulatory compliance tracking",
      "Team collaboration tools",
      "Executive reporting dashboards",
    ],
    roles: [
      {
        id: "law_firm_admin",
        name: "Law Firm Admin",
        description: "Full firm management and client oversight",
      },
      {
        id: "law_firm_manager",
        name: "Law Firm Manager",
        description: "Operational management and client coordination",
      },
      {
        id: "law_firm_analyst",
        name: "Law Firm Analyst",
        description: "Data analysis and evidence management",
      },
    ],
  },
  {
    id: "enterprise",
    title: "Enterprise",
    description: "Self-service compliance management for your organization",
    icon: Building,
    color: "green",
    features: [
      "Self-service incident reporting",
      "Real-time compliance monitoring",
      "Department-specific dashboards",
      "Audit trail management",
      "Integration with existing systems",
    ],
    roles: [
      {
        id: "enterprise_admin",
        name: "Enterprise Admin",
        description: "Complete organization control and management",
      },
      {
        id: "enterprise_manager",
        name: "Enterprise Manager",
        description: "Department oversight and incident management",
      },
      {
        id: "enterprise_viewer",
        name: "Enterprise Viewer",
        description: "Read-only access to compliance status",
      },
    ],
  },
  {
    id: "channel_partner",
    title: "Channel Partner",
    description: "White-label platform for managing multiple client accounts",
    icon: Handshake,
    color: "purple",
    features: [
      "White-label customization",
      "Multi-client context switching",
      "Partner-specific analytics",
      "Commission tracking",
      "Custom branding options",
    ],
    roles: [
      {
        id: "channel_partner_admin",
        name: "Channel Partner Admin",
        description: "Partner management and client oversight",
      },
    ],
  },
  {
    id: "platform_admin",
    title: "Platform Administrator",
    description: "System administration and platform oversight",
    icon: Shield,
    color: "red",
    features: [
      "Multi-tenant management",
      "System configuration",
      "Security monitoring",
      "Audit log analysis",
      "Emergency access procedures",
    ],
    roles: [
      {
        id: "super_admin",
        name: "Super Admin",
        description: "Complete platform control and oversight",
      },
      {
        id: "platform_admin",
        name: "Platform Admin",
        description: "Platform operations and support management",
      },
    ],
  },
];

const colorVariants = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400",
    button:
      "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-700 dark:text-green-300",
    icon: "text-green-600 dark:text-green-400",
    button:
      "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-700 dark:text-purple-300",
    icon: "text-purple-600 dark:text-purple-400",
    button:
      "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-300",
    icon: "text-red-600 dark:text-red-400",
    button: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
  },
};

export default function RoleSelectionStep({
  data,
  onDataUpdate,
  onNext,
  onPrevious,
  isFirstStep,
  registrationToken,
}: RoleSelectionStepProps) {
  // Check if data is from a registration link (pre-filled and should be read-only)
  const isFromRegistrationLink = !!registrationToken;

  // Map generic role to type-specific role
  const mapGenericRoleToTypeSpecific = (
    genericRole: string,
    orgType: string
  ): string => {
    if (!genericRole || !orgType) return "";

    // If already type-specific, return as-is
    if (genericRole.startsWith(orgType + "_")) return genericRole;

    // Extract role suffix (admin, manager, analyst, viewer, etc.)
    const roleSuffix = genericRole.replace(/^org_/, "");

    // Map to type-specific role
    return `${orgType}_${roleSuffix}`;
  };

  // Initialize state with properly mapped role
  const initialUserType = data.userType || "";
  const initialRole =
    isFromRegistrationLink && data.role
      ? mapGenericRoleToTypeSpecific(data.role, data.userType)
      : data.role || "";

  const [selectedUserType, setSelectedUserType] = useState(initialUserType);
  const [selectedRole, setSelectedRole] = useState(initialRole);

  // Update selected values when data changes (e.g., registration link loaded)
  React.useEffect(() => {
    console.log("RoleSelectionStep: Updating role with data:", {
      userType: data.userType,
      originalRole: data.role,
      isFromRegistrationLink,
    });

    if (data.userType) {
      setSelectedUserType(data.userType);
    }
    if (data.role) {
      const mappedRole = isFromRegistrationLink
        ? mapGenericRoleToTypeSpecific(data.role, data.userType)
        : data.role;

      console.log("RoleSelectionStep: Mapped role:", {
        from: data.role,
        to: mappedRole,
      });

      setSelectedRole(mappedRole);
    }
  }, [data.userType, data.role, isFromRegistrationLink]);

  const handleUserTypeSelect = (userType: string) => {
    // Don't allow changes if from registration link
    if (isFromRegistrationLink) return;

    setSelectedUserType(userType);
    setSelectedRole(""); // Reset role when user type changes
    onDataUpdate({ userType, role: "" });
  };

  const handleRoleSelect = (role: string) => {
    // Don't allow changes if from registration link
    if (isFromRegistrationLink) return;

    setSelectedRole(role);
    onDataUpdate({ role });
  };

  const handleNext = () => {
    if (selectedUserType && selectedRole) {
      onNext();
    }
  };

  const selectedUserTypeData = userTypes.find(
    (type) => type.id === selectedUserType
  );

  return (
    <div className="space-y-8">
      {/* Information Banner for Registration Link */}
      {isFromRegistrationLink && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Pre-configured by Administrator
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your organization type and role have been set by your
                administrator and cannot be changed during onboarding. If you
                need to modify these settings, please contact your administrator
                after completing the registration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Type Selection */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {isFromRegistrationLink
              ? "Your Organization Type"
              : "What best describes your organization?"}
          </h3>
          <p className="text-muted-foreground">
            {isFromRegistrationLink
              ? "This has been pre-configured by your administrator"
              : "Choose the option that best fits your role and organization type"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userTypes.map((userType, index) => {
            const colors =
              colorVariants[userType.color as keyof typeof colorVariants];
            const isSelected = selectedUserType === userType.id;

            return (
              <motion.div
                key={userType.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className={`transition-all duration-200 ${
                    isFromRegistrationLink
                      ? `${
                          isSelected
                            ? `ring-2 ring-blue-500 ${colors.bg} ${colors.border}`
                            : "opacity-40"
                        } cursor-not-allowed`
                      : `cursor-pointer hover:shadow-md ${
                          isSelected
                            ? `ring-2 ring-blue-500 ${colors.bg} ${colors.border}`
                            : "hover:shadow-sm"
                        }`
                  }`}
                  onClick={() => handleUserTypeSelect(userType.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${colors.bg}`}>
                        {React.createElement(userType.icon, {
                          className: `h-6 w-6 ${colors.icon}`,
                        })}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-foreground">
                          {userType.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {userType.description}
                        </CardDescription>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {userType.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Role Selection */}
      {selectedUserType && selectedUserTypeData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {isFromRegistrationLink
                ? "Your Assigned Role"
                : "Select Your Role"}
            </h3>
            <p className="text-muted-foreground">
              {isFromRegistrationLink
                ? "This role has been assigned by your administrator"
                : "Choose the role that best matches your responsibilities"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedUserTypeData.roles.map((role, index) => {
              const colors =
                colorVariants[
                  selectedUserTypeData.color as keyof typeof colorVariants
                ];
              const isSelected = selectedRole === role.id;

              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className={`transition-all duration-200 ${
                      isFromRegistrationLink
                        ? `${
                            isSelected
                              ? `ring-2 ring-blue-500 ${colors.bg} ${colors.border}`
                              : "opacity-40"
                          } cursor-not-allowed`
                        : `cursor-pointer hover:shadow-md ${
                            isSelected
                              ? `ring-2 ring-blue-500 ${colors.bg} ${colors.border}`
                              : "hover:shadow-sm"
                          }`
                    }`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <CardContent className="p-6">
                      <div className="text-center space-y-3">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colors.bg} mx-auto`}
                        >
                          {role.id.includes("admin") && (
                            <Settings className={`h-6 w-6 ${colors.icon}`} />
                          )}
                          {role.id.includes("manager") && (
                            <BarChart3 className={`h-6 w-6 ${colors.icon}`} />
                          )}
                          {role.id.includes("analyst") && (
                            <Eye className={`h-6 w-6 ${colors.icon}`} />
                          )}
                          {role.id.includes("viewer") && (
                            <Eye className={`h-6 w-6 ${colors.icon}`} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {role.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {role.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-blue-600 mx-auto" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={!selectedUserType || !selectedRole}
          className="flex items-center space-x-2"
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
