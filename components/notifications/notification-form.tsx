"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNotification } from "@/hooks/use-notifications";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  announcementType: z.enum(["general", "community", "special"], {
    required_error: "Please select an announcement type",
  }),
  targetAudience: z.enum(["all", "premium", "individual", "family"], {
    required_error: "Please select a target audience",
  }),
});

export function NotificationForm() {
  const { toast } = useToast();
  const { saveNotification, sendNotification, isSending, isSaving } =
    useNotification();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      announcementType: "general",
      targetAudience: "all",
    },
  });

  async function handleSave(values: z.infer<typeof formSchema>) {
    try {
      await saveNotification({
        title: values.title,
        body: values.message,
        announcementType: values.announcementType,
        targetAudience: values.targetAudience,
      });
      toast({
        title: "Success",
        description: "Notification saved successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification",
        variant: "destructive",
      });
    }
  }

  async function handleSend(values: z.infer<typeof formSchema>) {
    try {
      const savedNotification = await saveNotification({
        title: values.title,
        body: values.message,
        announcementType: values.announcementType,
        targetAudience: values.targetAudience,
      });
      await sendNotification(savedNotification.id);
      toast({
        title: "Success",
        description: "Notification sent successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Notification</CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <Form {...form}>
          <form className="space-y-4 md:space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Notification title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter notification message"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="announcementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Announcement Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select announcement type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="special">Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="premium">Premium Users</SelectItem>
                        <SelectItem value="individual">
                          Individual Subscribers
                        </SelectItem>
                        <SelectItem value="family">
                          Family Subscribers
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={isSaving}
                onClick={form.handleSubmit(handleSave)}
              >
                Save for Later
              </Button>
              <Button
                type="button"
                disabled={isSending}
                className="w-full sm:w-auto"
                onClick={form.handleSubmit(handleSend)}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Now
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
