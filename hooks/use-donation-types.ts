import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useDonationTypes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const donationTypesQuery = useQuery({
    queryKey: ["donation-types"],
    queryFn: api.getDonationTypes,
  });

  const createDonationTypeMutation = useMutation({
    mutationFn: api.createDonationType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donation-types"] });
      toast({
        title: "Success",
        description: "Donation type created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create donation type",
        variant: "destructive",
      });
    },
  });

  const updateDonationTypeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateDonationType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donation-types"] });
      toast({
        title: "Success",
        description: "Donation type updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update donation type",
        variant: "destructive",
      });
    },
  });

  const deleteDonationTypeMutation = useMutation({
    mutationFn: api.deleteDonationType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donation-types"] });
      toast({
        title: "Success",
        description: "Donation type deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete donation type",
        variant: "destructive",
      });
    },
  });

  return {
    donationTypes: Array.isArray(donationTypesQuery.data)
      ? donationTypesQuery.data
      : donationTypesQuery.data?.items || [],
    isLoading: donationTypesQuery.isLoading,
    isError: donationTypesQuery.isError,
    error: donationTypesQuery.error,
    refetch: donationTypesQuery.refetch,
    createDonationType: createDonationTypeMutation.mutateAsync,
    updateDonationType: updateDonationTypeMutation.mutateAsync,
    deleteDonationType: deleteDonationTypeMutation.mutateAsync,
    isCreating: createDonationTypeMutation.isPending,
    isUpdating: updateDonationTypeMutation.isPending,
    isDeleting: deleteDonationTypeMutation.isPending,
  };
}
