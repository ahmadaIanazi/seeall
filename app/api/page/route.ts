import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create page with default controls
    const page = await db.page.create({
      data: {
        userId: session.user.id,
        controls: {
          create: {
            alignment: "center",
          },
        },
        stats: {
          create: {},
        },
      },
      include: {
        controls: true,
        stats: true,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Failed to create page:", error);
    return new NextResponse(error instanceof Error ? error.message : "Internal Server Error", { status: 500 });
  }
}
