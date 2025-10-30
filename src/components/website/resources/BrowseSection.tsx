"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const categories = [
  { id: "all", label: "Browse All", active: false },
  { id: "ai-security", label: "AI Security", active: true },
  { id: "ransomware", label: "Ransomware", active: false },
  { id: "cloud-protection", label: "Cloud Protection", active: false },
  { id: "threat-hunting", label: "Threat Hunting", active: false },
  { id: "incident-response", label: "Incident Response", active: false },
  { id: "zero-trust", label: "Zero Trust", active: false },
];

export function BrowseSection() {
  const [activeCategory, setActiveCategory] = useState("ai-security");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="bg-background pt-[100px] pb-20 px-20">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex gap-30">
          {/* Browse by Category */}
          <div className="flex flex-col gap-4 w-full">
            <h2 className="font-lato text-lg font-semibold leading-[1.2] text-left text-foreground">
              Browse by category
            </h2>
            <div className="flex flex-col gap-4">
              {/* First Row */}
              <div className="flex items-center gap-4 w-full">
                {categories.slice(0, 4).map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-4 h-12 rounded-[60px] text-base font-normal border ${
                      activeCategory === category.id
                        ? "bg-primary text-primary-foreground border-none"
                        : "bg-transparent text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

              {/* Second Row */}
              <div className="flex items-center gap-4">
                {categories.slice(4).map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-4 h-12 rounded-[60px] text-base font-normal border ${
                      activeCategory === category.id
                        ? "bg-primary text-primary-foreground border-none"
                        : "bg-transparent text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col justify-center gap-4">
            <h2 className="font-lato text-lg font-semibold leading-[1.2] text-left text-foreground">
              Search
            </h2>
            <div className="relative w-[400px]">
              <Input
                type="text"
                placeholder="Browse articles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-12 rounded-[60px] pl-5 pr-16"
              />
              <div className="absolute right-0 top-0 h-full bg-primary rounded-r-[60px] flex items-center justify-center px-4">
                <Search className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
