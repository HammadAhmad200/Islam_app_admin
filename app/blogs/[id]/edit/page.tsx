import { BlogForm } from "@/components/blogs/blog-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function EditBlogPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Blog" description="Update an existing blog post." />
      <BlogForm id={params.id} />
    </DashboardShell>
  )
}

