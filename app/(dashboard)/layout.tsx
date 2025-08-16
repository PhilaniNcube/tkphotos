import React from "react";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/queries/user";
import DashboardHeader from "./_components/dashboard-header";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const userData = await getCurrentUser();

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar userData={userData} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 lg:ml-0">
        {/* Header */}
        <DashboardHeader />

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
