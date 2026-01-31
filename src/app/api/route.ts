// src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:5000";

async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const awaitedParams = await params;
  const path = awaitedParams.path?.join("/") || "";
  
  // Maps frontend /api/auth/login -> backend /api/auth/login
  const backendUrl = `${BACKEND_URL}/api/${path}${request.nextUrl.search}`;
  
  try {
    const headers = new Headers(request.headers);
    headers.set("Origin", "http://localhost:3000");
    headers.set("Host", "localhost:5000");

    let body: any = undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      body = await request.text();
    }

    const response = await fetch(backendUrl, {
      method: request.method,
      headers: headers,
      body,
      cache: 'no-store'
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    const res = NextResponse.json(data, { status: response.status });
    
    // Pass the session cookies from Backend to Browser
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      res.headers.append("set-cookie", cookie);
    });

    return res;
  } catch (error: any) {
    console.error("PROXY ERROR:", error);
    return NextResponse.json({ error: "Proxy failed", message: error.message }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;