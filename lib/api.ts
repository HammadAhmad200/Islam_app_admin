// import type { Blog, Donation, Masjid, User, SubscriptionPackage, UserSubscription } from "@/lib/api-types"

// // Mock data for blogs
// const blogsData: Blog[] = [
//   {
//     id: "1",
//     caption: "The Importance of Daily Prayer",
//     image: "/placeholder.svg",
//     date: "2023-05-15",
//     status: "Published",
//     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
//     externalLink: "https://example.com/prayer",
//   },
//   {
//     id: "2",
//     caption: "Ramadan Preparation Guide",
//     image: "/placeholder.svg",
//     date: "2023-06-20",
//     status: "Published",
//     content: "Preparing for Ramadan involves spiritual and physical readiness...",
//   },
//   {
//     id: "3",
//     caption: "Understanding Zakat",
//     image: "/placeholder.svg",
//     date: "2023-07-05",
//     status: "Draft",
//     content: "Zakat is one of the five pillars of Islam...",
//   },
//   {
//     id: "4",
//     caption: "Hajj Journey: What to Expect",
//     image: "/placeholder.svg",
//     date: "2023-08-10",
//     status: "Published",
//     content: "The pilgrimage to Mecca is a once-in-a-lifetime journey...",
//     mediaUrl: "hajj-guide.mp4",
//     mediaType: "video",
//   },
//   {
//     id: "5",
//     caption: "Islamic New Year Celebrations",
//     image: "/placeholder.svg",
//     date: "2023-09-15",
//     status: "Draft",
//     content: "The Islamic New Year marks the beginning of the Hijri calendar...",
//   },
// ]

// // Mock data for donations
// const donationsData: Donation[] = [
//   {
//     id: "1",
//     amount: 100,
//     donorName: "Ahmed Ali",
//     donorEmail: "ahmed@example.com",
//     date: "2023-10-15",
//     status: "Completed",
//     type: "Regular",
//     invoiceLink: "/invoices/1",
//   },
//   {
//     id: "2",
//     amount: 500,
//     donorName: "Fatima Khan",
//     donorEmail: "fatima@example.com",
//     date: "2023-10-10",
//     status: "Completed",
//     type: "Zakat",
//     invoiceLink: "/invoices/2",
//   },
//   {
//     id: "3",
//     amount: 1000,
//     donorName: "Mohammed Hassan",
//     donorEmail: "mohammed@example.com",
//     date: "2023-10-05",
//     status: "Completed",
//     type: "Emergency",
//     invoiceLink: "/invoices/3",
//   },
//   {
//     id: "4",
//     amount: 50,
//     donorName: "Aisha Malik",
//     donorEmail: "aisha@example.com",
//     date: "2023-09-28",
//     status: "Pending",
//     type: "Regular",
//     invoiceLink: "/invoices/4",
//   },
//   {
//     id: "5",
//     amount: 250,
//     donorName: "Omar Farooq",
//     donorEmail: "omar@example.com",
//     date: "2023-09-20",
//     status: "Failed",
//     type: "Regular",
//     invoiceLink: "/invoices/5",
//   },
// ]

// // Mock data for masjids
// const masjidsData: Masjid[] = [
//   {
//     id: "1",
//     name: "Al-Noor Masjid",
//     address: "123 Main St, City, Country",
//     prayerTimes: {
//       fajr: { azan: "05:30", iqama: "05:45" },
//       dhuhr: { azan: "12:30", iqama: "12:45" },
//       asr: { azan: "15:45", iqama: "16:00" },
//       maghrib: { azan: "18:15", iqama: "18:20" },
//       isha: { azan: "19:45", iqama: "20:00" },
//     },
//     jummahTimes: [
//       { id: "1", khutbah: "13:00", salah: "13:30" },
//       { id: "2", khutbah: "14:00", salah: "14:30" },
//     ],
//   },
//   {
//     id: "2",
//     name: "Islamic Center",
//     address: "456 Oak St, City, Country",
//     prayerTimes: {
//       fajr: { azan: "05:15", iqama: "05:30" },
//       dhuhr: { azan: "12:15", iqama: "12:30" },
//       asr: { azan: "15:30", iqama: "15:45" },
//       maghrib: { azan: "18:00", iqama: "18:05" },
//       isha: { azan: "19:30", iqama: "19:45" },
//     },
//     jummahTimes: [{ id: "1", khutbah: "13:15", salah: "13:45" }],
//   },
//   {
//     id: "3",
//     name: "Masjid Al-Rahman",
//     address: "789 Pine St, City, Country",
//     prayerTimes: {
//       fajr: { azan: "05:00", iqama: "05:15" },
//       dhuhr: { azan: "12:00", iqama: "12:15" },
//       asr: { azan: "15:15", iqama: "15:30" },
//       maghrib: { azan: "17:45", iqama: "17:50" },
//       isha: { azan: "19:15", iqama: "19:30" },
//     },
//     jummahTimes: [
//       { id: "1", khutbah: "12:45", salah: "13:15" },
//       { id: "2", khutbah: "13:45", salah: "14:15" },
//     ],
//   },
// ]

// // Mock data for users
// const usersData: User[] = [
//   {
//     id: "1",
//     name: "Admin User",
//     email: "admin@example.com",
//     role: "Admin",
//     status: "Active",
//     createdAt: "2023-01-15",
//     lastLogin: "2023-10-15",
//   },
//   {
//     id: "2",
//     name: "Editor User",
//     email: "editor@example.com",
//     role: "Editor",
//     status: "Active",
//     createdAt: "2023-02-20",
//     lastLogin: "2023-10-10",
//   },
//   {
//     id: "3",
//     name: "Regular User",
//     email: "user@example.com",
//     role: "User",
//     status: "Active",
//     createdAt: "2023-03-25",
//     lastLogin: "2023-10-05",
//   },
//   {
//     id: "4",
//     name: "Inactive User",
//     email: "inactive@example.com",
//     role: "User",
//     status: "Inactive",
//     createdAt: "2023-04-10",
//     lastLogin: "2023-08-15",
//   },
//   {
//     id: "5",
//     name: "Suspended User",
//     email: "suspended@example.com",
//     role: "User",
//     status: "Suspended",
//     createdAt: "2023-05-05",
//     lastLogin: "2023-07-20",
//   },
// ]

// // Mock data for subscription packages
// const subscriptionPackagesData: SubscriptionPackage[] = [
//   {
//     id: "1",
//     name: "Basic",
//     price: 9.99,
//     duration: "Monthly",
//     features: ["Access to basic content", "Email support"],
//     isActive: true,
//   },
//   {
//     id: "2",
//     name: "Standard",
//     price: 24.99,
//     duration: "Quarterly",
//     features: ["Access to all content", "Priority email support", "Monthly webinars"],
//     isActive: true,
//   },
//   {
//     id: "3",
//     name: "Premium",
//     price: 99.99,
//     duration: "Yearly",
//     features: ["Access to all content", "24/7 support", "Monthly webinars", "Exclusive events"],
//     isActive: true,
//   },
// ]

// // Mock data for user subscriptions
// const userSubscriptionsData: UserSubscription[] = [
//   {
//     id: "1",
//     userId: "3",
//     userName: "Regular User",
//     userEmail: "user@example.com",
//     packageId: "2",
//     packageName: "Standard",
//     startDate: "2023-07-01",
//     endDate: "2023-10-01",
//     status: "Expired",
//     autoRenew: false,
//   },
//   {
//     id: "2",
//     userId: "2",
//     userName: "Editor User",
//     userEmail: "editor@example.com",
//     packageId: "3",
//     packageName: "Premium",
//     startDate: "2023-01-01",
//     endDate: "2024-01-01",
//     status: "Active",
//     autoRenew: true,
//   },
//   {
//     id: "3",
//     userId: "4",
//     userName: "Inactive User",
//     userEmail: "inactive@example.com",
//     packageId: "1",
//     packageName: "Basic",
//     startDate: "2023-09-01",
//     endDate: "2023-10-01",
//     status: "Cancelled",
//     autoRenew: false,
//   },
// ]

// // API functions for blogs
// export async function getBlogs(): Promise<Blog[]> {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   return blogsData
// }

// export async function getBlogById(id: string): Promise<Blog | undefined> {
//   await new Promise((resolve) => setTimeout(resolve, 300))
//   return blogsData.find((blog) => blog.id === id)
// }

// export async function createBlog(blog: Omit<Blog, "id" | "date">): Promise<Blog> {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   const newBlog: Blog = {
//     id: Math.random().toString(36).substring(2, 9),
//     date: new Date().toISOString().split("T")[0],
//     ...blog,
//   }
//   return newBlog
// }

// export async function updateBlog(id: string, blog: Partial<Blog>): Promise<Blog> {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   const existingBlog = blogsData.find((b) => b.id === id)
//   if (!existingBlog) {
//     throw new Error("Blog not found")
//   }
//   const updatedBlog = { ...existingBlog, ...blog }
//   return updatedBlog
// }

// export async function deleteBlog(id: string): Promise<void> {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   // In a real app, this would delete from the database
// }

// // API functions for donations
// export async function getDonations(): Promise<Donation[]> {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   return donationsData
// }

// export async function getDonationById(id: string): Promise<Donation | undefined> {
//   await new Promise((resolve) => setTimeout(resolve, 300))
//   return donationsData.find((donation) => donation.id === id)
// }

// // API functions for masjids
// export async function getMasjids(): Promise<Masjid[]> {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   return masjidsData
// }

// export async function getMasjidById(id: string): Promise<Masjid | undefined> {
//   await new Promise((resolve) => setTimeout(resolve, 300))
//   return masjidsData.find((masjid) => masjid.id === id)
// }

// export async function createMasjid(masjid: Omit<Masjid, "id">): Promise<Masjid> {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   const newMasjid: Masjid = {
//     id: Math.random().toString(36).substring(2, 9),
//     ...masjid,
//   }
//   return newMasjid
// }

// export async function updateMasjid(id: string, masjid: Partial<Masjid>): Promise<Masjid> {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   const existingMasjid = masjidsData.find((m) => m.id === id)
//   if (!existingMasjid) {
//     throw new Error("Masjid not found")
//   }
//   const updatedMasjid = { ...existingMasjid, ...masjid }
//   return updatedMasjid
// }

// export async function deleteMasjid(id: string): Promise<void> {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   // In a real app, this would delete from the database
// }

// // API functions for users
// export async function getUsers(): Promise<User[]> {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   return usersData
// }

// export async function getUserById(id: string): Promise<User | undefined> {
//   await new Promise((resolve) => setTimeout(resolve, 300))
//   return usersData.find((user) => user.id === id)
// }

// export async function updateUser(id: string, user: Partial<User>): Promise<User> {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   const existingUser = usersData.find((u) => u.id === id)
//   if (!existingUser) {
//     throw new Error("User not found")
//   }
//   const updatedUser = { ...existingUser, ...user }
//   return updatedUser
// }

// // API functions for subscription packages
// export async function getSubscriptionPackages(): Promise<SubscriptionPackage[]> {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   return subscriptionPackagesData
// }

// export async function getUserSubscriptions(): Promise<UserSubscription[]> {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   return userSubscriptionsData
// }

import type { AuthTokens } from "@/lib/auth";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchPublic(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("ngrok-skip-browser-warning", "1");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    let errorData;
    try {
      errorData = text ? JSON.parse(text) : {};
    } catch (error) {
      errorData = { message: "Invalid JSON response" };
    }

    throw new Error(errorData.message || "API request failed");
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const session = await getSession();

  if (!session?.tokens) {
    throw new Error("No authentication token found");
  }

  const { tokens } = session as { tokens: AuthTokens };

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${tokens.access.token}`);
  headers.set("Content-Type", "application/json");
  headers.set("ngrok-skip-browser-warning", "1");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    // Try to parse the response, but handle empty responses gracefully
    const text = await response.text();
    let errorData;
    try {
      errorData = text ? JSON.parse(text) : {};
    } catch (error) {
      errorData = { message: "Invalid JSON response" };
    }

    throw new Error(errorData.message || "API request failed");
  }

  // Handle cases where there's no content (204 No Content)
  if (response.status === 204) {
    return null;
  }

  // Check if there's content before calling json()
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function fetchWithAuthFile(
  endpoint: string,
  options: RequestInit = {}
) {
  const session = await getSession();

  if (!session?.tokens) {
    throw new Error("No authentication token found");
  }

  const { tokens } = session as { tokens: AuthTokens };

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${tokens.access.token}`);
  headers.set("ngrok-skip-browser-warning", "1");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle different error status codes
    if (response.status === 401) {
      // Handle unauthorized - could trigger a refresh token flow
      throw new Error("Unauthorized");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return response.json();
}

export const api = {
  // Blogs
  getBlogs: async () => fetchPublic("/blogs"),
  getBlogById: async (id: string) => fetchPublic(`/blogs/${id}`),
  createBlog: async (data: any) =>
    fetchWithAuth("/blogs", { method: "POST", body: JSON.stringify(data) }),

  updateBlog: async (id: string, data: any) =>
    fetchWithAuth(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteBlog: async (id: string) =>
    fetchWithAuth(`/blogs/${id}`, { method: "DELETE" }),

  //Donations
  getDonations: async () => fetchWithAuth("/donations"),
  createDonation: async (data: any) =>
    fetchWithAuth("/donations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  createEmergencyDonation: async (data: any) =>
    fetchWithAuth("/donations/emergency", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getDonationById: async (id: string) => fetchWithAuth(`/donations/${id}`),
  toggleEmergencyDonation: async () =>
    fetchWithAuth("/settings/toggle-emergency-donation", { method: "POST" }),
  // Donation Types
  getDonationTypes: async () => fetchWithAuth("/donation-types"),
  createDonationType: async (data: any) =>
    fetchWithAuth("/donation-types", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateDonationType: async (id: string, data: any) =>
    fetchWithAuth(`/donation-types/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteDonationType: async (id: string) =>
    fetchWithAuth(`/donation-types/${id}`, { method: "DELETE" }),

  // masjids
  getMasjids: async () => fetchPublic("/masjid/timings"),
  getMasjidById: async (id: string) => fetchPublic(`/masjid/timings/${id}`),
  createMasjid: async (data: any) =>
    fetchWithAuth("/masjid/timings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateMasjid: async (id: string, data: any) =>
    fetchWithAuth(`/masjid/timings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteMasjid: async (id: string) =>
    fetchWithAuth(`/masjid/timings/${id}`, { method: "DELETE" }),

  // Users
  getUsers: async () => fetchWithAuth("/users"),
  getUserById: async (id: string) => fetchWithAuth(`/users/${id}`),
  updateUser: async (id: string, data: any) => {
    return fetchWithAuth(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  //subscription packages
  getSubscriptionPackages: async () => fetchWithAuth("/plans"),
  getUserSubscriptions: async () => fetchWithAuth("/plans/subscribers"),

  // uploads
  upload: (data: FormData) =>
    fetchWithAuthFile("/contents/upload", {
      method: "POST",
      body: data,
    }),

  dashboardAnalytics: () =>
    fetchWithAuth("/dashboard/analytics", { method: "GET" }),
  // notifications

  getNotifications: () =>
    fetchWithAuth("/pushNotifications", { method: "GET" }),

  saveNotification: (data: any) => {
    return fetchWithAuth("/pushNotifications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateNotification: (id: string, data: any) => {
    return fetchWithAuth(`/pushNotifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  sendNotification: (id: any) => {
    console.log(id);
    return fetchWithAuth(`/pushNotifications/${id}/send`, {
      method: "POST",
    });
  },
  deleteNotification: (id: any) => {
    return fetchWithAuth(`/pushNotifications/${id}`, {
      method: "DELETE",
    });
  },

  // Imam - Contacts
  getContacts: async () => fetchWithAuth("/contact", { method: "GET" }),

  // Generic function
  fetchWithAuth: (endpoint: any, options?: RequestInit) =>
    fetchWithAuth(endpoint, options),
};
