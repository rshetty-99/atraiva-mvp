"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  incidentService,
  incidentStatusQueries,
  organizationService,
} from "@/lib/firestore/collections";
import type { IncidentSimulation, IncidentStatus, Organization } from "@/lib/firestore/types";
import { AnalysisStatus } from "@/components/incident-simulation/AnalysisStatus";
import { format } from "date-fns";

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const incidentId = params.incidentId as string;

  const [incident, setIncident] = useState<IncidentSimulation | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<IncidentStatus | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIncidentData = async () => {
      try {
        setLoading(true);

        // Load incident
        const incidentData = await incidentService.getById(incidentId);
        if (!incidentData) {
          setError("Incident not found");
          return;
        }
        setIncident(incidentData);

        // Load organization
        if (incidentData.ownership.organizationId) {
          const orgData = await organizationService.getById(
            incidentData.ownership.organizationId
          );
          setOrganization(orgData);
        }

        // Load analysis status
        const statusData = await incidentStatusQueries.getLatestByIncident(incidentId);
        setAnalysisStatus(statusData);
      } catch (err) {
        console.error("Error loading incident data:", err);
        setError("Failed to load incident data");
      } finally {
        setLoading(false);
      }
    };

    if (incidentId) {
      loadIncidentData();
    }
  }, [incidentId]);

  // Determine if simulation is completed
  const isCompleted =
    analysisStatus?.status === "completed" ||
    incident?.status === "simulation_completed";

  // Redirect to report if completed
  useEffect(() => {
    if (!loading && isCompleted && incident) {
      router.replace(`/admin/incidents/${incidentId}/report`);
    }
  }, [loading, isCompleted, incident, incidentId, router]);

  if (loading) {
    return (
      <div className="p-6 space-y-6" style={{ marginTop: "140px" }}>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="p-6" style={{ marginTop: "140px" }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error || "Incident not found"}</p>
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/admin/incidents")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Incidents
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If simulation is completed, show redirecting message (useEffect will handle redirect)
  if (isCompleted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  // Show incident details view for non-completed incidents
  return (
    <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900" style={{ marginTop: "140px" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/incidents")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Incident Details
            </h1>
            <p className="text-sm text-muted-foreground">Incident ID: {incident.id}</p>
          </div>
        </div>
        {isCompleted && (
          <Link href={`/admin/incidents/${incidentId}/report`}>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              View Report
            </Button>
          </Link>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={
                incident.status === "simulation_initialized"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
                  : incident.status === "simulation_completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200"
                  : "bg-muted text-muted-foreground"
              }
            >
              {incident.status === "simulation_initialized"
                ? "Simulation Initialized"
                : incident.status === "simulation_completed"
                ? "Simulation Completed"
                : incident.status || "Unknown"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={
                incident.severity === "critical"
                  ? "bg-red-600 text-white"
                  : incident.severity === "high"
                  ? "bg-amber-500 text-white"
                  : incident.severity === "medium"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-500 text-white"
              }
            >
              {incident.severity?.toUpperCase() || "UNKNOWN"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{organization?.name || incident.ownership.organizationId}</p>
          </CardContent>
        </Card>
      </div>

      {/* Incident Information */}
      <Card>
        <CardHeader>
          <CardTitle>Incident Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Discovery Date
              </label>
              <p className="text-sm">
                {incident.initialDetails?.incidentDiscoveryDate
                  ? format(
                      incident.initialDetails.incidentDiscoveryDate instanceof Date
                        ? incident.initialDetails.incidentDiscoveryDate
                        : new Date(incident.initialDetails.incidentDiscoveryDate),
                      "PPP"
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Discovery Method
              </label>
              <p className="text-sm">
                {incident.discovery?.discoveryMethod
                  ? incident.discovery.discoveryMethod.replace(/_/g, " ").replace(/\b\w/g, (l) =>
                      l.toUpperCase()
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Incident Type
              </label>
              <p className="text-sm">
                {incident.discovery?.incidentTypes?.[0]
                  ? incident.discovery.incidentTypes[0]
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Estimated Records Affected
              </label>
              <p className="text-sm">
                {incident.dataScope?.estimatedRecordsAffected
                  ? incident.dataScope.estimatedRecordsAffected
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                  : "N/A"}
              </p>
            </div>
          </div>

          {incident.discovery?.summary && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Summary
              </label>
              <p className="text-sm mt-1">{incident.discovery.summary}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Status */}
      {analysisStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Status</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalysisStatus incidentId={incidentId} />
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/incidents")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Incidents
        </Button>
        {isCompleted && (
          <Link href={`/admin/incidents/${incidentId}/report`}>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              View Full Report
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

