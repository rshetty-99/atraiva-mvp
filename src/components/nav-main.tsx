"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    category?: string;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || "main";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  // Define category order to match HTML mockup
  const categoryOrder = [
    "main",
    "Risk & Compliance",
    "Business Intelligence",
    "Management",
    "Reference",
    "System",
  ];

  return (
    <>
      {categoryOrder.map((category) => {
        const categoryItems = groupedItems[category];
        if (!categoryItems || categoryItems.length === 0) return null;

        return (
          <SidebarGroup key={category} className="py-0">
            {category !== "main" && (
              <>
                {/* Divider line before category */}
                <div className="border-t border-gray-700 mx-2 my-2"></div>
                <SidebarGroupLabel className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase">
                  {category}
                </SidebarGroupLabel>
              </>
            )}
            <SidebarMenu className="space-y-1">
              {categoryItems.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`sidebar-link ${isActive ? "active" : ""}`}
                    >
                      <a
                        href={item.url}
                        className="flex items-center px-4 py-2.5"
                      >
                        <item.icon className="sidebar-icon" />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        );
      })}
    </>
  );
}
