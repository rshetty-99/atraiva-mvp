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
import { User, Settings, LogOut, LayoutDashboard } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

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
    <header className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border">
      <div className="px-20 py-[17px]">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo
              width={200}
              height={80}
              className="w-[200px] h-[80px] object-contain"
            />
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6 bg-muted/20 backdrop-blur-sm border border-border rounded-lg px-6 py-4">
            <div className="group flex flex-col items-center gap-1">
              <Link href="/home" className={getMenuItemClasses("/home")}>
                Home
              </Link>
              <div className={getUnderlineClasses("/home")}></div>
            </div>

            <div className="group flex flex-col items-center gap-1">
              <Link href="/aboutus" className={getMenuItemClasses("/aboutus")}>
                About Us
              </Link>
              <div className={getUnderlineClasses("/aboutus")}></div>
            </div>

            <div className="group flex flex-col items-center gap-1">
              <Link
                href="/features"
                className={getMenuItemClasses("/features")}
              >
                Features
              </Link>
              <div className={getUnderlineClasses("/features")}></div>
            </div>

            <div className="group flex flex-col items-center gap-1">
              <Link
                href="/resources"
                className={getMenuItemClasses("/resources")}
              >
                Resources
              </Link>
              <div className={getUnderlineClasses("/resources")}></div>
            </div>

            <div className="group flex flex-col items-center gap-1">
              <Link
                href="/contact-us"
                className={getMenuItemClasses("/contact-us")}
              >
                Contact Us
              </Link>
              <div className={getUnderlineClasses("/contact-us")}></div>
            </div>
          </div>

          {/* Auth Buttons & Theme Toggle */}
          <div className="flex items-center gap-6">
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
