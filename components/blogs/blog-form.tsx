"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBlog, useBlogs } from "@/hooks/use-blogs";
import { useUploads } from "@/hooks/use-uploads";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, LinkIcon, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component
import { useRouter } from "next/navigation";

const formSchema = z.object({
  caption: z.string().min(5, {
    message: "Caption must be at least 5 characters.",
  }),
  image: z.instanceof(File).optional(),
  video: z.instanceof(File).optional(),
  audio: z.instanceof(File).optional(),
  externalLink: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  status: z.enum(["Draft", "Published"]),
});

interface BlogFormProps {
  id?: string;
}

export function BlogForm({ id }: BlogFormProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      externalLink: "",
      status: "Draft",
    },
  });

  const { blog, isLoading, error } = useBlog(id ? id : "");
  const { createBlog, updateBlog, isCreating, isUpdating } = useBlogs();
  const { upload, data, isLoading: isUploading } = useUploads();

  useEffect(() => {
    if (blog) {
      form.reset({
        caption: blog.caption,
        externalLink: blog.externalLink,
        status: blog.status,
      });

      // Set image preview if blog has an image
      if (blog.image) {
        setSelectedImage(blog.image);
      }

      // Set video and audio file names if they exist
      if (blog.video) {
        setSelectedVideo(blog.video);
      }
      if (blog.audio) {
        setSelectedAudio(blog.audio);
      }
    }
  }, [blog, form]);

  // Handler for image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // Handler for video upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("video", file);
      setSelectedVideo(file.name);
    }
  };

  // Handler for audio upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("audio", file);
      setSelectedAudio(file.name);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // This would submit to an API in a real application
    let urls = {
      image: null,
      video: null,
      audio: null,
    };

    if (values.image) {
      const imageFormData = new FormData();
      imageFormData.append("file", values.image);
      const { url } = await upload(imageFormData);
      if (url) {
        urls.image = url;
      }
    }
    if (values.video) {
      const videoFormData = new FormData();
      videoFormData.append("file", values.video);
      const { url } = await upload(videoFormData);
      if (url) {
        urls.video = url;
      }
    }
    if (values.audio) {
      const audioFormData = new FormData();
      audioFormData.append("file", values.audio);
      const { url } = await upload(audioFormData);
      if (url) {
        urls.audio = url;
      }
    }

    const payload = {
      caption: values.caption,
      image: urls.image,
      video: urls.video,
      audio: urls.audio,
      externalLink: values.externalLink,
      status: values.status,
    };

    if (id) {
      await updateBlog({ id, data: payload });
    } else {
      await createBlog(payload);
    }

    router.push("/blogs");

    // console.log({
    //   caption: values.caption,
    //   image: values.image,
    //   video: values.video,
    //   audio: values.audio,
    //   externalLink: values.externalLink,
    //   status: values.status,
    // });
    // alert("Blog saved successfully!");
  }

  // Skeleton Loader
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-4 sm:pt-6 space-y-6 md:space-y-8">
          {/* Caption Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Image Upload Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Video Upload Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Audio Upload Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* External Link Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Status Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Skeleton className="h-10 w-full sm:w-24" />
            <Skeleton className="h-10 w-full sm:w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-4 sm:pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-8"
          >
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter blog caption" {...field} />
                  </FormControl>
                  <FormDescription>
                    The main text content of your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Upload</FormLabel>
                  <FormControl>
                    <div className="grid gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                        >
                          <ImagePlus className="mr-2 h-4 w-4" />
                          Select Image
                        </Button>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        {selectedImage && (
                          <div className="relative h-20 w-20">
                            <Image
                              src={selectedImage || "/placeholder.svg"}
                              alt="Selected image"
                              fill
                              className="rounded-md object-cover"
                            />
                          </div>
                        )}
                      </div>
                      {selectedImage && (
                        <p className="text-sm text-muted-foreground">
                          Image selected. Click "Select Image" again to change.
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an image for your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Upload</FormLabel>
                  <FormControl>
                    <div className="grid gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() =>
                            document.getElementById("video-upload")?.click()
                          }
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Select Video
                        </Button>
                        <Input
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoUpload}
                        />
                        {selectedVideo && (
                          <span className="text-sm">{selectedVideo}</span>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a video file for your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio Upload</FormLabel>
                  <FormControl>
                    <div className="grid gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() =>
                            document.getElementById("audio-upload")?.click()
                          }
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Select Audio
                        </Button>
                        <Input
                          id="audio-upload"
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={handleAudioUpload}
                        />
                        {selectedAudio && (
                          <span className="text-sm">{selectedAudio}</span>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an audio file for your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="externalLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External Link (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="https://example.com" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Add an optional external link to your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select {...field} className="form-select">
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Set the status of your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  router.push("/blogs");
                }}
                className="w-full sm:w-auto order-1 sm:order-none"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {/* {id ? "Update Blog" : "Create Blog"} */}

                {isUpdating || isCreating || isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {id ? "updating..." : "creating..."}
                  </>
                ) : (
                  id ? "Update Blog" : "Create Blog"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
