"use client";

import { useState, useEffect } from "react";
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
  Users,
  Search,
  UserPlus,
  Shield,
  UserX,
  Building2,
  Download,
  Loader2,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Member {
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
}

interface MemberStats {
  total: number;
  active: number;
  admins: number;
  noOrg: number;
  pendingInvitations: number;
}

interface Organization {
  id: string;
  name: string;
}

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [stats, setStats] = useState<MemberStats>({
    total: 0,
    active: 0,
    admins: 0,
    noOrg: 0,
    pendingInvitations: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrg, setFilterOrg] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");

  useEffect(() => {
    fetchOrganizations();
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, filterOrg, filterRole, members]);

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

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/members");

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          errorData.details || errorData.error || "Failed to fetch members"
        );
      }

      const data = await response.json();
      setMembers(data.members);
      setFilteredMembers(data.members);
      setStats(
        data.stats || {
          total: data.members.length,
          active: 0,
          admins: 0,
          noOrg: 0,
        }
      );
    } catch (error: any) {
      console.error("Error fetching members:", error);
      toast.error(error.message || "Failed to load members");
    } finally {
      setIsLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = [...members];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.organizationName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Organization filter
    if (filterOrg !== "all") {
      filtered = filtered.filter(
        (member) => member.organizationId === filterOrg
      );
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter((member) => member.role === filterRole);
    }

    setFilteredMembers(filtered);
  };

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

  const exportToCSV = () => {
    const csvContent = [
      [
        "Name",
        "Email",
        "Organization",
        "Role",
        "Status",
        "Joined",
        "Last Sign In",
      ],
      ...filteredMembers.map((member) => [
        `${member.firstName} ${member.lastName}`,
        member.email,
        member.organizationName,
        member.role,
        member.isActive ? "Active" : "Inactive",
        format(new Date(member.createdAt), "yyyy-MM-dd"),
        member.lastSignInAt
          ? format(new Date(member.lastSignInAt), "yyyy-MM-dd")
          : "Never",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast.success("Members exported successfully");
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
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-100">Members</h1>
                <p className="text-gray-400 mt-1">
                  Manage members across all organizations
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={exportToCSV}
                disabled={filteredMembers.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
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
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-3xl font-bold text-purple-500 mt-2">
                  {stats.admins}
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Shield className="h-6 w-6 text-purple-500" />
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
                <p className="text-sm text-muted-foreground">No Organization</p>
                <p className="text-3xl font-bold text-orange-500 mt-2">
                  {stats.noOrg}
                </p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <UserX className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Invitations
                </p>
                <p className="text-3xl font-bold text-yellow-500 mt-2">
                  {stats.pendingInvitations}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <UserPlus className="h-6 w-6 text-yellow-500" />
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
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterOrg} onValueChange={setFilterOrg}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Filter by organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="platform_admin">Platform Admin</SelectItem>
                <SelectItem value="org_admin">Org Admin</SelectItem>
                <SelectItem value="org_manager">Org Manager</SelectItem>
                <SelectItem value="org_user">Org User</SelectItem>
                <SelectItem value="org_viewer">Org Viewer</SelectItem>
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
                    Member
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Organization
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Role
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Status
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
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No members found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow
                      key={member.id}
                      className="border-border hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/admin/members/${member.id}`)}
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
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {member.organizationName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getRoleBadgeColor(member.role)}
                        >
                          {getRoleDisplayName(member.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
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
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/members/${member.id}`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit member"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/members/${member.id}/edit`);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
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
        {filteredMembers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 text-sm text-muted-foreground text-center"
          >
            Showing {filteredMembers.length} of {members.length} members
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
