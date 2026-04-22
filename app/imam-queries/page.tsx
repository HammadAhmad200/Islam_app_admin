"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Mail } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ContactItem {
  id?: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export default function ImamQueriesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "replied">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const { toast } = useToast();

  const {
    data: contactsData,
    isLoading,
    error,
    refetch,
  } = useQuery<ContactItem[] | { results: ContactItem[] }>({
    queryKey: ["imam-emails"],
    queryFn: api.getContacts,
  });

  const allContacts = useMemo(() => {
    if (Array.isArray(contactsData)) return contactsData;
    if (contactsData && Array.isArray((contactsData as any).results)) {
      return (contactsData as any).results as ContactItem[];
    }
    return [];
  }, [contactsData]);

  const sortedContacts = useMemo(
    () =>
      [...allContacts]
        .map((item) => ({
          ...item,
          id: item.id || item._id,
        }))
        .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [allContacts]
  );

  const filteredContacts = useMemo(() => {
    return sortedContacts.filter((c) => {
      const fullName = `${c.firstName} ${c.lastName}`.trim().toLowerCase();
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sortedContacts, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / limit));
  const safePage = Math.min(page, totalPages);
  const pagedContacts = useMemo(() => {
    const start = (safePage - 1) * limit;
    return filteredContacts.slice(start, start + limit);
  }, [filteredContacts, safePage]);

  const selectedRow = useMemo(
    () =>
      sortedContacts.find(
        (c) => String(c.id || c._id) === String(selectedId)
      ) || null,
    [sortedContacts, selectedId]
  );

  const { data: selectedDetailRaw, isLoading: isDetailLoading } = useQuery<
    ContactItem | { contact?: ContactItem }
  >({
    queryKey: ["imam-email-detail", selectedId],
    queryFn: () => api.getContactById(selectedId as string),
    enabled: !!selectedId,
  });

  const selectedDetail = useMemo(
    () =>
      (selectedDetailRaw &&
      typeof selectedDetailRaw === "object" &&
      "contact" in selectedDetailRaw
        ? selectedDetailRaw.contact
        : selectedDetailRaw) || null,
    [selectedDetailRaw]
  );

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "new" | "read" | "replied" }) =>
      api.updateContactStatus(id, status),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message status updated.",
      });
      refetch();
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update status.",
        variant: "destructive",
      });
    },
  });

  function handleStatusUpdate(
    row: ContactItem,
    status: "new" | "read" | "replied"
  ) {
    const contactId = row.id || row._id;
    if (!contactId) {
      toast({
        title: "Error",
        description: "Invalid contact id",
        variant: "destructive",
      });
      return;
    }
    if (process.env.NODE_ENV === "development") {
      console.log("Updating contact status", { contactId, status, row });
    }
    updateStatusMutation.mutate({ id: contactId, status });
  }

  return (
    <DashboardShell>
    <DashboardHeader
      heading="Imam Emails"
      description="View and manage contact messages."
    />
        <div className="space-y-4">
      <Card className="p-0 overflow-hidden">
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as "all" | "new" | "read" | "replied");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-red-600">
                  Failed to load messages.
                </TableCell>
              </TableRow>
            ) : pagedContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center align-middle">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              pagedContacts.map((c) => {
                const fullName = `${c.firstName} ${c.lastName}`.trim();
                const mailto = `mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent(
                  `Re: Your question`
                )}&body=${encodeURIComponent("Assalamu Alaikum,\n\n")} `;
                return (
                  <TableRow key={c.id || c._id}>
                    <TableCell className="whitespace-nowrap">{fullName}</TableCell>
                    <TableCell className="whitespace-nowrap">{c.email}</TableCell>
                    <TableCell className="max-w-[480px] truncate" title={c.message}>
                      {c.message}
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.status === "new" ? "destructive" : c.status === "read" ? "secondary" : "default"}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          title="View details"
                          onClick={() => setSelectedId(c.id || c._id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updateStatusMutation.isPending || c.status === "read"}
                          onClick={() => handleStatusUpdate(c, "read")}
                        >
                          Mark Read
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updateStatusMutation.isPending || c.status === "replied"}
                          onClick={() => handleStatusUpdate(c, "replied")}
                        >
                          Mark Replied
                        </Button>
                        <Button asChild variant="outline" size="icon" title="Reply via email">
                        <a href={mailto}>
                          <Mail className="h-4 w-4" />
                        </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{pagedContacts.length}</strong> of{" "}
            <strong>{filteredContacts.length}</strong> messages
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {safePage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Message Details</DialogTitle>
          <DialogDescription>
            View full contact message and update status.
          </DialogDescription>
        </DialogHeader>
        {isDetailLoading ? (
          <div className="py-4 text-sm text-muted-foreground">Loading details...</div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-medium">
                {`${(selectedDetail || selectedRow)?.firstName || ""} ${(selectedDetail || selectedRow)?.lastName || ""}`.trim()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{(selectedDetail || selectedRow)?.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge>{(selectedDetail || selectedRow)?.status || "new"}</Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Created At</div>
              <div className="font-medium">
                {(selectedDetail || selectedRow)?.createdAt
                  ? new Date((selectedDetail || selectedRow)!.createdAt).toLocaleString()
                  : "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Message</div>
              <div className="rounded-md border p-3 whitespace-pre-wrap text-sm">
                {(selectedDetail || selectedRow)?.message || "-"}
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="outline"
                disabled={updateStatusMutation.isPending || (selectedDetail || selectedRow)?.status === "read"}
                onClick={() => {
                  const row = (selectedDetail || selectedRow) as ContactItem | null;
                  if (!row) {
                    toast({
                      title: "Error",
                      description: "Invalid contact id",
                      variant: "destructive",
                    });
                    return;
                  }
                  handleStatusUpdate(row, "read");
                }}
              >
                Mark as Read
              </Button>
              <Button
                disabled={updateStatusMutation.isPending || (selectedDetail || selectedRow)?.status === "replied"}
                onClick={() => {
                  const row = (selectedDetail || selectedRow) as ContactItem | null;
                  if (!row) {
                    toast({
                      title: "Error",
                      description: "Invalid contact id",
                      variant: "destructive",
                    });
                    return;
                  }
                  handleStatusUpdate(row, "replied");
                }}
              >
                Mark as Replied
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </DashboardShell>
  );
}
