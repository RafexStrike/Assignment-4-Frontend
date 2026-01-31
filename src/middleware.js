// src/middleware.js

import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/tutor/dashboard", "/admin"];
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
        headers: { "Content-Type": "application/json" },
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

    // Check if user's role matches the route
    if (pathname.startsWith("/tutor/dashboard") && data.user?.role !== "TUTOR") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/admin") && data.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/dashboard") && data.user?.role !== "STUDENT") {
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

