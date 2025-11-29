"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { incidentService, incidentStatusQueries, organizationService } from "@/lib/firestore/collections";
import type { IncidentSimulation, IncidentStatus, Organization } from "@/lib/firestore/types";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export default function IncidentReportPage() {
  const params = useParams();
  const incidentId = params.incidentId as string;
  
  const [incident, setIncident] = useState<IncidentSimulation | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<IncidentStatus | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        
        // Load incident
        const incidentData = await incidentService.getById(incidentId);
        if (!incidentData) {
          setError("Incident not found");
          return;
        }
        setIncident(incidentData);

        // Load organization
        if (incidentData.ownership.organizationId) {
          const orgData = await organizationService.getById(incidentData.ownership.organizationId);
          setOrganization(orgData);
        }

        // Load analysis status
        const statusData = await incidentStatusQueries.getLatestByIncident(incidentId);
        setAnalysisStatus(statusData);
      } catch (err) {
        console.error("Error loading report data:", err);
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    if (incidentId) {
      loadReportData();
    }
  }, [incidentId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ marginTop: "140px" }}>
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ marginTop: "140px" }}>
        <div className="text-center">
          <p className="text-destructive">{error || "Incident not found"}</p>
        </div>
      </div>
    );
  }

  return <IncidentReportContent incident={incident} analysisStatus={analysisStatus} organization={organization} />;
}

interface IncidentReportContentProps {
  incident: IncidentSimulation;
  analysisStatus: IncidentStatus | null;
  organization: Organization | null;
}

function IncidentReportContent({ incident, analysisStatus, organization }: IncidentReportContentProps) {
  const severity = incident.severity || "unknown";
  
  // Handle Firestore Timestamp conversion
  const getDate = (dateValue: Date | Timestamp | string | undefined): Date => {
    if (!dateValue) return new Date();
    if (dateValue instanceof Date) return dateValue;
    if (dateValue instanceof Timestamp) return dateValue.toDate();
    if (typeof dateValue === 'string') return new Date(dateValue);
    return new Date();
  };
  
  const discoveryDate = getDate(incident.initialDetails?.incidentDiscoveryDate);
  
  const reportGeneratedAt = new Date();
  const reportId = `RPT-INC-${format(reportGeneratedAt, "yyyyMMdd")}-${incident.id.slice(-4)}`;
  
  // Format severity badge
  const severityBadgeClass = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
    unknown: "bg-gray-500",
  }[severity] || "bg-gray-500";

  // Get incident type
  const incidentTypes = incident.discovery?.incidentTypes || [];
  const primaryIncidentType = incidentTypes[0] || "Unknown";
  const incidentTypeLabels: Record<string, string> = {
    ransomware: "Ransomware",
    bec_phishing: "Business Email Compromise (BEC) / Phishing",
    unauthorized_access: "Unauthorized Access",
    lost_stolen_device: "Lost or Stolen Device",
    accidental_exposure: "Accidental Data Exposure",
    insider_threat: "Insider Threat",
    unknown: "Unknown",
  };

  // Get estimated records affected
  const recordsAffected = incident.dataScope?.estimatedRecordsAffected || "unknown";
  const recordsLabels: Record<string, { label: string; value: number }> = {
    under_1k: { label: "Under 1,000", value: 500 },
    "1k_10k": { label: "1,000 - 10,000", value: 5000 },
    "10k_100k": { label: "10,000 - 100,000", value: 50000 },
    over_100k: { label: "Over 100,000", value: 150000 },
    unknown: { label: "Unknown", value: 0 },
  };
  const estimatedRecords = recordsLabels[recordsAffected]?.value || 0;

  // Get data classification from analysis
  const dataClassification = analysisStatus?.analysisResults?.dataClassification;
  const piiCount = dataClassification?.piiCount || 0;
  const phiCount = dataClassification?.phiCount || 0;
  const pciCount = dataClassification?.pciCount || 0;
  const otherSensitiveCount = dataClassification?.otherSensitiveCount || 0;

  // Calculate financial impact (placeholder - would come from analysis)
  const totalCost = estimatedRecords > 0 ? estimatedRecords * 396.40 : 0;
  const costBreakdown = {
    detection: totalCost * 0.08,
    notification: totalCost * 0.11,
    postBreach: totalCost * 0.28,
    lostBusiness: totalCost * 0.38,
    legal: totalCost * 0.15,
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900" style={{ marginTop: "140px" }}>
      <button
        onClick={() => window.print()}
        className="fixed bottom-8 right-8 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 z-50 print:hidden"
      >
        📄 Print Report
      </button>

      <div className="max-w-6xl mx-auto p-5">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-10 rounded-t-xl relative">
          <h1 className="text-4xl font-bold mb-2">Breach Incident Analysis Report</h1>
          <div className="text-xl opacity-95">{organization?.name || "Organization"}</div>
          <div className={`absolute top-10 right-10 ${severityBadgeClass} text-white px-5 py-2 rounded-full font-bold uppercase animate-pulse`}>
            {severity} RISK
          </div>
          <div className="flex justify-between mt-5 pt-5 border-t border-white/30">
            <div>
              <strong>Report ID:</strong> {reportId}<br />
              <strong>Incident ID:</strong> {incident.id}
            </div>
            <div>
              <strong>Organization ID:</strong> {incident.ownership.organizationId}<br />
              <strong>Generated:</strong> {format(reportGeneratedAt, "yyyy-MM-dd HH:mm:ss")}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg">
          {/* Executive Summary */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-5 flex items-center">
              <span className="mr-2">📊</span> Executive Summary
            </h2>
            <div className="bg-gray-50 dark:bg-gray-900/50 border-l-4 border-purple-600 p-5 rounded">
              <p><strong>Incident Type:</strong> {incidentTypeLabels[primaryIncidentType]}</p>
              <p className="mt-2"><strong>Description:</strong> {incident.discovery?.summary || "No description provided"}</p>
              <p className="mt-2"><strong>Discovery Date:</strong> {format(discoveryDate, "yyyy-MM-dd")}</p>
              <p className="mt-2"><strong>Exposure Window:</strong> 45 days</p>
              <p className="mt-2"><strong>Current Status:</strong> {incident.status === "simulation_completed" ? "Analysis Complete" : "Contained Pending Analysis"}</p>
            </div>
          </div>

          {/* Impact Assessment */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-5 flex items-center">
              <span className="mr-2">⚠️</span> Impact Assessment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-5">
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-5 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {estimatedRecords.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase">Individuals Affected</div>
              </div>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-5 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {incident.dataScope?.dataSources?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase">Sensitive Assets</div>
              </div>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-5 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">10</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase">States Affected</div>
              </div>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-5 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {incident.dataScope?.dataTypes?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase">PII Types Found</div>
              </div>
            </div>

            <h3 className="mt-8 mb-4 font-semibold">Data Types Compromised</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">Data Type</th>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">Category</th>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">Sensitivity</th>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">Occurrences</th>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {incident.dataScope?.dataTypes?.map((type, idx) => {
                    const typeLabels: Record<string, { label: string; category: string; sensitivity: string }> = {
                      pii: { label: "Personal Identifiable Information (PII)", category: "Personal", sensitivity: "Critical" },
                      financial: { label: "Financial Records", category: "Financial", sensitivity: "Critical" },
                      phi: { label: "Healthcare Information (PHI)", category: "Health", sensitivity: "Critical" },
                      ip_trade_secrets: { label: "Intellectual Property/Trade Secrets", category: "IP", sensitivity: "High" },
                      customer_data: { label: "Customer Data", category: "Business", sensitivity: "High" },
                      employee_data: { label: "Employee Data", category: "HR", sensitivity: "High" },
                      pci: { label: "Payment Card Information", category: "Financial", sensitivity: "Critical" },
                      unknown: { label: "Unknown", category: "Unknown", sensitivity: "Medium" },
                    };
                    const typeInfo = typeLabels[type] || typeLabels.unknown;
                    return (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="p-3 border-b border-gray-200 dark:border-gray-700">{typeInfo.label}</td>
                        <td className="p-3 border-b border-gray-200 dark:border-gray-700">{typeInfo.category}</td>
                        <td className="p-3 border-b border-gray-200 dark:border-gray-700">{typeInfo.sensitivity}</td>
                        <td className="p-3 border-b border-gray-200 dark:border-gray-700">{Math.floor(estimatedRecords * 0.1)}</td>
                        <td className="p-3 border-b border-gray-200 dark:border-gray-700">
                          <span className={typeInfo.sensitivity === "Critical" ? "text-red-500" : "text-orange-500"}>●</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compliance Requirements */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-5 flex items-center">
              <span className="mr-2">⚖️</span> Compliance & Regulatory Requirements
            </h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded mb-5">
              <strong>⚠️ Notification Deadlines:</strong> Multiple jurisdictions have specific breach notification requirements. 
              Immediate action is required to meet statutory deadlines.
            </div>
            <h3 className="font-semibold mb-3">Federal Requirements</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">Regulation</th>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">Reason</th>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">Deadline</th>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">Action Required</th>
                  </tr>
                </thead>
                <tbody>
                  {pciCount > 0 && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700"><strong>PCI DSS</strong></td>
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700">Payment card data detected</td>
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700">Immediately</td>
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700">Notify card brands and acquirer bank</td>
                    </tr>
                  )}
                  {(incident.dataScope?.dataTypes?.includes("financial") || incident.dataScope?.dataTypes?.includes("pii")) && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700"><strong>GLBA</strong></td>
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700">Financial information detected</td>
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700">As soon as possible</td>
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700">Notify affected customers and regulators</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <h3 className="mt-8 font-semibold mb-3">State Requirements</h3>
            <p className="mb-4">The following states require breach notification based on affected residents:</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">State</th>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">Deadline</th>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">AG Notification Threshold</th>
                    <th className="bg-gray-50 dark:bg-gray-900 p-3 text-left font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-gray-200 dark:border-gray-700">Statute</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { state: "CA", deadline: "without unreasonable delay", threshold: "500", statute: "Cal. Civ. Code § 1798.82" },
                    { state: "CO", deadline: "reasonable time", threshold: "1000", statute: "CO Data Breach Notification Law" },
                    { state: "IL", deadline: "without unreasonable delay", threshold: "500", statute: "815 ILCS 530/1" },
                    { state: "MA", deadline: "without unreasonable delay", threshold: "250", statute: "Mass. Gen. Laws ch. 93H" },
                    { state: "NC", deadline: "reasonable time", threshold: "1000", statute: "NC Data Breach Notification Law" },
                    { state: "NY", deadline: "without unreasonable delay", threshold: "5000", statute: "N.Y. Gen. Bus. Law § 899-aa" },
                    { state: "OR", deadline: "reasonable time", threshold: "1000", statute: "OR Data Breach Notification Law" },
                    { state: "TX", deadline: "without unreasonable delay (max 60 days)", threshold: "250", statute: "Tex. Bus. & Com. Code § 521.053" },
                    { state: "VA", deadline: "reasonable time", threshold: "1000", statute: "VA Data Breach Notification Law" },
                    { state: "WA", deadline: "without unreasonable delay", threshold: "500", statute: "RCW 19.255.010" },
                  ].map((state, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700"><strong>{state.state}</strong></td>
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700">{state.deadline}</td>
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700">{state.threshold}</td>
                      <td className="p-3 border-b border-gray-200 dark:border-gray-700 text-sm">{state.statute}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Impact */}
          {totalCost > 0 && (
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-5 flex items-center">
                <span className="mr-2">💰</span> Financial Impact Analysis
              </h2>
              <div className="flex flex-col lg:flex-row gap-8 my-8">
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 h-8 rounded mb-2 relative flex items-center justify-end pr-3" style={{ width: `${(costBreakdown.detection / costBreakdown.lostBusiness) * 100}%` }}>
                      <span className="text-white font-bold">${(costBreakdown.detection / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Detection And Escalation</div>
                  </div>
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 h-8 rounded mb-2 relative flex items-center justify-end pr-3" style={{ width: `${(costBreakdown.notification / costBreakdown.lostBusiness) * 100}%` }}>
                      <span className="text-white font-bold">${(costBreakdown.notification / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Notification</div>
                  </div>
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 h-8 rounded mb-2 relative flex items-center justify-end pr-3" style={{ width: `${(costBreakdown.postBreach / costBreakdown.lostBusiness) * 100}%` }}>
                      <span className="text-white font-bold">${(costBreakdown.postBreach / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Post Breach Response</div>
                  </div>
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 h-8 rounded mb-2 relative flex items-center justify-end pr-3" style={{ width: "100%" }}>
                      <span className="text-white font-bold">${(costBreakdown.lostBusiness / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Lost Business</div>
                  </div>
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 h-8 rounded mb-2 relative flex items-center justify-end pr-3" style={{ width: `${(costBreakdown.legal / costBreakdown.lostBusiness) * 100}%` }}>
                      <span className="text-white font-bold">${(costBreakdown.legal / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Legal And Regulatory</div>
                  </div>
                </div>
                <div className="w-full lg:w-80 bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
                  <h3 className="text-purple-600 dark:text-purple-400 font-semibold mb-4">Total Estimated Cost</h3>
                  <div className="text-4xl font-bold text-red-500 mb-2">${(totalCost / 1000000).toFixed(2)}M</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <strong>Range:</strong><br />
                    Low: ${(totalCost * 0.8 / 1000000).toFixed(2)}M<br />
                    High: ${(totalCost * 1.3 / 1000000).toFixed(2)}M
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <strong>Cost Per Record:</strong><br />
                    ${(totalCost / estimatedRecords).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recovery Timeline */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-5 flex items-center">
              <span className="mr-2">📅</span> Recovery Timeline
            </h2>
            <div className="relative py-5">
              <div className="space-y-8">
                <div className="flex">
                  <div className="w-20 flex-shrink-0 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{format(discoveryDate, "d")}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{format(discoveryDate, "MMM")}</div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg ml-5">
                    <h4 className="font-semibold mb-1">Detection</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Breach discovered and initial assessment begun</p>
                    <p className="text-purple-600 dark:text-purple-400 text-sm mt-1"><strong>{format(discoveryDate, "yyyy-MM-dd")}</strong></p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-20 flex-shrink-0 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Dec</div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg ml-5">
                    <h4 className="font-semibold mb-1">Containment</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Isolate affected systems and prevent further damage</p>
                    <p className="text-purple-600 dark:text-purple-400 text-sm mt-1"><strong>4 hours to complete</strong></p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-20 flex-shrink-0 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Dec</div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg ml-5">
                    <h4 className="font-semibold mb-1">Eradication</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Remove threat actors and vulnerabilities</p>
                    <p className="text-purple-600 dark:text-purple-400 text-sm mt-1"><strong>5 days estimated</strong></p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-20 flex-shrink-0 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Dec</div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg ml-5">
                    <h4 className="font-semibold mb-1">Recovery</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Restore systems and return to normal operations</p>
                    <p className="text-purple-600 dark:text-purple-400 text-sm mt-1"><strong>15 days estimated</strong></p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-20 flex-shrink-0 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Dec</div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg ml-5">
                    <h4 className="font-semibold mb-1">Lessons Learned</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Post-incident review and improvements</p>
                    <p className="text-purple-600 dark:text-purple-400 text-sm mt-1"><strong>45 days for review</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Immediate Action Items */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-5 flex items-center">
              <span className="mr-2">🎯</span> Immediate Action Items
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-5 my-8">
              <h3 className="text-blue-700 dark:text-blue-300 font-semibold mb-4 flex items-center">
                <span className="mr-2 text-xl">🚨</span> Critical Actions (Within 24 Hours)
              </h3>
              <ul className="list-none space-y-3">
                {analysisStatus?.analysisResults?.recommendations?.slice(0, 5).map((rec, idx) => (
                  <li key={idx} className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3 last:border-0">
                    <span className="absolute left-0 text-red-500 font-bold text-xl">!</span>
                    {rec}
                  </li>
                )) || (
                  <>
                    <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                      <span className="absolute left-0 text-red-500 font-bold text-xl">!</span>
                      Activate incident response team and establish command center
                    </li>
                    <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                      <span className="absolute left-0 text-red-500 font-bold text-xl">!</span>
                      Engage legal counsel for breach notification requirements
                    </li>
                    <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                      <span className="absolute left-0 text-red-500 font-bold text-xl">!</span>
                      Contact cyber insurance carrier to initiate claim
                    </li>
                    <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                      <span className="absolute left-0 text-red-500 font-bold text-xl">!</span>
                      Preserve all evidence for forensic investigation
                    </li>
                    <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                      <span className="absolute left-0 text-red-500 font-bold text-xl">!</span>
                      Begin preparing notification templates for affected individuals
                    </li>
                  </>
                )}
              </ul>
              
              <h3 className="text-blue-700 dark:text-blue-300 font-semibold mb-4 mt-6 flex items-center">
                <span className="mr-2 text-xl">⏰</span> High Priority (Within 48-72 Hours)
              </h3>
              <ul className="list-none space-y-3">
                <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                  <span className="absolute left-0 text-orange-500 font-bold text-xl">○</span>
                  Complete forensic analysis to determine full scope
                </li>
                <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                  <span className="absolute left-0 text-orange-500 font-bold text-xl">○</span>
                  Finalize list of affected individuals and their contact information
                </li>
                <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                  <span className="absolute left-0 text-orange-500 font-bold text-xl">○</span>
                  Prepare Attorney General notifications for states exceeding thresholds
                </li>
                <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                  <span className="absolute left-0 text-orange-500 font-bold text-xl">○</span>
                  Draft press release and public communications strategy
                </li>
                <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                  <span className="absolute left-0 text-orange-500 font-bold text-xl">○</span>
                  Establish call center for incoming inquiries
                </li>
              </ul>
              
              <h3 className="text-blue-700 dark:text-blue-300 font-semibold mb-4 mt-6 flex items-center">
                <span className="mr-2 text-xl">📋</span> Ongoing Actions
              </h3>
              <ul className="list-none space-y-3">
                <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                  <span className="absolute left-0 text-green-500 font-bold text-xl">✓</span>
                  Monitor dark web for evidence of data being sold or distributed
                </li>
                <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                  <span className="absolute left-0 text-green-500 font-bold text-xl">✓</span>
                  Implement additional security controls to prevent recurrence
                </li>
                <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                  <span className="absolute left-0 text-green-500 font-bold text-xl">✓</span>
                  Coordinate with law enforcement if criminal activity suspected
                </li>
                <li className="pl-8 relative border-b border-blue-200 dark:border-blue-800 pb-3">
                  <span className="absolute left-0 text-green-500 font-bold text-xl">✓</span>
                  Document all actions taken for compliance and insurance purposes
                </li>
                <li className="pl-8 relative">
                  <span className="absolute left-0 text-green-500 font-bold text-xl">✓</span>
                  Prepare for potential regulatory investigations
                </li>
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          {analysisStatus?.analysisResults?.recommendations && analysisStatus.analysisResults.recommendations.length > 0 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-5 flex items-center">
                <span className="mr-2">💡</span> Atraiva Recommendations
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded mb-5">
                <strong>ℹ️ Based on our analysis of similar incidents in your industry:</strong>
              </div>
              <ul className="space-y-3 leading-relaxed">
                {analysisStatus.analysisResults.recommendations.map((rec, idx) => (
                  <li key={idx}><strong>•</strong> {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center p-10 text-gray-600 dark:text-gray-400 text-sm">
          <p className="font-semibold mb-2">Atraiva Breach Notification Platform</p>
          <p className="mb-2">This report contains confidential and privileged information. Distribution is limited to authorized personnel only.</p>
          <p className="mb-5">© 2025 Atraiva Inc. All rights reserved. | support@atraiva.ai | 1-800-ATRAIVA</p>
          <p className="text-xs mt-5">
            Report generated by Atraiva Platform v2.1.0 | Compliance Engine v1.5.0 | Risk Model v3.0.0<br />
            {incident.purviewScan && `Data sourced from Microsoft Purview integration completed on ${format(getDate(incident.purviewScan.uploadedAt), "yyyy-MM-dd")}`}
          </p>
        </div>
      </div>
    </div>
  );
}

