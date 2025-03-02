import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema for link data
const linkSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  url: z.string().nullable(),
  image: z.string().nullable(),
  description: z.string().nullable(),
  mapLocation: z
    .object({
      address: z.string(),
    })
    .nullable(),
  order: z.number(),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const links = z.array(linkSchema).parse(json);

    // Update all links in a transaction
    await db.$transaction(
      links.map((link) =>
        db.link.upsert({
          where: { id: link.id },
          create: {
            ...link,
            userId: session.user.id,
          },
          update: {
            title: link.title,
            url: link.url,
            image: link.image,
            description: link.description,
            mapLocation: link.mapLocation,
            order: link.order,
            type: link.type,
          },
        })
      )
    );

    return NextResponse.json({ message: "Links updated successfully" });
  } catch (error) {
    console.error("Failed to update links:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
