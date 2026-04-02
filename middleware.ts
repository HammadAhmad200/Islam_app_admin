import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { normalizeRole, roleAllowedPaths, type AdminRole } from "@/lib/auth";

/** Post-login redirect: same-origin path only; never API-style paths mistaken for Next routes. */
function sanitizeCallbackParam(raw: string | null, request: NextRequest): string {
  if (!raw || raw.trim() === "") return "/dashboard";
  try {
    if (raw.startsWith("/")) {
      if (raw.startsWith("/v1/") || raw.startsWith("/api")) return "/dashboard";
      return raw;
    }
    const u = new URL(raw);
    if (u.origin !== request.nextUrl.origin) return "/dashboard";
    const path = u.pathname + u.search;
    if (path.startsWith("/v1/") || path.startsWith("/api")) return "/dashboard";
    return path || "/dashboard";
  } catch {
    return "/dashboard";
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isLoginPage = pathname === "/login";
  const callbackUrl = sanitizeCallbackParam(searchParams.get("callbackUrl"), request);

  const token = await getToken({ req: request });

  if (!token && !isLoginPage) {
    const url = new URL("/login", request.url);
    const afterLogin = request.nextUrl.pathname + request.nextUrl.search;
    const safeReturn = sanitizeCallbackParam(afterLogin, request);
    url.searchParams.set("callbackUrl", safeReturn);
    return NextResponse.redirect(url);
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  // Role-based access control
  if (token) {
    console.log("token", token);
    const role = normalizeRole((token as any)?.user?.role) as AdminRole | undefined;
    const pathnameToCheck = pathname;

    if (role && roleAllowedPaths[role]) {
      const isAllowed = roleAllowedPaths[role](pathnameToCheck);
      if (!isAllowed) {
        // Redirect based on role default page
        const fallback = role === "imamAdmin" ? "/notifications" : "/dashboard";
        return NextResponse.redirect(new URL(fallback, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
