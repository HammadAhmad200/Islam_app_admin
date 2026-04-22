"use client"

import type React from "react"
import { MainNav } from "@/components/dashboard/main-nav"
import { Bell, BookOpen, ChurchIcon, CreditCard, DollarSign, Home, LogOut, Mail, Settings, Users } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { isSuperAdmin, isSimpleAdmin, isImamAdmin } from "@/lib/auth"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role
  const showDonations = isSuperAdmin(role)
  const showUsers = isSuperAdmin(role)
  const showGeneral = !isImamAdmin(role)
  const showNotifications = isSuperAdmin(role) || isSimpleAdmin(role) || isImamAdmin(role)
  const showImamQueries = isSuperAdmin(role)
  console.log("showImamQueries",showImamQueries)
  const showMasjids = isSuperAdmin(role) || isSimpleAdmin(role);
  const showBlogs = isSuperAdmin(role) || isSimpleAdmin(role);
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
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
                <NavItem href="/dashboard" icon={<Home className="mr-2 h-4 w-4" />} isActive={pathname === "/dashboard"}>
                  Dashboard
                </NavItem>
              )}
              {showBlogs && (
                <NavItem
                  href="/blogs"
                  icon={<BookOpen className="mr-2 h-4 w-4" />}
                  isActive={pathname.startsWith("/blogs")}
                >
                  Blogs
                </NavItem>
              )}
              {showDonations && (
                <NavItem
                  href="/donations"
                  icon={<DollarSign className="mr-2 h-4 w-4" />}
                  isActive={pathname.startsWith("/donations")}
                >
                  Donations
                </NavItem>
              )}
              {showMasjids && (
                <NavItem
                  href="/masjids"
                  icon={<ChurchIcon className="mr-2 h-4 w-4" />}
                  isActive={pathname.startsWith("/masjids")}
                >
                  Masjids
                </NavItem>
              )}
              {showNotifications && (
                <NavItem
                  href="/notifications"
                  icon={<Bell className="mr-2 h-4 w-4" />}
                  isActive={pathname.startsWith("/notifications")}
                >
                  Notifications
                </NavItem>
              )}
              {showImamQueries && (
                <NavItem
                  href="/imam-queries"
                  icon={<Mail className="mr-2 h-4 w-4" />}
                  isActive={pathname.startsWith("/imam-queries")}
                >
                  Imam Emails
                </NavItem>
              )}
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/55">
              Management
            </h2>
            <div className="space-y-1">
              {showUsers && (
                <NavItem href="/users" icon={<Users className="mr-2 h-4 w-4" />} isActive={pathname.startsWith("/users")}>
                  Users
                </NavItem>
              )}
              {showGeneral && (
                <NavItem
                  href="/subscriptions"
                  icon={<CreditCard className="mr-2 h-4 w-4" />}
                  isActive={pathname.startsWith("/subscriptions")}
                >
                  Subscriptions
                </NavItem>
              )}
              {showGeneral && (
                <NavItem
                  href="/settings"
                  icon={<Settings className="mr-2 h-4 w-4" />}
                  isActive={pathname.startsWith("/settings")}
                >
                  Settings
                </NavItem>
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
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col bg-gradient-to-b from-background via-background to-muted/50">
        <MainNav />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-4">{children}</div>
        </main>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
  isActive?: boolean
}

function NavItem({ href, icon, children, className, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
          : "text-sidebar-foreground/85 hover:bg-white/10 hover:text-white",
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}

