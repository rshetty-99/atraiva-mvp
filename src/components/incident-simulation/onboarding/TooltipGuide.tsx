"use client";

import React, { useState, useRef, useEffect } from "react";
import { HelpCircle, X } from "lucide-react";
import { TooltipConfig } from "./config";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipGuideProps {
  config: TooltipConfig;
  fieldName?: string;
  show: boolean;
  children: React.ReactNode;
}

export function TooltipGuide({ config, show, children }: TooltipGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && containerRef.current && iconRef.current) {
      // Find the FormLabel element
      const label = containerRef.current.querySelector('[data-slot="form-label"]') as HTMLLabelElement;
      if (label) {
        // Make label relative and add padding for icon
        label.style.position = 'relative';
        label.style.paddingRight = '1.75rem';
        
        // Position icon relative to label
        const updateIconPosition = () => {
          const labelRect = label.getBoundingClientRect();
          const containerRect = containerRef.current!.getBoundingClientRect();
          
          // Convert 1.5rem to pixels (assuming 16px base font size)
          const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
          const offsetPixels = 1.5 * remInPixels;
          
          // Position icon at the end of label text (accounting for padding)
          iconRef.current!.style.position = 'absolute';
          iconRef.current!.style.top = `${labelRect.top - containerRect.top}px`;
          iconRef.current!.style.left = `${labelRect.right - containerRect.left - offsetPixels}px`;
        };
        
        updateIconPosition();
        // Update on resize
        const resizeObserver = new ResizeObserver(updateIconPosition);
        resizeObserver.observe(label);
        resizeObserver.observe(containerRef.current);
        
        return () => resizeObserver.disconnect();
      }
    }
  }, [show]);

  if (!show) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="relative">
      <TooltipProvider>
        <Tooltip open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            <div className="relative">
              {children}
              <div 
                ref={iconRef}
                style={{ 
                  transform: 'translateY(0.125rem)',
                  pointerEvents: 'auto',
                  zIndex: 10,
                }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded-full bg-primary/10 hover:bg-primary/20 p-0 flex-shrink-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                  }}
                >
                  <HelpCircle className="h-3 w-3 text-primary" />
                </Button>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side={config.position || "right"}
            className="max-w-xs"
            onPointerDownOutside={() => setIsOpen(false)}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-sm">{config.title}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{config.content}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
