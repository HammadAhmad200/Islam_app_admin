"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Mail, Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChurchIcon,
  CreditCard,
  DollarSign,
  Home,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { isSuperAdmin, isSimpleAdmin, isImamAdmin } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { NotificationsDropdown } from "../notifications-dropdown";

export function MainNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role;
  console.log("roleee",role)
  const showDonations = isSuperAdmin(role); // simpleAdmin cannot manage donations
  const showUsers = isSuperAdmin(role); // only super admin can view/manage users/admins
  const showMasjids = isSuperAdmin(role) || isSimpleAdmin(role);
  const showBlogs = isSuperAdmin(role) || isSimpleAdmin(role);
  console.log("showUsers",showUsers)
  const showGeneral = !isImamAdmin(role); // imam has no access to general admin features
  console.log("showGeneral",showGeneral)
  const showNotifications = isSuperAdmin(role) || isSimpleAdmin(role) || isImamAdmin(role);
  const showContactUs = isSuperAdmin(role);
  console.log("showNotifications",showNotifications)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/80 bg-card/90 px-3 shadow-sm backdrop-blur-md md:px-6">
      {/* Mobile Menu Trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
        >
          <div className="flex h-14 items-center border-b border-sidebar-border px-4">
            <span className="font-semibold tracking-tight text-white">Islamic App</span>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/55">
                Main
              </h2>
              <div className="space-y-1">
                {showGeneral && (
                  <MobileNavItem
                    href="/dashboard"
                    icon={<Home className="mr-2 h-4 w-4" />}
                    isActive={pathname === "/dashboard"}
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </MobileNavItem>
                )}
                {showBlogs && (
                  <MobileNavItem
                    href="/blogs"
                    icon={<BookOpen className="mr-2 h-4 w-4" />}
                    isActive={pathname.startsWith("/blogs")}
                    onClick={() => setOpen(false)}
                  >
                    Blogs
                  </MobileNavItem>
                )}
                {showDonations && (
                  <MobileNavItem
                    href="/donations"
                    icon={<DollarSign className="mr-2 h-4 w-4" />}
                    isActive={pathname.startsWith("/donations")}
                    onClick={() => setOpen(false)}
                  >
                    Donations
                  </MobileNavItem>
                )}
                {showMasjids && (
                  <MobileNavItem
                    href="/masjids"
                    icon={<ChurchIcon className="mr-2 h-4 w-4" />}
                    isActive={pathname.startsWith("/masjids")}
                    onClick={() => setOpen(false)}
                  >
                    Masjids
                  </MobileNavItem>
                )}
                {showNotifications && (
                  <MobileNavItem
                    href="/notifications"
                    icon={<Bell className="mr-2 h-4 w-4" />}
                    isActive={pathname.startsWith("/notifications")}
                    onClick={() => setOpen(false)}
                  >
                    Notifications
                  </MobileNavItem>
                )}
                {showContactUs && (
                  <MobileNavItem
                    href="/contact-us"
                    icon={<Mail className="mr-2 h-4 w-4" />}
                    isActive={pathname.startsWith("/contact-us")}
                    onClick={() => setOpen(false)}
                  >
                    Contact Us
                  </MobileNavItem>
                )}
              </div>
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/55">
                Management
              </h2>
              <div className="space-y-1">
                {showUsers && (
                  <MobileNavItem
                    href="/users"
                    icon={<Users className="mr-2 h-4 w-4" />}
                    isActive={pathname.startsWith("/users")}
                    onClick={() => setOpen(false)}
                  >
                    Users
                  </MobileNavItem>
                )}
                {showGeneral && (
                  <MobileNavItem
                    href="/subscriptions"
                    icon={<CreditCard className="mr-2 h-4 w-4" />}
                    isActive={pathname.startsWith("/subscriptions")}
                    onClick={() => setOpen(false)}
                  >
                    Subscriptions
                  </MobileNavItem>
                )}
                {showGeneral && (
                  <MobileNavItem
                    href="/settings"
                    icon={<Settings className="mr-2 h-4 w-4" />}
                    isActive={pathname.startsWith("/settings")}
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </MobileNavItem>
                )}
              </div>
            </div>
          </nav>
          <div className="border-t border-sidebar-border p-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-white/10 hover:text-white"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        {/* <h1 className="text-base font-semibold md:text-xl">Admin Panel</h1> */}
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full hidden md:flex"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
        <NotificationsDropdown />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {session?.user?.name?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                router.push("/settings");
              }}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

interface MobileNavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}

function MobileNavItem({
  href,
  icon,
  children,
  className,
  isActive,
  onClick,
}: MobileNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
          : "text-sidebar-foreground/85 hover:bg-white/10 hover:text-white",
        className
      )}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
