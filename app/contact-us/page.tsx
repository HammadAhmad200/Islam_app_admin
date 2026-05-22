"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Mail, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { api } from "@/lib/api";
import { isSuperAdmin } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ContactReplyPanel } from "@/components/contact/contact-reply-panel";
import { buildContactMailto, type ContactReply } from "@/lib/contact-inquiry";

const CONTACT_LIST_QUERY_KEY = ["contact-us-list"] as const;

type ContactStatus = "new" | "read" | "replied";

interface ContactItem {
  id?: string;
  _id?: string;
  title?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  source?: "imamEmail" | "appSupport";
  message?: string;
  status?: ContactStatus;
  createdAt?: string;
  voiceNote?: UploadedAsset | null;
  attachments?: UploadedAsset[];
  replies?: ContactReply[];
}

interface UploadedAsset {
  url: string;
  fileName?: string | null;
  mimeType?: string | null;
  size?: number | null;
}

function removeContactFromListCache(old: unknown, deletedId: string) {
  if (!old || typeof old !== "object") return old;
  const idMatches = (item: ContactItem) =>
    String(item.id || item._id) !== String(deletedId);
  if (Array.isArray(old)) {
    return old.filter(idMatches);
  }
  const data = old as { results?: ContactItem[]; contacts?: ContactItem[] };
  if (Array.isArray(data.results)) {
    return { ...data, results: data.results.filter(idMatches) };
  }
  if (Array.isArray(data.contacts)) {
    return { ...data, contacts: data.contacts.filter(idMatches) };
  }
  return old;
}

function formatCreatedAt(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
}

function AssetLinks({
  items,
  emptyLabel = "-",
}: {
  items?: UploadedAsset[] | null;
  emptyLabel?: string;
}) {
  if (!items || items.length === 0) {
    return <span>{emptyLabel}</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      {items.map((item, index) => (
        <Link
          key={`${item.url}-${index}`}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 underline underline-offset-2"
        >
          {item.fileName || `File ${index + 1}`}
        </Link>
      ))}
    </div>
  );
}

export default function ContactUsPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [sourceTab, setSourceTab] = useState<"appSupport" | "imamEmail">("appSupport");
  const [statusFilter, setStatusFilter] = useState<"all" | ContactStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const {
    data: contactsData,
    isLoading,
    error,
    refetch,
  } = useQuery<any>({
    queryKey: [...CONTACT_LIST_QUERY_KEY],
    queryFn: api.getContacts,
  });

  useEffect(() => {
    const role = session?.user?.role;
    if (role && !isSuperAdmin(role)) {
      router.replace("/dashboard");
    }
  }, [session?.user?.role, router]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const rows = useMemo<ContactItem[]>(() => {
    const list =
      contactsData?.results || contactsData?.contacts || [];
    return Array.isArray(list)
      ? list.map((item) => ({ ...item, id: item.id || item._id }))
      : [];
  }, [contactsData]);

  const sortedRows = useMemo(
    () =>
      [...rows].sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
      ),
    [rows]
  );

  const filteredRows = useMemo(() => {
    return sortedRows.filter((row) => {
      const fullName = `${row.firstName || ""} ${row.lastName || ""}`.trim().toLowerCase();
      const email = (row.email || "").toLowerCase();
      const title = (row.title || "").toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = fullName.includes(q) || email.includes(q) || title.includes(q);
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      const matchesSource = (row.source || "imamEmail") === sourceTab;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [sortedRows, search, statusFilter, sourceTab]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / limit));
  const safePage = Math.min(page, totalPages);
  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * limit;
    return filteredRows.slice(start, start + limit);
  }, [filteredRows, safePage]);

  const selectedRow = useMemo(
    () => sortedRows.find((r) => String(r.id || r._id) === String(selectedId)) || null,
    [sortedRows, selectedId]
  );

  const { data: selectedDetailRaw, isLoading: isDetailLoading } = useQuery<
    ContactItem | { contact?: ContactItem }
  >({
    queryKey: ["contact-us-detail", selectedId],
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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteContact(id),
    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData(CONTACT_LIST_QUERY_KEY, (old) =>
        removeContactFromListCache(old, deletedId)
      );
      setSelectedId(null);
      setDeleteConfirmOpen(false);
      setPendingDeleteId(null);
      toast({
        title: "Deleted",
        description: "Message removed.",
      });
    },
    onError: (err: Error) => {
      const notFound = err.message === "Not found";
      toast({
        title: notFound ? "Not found" : "Error",
        description: notFound ? "Not found" : err.message || "Failed to delete message.",
        variant: "destructive",
      });
      if (notFound) {
        setDeleteConfirmOpen(false);
        setPendingDeleteId(null);
      }
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactStatus }) =>
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

  function handleStatusUpdate(row: ContactItem, status: ContactStatus) {
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

  function requestDelete(contactId: string | undefined) {
    if (!contactId) {
      toast({
        title: "Error",
        description: "Invalid contact id",
        variant: "destructive",
      });
      return;
    }
    setPendingDeleteId(contactId);
    setDeleteConfirmOpen(true);
  }

  function confirmDelete() {
    if (!pendingDeleteId) return;
    deleteMutation.mutate(pendingDeleteId);
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Contact Us"
        description="View and manage contact messages."
      />
      <div className="space-y-4">
        <Card className="p-0 overflow-hidden">
          <div className="px-3 pt-3 sm:px-4 sm:pt-4">
            <Tabs
              value={sourceTab}
              onValueChange={(v) => {
                setSourceTab(v as "appSupport" | "imamEmail");
                setPage(1);
              }}
            >
              <TabsList>
                <TabsTrigger value="appSupport">Contact Us Emails</TabsTrigger>
                <TabsTrigger value="imamEmail">Imam Emails</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex-1 w-full">
              <Input
                placeholder="Search by name, email, or title..."
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
                setStatusFilter(v as "all" | ContactStatus);
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
                <TableHead>Title</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Voice Note</TableHead>
                <TableHead>Files</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10}>Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-red-600">
                    Failed to load messages.
                  </TableCell>
                </TableRow>
              ) : pagedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-10 text-center align-middle">
                  No messages found.
                  </TableCell>
                </TableRow>
              ) : (
                pagedRows.map((row) => {
                  const fullName = `${row.firstName || ""} ${row.lastName || ""}`.trim() || "-";
                  const status = row.status || "new";
                  const mailtoHref = buildContactMailto(row);
                  return (
                    <TableRow key={row.id || row._id}>
                      <TableCell>{row.title || "-"}</TableCell>
                      <TableCell className="whitespace-nowrap">{fullName}</TableCell>
                      <TableCell className="whitespace-nowrap">{row.email || "-"}</TableCell>
                      <TableCell>{row.source || "-"}</TableCell>
                      <TableCell>
                        {row.voiceNote?.url ? (
                          <Link
                            href={row.voiceNote.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-600 underline underline-offset-2"
                          >
                            {row.voiceNote.fileName || "Open"}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{row.attachments?.length || 0}</TableCell>
                      <TableCell className="max-w-[320px] truncate" title={row.message || ""}>
                        {row.message || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === "new"
                              ? "destructive"
                              : status === "read"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCreatedAt(row.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            title="View details"
                            onClick={() => setSelectedId((row.id || row._id) as string)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {mailtoHref ? (
                            <Button asChild variant="outline" size="icon" title="Reply via email">
                              <a href={mailtoHref}>
                                <Mail className="h-4 w-4" />
                              </a>
                            </Button>
                          ) : null}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={updateStatusMutation.isPending || status === "read"}
                            onClick={() => handleStatusUpdate(row, "read")}
                          >
                            Mark Read
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={updateStatusMutation.isPending || status === "replied"}
                            onClick={() => handleStatusUpdate(row, "replied")}
                          >
                            Mark Replied
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Delete message"
                            disabled={deleteMutation.isPending}
                            onClick={() => requestDelete(row.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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
              Showing <strong>{pagedRows.length}</strong> of{" "}
              <strong>{filteredRows.length}</strong> messages
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
                <div className="text-sm text-muted-foreground">Title</div>
                <div className="font-medium">{(selectedDetail || selectedRow)?.title || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">
                  {`${(selectedDetail || selectedRow)?.firstName || ""} ${(selectedDetail || selectedRow)?.lastName || ""}`.trim() || "-"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{(selectedDetail || selectedRow)?.email || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Source</div>
                <div className="font-medium">{(selectedDetail || selectedRow)?.source || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Voice Note</div>
                <AssetLinks
                  items={(selectedDetail || selectedRow)?.voiceNote?.url ? [(selectedDetail || selectedRow)!.voiceNote!] : []}
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Attachments</div>
                <AssetLinks items={(selectedDetail || selectedRow)?.attachments} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge>{(selectedDetail || selectedRow)?.status || "new"}</Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Created At</div>
                <div className="font-medium">
                  {formatCreatedAt((selectedDetail || selectedRow)?.createdAt)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Message</div>
                <div className="rounded-md border p-3 whitespace-pre-wrap text-sm">
                  {(selectedDetail || selectedRow)?.message || "-"}
                </div>
              </div>
              <ContactReplyPanel
                contactId={selectedId}
                contact={(selectedDetail || selectedRow) as ContactItem | null}
                detailQueryKey={["contact-us-detail", selectedId]}
                listQueryKey={CONTACT_LIST_QUERY_KEY}
              />
              <div className="flex items-center gap-2 justify-end flex-wrap">
                <Button
                  variant="destructive"
                  disabled={deleteMutation.isPending || !selectedId}
                  onClick={() => requestDelete(selectedId || undefined)}
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  disabled={
                    updateStatusMutation.isPending ||
                    (selectedDetail || selectedRow)?.status === "read"
                  }
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
                  disabled={
                    updateStatusMutation.isPending ||
                    (selectedDetail || selectedRow)?.status === "replied"
                  }
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

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this contact message. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
