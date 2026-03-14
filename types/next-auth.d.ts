import { type User, type AuthTokens } from "@/lib/auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
    tokens: AuthTokens;
    settings: {
      activeSubscription: boolean;
      ads: boolean;
      emergencyDonation: boolean;
    };
    error?: string;
  }

  interface User extends DefaultSession["user"] {
    id: string;
    role: string;
    isEmailVerified: boolean;
    profilePicture: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
    tokens: AuthTokens;
    settings: {
      activeSubscription: boolean;
      ads: boolean;
      emergencyDonation: boolean;
    };
    error?: string;
  }
}


