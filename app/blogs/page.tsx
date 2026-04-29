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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Blog } from "@/lib/api-types";
// import { getBlogs } from "@/lib/api";
import { Edit, MoreHorizontal, PlusCircle, Search, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBlogs } from "@/hooks/use-blogs";

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { blogs, isLoading, error, deleteBlog, isDeleting } = useBlogs();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this blog?");
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await deleteBlog(id);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBlogs =
    blogs?.filter((blog) => {
      const matchesSearch = blog.caption
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        blog.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    }) || [];

  return (
    <DashboardShell>
      <DashboardHeader heading="Blogs" description="Manage your blog posts">
        <Button asChild>
          <Link href="/blogs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Blog
          </Link>
        </Button>
      </DashboardHeader>

      <Card>
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search blogs..."
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
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">Loading blogs...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Error loading blogs
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Caption</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No blogs found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlogs.map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell>
                        <Image
                          src={blog.image || "/placeholder.svg"}
                          alt={blog.caption}
                          width={64}
                          height={64}
                          className="rounded-md object-cover aspect-square"
                        />
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {blog.caption}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(blog.createdAt).toDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            blog.status?.toLowerCase() === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {blog.status}
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
                            <DropdownMenuItem asChild>
                              <Link href={`/blogs/${blog._id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(blog._id)}
                              disabled={isDeleting && deletingId === blog._id}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {isDeleting && deletingId === blog._id
                                ? "Deleting..."
                                : "Delete"}
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
            Showing <strong>{filteredBlogs.length}</strong> of{" "}
            <strong>{blogs?.length || 0}</strong> blogs
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filteredBlogs.length === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={filteredBlogs.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </DashboardShell>
  );
}
