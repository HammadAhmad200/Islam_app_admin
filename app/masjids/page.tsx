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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Masjid } from "@/lib/api-types";
import { api } from "@/lib/api";
import {
  Clock,
  Edit,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { SetStateAction, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMasjids } from "@/hooks/use-masjids";

export default function MasjidsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null);
  const [timingsOpen, setTimingsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { masjids, isLoading, isError, error, deleteMasjid, isDeleting } =
    useMasjids();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this masjid?");
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await deleteMasjid(id);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMasjids =
    masjids?.filter(
      (masjid: Masjid) =>
        masjid.masjidName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        masjid.address.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Masjids"
        description="Manage masjids and prayer timings."
      >
        <Button asChild>
          <Link href="/masjids/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Masjid
          </Link>
        </Button>
      </DashboardHeader>

      <Card>
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search masjids..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">Loading masjids...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Error loading masjids
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Address
                  </TableHead>
                  <TableHead>Jummah</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMasjids.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No masjids found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMasjids.map((masjid: Masjid) => (
                    <TableRow key={masjid._id}>
                      <TableCell className="font-medium">
                        {masjid.masjidName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {masjid.address}
                      </TableCell>
                      <TableCell>
                        {masjid.jummah.length}{" "}
                        {masjid.jummah.length === 1 ? "time" : "times"}
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
                                setSelectedMasjid(masjid);
                                setTimingsOpen(true);
                              }}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              View Timings
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/masjids/${masjid._id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(masjid._id)}
                              disabled={isDeleting && deletingId === masjid._id}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {isDeleting && deletingId === masjid._id
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
            Showing <strong>{filteredMasjids.length}</strong> of{" "}
            <strong>{masjids?.length || 0}</strong> masjids
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filteredMasjids.length === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={filteredMasjids.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Prayer Timings Dialog */}
      <Dialog open={timingsOpen} onOpenChange={setTimingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedMasjid?.masjidName} Prayer Times</DialogTitle>
            <DialogDescription>
              Daily prayer times and Jummah schedule.
            </DialogDescription>
          </DialogHeader>
          {selectedMasjid && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Daily Prayers</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prayer</TableHead>
                        <TableHead>Azan</TableHead>
                        <TableHead>Iqama</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Fajr</TableCell>
                        <TableCell>{selectedMasjid.fajr.azanTime}</TableCell>
                        <TableCell>{selectedMasjid.fajr.iqamaTime}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dhuhr</TableCell>
                        <TableCell>{selectedMasjid.dhuhr.azanTime}</TableCell>
                        <TableCell>{selectedMasjid.dhuhr.iqamaTime}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Asr</TableCell>
                        <TableCell>{selectedMasjid.asr.azanTime}</TableCell>
                        <TableCell>{selectedMasjid.asr.iqamaTime}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Maghrib</TableCell>
                        <TableCell>{selectedMasjid.maghrib.azanTime}</TableCell>
                        <TableCell>
                          {selectedMasjid.maghrib.iqamaTime}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Isha</TableCell>
                        <TableCell>{selectedMasjid.isha.azanTime}</TableCell>
                        <TableCell>{selectedMasjid.isha.iqamaTime}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Jummah Times</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Khutbah</TableHead>
                        <TableHead>Salah</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedMasjid.jummah.map((jummah, index) => (
                        <TableRow key={jummah._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{jummah.khutbahTime}</TableCell>
                          <TableCell>{jummah.salahTime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
