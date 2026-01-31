// src/app/api/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:5000";


async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const joinedPath = path?.join("/") || "";

  const backendUrl = `${BACKEND_URL}/api/${joinedPath}${request.nextUrl.search}`;

  try {
    const headers = new Headers(request.headers);
    headers.set("Origin", "http://localhost:3000");

    let body: BodyInit | undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      body = await request.text();
    }

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type");

    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const res = NextResponse.json(data, {
      status: response.status,
    });

    // Forward cookies
    for (const cookie of response.headers.getSetCookie()) {
      res.headers.append("set-cookie", cookie);
    }

    return res;
  } catch (error: any) {
    console.error("PROXY ERROR:", error);
    return NextResponse.json(
      { error: "Proxy failed", message: error.message },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
