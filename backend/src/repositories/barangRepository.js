const prisma = require("../config/prisma");

/**
 * Barang Repository
 * Menggunakan Prisma ORM untuk database operations
 */
class BarangRepository {
  /**
   * Mengambil semua barang dengan relasi kategori
   */
  async findAll() {
    return await prisma.barang.findMany({
      include: {
        category: true,
        _count: {
          select: { claimRequests: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Mencari barang berdasarkan ID dengan relasi lengkap
   */
  async findById(id) {
    return await prisma.barang.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        claimRequests: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                nim: true,
                email: true,
                contact: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Membuat barang baru
   */
  async create(data) {
    return await prisma.barang.create({
      data: {
        name: data.name,
        description: data.description,
        categoryId: parseInt(data.category_id),
        foundDate: new Date(data.found_date),
        location: data.location,
        imageUrl: data.image_url,
        finderName: data.finder_name,
        finderNim: data.finder_nim,
        finderContact: data.finder_contact,
        finderPhotoUrl: data.finder_photo_url,
        status: "DITEMUKAN",
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Update barang (untuk claim)
   */
  async update(id, data) {
    return await prisma.barang.update({
      where: { id: parseInt(id) },
      data: {
        status: data.status || undefined,
        claimedDate: data.claimed_date
          ? new Date(data.claimed_date)
          : undefined,
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Delete barang
   */
  async delete(id) {
    try {
      await prisma.barang.delete({
        where: { id: parseInt(id) },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Mencari barang berdasarkan kategori
   */
  async findByCategory(categoryId) {
    return await prisma.barang.findMany({
      where: { categoryId: parseInt(categoryId) },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Mencari barang berdasarkan status
   */
  async findByStatus(status) {
    return await prisma.barang.findMany({
      where: { status },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Search barang berdasarkan keyword
   */
  async search(keyword) {
    return await prisma.barang.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
          { location: { contains: keyword, mode: "insensitive" } },
        ],
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = new BarangRepository();
