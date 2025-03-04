import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Define schema for incoming request body
const reorderSchema = z.array(
  z.object({
    id: z.string(),
    order: z.number(),
  })
);

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const page = await db.page.findUnique({
      where: { userId: session.user.id },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    // Parse and validate request body
    const json = await req.json();
    const links = reorderSchema.parse(json);

    // Update each link's order in the database
    await db.$transaction(
      links.map((link) =>
        db.link.update({
          where: { id: link.id, pageId: page.id },
          data: { order: link.order },
        })
      )
    );

    return NextResponse.json({ message: "Links reordered successfully" });
  } catch (error) {
    console.error("Error reordering links:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
