"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@/hooks/use-users";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SettingsPage() {
  const { updateUser, isUpdating } = useUser();
  const { data: session } = useSession();

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Populate profile fields when session is available
  useEffect(() => {
    if (session) {
      resetProfile({
        name: session?.user?.name || "Admin User",
        email: session?.user?.email || "admin@example.com",
      });
    }
  }, [session?.user?.name, session?.user?.email]);

  // Handle Profile Update
  const onSubmitProfile = async (data: any) => {
    const { name, email } = data;
    await updateUser({ id: session?.user?.id, data: { name, email } });
  };

  // Handle Password Update
  const onSubmitPassword = async (data: any) => {
    const { currentPassword, newPassword } = data;
    await updateUser({
      id: session?.user?.id,
      data: { password: newPassword },
    });
  };

  return (
    <DashboardShell>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader
          title="Settings"
          description="Manage your account and application settings"
        />

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          {/* Profile Form */}
          <TabsContent value="account" className="space-y-4">
            <form onSubmit={handleProfileSubmit(onSubmitProfile)}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback>
                          {session?.user?.name?.charAt(0).toUpperCase() || "A"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          {...registerProfile("name")}
                          placeholder="Enter your name"
                        />
                        {profileErrors.name && (
                          <p className="text-red-500 text-sm">
                            {profileErrors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...registerProfile("email")}
                          placeholder="Enter your email"
                        />
                        {profileErrors.email && (
                          <p className="text-red-500 text-sm">
                            {profileErrors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          {/* Password Form */}
          <TabsContent value="password" className="space-y-4">
            <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...registerPassword("currentPassword")}
                      placeholder="Enter your current password"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-sm">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...registerPassword("newPassword")}
                        placeholder="Enter your new password"
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-red-500 text-sm">
                          {passwordErrors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...registerPassword("confirmPassword")}
                        placeholder="Confirm your new password"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {passwordErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
