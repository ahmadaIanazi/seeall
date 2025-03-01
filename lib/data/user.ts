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
    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        displayName: null,
        bio: null,
      },
      include: {
        socialLinks: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}
