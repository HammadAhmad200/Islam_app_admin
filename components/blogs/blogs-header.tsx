import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export function BlogsHeader() {
  return (
    <DashboardHeader heading="Blogs" description="Manage your blog posts">
      <Button asChild>
        <Link href="/blogs/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Blog
        </Link>
      </Button>
    </DashboardHeader>
  )
}

