import { db } from "../db";

export async function getPageByUsername(username: string) {
  try {
    return await db.user.findUnique({
      where: { username },
      include: {
        page: {
          include: {
            socialLinks: true,
            links: { orderBy: { order: "asc" } },
            stats: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("❌ Failed to fetch page:", error);
    return null;
  }
}
