import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// Initialize database tables
if (process.env.NODE_ENV === "production") {
  import("./init-db").then(({ initDatabase }) => {
    initDatabase().catch(console.error);
  });
}
