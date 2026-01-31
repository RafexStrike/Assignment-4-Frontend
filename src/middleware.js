// src/middleware.js

import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log("[middleware.js] ENTERED middleware, pathname:", pathname);

  // Define protected routes (only protect routes that actually exist)
  const protectedRoutes = ["/tutor/"];
  const authRoutes = ["/login", "/register"];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  console.log("[middleware.js] isProtectedRoute:", isProtectedRoute);

  if (!isProtectedRoute) {
    console.log("[middleware.js] Route is not protected, allowing next");
    return NextResponse.next();
  }

  console.log("[middleware.js] BEFORE AUTH CHECK - calling session API");

  try {
    // Check session by calling the Next.js API proxy
    const res = await fetch(
      `${request.nextUrl.origin}/api/auth/session`,
      {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          // Forward cookies from the incoming request
          "cookie": request.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );

    console.log("[middleware.js] AFTER AUTH CHECK - session API response status:", res.status);

    if (!res.ok || res.status !== 200) {
      // Session is invalid or expired, redirect to login
      console.log("[middleware.js] Session invalid, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const data = await res.json();

    console.log("[middleware.js] Session data from middleware:", { pathname, userRole: data.user?.role });

    // Check if user's role matches the route
    if (pathname.startsWith("/tutor/") && data.user?.role !== "TUTOR") {
      console.log("[middleware.js] User role mismatch - not a tutor, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("[middleware.js] AUTH SUCCESS - user role matches, proceeding");
    return NextResponse.next();
  } catch (error) {
    // If we can't check the session, redirect to login
    console.log("[middleware.js] AUTH ERROR:", error instanceof Error ? error.message : String(error));
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/tutor/dashboard/:path*", "/admin/:path*"],
};

