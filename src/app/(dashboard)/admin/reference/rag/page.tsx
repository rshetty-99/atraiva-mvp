"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import "./rag-styles.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Inbox, UploadCloud, Info, FileUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadProgress {
  fileName: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  message?: string;
}

export default function RagUploadPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress[]>([]);
  const [notes, setNotes] = useState("");

  const resetState = () => {
    setFiles(null);
    setProgress([]);
    setNotes("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
  };

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    
    // Convert File[] to FileList-like object
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach((file) => {
      dataTransfer.items.add(file);
    });
    setFiles(dataTransfer.files);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        toast.error("No valid files selected");
        return;
      }
      handleFilesSelected(acceptedFiles);
      toast.success(`${acceptedFiles.length} file(s) selected`);
    },
    [handleFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/markdown": [".md"],
    },
    multiple: true,
    disabled: uploading,
    maxFiles: 10,
  });

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      toast.error("Select at least one file before uploading");
      return;
    }

    const initialProgress: UploadProgress[] = Array.from(files).map((file) => ({
      fileName: file.name,
      status: "pending",
      progress: 0,
    }));
    setProgress(initialProgress);
    setUploading(true);

    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setProgress((prev) =>
          prev.map((entry, idx) =>
            idx === index
              ? { ...entry, status: "uploading", progress: 5 }
              : entry
          )
        );

        const formData = new FormData();
        formData.append("file", file);
        if (notes) {
          formData.append("notes", notes);
        }

        const response = await fetch("/api/admin/rag/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Upload failed");
        }

        setProgress((prev) =>
          prev.map((entry, idx) =>
            idx === index
              ? { ...entry, status: "success", progress: 100, message: "Uploaded" }
              : entry
          )
        );
      }

      toast.success("Upload completed. Gemini File Search will index the documents shortly.");
      resetState();
    } catch (error) {
      console.error(error);
      setProgress((prev) =>
        prev.map((entry) =>
          entry.status === "uploading" ? { ...entry, status: "error", message: "Upload failed" } : entry
        )
      );
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload files. Check server logs for details."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto space-y-6 px-4 pb-6 pt-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Inbox className="h-8 w-8 text-primary" />
            Intel Agent Upload
          </h1>
          <p className="text-muted-foreground">
            Upload PDFs, DOCX, or TXT documents to the Gemini File Search index so
            generative answers stay grounded in your latest reference material.
          </p>
        </div>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Configuration</AlertTitle>
        <AlertDescription>
          Ensure the following environment variables are available for the upload
          API: <code>GEMINI_API_KEY</code> (file storage scope) and
          <code>GEMINI_DATASTORE_ID</code>. The API route will reject requests if
          those credentials are missing.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rag-files">Files</Label>
              <div
                {...getRootProps()}
                className={cn(
                  "file-input-wrapper border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50",
                  uploading && "opacity-50 cursor-not-allowed"
                )}
              >
                <input {...getInputProps()} id="rag-files" />
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  {isDragActive ? (
                    <>
                      <FileUp className="h-8 w-8 text-primary" />
                      <p className="text-sm font-medium text-primary">
                        Drop files here...
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Drag & drop files here, or{" "}
                          <span className="text-primary underline">click to browse</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: PDF, DOC/DOCX, TXT, Markdown
                        </p>
                      </div>
                    </>
                  )}
                  {files && files.length > 0 && (
                    <Badge variant="outline" className="mt-2">
                      {files.length} file(s) selected
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Limit 10 files per upload.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rag-notes">Notes (optional)</Label>
              <Input
                id="rag-notes"
                placeholder="Add tags or ingestion context"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground">
                Notes are stored as metadata on the Gemini datastore record.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleUpload}
              disabled={uploading || !files || files.length === 0}
              className="inline-flex items-center gap-2"
            >
              <UploadCloud className="h-4 w-4" />
              {uploading ? "Uploading" : "Upload to ROSS"}
            </Button>
            {files ? (
              <Badge variant="outline">{files.length} file(s) selected</Badge>
            ) : null}
          </div>

          {progress.length ? (
            <div className="space-y-3">
              {progress.map((entry) => (
                <div key={entry.fileName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>{entry.fileName}</span>
                    <span>
                      {entry.status === "pending" && "Queued"}
                      {entry.status === "uploading" && "Uploading"}
                      {entry.status === "success" && "Success"}
                      {entry.status === "error" && "Failed"}
                    </span>
                  </div>
                  <Progress value={entry.progress} />
                  {entry.message ? (
                    <p className="text-xs text-muted-foreground">{entry.message}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
