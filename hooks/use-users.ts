"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Masjid } from "@/lib/api-types";
// import { signIn, useSession } from "next-auth/react";

export function useUser() {
  // const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateUser(id, data),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["masjid"] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update User",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  //   const toggleEmergencyDonation = useMutation({
  //     mutationFn: api.toggleEmergencyDonation,
  //     onSuccess: async () => {
  //       toast({
  //         title: "Success",
  //         description: "Emergency Donation settings updated successfully",
  //       });
  //       if (session) {
  //         console.log(session);
  //         await update({
  //           ...session,
  //           settings: {
  //             ...session.settings,
  //             emergencyDonation: !session.settings.emergencyDonation, // Toggle the value
  //           },
  //         });
  //       }
  //       await signIn("credentials", { redirect: false });
  //     },
  //     onError: (error: Error) => {
  //       toast({
  //         title: "Error",
  //         description:
  //           error.message || "Failed to update Emergency Donation settings",
  //         variant: "destructive",
  //       });
  //     },
  //   });
  return {
    updateUser: updateUserMutation.mutateAsync,
    isUpdating: updateUserMutation.isPending,
    deleteUser: deleteUserMutation.mutateAsync,
    isDeleting: deleteUserMutation.isPending,
  };
}
