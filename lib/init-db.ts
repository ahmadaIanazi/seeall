import { PrismaClient } from "@prisma/client";
import { db } from "./db";

export async function initDatabase() {
  try {
    // Test the connection
    await db.$queryRaw`SELECT 1`;
    console.log("Database connection successful");

    // Run any pending migrations
    await db.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL,
      "username" TEXT NOT NULL,
      "displayName" TEXT,
      "bio" TEXT,
      "email" TEXT,
      "emailVerified" TIMESTAMP(3),
      "image" TEXT,
      "password" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    )`;

    await db.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username")`;
    await db.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`;

    // Create other tables
    await db.$executeRaw`CREATE TABLE IF NOT EXISTS "Link" (
      "id" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'link',
      "title" TEXT NOT NULL,
      "url" TEXT,
      "image" TEXT,
      "description" TEXT,
      "mapLocation" JSONB,
      "order" INTEGER NOT NULL DEFAULT 0,
      "userId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Link_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`;

    await db.$executeRaw`CREATE TABLE IF NOT EXISTS "SocialLink" (
      "id" TEXT NOT NULL,
      "platform" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "SocialLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`;

    console.log("Database initialization completed");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}
