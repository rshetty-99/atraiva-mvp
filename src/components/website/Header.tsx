"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, LayoutDashboard, Menu } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/aboutus", label: "About Us" },
    { href: "/features", label: "Features" },
    { href: "/resources", label: "Resources" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  // Helper function to check if a menu item is active
  const isActive = (path: string) => {
    if (path === "/home" && pathname === "/") return true;
    return pathname.startsWith(path);
  };

  // Helper function to get menu item classes
  const getMenuItemClasses = (path: string) => {
    const baseClasses = "text-sm transition-all duration-300 ease-in-out";
    if (isActive(path)) {
      return `${baseClasses} text-primary font-bold`;
    }
    return `${baseClasses} text-muted-foreground font-medium hover:text-primary hover:scale-105`;
  };

  // Helper function to get underline classes
  const getUnderlineClasses = (path: string) => {
    const baseClasses =
      "h-px bg-primary transition-all duration-300 ease-in-out";
    if (isActive(path)) {
      return `${baseClasses} w-8 opacity-100`;
    }
    return `${baseClasses} w-0 opacity-0 group-hover:w-8 group-hover:opacity-100`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border" style={{ maxWidth: "100vw", width: "100%", boxSizing: "border-box", overflow: "hidden" }}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-[17px]" style={{ maxWidth: "100vw", width: "100%", boxSizing: "border-box", overflow: "hidden" }}>
        <nav className="flex items-center justify-between" style={{ maxWidth: "100%", boxSizing: "border-box", width: "100%" }}>
          {/* Logo */}
          <Link href="/home" className="flex items-center flex-shrink-0">
            <Logo
              width={200}
              height={80}
              className="w-[120px] sm:w-[150px] lg:w-[200px] h-[48px] sm:h-[60px] lg:h-[80px] object-contain"
            />
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 bg-muted/20 backdrop-blur-sm border border-border rounded-lg px-4 lg:px-6 py-2 lg:py-4 min-w-0 overflow-hidden mx-auto max-w-3xl w-full justify-center" style={{ width: "100%", boxSizing: "border-box" }}>
            {navItems.map((item) => (
              <div
                key={item.href}
                className="group flex flex-col items-center gap-1 min-w-0 max-w-full overflow-hidden"
                style={{ maxWidth: "100%", overflow: "hidden", boxSizing: "border-box" }}
              >
                <Link
                  href={item.href}
                  className={getMenuItemClasses(item.href) + " truncate max-w-full overflow-hidden"}
                  style={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      boxSizing: "border-box",
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
                <div
                  className={getUnderlineClasses(item.href)}
                  style={{ maxWidth: "100%", overflow: "hidden" }}
                ></div>
              </div>
            ))}
          </div>

          {/* Auth Buttons & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background/80 backdrop-blur-sm text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 md:hidden">
                {navItems.map((item) => (
                  <DropdownMenuItem asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={
                        isActive(item.href)
                          ? "font-semibold text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full">
                    <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                      <AvatarImage
                        src={user?.imageUrl}
                        alt={user?.fullName || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] text-white">
                        {user?.firstName?.[0] ||
                          user?.emailAddresses[0]?.emailAddress[0] ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 !z-[9999]"
                  style={{ zIndex: 9999 }}
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 text-white px-6 py-2 rounded-full text-base font-medium shadow-lg transition-all">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
