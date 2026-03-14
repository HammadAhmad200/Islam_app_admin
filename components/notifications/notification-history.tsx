"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownUp, RefreshCw, Trash2 } from "lucide-react";
import { useNotification } from "@/hooks/use-notifications";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NotificationHistory() {
  const {
    notifications,
    isLoading,
    refetch,
    sendNotification,
    deleteNotification,
    updateNotification,
    isSending,
    isUpdating,
  } =
    useNotification();

  const [resendingId, setResendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editAnnouncementType, setEditAnnouncementType] = useState("general");
  const [editTargetAudience, setEditTargetAudience] = useState("all");

  const handleResend = async (id: string) => {
    setResendingId(id);
    try {
      await sendNotification(id);
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = async () => {
    if (confirmDeleteId) {
      await deleteNotification(confirmDeleteId);
      setConfirmDeleteId(null);
      refetch();
    }
  };

  const handleEdit = (notification: any) => {
    setEditId(notification.id || notification._id);
    setEditTitle(notification.title || "");
    setEditBody(notification.body || "");
    setEditAnnouncementType(notification.announcementType || "general");
    setEditTargetAudience(notification.targetAudience || "all");
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    await updateNotification({
      id: editId,
      data: {
        title: editTitle,
        body: editBody,
        announcementType: editAnnouncementType,
        targetAudience: editTargetAudience,
      },
    });
    setEditOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notification History</CardTitle>
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Announcement</TableHead>
                <TableHead className="hidden md:table-cell">Audience</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium flex items-center">
                    Date
                    <ArrowDownUp className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : notifications?.length ? (
                notifications.map((notification: any) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {notification.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-800">
                        {notification.announcementType || "general"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                        {notification.targetAudience || "all"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(notification.createdAt).toDateString()}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResend(notification.id)}
                        disabled={resendingId === notification.id || isSending}
                      >
                        {resendingId === notification.id ? "Sending..." : "Send"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(notification)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setConfirmDeleteId(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No notifications found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this notification?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <Textarea
              placeholder="Message"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            />
            <Select value={editAnnouncementType} onValueChange={setEditAnnouncementType}>
              <SelectTrigger>
                <SelectValue placeholder="Announcement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="special">Special</SelectItem>
              </SelectContent>
            </Select>
            <Select value={editTargetAudience} onValueChange={setEditTargetAudience}>
              <SelectTrigger>
                <SelectValue placeholder="Target audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="premium">Premium Users</SelectItem>
                <SelectItem value="individual">Individual Subscribers</SelectItem>
                <SelectItem value="family">Family Subscribers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
