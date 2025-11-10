"use client";

import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

import type {
  PIICategory,
  PIIElement,
  Regulation,
  RiskLevel,
} from "@/types/pii-element";
import { PII_CATEGORY_INFO } from "@/types/pii-element";

export const ALL_CATEGORIES: readonly PIICategory[] = [
  "Core Identifiers",
  "Government-Issued Numbers",
  "Financial & Payment",
  "Health & Genetic",
  "Biometric Identifiers",
  "Digital & Device IDs",
  "Login & Security Credentials",
  "Location & Vehicle",
  "Personal Characteristics & Demographics",
  "Civic, Political & Legal",
  "Education & Employment",
  "Media & Communications",
  "Household & Utility",
  "Miscellaneous Unique Identifiers",
] as const;

export const ALL_RISK_LEVELS: readonly RiskLevel[] = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const ALL_REGULATIONS: readonly Regulation[] = [
  "GDPR",
  "CCPA",
  "HIPAA",
  "GLBA",
  "FERPA",
  "BIPA",
  "GINA",
  "PCI-DSS",
  "TCPA",
  "State Laws",
] as const;

const CATEGORY_SCHEMA_VALUES = ALL_CATEGORIES.slice() as [
  PIICategory,
  ...PIICategory[]
];
const RISK_LEVEL_SCHEMA_VALUES = ALL_RISK_LEVELS.slice() as [
  RiskLevel,
  ...RiskLevel[]
];
const REGULATION_SCHEMA_VALUES = ALL_REGULATIONS.slice() as [
  Regulation,
  ...Regulation[]
];

export const piiElementFormSchema = z.object({
  element: z
    .string()
    .min(2, "Element name is required")
    .max(200, "Element name is too long"),
  category: z.enum(CATEGORY_SCHEMA_VALUES, {
    required_error: "Category is required",
  }),
  description: z
    .string()
    .max(2000, "Description is too long")
    .optional()
    .or(z.literal("")),
  riskLevel: z.enum(RISK_LEVEL_SCHEMA_VALUES, {
    required_error: "Risk level is required",
  }),
  isRegulated: z.boolean(),
  applicableRegulations: z
    .array(z.enum(REGULATION_SCHEMA_VALUES))
    .max(REGULATION_SCHEMA_VALUES.length)
    .default([]),
  detectionPatterns: z
    .string()
    .max(2000, "Detection patterns are too long")
    .optional()
    .or(z.literal("")),
  examples: z
    .string()
    .max(2000, "Examples are too long")
    .optional()
    .or(z.literal("")),
  source: z
    .string()
    .max(200, "Source value is too long")
    .optional()
    .or(z.literal("")),
  importDate: z
    .string()
    .max(200, "Import date value is too long")
    .optional()
    .or(z.literal("")),
});

export type PIIElementFormValues = z.infer<typeof piiElementFormSchema>;

export const getDefaultFormValues = (): PIIElementFormValues => ({
  element: "",
  category: "Core Identifiers",
  description: "",
  riskLevel: "medium",
  isRegulated: true,
  applicableRegulations: [],
  detectionPatterns: "",
  examples: "",
  source: "PII_elements.xlsx",
  importDate: "",
});

export const sanitizeMultilineInput = (value: string | undefined) =>
  (value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const toDateValue = (value: unknown): Date => {
  if (value instanceof Date) {
    return value;
  }
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    try {
      return (value as { toDate: () => Date }).toDate();
    } catch {
      return new Date();
    }
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date();
};

export const getCategorySlug = (category: PIICategory) =>
  PII_CATEGORY_INFO[category]?.categorySlug ??
  category.toLowerCase().replace(/\s+/g, "-");

const isValidRegulation = (value: unknown): value is Regulation =>
  typeof value === "string" &&
  (ALL_REGULATIONS as readonly string[]).includes(value);

export const mapFirestoreDocToPIIElement = (
  id: string,
  data: Record<string, unknown>
): PIIElement => {
  const category = (data.category as PIICategory) || "Core Identifiers";
  const riskLevel = (data.riskLevel as RiskLevel) || "medium";
  const applicableRegulations = Array.isArray(data.applicableRegulations)
    ? data.applicableRegulations.filter(isValidRegulation)
    : [];
  const detectionPatterns = Array.isArray(data.detectionPatterns)
    ? data.detectionPatterns.filter(
        (item): item is string => typeof item === "string"
      )
    : [];
  const examples = Array.isArray(data.examples)
    ? data.examples.filter((item): item is string => typeof item === "string")
    : [];

  const metadata =
    data.metadata && typeof data.metadata === "object"
      ? (data.metadata as Record<string, unknown>)
      : {};

  const source =
    typeof metadata.source === "string" && metadata.source.trim().length > 0
      ? metadata.source
      : "PII_elements.xlsx";

  const importDate =
    typeof metadata.importDate === "string" &&
    metadata.importDate.trim().length > 0
      ? metadata.importDate
      : undefined;

  return {
    id,
    element: typeof data.element === "string" ? data.element : "",
    category,
    categorySlug:
      typeof data.categorySlug === "string" && data.categorySlug.length > 0
        ? data.categorySlug
        : getCategorySlug(category),
    description:
      typeof data.description === "string" && data.description.trim().length > 0
        ? data.description
        : undefined,
    riskLevel,
    isRegulated:
      typeof data.isRegulated === "boolean" ? data.isRegulated : false,
    applicableRegulations,
    detectionPatterns,
    examples,
    metadata: {
      createdAt: metadata.createdAt ? toDateValue(metadata.createdAt) : new Date(),
      updatedAt: metadata.updatedAt ? toDateValue(metadata.updatedAt) : new Date(),
      createdBy:
        typeof metadata.createdBy === "string" && metadata.createdBy.length > 0
          ? metadata.createdBy
          : undefined,
      updatedBy:
        typeof metadata.updatedBy === "string" && metadata.updatedBy.length > 0
          ? metadata.updatedBy
          : undefined,
      source,
      importDate,
    },
  };
};

export const serializeElementForAudit = (element: PIIElement | null) => {
  if (!element) {
    return null;
  }

  const { metadata, ...rest } = element;
  return {
    ...rest,
    metadata: {
      ...metadata,
      createdAt:
        metadata.createdAt instanceof Date
          ? metadata.createdAt.toISOString()
          : metadata.createdAt,
      updatedAt:
        metadata.updatedAt instanceof Date
          ? metadata.updatedAt.toISOString()
          : metadata.updatedAt,
    },
  };
};

type FormProps = {
  form: UseFormReturn<PIIElementFormValues>;
  mode: "create" | "edit";
  isSaving: boolean;
  isRegulatedValue: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onCancel?: () => void;
};

export function PiiElementForm({
  form,
  mode,
  isSaving,
  isRegulatedValue,
  onSubmit,
  onCancel,
}: FormProps) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="element"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Element Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Social Security Number"
                    {...field}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSaving}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ALL_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="riskLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Level</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSaving}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ALL_RISK_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isRegulated"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Regulated Element</FormLabel>
                    <FormDescription>
                      Toggle to indicate if this element is governed by compliance
                      regulations.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSaving}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a short description for this element."
                  rows={3}
                  {...field}
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="applicableRegulations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applicable Regulations</FormLabel>
              <div className="grid gap-2 sm:grid-cols-2">
                {ALL_REGULATIONS.map((regulation) => {
                  const isChecked = field.value?.includes(regulation);
                  return (
                    <label
                      key={regulation}
                      className="flex items-center gap-2 rounded-md border p-2 text-sm"
                    >
                      <Checkbox
                        checked={isChecked}
                        disabled={!isRegulatedValue || isSaving}
                        onCheckedChange={(checked) => {
                          const next = new Set(field.value || []);
                          if (checked === true) {
                            next.add(regulation);
                          } else {
                            next.delete(regulation);
                          }
                          field.onChange(Array.from(next));
                        }}
                      />
                      <span>{regulation}</span>
                    </label>
                  );
                })}
              </div>
              <FormDescription>
                Select all applicable regulations. This section is disabled when the
                element is marked as non-regulated.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="detectionPatterns"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detection Patterns</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter one pattern per line"
                    rows={4}
                    {...field}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormDescription>
                  Provide detection patterns used to identify this element. Separate
                  each pattern on a new line.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="examples"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Examples</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter one example per line"
                    rows={4}
                    {...field}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormDescription>
                  Provide real-world examples for this element. Separate each example
                  on a new line.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. PII_elements.xlsx"
                    {...field}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormDescription>
                  Reference the data source for this element.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="importDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Import Date</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 2025-01-15"
                    {...field}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormDescription>
                  Optional reference date for when the element was added.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : mode === "create" ? (
              "Create Element"
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

