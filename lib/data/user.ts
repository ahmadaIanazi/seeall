import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function getUserByUsername(username: string) {
  try {
    const user = await db.user.findUnique({
      where: { username },
      include: {
        links: {
          orderBy: { order: "asc" },
        },
        socialLinks: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function createUser({ username, password }: { username: string; password: string }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create user with page, controls, and stats in a transaction
    const user = await db.$transaction(async (tx) => {
      // 1. Create the user
      const user = await tx.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      // 2. Create the page with controls and stats
      await tx.page.create({
        data: {
          userId: user.id,
          controls: {
            create: {
              alignment: "center",
            },
          },
          stats: {
            create: {},
          },
        },
      });

      // 3. Return the complete user data
      return tx.user.findUnique({
        where: { id: user.id },
        include: {
          links: true,
          socialLinks: true,
        },
      });
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}
