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
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import type { User } from "@/lib/api-types";
import { api } from "@/lib/api";
import { MoreHorizontal, Search, ShieldAlert, ShieldCheck, Trash, UserCog } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useUser } from "@/hooks/use-users";
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

const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.string().min(1, {
    message: "Role is required.",
  }),
  status: z.enum(["active", "inactive", "suspended"]),
});

type UserListResponse = {
  results: User[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

type ViewFilter = "all" | "blocked";
type PendingAction = "unblock" | "block" | "delete";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [actionUser, setActionUser] = useState<User | null>(null);

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery<UserListResponse>({
    queryKey: ["users", viewFilter, page, limit],
    queryFn: () =>
      viewFilter === "blocked"
        ? api.getBlockedUsers({ page, limit })
        : api.getUsers({ page, limit, sortBy: "createdAt:desc" }),
  });

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      status: "active",
    },
  });

  const { updateUser, isUpdating, deleteUser, isDeleting } = useUser();

  const rows = users?.results || [];
  const filteredUsers =
    rows.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole =
        roleFilter === "all" ||
        user.role.toLowerCase() === roleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    }) || [];

  function onEditUser(user: User) {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setEditDialogOpen(true);
  }

  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    if (!selectedUser?.id) return;
    updateUser({ id: selectedUser.id, data: { ...values } }).then(() => {
      setEditDialogOpen(false);
      refetch();
    });
  }

  function openConfirm(action: PendingAction, user: User) {
    setPendingAction(action);
    setActionUser(user);
    setConfirmOpen(true);
  }

  async function onConfirmAction() {
    if (!actionUser?.id || !pendingAction) return;

    if (pendingAction === "unblock") {
      await updateUser({ id: actionUser.id, data: { status: "active" } });
    } else if (pendingAction === "block") {
      await updateUser({ id: actionUser.id, data: { status: "suspended" } });
    } else if (pendingAction === "delete") {
      await deleteUser(actionUser.id);
    }

    setConfirmOpen(false);
    setActionUser(null);
    setPendingAction(null);
    refetch();
  }

  function actionTitle() {
    if (pendingAction === "unblock") return "Unblock user";
    if (pendingAction === "block") return "Block user";
    return "Delete user";
  }

  function actionDescription() {
    if (!actionUser) return "";
    if (pendingAction === "unblock") {
      return `This will set ${actionUser.name}'s status to active.`;
    }
    if (pendingAction === "block") {
      return `This will suspend ${actionUser.name}'s account.`;
    }
    return `This will permanently delete ${actionUser.name}. This action cannot be undone.`;
  }

  function actionButtonText() {
    if (pendingAction === "unblock") return "Unblock";
    if (pendingAction === "block") return "Block";
    return "Delete";
  }

  function formatDate(value?: string) {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Users"
        description="Manage user accounts and permissions."
      />

      <Card>
        <div className="px-3 pt-3 sm:px-4 sm:pt-4">
          <Tabs
            value={viewFilter}
            onValueChange={(v) => {
              setViewFilter(v as ViewFilter);
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="blocked">Blocked Users</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="simpleadmin">Simple Admin</SelectItem>
                <SelectItem value="imamadmin">Imam Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">Loading users...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Error loading users
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {viewFilter === "blocked"
                        ? "No blocked users found."
                        : "No users found. Try adjusting your search or filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell>
                        {user.status === "suspended" ? (
                          <Badge variant="destructive">Blocked</Badge>
                        ) : (
                          <Badge
                            variant={user.status === "active" ? "default" : "secondary"}
                          >
                            {user.status}
                          </Badge>
                        )}
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
                            <DropdownMenuItem onClick={() => onEditUser(user)}>
                              <UserCog className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            {user.status === "suspended" ? (
                              <DropdownMenuItem
                                onClick={() => openConfirm("unblock", user)}
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Unblock User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => openConfirm("block", user)}
                              >
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                Block User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => openConfirm("delete", user)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete User
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
            Showing <strong>{filteredUsers.length}</strong> of{" "}
            <strong>{users?.totalResults || 0}</strong> users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {users?.page || page} of {users?.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= (users?.totalPages || 1) || isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="superAdmin">Super Admin</SelectItem>
                        <SelectItem value="simpleAdmin">Simple Admin</SelectItem>
                        <SelectItem value="imamAdmin">Imam Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Controls what permissions the user has.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the user's account status.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>

                <Button type="submit">
                  {isUpdating ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionTitle()}</AlertDialogTitle>
            <AlertDialogDescription>{actionDescription()}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={pendingAction === "delete" ? "bg-destructive hover:bg-destructive/90" : ""}
              onClick={(e) => {
                e.preventDefault();
                onConfirmAction();
              }}
              disabled={isUpdating || isDeleting}
            >
              {isUpdating || isDeleting ? "Please wait..." : actionButtonText()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
