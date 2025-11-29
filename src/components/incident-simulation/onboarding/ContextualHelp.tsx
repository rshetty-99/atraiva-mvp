"use client";

import React from "react";
import { X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpSection } from "./config";
import { useOnboarding } from "./OnboardingProvider";

interface ContextualHelpProps {
  sections: HelpSection[];
  currentStep?: number;
}

export function ContextualHelp({ sections }: ContextualHelpProps) {
  const { state, toggleHelpPanel } = useOnboarding();

  if (!state.showHelpPanel || sections.length === 0) {
    return null;
  }

  return (
    <Card className="fixed right-4 top-1/2 -translate-y-1/2 w-80 h-[600px] z-50 shadow-lg !p-0">
      <CardHeader
        className="!flex !flex-row items-center justify-between space-y-0 border-b !grid-cols-none"
        style={{
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "24px",
          paddingBottom: "16px",
        }}
      >
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Help & Guidance
          </span>
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={toggleHelpPanel}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="!px-6 !py-4">
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="space-y-2">
                <h3 className="font-semibold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
