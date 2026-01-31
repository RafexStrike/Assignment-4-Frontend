// src/app/api/auth/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://backend-three-liard-74.vercel.app";

async function handler(request: NextRequest, { params }: any) {
  const resolvedParams = await params;
  const path = resolvedParams.path?.join("/") || "";

  if (!path) {
    return NextResponse.json(
      { error: "Path not specified" },
      { status: 400 }
    );
  }

  const backendUrl = `${BACKEND_URL}/api/auth/${path}`;
  const method = request.method;

  try {
    const headers = new Headers({
      "Content-Type": "application/json",
      "Origin": "https://assignment-4-frontend-ten.vercel.app",
    });

    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }

    let fetchOptions: RequestInit = {
      method: method,
      headers: headers,
      credentials: "include",
    };

    if (method !== "GET" && method !== "HEAD") {
      fetchOptions.body = await request.text();
    }

    const response = await fetch(backendUrl, fetchOptions);
    const contentType = response.headers.get("content-type");

    let data;
    if (contentType?.includes("application/json")) {
      try {
        const text = await response.text();
        if (text) {
          data = JSON.parse(text);
        } else {
          data = {};
        }
      } catch (parseErr) {
        console.error(`Failed to parse JSON response from ${backendUrl}:`, parseErr);
        data = {};
      }
    } else {
      data = await response.text();
    }

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

    return NextResponse.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Auth proxy error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export const POST = handler;
export const GET = handler;
