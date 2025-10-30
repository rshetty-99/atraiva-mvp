"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Users as UsersIcon,
  AlertOctagon,
  Activity,
  Loader2,
  Mail,
  Phone,
  Shield,
  Calendar,
  Crown,
  MoreVertical,
  UserPlus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { AuditLog } from "@/lib/firestore/types";
import { ActivityLogTimeline } from "@/components/activity-log/ActivityLogTimeline";
import { InviteMemberDialog } from "@/components/InviteMemberDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";

interface OrganizationMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  role: string;
  createdAt: Date;
  lastSignInAt?: Date;
}

interface OrganizationDetails {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  membersCount: number;
  subscriptionPlan: string;
  subscriptionStatus: string;
  industry: string;
  size: string;
  country: string;
  state?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  description?: string;
  applicableRegulations?: string[];
  settings?: {
    timezone?: string;
    currency?: string;
    locale?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
  createdAt: Date;
  accountOwner?: {
    name: string;
    email: string;
  };
}

export default function OrganizationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;

  const [organization, setOrganization] = useState<OrganizationDetails | null>(
    null
  );
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [activityLogs, setActivityLogs] = useState<AuditLog[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizationDetails();
  }, [organizationId]);

  const fetchOrganizationDetails = async () => {
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
      setMembers(data.members || []);
    } catch (error: any) {
      console.error("Error fetching organization:", error);
      toast.error(error.message || "Failed to load organization details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      setActivityLoading(true);
      setActivityError(null);
      const response = await fetch(
        `/api/admin/organizations/${organizationId}/activity?limit=50`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch activity logs");
      }

      const data = await response.json();
      setActivityLogs(data.activityLogs || []);
    } catch (error: any) {
      console.error("Error fetching activity logs:", error);
      setActivityError(error.message || "Failed to load activity logs");
    } finally {
      setActivityLoading(false);
    }
  };

  // Fetch activity logs when the activity tab is selected
  useEffect(() => {
    if (activeTab === "activity" && organizationId) {
      fetchActivityLogs();
    }
  }, [activeTab, organizationId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "trialing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "past_due":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "canceled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "pro":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "basic":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "free":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "org:admin":
      case "admin":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "org:member":
      case "member":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
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
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/organization")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>

        {/* Organization Header */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mr-4">
                {organization.imageUrl ? (
                  <img
                    src={organization.imageUrl}
                    alt={organization.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    {organization.name}
                  </h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/admin/organization/${organization.id}/edit`)
                    }
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {organization.accountOwner
                    ? `Account Owner: ${organization.accountOwner.name}`
                    : `@${organization.slug}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-2xl font-bold text-foreground">
                  {organization.membersCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Plan</p>
                <Badge
                  variant="outline"
                  className={`text-sm font-bold ${getPlanColor(
                    organization.subscriptionPlan
                  )}`}
                >
                  {organization.subscriptionPlan.toUpperCase()}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant="outline"
                  className={`text-sm ${getStatusColor(
                    organization.subscriptionStatus
                  )}`}
                >
                  {organization.subscriptionStatus
                    .replace("_", " ")
                    .toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <Building2 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <UsersIcon className="h-4 w-4" />
              Users ({members.length})
            </TabsTrigger>
            <TabsTrigger value="incidents" className="gap-2">
              <AlertOctagon className="h-4 w-4" />
              Incidents
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="h-4 w-4" />
              Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Organization Info */}
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Organization Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Industry</p>
                    <p className="font-medium text-foreground">
                      {organization.industry || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Company Size</p>
                    <p className="font-medium text-foreground">
                      {organization.size || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Website</p>
                    <p className="font-medium text-foreground">
                      {organization.website ? (
                        <a
                          href={organization.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {organization.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">
                      {organization.phone || "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium text-foreground">
                      {organization.address && organization.city
                        ? `${organization.address}, ${organization.city}, ${organization.state} ${organization.zipCode}, ${organization.country}`
                        : organization.city
                        ? `${organization.city}, ${organization.state}, ${organization.country}`
                        : organization.country || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">
                      {organization.state
                        ? `${organization.state}, ${organization.country}`
                        : organization.country || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium text-foreground">
                      {format(new Date(organization.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                  {organization.description && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Description</p>
                      <p className="font-medium text-foreground">
                        {organization.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscription Details */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Subscription Details
                </h3>
                <div className="text-sm space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <Badge
                      variant="outline"
                      className={getPlanColor(organization.subscriptionPlan)}
                    >
                      {organization.subscriptionPlan.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant="outline"
                      className={getStatusColor(
                        organization.subscriptionStatus
                      )}
                    >
                      {organization.subscriptionStatus
                        .replace("_", " ")
                        .toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Signed Up:</span>
                    <span className="font-medium">
                      {format(new Date(organization.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance & Settings Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Applicable Regulations */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Applicable Regulations
                </h3>
                <div className="space-y-2">
                  {organization.applicableRegulations &&
                  organization.applicableRegulations.length > 0 ? (
                    organization.applicableRegulations.map((reg: string) => (
                      <Badge
                        key={reg}
                        variant="outline"
                        className="mr-2 mb-2 bg-primary/10 text-primary border-primary/20"
                      >
                        {reg}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No regulations configured
                    </p>
                  )}
                </div>
              </div>

              {/* Settings */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Settings</h3>
                <div className="text-sm space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timezone:</span>
                    <span className="font-medium text-foreground">
                      {organization.settings?.timezone || "UTC"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Locale:</span>
                    <span className="font-medium text-foreground">
                      {organization.settings?.locale || "en-US"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Email Notifications:
                    </span>
                    <Badge
                      variant={
                        organization.settings?.notifications?.email
                          ? "default"
                          : "secondary"
                      }
                    >
                      {organization.settings?.notifications?.email
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      SMS Notifications:
                    </span>
                    <Badge
                      variant={
                        organization.settings?.notifications?.sms
                          ? "default"
                          : "secondary"
                      }
                    >
                      {organization.settings?.notifications?.sms
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-semibold">Organization Members</h3>
                <InviteMemberDialog
                  organizationId={organizationId}
                  organizationName={organization.name}
                  onInviteSent={fetchOrganizationDetails}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-muted/50">
                    <TableHead className="text-foreground font-semibold">
                      User
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      Role
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      Joined
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      Last Sign In
                    </TableHead>
                    <TableHead className="text-foreground font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-muted-foreground"
                      >
                        <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No members found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    members.map((member) => (
                      <TableRow
                        key={member.id}
                        className="border-border hover:bg-muted/50 cursor-pointer"
                        onClick={() =>
                          router.push(`/admin/members/${member.id}`)
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden">
                              {member.imageUrl ? (
                                <img
                                  src={member.imageUrl}
                                  alt={`${member.firstName} ${member.lastName}`}
                                  className="w-10 h-10 object-cover"
                                />
                              ) : (
                                <span className="text-primary font-semibold">
                                  {member.firstName[0]}
                                  {member.lastName[0]}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-primary hover:underline cursor-pointer">
                                {member.firstName} {member.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getRoleBadgeColor(member.role)}
                          >
                            {member.role.replace("org:", "").toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(member.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {member.lastSignInAt
                            ? format(
                                new Date(member.lastSignInAt),
                                "MMM dd, yyyy"
                              )
                            : "Never"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Role
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents">
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <AlertOctagon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">No incidents reported</p>
            </div>
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity">
            <ActivityLogTimeline
              logs={activityLogs}
              loading={activityLoading}
              error={activityError}
              onRefresh={fetchActivityLogs}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
