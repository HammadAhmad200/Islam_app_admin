"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Donation } from "@/lib/api-types";
import {
  Eye,
  FileText,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDonations } from "@/hooks/use-donations";
import { useDonationTypes } from "@/hooks/use-donation-types";
import { useToast } from "@/hooks/use-toast";

export default function DonationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createAmount, setCreateAmount] = useState("");
  const [createType, setCreateType] = useState<string>("regular");
  const [createReason, setCreateReason] = useState("");
  const [createActive, setCreateActive] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<string>("regular");
  const [editReason, setEditReason] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const {
    donations,
    settings,
    isLoading,
    error,
    totalCount,
    toggleEmergencyDonation,
    refetch,
  } = useDonations();
  const {
    donationTypes,
    isLoading: isDonationTypesLoading,
    error: donationTypesError,
    createDonationType,
    updateDonationType,
    deleteDonationType,
    isCreating: isCreatingDonationType,
    isDeleting: isDeletingDonationType,
    isUpdating: isUpdatingDonationType,
  } = useDonationTypes();
  const { toast } = useToast();
  // const { data: session, status } = useSession();

  const handleCreateDonation = async () => {
    if (!createTitle.trim()) {
      toast({
        title: "Error",
        description: "Title is required.",
        variant: "destructive",
      });
      return;
    }

    const amountValue = Number(createAmount);
    if (!amountValue || Number.isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Error",
        description: "Enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createDonationType({
        title: createTitle.trim(),
        category: createType,
        amount: amountValue,
        description: createReason,
        isActive: createActive,
      });
      setCreateOpen(false);
      setCreateTitle("");
      setCreateAmount("");
      setCreateReason("");
      setCreateType("regular");
      setCreateActive(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create donation",
        variant: "destructive",
      });
    }
  };

  const handleEditDonationType = (type: any) => {
    const id = type._id || type.id;
    if (!id) {
      toast({
        title: "Error",
        description: "Unable to edit donation type without an id.",
        variant: "destructive",
      });
      return;
    }
    setEditId(id);
    setEditTitle(type.title || "");
    setEditAmount(String(type.amount ?? ""));
    setEditType(type.category || "regular");
    setEditReason(type.description || "");
    setEditActive(!!type.isActive);
    setEditOpen(true);
  };

  const handleUpdateDonationType = async () => {
    if (!editId) {
      toast({
        title: "Error",
        description: "Missing donation type id.",
        variant: "destructive",
      });
      return;
    }
    if (!editTitle.trim()) {
      toast({
        title: "Error",
        description: "Title is required.",
        variant: "destructive",
      });
      return;
    }

    const amountValue = Number(editAmount);
    if (!amountValue || Number.isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Error",
        description: "Enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    await updateDonationType({
      id: editId,
      data: {
        title: editTitle.trim(),
        category: editType,
        amount: amountValue,
        description: editReason,
        isActive: editActive,
      },
    });

    setEditOpen(false);
    setEditId(null);
  };

  const handleDeleteDonationType = async (id: string) => {
    const confirmed = window.confirm("Delete this donation type?");
    if (!confirmed) return;
    await deleteDonationType(id);
  };

  const filteredDonations =
    donations?.filter(
      (donation: {
        donorName: string;
        donorEmail: string;
        type: string;
        category?: string;
        status: string;
      }) => {
        const matchesSearch =
          donation.donorName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          donation.donorEmail.toLowerCase().includes(searchQuery.toLowerCase());
        const normalizedType =
          donation.type?.toLowerCase() === "emergency"
            ? "emergency"
            : (donation.category || "regular").toLowerCase();
        const matchesType =
          typeFilter === "all" ||
          normalizedType === typeFilter.toLowerCase();
        const matchesStatus =
          statusFilter === "all" ||
          donation.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesType && matchesStatus;
      }
    ) || [];

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Donations"
        description="Manage donations and view transaction history."
      >
        <Button onClick={() => setCreateOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Donation Type
        </Button>
      </DashboardHeader>

      <Card className="mb-6">
        <div className="px-4 py-3 border-b">
          <h3 className="text-lg font-medium">Donation Types</h3>
          <p className="text-sm text-muted-foreground">
            These are the donation options shown in the app.
          </p>
        </div>
        <div className="overflow-x-auto">
          {isDonationTypesLoading ? (
            <div className="p-8 text-center">Loading donation types...</div>
          ) : donationTypesError ? (
            <div className="p-8 text-center text-red-500">
              Error loading donation types
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Suggested Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(donationTypes || []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No donation types found.
                    </TableCell>
                  </TableRow>
                ) : (
                  (donationTypes || []).map((type: any) => (
                    <TableRow key={type._id || type.id}>
                      <TableCell className="font-medium">
                        {type.title}
                      </TableCell>
                      <TableCell className="capitalize">
                        {type.category}
                      </TableCell>
                      <TableCell className="text-right">
                        ${Number(type.amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            type.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {type.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleEditDonationType(type)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              disabled={isDeletingDonationType}
                              onClick={() =>
                                handleDeleteDonationType(type._id || type.id)
                              }
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
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
      </Card>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Card className="p-4 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Emergency Donations</h3>
              <p className="text-sm text-muted-foreground">
                Enable or disable emergency donation mode
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings?.emergencyDonation}
                onCheckedChange={async () => {
                  toggleEmergencyDonation().then(() => {
                    refetch();
                  });
                }}
                id="emergency-mode"
              />
              <Label htmlFor="emergency-mode" className="sr-only">
                Emergency Mode
              </Label>
            </div>
          </div>
        </Card>
        <Card className="p-4 flex-1">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium">Total Donations</h3>
            <p className="text-3xl font-bold mt-2">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(totalCount || 0)}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by donor name or email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="zakat">Zakat</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">Loading donations...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Error loading donations
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No donations found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDonations.map((donation) => (
                    <TableRow key={donation._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {donation.donorName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {donation.donorEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${donation.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {donation.type?.toLowerCase() === "emergency"
                          ? "Emergency"
                          : donation.category || "Regular"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            donation.status?.toLowerCase() === "completed"
                              ? "bg-green-100 text-green-800"
                              : donation.status?.toLowerCase() === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {donation.status}
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedDonation(donation);
                                setDetailsOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              {donation.invoiceLink ? (
                                <Link
                                  href={donation.invoiceLink}
                                  target="_blank"
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Invoice
                                </Link>
                              ) : (
                                <div className="flex items-center text-muted-foreground cursor-not-allowed">
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Invoice
                                </div>
                              )}
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
            Showing <strong>{filteredDonations.length}</strong> of{" "}
            <strong>{donations?.length || 0}</strong> donations
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filteredDonations.length === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={filteredDonations.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Donation Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              Complete information about this donation.
            </DialogDescription>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Donor Name
                  </h4>
                  <p>{selectedDonation.donorName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Donor Email
                  </h4>
                  <p>{selectedDonation.donorEmail}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Amount
                  </h4>
                  <p className="font-bold">
                    ${selectedDonation.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Date
                  </h4>
                  <p>
                    {new Date(selectedDonation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Type
                  </h4>
                  <p>{selectedDonation.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h4>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedDonation.status?.toLowerCase() === "completed"
                        ? "bg-green-100 text-green-800"
                        : selectedDonation.status?.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedDonation.status}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <Button asChild variant="outline" className="w-full">
                  {selectedDonation.invoiceLink ? (
                    <Link href={selectedDonation.invoiceLink} target="_blank">
                      <FileText className="mr-2 h-4 w-4" />
                      View Invoice
                    </Link>
                  ) : (
                    <div className="flex items-center text-muted-foreground cursor-not-allowed">
                      <FileText className="mr-2 h-4 w-4" />
                      View Invoice
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Donation</DialogTitle>
            <DialogDescription>
              Create a new donation option for the app.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="donation-title">Title</Label>
              <Input
                id="donation-title"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                placeholder="Masjid Maintenance Fund"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donation-amount">Amount (USD)</Label>
              <Input
                id="donation-amount"
                type="number"
                min="1"
                step="0.01"
                value={createAmount}
                onChange={(e) => setCreateAmount(e.target.value)}
                placeholder="50.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donation-type">Type</Label>
              <Select value={createType} onValueChange={setCreateType}>
                <SelectTrigger id="donation-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="zakat">Zakat</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="donation-reason">Description</Label>
              <Textarea
                id="donation-reason"
                value={createReason}
                onChange={(e) => setCreateReason(e.target.value)}
                placeholder="Optional note for this donation"
              />
            </div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <div className="space-y-1">
                <Label htmlFor="donation-active">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Show this donation option in the app.
                </p>
              </div>
              <Switch
                id="donation-active"
                checked={createActive}
                onCheckedChange={setCreateActive}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateDonation}
                disabled={isCreatingDonationType}
              >
                {isCreatingDonationType ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Donation Type</DialogTitle>
            <DialogDescription>
              Update the donation option shown in the app.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-donation-title">Title</Label>
              <Input
                id="edit-donation-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Masjid Maintenance Fund"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-donation-amount">Amount (USD)</Label>
              <Input
                id="edit-donation-amount"
                type="number"
                min="1"
                step="0.01"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                placeholder="50.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-donation-type">Type</Label>
              <Select value={editType} onValueChange={setEditType}>
                <SelectTrigger id="edit-donation-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="zakat">Zakat</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-donation-reason">Description</Label>
              <Textarea
                id="edit-donation-reason"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="Optional note for this donation"
              />
            </div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <div className="space-y-1">
                <Label htmlFor="edit-donation-active">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Show this donation option in the app.
                </p>
              </div>
              <Switch
                id="edit-donation-active"
                checked={editActive}
                onCheckedChange={setEditActive}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateDonationType}
                disabled={isUpdatingDonationType || !editId}
              >
                {isUpdatingDonationType ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
