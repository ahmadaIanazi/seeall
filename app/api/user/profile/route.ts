import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const socialLinkSchema = z.object({
  id: z.string(),
  platform: z.string(),
  url: z.string().url(),
});

const profileSchema = z.object({
  displayName: z.string().max(50).nullable(),
  bio: z.string().max(160).nullable(),
  socialLinks: z.array(socialLinkSchema),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const body = profileSchema.parse(json);

    await db.$transaction([
      // Update user profile
      db.user.update({
        where: { id: session.user.id },
        data: {
          displayName: body.displayName,
          bio: body.bio,
        },
      }),
      // Delete all existing social links
      db.socialLink.deleteMany({
        where: { userId: session.user.id },
      }),
      // Create new social links
      db.socialLink.createMany({
        data: body.socialLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
          userId: session.user.id,
        })),
      }),
    ]);

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
