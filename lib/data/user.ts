import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function getUserByUsername(username: string) {
  try {
    return await db.user.findUnique({
      where: { username },
      include: {
        page: {
          include: {
            contents: { orderBy: { order: "asc" } },
          },
        },
      },
    });
  } catch (error) {
    console.error("❌ Failed to fetch user:", error);
    return null;
  }
}

export async function createUser({ username, password }: { username: string; password: string }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    return await db.$transaction(async (tx) => {
      // 1️⃣ Create the User
      const user = await tx.user.create({
        data: { username, password: hashedPassword },
      });

      // 2️⃣ Create the Page with Defaults
      await tx.page.create({
        data: {
          userId: user.id,
          pageName: username,
          createdAt: new Date(),
          updatedAt: new Date(),
          alignment: "center",
          backgroundColor: "#FFFFFF",
          brandColor: "#000000",
          font: "default",
          language: "en",
          multipleLanguage: false,
          live: true,
          showCategories: true,
          contents: { create: [] }, // Empty initially
        },
      });

      // 3️⃣ Return the Fully Loaded User with Page
      return tx.user.findUnique({
        where: { id: user.id },
        include: {
          page: {
            include: {
              contents: { orderBy: { order: "asc" } },
            },
          },
        },
      });
    });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    throw new Error("Failed to create user");
  }
}
