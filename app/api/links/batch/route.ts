import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Link } from "@prisma/client";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { links } = await req.json();

    // Update all links in a transaction
    await db.$transaction(
      links.map((link: Link) =>
        db.link.upsert({
          where: { id: link.id },
          update: {
            title: link.title,
            url: link.url,
            type: link.type,
            image: link.image,
            description: link.description,
            mapLocation: link.mapLocation,
            order: link.order,
          },
          create: {
            ...link,
            userId: session.user.id,
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update links:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
