import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Define the schema for the incoming request body
const reorderSchema = z.array(
  z.object({
    id: z.string(),
    order: z.number(),
  })
);

export async function PUT(req: NextRequest) {
  try {
    // Check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const json = await req.json();
    const links = reorderSchema.parse(json);

    // Update each link's order in the database
    const updatePromises = links.map((link) =>
      db.link.update({
        where: { id: link.id },
        data: { order: link.order },
      })
    );

    // Execute all update operations
    await Promise.all(updatePromises);

    return NextResponse.json({ message: "Links reordered successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    console.error("Error reordering links:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
