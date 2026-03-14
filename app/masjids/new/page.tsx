"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const prayerTimeSchema = z.object({
  azanTime: z.string().regex(timePattern, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  iqamaTime: z.string().regex(timePattern, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
});

const jummahTimeSchema = z.object({
  id: z.string().optional(),
  khutbahTime: z.string().regex(timePattern, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  salahTime: z.string().regex(timePattern, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
});

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  prayerTimes: z.object({
    fajr: prayerTimeSchema,
    dhuhr: prayerTimeSchema,
    asr: prayerTimeSchema,
    maghrib: prayerTimeSchema,
    isha: prayerTimeSchema,
  }),
  jummahTimes: z.array(jummahTimeSchema).min(1, {
    message: "At least one Jummah time is required.",
  }),
});

export default function NewMasjidPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      prayerTimes: {
        fajr: { azanTime: "", iqamaTime: "" },
        dhuhr: { azanTime: "", iqamaTime: "" },
        asr: { azanTime: "", iqamaTime: "" },
        maghrib: { azanTime: "", iqamaTime: "" },
        isha: { azanTime: "", iqamaTime: "" },
      },
      jummahTimes: [{ khutbahTime: "", salahTime: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "jummahTimes",
  });

  const createMasjidMutation = useMutation({
    mutationFn: api.createMasjid,
    onSuccess: () => {
      toast({
        title: "Masjid created",
        description: "The masjid has been created successfully.",
      });
      router.push("/masjids");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error creating the masjid.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const finalData = {
      masjidName: values.name,
      address: values.address,
      fajr: values.prayerTimes.fajr,
      dhuhr: values.prayerTimes.dhuhr,
      asr: values.prayerTimes.asr,
      maghrib: values.prayerTimes.maghrib,
      isha: values.prayerTimes.isha,
      jummah: values.jummahTimes,
    };
    createMasjidMutation.mutate(finalData);
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Add New Masjid"
        description="Create a new masjid with prayer times."
      />
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 md:space-y-8"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Masjid Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter masjid name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter masjid address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Prayer Times</h3>
                <div className="grid gap-4 md:grid-cols-5">
                  {["fajr", "dhuhr", "asr", "maghrib", "isha"].map((prayer) => (
                    <div key={prayer} className="space-y-4">
                      <h4 className="font-medium capitalize">{prayer}</h4>
                      <FormField
                        control={form.control}
                        name={`prayerTimes.${
                          prayer as
                            | "fajr"
                            | "dhuhr"
                            | "asr"
                            | "maghrib"
                            | "isha"
                        }.azanTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Azan</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`prayerTimes.${
                          prayer as
                            | "fajr"
                            | "dhuhr"
                            | "asr"
                            | "maghrib"
                            | "isha"
                        }.iqamaTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Iqama</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Jummah Times</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ khutbahTime: "", salahTime: "" })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Jummah Time
                  </Button>
                </div>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-end gap-4 border p-4 rounded-md"
                    >
                      <FormField
                        control={form.control}
                        name={`jummahTimes.${index}.khutbahTime`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Khutbah Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`jummahTimes.${index}.salahTime`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Salah Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => fields.length > 1 && remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto order-1 sm:order-none"
                  onClick={() => router.push("/masjids")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={createMasjidMutation.isPending}
                >
                  {createMasjidMutation.isPending
                    ? "Creating..."
                    : "Create Masjid"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
