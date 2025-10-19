const { PrismaClient } = require("@prisma/client");

/**
 * PrismaClient Singleton Instance
 * Best practice sesuai dokumentasi: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client
 *
 * - Hanya satu instance PrismaClient untuk seluruh aplikasi
 * - Mencegah exhausted database connections
 * - Connection pooling otomatis dihandle Prisma
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });
};

// Global variable untuk menyimpan instance di development (hot reload)
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown - disconnect saat aplikasi ditutup
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

// Event listener untuk koneksi
prisma
  .$connect()
  .then(() => {
    console.log("✓ Prisma Client connected to database");
  })
  .catch((error) => {
    console.error("✗ Prisma Client connection error:", error);
    process.exit(1);
  });

module.exports = prisma;
