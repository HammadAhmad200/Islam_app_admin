import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useUploads() {
  const uploadMutation = useMutation({
    mutationFn: api.upload,
  });

  return {
    upload: uploadMutation.mutateAsync,
    isLoading: uploadMutation.isPending,
    isError: uploadMutation.isError,
    error: uploadMutation.error,
    data: uploadMutation.data,
  };
}
