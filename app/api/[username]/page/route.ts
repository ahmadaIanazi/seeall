// app/api/[username]/page/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const page = await db.page.findUnique({
      where: { userId: params.userId },
      include: {
        links: { orderBy: { order: "asc" } },
        socialLinks: true,
        stats: true,
      },
    });
    if (!page) return new NextResponse("Page not found", { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    console.log("X Error getting Page - Internal Server Error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
