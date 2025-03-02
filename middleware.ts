import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    // Handle database connection errors
    if (error.code?.startsWith("P")) {
      return new NextResponse(
        JSON.stringify({
          error: "Database error, please try again later",
        }),
        {
          status: 503,
          headers: { "content-type": "application/json" },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
