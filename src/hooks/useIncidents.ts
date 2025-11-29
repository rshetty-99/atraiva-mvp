"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { collections, incidentService, incidentStatusQueries } from "@/lib/firestore/collections";
import type { IncidentSimulation } from "@/lib/firestore/types";
import { organizationService } from "@/lib/firestore/collections";
import type { Organization } from "@/lib/firestore/types";

export interface IncidentRow {
  id: string;
  organization: string;
  organizationName: string;
  severity: "critical" | "high" | "medium" | "low" | "unknown";
  status: "draft" | "in_progress" | "completed" | "cancelled" | "unknown";
  jurisdictions: string[];
  upcomingDeadline?: string;
  notificationsCompleted: number;
  notificationsTotal: number;
  evidenceCount: number;
  updatedAt: string;
  createdAt: string;
  incidentType?: string;
  discoveryMethod?: string;
}

function mapIncidentToRow(
  incident: IncidentSimulation, 
  organizations: Organization[],
  incidentStatusMap?: Map<string, { status: string }>
): IncidentRow {
  // Find organization name
  const org = organizations.find((o) => o.id === incident.ownership.organizationId);
  const organizationName = org?.name || incident.ownership.organizationId;

  // Determine severity based on data scope and impact
  let severity: "critical" | "high" | "medium" | "low" | "unknown" = "unknown";
  if (incident.dataScope) {
    const recordsAffected = incident.dataScope.estimatedRecordsAffected;
    if (recordsAffected === "over_100k") {
      severity = "critical";
    } else if (recordsAffected === "10k_100k") {
      severity = "high";
    } else if (recordsAffected === "1k_10k") {
      severity = "medium";
    } else if (recordsAffected === "under_1k") {
      severity = "low";
    }
  }

  // Check incident_statuses collection to get the actual analysis status
  // If analysis is completed, override the incident status
  let derivedStatus = incident.status || "unknown";
  if (incidentStatusMap) {
    const statusDoc = incidentStatusMap.get(incident.id);
    if (statusDoc?.status === "completed") {
      // If analysis is completed, the incident should show as simulation_completed
      derivedStatus = "simulation_completed";
    } else if (statusDoc?.status === "analyzing" && incident.status === "simulation_initialized") {
      // Keep as simulation_initialized if analysis is in progress
      derivedStatus = "simulation_initialized";
    }
  }

  // Map status - handle new status values
  const statusMap: Record<string, string> = {
    draft: "draft",
    in_progress: "in_progress",
    simulation_initialized: "simulation_initialized",
    simulation_completed: "simulation_completed",
    completed: "simulation_completed", // Legacy support
    cancelled: "cancelled",
  };
  const status = statusMap[derivedStatus] || "unknown";

  // Extract jurisdictions from data types (simplified - you may want to enhance this)
  const jurisdictions: string[] = [];
  // You can enhance this to extract actual jurisdictions from the incident data

  // Get incident type
  const incidentType = incident.discovery?.incidentTypes?.[0] || "unknown";
  const discoveryMethod = incident.discovery?.discoveryMethod || "unknown";

  // Convert dates - handle Firestore Timestamp or Date objects
  const getDateString = (date: any): string => {
    if (!date) return new Date().toISOString();
    if (date instanceof Timestamp) return date.toDate().toISOString();
    if (date instanceof Date) return date.toISOString();
    if (date?.toDate && typeof date.toDate === "function") {
      // Firestore Timestamp object
      return date.toDate().toISOString();
    }
    if (typeof date === "string") return date;
    return new Date().toISOString();
  };

  const updatedAt = getDateString(incident.updatedAt);
  const createdAt = getDateString(incident.createdAt);

  return {
    id: incident.id,
    organization: incident.ownership.organizationId,
    organizationName,
    severity,
    status,
    jurisdictions,
    notificationsCompleted: 0, // Placeholder - you may want to fetch from notifications collection
    notificationsTotal: 0, // Placeholder
    evidenceCount: 0, // Placeholder - you may want to fetch from evidence collection
    updatedAt,
    createdAt,
    incidentType,
    discoveryMethod,
  };
}

export function useIncidents() {
  const [incidents, setIncidents] = useState<IncidentSimulation[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [incidentStatusMap, setIncidentStatusMap] = useState<Map<string, { status: string }>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch organizations once
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await organizationService.getAll();
        setOrganizations(orgs);
      } catch (err) {
        console.error("Error fetching organizations:", err);
      }
    };
    fetchOrganizations();
  }, []);

  // Subscribe to incident statuses to get actual analysis status
  useEffect(() => {
    // Get all incident statuses and create a map by incidentId
    const statusQuery = query(
      collection(db, collections.incidentStatuses),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(
      statusQuery,
      (snapshot) => {
        try {
          const statusMap = new Map<string, { status: string }>();
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (data.incidentId) {
              // Keep the latest status for each incident (since we order by createdAt desc)
              if (!statusMap.has(data.incidentId)) {
                statusMap.set(data.incidentId, { status: data.status });
              }
            }
          });
          setIncidentStatusMap(statusMap);
        } catch (err) {
          console.error("Error processing incident statuses:", err);
        }
      },
      (err) => {
        console.error("Error listening to incident statuses:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to incidents collection
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    const q = query(
      collection(db, collections.incidents),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const incidentData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as IncidentSimulation[];

          setIncidents(incidentData);
          setIsLoading(false);
          setIsFetching(false);
          setIsError(false);
        } catch (err) {
          console.error("Error processing incidents:", err);
          setIsError(true);
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setIsLoading(false);
          setIsFetching(false);
        }
      },
      (err) => {
        console.error("Error listening to incidents:", err);
        setIsError(true);
        setError(err);
        setIsLoading(false);
        setIsFetching(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const refetch = async () => {
    setIsFetching(true);
    try {
      const allIncidents = await incidentService.getAll();
      setIncidents(allIncidents);
      setIsFetching(false);
      setIsError(false);
    } catch (err) {
      console.error("Error refetching incidents:", err);
      setIsError(true);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setIsFetching(false);
    }
  };

  const rows: IncidentRow[] = incidents.map((incident) =>
    mapIncidentToRow(incident, organizations, incidentStatusMap)
  );

  return {
    data: rows,
    incidents, // Raw incident data
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}

