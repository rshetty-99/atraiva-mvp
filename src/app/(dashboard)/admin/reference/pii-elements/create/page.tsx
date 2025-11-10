"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { Loader2, ShieldPlus } from "lucide-react";
import { toast } from "sonner";

import { db } from "@/lib/firebase";
import {
  PiiElementForm,
  PIIElementFormValues,
  getCategorySlug,
  getDefaultFormValues,
  piiElementFormSchema,
  sanitizeMultilineInput,
  serializeElementForAudit,
} from "../form-utils";
import type { PIIElement } from "@/types/pii-element";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreatePiiElementPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<PIIElementFormValues>({
    resolver: zodResolver(piiElementFormSchema),
    defaultValues: getDefaultFormValues(),
  });

  const isRegulatedValue = form.watch("isRegulated");

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
      const elementsCollectionRef = collection(db, "ref_pii_elements");
      const elementDocRef = doc(elementsCollectionRef);
      const now = new Date();

      const newElementForAudit: PIIElement = {
        id: elementDocRef.id,
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
          createdAt: now,
          updatedAt: now,
          createdBy: user.id,
          updatedBy: user.id,
          source: sanitizedSource,
          importDate: sanitizedImportDate || undefined,
        },
      };

      await runTransaction(db, async (transaction) => {
        transaction.set(elementDocRef, {
          element: sanitizedElementName,
          category: values.category,
          categorySlug: getCategorySlug(values.category),
          description: sanitizedDescription || null,
          riskLevel: values.riskLevel,
          isRegulated: values.isRegulated,
          applicableRegulations,
          detectionPatterns,
          examples,
          metadata: {
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: user.id,
            updatedBy: user.id,
            source: sanitizedSource,
            importDate: sanitizedImportDate || null,
          },
        });

        const auditDocRef = doc(collection(db, "audit_pii_elements"));
        transaction.set(auditDocRef, {
          action: "create",
          piiElementId: elementDocRef.id,
          userId: user.id,
          timestamp: serverTimestamp(),
          previousData: null,
          newData: serializeElementForAudit(newElementForAudit),
        });
      });

      toast.success("PII element created successfully");
      router.push("/admin/reference/pii-elements");
    } catch (error: unknown) {
      console.error("Error creating PII element:", error);
      const description =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving the element.";
      toast.error("Failed to create PII element", { description });
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-20 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldPlus className="h-8 w-8 text-primary" />
            Add PII Element
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Capture new elements in the PII reference catalog. All actions are recorded
            for auditing and compliance purposes.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/reference/pii-elements")}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Element Details</CardTitle>
          <CardDescription>
            Provide descriptive and compliance metadata for the new element.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PiiElementForm
            form={form}
            mode="create"
            isSaving={isSaving}
            isRegulatedValue={isRegulatedValue}
            onSubmit={handleSubmit}
            onCancel={
              isSaving
                ? undefined
                : () => router.push("/admin/reference/pii-elements")
            }
          />
        </CardContent>
      </Card>

      {isSaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-lg border bg-card px-6 py-5 shadow-lg">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Saving new PII element…
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

