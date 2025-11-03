// Server-side data fetching utilities for breach statistics
// These functions are used by Server Components for ISR

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { Organization } from "@/lib/firestore/types";
import { US_STATES_MAP } from "@/types/state-regulation";

/**
 * Normalize state code to 2-letter uppercase format
 * Handles variations like "CA", "California", "california", etc.
 */
function normalizeStateCode(state: string | undefined | null): string | null {
  if (!state) return null;

  const upperState = state.toUpperCase().trim();

  // If it's already a 2-letter code, return it
  if (upperState.length === 2 && upperState in US_STATES_MAP) {
    return upperState;
  }

  // Try to find matching state name
  const stateEntry = Object.entries(US_STATES_MAP).find(
    ([, name]) => name.toUpperCase() === upperState
  );

  if (stateEntry) {
    return stateEntry[0]; // Return the 2-letter code
  }

  // Return null if we can't normalize it
  return null;
}

export type BreachStatus =
  | "reported"
  | "investigating"
  | "contained"
  | "resolved"
  | "closed";

export interface StateBreachData {
  total: number;
  byStatus: Record<BreachStatus, number>;
}

/**
 * Fetch breach counts aggregated by state with status breakdown
 * Returns a map of state codes to breach data (total count + status breakdown)
 * Shows ALL breaches regardless of status
 */
export async function getBreachesByState(): Promise<
  Record<string, StateBreachData>
> {
  try {
    if (!db) {
      console.error("Firebase database is not initialized");
      return {};
    }

    // Initialize counts for all states + DC (default to 0)
    const stateData: Record<string, StateBreachData> = {};

    for (const stateCode of Object.keys(US_STATES_MAP)) {
      stateData[stateCode] = {
        total: 0,
        byStatus: {
          reported: 0,
          investigating: 0,
          contained: 0,
          resolved: 0,
          closed: 0,
        },
      };
    }

    // Fetch all breaches (no status filtering)
    const breachesSnapshot = await getDocs(collection(db, "breaches"));

    // Get unique organization IDs and breach data
    const organizationIds = new Set<string>();
    const breachDataMap = new Map<
      string,
      { orgId: string; status: BreachStatus }
    >(); // breachId -> {orgId, status}

    breachesSnapshot.forEach(
      (docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
        const data = docSnapshot.data();
        const organizationId = data.organizationId;
        const status = (data.status || "reported") as BreachStatus;

        if (organizationId) {
          organizationIds.add(organizationId);
          breachDataMap.set(docSnapshot.id, { orgId: organizationId, status });
        }
      }
    );

    // Fetch all organizations in batch
    const organizationPromises = Array.from(organizationIds).map(
      async (orgId) => {
        try {
          const orgDoc = await getDoc(doc(db, "organizations", orgId));
          if (orgDoc.exists()) {
            const orgData = orgDoc.data() as Organization;
            return { id: orgId, state: orgData.state };
          }
          return { id: orgId, state: null };
        } catch (error) {
          console.error(`Error fetching organization ${orgId}:`, error);
          return { id: orgId, state: null };
        }
      }
    );

    const organizations = await Promise.all(organizationPromises);

    // Create a map of organizationId -> state
    const orgStateMap = new Map<string, string | null>();
    organizations.forEach((org) => {
      orgStateMap.set(org.id, normalizeStateCode(org.state));
    });

    // Aggregate breaches by state and status
    breachDataMap.forEach(({ orgId, status }) => {
      const state = orgStateMap.get(orgId);
      if (state && state in stateData) {
        stateData[state].total++;
        if (status in stateData[state].byStatus) {
          stateData[state].byStatus[status]++;
        }
      }
    });

    return stateData;
  } catch (error) {
    console.error("Error fetching breaches by state:", error);
    // Return empty counts on error
    const emptyData: Record<string, StateBreachData> = {};
    for (const stateCode of Object.keys(US_STATES_MAP)) {
      emptyData[stateCode] = {
        total: 0,
        byStatus: {
          reported: 0,
          investigating: 0,
          contained: 0,
          resolved: 0,
          closed: 0,
        },
      };
    }
    return emptyData;
  }
}

/**
 * Get total breach count across all states
 */
export async function getTotalBreachCount(): Promise<number> {
  try {
    if (!db) {
      return 0;
    }

    const breachesSnapshot = await getDocs(collection(db, "breaches"));
    return breachesSnapshot.size;
  } catch (error) {
    console.error("Error fetching total breach count:", error);
    return 0;
  }
}
