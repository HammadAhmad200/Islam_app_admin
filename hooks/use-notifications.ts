import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export function useNotification() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const hasToken = !!session?.tokens?.access?.token;

  // Fetch all notifications (optional if needed)
  const notificationQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: api.getNotifications,
    enabled: hasToken,
  });

  // Save Notification API
  const saveNotification = useMutation({
    mutationFn: api.saveNotification,
    onSuccess: async (data) => {
      toast({
        title: "Success",
        description: "Notification saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      return data; // Returning the saved notification for further processing
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save notification",
        variant: "destructive",
      });
    },
  });

  const deleteNotification = useMutation({
    mutationFn: api.deleteNotification,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      });
      // queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete notification",
        variant: "destructive",
      });
    },
  });

  const updateNotification = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateNotification(id, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update notification",
        variant: "destructive",
      });
    },
  });

  // Send Notification API
  const sendNotification = useMutation({
    mutationFn: api.sendNotification,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification sent successfully",
      });
      // queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send notification",
        variant: "destructive",
      });
    },
  });

  return {
    notifications: notificationQuery.data,
    isLoading: notificationQuery.isLoading,
    isError: notificationQuery.isError,
    error: notificationQuery.error,
    refetch: notificationQuery.refetch,
    saveNotification: saveNotification.mutateAsync,
    updateNotification: updateNotification.mutateAsync,
    sendNotification: sendNotification.mutateAsync,
    isSaving: saveNotification.isPending,
    isUpdating: updateNotification.isPending,
    isDeleting: deleteNotification.isPending,
    deleteNotification: deleteNotification.mutateAsync,
    isSending: sendNotification.isPending,
  };
}
