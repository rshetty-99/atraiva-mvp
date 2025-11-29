"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Info, ExternalLink, Database, Cloud, FileSearch, ArrowLeft, Send } from "lucide-react";
import { IncidentSimulationStepProps } from "./types";
import { AnalysisStatus } from "./AnalysisStatus";
import { Badge } from "@/components/ui/badge";

export default function Step7({ 
  data, 
  onPrevious, 
  onNext, 
  incidentId,
  purviewScan 
}: IncidentSimulationStepProps) {

  // Check if Purview scan was uploaded
  const hasPurviewScan = purviewScan && data.step6?.purviewScanOption === "has_report";
  const needsHelp = data.step6?.purviewScanOption === "needs_help";

  // Default next steps for "needs help" scenario
  const defaultNextSteps = [
    { id: "purview", label: "Execute immediate Purview queries on identified systems", checked: true },
    { id: "regulatory", label: "Initiate regulatory notification timeline tracking", checked: true },
    { id: "stakeholder", label: "Schedule stakeholder notification calls", checked: true },
    { id: "preserve", label: "Preserve logs and evidence from affected systems", checked: true },
    { id: "coordinate", label: "Coordinate with IT for additional containment measures", checked: true },
  ];

  const handleSubmit = () => {
    // onNext is already set to handleSubmit from the parent component
    // which will save the data and redirect to /admin/incidents
    onNext();
  };

  // Show analysis status and action items if Purview scan was uploaded
  if (hasPurviewScan) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Purview Scan Analysis in Progress</h3>
          <p className="text-muted-foreground mb-4">
            Your incident simulation and Purview scan are being processed by our automated analysis system. 
            Here's what's happening behind the scenes:
          </p>
          
          {/* Backend Process Explanation */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Backend Processing Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">1. Data Storage</p>
                    <p className="text-blue-700 dark:text-blue-300 text-xs mt-0.5">
                      Your incident data and Purview scan file are being saved to the database
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Cloud className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">2. Analysis Trigger</p>
                    <p className="text-blue-700 dark:text-blue-300 text-xs mt-0.5">
                      Cloud-based analysis service is triggered to process your incident data and Purview scan
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <FileSearch className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">3. Data Analysis</p>
                    <p className="text-blue-700 dark:text-blue-300 text-xs mt-0.5">
                      AI-powered analysis is extracting insights, identifying risks, and generating recommendations from your Purview scan data
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">4. Results Generation</p>
                    <p className="text-blue-700 dark:text-blue-300 text-xs mt-0.5">
                      Analysis results including action items, risk assessments, and compliance gaps are being generated
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to View Results */}
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 mt-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                How to View Your Analysis Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-amber-900 dark:text-amber-100 font-medium mb-2">
                After submitting, you'll be redirected to the Incidents Queue. Here's how to track your analysis:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-amber-800 dark:text-amber-200">
                <li>
                  <strong>In the Incidents Queue table:</strong> Look for your incident ID. The status will show 
                  <Badge variant="secondary" className="ml-1 text-xs">Simulation Initialized</Badge> with a spinner 
                  while analysis is running
                </li>
                <li>
                  <strong>When analysis completes:</strong> The status will automatically update to 
                  <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200">
                    Simulation Completed
                  </Badge> and the spinner will disappear
                </li>
                <li>
                  <strong>View detailed report:</strong> Click on your incident ID or the 
                  <span className="inline-flex items-center gap-1 ml-1">
                    <span className="text-blue-600 dark:text-blue-400">View</span>
                    <ExternalLink className="h-3 w-3" />
                  </span> link in the Report column to see:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Complete analysis results and insights</li>
                    <li>Identified risks with severity levels</li>
                    <li>Recommended action items</li>
                    <li>Compliance gap analysis</li>
                    <li>Data classification summary</li>
                  </ul>
                </li>
              </ol>
              <p className="text-amber-800 dark:text-amber-200 text-xs mt-3 italic">
                💡 Tip: The analysis typically takes 2-5 minutes. You can refresh the page or the table will auto-update 
                when the status changes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Status */}
        {incidentId && (
          <AnalysisStatus incidentId={incidentId} />
        )}

        <div className="flex justify-between pt-4">
          <div>
            {onPrevious && (
              <Button type="button" variant="outline" onClick={onPrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>
              <Send className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default view for "needs help" scenario
  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground mb-6">
          Based on your responses, the system will automatically prioritize the following actions upon submission.
        </p>
        
        <div className="space-y-4">
          {defaultNextSteps.map((step) => (
            <div key={step.id} className="flex items-center space-x-3">
              <Checkbox checked={step.checked} disabled />
              <label className="text-sm font-normal cursor-pointer">
                {step.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <div>
          {onPrevious && (
            <Button type="button" variant="outline" onClick={onPrevious}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

