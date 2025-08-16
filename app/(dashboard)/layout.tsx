import React from "react";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/queries/user";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const userData = await getCurrentUser();

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar userData={userData} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 lg:ml-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h2 className="text-2xl font-semibold text-foreground">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground">
                Here's what's happening with your projects today.
              </p>
            </div>
          </div>
        </header>

        {/* Main content area */}
        {/* Scrollable content region (its own scroll context) */}
        <main className={cn("flex-1 min-h-0 overflow-y-auto p-4 lg:p-6")}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
