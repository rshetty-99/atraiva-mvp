"use client";

import { useUser } from "@clerk/nextjs";
import { useSession, useRole } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertOctagon,
  ShieldAlert,
  UserPlus,
  Lock,
  Timer,
  Microscope,
  Building2,
  CalendarClock,
  History,
  UserCog,
  UserX,
  Gavel,
  Loader2,
  Info,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

/**
 * Admin Dashboard
 * For super_admin and platform_admin roles
 * Features: Platform-wide monitoring, organization management, system health
 */
export default function AdminDashboard() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { session } = useSession();
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not loaded or not authenticated
    if (clerkLoaded && !clerkUser) {
      router.push("/sign-in");
    }

    // Redirect if not admin role
    if (
      clerkLoaded &&
      role &&
      role !== "super_admin" &&
      role !== "platform_admin"
    ) {
      router.push("/dashboard"); // Will redirect to appropriate dashboard
    }
  }, [clerkUser, clerkLoaded, role, router]);

  // Show loading while authenticating
  if (!clerkLoaded || !role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect non-admin users
  if (role !== "super_admin" && role !== "platform_admin") {
    return null;
  }

  // Chart data
  const breachExposureData = [
    { name: "Low Exposure", value: 1050, color: "#34D399" },
    { name: "Medium Exposure", value: 300, color: "#FBBF24" },
    { name: "High Exposure", value: 65, color: "#F87171" },
  ];

  const regulatoryAlignmentData = [
    { name: "Aligned", value: 85, color: "#3B82F6" },
    { name: "Needs Review", value: 15, color: "#4B5563" },
  ];

  const customerHealthData = [
    { range: "0-20", count: 15, color: "#F87171" },
    { range: "21-40", count: 45, color: "#FBBF24" },
    { range: "41-60", count: 150, color: "#A7F3D0" },
    { range: "61-80", count: 600, color: "#6EE7B7" },
    { range: "81-100", count: 605, color: "#34D399" },
  ];

  const onboardingPipelineData = [
    { stage: "Active", count: 1415, color: "#34D399" },
    { stage: "Purview Integration", count: 12, color: "#60A5FA" },
    { stage: "Payment Done", count: 25, color: "#FBBF24" },
    { stage: "Org Info Collected", count: 10, color: "#FBBF24" },
    { stage: "Log In Created", count: 25, color: "#A78BFA" },
  ];

  const newCustomersData = [
    { month: "Jan", customers: 20 },
    { month: "Feb", customers: 30 },
    { month: "Mar", customers: 45 },
    { month: "Apr", customers: 40 },
    { month: "May", customers: 55 },
    { month: "Jun", customers: 60 },
    { month: "Jul", customers: 75 },
    { month: "Aug", customers: 70 },
    { month: "Sep", customers: 80 },
    { month: "Oct", customers: 95 },
    { month: "Nov", customers: 110 },
    { month: "Dec", customers: 120 },
  ];

  return (
    <div style={{ marginTop: "140px" }} className="container mx-auto px-6 pb-6">
      {/* Top Section - Active Incidents, Alerts, and SLA Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Active Incidents & Critical Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Breach Incidents */}
          <a
            href="/admin/incidents?filter=active"
            className="block bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-500"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">
                  Active Breach Incidents
                </p>
                <p className="text-5xl font-bold text-red-600">12</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
                <AlertOctagon className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Click to view and manage all active incidents.
            </p>
          </a>

          {/* Critical Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <ShieldAlert className="h-5 w-5 mr-3 text-yellow-500" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mr-4 flex-shrink-0">
                  <UserPlus className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-foreground">
                    &apos;DataFlow Analytics&apos; has been in &apos;Payment
                    Done&apos; for 10 days.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Onboarding stall
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full mr-4 flex-shrink-0">
                  <Lock className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-foreground">
                    User{" "}
                    <span className="font-semibold">mike.t@globex.com</span>{" "}
                    failed login 3 times.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Security event
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - SLA Status & Client Insights */}
        <div className="space-y-6">
          {/* Proactive SLA Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Timer className="h-5 w-5 mr-3 text-muted-foreground" />
                Proactive SLA Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 rounded-r-lg">
                <p className="font-semibold text-red-800 dark:text-red-300">
                  Breach Notification Deadline
                </p>
                <p className="text-sm text-muted-foreground">
                  For: <span className="font-medium">INC-957299</span>
                </p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  Breached 2 days ago
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-lg">
                <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                  Compliance Report Due
                </p>
                <p className="text-sm text-muted-foreground">
                  For: <span className="font-medium">Springfield General</span>
                </p>
                <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                  Due in 3 days
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg">
                <p className="font-semibold text-blue-800 dark:text-blue-300">
                  Subscription Renewal
                </p>
                <p className="text-sm text-muted-foreground">
                  For: <span className="font-medium">TechStart Solutions</span>
                </p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  Due in 25 days
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Client Benchmark & Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Microscope className="h-5 w-5 mr-3 text-muted-foreground" />
                Client Benchmark & Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  Clients in <span className="font-semibold">Healthcare</span>{" "}
                  average <span className="font-semibold">4.8</span> days to
                  resolution.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Springfield General</span> is at{" "}
                  <span className="font-bold text-green-600">3.2 days</span>.
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  Clients in <span className="font-semibold">Finance</span>{" "}
                  average <span className="font-semibold">1.5</span>{" "}
                  incidents/quarter.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Global Tech Inc.</span> is at{" "}
                  <span className="font-bold text-red-600">3.0 incidents</span>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-8 border-border" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="kpi-card hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Active Customers
              </p>
              <p className="text-3xl font-bold text-foreground">1,415</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Customers in Onboarding
              </p>
              <p className="text-3xl font-bold text-foreground">72</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Subscriptions for Renewal
              </p>
              <p className="text-3xl font-bold text-foreground">43</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
              <CalendarClock className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Breach Exposure Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Breach Exposure Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={breachExposureData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) =>
                    `${props.name}: ${(props.percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {breachExposureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regulatory Alignment */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-lg">Regulatory Alignment</CardTitle>
              <div className="relative group ml-2">
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Percentage of customers whose data exposure profile aligns
                  with key regulatory frameworks vs. those needing review.
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={regulatoryAlignmentData}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                >
                  {regulatoryAlignmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-3xl font-bold text-blue-600">85%</p>
              <p className="text-sm text-muted-foreground">Aligned</p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Health Score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={customerHealthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="range"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis tick={{ fill: "currentColor" }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {customerHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 - Onboarding Pipeline & New Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Onboarding Pipeline */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Onboarding Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={onboardingPipelineData}
                margin={{ left: 120 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fill: "currentColor" }} />
                <YAxis
                  dataKey="stage"
                  type="category"
                  tick={{ fill: "currentColor" }}
                  width={110}
                />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {onboardingPipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* New Customers */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">New Customers</CardTitle>
            <select className="text-sm border border-input bg-background rounded-md px-2 py-1">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
            </select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={newCustomersData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "currentColor" }}
                  className="text-xs"
                />
                <YAxis tick={{ fill: "currentColor" }} />
                <Tooltip />
                <Bar
                  dataKey="customers"
                  fill="rgba(59, 130, 246, 0.5)"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Recent Activity & Regulatory Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Admin Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <History className="h-5 w-5 mr-3 text-muted-foreground" />
              Recent Admin Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full mr-4 flex-shrink-0">
                <UserCog className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-foreground">
                  Admin <span className="font-semibold">Jane Smith</span> was
                  assigned as Account Owner for{" "}
                  <span className="font-semibold">TechStart Solutions</span>.
                </p>
                <p className="text-xs text-muted-foreground">
                  By John Doe - 2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full mr-4 flex-shrink-0">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-foreground">
                  Admin <span className="font-semibold">Mike Monitor</span>{" "}
                  account was deactivated.
                </p>
                <p className="text-xs text-muted-foreground">
                  By Jane Smith - 1 day ago
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Regulatory Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Gavel className="h-5 w-5 mr-3 text-muted-foreground" />
              Recent Regulatory Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md mr-4 flex-shrink-0">
                <p className="font-bold text-blue-700 dark:text-blue-300 text-sm">
                  CA
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  California Privacy Rights Act (CPRA) - New Amendment
                </p>
                <p className="text-sm text-muted-foreground">
                  Effective August 1, 2025 - Updated data retention policies.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-md mr-4 flex-shrink-0">
                <p className="font-bold text-green-700 dark:text-green-300 text-sm">
                  NY
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  NY SHIELD Act - New Reporting Requirement
                </p>
                <p className="text-sm text-muted-foreground">
                  Effective July 20, 2025 - Breach notifications must be sent
                  within 72 hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
