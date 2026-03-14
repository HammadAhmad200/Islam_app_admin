"use client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DonationTrends } from "@/components/dashboard/donation-trends";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SubscriptionChart } from "@/components/dashboard/subscription-chart";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState([]);
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        description="Overview of your platform's performance and key metrics."
      />
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStats setData={setData} />
      </div>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-3 mt-4">
        <div className="md:col-span-2">
          <DonationTrends data={data} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
      {/* <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 mt-4">
        <UserGrowthChart />
        <SubscriptionChart />
      </div> */}
    </DashboardShell>
  );
}
