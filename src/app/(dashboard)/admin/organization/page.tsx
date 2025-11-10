"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Search,
  Filter,
  Users,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Loader2,
} from "lucide-react";
import { Organization } from "@/lib/firestore/types";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  organizationFormSchema,
  OrganizationFormValues,
} from "@/lib/validators/organization";
import { OrganizationForm } from "@/components/admin/OrganizationForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface EnrichedOrganization extends Organization {
  clerkName?: string;
  clerkSlug?: string;
  membersCount: number;
  imageUrl?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
}

interface OrganizationStats {
  total: number;
  active: number;
  onboarding: number;
  expired: number;
}

export default function OrganizationPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<EnrichedOrganization[]>(
    []
  );
  const [filteredOrgs, setFilteredOrgs] = useState<EnrichedOrganization[]>([]);
  const [stats, setStats] = useState<OrganizationStats>({
    total: 0,
    active: 0,
    onboarding: 0,
    expired: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const filterOrganizations = useCallback(() => {
    let filtered = [...organizations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Plan filter
    if (filterPlan && filterPlan !== "all") {
      filtered = filtered.filter((org) => org.subscription?.plan === filterPlan);
    }

    // Status filter
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter(
        (org) => org.subscription?.status === filterStatus
      );
    }

    setFilteredOrgs(filtered);
  }, [searchTerm, filterPlan, filterStatus, organizations]);

  useEffect(() => {
    filterOrganizations();
  }, [filterOrganizations]);

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/organizations");

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          errorData.details ||
            errorData.error ||
            "Failed to fetch organizations"
        );
      }

      const data = await response.json();
      setOrganizations(data.organizations);
      setFilteredOrgs(data.organizations);
      setStats(
        data.stats || {
          total: data.organizations.length,
          active: 0,
          onboarding: 0,
          expired: 0,
        }
      );
    } catch (error: unknown) {
      console.error("Error fetching organizations:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load organizations";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrganization = async (
    values: OrganizationFormValues
  ) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details ||
            errorData.error ||
            "Failed to create organization"
        );
      }

      const data = await response.json();
      toast.success("Organization created successfully");
      setIsCreateOpen(false);
      await fetchOrganizations();
      if (data?.organization?.id) {
        router.push(`/admin/organization/${data.organization.id}`);
      }
    } catch (error: unknown) {
      console.error("Error creating organization:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create organization";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const getSizeLabel = (size: string) => {
    switch (size) {
      case "startup":
        return "Startup (1-10)";
      case "small":
        return "Small (11-50)";
      case "medium":
        return "Medium (51-200)";
      case "large":
        return "Large (201-1000)";
      case "enterprise":
        return "Enterprise (1000+)";
      default:
        return size;
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        "Organization Name",
        "Industry",
        "Size",
        "Country",
        "Plan",
        "Status",
        "Members",
        "Created",
      ],
      ...filteredOrgs.map((org) => [
        org.name,
        org.industry,
        org.teamSize,
        org.country,
        org.subscriptionPlan,
        org.subscriptionStatus,
        org.membersCount.toString(),
        format(new Date(org.createdAt), "yyyy-MM-dd"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `organizations-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast.success("Organizations exported successfully");
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-100">
                  Organizations
                </h1>
                <p className="text-gray-400 mt-1">
                  Manage client organizations and teams
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={exportToCSV}
                disabled={filteredOrgs.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Organization
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add Organization</DialogTitle>
              <DialogDescription>
                Create a new organization and assign platform resources.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <OrganizationForm
                onSubmit={handleCreateOrganization}
                isSubmitting={isSubmitting}
                showStatusField
                showPlanField
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Organizations
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-green-500 mt-2">
                  {stats.active}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Onboarding</p>
                <p className="text-3xl font-bold text-orange-500 mt-2">
                  {stats.onboarding}
                </p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Subscription Expired
                </p>
                <p className="text-3xl font-bold text-red-500 mt-2">
                  {stats.expired}
                </p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <Building2 className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trialing">Trialing</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-foreground font-semibold">
                    Organization
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Industry
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Size
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Location
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Plan
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Members
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Created
                  </TableHead>
                  <TableHead className="text-foreground font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No organizations found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrgs.map((org, index) => (
                    <TableRow
                      key={org.id}
                      className="border-border hover:bg-muted/50 cursor-pointer"
                      onClick={() =>
                        router.push(`/admin/organization/${org.id}`)
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {org.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {org.clerkSlug || "N/A"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {org.industry || "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {getSizeLabel(org.teamSize)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {org.state
                          ? `${org.state}, ${org.country}`
                          : org.country || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPlanColor(
                            org.subscriptionPlan || "free"
                          )}
                        >
                          {(org.subscriptionPlan || "free").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(
                            org.subscriptionStatus || "active"
                          )}
                        >
                          {(org.subscriptionStatus || "active")
                            .replace("_", " ")
                            .toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {org.membersCount}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(org.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/organization/${org.id}`);
                            }}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/organization/${org.id}/edit`);
                            }}
                            title="Edit Organization"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement delete functionality
                            }}
                            title="Delete Organization"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Results Summary */}
        {filteredOrgs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 text-sm text-muted-foreground text-center"
          >
            Showing {filteredOrgs.length} of {organizations.length}{" "}
            organizations
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
