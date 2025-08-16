"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  BarChart3,
  Users,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Layout,
  Blocks,
  Camera,
} from "lucide-react";
import { JwtPayload } from "@supabase/supabase-js";

type SupabaseUserLike = JwtPayload & {
  email?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

interface SidebarProps {
  className?: string;
  userData: SupabaseUserLike | null;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, current: true },
  {
    name: "Galleries",
    href: "/dashboard/galleries",
    icon: Layout,
    current: false,
  },
  {
    name: "Collections",
    href: "/dashboard/collections",
    icon: Blocks,
    current: false,
  },
  { name: "Photos", href: "/dashboard/photos", icon: Camera, current: false },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    current: false,
  },
];

export function DashboardSidebar({ className, userData }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const meta = userData?.user_metadata || {};
  const first = meta.first_name || (userData as any).first_name || "";
  const last = meta.last_name || (userData as any).last_name || "";
  const fullName = [first, last].filter(Boolean).join(" ") || "Account";
  const email = userData?.email || (userData as any).email || meta.email;
  const avatarUrl = meta.avatar_url || (userData as any).avatar_url;
  const initials = (first?.[0] || "A") + (last?.[0] || "");

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-sidebar border-sidebar-border"
        >
          {isMobileOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          "lg:relative lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              Dashboard
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  item.current
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-medium text-sidebar-accent-foreground">
                {initials}
              </span>
            </div>
            {!isCollapsed && (
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {fullName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
