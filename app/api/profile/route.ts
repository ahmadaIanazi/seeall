import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { displayName, bio, profileImage, alignment, socialLinks } = await req.json();

    // First update the user profile
    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        displayName: displayName || null,
        bio: bio || null,
        profileImage: profileImage || null,
        page: {
          upsert: {
            create: {
              controls: {
                create: {
                  alignment: alignment || "center",
                },
              },
              stats: {
                create: {},
              },
            },
            update: {
              controls: {
                upsert: {
                  create: {
                    alignment: alignment || "center",
                  },
                  update: {
                    alignment: alignment || "center",
                  },
                },
              },
            },
          },
        },
      },
      include: {
        page: {
          include: {
            controls: true,
          },
        },
        socialLinks: true,
      },
    });

    // Update social links if provided
    if (socialLinks) {
      await db.socialLink.deleteMany({
        where: { userId: session.user.id },
      });

      if (socialLinks.length > 0) {
        await db.socialLink.createMany({
          data: socialLinks.map((link: { platform: string; url: string }) => ({
            platform: link.platform,
            url: link.url,
            userId: session.user.id,
          })),
        });
      }
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return new NextResponse(error instanceof Error ? error.message : "Internal Server Error", { status: 500 });
  }
}
