import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const page = await db.page.findUnique({
      where: { userId: username },
      include: { links: { orderBy: { order: "asc" } } },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    return NextResponse.json(page.links);
  } catch (error) {
    console.error("Failed to fetch links:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
