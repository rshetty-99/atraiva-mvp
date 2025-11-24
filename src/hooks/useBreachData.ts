"use client";

import { useMemo } from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchBreachTriggerTaxonomies,
  fetchBreachTriggers,
  fetchBreaches,
  fetchBreachById,
} from "@/lib/firestore/breach";
import type { BreachRecord, BreachTrigger, BreachTaxonomyItem } from "@/types/breach";

const QUERY_KEYS = {
  TAXONOMIES: ["breach", "taxonomies"] as const,
  TRIGGERS: ["breach", "triggers"] as const,
  BREACHES: ["breach", "records"] as const,
  BREACH: (id: string) => ["breach", "record", id] as const,
};

export function useBreachTaxonomies(
  options?: UseQueryOptions<BreachTaxonomyItem[], Error>
) {
  return useQuery({
    queryKey: QUERY_KEYS.TAXONOMIES,
    queryFn: fetchBreachTriggerTaxonomies,
    ...options,
  });
}

export function useBreachTriggers(
  options?: UseQueryOptions<BreachTrigger[], Error>
) {
  return useQuery({
    queryKey: QUERY_KEYS.TRIGGERS,
    queryFn: fetchBreachTriggers,
    ...options,
  });
}

export function useBreaches(
  options?: UseQueryOptions<BreachRecord[], Error>
) {
  return useQuery({
    queryKey: QUERY_KEYS.BREACHES,
    queryFn: fetchBreaches,
    ...options,
  });
}

export function useBreach(
  breachId: string | undefined,
  options?: UseQueryOptions<BreachRecord | null, Error>
) {
  const enabled = useMemo(() => Boolean(breachId), [breachId]);

  return useQuery({
    queryKey: breachId ? QUERY_KEYS.BREACH(breachId) : ["breach", "record"],
    queryFn: () => (breachId ? fetchBreachById(breachId) : Promise.resolve(null)),
    enabled,
    staleTime: 60 * 1000,
    ...options,
  });
}

export function invalidateBreachQueryKeys() {
  // convenience helper for components that call useQueryClient()
  return QUERY_KEYS;
}


