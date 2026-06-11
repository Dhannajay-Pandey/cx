import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Shared secret — same value as in lib/auth.js
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
);

const AUTH_PAGES = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  // If the user has a session token, verify it
  if (token) {
    try {
      await jwtVerify(token, SECRET);

      // If token is valid and user is on an auth page, redirect to home
      if (AUTH_PAGES.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } catch {
      // Token is invalid/expired — clear it and continue
      const response = NextResponse.next();
      response.cookies.set("session", "", { maxAge: 0, path: "/" });

      // If accessing a protected page without valid session, redirect to login
      if (!AUTH_PAGES.includes(pathname) && pathname.startsWith("/auth") === false) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      return response;
    }
  }

  // No token — if accessing a protected page (non-auth, non-API), redirect to login
  // API routes are left unauthenticated here; each API route must check its own auth
  if (!AUTH_PAGES.includes(pathname) && pathname.startsWith("/auth") === false && pathname.startsWith("/api") === false) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
