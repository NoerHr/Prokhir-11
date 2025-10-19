const prisma = require("../config/prisma");

/**
 * Claim Repository
 * Menggunakan Prisma ORM untuk database operations
 */
class ClaimRepository {
  /**
   * Mengambil semua claim requests dengan relasi
   */
  async findAll() {
    const claims = await prisma.claimRequest.findMany({
      include: {
        barang: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            nim: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to match existing format
    return claims.map((claim) => ({
      id: claim.id,
      itemId: claim.barangId,
      itemName: claim.barang.name,
      userId: claim.userId,
      userName: claim.user.name,
      userNim: claim.user.nim,
      alasan: claim.alasan,
      buktiUrl: claim.buktiUrl,
      status: claim.status,
      adminNote: claim.adminNote,
      createdAt: claim.createdAt,
      processedAt: claim.processedAt,
    }));
  }

  /**
   * Mencari claim berdasarkan ID
   */
  async findById(id) {
    const claim = await prisma.claimRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        barang: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            nim: true,
          },
        },
      },
    });

    if (!claim) return null;

    return {
      id: claim.id,
      itemId: claim.barangId,
      itemName: claim.barang.name,
      userId: claim.userId,
      userName: claim.user.name,
      userNim: claim.user.nim,
      alasan: claim.alasan,
      buktiUrl: claim.buktiUrl,
      status: claim.status,
      adminNote: claim.adminNote,
      createdAt: claim.createdAt,
      processedAt: claim.processedAt,
    };
  }

  /**
   * Mencari claims berdasarkan item ID
   */
  async findByItemId(itemId) {
    return await prisma.claimRequest.findMany({
      where: { barangId: parseInt(itemId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            nim: true,
          },
        },
      },
    });
  }

  /**
   * Mencari claims berdasarkan user ID
   */
  async findByUserId(userId) {
    const claims = await prisma.claimRequest.findMany({
      where: { userId: parseInt(userId) },
      include: {
        barang: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return claims.map((claim) => ({
      id: claim.id,
      itemId: claim.barangId,
      itemName: claim.barang.name,
      userId: claim.userId,
      alasan: claim.alasan,
      buktiUrl: claim.buktiUrl,
      status: claim.status,
      adminNote: claim.adminNote,
      createdAt: claim.createdAt,
      processedAt: claim.processedAt,
    }));
  }

  /**
   * Membuat claim request baru
   */
  async create(claimData) {
    const claim = await prisma.claimRequest.create({
      data: {
        barangId: parseInt(claimData.itemId),
        userId: parseInt(claimData.userId),
        alasan: claimData.alasan,
        buktiUrl: claimData.buktiUrl || null,
      },
    });

    return this.findById(claim.id);
  }

  /**
   * Update claim request (approve/reject)
   */
  async update(id, updateData) {
    await prisma.claimRequest.update({
      where: { id: parseInt(id) },
      data: {
        status: updateData.status || undefined,
        adminNote: updateData.adminNote || undefined,
        processedAt: updateData.processedAt
          ? new Date(updateData.processedAt)
          : undefined,
      },
    });

    return this.findById(id);
  }

  /**
   * Delete claim request
   */
  async delete(id) {
    try {
      await prisma.claimRequest.delete({
        where: { id: parseInt(id) },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new ClaimRepository();
