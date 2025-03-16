import { db } from "@/lib/db";

export async function getPageByUsername(username: string) {
  try {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true }, // Fetch only the userId
    });

    if (!user) return null;

    return await db.page.findUnique({
      where: { userId: user.id },
      include: {
        contents: { orderBy: { order: "asc" } },
      },
    });
  } catch (error) {
    console.error("❌ Failed to fetch page:", error);
    return null;
  }
}

export async function getPageMetaByUsername(username: string) {
  try {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true }, // Fetch only the userId
    });

    if (!user) return null;

    const page = await db.page.findUnique({
      where: { userId: user.id },
      select: { pageName: true, bio: true }, // Fetch only the pageName
    });

    return page?.pageName || null;
  } catch (error) {
    console.error("❌ Failed to fetch page name:", error);
    return null;
  }
}
