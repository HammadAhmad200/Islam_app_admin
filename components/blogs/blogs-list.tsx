"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, MoreHorizontal, Search, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Sample blog data
const blogs = [
  {
    id: "1",
    caption: "The Importance of Daily Prayer",
    image: "/placeholder.svg",
    date: "2023-05-15",
    status: "Published",
  },
  {
    id: "2",
    caption: "Ramadan Preparation Guide",
    image: "/placeholder.svg",
    date: "2023-06-20",
    status: "Published",
  },
  {
    id: "3",
    caption: "Understanding Zakat",
    image: "/placeholder.svg",
    date: "2023-07-05",
    status: "Draft",
  },
  {
    id: "4",
    caption: "Hajj Journey: What to Expect",
    image: "/placeholder.svg",
    date: "2023-08-10",
    status: "Published",
  },
  {
    id: "5",
    caption: "Islamic New Year Celebrations",
    image: "/placeholder.svg",
    date: "2023-09-15",
    status: "Draft",
  },
]

export function BlogsList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBlogs = blogs.filter((blog) => blog.caption.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Card>
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search blogs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          Filter
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Caption</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBlogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Image
                    src={blog.image || "/placeholder.svg"}
                    alt={blog.caption}
                    width={64}
                    height={64}
                    className="rounded-md object-cover aspect-square"
                  />
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">{blog.caption}</TableCell>
                <TableCell className="hidden md:table-cell">{blog.date}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      blog.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {blog.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/blogs/${blog.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-3 sm:py-4 px-3 sm:px-4">
        <Button variant="outline" size="sm">
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </Card>
  )
}

