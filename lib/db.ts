import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __db_initialized: boolean;
}

export const db =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

/** RUN THIS ONLY WHEN YOU NEED in development mode.
 if (!globalThis.__db_initialized) {
   globalThis.__db_initialized = true;
   import("./init-db").then(({ initDatabase }) => initDatabase().catch(console.error)).catch(console.error);
 }
 */
