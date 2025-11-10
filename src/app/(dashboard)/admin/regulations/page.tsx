"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Database,
  Clock,
  DollarSign,
  Globe,
  Search,
  Filter,
  X,
  List,
  Grid3x3,
  Flag,
  MapPin,
  ShieldCheck,
  Bookmark,
  ArrowRight,
} from "lucide-react";

// Mock data for regulations
const federalLaws = [
  {
    id: 1,
    name: "HIPAA Breach Notification Rule",
    citation: "45 CFR §§ 164.400-414",
    type: "FEDERAL",
    status: "ACTIVE",
    individualNotification: "60 days",
    regulatorNotification: "Without delay",
    individualTimeline: "moderate",
    regulatorTimeline: "urgent",
    requirements: [
      "Applies to HIPAA covered entities & business associates",
      "500+ individuals triggers HHS notification",
      "Max penalty: $50,000 per violation ($1.5M annual cap)",
    ],
    regulator: "HHS OCR",
  },
  {
    id: 2,
    name: "Health Breach Notification Rule",
    citation: "16 CFR Part 318",
    type: "FEDERAL",
    status: "ACTIVE",
    individualNotification: "60 days",
    regulatorNotification: "Without delay",
    individualTimeline: "moderate",
    regulatorTimeline: "urgent",
    requirements: [
      "Non-HIPAA health tech vendors (PHR vendors)",
      "500+ individuals triggers FTC notification",
      "Max penalty: $16,000 per violation",
    ],
    regulator: "FTC",
  },
];

const stateLaws = [
  {
    id: 1,
    state: "CALIFORNIA",
    name: "CA Breach & Med. Info Acts",
    citation: "Cal. Civ. Code § 1798.29 / 1798.82",
    timeline: '"Most expedient" / 15 biz days',
    timelineType: "urgent",
    requirements: [
      "Regulator: Immediately",
      "No specified penalty maximum",
      "Covers name + SSN/DL/financial data",
    ],
    regulator: "CA AG",
  },
  {
    id: 2,
    state: "ALABAMA",
    name: "Data Breach Notification Act",
    citation: "Ala. Code § 8-38-1 et seq.",
    timeline: "≤45 days",
    timelineType: "moderate",
    requirements: [
      "Regulator (AG): ≤45 days if 1,000+ affected",
      "Max penalty: $500,000 total",
      "Daily penalty: $5,000",
    ],
    regulator: "AL AG",
  },
  {
    id: 3,
    state: "ALASKA",
    name: "Personal Information Protection Act",
    citation: "Alaska Stat. § 45.48.010 et seq.",
    timeline: "ASAP / no delay",
    timelineType: "urgent",
    requirements: [
      "Applies to businesses >10 employees",
      "Max penalty: $50,000",
      "Criminal penalties available",
    ],
    regulator: "AK AG",
  },
  {
    id: 4,
    state: "ARIZONA",
    name: "Security Breach Notification Law",
    citation: "Ariz. Rev. Stat. § 18-551 / 552",
    timeline: "≤45 days",
    timelineType: "moderate",
    requirements: [
      "Regulator: ≤45 days",
      "Penalty: Not specified",
      "Updated 2022 (HB 2146)",
    ],
    regulator: "AZ AG",
  },
  {
    id: 5,
    state: "ARKANSAS",
    name: "Personal Information Protection Act",
    citation: "Ark. Code § 4-110-101 et seq.",
    timeline: "ASAP / ≤45 days",
    timelineType: "moderate",
    requirements: [
      "Regulator: ≤45 days",
      "Penalty: Not specified",
      "Electronic & paper records",
    ],
    regulator: "AR AG",
  },
  {
    id: 6,
    state: "COLORADO",
    name: "Colo. Breach Law",
    citation: "Colo. Rev. Stat. § 6-1-716",
    timeline: "≤30 days",
    timelineType: "moderate",
    requirements: [
      "Regulator: ≤30 days",
      "Penalty: Variable",
      "See Foley & Lardner reference",
    ],
    regulator: "CO AG",
  },
];

export default function RegulationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("");
  const [timelineFilter, setTimelineFilter] = useState("");
  const [penaltyFilter, setPenaltyFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const getTimelineBadgeClass = (type: string) => {
    const classes: Record<string, string> = {
      urgent:
        "bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium px-2 py-1 rounded text-center",
      moderate:
        "bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-medium px-2 py-1 rounded text-center",
      extended:
        "bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium px-2 py-1 rounded text-center",
    };
    return classes[type] || classes.moderate;
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting database...");
  };

  return (
    <div
      className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900"
      style={{ marginTop: "140px" }}
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Breach Notification Laws Database
          </h1>
          <Badge className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            57 JURISDICTIONS
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Database className="h-4 w-4 mr-1" />
            <span>Last updated: March 2024</span>
          </div>
          <div className="relative group">
            <Button
              onClick={handleExport}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              <span>Export Database</span>
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Download complete breach notification laws database
            </div>
          </div>
        </div>
      </div>

      {/* Summary Dashboard */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Breach Notification Requirements Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Federal Laws
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">50</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                State Laws
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">4</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Territories & DC
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">60 days</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Most Common Timeline
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                  Most Stringent
                </h3>
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                California: &quot;Most expedient&quot; timeline for notification
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-green-800 dark:text-green-300">
                  Highest Penalties
                </h3>
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                HIPAA: Up to $50,000 per violation + $1.5M annual cap
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300">
                  Coverage
                </h3>
                <Globe className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                All 50 states + DC + 3 territories have breach laws
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters & Search */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by law name, citation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <Select
              value={jurisdictionFilter}
              onValueChange={setJurisdictionFilter}
            >
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="All Jurisdictions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jurisdictions</SelectItem>
                <SelectItem value="federal">Federal</SelectItem>
                <SelectItem value="state">State</SelectItem>
                <SelectItem value="territory">Territory</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timelineFilter} onValueChange={setTimelineFilter}>
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Notification Timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Timelines</SelectItem>
                <SelectItem value="immediate">Immediate/ASAP</SelectItem>
                <SelectItem value="days30">≤30 days</SelectItem>
                <SelectItem value="days60">60 days</SelectItem>
                <SelectItem value="variable">Variable</SelectItem>
              </SelectContent>
            </Select>
            <Select value={penaltyFilter} onValueChange={setPenaltyFilter}>
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Penalty Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Penalties</SelectItem>
                <SelectItem value="high">High (&gt;$10,000)</SelectItem>
                <SelectItem value="medium">Medium ($1,000-$10,000)</SelectItem>
                <SelectItem value="low">Low (&lt;$1,000)</SelectItem>
                <SelectItem value="none">No specified penalty</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button
                variant="secondary"
                className="px-4 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulations Database */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Breach Notification Laws Database
          </h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing 57 laws
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Federal Laws Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <Flag className="h-5 w-5 mr-2 text-blue-500" />
            Federal Laws
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {federalLaws.map((law) => (
              <Card
                key={law.id}
                className="bg-white dark:bg-gray-800 shadow-md border-l-4 border-l-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2 gap-2">
                        <Badge className="text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/30">
                          {law.type}
                        </Badge>
                        <Badge className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600">
                          {law.status}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {law.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {law.citation}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block mb-1">
                          Individual Notification:
                        </span>
                        <p
                          className={getTimelineBadgeClass(
                            law.individualTimeline
                          )}
                        >
                          {law.individualNotification}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block mb-1">
                          Regulator Notification:
                        </span>
                        <p
                          className={getTimelineBadgeClass(
                            law.regulatorTimeline
                          )}
                        >
                          {law.regulatorNotification}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-2">
                        Key Requirements:
                      </h4>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {law.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start">
                            <ShieldCheck className="h-3 w-3 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Full Text
                        </a>
                        <a
                          href="#"
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Compliance Guide
                        </a>
                      </div>
                      <span className="text-xs text-gray-500">
                        {law.regulator}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* State Laws Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-green-500" />
            State Laws
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              (Showing 6 of 50)
            </span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {stateLaws.map((law) => (
              <Card
                key={law.id}
                className="bg-white dark:bg-gray-800 shadow-md border-l-4 border-l-green-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Badge className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30">
                          {law.state}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {law.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {law.citation}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400 block mb-1">
                        Notification Timeline:
                      </span>
                      <p className={getTimelineBadgeClass(law.timelineType)}>
                        {law.timeline}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {law.requirements.map((req, idx) => (
                          <li key={idx}>• {req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </a>
                      <span className="text-xs text-gray-500">
                        {law.regulator}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Show More Button */}
          <div className="text-center pt-6">
            <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              View All 50 State Laws
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
