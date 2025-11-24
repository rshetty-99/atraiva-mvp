"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import {
  Gavel,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Edit,
  Save,
  X,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Regulation } from "@/types/regulation";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function RegulationRUDPage() {
  const params = useParams();
  const router = useRouter();
  const regulationId = params.id as string;

  const [regulation, setRegulation] = useState<Regulation | null>(null);
  const [formData, setFormData] = useState<Partial<Regulation>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegulation();
  }, [regulationId]);

  const fetchRegulation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const docRef = doc(db, "regulations", regulationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Regulation;
        const fullRegulation = { ...data, id: docSnap.id };
        setRegulation(fullRegulation);
        setFormData(fullRegulation);
      } else {
        setError("Regulation not found");
        toast.error("Regulation not found");
      }
    } catch (err) {
      console.error("Error fetching regulation:", err);
      setError("Failed to load regulation details");
      toast.error("Failed to load regulation details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!regulation) return;

    try {
      setIsSaving(true);

      const response = await fetch(`/api/regulations/${regulationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update regulation");
      }

      toast.success("Regulation updated successfully!");
      setRegulation(data.regulation);
      setFormData(data.regulation);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating regulation:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update regulation"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/regulations/${regulationId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete regulation");
      }

      toast.success("Regulation deleted successfully!");
      
      // Redirect to regulations list after a brief delay
      setTimeout(() => {
        router.push("/admin/reference/state-regulations");
      }, 1000);
    } catch (error) {
      console.error("Error deleting regulation:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete regulation"
      );
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(regulation || {});
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pb-6 pt-20 sm:px-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading regulation details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !regulation) {
    return (
      <div className="container mx-auto px-4 pb-6 pt-20 sm:px-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              {error || "Regulation Not Found"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 pb-6 pt-20 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Regulations
        </Button>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Gavel className="h-8 w-8 text-primary" />
              {isEditing ? "Edit Regulation" : regulation.regulationName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Update regulation details below"
                : "View and manage regulation details"}
            </p>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                {regulation.references?.url && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(regulation.references?.url!, "_blank")
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Source
                  </Button>
                )}
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this regulation?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the regulation &quot;{regulation.regulationName}
                        &quot; from the database.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Regulation Details</CardTitle>
            <CardDescription>
              {isEditing
                ? "Edit the fields below and click Save Changes"
                : "Complete information about this regulation"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="regulationName">Regulation Name *</Label>
                  {isEditing ? (
                    <Input
                      id="regulationName"
                      value={formData.regulationName || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          regulationName: e.target.value,
                        })
                      }
                      placeholder="Enter regulation name"
                    />
                  ) : (
                    <p className="text-sm py-2">{regulation.regulationName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Jurisdiction *</Label>
                  {isEditing ? (
                    <Input
                      id="state"
                      value={formData.state || formData.stateCode || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value, stateCode: e.target.value })
                      }
                      placeholder="e.g., CA, NY, FEDERAL"
                    />
                  ) : (
                    <p className="text-sm py-2">
                      {regulation.state || regulation.stateCode || "N/A"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jurisdictionType">Jurisdiction Type *</Label>
                  {isEditing ? (
                    <Select
                      value={formData.jurisdictionType || ""}
                      onValueChange={(value: "state" | "federal") =>
                        setFormData({ ...formData, jurisdictionType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="state">State</SelectItem>
                        <SelectItem value="federal">Federal</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-2 capitalize">
                      {regulation.jurisdictionType}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jurisdictionName">Jurisdiction Name *</Label>
                  {isEditing ? (
                    <Input
                      id="jurisdictionName"
                      value={formData.jurisdictionName || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jurisdictionName: e.target.value,
                        })
                      }
                      placeholder="Full jurisdiction name"
                    />
                  ) : (
                    <p className="text-sm py-2">
                      {regulation.jurisdictionName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regulationType">Regulation Type</Label>
                  {isEditing ? (
                    <Select
                      value={formData.regulationType || ""}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, regulationType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="privacy">Privacy</SelectItem>
                        <SelectItem value="breach_notification">
                          Breach Notification
                        </SelectItem>
                        <SelectItem value="data_protection">
                          Data Protection
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-2">
                      {regulation.regulationType
                        ?.replace(/_/g, " ")
                        .toUpperCase() || "N/A"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  {isEditing ? (
                    <Input
                      id="industry"
                      value={formData.industry || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
                      }
                      placeholder="e.g., General, Healthcare"
                    />
                  ) : (
                    <p className="text-sm py-2">
                      {regulation.industry || "N/A"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select
                      value={formData.status || ""}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="superseded">Superseded</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-2 capitalize">
                      {regulation.status || "N/A"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date</Label>
                  {isEditing ? (
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={formData.effectiveDate?.split("T")[0] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          effectiveDate: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : undefined,
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm py-2">
                      {regulation.effectiveDate
                        ? new Date(regulation.effectiveDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Scope</Label>
                {isEditing ? (
                  <Textarea
                    id="scope"
                    value={
                      typeof formData.scope === "string" ? formData.scope : ""
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, scope: e.target.value })
                    }
                    placeholder="Describe the scope of this regulation"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm py-2">
                    {typeof regulation.scope === "string"
                      ? regulation.scope
                      : JSON.stringify(regulation.scope, null, 2)}
                  </p>
                )}
              </div>
            </div>

            {/* Breach Notification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Breach Notification</h3>
              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="breachRequired"
                    checked={formData.breachNotification?.required || false}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        breachNotification: {
                          ...formData.breachNotification,
                          required: checked as boolean,
                        },
                      })
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="breachRequired">
                    Breach Notification Required
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timelineDays">Timeline (Days)</Label>
                  {isEditing ? (
                    <Input
                      id="timelineDays"
                      type="number"
                      value={formData.breachNotification?.timelineDays || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          breachNotification: {
                            ...formData.breachNotification,
                            timelineDays: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          },
                        })
                      }
                      placeholder="Days"
                    />
                  ) : (
                    <p className="text-sm py-2">
                      {regulation.breachNotification?.timelineDays || "N/A"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thresholdRecords">
                    Threshold Records
                  </Label>
                  {isEditing ? (
                    <Input
                      id="thresholdRecords"
                      type="number"
                      value={
                        formData.breachNotification?.thresholdRecords || ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          breachNotification: {
                            ...formData.breachNotification,
                            thresholdRecords: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          },
                        })
                      }
                      placeholder="Number of records"
                    />
                  ) : (
                    <p className="text-sm py-2">
                      {regulation.breachNotification?.thresholdRecords ||
                        "N/A"}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifyAG"
                    checked={
                      formData.breachNotification?.notifyAttorneyGeneral ||
                      false
                    }
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        breachNotification: {
                          ...formData.breachNotification,
                          notifyAttorneyGeneral: checked as boolean,
                        },
                      })
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="notifyAG">Notify Attorney General</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifySubjects"
                    checked={
                      formData.breachNotification?.notifyDataSubjects || false
                    }
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        breachNotification: {
                          ...formData.breachNotification,
                          notifyDataSubjects: checked as boolean,
                        },
                      })
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="notifySubjects">Notify Data Subjects</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifyCRA"
                    checked={
                      formData.breachNotification
                        ?.notifyConsumerReportingAgencies || false
                    }
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        breachNotification: {
                          ...formData.breachNotification,
                          notifyConsumerReportingAgencies: checked as boolean,
                        },
                      })
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="notifyCRA">Notify CRAs</Label>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Requirements</h3>
              <Separator />

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { key: "dataInventory", label: "Data Inventory" },
                  { key: "riskAssessment", label: "Risk Assessment" },
                  { key: "securityProgram", label: "Security Program" },
                  { key: "vendorManagement", label: "Vendor Management" },
                  { key: "incidentResponse", label: "Incident Response" },
                  { key: "dataRetention", label: "Data Retention" },
                  { key: "rightToDelete", label: "Right to Delete" },
                  { key: "rightToAccess", label: "Right to Access" },
                  { key: "rightToCorrect", label: "Right to Correct" },
                  { key: "rightToOptOut", label: "Right to Opt Out" },
                  {
                    key: "encryptionSafeHarbor",
                    label: "Encryption Safe Harbor",
                  },
                ].map((req) => (
                  <div key={req.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={req.key}
                      checked={
                        (formData.requirements?.[
                          req.key as keyof typeof formData.requirements
                        ] as boolean) || false
                      }
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          requirements: {
                            ...formData.requirements,
                            [req.key]: checked as boolean,
                          },
                        })
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor={req.key}>{req.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Penalties */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Penalties</h3>
              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="civilPenalty">
                    Civil Penalty Per Violation ($)
                  </Label>
                  {isEditing ? (
                    <Input
                      id="civilPenalty"
                      type="number"
                      value={formData.penalties?.civilPenaltyPerViolation || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          penalties: {
                            ...formData.penalties,
                            civilPenaltyPerViolation: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          },
                        })
                      }
                      placeholder="Amount"
                    />
                  ) : (
                    <p className="text-sm py-2">
                      {regulation.penalties?.civilPenaltyPerViolation
                        ? `$${regulation.penalties.civilPenaltyPerViolation.toLocaleString()}`
                        : "N/A"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPenalty">Max Civil Penalty ($)</Label>
                  {isEditing ? (
                    <Input
                      id="maxPenalty"
                      type="number"
                      value={formData.penalties?.maxCivilPenalty || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          penalties: {
                            ...formData.penalties,
                            maxCivilPenalty: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          },
                        })
                      }
                      placeholder="Amount"
                    />
                  ) : (
                    <p className="text-sm py-2">
                      {regulation.penalties?.maxCivilPenalty
                        ? `$${regulation.penalties.maxCivilPenalty.toLocaleString()}`
                        : "N/A"}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="criminalPenalties"
                    checked={formData.penalties?.criminalPenalties || false}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        penalties: {
                          ...formData.penalties,
                          criminalPenalties: checked as boolean,
                        },
                      })
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="criminalPenalties">
                    Criminal Penalties
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="attorneyFees"
                    checked={formData.penalties?.attorneyFees || false}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        penalties: {
                          ...formData.penalties,
                          attorneyFees: checked as boolean,
                        },
                      })
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="attorneyFees">Attorney Fees</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="classAction"
                    checked={formData.penalties?.classActionAllowed || false}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        penalties: {
                          ...formData.penalties,
                          classActionAllowed: checked as boolean,
                        },
                      })
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="classAction">Class Action Allowed</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privateRight"
                    checked={formData.penalties?.privateRightOfAction || false}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        penalties: {
                          ...formData.penalties,
                          privateRightOfAction: checked as boolean,
                        },
                      })
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="privateRight">Private Right of Action</Label>
                </div>
              </div>
            </div>

            {/* References */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">References</h3>
              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="statuteNumber">Statute Number</Label>
                  {isEditing ? (
                    <Input
                      id="statuteNumber"
                      value={formData.references?.statuteNumber || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          references: {
                            ...formData.references,
                            statuteNumber: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., Cal. Civ. Code § 1798.82"
                    />
                  ) : (
                    <p className="text-sm py-2">
                      {regulation.references?.statuteNumber || "N/A"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referenceUrl">Reference URL</Label>
                  {isEditing ? (
                    <Input
                      id="referenceUrl"
                      type="url"
                      value={formData.references?.url || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          references: {
                            ...formData.references,
                            url: e.target.value,
                          },
                        })
                      }
                      placeholder="https://..."
                    />
                  ) : (
                    <p className="text-sm py-2 truncate">
                      {regulation.references?.url || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              {isEditing ? (
                <Textarea
                  id="notes"
                  value={
                    typeof formData.notes === "string" ? formData.notes : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes or comments"
                  rows={4}
                />
              ) : (
                <p className="text-sm py-2">
                  {typeof regulation.notes === "string"
                    ? regulation.notes
                    : regulation.notes
                    ? JSON.stringify(regulation.notes, null, 2)
                    : "N/A"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
