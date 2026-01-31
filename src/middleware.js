// src/middleware.js

import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Define protected routes (only protect routes that actually exist)
  const protectedRoutes = ["/tutor/"];
  const authRoutes = ["/login", "/register"];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

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

    if (!res.ok || res.status !== 200) {
      // Session is invalid or expired, redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const data = await res.json();

    console.log("Session data from middleware:", { pathname, data });

    // Check if user's role matches the route
    if (pathname.startsWith("/tutor/") && data.user?.role !== "TUTOR") {
      console.log("User is not a tutor, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If we can't check the session, redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/tutor/dashboard/:path*", "/admin/:path*"],
};

