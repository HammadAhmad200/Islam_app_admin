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

/** Backend API base (must be the Express server, not this Next.js app URL). */
function apiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/$/, "");
}

/** Headers for server-side calls to the API. Ngrok free tier often returns an HTML interstitial unless these are set. */
function authApiHeaders(): HeadersInit {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const base = apiBaseUrl();
  if (/ngrok/i.test(base)) {
    h["ngrok-skip-browser-warning"] = "69420";
    h["User-Agent"] =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  }
  return h;
}

// Function to refresh the access token
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(
      `${apiBaseUrl()}/auth/refresh-tokens`,
      {
        method: "POST",
        headers: authApiHeaders(),
        body: JSON.stringify({
          refreshToken: token.tokens.refresh.token,
        }),
      }
    );

    const raw = await response.text();
    let refreshedTokens: { tokens?: AuthTokens } & Partial<AuthTokens> = {};
    try {
      refreshedTokens = raw ? JSON.parse(raw) : {};
    } catch {
      refreshedTokens = {};
    }

    if (!response.ok) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    const nextTokens = refreshedTokens.tokens ?? (refreshedTokens as unknown as AuthTokens);
    return {
      ...token,
      tokens: nextTokens,
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
          const base = apiBaseUrl();
          if (!base) {
            console.error(
              "[next-auth] NEXT_PUBLIC_API_URL is missing. Set it to your backend base URL (e.g. http://localhost:5006/v1)."
            );
            return null;
          }

          const loginUrl = `${base}/auth/login`;
          const response = await fetch(loginUrl, {
            method: "POST",
            headers: authApiHeaders(),
            body: JSON.stringify({
              email: credentials.email.trim().toLowerCase(),
              password: credentials.password,
            }),
          });

          const raw = await response.text();
          const ct = response.headers.get("content-type") ?? "";
          const looksLikeJson =
            ct.includes("application/json") || raw.trimStart().startsWith("{");

          if (!response.ok) {
            if (process.env.NODE_ENV === "development") {
              console.error(
                "[next-auth] Login API error:",
                response.status,
                raw.slice(0, 400)
              );
            }
            return null;
          }

          if (!looksLikeJson) {
            console.error(
              "[next-auth] Login got HTML instead of JSON (your DB/users are unrelated to this).\n" +
                `  Request URL: ${loginUrl}\n` +
                "  Common fixes:\n" +
                "  • Point ngrok at your Express API port (e.g. ngrok http 5006), NOT the Next.js dev port (3000).\n" +
                "  • Or use NEXT_PUBLIC_API_URL=http://localhost:<API_PORT>/v1 when admin and API run on the same machine.\n" +
                "  • Ngrok free tier: HTML interstitial — headers to skip it are sent; if it persists, open the URL in a browser once or upgrade ngrok.\n" +
                `  Body start: ${raw.slice(0, 120).replace(/\s+/g, " ")}`
            );
            return null;
          }

          const data = JSON.parse(raw);

          return {
            user: data.user,
            tokens: data.tokens,
            settings: data.settings, // Include settings in user object
          };
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("[next-auth] Login request failed:", error);
          }
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
