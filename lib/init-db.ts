import { db } from "./db";

export async function initDatabase() {
  try {
    await db.$queryRaw`SELECT 1`;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "email" TEXT,
        "emailVerified" TIMESTAMP(3),
        "displayName" TEXT,
        "bio" TEXT,
        "profileImage" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `;
    await db.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username")
    `;
    await db.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email") WHERE "email" IS NOT NULL
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Page" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Page_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Page_userId_unique" UNIQUE ("userId"),
        CONSTRAINT "Page_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Controls" (
        "id" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "alignment" TEXT NOT NULL DEFAULT 'center',
        "brandColor" TEXT,
        "backgroundColor" TEXT,
        "footer" TEXT,
        "style" TEXT,
        "font" TEXT,
        "language" TEXT,
        "multipleLanguage" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Controls_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Controls_pageId_unique" UNIQUE ("pageId"),
        CONSTRAINT "Controls_pageId_fkey"
          FOREIGN KEY ("pageId") REFERENCES "Page"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Stats" (
        "id" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "visits" INTEGER NOT NULL DEFAULT 0,
        "clicks" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Stats_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Stats_pageId_unique" UNIQUE ("pageId"),
        CONSTRAINT "Stats_pageId_fkey"
          FOREIGN KEY ("pageId") REFERENCES "Page"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "image" TEXT,
        "icon" TEXT,
        "multiLanguage" JSONB,
        "parentCategoryId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Category_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Category_pageId_fkey"
          FOREIGN KEY ("pageId") REFERENCES "Page"("id")
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Category_parentCategoryId_fkey"
          FOREIGN KEY ("parentCategoryId") REFERENCES "Category"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;
    await db.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Category_pageId_index" ON "Category"("pageId")
    `;
    await db.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Category_parentCategoryId_index" ON "Category"("parentCategoryId")
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "categoryId" TEXT,
        "name" TEXT NOT NULL,
        "calories" INTEGER,
        "allergies" TEXT,
        "description" TEXT,
        "multiLanguage" JSONB,
        "price" DOUBLE PRECISION,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Product_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Product_pageId_fkey"
          FOREIGN KEY ("pageId") REFERENCES "Page"("id")
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Product_categoryId_fkey"
          FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;
    await db.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Product_pageId_index" ON "Product"("pageId")
    `;
    await db.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Product_categoryId_index" ON "Product"("categoryId")
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Form" (
        "id" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Form_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Form_pageId_fkey"
          FOREIGN KEY ("pageId") REFERENCES "Page"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;
    await db.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Form_pageId_index" ON "Form"("pageId")
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "FormField" (
        "id" TEXT NOT NULL,
        "formId" TEXT NOT NULL,
        "label" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "required" BOOLEAN NOT NULL DEFAULT false,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FormField_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "FormField_formId_fkey"
          FOREIGN KEY ("formId") REFERENCES "Form"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;
    await db.$executeRaw`
      CREATE INDEX IF NOT EXISTS "FormField_formId_index" ON "FormField"("formId")
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "FormSubmission" (
        "id" TEXT NOT NULL,
        "formId" TEXT NOT NULL,
        "data" JSONB NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "FormSubmission_formId_fkey"
          FOREIGN KEY ("formId") REFERENCES "Form"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;
    await db.$executeRaw`
      CREATE INDEX IF NOT EXISTS "FormSubmission_formId_index" ON "FormSubmission"("formId")
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Comment" (
        "id" TEXT NOT NULL,
        "pageId" TEXT,
        "productId" TEXT,
        "userId" TEXT,
        "content" TEXT NOT NULL,
        "rating" DOUBLE PRECISION,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Comment_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Comment_pageId_fkey"
          FOREIGN KEY ("pageId") REFERENCES "Page"("id")
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Comment_productId_fkey"
          FOREIGN KEY ("productId") REFERENCES "Product"("id")
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Comment_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;
    await db.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Comment_pageId_index" ON "Comment"("pageId")
    `;
    await db.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Comment_productId_index" ON "Comment"("productId")
    `;
    await db.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Comment_userId_index" ON "Comment"("userId")
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Link" (
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
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Link_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Link_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "SocialLink" (
        "id" TEXT NOT NULL,
        "platform" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "SocialLink_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;

    console.log("Database initialization completed");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}
