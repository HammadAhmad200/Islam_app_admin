"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useDonations } from "@/hooks/use-donations";
import { Bell, BookOpen, DollarSign } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function QuickActions() {
  const { data: session, status } = useSession();
  const { toggleEmergencyDonation, isUpdating, refetch, settings } =
    useDonations();
  // const [enabled, toggle] = useState(
  //   session?.settings?.emergencyDonation || false
  // );
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used actions</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button
          onClick={() => {
            router.push("/blogs/new");
          }}
          className="w-full justify-start"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Add New Blog
        </Button>
        <Button
          onClick={() => {
            router.push("/notifications");
          }}
          className="w-full justify-start"
          variant="outline"
        >
          <Bell className="mr-2 h-4 w-4" />
          Send Notification
        </Button>
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Emergency Donation</span>
          </div>
          <Switch
            disabled={isUpdating}
            onCheckedChange={async () => {
              toggleEmergencyDonation().then(() => {
                refetch();
              });
            }}
            checked={settings?.emergencyDonation}
          />
        </div>
      </CardContent>
    </Card>
  );
}
