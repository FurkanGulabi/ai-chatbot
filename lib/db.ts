import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}?sslmode=require`;

// Configure connection pool
const pool = new Pool({
  connectionString,
  ssl: true,
  max: 2, // Reduce connection limit for serverless
});

const adapter = new PrismaNeon(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Add connection test
async function checkConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  checkConnection();
}
