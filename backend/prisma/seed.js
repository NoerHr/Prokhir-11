const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Seed Admin User
  const admin = await prisma.user.upsert({
    where: { nim: "ADMIN001" },
    update: {},
    create: {
      name: "Administrator",
      nim: "ADMIN001",
      email: "admin@lostandfound.com",
      password: "admin123", // ⚠️ PENTING: Gunakan hashed password di production!
      contact: "08123456789",
      role: "ADMIN",
    },
  });

  console.log("✓ Admin user created/updated:", {
    id: admin.id,
    name: admin.name,
    nim: admin.nim,
    email: admin.email,
    role: admin.role,
  });

  // Optional: Seed beberapa kategori default
  const categories = await prisma.kategoriBarang.createMany({
    data: [
      { name: "Elektronik" },
      { name: "Dokumen" },
      { name: "Aksesoris" },
      { name: "Pakaian" },
      { name: "Tas & Dompet" },
      { name: "Kunci" },
      { name: "Alat Tulis" },
      { name: "Lainnya" },
    ],
    skipDuplicates: true, // Skip jika sudah ada
  });

  console.log(`✓ ${categories.count} categories created`);

  // Optional: Seed user biasa untuk testing
  const testUser = await prisma.user.upsert({
    where: { nim: "USER001" },
    update: {},
    create: {
      name: "Test User",
      nim: "USER001",
      email: "user@test.com",
      password: "user123",
      contact: "08198765432",
      role: "USER",
    },
  });

  console.log("✓ Test user created/updated:", {
    id: testUser.id,
    name: testUser.name,
    nim: testUser.nim,
    role: testUser.role,
  });

  console.log("🎉 Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
