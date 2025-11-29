"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  File,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { validateScanFile } from "@/lib/firebase/incident-storage";
import type { PurviewScanFile } from "@/lib/firebase/incident-storage";

interface PurviewScanUploadProps {
  incidentId: string;
  organizationId: string;
  uploadedBy: string;
  existingScan?: PurviewScanFile | null;
  onUploadComplete: (scan: PurviewScanFile) => void;
  onUploadStart?: () => void;
  onUploadError?: () => void;
  onRemove: () => void;
}

export function PurviewScanUpload({
  incidentId,
  organizationId,
  uploadedBy,
  existingScan,
  onUploadComplete,
  onUploadStart,
  onUploadError,
  onRemove,
}: PurviewScanUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setUploading(false);
    setUploadProgress(0);
    setError("Upload canceled");
    onUploadError?.();
    toast.info("Upload canceled");
  }, [onUploadError]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setError(null);
      setUploading(true);
      setUploadProgress(0);
      onUploadStart?.();

      // Create new AbortController for this upload
      abortControllerRef.current = new AbortController();

      try {
        // Validate file
        const validation = validateScanFile(file);
        if (!validation.valid) {
          const errorMsg = validation.error || "Invalid file";
          setError(errorMsg);
          setUploading(false);
          onUploadError?.();
          toast.error(errorMsg);
          return;
        }

        // Upload via API route (server-side) to avoid CORS issues
        const formData = new FormData();
        formData.append("file", file);
        formData.append("organizationId", organizationId);

        // Simulate progress for better UX (since we can't track server-side upload progress easily)
        const progressInterval = setInterval(() => {
          // Check if upload was canceled
          if (abortControllerRef.current?.signal.aborted) {
            clearInterval(progressInterval);
            return;
          }
          setUploadProgress((prev) => {
            if (prev >= 90) return prev; // Don't go to 100% until upload completes
            return prev + 5;
          });
        }, 500);

        const response = await fetch(
          `/api/incidents/${incidentId}/upload-scan`,
          {
            method: "POST",
            body: formData,
            signal: abortControllerRef.current.signal,
          }
        );

        clearInterval(progressInterval);

        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Upload failed: ${response.statusText}`
          );
        }

        const data = await response.json();
        setUploadProgress(100);

        if (!data.success || !data.scan) {
          throw new Error("Upload failed: Invalid response from server");
        }

        onUploadComplete(data.scan);
        toast.success("Purview scan uploaded successfully");
        setUploading(false);
        setUploadProgress(0);
        abortControllerRef.current = null;
      } catch (err) {
        // Don't show error if upload was canceled
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to upload file. Please check your connection and try again.";
        setError(errorMessage);
        toast.error(errorMessage);
        setUploading(false);
        setUploadProgress(0);
        onUploadError?.();
        abortControllerRef.current = null;
      }
    },
    [incidentId, organizationId, onUploadComplete, onUploadStart, onUploadError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: uploading || !!existingScan,
  });

  const handleRemove = () => {
    if (confirm("Are you sure you want to remove this scan file?")) {
      onRemove();
      toast.success("Scan file removed");
    }
  };

  if (existingScan) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">{existingScan.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {(existingScan.fileSize / 1024 / 1024).toFixed(2)} MB •
                  Uploaded{" "}
                  {new Date(existingScan.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }
            ${uploading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div className="space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploading scan file...</p>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  {Math.round(uploadProgress)}% complete
                </p>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleCancel}
                  className="mt-2"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Upload
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
              <div>
                <p className="text-sm font-medium">
                  {isDragActive
                    ? "Drop the file here"
                    : "Upload Purview Scan File"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag and drop or click to select (JSON, CSV, Excel)
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 50MB
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
