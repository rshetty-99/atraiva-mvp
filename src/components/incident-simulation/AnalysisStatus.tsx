"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { incidentStatusQueries } from "@/lib/firestore/collections";
import type { IncidentStatus } from "@/lib/firestore/types";
import { onSnapshot, query, where, collection, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { collections } from "@/lib/firestore/collections";

interface AnalysisStatusProps {
  incidentId: string;
  onTriggerAnalysis?: () => void;
}

export function AnalysisStatus({ incidentId, onTriggerAnalysis }: AnalysisStatusProps) {
  const [status, setStatus] = useState<IncidentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to status updates
    const q = query(
      collection(db, collections.incidentStatuses),
      where("incidentId", "==", incidentId),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setStatus({
            id: doc.id,
            ...doc.data(),
          } as IncidentStatus);
        } else {
          setStatus(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to status updates:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [incidentId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading analysis status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">No analysis started</p>
              <p className="text-xs text-muted-foreground">
                Analysis will begin automatically after submission
              </p>
            </div>
            {onTriggerAnalysis && (
              <Button size="sm" onClick={onTriggerAnalysis}>
                Start Analysis
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "analyzing":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    const variants: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200",
      analyzing: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200",
      completed: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200",
    };

    return (
      <Badge className={variants[status.status] || ""}>
        {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Analysis Status
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.status === "analyzing" && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Analyzing incident data and Purview scan...
            </p>
            <Progress value={50} className="w-full" />
          </div>
        )}

        {status.status === "completed" && status.analysisResults && (
          <div className="space-y-4">
            {status.analysisResults.insights && status.analysisResults.insights.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Key Insights</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {status.analysisResults.insights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            {status.analysisResults.risks && status.analysisResults.risks.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Identified Risks</h4>
                <div className="space-y-2">
                  {status.analysisResults.risks.map((risk, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Badge
                        variant={
                          risk.severity === "critical"
                            ? "destructive"
                            : risk.severity === "high"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {risk.severity}
                      </Badge>
                      <p className="text-sm text-muted-foreground flex-1">{risk.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status.analysisResults.recommendations &&
              status.analysisResults.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {status.analysisResults.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {status.status === "failed" && status.error && (
          <div className="rounded-md bg-red-50 dark:bg-red-950/20 p-3">
            <p className="text-sm text-red-800 dark:text-red-200">{status.error}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p>
            Triggered: {new Date(status.triggeredAt).toLocaleString()}
          </p>
          {status.completedAt && (
            <p>Completed: {new Date(status.completedAt).toLocaleString()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

