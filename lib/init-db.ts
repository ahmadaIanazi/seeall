import { db } from "./db";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// ✅ Step 1: Extract table names from Prisma schema
function getTablesFromSchema(): string[] {
  const schemaPath = path.resolve("prisma/schema.prisma");

  if (!fs.existsSync(schemaPath)) {
    console.error("❌ Prisma schema file not found!");
    return [];
  }

  const schema = fs.readFileSync(schemaPath, "utf-8");
  const modelMatches = schema.match(/model (\w+) {/g);
  return modelMatches ? modelMatches.map((match) => match.replace("model ", "").replace(" {", "")) : [];
}

// ✅ Step 2: Get existing tables in the database
async function getExistingTables(): Promise<string[]> {
  try {
    const result: { tablename: string }[] = await db.$queryRaw`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;
    return result.map((row) => row.tablename);
  } catch (error) {
    console.error("❌ Failed to fetch existing tables:", error);
    return [];
  }
}

// ✅ Step 3: Drop outdated tables that don't match the schema
async function dropOutdatedTables(schemaTables: string[], existingTables: string[]) {
  const tablesToDrop = existingTables.filter((table) => !schemaTables.includes(table));

  if (tablesToDrop.length === 0) {
    console.log("✅ No outdated tables found.");
    return;
  }

  console.log(`⚠️ Dropping outdated tables: ${tablesToDrop.join(", ")}`);

  for (const table of tablesToDrop) {
    try {
      await db.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table}" CASCADE`);
      console.log(`🗑️ Dropped table: ${table}`);
    } catch (error) {
      console.error(`❌ Failed to drop table ${table}:`, error);
    }
  }
}

// ✅ Step 4: Check if Prisma migrations exist
function hasMigrations(): boolean {
  const migrationsPath = path.resolve("prisma/migrations");
  return fs.existsSync(migrationsPath) && fs.readdirSync(migrationsPath).length > 0;
}

// ✅ Step 5: Check if the database contains any tables
async function isDatabaseEmpty(): Promise<boolean> {
  const existingTables = await getExistingTables();
  return existingTables.length === 0;
}

// ✅ Step 6: Initialize the database
export async function initDatabase() {
  try {
    console.log("🔍 Checking database schema...");

    const schemaTables = getTablesFromSchema();
    const existingTables = await getExistingTables();

    if (schemaTables.length === 0) {
      console.error("❌ No tables found in the Prisma schema!");
      return;
    }

    await dropOutdatedTables(schemaTables, existingTables);

    console.log("🔄 Ensuring database is up to date...");

    const migrationsExist = hasMigrations();
    const dbIsEmpty = await isDatabaseEmpty();

    try {
      if (!migrationsExist && !dbIsEmpty) {
        console.warn("⚠️ No Prisma migrations found, but the database is NOT empty.");
        console.log("⚠️ Running `prisma migrate dev --name init` to initialize migrations...");

        execSync("pnpm prisma migrate dev --name init", { stdio: "inherit" });
      } else {
        console.log("🚀 Running Prisma Migrate Deploy...");
        execSync("pnpm prisma migrate deploy", { stdio: "inherit" });
      }
    } catch (error) {
      console.warn("⚠️ Migration error detected. Attempting `prisma db push` instead...");
      execSync("pnpm prisma db push", { stdio: "inherit" });
    }

    // 🌟 Reset if needed (only in development mode)
    if (process.env.NODE_ENV !== "production") {
      console.log("⚠️ Resetting database in development mode...");
      execSync("pnpm prisma migrate reset --force", { stdio: "inherit" });
    }

    console.log("🔄 Running Prisma DB push...");
    execSync("pnpm prisma db push", { stdio: "inherit" });

    console.log("🔧 Generating Prisma Client...");
    execSync("pnpm prisma generate", { stdio: "inherit" });

    console.log("✅ Database is fully initialized!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}
