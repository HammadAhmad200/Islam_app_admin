import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Blog } from "@/lib/api-types";
import { useSession } from "next-auth/react";

export function useBlogs() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: session } = useSession();
  const hasToken = !!session?.tokens?.access?.token;

  const blogsQuery = useQuery({
    queryKey: ["blogs"],
    queryFn: api.getBlogs,
    enabled: hasToken,
  });

  const createBlogMutation = useMutation({
    mutationFn: api.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast({
        title: "Success",
        description: "Blog created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create Blog",
        variant: "destructive",
      });
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast({
        title: "Success",
        description: "Blog updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update Blog",
        variant: "destructive",
      });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: api.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete topic",
        variant: "destructive",
      });
    },
  });

  return {
    blogs: blogsQuery.data as Blog[],
    isLoading: blogsQuery.isLoading,
    isError: blogsQuery.isError,
    error: blogsQuery.error,
    createBlog: createBlogMutation.mutateAsync,
    updateBlog: updateBlogMutation.mutateAsync,
    deleteBlog: deleteBlogMutation.mutateAsync,
    isCreating: createBlogMutation.isPending,
    isUpdating: updateBlogMutation.isPending,
    isDeleting: deleteBlogMutation.isPending,
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
