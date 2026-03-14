"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import { isImamAdmin } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

interface ContactItem {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export default function ImamQueriesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const role = session?.user?.role;
    if (role && !isImamAdmin(role)) {
      router.replace("/dashboard");
      return;
    }
  }, [session?.user?.role, router]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await api.getContacts();
        if (!cancelled) setContacts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load contacts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardShell>
    <DashboardHeader
      heading="Imam Queries"
      description="View and manage imam queries."
    />
        <div className="space-y-4">
      <h1 className="text-xl font-semibold">Imam Queries</h1>
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-red-600">{error}</TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No queries found.</TableCell>
              </TableRow>
            ) : (
              contacts.map((c) => {
                const fullName = `${c.firstName} ${c.lastName}`.trim();
                const mailto = `mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent(
                  `Re: Your question`
                )}&body=${encodeURIComponent("Assalamu Alaikum,\n\n")} `;
                return (
                  <TableRow key={c._id}>
                    <TableCell className="whitespace-nowrap">{fullName}</TableCell>
                    <TableCell className="whitespace-nowrap">{c.email}</TableCell>
                    <TableCell className="max-w-[480px] truncate" title={c.message}>
                      {c.message}
                    </TableCell>
                    <TableCell className="capitalize">{c.status}</TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="icon" title="Reply via email">
                        <a href={mailto}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
    </DashboardShell>
    

  );
}


