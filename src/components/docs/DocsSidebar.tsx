"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

interface DocsSidebarProps {
  navigation: NavItem[];
  onLinkClick?: () => void;
}

export function DocsSidebar({ navigation, onLinkClick }: DocsSidebarProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const isActive = (href: string) => {
    if (href === "/docs/public" || href === "/docs/support") {
      return pathname === href;
    }
    return pathname?.startsWith(href.split("#")[0]);
  };

  const toggleItem = (href: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  // Auto-expand active sections
  React.useEffect(() => {
    const newOpenItems: Record<string, boolean> = {};
    navigation.forEach((item) => {
      if (isActive(item.href)) {
        newOpenItems[item.href] = true;
      }
      if (item.children) {
        item.children.forEach((child) => {
          if (isActive(child.href)) {
            newOpenItems[item.href] = true;
            if (child.children) {
              newOpenItems[child.href] = true;
            }
          }
          if (child.children) {
            child.children.forEach((subChild) => {
              if (isActive(subChild.href)) {
                newOpenItems[item.href] = true;
                newOpenItems[child.href] = true;
              }
            });
          }
        });
      }
    });
    setOpenItems(newOpenItems);
  }, [pathname, navigation]);

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems[item.href];
    const active = isActive(item.href);

    if (!hasChildren) {
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            active && "bg-primary/10 text-primary font-semibold",
            !active && "text-muted-foreground",
            level === 0 && "mb-1",
            level === 1 && "ml-6 text-xs",
            level === 2 && "ml-12 text-xs"
          )}
        >
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          <span className="truncate">{item.title}</span>
        </Link>
      );
    }

    return (
      <Collapsible
        key={item.href}
        open={isOpen}
        onOpenChange={() => toggleItem(item.href)}
        className={cn(level === 0 && "mb-1")}
      >
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground [&[data-state=open]>svg]:rotate-90",
            active && "bg-primary/10 text-primary font-semibold",
            !active && "text-muted-foreground",
            level === 1 && "ml-6 text-xs",
            level === 2 && "ml-12 text-xs"
          )}
        >
          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          <span className="flex-1 truncate text-left">{item.title}</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-2">
          <div className="space-y-0.5 pt-1">
            {item.children?.map((child) => renderNavItem(child, level + 1))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <nav className="space-y-0.5 py-2">
      {navigation.map((item) => renderNavItem(item))}
    </nav>
  );
}

