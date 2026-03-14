"use client";

import { useState } from "react";
import { Bell, BookOpen, Check, Info, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type NotificationType = "message" | "system" | "content" | "user";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
  avatarFallback?: string;
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([
    // {
    //   id: "1",
    //   type: "content",
    //   title: "New Chapter Added",
    //   description: "A new chapter 'Introduction to Calculus' has been added",
    //   time: "2 min ago",
    //   read: false,
    //   avatar: "/placeholder.svg?height=32&width=32",
    //   avatarFallback: "A",
    // },
    // {
    //   id: "2",
    //   type: "message",
    //   title: "New Comment",
    //   description: "John Doe commented on 'Algebra Fundamentals'",
    //   time: "1 hour ago",
    //   read: false,
    //   avatar: "/placeholder.svg?height=32&width=32",
    //   avatarFallback: "JD",
    // },
    // {
    //   id: "3",
    //   type: "system",
    //   title: "System Update",
    //   description: "The system will undergo maintenance tonight",
    //   time: "5 hours ago",
    //   read: true,
    // },
    // {
    //   id: "4",
    //   type: "user",
    //   title: "New User Registered",
    //   description: "Jane Smith has registered as a new student",
    //   time: "1 day ago",
    //   read: true,
    //   avatar: "/placeholder.svg?height=32&width=32",
    //   avatarFallback: "JS",
    // },
    // {
    //   id: "5",
    //   type: "content",
    //   title: "Content Updated",
    //   description: "The 'Physics Mechanics' chapter has been updated",
    //   time: "2 days ago",
    //   read: true,
    // },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "system":
        return <Info className="h-4 w-4 text-amber-500" />;
      case "content":
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case "user":
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs font-normal"
              onClick={markAllAsRead}
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer",
                    !notification.read && "bg-muted/50"
                  )}
                >
                  {notification.avatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={notification.avatar} alt="" />
                      <AvatarFallback>
                        {notification.avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <a href="/notifications">View all notifications</a>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
