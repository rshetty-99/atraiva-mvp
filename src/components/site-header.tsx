"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SearchForm } from "@/components/search-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return { href, label, isLast: index === pathSegments.length - 1 };
  });

  return (
    <header
      className="sticky top-0 z-30 flex h-[49px] w-full items-center gap-4 border-b bg-background px-4 py-2.5 sm:h-[65px] sm:px-6 lg:px-8"
      style={
        {
          "--header-height": "49px",
          "--header-height-sm": "65px",
        } as React.CSSProperties
      }
    >
      <div className="flex flex-1 items-center gap-3 overflow-hidden">
        <Link href="/home" className="flex items-center">
          <Logo width={140} height={48} className="hidden sm:block h-10 w-auto" />
          <Logo width={120} height={40} className="sm:hidden h-8 w-auto" />
        </Link>
        <SidebarTrigger />
        <Separator orientation="vertical" className="hidden h-4 sm:block" />
        <Breadcrumb className="hidden items-center md:flex">
          <BreadcrumbList className="flex items-center gap-1 text-sm text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((breadcrumb, index) => (
              <BreadcrumbItem key={breadcrumb.href} className="flex items-center">
                <BreadcrumbSeparator />
                {breadcrumb.isLast ? (
                  <BreadcrumbPage className="truncate max-w-[140px] text-foreground sm:max-w-[200px]">
                    {breadcrumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={breadcrumb.href}
                    className="truncate max-w-[140px] sm:max-w-[200px]"
                  >
                    {breadcrumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-3">
        <SearchForm />
        <ThemeToggle />
      </div>
    </header>
  );
}
