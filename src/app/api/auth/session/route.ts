// src/app/api/auth/session/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://backend-three-liard-74.vercel.app";

export async function GET(request: NextRequest) {
  console.log("[api/auth/session/route.ts] ENTER GET session handler");

  try {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    // Forward cookies from the incoming request to the backend
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      console.log("[api/auth/session/route.ts] BEFORE FETCH - forwarding cookies");
      headers.set("cookie", cookieHeader);
    }

    console.log("[api/auth/session/route.ts] BEFORE BACKEND CALL - fetching session from backend");

    // Forward the session request to the backend (better-auth uses /get-session)
    const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      method: "GET",
      headers: headers,
      credentials: "include",
    });

    console.log("[api/auth/session/route.ts] AFTER BACKEND CALL - backend response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data;

    // Only parse JSON if response has JSON content type
    if (contentType?.includes("application/json")) {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      } else {
        data = {};
      }
    } else {
      const text = await response.text();
      console.warn("[api/auth/session/route.ts] Session endpoint returned non-JSON response:", { status: response.status, contentType, text: text?.substring(0, 100) });
      data = {};
    }

    // Log the actual response for debugging
    console.log("[api/auth/session/route.ts] Session response from backend:", { status: response.status, hasUser: !!data.user });

    // If not ok status, return error
    if (!response.ok) {
      console.log("[api/auth/session/route.ts] Backend returned error status:", response.status);
      return NextResponse.json(
        data || { error: "Session check failed" },
        { status: response.status }
      );
    }

    const responseHeaders = new Headers();
    
    // Copy relevant headers from backend response
    const headersToProxy = [
      "content-type",
      "set-cookie",
      "cache-control",
      "expires",
    ];

    headersToProxy.forEach((header) => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    console.log("[api/auth/session/route.ts] EXIT GET - session check success");

    return NextResponse.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[api/auth/session/route.ts] Session check error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
