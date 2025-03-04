import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation Schema
const profileSchema = z.object({
  displayName: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.string().url().optional(),
  alignment: z.string().optional(),
  socialLinks: z.array(z.object({ platform: z.string(), url: z.string().url() })).optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    try {
      const { displayName, bio, profileImage, alignment, socialLinks } = profileSchema.parse(json);

      // Dynamically build update object to exclude undefined values
      const userUpdateData: Record<string, any> = {};
      if (displayName !== undefined) userUpdateData.displayName = displayName;
      if (bio !== undefined) userUpdateData.bio = bio;
      if (profileImage !== undefined) userUpdateData.profileImage = profileImage;

      // Handle optional page controls update
      if (alignment !== undefined) {
        userUpdateData.page = {
          upsert: {
            create: {
              controls: { create: { alignment } },
              stats: { create: {} },
            },
            update: {
              controls: {
                upsert: {
                  create: { alignment },
                  update: { alignment },
                },
              },
            },
          },
        };
      }

      // ✅ Ensure we only update if there’s actual data
      if (Object.keys(userUpdateData).length > 0) {
        console.log("Updating user with data:", userUpdateData);

        const updatedUser = await db.user.update({
          where: { id: session.user.id },
          data: userUpdateData,
          include: {
            socialLinks: true,
            page: true, // ✅ Ensure this relation exists in Prisma schema
          },
        });

        return NextResponse.json(updatedUser);
      } else {
        console.warn("No updates detected for user.");
        return NextResponse.json({ message: "No changes detected." });
      }
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ message: "Validation failed", errors: validationError.errors }, { status: 400 });
      }
      throw validationError;
    }
  } catch (error) {
    console.error("Failed to update profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
