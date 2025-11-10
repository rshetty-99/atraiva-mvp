"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberForm } from "@/components/admin/MemberForm";
import {
  MemberFormValues,
  OrganizationOption,
  RoleOption,
} from "@/lib/validators/member";
import { toast } from "sonner";
import { Loader2, Shield, UserPlus } from "lucide-react";
import { format } from "date-fns";

type OrgMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  organizationId?: string | null;
  organizationName?: string | null;
  createdAt?: string | Date;
  lastSignInAt?: string | Date | null;
  phone?: string;
  allowDashboardAccess?: boolean;
  requireMfa?: boolean;
};

const roleOptions: RoleOption[] = [
  { value: "org_admin", label: "Organization Admin" },
  { value: "org_manager", label: "Organization Manager" },
  { value: "org_user", label: "Organization User" },
  { value: "org_viewer", label: "Organization Viewer" },
];

const INVITED_STATUSES = new Set(["invited", "pending"]);

const statusBadge = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "invited":
    case "pending":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "updated":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "suspended":
    case "inactive":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

export default function OrgUsersPage() {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    invited: number;
    admins: number;
  }>({ total: 0, active: 0, invited: 0, admins: 0 });
  const [organizationOption, setOrganizationOption] = useState<
    OrganizationOption | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [dialogState, setDialogState] = useState<{
    mode: "create" | "edit";
    open: boolean;
    member?: OrgMember | null;
  }>({ mode: "create", open: false, member: null });
  const [deleteState, setDeleteState] = useState<{
    open: boolean;
    member: OrgMember | null;
    submitting: boolean;
  }>({ open: false, member: null, submitting: false });
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch("/api/org/organization");
        if (!response.ok) return;
        const data = await response.json();
        if (data.organization) {
          setOrganizationOption({
            value: data.organization.id,
            label: data.organization.name,
          });
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };

    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/org/members");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load members");
        }
        const data = await response.json();
        setMembers(data.members || []);
        setStats(data.stats || { total: 0, active: 0, invited: 0, admins: 0 });
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load members"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
    fetchMembers();
  }, []);

  const organizationOptions = useMemo(
    () => (organizationOption ? [organizationOption] : []),
    [organizationOption]
  );

  const closeDialog = () =>
    setDialogState((state) => ({ ...state, open: false, member: null }));

  const refreshMembers = async () => {
    try {
      const response = await fetch("/api/org/members");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load members");
      }
      const data = await response.json();
      setMembers(data.members || []);
      setStats(data.stats || { total: 0, active: 0, invited: 0, admins: 0 });
    } catch (error) {
      console.error("Error refreshing members:", error);
    }
  };

  const handleSubmit = async (values: MemberFormValues) => {
    try {
      setSubmitting(true);
      const method = dialogState.mode === "create" ? "POST" : "PUT";
      const endpoint =
        dialogState.mode === "create"
          ? "/api/org/members"
          : `/api/org/members/${dialogState.member?.id}`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save member");
      }

      toast.success(
        dialogState.mode === "create"
          ? "Invitation sent"
          : "Member updated successfully"
      );
      closeDialog();
      await refreshMembers();
    } catch (error) {
      console.error("Error saving member:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save member"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteState.member) return;
    try {
      setDeleteState((state) => ({ ...state, submitting: true }));
      const response = await fetch(
        `/api/org/members/${deleteState.member.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove member");
      }
      toast.success("Member removed");
      setDeleteState({ open: false, member: null, submitting: false });
      await refreshMembers();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to remove member"
      );
      setDeleteState((state) => ({ ...state, submitting: false }));
    }
  };

  const handleResend = async (member: OrgMember) => {
    try {
      setResendingId(member.id);
      const response = await fetch(`/api/org/members/${member.id}/resend`, {
        method: "POST",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to resend invitation");
      }
      toast.success(`Invitation resent to ${member.email}`);
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to resend invitation"
      );
    } finally {
      setResendingId(null);
    }
  };

  const selectedMemberDefaults =
    dialogState.member && dialogState.mode === "edit"
      ? ({
          firstName: dialogState.member.firstName,
          lastName: dialogState.member.lastName,
          email: dialogState.member.email,
          role: dialogState.member.role,
          status: dialogState.member.status,
          organizationId: dialogState.member.organizationId || "",
          department: "",
          jobTitle: "",
          phone: dialogState.member.phone || "",
          metadata: "",
          sendInvite: false,
          requireMfa: dialogState.member.requireMfa ?? false,
          allowDashboardAccess:
            dialogState.member.allowDashboardAccess ?? true,
        } as MemberFormValues)
      : undefined;

  return (
    <div
      className="w-full min-h-[calc(100vh-140px)] p-4 sm:p-6 md:p-8"
      style={{ marginTop: "140px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Organization Members
            </h1>
            <p className="text-muted-foreground">
              Invite, manage, and monitor members of your organization.
            </p>
          </div>
          <Button
            onClick={() =>
              setDialogState({ mode: "create", open: true, member: null })
            }
            className="gap-2"
            disabled={!organizationOption}
          >
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Members
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {stats.total}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-green-500">
              {stats.active}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Invites
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-blue-500">
              {stats.invited}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Admins
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-orange-500">
              {stats.admins}
            </CardContent>
          </Card>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Team Members
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <p>Loading organization members…</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Shield className="h-8 w-8" />
                        <p>No members yet. Invite teammates to collaborate.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.id} className="border-border">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {member.firstName} {member.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {member.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusBadge(member.status)}
                        >
                          {member.status.replace(/_/g, " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.role.replace("org_", "")}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.lastSignInAt
                          ? format(new Date(member.lastSignInAt), "MMM dd, yyyy")
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {INVITED_STATUSES.has(member.status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={resendingId === member.id}
                              onClick={() => handleResend(member)}
                            >
                              {resendingId === member.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Resend Invite"
                              )}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setDialogState({
                                mode: "edit",
                                open: true,
                                member,
                              })
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              setDeleteState({
                                open: true,
                                member,
                                submitting: false,
                              })
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>

      <Dialog
        open={dialogState.open}
        onOpenChange={(open) =>
          setDialogState((state) => ({ ...state, open }))
        }
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogState.mode === "create"
                ? "Invite Member"
                : "Update Member"}
            </DialogTitle>
          </DialogHeader>
          <MemberForm
            defaultValues={selectedMemberDefaults}
            onSubmit={handleSubmit}
            onCancel={closeDialog}
            isSubmitting={submitting}
            mode={dialogState.mode}
            roleOptions={roleOptions}
            organizationOptions={organizationOptions}
            requireOrganization
            allowMetadata={false}
            showStatusField={dialogState.mode === "edit"}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteState.open}
        onOpenChange={(open) =>
          setDeleteState((state) => ({
            ...state,
            open,
            member: open ? state.member : null,
            submitting: open ? state.submitting : false,
          }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member</AlertDialogTitle>
            <AlertDialogDescription>
              This will revoke access for{" "}
              <span className="font-medium">
                {deleteState.member?.firstName} {deleteState.member?.lastName}
              </span>
              . They can be invited again later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteState.submitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteState.submitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteState.submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

