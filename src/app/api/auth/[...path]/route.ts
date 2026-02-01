// src/app/api/auth/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://backend-three-liard-74.vercel.app";

async function handler(request: NextRequest, { params }: any) {
  const resolvedParams = await params;
  const path = resolvedParams.path?.join("/") || "";

  console.log(
    "[api/auth/[...path]/route.ts] ENTER handler, method:",
    request.method,
    "path:",
    path
  );

  if (!path) {
    return NextResponse.json(
      { error: "Path not specified" },
      { status: 400 }
    );
  }

  const backendUrl = `${BACKEND_URL}/api/auth/${path}`;

  console.log(
    "[api/auth/[...path]/route.ts] BEFORE BACKEND CALL - url:",
    backendUrl
  );

  try {
    const headers = new Headers({
      "Content-Type": "application/json",
      "Origin": "https://assignment-4-frontend-ten.vercel.app",
    });

    // ✅ Forward cookies
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
      console.log("[api/auth/[...path]/route.ts] BEFORE FETCH - forwarding cookies");
    }

    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
      credentials: "include",
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      fetchOptions.body = await request.text();
    }

    console.log("[api/auth/[...path]/route.ts] BEFORE FETCH - sending request to backend");

    const response = await fetch(backendUrl, fetchOptions);

    console.log(
      "[api/auth/[...path]/route.ts] AFTER FETCH - backend response status:",
      response.status
    );

    const contentType = response.headers.get("content-type");
    const text = await response.text();

    const data =
      contentType?.includes("application/json") && text
        ? JSON.parse(text)
        : text;

    const responseHeaders = new Headers();

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

    console.log(
      "[api/auth/[...path]/route.ts] BEFORE RESPONSE - preparing response with status:",
      response.status
    );

    return NextResponse.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(
      "[api/auth/[...path]/route.ts] Auth proxy error:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
