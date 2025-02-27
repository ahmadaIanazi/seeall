import { db } from "@/lib/db";

export async function getUserLinks(userId: string) {
  return db.link.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });
}

export async function createLink({ title, url, userId }: { title: string; url: string; userId: string }) {
  const lastLink = await db.link.findFirst({
    where: { userId },
    orderBy: { order: "desc" },
  });

  return db.link.create({
    data: {
      title,
      url,
      userId,
      order: lastLink ? lastLink.order + 1 : 0,
    },
  });
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
