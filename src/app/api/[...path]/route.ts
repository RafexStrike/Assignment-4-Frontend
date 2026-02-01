// src/app/api/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://backend-three-liard-74.vercel.app";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const joinedPath = path?.join("/") || "";

  console.log(
    "[api/[...path]/route.ts] ENTER handler, method:",
    request.method,
    "path:",
    joinedPath
  );

  const backendUrl = `${BACKEND_URL}/api/${joinedPath}${request.nextUrl.search}`;

  console.log(
    "[api/[...path]/route.ts] BEFORE BACKEND CALL - url:",
    backendUrl
  );

  try {
    const headers = new Headers();

    // ✅ Forward cookies
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }

    // ✅ FORCE content-type for body parsing
    if (request.method !== "GET" && request.method !== "HEAD") {
      headers.set("Content-Type", "application/json");
    }

    // ✅ Correct origin
    headers.set(
      "Origin",
      "https://assignment-4-frontend-ten.vercel.app"
    );

    let body: BodyInit | undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      body = await request.text();
    }

    console.log("[api/[...path]/route.ts] BEFORE FETCH - sending request to backend");

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      credentials: "include",
      cache: "no-store",
    });

    console.log(
      "[api/[...path]/route.ts] AFTER FETCH - backend response status:",
      response.status
    );

    const data = await response.json();

    console.log(
      "[api/[...path]/route.ts] BEFORE RESPONSE - preparing response with status:",
      response.status
    );

    const res = NextResponse.json(data, {
      status: response.status,
    });

    // ✅ Forward Set-Cookie headers
    for (const cookie of response.headers.getSetCookie()) {
      res.headers.append("set-cookie", cookie);
    }

    console.log("[api/[...path]/route.ts] EXIT handler - success");
    return res;
  } catch (error: any) {
    console.error(
      "[api/[...path]/route.ts] PROXY ERROR:",
      error instanceof Error ? error.message : String(error)
    );

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
