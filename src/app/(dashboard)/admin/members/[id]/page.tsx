"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Building2,
  Mail,
  Calendar,
  Shield,
  Activity,
  Loader2,
  Edit,
  Trash2,
  Key,
  Clock,
} from "lucide-react";
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
import { toast } from "sonner";
import { format } from "date-fns";
import { AuditLog } from "@/lib/firestore/types";
import { ActivityLogTimeline } from "@/components/activity-log/ActivityLogTimeline";

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
  organizations: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}

export default function MemberDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [member, setMember] = useState<MemberDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [activityLogs, setActivityLogs] = useState<AuditLog[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);

  useEffect(() => {
    const getMemberId = async () => {
      const resolvedParams = await params;
      setMemberId(resolvedParams.id as string);
    };
    getMemberId();
  }, [params]);

  useEffect(() => {
    if (memberId) {
      fetchMemberDetails();
    }
  }, [memberId]);

  const fetchMemberDetails = async () => {
    if (!memberId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/members/${memberId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch member");
      }

      const data = await response.json();
      setMember(data);
    } catch (error: any) {
      console.error("Error fetching member:", error);
      toast.error(error.message || "Failed to load member details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    if (!memberId) return;

    try {
      setActivityLoading(true);
      setActivityError(null);
      const response = await fetch(
        `/api/admin/members/${memberId}/activity?limit=50`
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
    if (activeTab === "activity" && memberId) {
      fetchActivityLogs();
    }
  }, [activeTab, memberId]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "platform_admin":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "org_admin":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "org_manager":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "org_user":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "org_viewer":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getRoleDisplayName = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">Member not found</p>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/members")}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
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
          onClick={() => router.push("/admin/members")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Members
        </Button>

        {/* Member Header */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden mr-4">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={`${member.firstName} ${member.lastName}`}
                    className="h-16 w-16 object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {member.firstName[0]}
                    {member.lastName[0]}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    {member.firstName} {member.lastName}
                  </h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/admin/members/${member.id}/edit`)
                    }
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge
                  variant="outline"
                  className={`mt-2 ${getRoleBadgeColor(member.role)}`}
                >
                  {getRoleDisplayName(member.role)}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant="outline"
                  className={`mt-2 ${
                    member.isActive
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                  }`}
                >
                  {member.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger
              value="overview"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="organizations"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Building2 className="h-4 w-4" />
              Organizations ({member.organizations?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Activity className="h-4 w-4" />
              Activity Log
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">First Name:</span>
                    <span className="font-medium text-foreground">
                      {member.firstName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Name:</span>
                    <span className="font-medium text-foreground">
                      {member.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-foreground">
                      {member.email}
                    </span>
                  </div>
                  {member.phoneNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium text-foreground">
                        {member.phoneNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Account Information
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono text-xs text-foreground">
                      {member.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="font-medium text-foreground">
                      {format(new Date(member.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Sign In:</span>
                    <span className="font-medium text-foreground">
                      {member.lastSignInAt
                        ? format(
                            new Date(member.lastSignInAt),
                            "MMM dd, yyyy HH:mm"
                          )
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant="outline"
                      className={
                        member.isActive
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                      }
                    >
                      {member.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">
                  Organization Memberships
                </h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-muted/50">
                    <TableHead className="text-foreground font-semibold">
                      Organization
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      Role
                    </TableHead>
                    <TableHead className="text-foreground font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!member.organizations ||
                  member.organizations.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-12 text-muted-foreground"
                      >
                        <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No organization memberships</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    member.organizations.map((org) => (
                      <TableRow
                        key={org.id}
                        className="border-border hover:bg-muted/50 cursor-pointer"
                        onClick={() =>
                          router.push(`/admin/organization/${org.id}`)
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium text-primary hover:underline cursor-pointer transition-all">
                              {org.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getRoleBadgeColor(org.role)}
                          >
                            {getRoleDisplayName(org.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/organization/${org.id}`)
                            }
                          >
                            View Organization
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
              <div className="space-y-4">
                {/* Account Status */}
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div
                    className={`p-2 rounded-lg ${
                      member.isActive ? "bg-green-500/10" : "bg-red-500/10"
                    }`}
                  >
                    <Shield
                      className={`h-5 w-5 ${
                        member.isActive ? "text-green-500" : "text-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      Account Status
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Current account state:{" "}
                      {member.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div
                    className={`p-2 rounded-lg ${
                      member.twoFactorEnabled
                        ? "bg-green-500/10"
                        : "bg-yellow-500/10"
                    }`}
                  >
                    <Key
                      className={`h-5 w-5 ${
                        member.twoFactorEnabled
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Additional security for account access
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Status: {member.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>

                {/* Organization Membership */}
                {member.organizations && member.organizations.length > 0 && (
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        Organization Access
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Member of {member.organizations.length} organization
                        {member.organizations.length > 1 ? "s" : ""}
                      </p>
                      <div className="mt-2 space-y-1">
                        {member.organizations.map((org) => (
                          <p
                            key={org.id}
                            className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                            onClick={() =>
                              router.push(`/admin/organization/${org.id}`)
                            }
                          >
                            • {org.name} (
                            {org.role === "org_admin" ? "Admin" : "Viewer"})
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-red-500/20 rounded-xl p-6 mt-6"
        >
          <h3 className="text-lg font-semibold text-red-500 mb-4">
            Danger Zone
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-foreground">
                Deactivate Member Account
              </p>
              <p className="text-sm text-muted-foreground">
                Suspend access to all organizations and features
              </p>
            </div>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Deactivate
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
