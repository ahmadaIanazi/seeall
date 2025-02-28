import { db } from "@/lib/db";

export async function getUserLinks(userId: string) {
  try {
    return await db.link.findMany({
      where: { userId },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching user links:", error);
    return [];
  }
}

export async function createLink({ title, url, userId }: { title: string; url: string; userId: string }) {
  try {
    // Get the current highest order
    const lastLink = await db.link.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
    });

    const order = lastLink ? lastLink.order + 1 : 0;

    return await db.link.create({
      data: {
        title,
        url,
        userId,
        order,
      },
    });
  } catch (error) {
    console.error("Error creating link:", error);
    throw new Error("Failed to create link");
  }
}

export async function deleteLink(id: string, userId: string) {
  return db.link.delete({
    where: { id, userId },
  });
}

export async function reorderLinks(links: { id: string; order: number }[]) {
  return db.$transaction(
    links.map((link) =>
      db.link.update({
        where: { id: link.id },
        data: { order: link.order },
      })
    )
  );
}
