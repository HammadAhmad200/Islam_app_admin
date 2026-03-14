"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SubscriptionPackage, UserSubscription } from "@/lib/api-types";
import { api } from "@/lib/api";
import {
  Check,
  Edit,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: packages, isLoading: packagesLoading } = useQuery<
    SubscriptionPackage[]
  >({
    queryKey: ["subscriptionPackages"],
    queryFn: api.getSubscriptionPackages,
  });

  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery<
    UserSubscription[]
  >({
    queryKey: ["userSubscriptions"],
    queryFn: api.getUserSubscriptions,
  });

  const filteredSubscriptions =
    subscriptions?.filter((subscription) => {
      const matchesSearch =
        subscription.userName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        subscription.userEmail
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        subscription.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    }) || [];

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Subscriptions"
        description="Manage subscription packages and user subscriptions."
      />

      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages">Subscription Packages</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <div className="flex justify-end">
            {/* <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Package
            </Button> */}
          </div>

          {packagesLoading ? (
            <div className="text-center p-8">Loading packages...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {packages?.map((pkg) => (
                <Card key={pkg.id}>
                  <CardHeader>
                    <CardTitle>{pkg.name}</CardTitle>
                    <CardDescription>
                      {pkg.metadata?.type} subscription
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ${pkg.prices[0]?.unit_amount / 100} /{" "}
                      {pkg.prices[0]?.recurring.interval}
                    </div>
                    {pkg.marketing_features && (
                      <ul className="mt-4 space-y-2">
                        {pkg.marketing_features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>{feature?.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button disabled variant="outline">
                      Edit
                    </Button>
                    <Button disabled variant="destructive">
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="subscribers">
          <Card>
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search subscribers..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              {subscriptionsLoading ? (
                <div className="p-8 text-center">Loading subscriptions...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Start Date
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        End Date
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No subscriptions found. Try adjusting your search or
                          filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubscriptions.map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {subscription.userName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {subscription.userEmail}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{subscription.packageName}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(
                              subscription.startDate * 1000
                            ).toDateString()}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(
                              subscription.endDate * 1000
                            ).toDateString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                subscription.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : subscription.status === "Expired"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {subscription.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
            <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredSubscriptions.length}</strong> of{" "}
                <strong>{subscriptions?.length || 0}</strong> subscriptions
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filteredSubscriptions.length === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filteredSubscriptions.length === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
