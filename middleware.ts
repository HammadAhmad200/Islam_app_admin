import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { normalizeRole, roleAllowedPaths, type AdminRole } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Check if the path is the login page
  const isLoginPage = pathname === "/login";
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"; // Ensure correct redirect

  // Get the session token
  const token = await getToken({ req: request });
  console.log("token", token);
  console.log("isLoginPage", isLoginPage);
  console.log("callbackUrl", callbackUrl);
  // console.log("pathname", pathname);
  // console.log("searchParams", searchParams);
  // console.log("request.url", request.url);
  // console.log("request", request);
  // console.log("request.nextUrl", request.nextUrl);
  console.log("request.nextUrl.pathname", request.nextUrl.pathname);
  // If there's no token and the path is not the login page, redirect to login
  if (!token && !isLoginPage) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // If there's a token and the path is the login page, redirect to dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL(callbackUrl, request.url)); // Redirect correctly
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
