const prisma = require("../config/prisma");

/**
 * Kategori Repository
 * Menggunakan Prisma ORM untuk database operations
 */
class KategoriRepository {
  /**
   * Mengambil semua kategori
   */
  async findAll() {
    return await prisma.kategoriBarang.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        _count: {
          select: { barangs: true },
        },
      },
    });
  }

  /**
   * Mengambil kategori yang aktif saja
   */
  async findAllActive() {
    return await prisma.kategoriBarang.findMany({
      where: { status: true },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Mencari kategori berdasarkan ID
   */
  async findById(id) {
    return await prisma.kategoriBarang.findUnique({
      where: { id: parseInt(id) },
      include: {
        barangs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Membuat kategori baru
   */
  async create(kategoriData) {
    return await prisma.kategoriBarang.create({
      data: {
        name: kategoriData.name,
        status: kategoriData.status ?? true,
      },
    });
  }

  /**
   * Update status kategori
   */
  async updateStatus(id, status) {
    return await prisma.kategoriBarang.update({
      where: { id: parseInt(id) },
      data: { status },
    });
  }

  /**
   * Delete kategori
   */
  async delete(id) {
    try {
      await prisma.kategoriBarang.delete({
        where: { id: parseInt(id) },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new KategoriRepository();
