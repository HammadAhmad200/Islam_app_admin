import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

export type UserProfile = {};

export interface User {
  role: string;
  isEmailVerified: boolean;
  profilePicture: string;
  name: string;
  email: string;
  id: string;
}

export interface AuthTokens {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}

interface Settings {
  activeSubscription: boolean;
  ads: boolean;
  emergencyDonation: boolean;
}

export interface SessionUser {
  user: User;
  tokens: AuthTokens;
  settings: Settings;
  //   userProfile: UserProfile | null;
}

// Role-based access utilities
export type AdminRole = "superAdmin" | "simpleAdmin" | "imamAdmin";

export function normalizeRole(role?: string): AdminRole | undefined {
  if (!role) return undefined;
  const key = role
  if (key === "superAdmin" || key === "simpleAdmin" || key === "imamAdmin") {
    return key as AdminRole;
  }
  return undefined;
}

export function isSuperAdmin(role?: string) {
  return normalizeRole(role) === "superAdmin";
}

export function isSimpleAdmin(role?: string) {
  return normalizeRole(role) === "simpleAdmin";
}

export function isImamAdmin(role?: string) {
  console.log("rolscdasde",normalizeRole(role))
  return normalizeRole(role) === "imamAdmin";
}

// Define route permissions per role
export const roleAllowedPaths: Record<AdminRole, (pathname: string) => boolean> = {
  superAdmin: () => true,
  simpleAdmin: (pathname: string) => {
    // Simple Admin cannot access users management or donations
    if (pathname.startsWith("/users")) return false;
    if (pathname.startsWith("/donations")) return false;
    return true;
  },
  imamAdmin: (pathname: string) => {
    // Imam can view notifications and imam queries
    if (pathname === "/" || pathname === "") return false;
    if (pathname.startsWith("/notifications")) return true;
    if (pathname.startsWith("/imam-queries")) return true;
    return false;
  },
};

// Function to refresh the access token
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-tokens`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: token.tokens.refresh.token,
        }),
      }
    );

    const refreshedTokens = await response.json();

    if (!response.ok) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    return {
      ...token,
      tokens: refreshedTokens.tokens,
      error: undefined,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(
             `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          return {
            user: data.user,
            tokens: data.tokens,
            settings: data.settings, // Include settings in user object
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in, store the user data in token
      if (user) {
        return {
          ...token,
          user: user.user,
          tokens: user.tokens,
          settings: user.settings, // Store settings in the token
        };
      }

      // Return previous token if access token is still valid
      const currentTime = Math.floor(Date.now() / 1000);
      const accessTokenExpiry =
        new Date(token.tokens.access.expires).getTime() / 1000;

      if (accessTokenExpiry > currentTime) {
        return token;
      }

      // Refresh access token if expired
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = token.user as User;
      session.tokens = token.tokens as AuthTokens;
      session.settings = token.settings as Settings; // Include settings in session
      session.error = token.error;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
