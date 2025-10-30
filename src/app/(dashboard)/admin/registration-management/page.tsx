"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useSession } from "@/hooks/useSession";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  MoreVertical,
  Search,
  Link2,
  Mail,
  Ban,
  Trash2,
  RefreshCw,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { RegistrationLink } from "@/lib/firestore/types";

export default function RegistrationManagementPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const { session } = useSession();
  const [links, setLinks] = useState<RegistrationLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<RegistrationLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLink, setSelectedLink] = useState<RegistrationLink | null>(
    null
  );
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [linksFetched, setLinksFetched] = useState(false);
  const permissionCheckedRef = useRef(false);

  // Check permissions - only run when session is valid and loaded
  useEffect(() => {
    console.log("Registration Management - isLoaded:", isLoaded);
    console.log("Registration Management - session:", session);

    // Wait for session to be valid and loaded before proceeding
    if (!isLoaded || !session) {
      console.log("Registration Management - Waiting for session to load...");
      return;
    }

    // Only check permissions once
    if (permissionCheckedRef.current) {
      console.log("Registration Management - Permissions already checked");
      return;
    }

    // Mark as checked immediately to prevent multiple runs
    permissionCheckedRef.current = true;

    const role = session.currentOrganization?.role;
    console.log("Registration Management - User role:", role);
    console.log(
      "Registration Management - Session currentOrganization:",
      session.currentOrganization
    );
    console.log("Registration Management - Session user:", session.user);

    if (role !== "super_admin" && role !== "platform_admin") {
      console.log(
        "Registration Management - Insufficient permissions, redirecting. Role:",
        role
      );
      toast.error(`Insufficient permissions. Role: ${role || "undefined"}`);
      router.push("/dashboard");
    } else {
      console.log("Registration Management - Access granted for role:", role);
    }

    setPermissionChecked(true);
  }, [isLoaded, session, router]);

  // Fetch registration links only after permission check passes
  useEffect(() => {
    if (
      isLoaded &&
      session &&
      session.currentOrganization?.role &&
      !linksFetched
    ) {
      const role = session.currentOrganization.role;
      if (role === "super_admin" || role === "platform_admin") {
        console.log("Registration Management - Fetching links for role:", role);
        fetchLinks();
        setLinksFetched(true);
      }
    }
  }, [isLoaded, session, linksFetched]);

  // Filter links
  useEffect(() => {
    let filtered = links;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((link) => link.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (link) =>
          link.organizationData.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          link.primaryUserData.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          link.primaryUserData.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          link.primaryUserData.lastName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLinks(filtered);
  }, [links, searchTerm, statusFilter]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      console.log("Fetching registration links...");

      const response = await fetch("/api/registration-links", {
        credentials: "include", // Ensure cookies are sent
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `Failed to fetch registration links: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Registration links data:", data);
      setLinks(data.links || []);
    } catch (error) {
      console.error("Error fetching links:", error);
      toast.error("Failed to load registration links");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async (linkId: string) => {
    try {
      const response = await fetch(`/api/registration-links/${linkId}/resend`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to resend email");
      }

      toast.success("Registration email resent successfully");
      fetchLinks();
    } catch (error: unknown) {
      console.error("Error resending email:", error);
      toast.error((error as Error).message || "Failed to resend email");
    }
  };

  const handleCopyLink = (token: string) => {
    const baseUrl = window.location.origin;
    const registrationUrl = `${baseUrl}/register?token=${token}`;

    navigator.clipboard.writeText(registrationUrl);
    toast.success("Registration link copied to clipboard");
  };

  const handleCancelLink = async () => {
    if (!selectedLink) return;

    try {
      const response = await fetch(
        `/api/registration-links/${selectedLink.id}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: cancellationReason }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel link");
      }

      toast.success("Registration link cancelled successfully");
      setCancelDialogOpen(false);
      setCancellationReason("");
      setSelectedLink(null);
      fetchLinks();
    } catch (error: unknown) {
      console.error("Error cancelling link:", error);
      toast.error((error as Error).message || "Failed to cancel link");
    }
  };

  const handleDeleteLink = async () => {
    if (!selectedLink) return;

    try {
      const response = await fetch(
        `/api/registration-links/${selectedLink.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete link");
      }

      toast.success("Registration link deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedLink(null);
      fetchLinks();
    } catch (error: unknown) {
      console.error("Error deleting link:", error);
      toast.error((error as Error).message || "Failed to delete link");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: React.ComponentType<{ className?: string }>;
      }
    > = {
      pending: { variant: "secondary", icon: Clock },
      sent: { variant: "default", icon: Send },
      used: { variant: "default", icon: CheckCircle2 },
      expired: { variant: "destructive", icon: XCircle },
      cancelled: { variant: "outline", icon: Ban },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date: unknown) => {
    if (!date) return "N/A";

    let d: Date;

    // Handle Firestore Timestamp objects
    if (
      date &&
      typeof date === "object" &&
      "seconds" in date &&
      typeof (date as Record<string, unknown>).seconds === "number"
    ) {
      d = new Date(
        ((date as Record<string, unknown>).seconds as number) * 1000
      );
    } else if (
      date &&
      typeof date === "object" &&
      "toDate" in date &&
      typeof (date as Record<string, unknown>).toDate === "function"
    ) {
      // Handle Firestore Timestamp with toDate method
      d = ((date as Record<string, unknown>).toDate as () => Date)();
    } else if (date instanceof Date) {
      d = date;
    } else if (typeof date === "string" || typeof date === "number") {
      d = new Date(date);
    } else {
      return "Invalid Date";
    }

    // Check if date is valid
    if (isNaN(d.getTime())) {
      return "Invalid Date";
    }

    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const isExpired = (expiresAt: unknown) => {
    if (!expiresAt) return false;

    let expiry: Date;

    // Handle Firestore Timestamp objects
    if (
      expiresAt &&
      typeof expiresAt === "object" &&
      "seconds" in expiresAt &&
      typeof (expiresAt as Record<string, unknown>).seconds === "number"
    ) {
      expiry = new Date(
        ((expiresAt as Record<string, unknown>).seconds as number) * 1000
      );
    } else if (
      expiresAt &&
      typeof expiresAt === "object" &&
      "toDate" in expiresAt &&
      typeof (expiresAt as Record<string, unknown>).toDate === "function"
    ) {
      // Handle Firestore Timestamp with toDate method
      expiry = ((expiresAt as Record<string, unknown>).toDate as () => Date)();
    } else if (expiresAt instanceof Date) {
      expiry = expiresAt;
    } else if (typeof expiresAt === "string" || typeof expiresAt === "number") {
      expiry = new Date(expiresAt);
    } else {
      return false;
    }

    return expiry < new Date();
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" style={{ marginTop: "140px" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Registration Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage organization registration links
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/registration-management/create")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Registration Link
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by organization or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                onClick={() => setStatusFilter("pending")}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "sent" ? "default" : "outline"}
                onClick={() => setStatusFilter("sent")}
                size="sm"
              >
                Sent
              </Button>
              <Button
                variant={statusFilter === "used" ? "default" : "outline"}
                onClick={() => setStatusFilter("used")}
                size="sm"
              >
                Used
              </Button>
              <Button
                variant={statusFilter === "expired" ? "default" : "outline"}
                onClick={() => setStatusFilter("expired")}
                size="sm"
              >
                Expired
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Links ({filteredLinks.length})</CardTitle>
          <CardDescription>
            Manage all organization registration links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Primary User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-8"
                  >
                    No registration links found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">
                      {link.organizationData.name}
                    </TableCell>
                    <TableCell>
                      {link.primaryUserData.firstName}{" "}
                      {link.primaryUserData.lastName}
                    </TableCell>
                    <TableCell>{link.primaryUserData.email}</TableCell>
                    <TableCell>{getStatusBadge(link.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(link.createdAt)}
                    </TableCell>
                    <TableCell
                      className={`text-sm ${
                        isExpired(link.expiresAt)
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatDate(link.expiresAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleCopyLink(link.token)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          {(link.status === "pending" ||
                            link.status === "sent") &&
                            !isExpired(link.expiresAt) && (
                              <DropdownMenuItem
                                onClick={() => handleResendEmail(link.id)}
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Resend Email
                              </DropdownMenuItem>
                            )}
                          {link.status !== "used" &&
                            link.status !== "cancelled" && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedLink(link);
                                  setCancelDialogOpen(true);
                                }}
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Cancel Link
                              </DropdownMenuItem>
                            )}
                          {link.status !== "used" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedLink(link);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Registration Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this registration link? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason (Optional)</label>
              <Input
                placeholder="Enter cancellation reason..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleCancelLink}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Registration Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this registration link? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLink}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
