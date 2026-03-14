import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Masjid } from "@/lib/api-types";
import { useSession } from "next-auth/react";

export function useMasjids() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: session } = useSession();
  const hasToken = !!session?.tokens?.access?.token;

  // const { data: session, update } = useSession();
  const donationQuery = useQuery({
    queryKey: ["masjids"],
    queryFn: api.getMasjids,
    enabled: hasToken,
  });

  const updateMasjidMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateMasjid(id, data),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["masjid"] });
      toast({
        title: "Success",
        description: "Masjid updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update Masjid",
        variant: "destructive",
      });
    },
  });

  const deleteMasjidMutation = useMutation({
    mutationFn: (id: string) => api.deleteMasjid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["masjids"] });
      toast({
        title: "Success",
        description: "Masjid deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete Masjid",
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
    masjids: donationQuery.data?.data,
    isLoading: donationQuery.isLoading,
    isError: donationQuery.isError,
    error: donationQuery.error,

    updateMasjid: updateMasjidMutation.mutate,
    isUpdating: updateMasjidMutation.isPending,
    deleteMasjid: deleteMasjidMutation.mutateAsync,
    isDeleting: deleteMasjidMutation.isPending,
  };
}

export function useMasjid(id: string) {
  // const { toast } = useToast();
  const { data: session } = useSession();
  const hasToken = !!session?.tokens?.access?.token;

  const masjidQuery = useQuery({
    queryKey: ["masjids", id],
    queryFn: () => api.getMasjidById(id),
    enabled: !!id && hasToken,
  });

  return {
    masjid: masjidQuery.data?.data as Masjid,
    isLoading: masjidQuery.isLoading,
    isError: masjidQuery.isError,
    error: masjidQuery.error,
  };
}
