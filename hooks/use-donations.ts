import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Blog } from "@/lib/api-types";
import { useSession } from "next-auth/react";

export function useDonations() {
  // const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: session } = useSession();
  const hasToken = !!session?.tokens?.access?.token;
  const donationQuery = useQuery({
    queryKey: ["donations"],
    queryFn: api.getDonations,
    enabled: hasToken,
  });

  const createDonationMutation = useMutation({
    mutationFn: (data: { amount: number; category: string; reason?: string }) =>
      api.createDonation(data),
    onSuccess: () => {
      donationQuery.refetch();
      toast({
        title: "Success",
        description: "Donation created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create donation",
        variant: "destructive",
      });
    },
  });

  const createEmergencyDonationMutation = useMutation({
    mutationFn: (data: { amount: number; reason?: string }) =>
      api.createEmergencyDonation(data),
    onSuccess: () => {
      donationQuery.refetch();
      toast({
        title: "Success",
        description: "Emergency donation created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create emergency donation",
        variant: "destructive",
      });
    },
  });

  const toggleEmergencyDonation = useMutation({
    mutationFn: api.toggleEmergencyDonation,
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Emergency Donation settings updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to update Emergency Donation settings",
        variant: "destructive",
      });
    },
  });
  return {
    donations: donationQuery.data?.donations,
    totalCount: donationQuery?.data?.total,
    settings: donationQuery?.data?.settings,
    isLoading: donationQuery.isLoading,
    isError: donationQuery.isError,
    error: donationQuery.error,
    refetch: donationQuery.refetch,
    createDonation: createDonationMutation.mutateAsync,
    createEmergencyDonation: createEmergencyDonationMutation.mutateAsync,
    isCreating: createDonationMutation.isPending,
    isCreatingEmergency: createEmergencyDonationMutation.isPending,
    toggleEmergencyDonation: toggleEmergencyDonation.mutateAsync,
    isUpdating: toggleEmergencyDonation.isPending,
  };
}

export function useBlog(id: string) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const hasToken = !!session?.tokens?.access?.token;

  const blogQuery = useQuery({
    queryKey: ["blogs", id],
    queryFn: () => api.getBlogById(id),
    enabled: !!id && hasToken,
  });

  return {
    blog: blogQuery.data,
    isLoading: blogQuery.isLoading,
    isError: blogQuery.isError,
    error: blogQuery.error,
  };
}
