"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* Divider line before user section */}
        <div className="border-t border-gray-700 mx-2 my-2"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground px-4 py-3 h-auto min-h-[72px]"
            >
              <Avatar className="avatar-circular !w-9 !h-9 !min-w-9 !min-h-9 !max-w-9 !max-h-9">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                  className="!w-full !h-full !object-cover"
                />
                <AvatarFallback className="!w-full !h-full">
                  {user.avatar ? (
                    user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2 gap-0.5">
                <span className="truncate font-medium text-sm">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
                {user.role && (
                  <span className="truncate text-xs text-primary font-medium capitalize">
                    {user.role.replace(/_/g, " ")}
                  </span>
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4 self-center" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-start gap-2 px-1 py-2 text-left text-sm">
                <Avatar className="avatar-circular !w-9 !h-9 !min-w-9 !min-h-9 !max-w-9 !max-h-9 mt-0.5">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    className="!w-full !h-full !object-cover"
                  />
                  <AvatarFallback className="!w-full !h-full">
                    {user.avatar ? (
                      user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2 gap-0.5">
                  <span className="truncate font-medium text-sm">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                  {user.role && (
                    <span className="truncate text-xs text-primary font-medium capitalize">
                      {user.role.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
