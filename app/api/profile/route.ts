import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { SocialLink } from "@prisma/client";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { displayName, bio, socialLinks } = await req.json();

    // Update user profile
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        displayName,
        bio,
        socialLinks: {
          deleteMany: {}, // Remove all existing links
          createMany: {
            data: socialLinks.map((link: SocialLink) => ({
              platform: link.platform,
              url: link.url,
              userId: session.user.id,
            })),
          },
        },
      },
      include: {
        socialLinks: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
