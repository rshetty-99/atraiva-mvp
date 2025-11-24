"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  doc,
  runTransaction,
  serverTimestamp,
  getDoc,
  collection,
} from "firebase/firestore";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";

import { db } from "@/lib/firebase";
import {
  PiiElementForm,
  PIIElementFormValues,
  getCategorySlug,
  getDefaultFormValues,
  mapFirestoreDocToPIIElement,
  piiElementFormSchema,
  sanitizeMultilineInput,
  serializeElementForAudit,
} from "../../form-utils";
import type { PIIElement } from "@/types/pii-element";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditPiiElementPage() {
  const router = useRouter();
  const routeParams = useParams<{ elementId: string }>();
  const elementIdRaw = routeParams?.elementId;
  const elementId = Array.isArray(elementIdRaw)
    ? elementIdRaw[0]
    : elementIdRaw;
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentElement, setCurrentElement] = useState<PIIElement | null>(null);

  const form = useForm<PIIElementFormValues>({
    resolver: zodResolver(piiElementFormSchema),
    defaultValues: getDefaultFormValues(),
  });

  const isRegulatedValue = form.watch("isRegulated");

  const elementLabel = useMemo(() => {
    if (currentElement) {
      return currentElement.element;
    }
    return "PII Element";
  }, [currentElement]);

  useEffect(() => {
    const loadElement = async () => {
      if (!elementId) {
        setLoadError("Missing element identifier.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setLoadError(null);

        const elementRef = doc(db, "pii_elements", elementId);
        const snapshot = await getDoc(elementRef);

        if (!snapshot.exists()) {
          setLoadError("not-found");
          return;
        }

        const element = mapFirestoreDocToPIIElement(
          snapshot.id,
          snapshot.data() as Record<string, unknown>
        );

        setCurrentElement(element);
        form.reset({
          element: element.element,
          category: element.category,
          description: element.description ?? "",
          riskLevel: element.riskLevel,
          isRegulated: element.isRegulated,
          applicableRegulations: element.isRegulated
            ? element.applicableRegulations
            : [],
          detectionPatterns: element.detectionPatterns.join("\n"),
          examples: element.examples.join("\n"),
          source: element.metadata?.source ?? "PII_elements.xlsx",
          importDate: element.metadata?.importDate ?? "",
        });
      } catch (error) {
        console.error("Failed to load PII element", error);
        setLoadError(
          error instanceof Error ? error.message : "Failed to load element."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadElement();
  }, [form, elementId]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!user?.id) {
      toast.error("You must be signed in to manage PII elements.");
      return;
    }

    setIsSaving(true);

    const sanitizedElementName = values.element.trim();
    const sanitizedDescription = values.description?.trim() ?? "";
    const sanitizedSource =
      values.source?.trim() && values.source.trim().length > 0
        ? values.source.trim()
        : "PII_elements.xlsx";
    const sanitizedImportDate =
      values.importDate?.trim() && values.importDate.trim().length > 0
        ? values.importDate.trim()
        : "";
    const applicableRegulations = values.isRegulated
      ? Array.from(new Set(values.applicableRegulations ?? []))
      : [];
    const detectionPatterns = sanitizeMultilineInput(values.detectionPatterns);
    const examples = sanitizeMultilineInput(values.examples);

    try {
      if (!elementId) {
        toast.error("Missing element identifier.");
        return;
      }
      const elementDocRef = doc(db, "pii_elements", elementId);
      const now = new Date();

      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(elementDocRef);
        if (!snapshot.exists()) {
          throw new Error("PII element no longer exists.");
        }

        const previousElement = mapFirestoreDocToPIIElement(
          snapshot.id,
          snapshot.data() as Record<string, unknown>
        );

        transaction.update(elementDocRef, {
          element: sanitizedElementName,
          category: values.category,
          categorySlug: getCategorySlug(values.category),
          description: sanitizedDescription || null,
          riskLevel: values.riskLevel,
          isRegulated: values.isRegulated,
          applicableRegulations,
          detectionPatterns,
          examples,
          "metadata.source": sanitizedSource,
          "metadata.importDate": sanitizedImportDate || null,
          "metadata.updatedAt": serverTimestamp(),
          "metadata.updatedBy": user.id,
        });

        const updatedElement: PIIElement = {
          ...previousElement,
          element: sanitizedElementName,
          category: values.category,
          categorySlug: getCategorySlug(values.category),
          description: sanitizedDescription || undefined,
          riskLevel: values.riskLevel,
          isRegulated: values.isRegulated,
          applicableRegulations,
          detectionPatterns,
          examples,
          metadata: {
            ...previousElement.metadata,
            source: sanitizedSource,
            importDate: sanitizedImportDate || undefined,
            updatedAt: now,
            updatedBy: user.id,
          },
        };

        const auditDocRef = doc(collection(db, "audit_pii_elements"));
        transaction.set(auditDocRef, {
          action: "update",
          piiElementId: elementDocRef.id,
          userId: user.id,
          timestamp: serverTimestamp(),
          previousData: serializeElementForAudit(previousElement),
          newData: serializeElementForAudit(updatedElement),
        });
      });

      toast.success("PII element updated successfully");
      router.push("/admin/reference/pii-elements");
    } catch (error: unknown) {
      console.error("Error updating PII element:", error);
      const description =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving the element.";
      toast.error("Failed to update PII element", { description });
    } finally {
      setIsSaving(false);
    }
  });

  const handleCancel = () => {
    if (!isSaving) {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-lg border bg-card px-6 py-5 shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading PII element…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="container mx-auto space-y-6 px-4 pb-10 pt-20 sm:px-6">
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Unable to load PII element
            </CardTitle>
            <CardDescription className="text-destructive/80">
              {loadError === "not-found"
                ? "The requested PII element could not be found."
                : loadError}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-destructive/70">
              Return to the PII reference catalog to review available entries.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/reference/pii-elements")}
            >
              Back to PII Reference
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-20 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit {elementLabel}
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Update metadata, risk classification, and detection details for this
            element. All changes are logged for compliance.
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Element Metadata</CardTitle>
          <CardDescription>
            Review and adjust the classification details for this PII element.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PiiElementForm
            form={form}
            mode="edit"
            isSaving={isSaving}
            isRegulatedValue={isRegulatedValue}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>

      {isSaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-lg border bg-card px-6 py-5 shadow-lg">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Saving changes…</p>
          </div>
        </div>
      )}
    </div>
  );
}
