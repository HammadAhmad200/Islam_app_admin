"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Analytics } from "@/lib/api-types";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  DollarSign,
  ChurchIcon as Mosque,
  Users,
} from "lucide-react";
import { useEffect } from "react";

export function DashboardStats({ setData }: any) {
  const {
    data: analytics,
    isLoading,
    error,
  } = useQuery<Analytics>({
    queryKey: ["analytics"],
    queryFn: api.dashboardAnalytics,
  });

  useEffect(() => {
    if (analytics) {
    }
    setData(analytics?.donationTrends);
  }, [analytics]);
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.blogs || 0}</div>
          {/* <p className="text-xs text-muted-foreground">
            +{analytics?.blogsLastMonth || 0} from last month
          </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(analytics?.donations || 0)}
          </div>
          {/* <p className="text-xs text-muted-foreground">
            +{analytics?.donationsLastMonth || 0}% from last month
          </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Masjids</CardTitle>
          <Mosque className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.masjids || 0}</div>
          {/* <p className="text-xs text-muted-foreground">
            +{analytics?.masjidsLastMonth || 0} from last month
          </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.activeUsers || 0}</div>
        </CardContent>
      </Card>
    
    </>
  );
}
